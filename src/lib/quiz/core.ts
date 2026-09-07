import { COUNTRIES, REGIONS, type Country, type Difficulty, type Region } from '../../data/countries'
import { clubNation } from '../../data/footballClubs'
import { footballTeamCountry, isNamedFootballTeam } from '../../data/worldCup'
import { isRankingEasy, isRankingMode, RANKING_MODES, type RankingMode } from '../../data/rankings'
import { isEasyForMode, factsDifficultyOf, languageDifficultyOf } from '../../data/modeDifficulty'
import { quizLanguageId } from '../../data/languages'
import { isFinalLevel } from '../../data/levels'
import { isWaterMapMode, isWaterMode } from '../../data/water'
import { localeTag, type Lang } from '../../i18n/lang'
import { clueSequence, type FactClue } from '../countryFacts'
import { playerClueSequence, type PlayerFactClue } from '../playerFacts'
import { FACTS_CLUE_TIME_MS } from '../factsRules'
import type { LeaderKind } from '../../data/leaders'

export type { Country, Difficulty, Region } from '../../data/countries'
export { isRankingMode, RANKING_MODES, type RankingMode } from '../../data/rankings'
export { isWaterMapMode, isWaterMode, waterCampaignLevels, waterLevelNumbers, waterName } from '../../data/water'
export { FACTS_CLUE_TIME_MS }

export const QUIZ_MODES = [
  'flagToName',
  'nameToFlag',
  'nameToCapital',
  'nameToCurrency',
  'nameToPopulation',
  'nameToFounded',
  'neighborsToName',
  'nameToMap',
  'mapToName',
  'factsToName',
  'mapToSea',
  'mapToRiver',
  'seaToName',
  'riverToName',
  'nameToLanguage',
  'nameToGov',
] as const
export const WC_FOOTBALL_MODES = ['wcWinners', 'wcFinalists', 'wcHosts', 'wcTitleYears', 'wcScorers'] as const
export const EURO_FOOTBALL_MODES = ['euroWinners', 'euroFinalists', 'euroHosts', 'euroTitleYears'] as const
export const OTHER_FOOTBALL_MODES = [
  'copaWinners',
  'copaFinalists',
  'copaHosts',
  'afconWinners',
  'afconFinalists',
  'afconHosts',
  'asianCupWinners',
  'goldCupWinners',
  'nationsLeagueWinners',
] as const
export const CLUB_FOOTBALL_MODES = [
  'uclWinners',
  'uclFinalists',
  'uclTitleYears',
  'europaWinners',
  'libertadoresWinners',
  'leagueWinners',
  'clubCrestToName',
  'stadiumToClub',
] as const
export const PLAYER_FOOTBALL_MODES = [
  'playerPhotoToName',
  'playerFactsToName',
  'playerToNation',
  'playerToClub',
  'playerClubToName',
  'playerShirtToName',
  'ballonDorWinners',
  'goldenBallWinners',
] as const
export const MANAGER_FOOTBALL_MODES = ['managerPhotoToName'] as const
export const FOOTBALL_MODES = [
  ...WC_FOOTBALL_MODES,
  ...EURO_FOOTBALL_MODES,
  ...OTHER_FOOTBALL_MODES,
  ...CLUB_FOOTBALL_MODES,
  ...PLAYER_FOOTBALL_MODES,
  ...MANAGER_FOOTBALL_MODES,
] as const
export const CODES_MODES = ['tldToName', 'nameToTld', 'callingToName', 'nameToCalling', 'carToName', 'nameToCar'] as const
export const LEADERS_MODES = [
  'usYearsToName',
  'usNumberToName',
  'usPhotoToName',
  'popeYearsToName',
  'popeNumberToName',
  'popePhotoToName',
  'rusYearsToName',
  'rusPhotoToName',
  'ukYearsToName',
  'ukPhotoToName',
] as const
export type FootballMode = (typeof FOOTBALL_MODES)[number]
export type CodesMode = (typeof CODES_MODES)[number]
export type LeadersMode = (typeof LEADERS_MODES)[number]
export const LEADERS_TOPICS = ['us', 'pope', 'rus', 'uk'] as const
export const LEADERS_ASKS = ['years', 'number', 'photo'] as const
export type LeaderAsk = (typeof LEADERS_ASKS)[number]
export type QuizMode = (typeof QUIZ_MODES)[number] | FootballMode | CodesMode | LeadersMode | RankingMode
export const LEVEL_MODES: QuizMode[] = QUIZ_MODES.filter(
  (mode) =>
    mode !== 'neighborsToName' && mode !== 'factsToName' && mode !== 'nameToLanguage' && mode !== 'nameToGov',
)
export const EASY_MIX_MODES: QuizMode[] = ['flagToName', 'nameToFlag', 'nameToCapital']
export const HARD_MIX_MODES: QuizMode[] = [
  'flagToName',
  'nameToFlag',
  'nameToCapital',
  'nameToCurrency',
  'nameToPopulation',
  'nameToFounded',
  'neighborsToName',
  'nameToMap',
  'mapToName',
  'mapToSea',
  'mapToRiver',
  'seaToName',
  'riverToName',
]
export const EASY_FOOTBALL_MIX_MODES: FootballMode[] = ['wcWinners', 'euroWinners', 'wcHosts', 'uclWinners']
export const HARD_FOOTBALL_MIX_MODES: FootballMode[] = FOOTBALL_MODES.filter(
  (mode) => mode !== 'playerFactsToName',
)
export const MIX_KINDS = ['easy', 'hard'] as const
export type MixKind = (typeof MIX_KINDS)[number]

