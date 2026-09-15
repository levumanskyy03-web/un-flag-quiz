import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { LEADERBOARD_LIMIT, isPlayerId } from './leaderboard'
import type { DuelRatingSnapshot } from './duelTypes'
import { isFootballMode, type QuizMode } from './quiz'

export type DuelRatingWorld = 'all' | 'geo' | 'football'

export interface DuelRatingEntry {
  id: string
  name: string
  elo: number
  wins: number
  losses: number
  draws: number
  you?: boolean
}

interface WorldStats {
  elo: number
  wins: number
  losses: number
  draws: number
}

interface StoredPlayer {
  id: string
  name: string
  elo: number
  wins: number
  losses: number
  draws: number
  geo: WorldStats
  football: WorldStats
  at: number
}

interface Store {
  players: Record<string, StoredPlayer>
  matches: Record<string, DuelRatingSnapshot>
}

const REDIS_KEY = 'passport-duel-ratings'
const FILE_NAME = 'duel-ratings.json'
const START_ELO = 1_000
const MIN_ELO = 100
const K = 24

let writeChain: Promise<void> = Promise.resolve()

export function duelWorldOf(modes: QuizMode[]): 'geo' | 'football' {
  return modes.length > 0 && modes.every((mode) => isFootballMode(mode)) ? 'football' : 'geo'
}

export async function applyDuelMatch(input: {
  matchId: string
  world: 'geo' | 'football'
  host: { id: string; name: string; bot: boolean; elo?: number; score: number }
  guest: { id: string; name: string; bot: boolean; elo?: number; score: number }
}): Promise<DuelRatingSnapshot> {
  return enqueue(async () => {
    const store = (await loadStore()) ?? emptyStore()
    const existing = store.matches[input.matchId]
    if (existing) return existing

    const hostElo = input.host.bot ? input.host.elo ?? START_ELO : ratingOf(store, input.host.id).elo
    const guestElo = input.guest.bot ? input.guest.elo ?? START_ELO : ratingOf(store, input.guest.id).elo
    const hostScore = input.host.score === input.guest.score ? 0.5 : input.host.score > input.guest.score ? 1 : 0
    const hostDelta = input.host.bot ? 0 : eloDelta(hostElo, guestElo, hostScore)
    const guestDelta = input.guest.bot ? 0 : eloDelta(guestElo, hostElo, 1 - hostScore)

    if (!input.host.bot && isPlayerId(input.host.id)) {
      bump(store, input.host, input.world, hostDelta, hostScore)
    }
    if (!input.guest.bot && isPlayerId(input.guest.id)) {
      bump(store, input.guest, input.world, guestDelta, 1 - hostScore)
    }

    const snapshot: DuelRatingSnapshot = {
      host: {
        elo: (input.host.bot ? hostElo : ratingOf(store, input.host.id).elo),
        delta: hostDelta,
      },
      guest: {
        elo: (input.guest.bot ? guestElo : ratingOf(store, input.guest.id).elo),
        delta: guestDelta,
      },
    }
    store.matches[input.matchId] = snapshot
    pruneMatches(store)
    await saveStore(store)
    return snapshot
  })
}

export async function readDuelRatings(
  world: DuelRatingWorld,
  me?: string,
): Promise<{ configured: boolean; entries: DuelRatingEntry[] }> {
  const store = await loadStore()
  if (!store) return { configured: false, entries: [] }
  const rows = Object.values(store.players)
    .map((player) => {
      const stats = world === 'all' ? player : player[world]
      const games = stats.wins + stats.losses + stats.draws
      return {
        id: player.id,
        name: player.name,
        elo: stats.elo,
        wins: stats.wins,
        losses: stats.losses,
        draws: stats.draws,
        games,
        at: player.at,
      }
    })
    .filter((row) => row.games > 0)
    .sort((a, b) => b.elo - a.elo || b.games - a.games || a.name.localeCompare(b.name))
    .slice(0, LEADERBOARD_LIMIT)
    .map((row) => ({
      id: row.id,
      name: row.name,
      elo: row.elo,
      wins: row.wins,
      losses: row.losses,
      draws: row.draws,
      you: Boolean(me && row.id === me),
    }))
  return { configured: true, entries: rows }
}

function bump(
  store: Store,
  player: { id: string; name: string },
  world: 'geo' | 'football',
  delta: number,
  score: number,
) {
  const current = ratingOf(store, player.id)
  current.name = player.name || current.name
  current.at = Date.now()
  applyResult(current, delta, score)
  applyResult(current[world], delta, score)
  store.players[player.id] = current
}

function applyResult(stats: WorldStats, delta: number, score: number) {
  stats.elo = Math.max(MIN_ELO, stats.elo + delta)
  if (score === 1) stats.wins += 1
  else if (score === 0) stats.losses += 1
  else stats.draws += 1
}

function ratingOf(store: Store, id: string): StoredPlayer {
  const existing = store.players[id]
  if (existing) return existing
  const fresh: StoredPlayer = {
    id,
    name: 'Player',
    elo: START_ELO,
    wins: 0,
    losses: 0,
    draws: 0,
    geo: blankWorld(),
    football: blankWorld(),
    at: Date.now(),
  }
  store.players[id] = fresh
  return fresh
}

function blankWorld(): WorldStats {
  return { elo: START_ELO, wins: 0, losses: 0, draws: 0 }
}

function eloDelta(ra: number, rb: number, score: number): number {
  const expected = 1 / (1 + 10 ** ((rb - ra) / 400))
  return Math.round(K * (score - expected))
}

function emptyStore(): Store {
  return { players: {}, matches: {} }
}

function pruneMatches(store: Store) {
  const ids = Object.keys(store.matches)
  if (ids.length <= 4_000) return
  for (const id of ids.slice(0, ids.length - 3_000)) delete store.matches[id]
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn)
  writeChain = next.then(
    () => undefined,
    () => undefined,
  )
  return next
}

async function loadStore(): Promise<Store | null> {
  const redis = redisConfig()
  if (redis) {
    const result = await redisCommand(redis, ['GET', REDIS_KEY])
    return parseStore(result)
  }
  if (process.env.VERCEL === '1') return null
  try {
    const raw = await readFile(filePath(), 'utf8')
    return parseStore(raw)
  } catch {
    return emptyStore()
  }
}

async function saveStore(store: Store): Promise<void> {
  const redis = redisConfig()
  if (redis) {
    await redisCommand(redis, ['SET', REDIS_KEY, JSON.stringify(store)])
    return
  }
  if (process.env.VERCEL === '1') return
  const dest = filePath()
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, JSON.stringify(store))
}

function parseStore(value: unknown): Store | null {
  const raw = typeof value === 'string' ? value : null
  if (!raw) return emptyStore()
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const record = parsed as Partial<Store>
    return {
      players: record.players && typeof record.players === 'object' ? record.players : {},
      matches: record.matches && typeof record.matches === 'object' ? record.matches : {},
    }
  } catch {
    return emptyStore()
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
  if (!response.ok) throw new Error('duel rating store unavailable')
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object') return null
  return (body as { result?: unknown }).result ?? null
}

function filePath(): string {
  return path.join(process.cwd(), '.data', FILE_NAME)
}
