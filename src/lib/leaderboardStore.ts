import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { LEVEL_COUNT } from '../data/levels'
import {
  LEADERBOARD_LIMIT,
  isBetterCampaign,
  type CampaignStats,
} from './leaderboard'
import type { QuizMode } from './quiz'

export interface StoredEntry extends CampaignStats {
  id: string
  name: string
  at: number
}

type BoardKey = `${QuizMode}:${'0' | '1'}`
type BoardMap = Partial<Record<BoardKey, StoredEntry[]>>

const REDIS_KEY = 'passport-country-leaderboard'

export function boardKey(mode: QuizMode, hardcore: boolean): BoardKey {
  return `${mode}:${hardcore ? '1' : '0'}`
}

export async function readBoard(mode: QuizMode, hardcore: boolean): Promise<{
  entries: StoredEntry[]
  configured: boolean
}> {
  const store = await loadStore()
  if (store === null) return { entries: [], configured: false }
  return { entries: sortBoard(store[boardKey(mode, hardcore)] ?? []), configured: true }
}

export async function upsertBoardEntry(
  mode: QuizMode,
  hardcore: boolean,
  incoming: StoredEntry,
): Promise<{ configured: boolean }> {
  if (incoming.levelsCleared < 1 || incoming.levelsCleared > LEVEL_COUNT) {
    return { configured: true }
  }
  const store = await loadStore()
  if (store === null) return { configured: false }
  const key = boardKey(mode, hardcore)
  const current = store[key] ?? []
  const existing = current.find((item) => item.id === incoming.id)
  const nextEntry =
    existing && !isBetterCampaign(incoming, existing)
      ? { ...existing, name: incoming.name }
      : incoming
  const nextBoard = sortBoard([
    ...current.filter((item) => item.id !== incoming.id),
    nextEntry,
  ]).slice(0, 200)
  await saveStore({ ...store, [key]: nextBoard })
  return { configured: true }
}

function sortBoard(entries: StoredEntry[]): StoredEntry[] {
  return [...entries].sort((a, b) => {
    if (isBetterCampaign(a, b)) return -1
    if (isBetterCampaign(b, a)) return 1
    return a.at - b.at
  })
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url, token }
}

async function loadStore(): Promise<BoardMap | null> {
  const redis = redisConfig()
  if (redis) {
    const result = await redisCommand(redis, ['GET', REDIS_KEY])
    if (typeof result !== 'string' || result.length === 0) return {}
    try {
      const parsed: unknown = JSON.parse(result)
      return parsed && typeof parsed === 'object' ? (parsed as BoardMap) : {}
    } catch {
      return {}
    }
  }
  if (process.env.VERCEL === '1') return null
  try {
    const raw = await readFile(filePath(), 'utf8')
    const parsed: unknown = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as BoardMap) : {}
  } catch {
    return {}
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
): Array<{ name: string; levelsCleared: number; totalMs: number; you: boolean }> {
  return entries.slice(0, LEADERBOARD_LIMIT).map((entry) => ({
    name: entry.name,
    levelsCleared: entry.levelsCleared,
    totalMs: entry.totalMs,
    you: playerId !== undefined && entry.id === playerId,
  }))
}