export function isMixKind(value: unknown): value is MixKind {
  return value === 'easy' || value === 'hard'
}

export function modesForFootballMix(mix: MixKind): FootballMode[] {
  return mix === 'easy' ? [...EASY_FOOTBALL_MIX_MODES] : [...HARD_FOOTBALL_MIX_MODES]
}

export function modesForMix(mix: MixKind, world: QuizWorld = 'geo'): QuizMode[] {
  if (world === 'football') return modesForFootballMix(mix)
  return mix === 'easy' ? [...EASY_MIX_MODES] : [...HARD_MIX_MODES]
}

export function isQuizMode(value: unknown): value is QuizMode {
  return (
    typeof value === 'string' &&
    ((QUIZ_MODES as readonly string[]).includes(value) ||
      (FOOTBALL_MODES as readonly string[]).includes(value) ||
      (CODES_MODES as readonly string[]).includes(value) ||
      (LEADERS_MODES as readonly string[]).includes(value) ||
      isRankingMode(value))
  )
}

export function isFootballMode(value: unknown): value is FootballMode {
  return typeof value === 'string' && (FOOTBALL_MODES as readonly string[]).includes(value)
}

export function isCodesMode(value: unknown): value is CodesMode {
  return typeof value === 'string' && (CODES_MODES as readonly string[]).includes(value)
}

export function isLeadersMode(value: unknown): value is LeadersMode {
  return (
    typeof value === 'string' &&
    ((LEADERS_MODES as readonly string[]).includes(value) || value === 'rusNumberToName')
  )
}

export const QUIZ_WORLDS = ['geo', 'football', 'codes', 'leaders'] as const
export type QuizWorld = (typeof QUIZ_WORLDS)[number]

export function isQuizWorld(value: unknown): value is QuizWorld {
  return typeof value === 'string' && (QUIZ_WORLDS as readonly string[]).includes(value)
}

export function worldOfMode(mode: QuizMode): QuizWorld {
  if (isFootballMode(mode)) return 'football'
  if (isCodesMode(mode)) return 'codes'
  if (isLeadersMode(mode)) return 'leaders'
  return 'geo'
}

export function leaderKindOf(mode: QuizMode): LeaderKind | null {
  if (mode.startsWith('rus')) return 'rus'
  if (mode.startsWith('pope')) return 'pope'
  if (mode.startsWith('uk')) return 'uk'
  if (mode.startsWith('us')) return 'us'
  return null
}

