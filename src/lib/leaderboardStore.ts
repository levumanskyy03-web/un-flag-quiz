import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { LEVEL_COUNT } from '../data/levels'
import {
  LEADERBOARD_LIMIT,
  RATING_LEVEL_MAX,
  RATING_LEVELS_MAX,
  RATING_XP_MAX,
  isBetterCampaign,
  isBetterXp,
  type RatingBoard,
} from './leaderboard'
import { LEVEL_MODES, type QuizMode } from './quiz'

export interface StoredEntry {
  id: string
  name: string
  at: number
  levelsCleared: number
  totalMs: number
  xp?: number
  level?: number
}

type BoardMap = Record<string, StoredEntry[]>

const REDIS_KEY = 'passport-country-leaderboard'

let writeChain: Promise<void> = Promise.resolve()

export function ratingKey(board: RatingBoard): string {
  if (board.kind === 'xp') return 'xp'
  if (board.kind === 'clears') return `clears:${board.hardcore ? '1' : '0'}`
  return `${board.mode}:${board.hardcore ? '1' : '0'}`
}

export function boardKey(mode: QuizMode, hardcore: boolean): string {
  return ratingKey({ kind: 'mode', mode, hardcore })
}

export async function readBoard(mode: QuizMode, hardcore: boolean): Promise<{
  entries: StoredEntry[]
  configured: boolean
}> {
  return readRating({ kind: 'mode', mode, hardcore })
}

export async function readRating(board: RatingBoard): Promise<{
  entries: StoredEntry[]
  configured: boolean
}> {
  const store = await loadStore()
  if (store === null) return { entries: [], configured: false }
  const view = withRolledClears(store)
  return { entries: sortBoard(board, view[ratingKey(board)] ?? []), configured: true }
}

export async function upsertBoardEntry(
  mode: QuizMode,
  hardcore: boolean,
  incoming: StoredEntry,
): Promise<{ configured: boolean }> {
  return upsertRating({ kind: 'mode', mode, hardcore }, incoming)
}

export async function upsertRating(
  board: RatingBoard,
  incoming: StoredEntry,
): Promise<{ configured: boolean }> {
  return upsertRatings([{ board, incoming }])
}

export async function upsertRatings(
  updates: Array<{ board: RatingBoard; incoming: StoredEntry }>,
): Promise<{ configured: boolean }> {
  return enqueue(async () => {
    const store = await loadStore()
    if (store === null) return { configured: false }
    const next = { ...store }
    for (const { board, incoming } of updates) {
      applyUpsert(next, board, incoming)
    }
    await saveStore(withRolledClears(next))
    return { configured: true }
  })
}

function applyUpsert(store: BoardMap, board: RatingBoard, incoming: StoredEntry): void {
  if (!isValidEntry(board, incoming)) return
  const key = ratingKey(board)
  const current = store[key] ?? []
  const existing = current.find((item) => item.id === incoming.id)
  const nextEntry =
    existing && !isBetterEntry(board, incoming, existing)
      ? { ...existing, name: incoming.name, xp: incoming.xp ?? existing.xp, level: incoming.level ?? existing.level }
      : incoming
  store[key] = sortBoard(board, [...current.filter((item) => item.id !== incoming.id), nextEntry]).slice(0, 200)
}

function withRolledClears(store: BoardMap): BoardMap {
  const next = { ...store }
  for (const hardcore of [false, true]) {
    const key = `clears:${hardcore ? '1' : '0'}`
    next[key] = mergeClears(store[key] ?? [], rollupModes(store, hardcore))
  }
  return next
}

function rollupModes(store: BoardMap, hardcore: boolean): StoredEntry[] {
  const byId = new Map<string, StoredEntry>()
  for (const mode of LEVEL_MODES) {
    for (const entry of store[`${mode}:${hardcore ? '1' : '0'}`] ?? []) {
      const current = byId.get(entry.id)
      byId.set(entry.id, {
        id: entry.id,
        name: entry.name,
        at: Math.max(current?.at ?? 0, entry.at),
        levelsCleared: (current?.levelsCleared ?? 0) + entry.levelsCleared,
        totalMs: 0,
        xp: entry.xp ?? current?.xp,
        level: entry.level ?? current?.level,
      })
    }
  }
  return [...byId.values()].filter((item) => item.levelsCleared >= 1 && item.levelsCleared <= RATING_LEVELS_MAX)
}

