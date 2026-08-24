import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { COUNTRIES } from '../data/countries'
import { isPlayerId, sanitizeName } from './leaderboard'
import { isNameAllowed } from './nameFilter'
import type { DuelQuestionWire, DuelView } from './duelTypes'
import { answerKey } from './quizAnswers'
import {
  answerPauseMs,
  createMixedRound,
  getRegionPool,
  isQuizDifficulty,
  isQuizMode,
  isRegionFilter,
  isRoundSize,
  orderedModes,
  questionLimitMs,
  type QuizDifficulty,
  type QuizMode,
  type RegionFilter,
  type RoundSize,
} from './quiz'

export type { DuelQuestionWire, DuelView }

const REDIS_PREFIX = 'passport-duel:'
const FILE_NAME = 'duels.json'
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const ROOM_MS = 45 * 60 * 1000

function revealMs(room: DuelRoom, index = room.index): number {
  return Math.max(1200, answerPauseMs(questionModeOf(room, index)))
}

export interface DuelAnswer {
  iso: string | null
  timeMs: number
}

export interface DuelPlayer {
  id: string
  name: string
  answers: Array<DuelAnswer | null>
}

export interface DuelRoom {
  version: number
  code: string
  createdAt: number
  expiresAt: number
  host: DuelPlayer
  guest: DuelPlayer | null
  mode: QuizMode
  modes: QuizMode[]
  region: RegionFilter
  difficulty: QuizDifficulty
  roundSize: RoundSize
  questions: DuelQuestionWire[]
  index: number
  phase: 'waiting' | 'question' | 'reveal' | 'done'
  questionStartedAt: number
  playStartedAt: number
  playEndedAt: number
  revealUntil: number
  hostRematch: boolean
  guestRematch: boolean
}

export function normalizeCode(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const code = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  return code.length === 4 ? code : null
}

export function parsePlayerId(value: unknown): string | null {
  if (typeof value !== 'string') return null
  return isPlayerId(value) ? value : null
}

export async function createDuelRoom(input: {
  playerId: string
  name: string
  mode: QuizMode
  modes: QuizMode[]
  region: RegionFilter
  difficulty: QuizDifficulty
  roundSize: RoundSize
}): Promise<{ ok: true; room: DuelRoom } | { ok: false; error: 'offline' | 'empty' }> {
  const modes = orderedModes(input.modes.length > 0 ? input.modes : [input.mode])
  const questions = buildQuestions(modes, input.region, input.difficulty, input.roundSize)
  if (questions.length === 0) return { ok: false, error: 'empty' }
  const now = Date.now()
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = randomCode()
    const existing = await getRoom(code)
    if (existing && existing.expiresAt > now) continue
    const room: DuelRoom = {
      version: 1,
      code,
      createdAt: now,
      expiresAt: now + ROOM_MS,
      host: emptyPlayer(input.playerId, input.name, questions.length),
      guest: null,
      mode: modes[0] ?? input.mode,
      modes,
      region: input.region,
      difficulty: input.difficulty,
      roundSize: input.roundSize,
      questions,
      index: 0,
      phase: 'waiting',
      questionStartedAt: 0,
      playStartedAt: 0,
      playEndedAt: 0,
      revealUntil: 0,
      hostRematch: false,
      guestRematch: false,
    }
    await saveRoom(room)
    return { ok: true, room }
  }
  return { ok: false, error: 'offline' }
}

export async function joinDuelRoom(
  code: string,
  playerId: string,
  name: string,
): Promise<{ ok: true; room: DuelRoom } | { ok: false; error: 'missing' | 'full' | 'offline' }> {
  try {
    const room = await mutateRoom(code, (current) => {
      if (current.host.id === playerId) return current
      if (current.guest?.id === playerId) return current
      if (current.guest) return 'full'
      if (current.phase !== 'waiting') return 'full'
      const now = Date.now()
      current.guest = emptyPlayer(playerId, name, current.questions.length)
      current.phase = 'question'
      current.questionStartedAt = now
      current.playStartedAt = now
      current.playEndedAt = 0
      current.expiresAt = now + ROOM_MS
      return current
    })
    if (!room) return { ok: false, error: 'missing' }
    return { ok: true, room }
  } catch (error) {
    if (error instanceof DuelError && error.code === 'full') return { ok: false, error: 'full' }
    throw error
  }
}