export function leadersAskOf(mode: QuizMode): LeaderAsk {
  if (isLeaderPhotoMode(mode)) return 'photo'
  if (isLeaderNumberPrompt(mode)) return 'number'
  return 'years'
}

export function leadersAsksOf(kind: LeaderKind): LeaderAsk[] {
  if (kind === 'rus' || kind === 'uk') return ['years', 'photo']
  return ['years', 'number', 'photo']
}

export function leadersModeOf(kind: LeaderKind, ask: LeaderAsk): LeadersMode {
  const allowed = leadersAsksOf(kind)
  const safe: LeaderAsk = allowed.includes(ask) ? ask : 'years'
  if (kind === 'us') {
    if (safe === 'number') return 'usNumberToName'
    if (safe === 'photo') return 'usPhotoToName'
    return 'usYearsToName'
  }
  if (kind === 'pope') {
    if (safe === 'number') return 'popeNumberToName'
    if (safe === 'photo') return 'popePhotoToName'
    return 'popeYearsToName'
  }
  if (kind === 'uk') {
    if (safe === 'photo') return 'ukPhotoToName'
    return 'ukYearsToName'
  }
  if (safe === 'photo') return 'rusPhotoToName'
  return 'rusYearsToName'
}

export function isLeaderPhotoMode(mode: QuizMode): boolean {
  return (
    mode === 'usPhotoToName' ||
    mode === 'popePhotoToName' ||
    mode === 'rusPhotoToName' ||
    mode === 'ukPhotoToName'
  )
}

export function isLeaderYearsPrompt(mode: QuizMode): boolean {
  return (
    mode === 'usYearsToName' ||
    mode === 'popeYearsToName' ||
    mode === 'rusYearsToName' ||
    mode === 'ukYearsToName'
  )
}

export function isLeaderNumberPrompt(mode: QuizMode): boolean {
  return mode === 'usNumberToName' || mode === 'popeNumberToName'
}

export function isCodePromptMode(mode: QuizMode): boolean {
  return mode === 'tldToName' || mode === 'callingToName' || mode === 'carToName'
}

export function isCodeOptionMode(mode: QuizMode): boolean {
  return mode === 'nameToTld' || mode === 'nameToCalling' || mode === 'nameToCar'
}

export function footballHasDifficulty(mode: QuizMode): boolean {
  return isFootballMode(mode)
}

export function isFootballTeamChoice(mode: QuizMode): boolean {
  return (
    isFootballMode(mode) &&
    !isFootballYearChoice(mode) &&
    !isPlayerFootballMode(mode) &&
    !isManagerFootballMode(mode)
  )
}

export function isFootballYearChoice(mode: QuizMode): boolean {
  return mode === 'wcTitleYears' || mode === 'euroTitleYears' || mode === 'uclTitleYears'
}

export function uniqueModes(modes: readonly unknown[]): QuizMode[] {
  const seen = new Set<QuizMode>()
  const next: QuizMode[] = []
  for (const mode of modes) {
    if (!isQuizMode(mode) || seen.has(mode)) continue
    seen.add(mode)
    next.push(mode)
  }
  return next
}

export function orderedModes(modes: readonly unknown[]): QuizMode[] {
  const set = new Set(uniqueModes(modes))
  const geo = [...QUIZ_MODES, ...RANKING_MODES].filter((mode) => set.has(mode))
  if (geo.length > 0) return geo
  const football = FOOTBALL_MODES.filter((mode) => set.has(mode))
  if (football.length > 0) return football
  const codes = CODES_MODES.filter((mode) => set.has(mode))
  if (codes.length > 0) return codes
  return LEADERS_MODES.filter((mode) => set.has(mode))
}

export function sameModes(a: readonly QuizMode[], b: readonly QuizMode[]): boolean {
  if (a.length !== b.length) return false
  const set = new Set(a)
  return b.every((mode) => set.has(mode))
}

