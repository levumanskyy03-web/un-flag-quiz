import type { AchievementId } from '../data/achievements'
import { LEVEL_COUNT } from '../data/levels'
import type { LevelClear } from './levelProgress'
import { LEVEL_MODES, hasLevels, isQuizMode, type QuizMode } from './quiz'
import { accountLevel } from './xp'

export const PLAYER_KEY = 'un-flag-quiz-player'
export const LEADERBOARD_LIMIT = 20
export const NAME_MIN = 2
export const NAME_MAX = 24
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 72
export const RATING_LEVELS_MAX = LEVEL_MODES.length * LEVEL_COUNT
export const RATING_XP_MAX = 99_999_999
export const RATING_LEVEL_MAX = 999

export interface Player {
  id: string
  name: string
}

export interface LeaderboardEntry {
  id?: string
  name: string
  levelsCleared: number
  totalMs: number
  you?: boolean
  xp?: number
  level?: number
}

export interface CampaignStats {
  levelsCleared: number
  totalMs: number
}

export type RatingBoard =
  | { kind: 'xp' }
  | { kind: 'clears'; hardcore: boolean }
  | { kind: 'mode'; mode: QuizMode; hardcore: boolean }
  | { kind: 'levelBest'; mode: QuizMode; level: number; hardcore: boolean }

export function campaignStats(
  clears: LevelClear[],
  mode: QuizMode,
  hardcoreOnly: boolean,
): CampaignStats {
  const items = clears.filter((item) => item.mode === mode && (!hardcoreOnly || item.hardcore))
  const best = new Map<number, LevelClear>()
  for (const item of items) {
    const current = best.get(item.level)
    if (!current || item.roundMs < current.roundMs) best.set(item.level, item)
  }
  const unique = [...best.values()]
  return {
    levelsCleared: unique.length,
    totalMs: unique.reduce((sum, item) => sum + item.roundMs, 0),
  }
}

export function uniqueLevelsCleared(clears: LevelClear[], hardcoreOnly: boolean): number {
  const seen = new Set<string>()
  for (const item of clears) {
    if (!hasLevels(item.mode)) continue
    if (hardcoreOnly && !item.hardcore) continue
    seen.add(`${item.mode}:${item.level}`)
  }
  return seen.size
}

export function isBetterCampaign(candidate: CampaignStats, current: CampaignStats): boolean {
  return candidate.levelsCleared > current.levelsCleared
}

export function isBetterXp(
  candidate: { xp?: number; level?: number },
  current: { xp?: number; level?: number },
): boolean {
  const a = candidate.xp ?? 0
  const b = current.xp ?? 0
  if (a !== b) return a > b
  return (candidate.level ?? 0) > (current.level ?? 0)
}

export function parseRatingBoard(params: URLSearchParams): RatingBoard | null {
  const board = params.get('board')
  const hardcore = params.get('hardcore') === '1'
  if (board === 'xp') return { kind: 'xp' }
  if (board === 'clears') return { kind: 'clears', hardcore }
  const mode = params.get('mode')
  if ((board === 'mode' || board === null) && isQuizMode(mode)) {
    return { kind: 'mode', mode, hardcore }
  }
  return null
}

export function sanitizeName(raw: string): string {
  return raw.replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX)
}

export function isPlayerId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

export function loadPlayer(): Player {
  const fallback: Player = { id: crypto.randomUUID(), name: '' }
  try {
    const raw = localStorage.getItem(PLAYER_KEY)
    if (raw === null) {
      localStorage.setItem(PLAYER_KEY, JSON.stringify(fallback))
      return fallback
    }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return fallback
    const record = parsed as Record<string, unknown>
    const id = typeof record.id === 'string' && isPlayerId(record.id) ? record.id : fallback.id
    const name = typeof record.name === 'string' ? sanitizeName(record.name) : ''
    const player = { id, name }
    if (id !== record.id || name !== record.name) {
      localStorage.setItem(PLAYER_KEY, JSON.stringify(player))
    }
    return player
  } catch {
    return fallback
  }
}

export function savePlayer(player: Player): Player {
  const next = { id: player.id, name: sanitizeName(player.name) }
  localStorage.setItem(PLAYER_KEY, JSON.stringify(next))
  return next
}

export function savePlayerName(raw: string): Player {
  const current = loadPlayer()
  return savePlayer({ id: current.id, name: raw })
}

export async function fetchLeaderboard(
  mode: QuizMode,
  hardcore: boolean,
  playerId: string,
): Promise<{ entries: LeaderboardEntry[]; configured: boolean }> {
  return fetchRating({ kind: 'mode', mode, hardcore }, playerId)
}

