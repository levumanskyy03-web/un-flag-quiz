import { ACHIEVEMENTS, type AchievementId } from '../data/achievements'
import { REGIONS, type Region } from '../data/countries'
import { footballCampaignLevels } from '../data/footballLevels'
import { FINAL_LEVEL, LEVEL_COUNT } from '../data/levels'
import type { RoundRecord } from './history'
import { campaignStats } from './leaderboard'
import type { LevelClear } from './levelProgress'
import { countLifetimeSeed, loadLifetime } from './lifetime'
import { loadTrainerStats } from './mistakes'
import {
  CODES_MODES,
  LEVEL_MODES,
  QUIZ_MODES,
  FOOTBALL_MODES,
  isAllRegions,
  isCodesMode,
  isFootballMode,
  parseRegions,
  type QuizMode,
} from './quiz'
import { loadStamps, STAMP_TOTAL } from './stamps'
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
  const football = lifetime.football
  const footballPool = pool.filter((round) => isFootballMode(round.mode))
  const footballComplete = completedPool.filter((round) => isFootballMode(round.mode))
  const footballModes = new Set<QuizMode>([...football.modes, ...footballComplete.map((round) => round.mode)])
  const footballCampaignMax = Math.max(
    0,
    ...FOOTBALL_MODES.map((mode) => campaignStats(levelClears, mode, false).levelsCleared),
  )
  const footballCampaignFull = FOOTBALL_MODES.some((mode) => {
    const needed = footballCampaignLevels(mode)
    return needed > 0 && campaignStats(levelClears, mode, false).levelsCleared >= needed
  })
  const codesComplete = completedPool.filter((round) => isCodesMode(round.mode))
  const codesModes = new Set(codesComplete.map((round) => round.mode))
  const stamps = loadStamps().length
  const trainer = loadTrainerStats()
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
    fbKickoff: footballPool.length > 0 || football.rounds > 0,
    fbFirstGoal: footballPool.some((round) => round.correct > 0),
    fbHatTrick: footballPool.some((round) => round.correct >= 3),
    fbCleanSheet: footballComplete.some((round) => round.total >= 5 && round.correct === round.total),
    fbWorldCup: footballComplete.some((round) => round.mode === 'wcWinners'),
    fbFinal: footballComplete.some((round) => round.mode === 'wcFinalists'),
    fbHosts: footballComplete.some((round) => round.mode === 'wcHosts'),
    fbYears: footballComplete.some((round) => round.mode === 'wcTitleYears'),
    fbEuro: footballComplete.some((round) => round.mode === 'euroWinners'),
    fbAllModes: FOOTBALL_MODES.every((mode) => footballModes.has(mode)),
    fbPerfect10: footballComplete.some((round) => round.total >= 10 && round.correct === round.total),
    fbHard: footballComplete.some(
      (round) =>
        (round.mode === 'wcHosts' || round.mode === 'euroWinners') &&
        (round.difficulty === 'hard' || round.difficulty === 'hardcore'),
    ),
    fbTenMatches: football.completes >= 10,
    fbHardcore: footballComplete.some((round) => round.difficulty === 'hardcore'),
    fbLevel: footballCampaignMax >= 1 || levelClears.some((item) => isFootballMode(item.mode)),
    fbCampaign: footballCampaignFull,
    cdKickoff: codesComplete.length > 0 || pool.some((round) => isCodesMode(round.mode)),
    cdTld: codesComplete.some((round) => round.mode === 'tldToName' || round.mode === 'nameToTld'),
    cdCalling: codesComplete.some((round) => round.mode === 'callingToName' || round.mode === 'nameToCalling'),
    cdCar: codesComplete.some((round) => round.mode === 'carToName' || round.mode === 'nameToCar'),
    cdAllModes: CODES_MODES.every((mode) => codesModes.has(mode)),
    cdPerfect: codesComplete.some((round) => round.total >= 10 && round.correct === round.total),
    cdTen: codesComplete.length >= 10,
    stFirst: stamps >= 1,
    stTen: stamps >= 10,
    stFifty: stamps >= 50,
    stAlbum: stamps >= STAMP_TOTAL,
    msFirst: trainer.completes >= 1,
    msPerfect: trainer.perfects >= 1,
    seaCoast: completedPool.some((round) => round.mode === 'seaToName') || pool.some((round) => round.mode === 'seaToName'),
    riverBank: completedPool.some((round) => round.mode === 'riverToName') || pool.some((round) => round.mode === 'riverToName'),
    waterLevel: levelClears.some((item) => item.mode === 'seaToName' || item.mode === 'riverToName'),
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