export async function answerDuel(
  code: string,
  playerId: string,
  iso: string | null,
): Promise<DuelRoom | null> {
  try {
    return await mutateRoom(code, (current) => {
      const now = Date.now()
      const ticked = tickRoom(current, now)
      const player = playerOf(ticked, playerId)
      if (!player) return 'forbidden'
      const existing = player.answers[ticked.index]
      const question = ticked.questions[ticked.index]
      const mode = isQuizMode(question?.mode) ? question.mode : ticked.mode
      const pick = acceptDuelIso(iso, question?.optionIsos ?? [], mode)

      if (ticked.phase === 'question') {
        if (existing?.iso != null) return ticked
        player.answers[ticked.index] = {
          iso: pick,
          timeMs: Math.max(0, now - ticked.questionStartedAt),
        }
        if (bothAnswered(ticked)) {
          ticked.phase = 'reveal'
          ticked.revealUntil = now + revealMs(ticked)
        }
        return ticked
      }

      if (ticked.phase === 'reveal' && existing && existing.iso === null && pick) {
        player.answers[ticked.index] = {
          iso: pick,
          timeMs: Math.max(0, now - ticked.questionStartedAt),
        }
      }
      return ticked
    })
  } catch (error) {
    if (error instanceof DuelError) return null
    throw error
  }
}

export async function rematchDuel(code: string, playerId: string): Promise<DuelRoom | null> {
  try {
    return await mutateRoom(code, (current) => {
      const ticked = tickRoom(current, Date.now())
      if (ticked.phase !== 'done') return ticked
      const player = playerOf(ticked, playerId)
      if (!player) return 'forbidden'
      if (ticked.host.id === playerId) ticked.hostRematch = true
      else ticked.guestRematch = true
      if (ticked.hostRematch && ticked.guestRematch && ticked.guest) {
        return restartRound(ticked)
      }
      return ticked
    })
  } catch (error) {
    if (error instanceof DuelError) return null
    throw error
  }
}

export async function leaveDuel(code: string, playerId: string): Promise<void> {
  await mutateRoom(code, (current) => {
    if (current.phase === 'waiting' && current.host.id === playerId) return 'delete'
    if (current.phase === 'waiting' && current.guest?.id === playerId) {
      current.guest = null
      return current
    }
    if (current.phase === 'done') return current
    const now = Date.now()
    const player = playerOf(current, playerId)
    if (!player) return current
    if (current.phase === 'question' && !player.answers[current.index]) {
      player.answers[current.index] = { iso: null, timeMs: Math.max(0, now - current.questionStartedAt) }
    }
    current.phase = 'done'
    if (!current.playEndedAt) current.playEndedAt = now
    return current
  })
}

export async function readDuel(code: string): Promise<DuelRoom | null> {
  const room = await mutateRoom(code, (current) => tickRoom(current, Date.now()))
  return room
}

