import type { RoundRecord } from './history'
import type { LevelClear } from './levelProgress'
import { clearBestXp } from './xp'

const LIFETIME_KEY = 'un-flag-quiz-lifetime'
const XP_SCHEMA = 2

export interface LifetimeStats {
  rounds: number
  completes: number
  xp: number
  playMs: number
  firstSeen: number
  recordBreaks: number
}

export function countLifetimeSeed(history: RoundRecord[], clears: LevelClear[]): LifetimeStats {
  const stamps = [...history.map((round) => round.at), ...clears.map((clear) => clear.at)].filter(
    (at) => Number.isFinite(at) && at > 0,
  )
  return {
    rounds: history.length + clears.length,
    completes: history.filter((round) => round.endedBy === 'complete').length + clears.length,
    xp: clears.reduce((sum, clear) => sum + clearBestXp(clear), 0),
    playMs:
      history.reduce((sum, round) => sum + Math.max(0, round.roundMs), 0) +
      clears.reduce((sum, clear) => sum + Math.max(0, clear.roundMs), 0),
    firstSeen: stamps.length > 0 ? Math.min(...stamps) : Date.now(),
    recordBreaks: 0,
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
      playMs: play.playMs,
      firstSeen: play.firstSeen,
      recordBreaks: stored.recordBreaks,
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
): LifetimeStats {
  const current = loadLifetime(seedIfEmpty)
  const next: LifetimeStats = {
    rounds: current.rounds + 1,
    completes: current.completes + (complete ? 1 : 0),
    xp: current.xp + Math.max(0, Math.floor(xpGain)),
    playMs: current.playMs + Math.max(0, Math.floor(playMs)),
    firstSeen: current.firstSeen,
    recordBreaks: current.recordBreaks,
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

function emptyLifetime(): LifetimeStats {
  return { rounds: 0, completes: 0, xp: 0, playMs: 0, firstSeen: Date.now(), recordBreaks: 0 }
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
  schema: number
  playMs: number | null
  firstSeen: number | null
  recordBreaks: number
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
    return { rounds: record.rounds, completes: record.completes, xp, schema, playMs, firstSeen, recordBreaks }
  } catch {
    return null
  }
}

function writeLifetime(stats: LifetimeStats): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LIFETIME_KEY, JSON.stringify({ ...stats, xpSchema: XP_SCHEMA }))
}
