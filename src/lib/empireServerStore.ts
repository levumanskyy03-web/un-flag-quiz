import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  EMPIRE_BUILDINGS,
  EMPIRE_TRIAL_BUILDINGS,
  EMPIRE_TRIAL_COINS_MAX,
  EMPIRE_TRIAL_LEVEL_MAX,
} from '../data/empire'
import { emptyEmpire, parseEmpire, tick, withScore, type EmpireState } from './empire/rules'
import { QUIZ_WORLDS } from './quiz/core'

const STATE_PREFIX = 'empire:state:'
const BOARD_KEY = 'empire:board'
const NONCE_PREFIX = 'empire:nonce:'
const NONCE_TTL_SEC = 24 * 60 * 60

const localNonces = new Map<string, number>()
let writeChain: Promise<unknown> = Promise.resolve()

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const run = writeChain.then(job, job)
  writeChain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
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
    headers: { Authorization: `Bearer ${redis.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('empire store unavailable')
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object') return null
  return (body as { result?: unknown }).result ?? null
}

function dir() {
  return path.join(process.cwd(), '.data', 'empire')
}

function statePath(accountId: string) {
  return path.join(dir(), `${accountId}.json`)
}

function boardPath() {
  return path.join(dir(), 'board.json')
}

/** null — хранилище недоступно (Vercel без Redis). */
export async function readEmpire(accountId: string): Promise<EmpireState | null> {
  const redis = redisConfig()
  if (redis) {
    const raw = await redisCommand(redis, ['GET', STATE_PREFIX + accountId])
    if (typeof raw !== 'string' || raw.length === 0) return emptyEmpire()
    try {
      return parseEmpire(JSON.parse(raw) as unknown) ?? emptyEmpire()
    } catch {
      return emptyEmpire()
    }
  }
  if (process.env.VERCEL === '1') return null
  try {
    const raw = await readFile(statePath(accountId), 'utf8')
    return parseEmpire(JSON.parse(raw) as unknown) ?? emptyEmpire()
  } catch {
    return emptyEmpire()
  }
}

export async function writeEmpire(accountId: string, state: EmpireState): Promise<void> {
  const scored = withScore(state)
  const payload = JSON.stringify(scored)
  const redis = redisConfig()
  if (redis) {
    await redisCommand(redis, ['SET', STATE_PREFIX + accountId, payload])
    await redisCommand(redis, ['ZADD', BOARD_KEY, scored.score, accountId])
    return
  }
  await enqueue(async () => {
    await mkdir(dir(), { recursive: true })
    await writeFile(statePath(accountId), payload)
    const board = await readLocalBoard()
    board[accountId] = scored.score
    await writeFile(boardPath(), JSON.stringify(board))
  })
}

/** Читает, применяет тик, возвращает. Не пишет. */
export async function loadTicked(accountId: string, now = Date.now()): Promise<EmpireState | null> {
  const state = await readEmpire(accountId)
  if (!state) return null
  return tick(state, now)
}

async function readLocalBoard(): Promise<Record<string, number>> {
  try {
    const parsed: unknown = JSON.parse(await readFile(boardPath(), 'utf8'))
    if (!parsed || typeof parsed !== 'object') return {}
    const out: Record<string, number> = {}
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      const n = Number(v)
      if (Number.isFinite(n)) out[k] = n
    }
    return out
  } catch {
    return {}
  }
}

export type BoardRow = { id: string; score: number }

export async function readBoard(limit: number): Promise<BoardRow[]> {
  const redis = redisConfig()
  if (redis) {
    const raw = await redisCommand(redis, ['ZREVRANGE', BOARD_KEY, 0, Math.max(0, limit - 1), 'WITHSCORES'])
    if (!Array.isArray(raw)) return []
    const rows: BoardRow[] = []
    for (let i = 0; i + 1 < raw.length; i += 2) {
      const id = raw[i]
      const score = Number(raw[i + 1])
      if (typeof id === 'string' && Number.isFinite(score)) rows.push({ id, score })
    }
    return rows
  }
  const board = await readLocalBoard()
  return Object.entries(board)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export async function readRank(accountId: string): Promise<number | null> {
  const redis = redisConfig()
  if (redis) {
    const rank = await redisCommand(redis, ['ZREVRANK', BOARD_KEY, accountId])
    return typeof rank === 'number' ? rank + 1 : null
  }
  const board = await readLocalBoard()
  const mine = board[accountId]
  if (mine === undefined) return null
  return Object.values(board).filter((s) => s > mine).length + 1
}

/** true — nonce новый и зарезервирован; false — уже был. */
export async function claimNonce(accountId: string, nonce: string): Promise<boolean> {
  const key = `${NONCE_PREFIX}${accountId}:${nonce}`
  const redis = redisConfig()
  if (redis) {
    const set = await redisCommand(redis, ['SET', key, '1', 'NX', 'EX', NONCE_TTL_SEC])
    return set === 'OK'
  }
  const now = Date.now()
  for (const [k, exp] of localNonces) if (exp <= now) localNonces.delete(k)
  if (localNonces.has(key)) return false
  localNonces.set(key, now + NONCE_TTL_SEC * 1000)
  return true
}

/** Кламп локальной пробы гостя перед импортом. */
export function clampTrial(raw: unknown, now = Date.now()): EmpireState {
  const parsed = parseEmpire(raw, now) ?? emptyEmpire(now)
  const buildings = { ...parsed.buildings }
  let built = 0
  for (const b of EMPIRE_BUILDINGS) {
    const level = Math.min(EMPIRE_TRIAL_LEVEL_MAX, buildings[b].level)
    if (level > 0) built += 1
    buildings[b] = { level: built <= EMPIRE_TRIAL_BUILDINGS ? level : 0, buildUntil: null }
  }
  const specialists = { ...parsed.specialists }
  let total = 0
  for (const w of QUIZ_WORLDS) {
    const keep = Math.max(0, Math.min(specialists[w], 9 - total))
    specialists[w] = keep
    total += keep
  }
  const base = emptyEmpire(now)
  return withScore({
    ...base,
    name: parsed.name,
    coins: Math.min(EMPIRE_TRIAL_COINS_MAX, parsed.coins),
    res: parsed.res,
    buildings,
    specialists,
    createdAt: Math.min(now, parsed.createdAt || now),
    lastTickAt: now,
  })
}