export function viewFor(room: DuelRoom, playerId: string): DuelView | null {
  const role = room.host.id === playerId ? 'host' : room.guest?.id === playerId ? 'guest' : null
  if (!role) return null
  const you = role === 'host' ? room.host : room.guest
  const opponent = role === 'host' ? room.guest : room.host
  if (!you) return null
  const youSlot = you.answers[room.index]
  const opponentSlot = opponent?.answers[room.index] ?? null
  const reveal = room.phase === 'reveal' || room.phase === 'done'
  const limitMs = questionLimitMs(questionModeOf(room), { region: room.region })
  const remainingMs =
    room.phase === 'question'
      ? Math.max(0, limitMs - (Date.now() - room.questionStartedAt))
      : 0
  const endedAt = room.playEndedAt > 0 ? room.playEndedAt : Date.now()
  const youScore = scoreOf(room, you)
  const opponentScore = opponent ? scoreOf(room, opponent) : null
  const modes = room.modes?.length ? orderedModes(room.modes) : [room.mode]
  const youRematch = role === 'host' ? Boolean(room.hostRematch) : Boolean(room.guestRematch)
  const opponentRematch = role === 'host' ? Boolean(room.guestRematch) : Boolean(room.hostRematch)
  return {
    code: room.code,
    you: role,
    phase: room.phase,
    mode: room.mode,
    modes: modes.length > 0 ? modes : [room.mode],
    region: room.region,
    difficulty: room.difficulty,
    roundSize: room.roundSize,
    index: room.index,
    total: room.questions.length,
    remainingMs,
    roundMs: room.playStartedAt > 0 ? Math.max(0, endedAt - room.playStartedAt) : 0,
    host: { name: room.host.name, score: scoreOf(room, room.host) },
    guest: room.guest ? { name: room.guest.name, score: scoreOf(room, room.guest) } : null,
    youName: you.name,
    opponentName: opponent?.name ?? null,
    youScore,
    opponentScore,
    youAnswer: youSlot ? youSlot.iso : undefined,
    opponentReady: Boolean(opponentSlot),
    opponentAnswer: reveal ? (opponentSlot ? opponentSlot.iso : undefined) : undefined,
    question: room.phase === 'waiting' ? null : (room.questions[room.index] ?? null),
    youWon:
      room.phase === 'done' && opponentScore !== null
        ? youScore === opponentScore
          ? null
          : youScore > opponentScore
        : null,
    youRematch,
    opponentRematch,
  }
}

export function parseCreateBody(body: unknown): {
  playerId: string
  name: string
  mode: QuizMode
  modes: QuizMode[]
  region: RegionFilter
  difficulty: QuizDifficulty
  roundSize: RoundSize
} | null {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  const playerId = parsePlayerId(record.playerId)
  if (!playerId) return null
  const modes = parseModes(record)
  if (!modes || !isRegionFilter(record.region) || !isQuizDifficulty(record.difficulty)) {
    return null
  }
  const roundSize = typeof record.roundSize === 'number' ? record.roundSize : Number(record.roundSize)
  if (!isRoundSize(roundSize)) return null
  return {
    playerId,
    name: parseDuelName(record.name),
    mode: modes[0],
    modes,
    region: record.region,
    difficulty: record.difficulty,
    roundSize,
  }
}

function parseModes(record: Record<string, unknown>): QuizMode[] | null {
  const fromList = Array.isArray(record.modes) ? orderedModes(record.modes) : []
  if (fromList.length > 0) return fromList
  if (isQuizMode(record.mode)) return [record.mode]
  return null
}

export function parseDuelName(value: unknown): string {
  if (typeof value !== 'string') return 'Player'
  const name = sanitizeName(value)
  if (name.length < 1 || !isNameAllowed(name)) return 'Player'
  return name
}

class DuelError extends Error {
  constructor(readonly code: 'full' | 'forbidden' | 'delete') {
    super(code)
  }
}

function emptyPlayer(id: string, name: string, total: number): DuelPlayer {
  return { id, name, answers: Array.from({ length: total }, () => null) }
}

function playerOf(room: DuelRoom, playerId: string): DuelPlayer | null {
  if (room.host.id === playerId) return room.host
  if (room.guest?.id === playerId) return room.guest
  return null
}

function bothAnswered(room: DuelRoom): boolean {
  if (!room.guest) return false
  return Boolean(room.host.answers[room.index] && room.guest.answers[room.index])
}

