import type { QuizMode } from './quiz'

export const LEVELS_KEY = 'un-flag-quiz-levels'

export interface LevelClear {
  level: number
  mode: QuizMode
  hardcore: boolean
  livesLeft: number
  roundMs: number
  at: number
}

export function loadLevelClears(): LevelClear[] {
  return readClears() ?? []
}

export function saveLevelClear(clear: LevelClear): LevelClear[] {
  const previous = loadLevelClears()
  const current = findLevelClear(previous, clear.level, clear.mode)
  const next =
    current && !isBetterClear(clear, current)
      ? previous
      : [...previous.filter((item) => !sameSlot(item, clear)), clear]
  localStorage.setItem(LEVELS_KEY, JSON.stringify(next))
  return next
}

export function findLevelClear(
  clears: LevelClear[],
  level: number,
  mode: QuizMode,
): LevelClear | undefined {
  return clears.find((item) => item.level === level && item.mode === mode)
}

function sameSlot(a: LevelClear, b: LevelClear): boolean {
  return a.level === b.level && a.mode === b.mode
}

function isBetterClear(candidate: LevelClear, current: LevelClear): boolean {
  if (candidate.hardcore !== current.hardcore) return candidate.hardcore
  if (!candidate.hardcore && candidate.livesLeft !== current.livesLeft) {
    return candidate.livesLeft > current.livesLeft
  }
  return candidate.roundMs < current.roundMs
}

function readClears(): LevelClear[] | null {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LEVELS_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isLevelClear)
  } catch {
    return []
  }
}

function isQuizMode(value: unknown): value is QuizMode {
  return value === 'flagToName' || value === 'nameToFlag'
}

function isLevelClear(value: unknown): value is LevelClear {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.level === 'number' &&
    isQuizMode(record.mode) &&
    typeof record.hardcore === 'boolean' &&
    typeof record.livesLeft === 'number' &&
    typeof record.roundMs === 'number' &&
    typeof record.at === 'number'
  )
}