function mergeClears(current: StoredEntry[], rolled: StoredEntry[]): StoredEntry[] {
  const byId = new Map<string, StoredEntry>()
  for (const entry of current) byId.set(entry.id, entry)
  for (const entry of rolled) {
    const existing = byId.get(entry.id)
    if (!existing || isBetterCampaign(entry, existing)) {
      byId.set(entry.id, existing ? { ...entry, name: existing.name || entry.name } : entry)
    } else {
      byId.set(entry.id, { ...existing, name: entry.name || existing.name })
    }
  }
  return sortBoard({ kind: 'clears', hardcore: false }, [...byId.values()]).slice(0, 200)
}

function isValidEntry(board: RatingBoard, incoming: StoredEntry): boolean {
  if (board.kind === 'xp') {
    const xp = incoming.xp ?? 0
    const level = incoming.level ?? 0
    return xp >= 1 && xp <= RATING_XP_MAX && level >= 1 && level <= RATING_LEVEL_MAX
  }
  const max = board.kind === 'clears' ? RATING_LEVELS_MAX : LEVEL_COUNT
  return incoming.levelsCleared >= 1 && incoming.levelsCleared <= max
}

function isBetterEntry(board: RatingBoard, candidate: StoredEntry, current: StoredEntry): boolean {
  if (board.kind === 'xp') return isBetterXp(candidate, current)
  return isBetterCampaign(candidate, current)
}

function sortBoard(board: RatingBoard, entries: StoredEntry[]): StoredEntry[] {
  return [...entries].sort((a, b) => {
    if (isBetterEntry(board, a, b)) return -1
    if (isBetterEntry(board, b, a)) return 1
    return a.at - b.at
  })
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url, token }
}

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const run = writeChain.then(job, job)
  writeChain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

async function loadStore(): Promise<BoardMap | null> {
  const redis = redisConfig()
  if (redis) {
    const result = await redisCommand(redis, ['GET', REDIS_KEY])
    if (typeof result !== 'string' || result.length === 0) return {}
    return parseStore(result)
  }
  if (process.env.VERCEL === '1') return null
  try {
    const raw = await readFile(filePath(), 'utf8')
    return parseStore(raw)
  } catch {
    return {}
  }
}

function parseStore(raw: string): BoardMap {
  const direct = tryParseMap(raw)
  if (direct) return direct
  for (let end = raw.length - 1; end > 1; end--) {
    if (raw[end] !== '}' && raw[end] !== ']') continue
    const sliced = tryParseMap(raw.slice(0, end + 1))
    if (sliced) return sliced
  }
  return {}
}

function tryParseMap(raw: string): BoardMap | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return parsed as BoardMap
  } catch {
    return null
  }
}

async function saveStore(store: BoardMap): Promise<void> {
  const redis = redisConfig()
  const payload = JSON.stringify(store)
  if (redis) {
    await redisCommand(redis, ['SET', REDIS_KEY, payload])
    return
  }
  const dest = filePath()
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, payload)
}

async function redisCommand(
  redis: { url: string; token: string },
  command: unknown[],
): Promise<unknown> {
  const response = await fetch(redis.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redis.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('leaderboard store unavailable')
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object') return null
  return (body as { result?: unknown }).result ?? null
}

function filePath(): string {
  return path.join(process.cwd(), '.data', 'leaderboard.json')
}

export function publicEntries(
  entries: StoredEntry[],
  playerId?: string,
): Array<{
  name: string
  levelsCleared: number
  totalMs: number
  xp: number
  level: number
  you: boolean
}> {
  return entries.slice(0, LEADERBOARD_LIMIT).map((entry) => ({
    name: entry.name,
    levelsCleared: entry.levelsCleared,
    totalMs: entry.totalMs,
    xp: entry.xp ?? 0,
    level: entry.level ?? 0,
    you: playerId !== undefined && entry.id === playerId,
  }))
}