function scoreOf(room: DuelRoom, player: DuelPlayer): number {
  return player.answers.reduce((sum, answer, index) => {
    const correct = room.questions[index]?.countryIso
    return sum + (answer && answer.iso === correct ? 1 : 0)
  }, 0)
}

function tickRoom(room: DuelRoom, now: number): DuelRoom {
  if (room.phase === 'waiting' || room.phase === 'done') return room
  const limitMs = questionLimitMs(questionModeOf(room), { region: room.region })
  if (room.phase === 'question' && now - room.questionStartedAt >= limitMs) {
    for (const player of [room.host, room.guest]) {
      if (!player) continue
      if (!player.answers[room.index]) {
        player.answers[room.index] = { iso: null, timeMs: limitMs }
      }
    }
    room.phase = 'reveal'
    room.revealUntil = now + revealMs(room)
  }
  if (room.phase === 'reveal' && now >= room.revealUntil) {
    if (room.index >= room.questions.length - 1) {
      room.phase = 'done'
      if (!room.playEndedAt) room.playEndedAt = now
    } else {
      room.index += 1
      room.phase = 'question'
      room.questionStartedAt = now
      room.revealUntil = 0
    }
  }
  return room
}

function playState(room: DuelRoom): string {
  return JSON.stringify({
    phase: room.phase,
    index: room.index,
    revealUntil: room.revealUntil,
    questionStartedAt: room.questionStartedAt,
    guest: room.guest?.id ?? null,
    hostAnswers: room.host.answers,
    guestAnswers: room.guest?.answers ?? null,
    hostRematch: room.hostRematch,
    guestRematch: room.guestRematch,
    playEndedAt: room.playEndedAt,
  })
}

function buildQuestions(
  modes: QuizMode[],
  region: RegionFilter,
  difficulty: QuizDifficulty,
  roundSize: RoundSize,
): DuelQuestionWire[] {
  const round = createMixedRound(
    modes,
    getRegionPool(region),
    roundSize,
    (country, mode) => answerKey(country, mode),
    difficulty,
  )
  return round.map((question) => ({
    countryIso: question.country.iso,
    optionIsos: question.options.map((option) => option.iso),
    mode: question.mode ?? modes[0],
  }))
}

function restartRound(room: DuelRoom): DuelRoom {
  const questions = buildQuestions(room.modes, room.region, room.difficulty, room.roundSize)
  if (questions.length === 0) return room
  const now = Date.now()
  room.questions = questions
  room.index = 0
  room.phase = 'question'
  room.questionStartedAt = now
  room.playStartedAt = now
  room.playEndedAt = 0
  room.revealUntil = 0
  room.hostRematch = false
  room.guestRematch = false
  room.host.answers = Array.from({ length: questions.length }, () => null)
  if (room.guest) room.guest.answers = Array.from({ length: questions.length }, () => null)
  room.expiresAt = now + ROOM_MS
  return room
}

function questionModeOf(room: DuelRoom, index = room.index): QuizMode {
  const mode = room.questions[index]?.mode
  return isQuizMode(mode) ? mode : room.mode
}

function acceptDuelIso(iso: string | null, optionIsos: string[], mode: QuizMode): string | null {
  if (!iso) return null
  if (mode === 'nameToMap') {
    return COUNTRIES.some((country) => country.iso === iso) ? iso : null
  }
  return optionIsos.includes(iso) ? iso : null
}

function randomCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4))
  return [...bytes].map((byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('')
}

async function mutateRoom(
  code: string,
  fn: (room: DuelRoom) => DuelRoom | 'full' | 'forbidden' | 'delete',
): Promise<DuelRoom | null> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const current = await getRoom(code)
    if (!current) return null
    const draft: DuelRoom = structuredClone(current)
    let next: DuelRoom | 'full' | 'forbidden' | 'delete'
    try {
      next = fn(draft)
    } catch (error) {
      if (error instanceof DuelError) throw error
      throw error
    }
    if (next === 'full' || next === 'forbidden') throw new DuelError(next)
    if (next === 'delete') {
      await deleteRoom(code)
      return null
    }
    if (next === current) return current
    next.version = current.version + 1
    if (playState(next) === playState(current)) return current
    const saved = await saveRoomIf(next, current.version)
    if (saved) return next
    await new Promise((resolve) => setTimeout(resolve, 25 + attempt * 20))
  }
  throw new Error('duel busy')
}

