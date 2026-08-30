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
  FOOTBALL_MODES,
  LEADERS_MODES,
  LEVEL_MODES,
  QUIZ_MODES,
  RANKING_MODES,
  isAllRegions,
  isCodesMode,
  isFootballMode,
  isLeadersMode,
  isRankingMode,
  parseRegions,
  type QuizDifficulty,
  type QuizMode,
} from './quiz'
import { loadStamps, STAMP_TOTAL } from './stamps'
import { accountLevel } from './xp'

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS
const YEAR_MS = 365 * DAY_MS

export interface AchievementStatus {
  id: AchievementId
  unlocked: boolean
}

function hardPlus(difficulty: QuizDifficulty) {
  return difficulty === 'hard' || difficulty === 'hardcore'
}

function finished(round: RoundRecord, minTotal = 1) {
  return round.endedBy === 'complete' && round.total >= minTotal
}

function accurate(round: RoundRecord, minRatio: number, minTotal = 1) {
  return finished(round, minTotal) && round.correct / round.total >= minRatio
}

function perfect(round: RoundRecord, total: number) {
  return finished(round, total) && round.total === total && round.correct === total
}

function leaderFamily(mode: QuizMode): 'us' | 'pope' | 'rus' | null {
  if (!isLeadersMode(mode)) return null
  if (mode.startsWith('us')) return 'us'
  if (mode.startsWith('pope')) return 'pope'
  return 'rus'
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
  const hardRegionPerfect = new Set<Region>()
  for (const round of completedPool) {
    const regions = parseRegions(round.region)
    if (regions.length !== 1 || !hardPlus(round.difficulty) || !perfect(round, 10)) continue
    hardRegionPerfect.add(regions[0])
  }
  const campaignMax = Math.max(
    0,
    ...LEVEL_MODES.map((mode) => campaignStats(levelClears, mode, false).levelsCleared),
  )
  const hardcoreCampaignMax = Math.max(
    0,
    ...LEVEL_MODES.map((mode) => campaignStats(levelClears, mode, true).levelsCleared),
  )
  const campaignEightModes = LEVEL_MODES.filter(
    (mode) => campaignStats(levelClears, mode, false).levelsCleared >= 8,
  ).length
  const waterCampaignMax = Math.max(
    campaignStats(levelClears, 'seaToName', false).levelsCleared,
    campaignStats(levelClears, 'riverToName', false).levelsCleared,
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
  const rankingModes = new Set(completedPool.filter((round) => isRankingMode(round.mode)).map((round) => round.mode))
  const leaderModes = new Set(completedPool.filter((round) => isLeadersMode(round.mode)).map((round) => round.mode))
  const leaderFamilies = new Set(
    [...leaderModes].map(leaderFamily).filter((item): item is 'us' | 'pope' | 'rus' => item !== null),
  )
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
    completeFive: anyComplete((round) => round.total >= 5 && round.correct >= 4) || levelClears.length > 0,
    campaign1: campaignMax >= 1,
    flagComplete: anyComplete((round) => round.mode === 'flagToName' && accurate(round, 0.6)),
    play10m: lifetime.playMs >= 20 * MINUTE_MS,
    veteranDay: ageMs >= DAY_MS,
    eightOfTen: anyComplete((round) => round.total === 10 && round.correct >= 9),
    perfect5: anyComplete((round) => perfect(round, 5) && hardPlus(round.difficulty)),
    hardComplete: anyComplete((round) => hardPlus(round.difficulty) && accurate(round, 0.7, 5)),
    campaign3: campaignMax >= 5,
    twoModes: completedModes.size >= 4,
    rank5: rank >= 6,
    veteranWeek: ageMs >= 7 * DAY_MS,
    perfect10: anyComplete((round) => perfect(round, 10)),
    fiveRegions: REGIONS.every((region) => namedRegions.has(region)),
    threeModes: completedModes.size >= 6,
    campaign8: campaignMax >= 12,
    hardcoreComplete: anyComplete(
      (round) => round.difficulty === 'hardcore' && accurate(round, 0.8, 10),
    ),
    rank10: rank >= 12,
    play1h: lifetime.playMs >= 2 * HOUR_MS,
    veteranMonth: ageMs >= 30 * DAY_MS,
    perfect20: anyComplete((round) => perfect(round, 20) && hardPlus(round.difficulty)),
    allModes: QUIZ_MODES.every((mode) => completedModes.has(mode)),
    campaign15: campaignMax >= 18,
    hardcoreLevel: levelClears.some((item) => item.hardcore && item.level >= 5),
    completes10: lifetime.completes >= 20,
    rank20: rank >= 25,
    campaign20: campaignMax >= LEVEL_COUNT || levelClears.some((item) => item.level >= LEVEL_COUNT),
    goldTen: hardcoreCampaignMax >= 15,
    goldFinal: levelClears.some(
      (item) => item.level === FINAL_LEVEL && (item.hardcore || item.livesLimit === 1),
    ),
    perfectHardcore: anyComplete(
      (round) => round.difficulty === 'hardcore' && round.total >= 10 && round.correct === round.total,
    ),
    worldPerfect: anyComplete(
      (round) =>
        isAllRegions(round.region) &&
        round.difficulty === 'hardcore' &&
        round.total >= 10 &&
        round.correct === round.total,
    ),
    play10h: lifetime.playMs >= 15 * HOUR_MS,
    recordBreak1: lifetime.recordBreaks >= 1,
    recordBreak10: lifetime.recordBreaks >= 15,
    fbKickoff: footballPool.length > 0 || football.rounds > 0,
    fbFirstGoal: footballPool.some((round) => round.correct > 0),
    fbHatTrick: footballPool.some((round) => round.correct >= 5),
    fbCleanSheet: footballComplete.some((round) => round.total >= 10 && round.correct === round.total),
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
    fbTenMatches: football.completes >= 20,
    fbHardcore: footballComplete.some((round) => round.difficulty === 'hardcore' && finished(round, 10)),
    fbLevel: footballCampaignMax >= 1 || levelClears.some((item) => isFootballMode(item.mode)),
    fbCampaign: footballCampaignFull,
    cdKickoff: codesComplete.length > 0 || pool.some((round) => isCodesMode(round.mode)),
    cdTld: codesComplete.some((round) => round.mode === 'tldToName' || round.mode === 'nameToTld'),
    cdCalling: codesComplete.some((round) => round.mode === 'callingToName' || round.mode === 'nameToCalling'),
    cdCar: codesComplete.some((round) => round.mode === 'carToName' || round.mode === 'nameToCar'),
    cdAllModes: CODES_MODES.every((mode) => codesModes.has(mode)),
    cdPerfect: codesComplete.some((round) => round.total >= 10 && round.correct === round.total),
    cdTen: codesComplete.length >= 20,
    stFirst: stamps >= 1,
    stTen: stamps >= 20,
    stFifty: stamps >= 75,
    stAlbum: stamps >= STAMP_TOTAL,
    msFirst: trainer.completes >= 1,
    msPerfect: trainer.perfects >= 1,
    seaCoast: completedPool.some((round) => round.mode === 'seaToName'),
    riverBank: completedPool.some((round) => round.mode === 'riverToName'),
    waterLevel: waterCampaignMax >= 3,
    langFluent: anyComplete(
      (round) => round.mode === 'nameToLanguage' && perfect(round, 10) && hardPlus(round.difficulty),
    ),
    rankAtlas: rankingModes.size >= 10,
    ldThree: leaderFamilies.size >= 3,
    mixIron: anyComplete((round) => round.mix === 'hard' && perfect(round, 10)),
    stampsCentury: stamps >= 100,
    geoHardTen: anyComplete(
      (round) =>
        isAllRegions(round.region) &&
        round.difficulty === 'hard' &&
        perfect(round, 10) &&
        !isFootballMode(round.mode) &&
        !isCodesMode(round.mode) &&
        !isLeadersMode(round.mode) &&
        !isRankingMode(round.mode),
    ),
    campaignTriple: campaignEightModes >= 3,
    speedTen: anyComplete(
      (round) => perfect(round, 10) && hardPlus(round.difficulty) && round.roundMs > 0 && round.roundMs <= 45_000,
    ),
    fbIron: footballComplete.some((round) => perfect(round, 10) && hardPlus(round.difficulty)),
    mythWorld: anyComplete(
      (round) =>
        isAllRegions(round.region) && round.difficulty === 'hardcore' && perfect(round, 20),
    ),
    mythGoldRoad: hardcoreCampaignMax >= LEVEL_COUNT,
    mythAtlas:
      QUIZ_MODES.every((mode) => completedModes.has(mode)) &&
      FOOTBALL_MODES.every((mode) => footballModes.has(mode)) &&
      CODES_MODES.every((mode) => codesModes.has(mode)) &&
      LEADERS_MODES.every((mode) => leaderModes.has(mode)),
    mythRankings: RANKING_MODES.every((mode) => rankingModes.has(mode)),
    mythRegions: REGIONS.every((region) => hardRegionPerfect.has(region)),
    mythLevel40: rank >= 40,
    mythHundred: lifetime.completes >= 100,
    mythLeaders: LEADERS_MODES.every((mode) => leaderModes.has(mode)),
    veteranYear: ageMs >= YEAR_MS,
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
