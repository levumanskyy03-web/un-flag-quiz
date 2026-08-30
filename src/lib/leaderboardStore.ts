import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  LEADERBOARD_LIMIT,
  RATING_CLEARS_MAX,
  RATING_LEVEL_MAX,
  RATING_XP_MAX,
  isBetterCampaign,
  isBetterXp,
  ratingPeriodStamp,
  type RatingBoard,
  type RatingWorld,
} from './leaderboard'
import { FOOTBALL_MODES, LEADERS_MODES, LEVEL_MODES, type QuizMode } from './quiz'

export interface StoredEntry {
  id: string
  name: string
  at: number
  levelsCleared: number
  totalMs: number
  xp?: number
  level?: number
  livesLeft?: number
}

type BoardMap = Record<string, StoredEntry[]>

const REDIS_KEY = 'passport-country-leaderboard'

let writeChain: Promise<void> = Promise.resolve()

export function ratingKey(board: RatingBoard): string {
  if (board.kind === 'xp') {
    const world: RatingWorld = board.world ?? 'all'
    const period = board.period ?? 'all'
    if (world === 'all' && period === 'all') return 'xp'
    if (period === 'all') return `xp:${world}:all`
    return `xp:${world}:${period}:${ratingPeriodStamp(period)}`
  }
  if (board.kind === 'clears') {
    const world = board.world
    if (!world || world === 'geo') return `clears:${board.hardcore ? '1' : '0'}`
    return `clears:${world}:${board.hardcore ? '1' : '0'}`
  }
  if (board.kind === 'levelBest') return levelBestKey(board.mode, board.level, board.hardcore)
  return `${board.mode}:${board.hardcore ? '1' : '0'}`
}