export function isFactMode(mode: QuizMode): boolean {
  return (
    mode === 'nameToCapital' ||
    mode === 'nameToCurrency' ||
    mode === 'nameToPopulation' ||
    mode === 'nameToFounded' ||
    mode === 'nameToLanguage' ||
    mode === 'nameToGov'
  )
}

export function isMapMode(mode: QuizMode): boolean {
  return mode === 'nameToMap' || mode === 'mapToName'
}

export function isFactsToName(mode: QuizMode): boolean {
  return mode === 'factsToName' || mode === 'playerFactsToName'
}

export function isPlayerFactsToName(mode: QuizMode): boolean {
  return mode === 'playerFactsToName'
}

export function isPlayerPhotoMode(mode: QuizMode): boolean {
  return (
    mode === 'playerPhotoToName' ||
    mode === 'playerToNation' ||
    mode === 'playerToClub' ||
    mode === 'managerPhotoToName'
  )
}

export function isPlayerFootballMode(mode: QuizMode): boolean {
  return (PLAYER_FOOTBALL_MODES as readonly string[]).includes(mode as string)
}

export function isManagerFootballMode(mode: QuizMode): boolean {
  return mode === 'managerPhotoToName'
}

export function isClubCrestMode(mode: QuizMode): boolean {
  return mode === 'clubCrestToName' || mode === 'playerClubToName'
}

export function isStadiumMode(mode: QuizMode): boolean {
  return mode === 'stadiumToClub'
}

export function isNameToLanguage(mode: QuizMode): boolean {
  return mode === 'nameToLanguage'
}

export function isNameToGov(mode: QuizMode): boolean {
  return mode === 'nameToGov'
}

export function hasLevels(mode: QuizMode): boolean {
  return (
    (isFootballMode(mode) && mode !== 'playerFactsToName') ||
    isLeadersMode(mode) ||
    (!isCodesMode(mode) &&
      !isRankingMode(mode) &&
      mode !== 'neighborsToName' &&
      mode !== 'factsToName' &&
      mode !== 'nameToLanguage' &&
      mode !== 'nameToGov')
  )
}

export function hasGeoFinale(mode: QuizMode): boolean {
  return (
    !isFootballMode(mode) &&
    !isWaterMode(mode) &&
    !isLeadersMode(mode) &&
    !isCodesMode(mode) &&
    !isRankingMode(mode) &&
    mode !== 'nameToLanguage' &&
    mode !== 'nameToGov'
  )
}

export type PlayPath = 'pool' | 'levels' | 'learn' | 'mistakes'
export type LearnFrom = 'region' | 'level'
export type RegionFilter = string
export type RoundEnd = 'complete' | 'timeout' | 'lives'
export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'hardcore'
export const PLAY_DIFFICULTIES: QuizDifficulty[] = ['easy', 'hard', 'hardcore']
export const FACTS_DIFFICULTIES: QuizDifficulty[] = ['easy', 'medium', 'hard']
export const LEADERS_DIFFICULTIES: QuizDifficulty[] = ['easy', 'medium', 'hard', 'hardcore']
export const LANGUAGE_DIFFICULTIES: QuizDifficulty[] = ['easy', 'medium', 'hard', 'hardcore']
export const QUESTIONS_PER_ROUND = 10
export const ROUND_SIZES = [5, 10, 20] as const
export type RoundSize = (typeof ROUND_SIZES)[number]

export function isQuizDifficulty(value: unknown): value is QuizDifficulty {
  return value === 'easy' || value === 'medium' || value === 'hard' || value === 'hardcore'
}

export function isRoundSize(value: unknown): value is RoundSize {
  return typeof value === 'number' && (ROUND_SIZES as readonly number[]).includes(value)
}

export function isRegion(value: string): value is Region {
  return (REGIONS as readonly string[]).includes(value)
}

export function parseRegions(filter: RegionFilter): Region[] {
  if (filter === 'all') return [...REGIONS]
  if (isRegion(filter)) return [filter]
  return sortRegions([...new Set(filter.split('+').filter(isRegion))])
}