export async function fetchRating(
  board: RatingBoard,
  playerId: string,
): Promise<{ entries: LeaderboardEntry[]; configured: boolean }> {
  const params = new URLSearchParams({ me: playerId })
  if (board.kind === 'xp') {
    params.set('board', 'xp')
  } else if (board.kind === 'clears') {
    params.set('board', 'clears')
    params.set('hardcore', board.hardcore ? '1' : '0')
  } else if (board.kind === 'mode') {
    params.set('board', 'mode')
    params.set('mode', board.mode)
    params.set('hardcore', board.hardcore ? '1' : '0')
  } else {
    return { entries: [], configured: false }
  }
  const response = await fetch(`/api/leaderboard?${params}`, { credentials: 'include', cache: 'no-store' })
  if (!response.ok) return { entries: [], configured: false }
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object') return { entries: [], configured: false }
  const record = body as Record<string, unknown>
  const entries = Array.isArray(record.entries) ? record.entries.filter(isPublicEntry) : []
  return { entries, configured: record.configured !== false }
}

export async function submitCampaign(clears: LevelClear[], mode: QuizMode): Promise<void> {
  const stats = campaignStats(clears, mode, false)
  if (stats.levelsCleared <= 0) return
  await submitRatings(clears, 0)
}

export async function submitRatings(
  clears: LevelClear[],
  xp: number,
  achievements?: AchievementId[],
): Promise<void> {
  const player = loadPlayer()
  if (player.name.length < NAME_MIN) return
  const items: unknown[] = []
  const safeXp = Math.max(0, Math.floor(xp))
  if (safeXp > 0) {
    items.push({ board: 'xp', xp: safeXp, level: accountLevel(safeXp) })
  }
  for (const hardcore of [false, true]) {
    const levelsCleared = uniqueLevelsCleared(clears, hardcore)
    if (levelsCleared <= 0 || levelsCleared > RATING_LEVELS_MAX) continue
    items.push({ board: 'clears', hardcore, levelsCleared })
  }
  for (const mode of LEVEL_MODES) {
    for (const hardcore of [false, true]) {
      const stats = campaignStats(clears, mode, hardcore)
      if (stats.levelsCleared <= 0 || stats.levelsCleared > LEVEL_COUNT) continue
      items.push({
        board: 'mode',
        mode,
        hardcore,
        levelsCleared: stats.levelsCleared,
        totalMs: 0,
      })
    }
  }
  if (items.length === 0 && achievements === undefined) return
  await fetch('/api/leaderboard', {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items,
      ...(achievements !== undefined ? { achievements } : {}),
    }),
  })
}

export interface LevelBest {
  name: string
  roundMs: number
  livesLeft: number
  you?: boolean
}

export async function fetchLevelBests(
  mode: QuizMode,
  hardcore: boolean,
): Promise<Record<number, LevelBest>> {
  const player = loadPlayer()
  const params = new URLSearchParams({
    board: 'levelBests',
    mode,
    hardcore: hardcore ? '1' : '0',
    me: player.id,
  })
  try {
    const response = await fetch(`/api/leaderboard?${params}`, { credentials: 'include', cache: 'no-store' })
    if (!response.ok) return {}
    const body: unknown = await response.json()
    if (!body || typeof body !== 'object') return {}
    const raw = (body as { records?: unknown }).records
    if (!raw || typeof raw !== 'object') return {}
    const records: Record<number, LevelBest> = {}
    for (const [key, value] of Object.entries(raw)) {
      const level = Number(key)
      if (!Number.isInteger(level) || !value || typeof value !== 'object') continue
      const record = value as Record<string, unknown>
      if (typeof record.name !== 'string' || typeof record.roundMs !== 'number') continue
      records[level] = {
        name: record.name,
        roundMs: record.roundMs,
        livesLeft: typeof record.livesLeft === 'number' ? record.livesLeft : 0,
        you: record.you === true,
      }
    }
    return records
  } catch {
    return {}
  }
}

export async function submitLevelBest(input: {
  mode: QuizMode
  level: number
  hardcore: boolean
  roundMs: number
  livesLeft: number
}): Promise<{ beat: boolean; previousName: string | null }> {
  try {
    const response = await fetch('/api/leaderboard', {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board: 'levelBest',
        mode: input.mode,
        level: input.level,
        hardcore: input.hardcore,
        roundMs: input.roundMs,
        livesLeft: input.livesLeft,
      }),
    })
    if (!response.ok) return { beat: false, previousName: null }
    const body: unknown = await response.json()
    if (!body || typeof body !== 'object') return { beat: false, previousName: null }
    const record = body as Record<string, unknown>
    return {
      beat: record.beat === true,
      previousName: typeof record.previousName === 'string' ? record.previousName : null,
    }
  } catch {
    return { beat: false, previousName: null }
  }
}

function isPublicEntry(value: unknown): value is LeaderboardEntry {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  if (typeof record.name !== 'string' || typeof record.levelsCleared !== 'number') return false
  if (typeof record.totalMs !== 'number') return false
  if (record.id !== undefined && (typeof record.id !== 'string' || !isPlayerId(record.id))) return false
  if (record.xp !== undefined && typeof record.xp !== 'number') return false
  if (record.level !== undefined && typeof record.level !== 'number') return false
  return true
}
