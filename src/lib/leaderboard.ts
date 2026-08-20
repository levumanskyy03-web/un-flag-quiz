import { LEVEL_COUNT } from '../data/levels'
import type { LevelClear } from './levelProgress'
import type { QuizMode } from './quiz'

export const PLAYER_KEY = 'un-flag-quiz-player'
export const LEADERBOARD_LIMIT = 20
export const NAME_MIN = 2
export const NAME_MAX = 24

export interface Player {
  id: string
  name: string
}

export interface LeaderboardEntry {
  name: string
  levelsCleared: number
  totalMs: number
  you?: boolean
}

export interface CampaignStats {
  levelsCleared: number
  totalMs: number
}

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

export function isBetterCampaign(candidate: CampaignStats, current: CampaignStats): boolean {
  if (candidate.levelsCleared !== current.levelsCleared) {
    return candidate.levelsCleared > current.levelsCleared
  }
  return candidate.totalMs < current.totalMs
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

export function savePlayerName(raw: string): Player {
  const current = loadPlayer()
  const player = { id: current.id, name: sanitizeName(raw) }
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player))
  return player
}

export async function fetchLeaderboard(
  mode: QuizMode,
  hardcore: boolean,
  playerId: string,
): Promise<{ entries: LeaderboardEntry[]; configured: boolean }> {
  const params = new URLSearchParams({
    mode,
    hardcore: hardcore ? '1' : '0',
    me: playerId,
  })
  const response = await fetch(`/api/leaderboard?${params}`)
  if (!response.ok) return { entries: [], configured: false }
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object') return { entries: [], configured: false }
  const record = body as Record<string, unknown>
  const entries = Array.isArray(record.entries) ? record.entries.filter(isPublicEntry) : []
  return { entries, configured: record.configured !== false }
}

export async function submitCampaign(clears: LevelClear[], mode: QuizMode): Promise<void> {
  const player = loadPlayer()
  if (player.name.length < NAME_MIN) return
  const boards = [false]
  if (campaignStats(clears, mode, true).levelsCleared > 0) boards.push(true)
  await Promise.all(
    boards.map(async (hardcore) => {
      const stats = campaignStats(clears, mode, hardcore)
      if (stats.levelsCleared <= 0 || stats.levelsCleared > LEVEL_COUNT) return
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: player.id,
          name: player.name,
          mode,
          hardcore,
          levelsCleared: stats.levelsCleared,
          totalMs: stats.totalMs,
        }),
      })
    }),
  )
}

function isPublicEntry(value: unknown): value is LeaderboardEntry {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.name === 'string' &&
    typeof record.levelsCleared === 'number' &&
    typeof record.totalMs === 'number'
  )
}