export function encodeRegions(regions: readonly Region[]): RegionFilter {
  const unique = sortRegions([...new Set(regions)])
  if (unique.length === 0 || unique.length === REGIONS.length) return 'all'
  return unique.length === 1 ? unique[0] : unique.join('+')
}

export function isAllRegions(filter: RegionFilter): boolean {
  return filter === 'all' || parseRegions(filter).length === REGIONS.length
}

export function quizMapRegion(path: PlayPath, region: RegionFilter): RegionFilter {
  return path === 'levels' ? 'all' : region
}

export function isRegionFilter(value: unknown): value is RegionFilter {
  if (typeof value !== 'string' || value.length === 0) return false
  if (value === 'all') return true
  return value.split('+').every(isRegion)
}

export function isRegionSelected(filter: RegionFilter, chip: Region | 'all'): boolean {
  if (chip === 'all') return isAllRegions(filter)
  return !isAllRegions(filter) && parseRegions(filter).includes(chip)
}

export function toggleRegion(current: RegionFilter, clicked: Region | 'all'): RegionFilter {
  if (clicked === 'all') return 'all'
  if (isAllRegions(current)) return clicked
  const selected = parseRegions(current)
  const next = selected.includes(clicked)
    ? selected.filter((region) => region !== clicked)
    : [...selected, clicked]
  if (next.length === 0) return current
  return encodeRegions(next)
}

function sortRegions(regions: Region[]): Region[] {
  return [...regions].sort((a, b) => REGIONS.indexOf(a) - REGIONS.indexOf(b))
}

export function fitRoundSize(size: number, poolSize: number): RoundSize {
  const allowed = ROUND_SIZES.filter((n) => poolSize <= 0 || n <= poolSize)
  const options = allowed.length > 0 ? allowed : [...ROUND_SIZES]
  if (options.includes(size as RoundSize)) return size as RoundSize
  return options.reduce((best, n) => (Math.abs(n - size) < Math.abs(best - size) ? n : best))
}
export const QUESTION_TIME_MS = 10_000
export const FACT_QUESTION_TIME_MS = 12_000
export const MAP_IDENTIFY_TIME_MS = 12_000
export const NEIGHBORS_QUESTION_TIME_MS = 30_000
export const MAP_FIND_REGION_TIME_MS = 15_000
export const MAP_FIND_WORLD_TIME_MS = 20_000
export const WATER_QUESTION_TIME_MS = 12_000
export const ANSWER_PAUSE_MS = 900
export const MAP_ANSWER_PAUSE_MS = 1_400
export const MAX_LIVES = 3

export function questionLimitMs(
  mode: QuizMode,
  context: { region?: RegionFilter; path?: PlayPath } = {},
): number {
  if (mode === 'neighborsToName') return NEIGHBORS_QUESTION_TIME_MS
  if (mode === 'nameToMap') {
    const worldView = context.path === 'levels' || !context.region || isAllRegions(context.region)
    return worldView ? MAP_FIND_WORLD_TIME_MS : MAP_FIND_REGION_TIME_MS
  }
  if (mode === 'mapToName') return MAP_IDENTIFY_TIME_MS
  if (isFactsToName(mode)) return FACTS_CLUE_TIME_MS
  if (isWaterMode(mode)) return WATER_QUESTION_TIME_MS
  if (isRankingMode(mode)) return FACT_QUESTION_TIME_MS
  if (isFactMode(mode)) return FACT_QUESTION_TIME_MS
  return QUESTION_TIME_MS
}

export function answerPauseMs(mode: QuizMode): number {
  return isMapMode(mode) ? MAP_ANSWER_PAUSE_MS : ANSWER_PAUSE_MS
}

export function maxLives(difficulty: QuizDifficulty): number {
  return difficulty === 'hardcore' ? 1 : MAX_LIVES
}

export function livesFor(
  path: PlayPath,
  difficulty: QuizDifficulty,
  levelHardcore: boolean,
  level = 1,
  levelLives = MAX_LIVES,
  mode: QuizMode = 'flagToName',
): number {
  if (path === 'learn' || path === 'mistakes') return Number.MAX_SAFE_INTEGER
  if (path !== 'levels') return maxLives(difficulty)
  if (isFinalLevel(level) && hasGeoFinale(mode)) return levelHardcore ? 1 : levelLives
  return levelHardcore ? 1 : MAX_LIVES
}

