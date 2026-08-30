import type { RoundRecord } from './history'
import type { LevelClear } from './levelProgress'
import { FOOTBALL_MODES, isFootballMode, type FootballMode, type QuizWorld } from './quiz'
import { clearBestXp } from './xp'

const LIFETIME_KEY = 'un-flag-quiz-lifetime'
const XP_SCHEMA = 2

export interface FootballLifetime {
  rounds: number
  completes: number
  perfects: number
  playMs: number
  modes: FootballMode[]
}

export interface LifetimeStats {
  rounds: number
  completes: number
  xp: number
  xpByWorld: Record<QuizWorld, number>
  playMs: number
  firstSeen: number
  recordBreaks: number
  football: FootballLifetime
}

export function emptyXpByWorld(): Record<QuizWorld, number> {
  return { geo: 0, football: 0, codes: 0, leaders: 0 }
}

export function emptyFootballLifetime(): FootballLifetime {
  return { rounds: 0, completes: 0, perfects: 0, playMs: 0, modes: [] }
}

export function countLifetimeSeed(history: RoundRecord[], clears: LevelClear[]): LifetimeStats {
  const stamps = [...history.map((round) => round.at), ...clears.map((clear) => clear.at)].filter(
    (at) => Number.isFinite(at) && at > 0,
  )
  return {
    rounds: history.length + clears.length,
    completes: history.filter((round) => round.endedBy === 'complete').length + clears.length,
    xp: clears.reduce((sum, clear) => sum + clearBestXp(clear), 0),
    xpByWorld: emptyXpByWorld(),
    playMs:
      history.reduce((sum, round) => sum + Math.max(0, round.roundMs), 0) +
      clears.reduce((sum, clear) => sum + Math.max(0, clear.roundMs), 0),
    firstSeen: stamps.length > 0 ? Math.min(...stamps) : Date.now(),
    recordBreaks: 0,
    football: emptyFootballLifetime(),
  }
}

export function loadLifetime(seedIfEmpty?: LifetimeStats): LifetimeStats {
  const stored = readLifetime()
  if (stored) {
    const play = mergePlay(stored, seedIfEmpty)
    const xp =
      stored.xp !== null && stored.schema === XP_SCHEMA ? stored.xp : (seedIfEmpty?.xp ?? stored.xp ?? 0)
    const next: LifetimeStats = {
      rounds: stored.rounds,
      completes: stored.completes,
      xp,
      xpByWorld: stored.xpByWorld,
      playMs: play.playMs,
      firstSeen: play.firstSeen,
      recordBreaks: stored.recordBreaks,
      football: stored.football,
    }
    if (
      stored.xp !== next.xp ||
      stored.schema !== XP_SCHEMA ||
      stored.playMs !== next.playMs ||
      stored.firstSeen !== next.firstSeen
    ) {
      writeLifetime(next)
    }
    return next
  }
  if (seedIfEmpty) {
    writeLifetime(seedIfEmpty)
    return seedIfEmpty
  }
  return emptyLifetime()
}

export function seedLifetimeIfEmpty(seed: LifetimeStats): LifetimeStats {
  return loadLifetime(seed)
}

export function bumpLifetime(
  complete: boolean,
  seedIfEmpty: LifetimeStats,
  xpGain = 0,
  playMs = 0,
  world?: QuizWorld,
): LifetimeStats {
  const current = loadLifetime(seedIfEmpty)
  const gain = Math.max(0, Math.floor(xpGain))
  const xpByWorld = { ...current.xpByWorld }
  if (world && gain > 0) xpByWorld[world] += gain
  const next: LifetimeStats = {
    rounds: current.rounds + 1,
    completes: current.completes + (complete ? 1 : 0),
    xp: current.xp + gain,
    xpByWorld,
    playMs: current.playMs + Math.max(0, Math.floor(playMs)),
    firstSeen: current.firstSeen,
    recordBreaks: current.recordBreaks,
    football: current.football,
  }
  writeLifetime(next)
  return next
}

export function addPlayMs(ms: number, seedIfEmpty: LifetimeStats): LifetimeStats {
  const current = loadLifetime(seedIfEmpty)
  const next: LifetimeStats = {
    ...current,
    playMs: current.playMs + Math.max(0, Math.floor(ms)),
  }
  writeLifetime(next)
  return next
}

export function bumpRecordBreaks(seedIfEmpty: LifetimeStats): LifetimeStats {
  const current = loadLifetime(seedIfEmpty)
  const next: LifetimeStats = {
    ...current,
    recordBreaks: current.recordBreaks + 1,
  }
  writeLifetime(next)
  return next
}

