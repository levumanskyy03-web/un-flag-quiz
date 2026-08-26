import { ACHIEVEMENTS, type AchievementId } from '../data/achievements'
import { REGIONS, type Region } from '../data/countries'
import { FINAL_LEVEL, LEVEL_COUNT } from '../data/levels'
import type { RoundRecord } from './history'
import { campaignStats } from './leaderboard'
import type { LevelClear } from './levelProgress'
import { countLifetimeSeed, loadLifetime } from './lifetime'
import { LEVEL_MODES, QUIZ_MODES, isAllRegions, parseRegions, type QuizMode } from './quiz'
import { accountLevel } from './xp'

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export interface AchievementStatus {
  id: AchievementId
  unlocked: boolean
}

export function listAchievements(
  history: RoundRecord[],
  bests: RoundRecord[],
  levelClears: LevelClear[],
  createdAt?: number,
): AchievementStatus[] {
  const pool = [...history, ...bests]
  const completedPool = pool.filter((round) => round.endedBy === 'complete')
  const completedModes = new Set<QuizMode>()
  for (const round of completedPool) completedModes.add(round.mode)
  const namedRegions = new Set<Region>()
  for (const round of completedPool) {
    const regions = parseRegions(round.region)
    if (regions.length === 1) namedRegions.add(regions[0])
  }
  const campaignMax = Math.max(
    0,
    ...LEVEL_MODES.map((mode) => campaignStats(levelClears, mode, false).levelsCleared),
  )
  const hardcoreCampaignMax = Math.max(
    0,
    ...LEVEL_MODES.map((mode) => campaignStats(levelClears, mode, true).levelsCleared),
  )
  const lifetime = loadLifetime(countLifetimeSeed(history, levelClears))
  const rank = accountLevel(lifetime.xp)
  const bornAt = createdAt && createdAt > 0 ? createdAt : lifetime.firstSeen
  const ageMs = Math.max(0, Date.now() - bornAt)
  const anyPool = (test: (round: RoundRecord) => boolean) => pool.some(test)
  const anyComplete = (test: (round: RoundRecord) => boolean) => completedPool.some(test)
  const unlocked: Record<AchievementId, boolean> = {
    firstRound: history.length > 0 || bests.length > 0 || levelClears.length > 0 || lifetime.rounds > 0,
    firstHit: anyPool((round) => round.correct > 0) || levelClears.length > 0,
    completeFive:
      anyComplete((round) => round.total >= 5) ||
      levelClears.length > 0,
    campaign1: campaignMax >= 1,
    flagComplete:
      anyComplete((round) => round.mode === 'flagToName') ||
      levelClears.some((item) => item.mode === 'flagToName'),
    play10m: lifetime.playMs >= 10 * MINUTE_MS,
    veteranDay: ageMs >= DAY_MS,
    eightOfTen: anyComplete((round) => round.total === 10 && round.correct >= 8),
    perfect5: anyComplete((round) => round.total === 5 && round.correct === 5),
    hardComplete: anyComplete((round) => round.difficulty === 'hard' || round.difficulty === 'hardcore'),
    campaign3: campaignMax >= 3,
    twoModes: completedModes.size >= 2,
    rank5: rank >= 5,
    veteranWeek: ageMs >= 7 * DAY_MS,
    perfect10: anyComplete((round) => round.total === 10 && round.correct === 10),
    fiveRegions: REGIONS.every((region) => namedRegions.has(region)),
    threeModes: completedModes.size >= 3,
    campaign8: campaignMax >= 8,
    hardcoreComplete: anyComplete((round) => round.difficulty === 'hardcore'),
    rank10: rank >= 10,
    play1h: lifetime.playMs >= HOUR_MS,
    veteranMonth: ageMs >= 30 * DAY_MS,
    perfect20: anyComplete((round) => round.total === 20 && round.correct === 20),
    allModes: QUIZ_MODES.every((mode) => completedModes.has(mode)),
    campaign15: campaignMax >= 15,
    hardcoreLevel: levelClears.some((item) => item.hardcore),
    completes10: lifetime.completes >= 10,
    rank20: rank >= 20,
    campaign20: campaignMax >= LEVEL_COUNT || levelClears.some((item) => item.level >= LEVEL_COUNT),
    goldTen: hardcoreCampaignMax >= 10,
    goldFinal: levelClears.some(
      (item) => item.level === FINAL_LEVEL && (item.hardcore || item.livesLimit === 1),
    ),
    perfectHardcore: anyComplete(
      (round) => round.difficulty === 'hardcore' && round.total >= 10 && round.correct === round.total,
    ),
    worldPerfect: anyComplete(
      (round) =>
        isAllRegions(round.region) &&
        round.total >= 10 &&
        round.correct === round.total &&
        (round.difficulty === 'hard' || round.difficulty === 'hardcore'),
    ),
    play10h: lifetime.playMs >= 10 * HOUR_MS,
    recordBreak1: lifetime.recordBreaks >= 1,
    recordBreak10: lifetime.recordBreaks >= 10,
  }
  return ACHIEVEMENTS.map((item) => ({ id: item.id, unlocked: unlocked[item.id] }))
}

export function unlockedAchievementIds(
  history: RoundRecord[],
  bests: RoundRecord[],
  levelClears: LevelClear[],
  createdAt?: number,
): AchievementId[] {
  return listAchievements(history, bests, levelClears, createdAt)
    .filter((item) => item.unlocked)
    .map((item) => item.id)
}