export function countryDifficultyOf(difficulty: QuizDifficulty): Difficulty {
  return difficulty === 'easy' ? 'easy' : 'hard'
}

export function matchesPlayDifficulty(country: Country, mode: QuizMode, difficulty: QuizDifficulty): boolean {
  if (isFactsToName(mode)) {
    const tier = factsDifficultyOf(country)
    if (difficulty === 'easy') return tier === 'easy'
    if (difficulty === 'medium') return tier === 'medium'
    return tier === 'hard'
  }
  if (isNameToLanguage(mode)) {
    if (!quizLanguageId(country.iso)) return false
    const tier = languageDifficultyOf(country)
    if (difficulty === 'easy') return tier === 'easy'
    if (difficulty === 'medium') return tier === 'medium'
    return tier === 'hard'
  }
  if (isRankingMode(mode)) return isRankingEasy(country.iso, mode) === (difficulty === 'easy')
  return isEasyForMode(country, mode) === (difficulty === 'easy')
}

export interface Question {
  country: Country
  options: Country[]
  yearOptions?: number[]
  mode?: QuizMode
  facts?: Array<FactClue | PlayerFactClue>
  year?: number
  waterId?: string
  waterOptions?: string[]
  promptEntity?: Country
  shirtNumber?: number
  stadiumName?: string
  league?: 'pl' | 'laliga' | 'seriea' | 'bundesliga' | 'ligue1'
  goldenEvent?: 'wc' | 'euro'
  priorBan?: {
    years?: number[]
    populations?: number[]
    currencies?: string[]
  }
}

export interface RoundAnswer {
  question: Question
  selectedIso: string | null
  timeMs: number
}

export interface OptionAvoid {
  keys: string[]
  years: number[]
  waters: string[]
}

export function isCorrect(answer: RoundAnswer): boolean {
  if (isFootballYearChoice(answer.question.mode ?? 'flagToName')) {
    return answer.selectedIso === String(answer.question.year)
  }
  if (isWaterMapMode(answer.question.mode) && answer.question.waterId) {
    return answer.selectedIso === answer.question.waterId
  }
  return answer.selectedIso === answer.question.country.iso
}