export function bumpFootballLifetime(
  seedIfEmpty: LifetimeStats,
  input: {
    complete: boolean
    perfect: boolean
    playMs: number
    mode: FootballMode
  },
): LifetimeStats {
  const current = loadLifetime(seedIfEmpty)
  const modes = new Set(current.football.modes)
  if (input.complete) modes.add(input.mode)
  const next: LifetimeStats = {
    ...current,
    football: {
      rounds: current.football.rounds + 1,
      completes: current.football.completes + (input.complete ? 1 : 0),
      perfects: current.football.perfects + (input.perfect ? 1 : 0),
      playMs: current.football.playMs + Math.max(0, Math.floor(input.playMs)),
      modes: FOOTBALL_MODES.filter((mode) => modes.has(mode)),
    },
  }
  writeLifetime(next)
  return next
}

function emptyLifetime(): LifetimeStats {
  return {
    rounds: 0,
    completes: 0,
    xp: 0,
    xpByWorld: emptyXpByWorld(),
    playMs: 0,
    firstSeen: Date.now(),
    recordBreaks: 0,
    football: emptyFootballLifetime(),
  }
}

function mergePlay(
  stored: { playMs: number | null; firstSeen: number | null },
  seed?: LifetimeStats,
): { playMs: number; firstSeen: number } {
  const now = Date.now()
  return {
    playMs: Math.max(stored.playMs ?? 0, seed?.playMs ?? 0),
    firstSeen: Math.min(stored.firstSeen ?? now, seed?.firstSeen ?? now),
  }
}

function readLifetime(): {
  rounds: number
  completes: number
  xp: number | null
  xpByWorld: Record<QuizWorld, number>
  schema: number
  playMs: number | null
  firstSeen: number | null
  recordBreaks: number
  football: FootballLifetime
} | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(LIFETIME_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const record = parsed as Record<string, unknown>
    if (typeof record.rounds !== 'number' || typeof record.completes !== 'number') return null
    const xp =
      typeof record.xp === 'number' && Number.isFinite(record.xp) && record.xp >= 0 ? Math.floor(record.xp) : null
    const schema = typeof record.xpSchema === 'number' ? record.xpSchema : 0
    const playMs =
      typeof record.playMs === 'number' && Number.isFinite(record.playMs) && record.playMs >= 0
        ? Math.floor(record.playMs)
        : null
    const firstSeen =
      typeof record.firstSeen === 'number' && Number.isFinite(record.firstSeen) && record.firstSeen > 0
        ? Math.floor(record.firstSeen)
        : null
    const recordBreaks =
      typeof record.recordBreaks === 'number' && Number.isFinite(record.recordBreaks) && record.recordBreaks >= 0
        ? Math.floor(record.recordBreaks)
        : 0
    return {
      rounds: record.rounds,
      completes: record.completes,
      xp,
      xpByWorld: parseXpByWorld(record.xpByWorld),
      schema,
      playMs,
      firstSeen,
      recordBreaks,
      football: parseFootball(record.football),
    }
  } catch {
    return null
  }
}

function parseXpByWorld(value: unknown): Record<QuizWorld, number> {
  const next = emptyXpByWorld()
  if (!value || typeof value !== 'object') return next
  const record = value as Record<string, unknown>
  for (const world of ['geo', 'football', 'codes', 'leaders'] as const) {
    const amount = record[world]
    if (typeof amount === 'number' && Number.isFinite(amount) && amount >= 0) {
      next[world] = Math.floor(amount)
    }
  }
  return next
}

function parseFootball(value: unknown): FootballLifetime {
  if (!value || typeof value !== 'object') return emptyFootballLifetime()
  const record = value as Record<string, unknown>
  const modes = Array.isArray(record.modes)
    ? record.modes.filter((item): item is FootballMode => isFootballMode(item))
    : []
  const n = (key: string) =>
    typeof record[key] === 'number' && Number.isFinite(record[key]) && (record[key] as number) >= 0
      ? Math.floor(record[key] as number)
      : 0
  return {
    rounds: n('rounds'),
    completes: n('completes'),
    perfects: n('perfects'),
    playMs: n('playMs'),
    modes: FOOTBALL_MODES.filter((mode) => modes.includes(mode)),
  }
}

function writeLifetime(stats: LifetimeStats): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LIFETIME_KEY, JSON.stringify({ ...stats, xpSchema: XP_SCHEMA }))
}
