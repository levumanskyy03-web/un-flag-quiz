import { CAMPAIGN_LEVELS, FINAL_LEVEL, isFinalLevel } from '../data/levels'
import { QUIZ_MODES, isQuizMode, type QuizMode } from './quiz'

export const LEVELS_KEY = 'un-flag-quiz-levels'
const LEVELS_WIPE_KEY = 'un-flag-quiz-levels-wipe-1'

export interface LevelClear {
  level: number
  mode: QuizMode
  hardcore: boolean
  livesLimit?: number
  livesLeft: number
  roundMs: number
  at: number
}

function livesKey(clear: Pick<LevelClear, 'hardcore' | 'livesLimit'>): number {
  const limit = clear.livesLimit
  if (limit !== undefined && limit > 0) return limit
  return clear.hardcore ? 1 : 3
}

export function loadLevelClears(): LevelClear[] {
  wipeLegacyClears()
  const loaded = readClears() ?? []
  const next = keepConsecutive(loaded)
  if (typeof window !== 'undefined' && JSON.stringify(next) !== JSON.stringify(loaded)) {
    localStorage.setItem(LEVELS_KEY, JSON.stringify(next))
  }
  return next
}

export function saveLevelClear(clear: LevelClear): LevelClear[] {
  const previous = loadLevelClears()
  if (!isLevelUnlocked(previous, clear.level, clear.mode)) return previous
  const current = findLevelClear(previous, clear.level, clear.mode)
  const next =
    current && !isBetterClear(clear, current)
      ? previous
      : [...previous.filter((item) => !(item.level === clear.level && item.mode === clear.mode)), clear]
  localStorage.setItem(LEVELS_KEY, JSON.stringify(next))
  return next
}

export function findLevelClear(
  clears: LevelClear[],
  level: number,
  mode: QuizMode,
  livesLimit?: number,
): LevelClear | undefined {
  const matches = clears.filter((item) => item.level === level && item.mode === mode)
  if (livesLimit !== undefined) {
    return matches.find((item) => livesKey(item) === livesLimit)
  }
  return matches.reduce<LevelClear | undefined>(
    (best, item) => (!best || isBetterClear(item, best) ? item : best),
    undefined,
  )
}

export function isLevelUnlocked(clears: LevelClear[], level: number, mode: QuizMode): boolean {
  if (level <= 1) return true
  if (isFinalLevel(level)) {
    return findLevelClear(clears, CAMPAIGN_LEVELS, mode) !== undefined
  }
  return findLevelClear(clears, level - 1, mode) !== undefined
}

function wipeLegacyClears() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(LEVELS_WIPE_KEY) === '1') return
  localStorage.removeItem('un-flag-quiz-levels')
  localStorage.removeItem('un-flag-quiz-levels-v2')
  localStorage.setItem(LEVELS_WIPE_KEY, '1')
}

function keepConsecutive(clears: LevelClear[]): LevelClear[] {
  const kept: LevelClear[] = []
  for (const mode of QUIZ_MODES) {
    const chain: LevelClear[] = []
    for (let level = 1; level <= CAMPAIGN_LEVELS; level++) {
      const hits = clears.filter((item) => item.level === level && item.mode === mode)
      if (hits.length === 0) break
      chain.push(hits.reduce((best, item) => (isBetterClear(item, best) ? item : best)))
    }
    if (chain.some((item) => item.level === CAMPAIGN_LEVELS)) {
      const finals = clears.filter((item) => item.level === FINAL_LEVEL && item.mode === mode)
      if (finals.length > 0) {
        chain.push(finals.reduce((best, item) => (isBetterClear(item, best) ? item : best)))
      }
    }
    kept.push(...chain)
  }
  return kept
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

function isLevelClear(value: unknown): value is LevelClear {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.level === 'number' &&
    isQuizMode(record.mode) &&
    typeof record.hardcore === 'boolean' &&
    (record.livesLimit === undefined || typeof record.livesLimit === 'number') &&
    typeof record.livesLeft === 'number' &&
    typeof record.roundMs === 'number' &&
    typeof record.at === 'number'
  )
}