export function levelBestKey(mode: QuizMode, level: number, hardcore: boolean): string {
  return `level:${mode}:${level}:${hardcore ? '1' : '0'}`
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

export async function upsertLevelBest(
  board: Extract<RatingBoard, { kind: 'levelBest' }>,
  incoming: StoredEntry,
): Promise<{ configured: boolean; accepted: boolean; previous: StoredEntry | null }> {
  return enqueue(async () => {
    const store = await loadStore()
    if (store === null) return { configured: false, accepted: false, previous: null }
    const key = ratingKey(board)
    const holder = (store[key] ?? [])[0] ?? null
    if (holder && !isBetterLevelBest(incoming, holder)) {
      if (holder.id === incoming.id && holder.name !== incoming.name) {
        store[key] = [{ ...holder, name: incoming.name }]
        await saveStore(store)
      }
      return { configured: true, accepted: false, previous: holder }
    }
    store[key] = [incoming]
    await saveStore(store)
    return { configured: true, accepted: true, previous: holder }
  })
}

export async function readLevelBests(
  mode: QuizMode,
  hardcore: boolean,
): Promise<{ records: Record<number, StoredEntry>; configured: boolean }> {
  const store = await loadStore()
  if (store === null) return { records: {}, configured: false }
  const records: Record<number, StoredEntry> = {}
  for (let level = 1; level <= RATING_LEVEL_MAX; level += 1) {
    const entry = store[levelBestKey(mode, level, hardcore)]?.[0]
    if (entry) records[level] = entry
  }
  return { records, configured: true }
}

function applyUpsert(store: BoardMap, board: RatingBoard, incoming: StoredEntry): void {
  if (board.kind === 'xp' && (board.period ?? 'all') !== 'all') return
  if (!isValidEntry(board, incoming)) return
  const key = ratingKey(board)
  const current = store[key] ?? []
  const existing = current.find((item) => item.id === incoming.id)
  const previousXp = existing?.xp ?? 0
  const nextEntry =
    existing && !isBetterEntry(board, incoming, existing)
      ? { ...existing, name: incoming.name }
      : incoming
  store[key] = sortBoard(board, [...current.filter((item) => item.id !== incoming.id), nextEntry]).slice(0, 200)
  if (board.kind !== 'xp') return
  const nextXp = nextEntry.xp ?? 0
  if (!existing || nextXp <= previousXp) return
  addPeriodXp(store, board.world ?? 'all', nextXp - previousXp, incoming)
}

function addPeriodXp(store: BoardMap, world: RatingWorld, delta: number, incoming: StoredEntry): void {
  if (delta <= 0) return
  for (const period of ['day', 'week', 'month'] as const) {
    const board: RatingBoard = { kind: 'xp', world, period }
    const key = ratingKey(board)
    const current = store[key] ?? []
    const existing = current.find((item) => item.id === incoming.id)
    const next: StoredEntry = {
      id: incoming.id,
      name: incoming.name,
      at: incoming.at,
      levelsCleared: 0,
      totalMs: 0,
      xp: (existing?.xp ?? 0) + delta,
      level: incoming.level,
    }
    store[key] = sortBoard({ kind: 'xp' }, [...current.filter((item) => item.id !== incoming.id), next]).slice(
      0,
      200,
    )
  }
}

function withRolledClears(store: BoardMap): BoardMap {
  const next = { ...store }
  for (const hardcore of [false, true]) {
    const geoKey = `clears:${hardcore ? '1' : '0'}`
    next[geoKey] = mergeClears(store[geoKey] ?? [], rollupModes(store, hardcore, LEVEL_MODES))
    next[`clears:football:${hardcore ? '1' : '0'}`] = mergeClears(
      store[`clears:football:${hardcore ? '1' : '0'}`] ?? [],
      rollupModes(store, hardcore, FOOTBALL_MODES),
    )
    next[`clears:leaders:${hardcore ? '1' : '0'}`] = mergeClears(
      store[`clears:leaders:${hardcore ? '1' : '0'}`] ?? [],
      rollupModes(store, hardcore, LEADERS_MODES),
    )
  }
  return prunePeriodBoards(next)
}

function rollupModes(store: BoardMap, hardcore: boolean, modes: readonly QuizMode[]): StoredEntry[] {
  const byId = new Map<string, StoredEntry>()
  for (const mode of modes) {
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
  return [...byId.values()].filter((item) => item.levelsCleared >= 1 && item.levelsCleared <= RATING_CLEARS_MAX)
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

function prunePeriodBoards(store: BoardMap): BoardMap {
  const now = Date.now()
  const keepDay = ratingPeriodStamp('day', now)
  const keepWeek = ratingPeriodStamp('week', now)
  const keepMonth = ratingPeriodStamp('month', now)
  const next: BoardMap = { ...store }
  for (const key of Object.keys(next)) {
    const match = key.match(/^xp:[^:]+:(day|week|month):(.+)$/)
    if (!match) continue
    const period = match[1]
    const stamp = match[2]
    if (period === 'day' && stamp < olderDayStamp(now, 10) && stamp !== keepDay) {
      delete next[key]
    } else if (period === 'month' && stamp < olderMonthStamp(now, 14) && stamp !== keepMonth) {
      delete next[key]
    } else if (period === 'week' && weekRank(stamp) < weekRank(keepWeek) - 8) {
      delete next[key]
    }
  }
  return next
}

function olderDayStamp(at: number, days: number): string {
  return ratingPeriodStamp('day', at - days * 86_400_000)
}

function olderMonthStamp(at: number, months: number): string {
  const date = new Date(at)
  date.setUTCMonth(date.getUTCMonth() - months)
  return ratingPeriodStamp('month', date.getTime())
}

function weekRank(stamp: string): number {
  const match = stamp.match(/^(\d{4})-W(\d{2})$/)
  if (!match) return 0
  return Number(match[1]) * 100 + Number(match[2])
}

function isValidEntry(board: RatingBoard, incoming: StoredEntry): boolean {
  if (board.kind === 'xp') {
    const xp = incoming.xp ?? 0
    const level = incoming.level ?? 0
    return xp >= 1 && xp <= RATING_XP_MAX && level >= 1 && level <= RATING_LEVEL_MAX
  }
  if (board.kind === 'levelBest') {
    return (
      incoming.totalMs >= 1 &&
      incoming.totalMs <= 3_600_000 &&
      (incoming.livesLeft ?? 0) >= 0 &&
      (incoming.livesLeft ?? 0) <= 200
    )
  }
  const max = board.kind === 'clears' ? RATING_CLEARS_MAX : RATING_LEVEL_MAX
  return incoming.levelsCleared >= 1 && incoming.levelsCleared <= max
}

function isBetterLevelBest(candidate: StoredEntry, current: StoredEntry): boolean {
  const aLives = candidate.livesLeft ?? 0
  const bLives = current.livesLeft ?? 0
  if (aLives !== bLives) return aLives > bLives
  return candidate.totalMs < current.totalMs
}

function isBetterEntry(board: RatingBoard, candidate: StoredEntry, current: StoredEntry): boolean {
  if (board.kind === 'xp') return isBetterXp(candidate, current)
  if (board.kind === 'levelBest') return isBetterLevelBest(candidate, current)
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
  id: string
  name: string
  levelsCleared: number
  totalMs: number
  xp: number
  level: number
  you: boolean
}> {
  return entries.slice(0, LEADERBOARD_LIMIT).map((entry) => ({
    id: entry.id,
    name: entry.name,
    levelsCleared: entry.levelsCleared,
    totalMs: entry.totalMs,
    xp: entry.xp ?? 0,
    level: entry.level ?? 0,
    you: playerId !== undefined && entry.id === playerId,
  }))
}