export function formatClock(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatSeconds(ms: number, lang: Lang): string {
  const value = Math.max(0, ms) / 1000
  return new Intl.NumberFormat(localeTag(lang), { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)
}

export function averageTimeMs(answers: RoundAnswer[]): number {
  if (answers.length === 0) return 0
  return answers.reduce((sum, answer) => sum + answer.timeMs, 0) / answers.length
}

export function slowestAnswer(answers: RoundAnswer[]): RoundAnswer | null {
  if (answers.length === 0) return null
  return answers.reduce((slowest, answer) => (answer.timeMs > slowest.timeMs ? answer : slowest))
}

export function countryName(country: Country, lang: Lang): string {
  if (country.iso.includes('+')) {
    const parts = country.iso.split('+').map((id) => countryName(footballTeamCountry(id), lang))
    try {
      return new Intl.ListFormat(localeTag(lang), { type: 'conjunction' }).format(parts)
    } catch {
      return parts.join(', ')
    }
  }
  if (isNamedFootballTeam(country.iso)) return lang === 'ru' ? country.nameRu : country.nameEn
  if (lang === 'ru') return country.nameRu
  if (lang === 'en') return country.nameEn
  try {
    const name = new Intl.DisplayNames([localeTag(lang)], { type: 'region' }).of(country.iso.toUpperCase())
    if (name) return name
  } catch {
    /* fall back */
  }
  return country.nameEn
}

export function flagUrl(iso: string): string {
  const nation = clubNation(iso)
  if (nation) return flagUrl(nation)
  if (iso === 'af') return '/flags/af.svg'
  if (iso === 'su') return '/flags/su.svg'
  if (iso === 'yu') return '/flags/yu.svg'
  if (iso === 'eng') return 'https://flagcdn.com/gb-eng.svg'
  if (iso === 'sct') return 'https://flagcdn.com/gb-sct.svg'
  if (iso === 'tch') return 'https://flagcdn.com/cz.svg'
  return `https://flagcdn.com/${iso}.svg`
}

export function sortCountriesByName(countries: Country[], lang: Lang): Country[] {
  const collator = new Intl.Collator(localeTag(lang))
  return [...countries].sort((a, b) => collator.compare(countryName(a, lang), countryName(b, lang)))
}

export function withFacts(question: Question): Question {
  if (question.mode === 'playerFactsToName') {
    return { ...question, facts: playerClueSequence(question.country.iso) }
  }
  if (question.mode !== 'factsToName') return question
  return { ...question, facts: clueSequence(question.country.iso) }
}

export function pickDistractors(
  correct: Country,
  pool: Country[],
  n: number,
  uniqueKey: (country: Country) => string,
  avoidKeys: readonly string[] = [],
): Country[] {
  return pickFirstFit(n, avoidKeys, (banned) => {
    const pickedIso = new Set([correct.iso])
    const pickedKey = new Set([uniqueKey(correct), ...banned])
    const distractors: Country[] = []

    const addFrom = (list: Country[]) => {
      for (const country of shuffle(list)) {
        if (distractors.length >= n) return
        if (pickedIso.has(country.iso)) continue
        const key = uniqueKey(country)
        if (pickedKey.has(key)) continue
        pickedIso.add(country.iso)
        pickedKey.add(key)
        distractors.push(country)
      }
    }

    addFrom(pool.filter((country) => country.region === correct.region))
    addFrom(COUNTRIES.filter((country) => country.region === correct.region))
    addFrom(pool)
    addFrom(COUNTRIES)

    return distractors
  })
}

const AVOID_PREFER = 5
const AVOID_MIN = 3

function avoidWindows<T>(items: readonly T[]): (readonly T[])[] {
  const windows: (readonly T[])[] = []
  const push = (window: readonly T[]) => {
    if (windows.some((item) => item.length === window.length && item.every((value, index) => value === window[index]))) {
      return
    }
    windows.push(window)
  }
  push(items)
  if (items.length > AVOID_PREFER) push(items.slice(-AVOID_PREFER))
  if (items.length > AVOID_MIN) push(items.slice(-AVOID_MIN))
  push([])
  return windows
}

export function pickFirstFit<T, B>(
  need: number,
  avoid: readonly B[],
  pick: (banned: ReadonlySet<B>) => T[],
): T[] {
  let best: T[] = []
  for (const window of avoidWindows(avoid)) {
    const got = pick(new Set(window))
    if (got.length > best.length) best = got
    if (got.length >= need) return got
  }
  return best
}

export function languageIdsFrom(keys: readonly string[]): string[] {
  return keys.filter((key) => key.startsWith('lang:')).map((key) => key.slice('lang:'.length))
}

function priorBanFrom(keys: readonly string[]): Question['priorBan'] {
  const years: number[] = []
  const populations: number[] = []
  const currencies: string[] = []
  for (const key of keys) {
    if (key.startsWith('founded:')) {
      const year = Number(key.slice('founded:'.length))
      if (Number.isFinite(year)) years.push(year)
    } else if (key.startsWith('population:')) {
      const population = Number(key.slice('population:'.length))
      if (Number.isFinite(population)) populations.push(population)
    } else if (key.startsWith('currency:')) {
      currencies.push(key.slice('currency:'.length))
    }
  }
  if (years.length === 0 && populations.length === 0 && currencies.length === 0) return undefined
  return {
    years: years.length ? years : undefined,
    populations: populations.length ? populations : undefined,
    currencies: currencies.length ? currencies : undefined,
  }
}

export function withPriorBan(question: Question, keys: readonly string[]): Question {
  const priorBan = priorBanFrom(keys)
  return priorBan ? { ...question, priorBan } : question
}

export function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}
