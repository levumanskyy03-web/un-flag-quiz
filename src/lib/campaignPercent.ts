import {
  campaignLevelCount,
  hasLevels,
  isWaterMapMode,
  levelQuestionCount,
  MAX_LIVES,
  type QuizMode,
} from './quiz'
import { findLevelClear, type LevelClear } from './levelProgress'

/** Flag → country: 17 s for a 10-country level. */
export const IDEAL_MS_PER_ITEM = 1_700

export function idealRoundMs(mode: QuizMode, level: number): number {
  const count = levelQuestionCount(level, mode)
  if (count <= 0) return 0
  return Math.round(count * IDEAL_MS_PER_ITEM * modePace(mode))
}

export function modeCampaignPercent(clears: LevelClear[], mode: QuizMode): number | null {
  if (!hasLevels(mode)) return null
  const total = campaignLevelCount(mode)
  if (total <= 0) return null

  let accuracySum = 0
  let timeSum = 0
  for (let level = 1; level <= total; level += 1) {
    const clear = findLevelClear(clears, level, mode)
    if (!clear) continue
    accuracySum += clearAccuracy(clear)
    timeSum += clearTime(clear, mode, level)
  }

  const accuracyAvg = accuracySum / total
  const timeAvg = timeSum / total
  if (accuracyAvg >= 1 && timeAvg >= 1) return 100
  const raw = accuracyAvg * 90 + timeAvg * 10
  if (raw <= 0) return 0
  return Math.max(0, Math.min(99, Math.round(raw)))
}

function modePace(mode: QuizMode): number {
  if (mode === 'nameToMap') return 25 / 17
  if (mode === 'mapToName' || isWaterMapMode(mode)) return 20 / 17
  return 1
}

function clearAccuracy(clear: LevelClear): number {
  if (clear.hardcore) return 1
  const limit = clear.livesLimit && clear.livesLimit > 0 ? clear.livesLimit : MAX_LIVES
  const left = Math.max(0, Math.min(limit, clear.livesLeft))
  if (left >= limit) return 1
  return left / limit
}

function clearTime(clear: LevelClear, mode: QuizMode, level: number): number {
  const ideal = idealRoundMs(mode, level)
  if (ideal <= 0 || clear.roundMs <= 0) return 0
  return Math.min(1, ideal / clear.roundMs)
}
