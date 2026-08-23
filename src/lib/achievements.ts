import { ACHIEVEMENTS, type AchievementId } from '../data/achievements'
import { REGIONS, type Region } from '../data/countries'
import { LEVEL_COUNT } from '../data/levels'
import type { RoundRecord } from './history'
import { campaignStats } from './leaderboard'
import type { LevelClear } from './levelProgress'
import { LEVEL_MODES, QUIZ_MODES, parseRegions, type QuizMode } from './quiz'

export interface AchievementStatus {
  id: AchievementId
  unlocked: boolean
}

export function listAchievements(
  history: RoundRecord[],
  bests: RoundRecord[],
  levelClears: LevelClear[],
): AchievementStatus[] {
  const rounds = [...history, ...bests]
  const modes = new Set<QuizMode>()
  for (const round of rounds) modes.add(round.mode)
  const namedRegions = new Set<Region>()
  for (const round of rounds) {
    const regions = parseRegions(round.region)
    if (regions.length === 1) namedRegions.add(regions[0])
  }
  const campaignMax = Math.max(0, ...LEVEL_MODES.map((mode) => campaignStats(levelClears, mode, false).levelsCleared))
  const played = (mode: QuizMode) => modes.has(mode)
  const anyRound = (test: (round: RoundRecord) => boolean) => rounds.some(test)
  const unlocked: Record<AchievementId, boolean> = {
    firstRound: history.length > 0 || bests.length > 0,
    firstHit: anyRound((round) => round.correct > 0),
    sharp: anyRound((round) => round.total > 0 && round.correct / round.total >= 0.8),
    perfect: anyRound((round) => round.total > 0 && round.correct === round.total),
    perfect10: anyRound((round) => round.total === 10 && round.correct === 10),
    perfect20: anyRound((round) => round.total === 20 && round.correct === 20),
    sprinter: anyRound((round) => round.endedBy === 'complete' && round.roundMs < 45_000),
    flagToName: played('flagToName'),
    nameToFlag: played('nameToFlag'),
    nameToCapital: played('nameToCapital'),
    nameToCurrency: played('nameToCurrency'),
    nameToPopulation: played('nameToPopulation'),
    nameToFounded: played('nameToFounded'),
    neighborsToName: played('neighborsToName'),
    nameToMap: played('nameToMap'),
    mapToName: played('mapToName'),
    allModes: QUIZ_MODES.every((mode) => modes.has(mode)),
    campaign1: campaignMax >= 1,
    campaign5: campaignMax >= 5,
    campaign10: campaignMax >= 10,
    campaign20: campaignMax >= LEVEL_COUNT || levelClears.some((item) => item.level >= LEVEL_COUNT),
    hardcore: anyRound((round) => round.difficulty === 'hardcore') || levelClears.some((item) => item.hardcore),
    threeRegions: namedRegions.size >= 3,
    fiveRegions: REGIONS.every((region) => namedRegions.has(region)),
    tenRounds: history.length >= 10,
  }
  return ACHIEVEMENTS.map((item) => ({ id: item.id, unlocked: unlocked[item.id] }))
}
