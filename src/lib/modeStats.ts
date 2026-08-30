import { campaignLevelCount, hasLevels, QUIZ_MODES, RANKING_MODES, type QuizMode } from './quiz'
import type { RoundRecord } from './history'
import { isBetter } from './history'
import type { LevelClear } from './levelProgress'
import { campaignStats } from './leaderboard'

export interface ModeStat {
  mode: QuizMode
  rounds: number
  best: RoundRecord | null
  campaign: number
  campaignTotal: number
}

export function statsByMode(
  history: RoundRecord[],
  bests: RoundRecord[],
  levelClears: LevelClear[],
): ModeStat[] {
  return [...QUIZ_MODES, ...RANKING_MODES].map((mode) => {
    const modeBests = bests.filter((item) => item.mode === mode && !item.mix)
    const best = modeBests.reduce<RoundRecord | null>((current, item) => {
      if (!current || isBetter(item, current)) return item
      return current
    }, null)
    return {
      mode,
      rounds: history.filter((item) => item.mode === mode && !item.mix).length,
      best,
      campaign: hasLevels(mode) ? campaignStats(levelClears, mode, false).levelsCleared : 0,
      campaignTotal: hasLevels(mode) ? campaignLevelCount(mode) : 0,
    }
  })
}