async function getRoom(code: string): Promise<DuelRoom | null> {
  const redis = redisConfig()
  if (redis) {
    const result = await redisCommand(redis, ['GET', REDIS_PREFIX + code])
    return parseRoom(result)
  }
  if (process.env.VERCEL === '1') return null
  const store = await loadFileStore()
  const room = store[code]
  if (!room || room.expiresAt <= Date.now()) {
    if (room) {
      delete store[code]
      await saveFileStore(store)
    }
    return null
  }
  return room
}

async function saveRoom(room: DuelRoom): Promise<void> {
  const redis = redisConfig()
  if (redis) {
    await redisCommand(redis, [
      'SET',
      REDIS_PREFIX + room.code,
      JSON.stringify(room),
      'EX',
      String(Math.ceil(ROOM_MS / 1000)),
    ])
    return
  }
  if (process.env.VERCEL === '1') return
  const store = await loadFileStore()
  store[room.code] = room
  await saveFileStore(store)
}

async function saveRoomIf(room: DuelRoom, expectedVersion: number): Promise<boolean> {
  const latest = await getRoom(room.code)
  if (latest && latest.version !== expectedVersion) return false
  await saveRoom(room)
  return true
}

async function deleteRoom(code: string): Promise<void> {
  const redis = redisConfig()
  if (redis) {
    await redisCommand(redis, ['DEL', REDIS_PREFIX + code])
    return
  }
  if (process.env.VERCEL === '1') return
  const store = await loadFileStore()
  delete store[code]
  await saveFileStore(store)
}

function parseRoom(value: unknown): DuelRoom | null {
  if (typeof value !== 'string' || value.length === 0) return null
  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object') return null
    const room = parsed as DuelRoom
    if (typeof room.code !== 'string' || typeof room.version !== 'number') return null
    if (!isQuizMode(room.mode) || !isRegionFilter(room.region) || !isQuizDifficulty(room.difficulty)) {
      return null
    }
    if (room.expiresAt <= Date.now()) return null
    const modes = orderedModes(Array.isArray(room.modes) ? room.modes : [room.mode])
    room.modes = modes.length > 0 ? modes : [room.mode]
    room.questions = Array.isArray(room.questions)
      ? room.questions.map((question) => ({
          ...question,
          mode: isQuizMode(question.mode) ? question.mode : room.mode,
        }))
      : []
    room.playEndedAt = typeof room.playEndedAt === 'number' ? room.playEndedAt : 0
    room.hostRematch = Boolean(room.hostRematch)
    room.guestRematch = Boolean(room.guestRematch)
    return room
  } catch {
    return null
  }
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url, token }
}

async function redisCommand(redis: { url: string; token: string }, command: unknown[]): Promise<unknown> {
  const response = await fetch(redis.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redis.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('duel store unavailable')
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object') return null
  return (body as { result?: unknown }).result ?? null
}

async function loadFileStore(): Promise<Record<string, DuelRoom>> {
  try {
    const raw = await readFile(filePath(), 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed as Record<string, DuelRoom>
  } catch {
    return {}
  }
}

async function saveFileStore(store: Record<string, DuelRoom>): Promise<void> {
  const dest = filePath()
  await mkdir(path.dirname(dest), { recursive: true })
  const live: Record<string, DuelRoom> = {}
  const now = Date.now()
  for (const [code, room] of Object.entries(store)) {
    if (room.expiresAt > now) live[code] = room
  }
  await writeFile(dest, JSON.stringify(live))
}

function filePath(): string {
  return path.join(process.cwd(), '.data', FILE_NAME)
}
