import { COUNTRIES, REGIONS, type Country, type Difficulty, type Region } from '../data/countries'
import { COUNTRY_CODES, formatCalling, formatCar, formatTld } from '../data/countryCodes'
import { footballCampaignLevels, footballLevelYears } from '../data/footballLevels'
import { LEVEL_COUNT, LEVEL_ISOS, isFinalLevel, isLevelNumber } from '../data/levels'
import { isEasyForMode, factsDifficultyOf } from '../data/modeDifficulty'
import { canAskNeighbors } from '../data/neighbors'
import {
  canAskWater,
  countryForWater,
  isEasyWaterBody,
  isosForWater,
  isWaterMapMode,
  isWaterMode,
  neighboringWaters,
  pickWaterId,
  WATER_LEVEL_SIZE,
  waterDataMode,
  waterIdsForMode,
  waterLevelChunks,
  waterCampaignLevels,
  watersFor,
  type WaterMapMode,
  type WaterMode,
} from '../data/water'
import {
  leaderCountry,
  neighborsByNumber,
  termsForKind,
  uniquePersons,
  type LeaderKind,
  type LeaderTerm,
} from '../data/leaders'
import { euroPool, euroRelatedTeamIds, euroTeamCountries, EURO_WINNERS } from '../data/euros'
import {
  footballTeamCountry,
  footballOptionClashes,
  isNamedFootballTeam,
  wcChampionCountries,
  wcFinalistCountries,
  wcFinalistRelatedIds,
  wcHostAnswerId,
  wcHostCountries,
  wcHostPool,
  wcHostRelatedIds,
  wcRelatedTeamIds,
  wcWinYearsFor,
  WORLD_CUP_HOSTS,
  WORLD_CUP_WINNERS,
} from '../data/worldCup'
import {
  isRankingEasy,
  isRankingMode,
  nearbyRankingCountries,
  rankingCountries,
  rankingPlaceOf,
  RANKING_MODES,
  type RankingMode,
} from '../data/rankings'
import { localeTag, type Lang } from '../i18n/lang'
import { clueSequence, type FactClue } from './countryFacts'
import { FACTS_CLUE_TIME_MS } from './factsRules'

export { isRankingMode, RANKING_MODES, type RankingMode } from '../data/rankings'

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
] as const
export const FOOTBALL_MODES = ['wcWinners', 'wcFinalists', 'wcHosts', 'wcTitleYears', 'euroWinners'] as const
export const CODES_MODES = ['tldToName', 'nameToTld', 'callingToName', 'nameToCalling', 'carToName', 'nameToCar'] as const
export const LEADERS_MODES = [
  'usYearsToName',
  'usNumberToName',
  'usPhotoToName',
  'popeYearsToName',
  'popeNumberToName',
  'popePhotoToName',
  'rusYearsToName',
  'rusNumberToName',
  'rusPhotoToName',
] as const
export type FootballMode = (typeof FOOTBALL_MODES)[number]
export type CodesMode = (typeof CODES_MODES)[number]
export type LeadersMode = (typeof LEADERS_MODES)[number]
export const LEADERS_TOPICS = ['us', 'pope', 'rus'] as const
export const LEADERS_ASKS = ['years', 'number', 'photo'] as const
export type LeaderAsk = (typeof LEADERS_ASKS)[number]
export type QuizMode = (typeof QUIZ_MODES)[number] | FootballMode | CodesMode | LeadersMode | RankingMode
export const LEVEL_MODES: QuizMode[] = QUIZ_MODES.filter(
  (mode) => mode !== 'neighborsToName' && mode !== 'factsToName',
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
export const MIX_KINDS = ['easy', 'hard'] as const
export type MixKind = (typeof MIX_KINDS)[number]

export function isMixKind(value: unknown): value is MixKind {
  return value === 'easy' || value === 'hard'
}

export function modesForMix(mix: MixKind): QuizMode[] {
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
  return typeof value === 'string' && (LEADERS_MODES as readonly string[]).includes(value)
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
  if (mode.startsWith('us')) return 'us'
  return null
}

export function leadersAskOf(mode: QuizMode): LeaderAsk {
  if (isLeaderPhotoMode(mode)) return 'photo'
  if (isLeaderNumberPrompt(mode)) return 'number'
  return 'years'
}

export function leadersModeOf(kind: LeaderKind, ask: LeaderAsk): LeadersMode {
  if (kind === 'us') {
    if (ask === 'number') return 'usNumberToName'
    if (ask === 'photo') return 'usPhotoToName'
    return 'usYearsToName'
  }
  if (kind === 'pope') {
    if (ask === 'number') return 'popeNumberToName'
    if (ask === 'photo') return 'popePhotoToName'
    return 'popeYearsToName'
  }
  if (ask === 'number') return 'rusNumberToName'
  if (ask === 'photo') return 'rusPhotoToName'
  return 'rusYearsToName'
}

export function isLeaderPhotoMode(mode: QuizMode): boolean {
  return mode === 'usPhotoToName' || mode === 'popePhotoToName' || mode === 'rusPhotoToName'
}

export function isLeaderYearsPrompt(mode: QuizMode): boolean {
  return mode === 'usYearsToName' || mode === 'popeYearsToName' || mode === 'rusYearsToName'
}

export function isLeaderNumberPrompt(mode: QuizMode): boolean {
  return mode === 'usNumberToName' || mode === 'popeNumberToName' || mode === 'rusNumberToName'
}

export function isCodePromptMode(mode: QuizMode): boolean {
  return mode === 'tldToName' || mode === 'callingToName' || mode === 'carToName'
}

export function isCodeOptionMode(mode: QuizMode): boolean {
  return mode === 'nameToTld' || mode === 'nameToCalling' || mode === 'nameToCar'
}

export function footballHasDifficulty(mode: QuizMode): boolean {
  return mode === 'wcHosts' || mode === 'euroWinners'
}

export function isFootballTeamChoice(mode: QuizMode): boolean {
  return mode === 'wcWinners' || mode === 'wcFinalists' || mode === 'wcHosts' || mode === 'euroWinners'
}

export function isFootballYearChoice(mode: QuizMode): boolean {
  return mode === 'wcTitleYears'
}

export function footballPoolSize(mode: QuizMode, difficulty: QuizDifficulty): number {
  if (mode === 'wcHosts') return wcHostPool(difficulty).length
  if (mode === 'euroWinners') return euroPool(difficulty).length
  if (isFootballMode(mode)) return WORLD_CUP_WINNERS.length
  return 0
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
    mode === 'nameToFounded'
  )
}

export function isMapMode(mode: QuizMode): boolean {
  return mode === 'nameToMap' || mode === 'mapToName'
}

export function isFactsToName(mode: QuizMode): boolean {
  return mode === 'factsToName'
}

export { isWaterMapMode, isWaterMode, waterCampaignLevels, waterLevelNumbers, waterName } from '../data/water'

export function hasLevels(mode: QuizMode): boolean {
  return (
    isFootballMode(mode) ||
    isLeadersMode(mode) ||
    (!isCodesMode(mode) && !isRankingMode(mode) && mode !== 'neighborsToName' && mode !== 'factsToName')
  )
}

export function hasGeoFinale(mode: QuizMode): boolean {
  return (
    !isFootballMode(mode) &&
    !isWaterMode(mode) &&
    !isLeadersMode(mode) &&
    !isCodesMode(mode) &&
    !isRankingMode(mode)
  )
}

export function campaignLevelCount(mode: QuizMode): number {
  if (isFootballMode(mode)) return footballCampaignLevels(mode)
  if (isWaterMode(mode)) return waterCampaignLevels(mode)
  if (isLeadersMode(mode)) return leaderCampaignLevels(mode)
  return LEVEL_COUNT
}

export function campaignLevelNumbers(mode: QuizMode): number[] {
  return Array.from({ length: campaignLevelCount(mode) }, (_, index) => index + 1)
}

export function campaignModesForWorld(world: QuizWorld): QuizMode[] {
  if (world === 'football') return [...FOOTBALL_MODES]
  if (world === 'leaders') return [...LEADERS_MODES]
  if (world === 'codes') return []
  return [...LEVEL_MODES]
}

export function campaignMaxForWorld(world: QuizWorld): number {
  return campaignModesForWorld(world).reduce((sum, mode) => sum + campaignLevelCount(mode), 0)
}
export type PlayPath = 'pool' | 'levels' | 'learn' | 'mistakes'
export type LearnFrom = 'region' | 'level'
export type RegionFilter = string
export type RoundEnd = 'complete' | 'timeout' | 'lives'
export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'hardcore'
export const PLAY_DIFFICULTIES: QuizDifficulty[] = ['easy', 'hard', 'hardcore']
export const FACTS_DIFFICULTIES: QuizDifficulty[] = ['easy', 'medium', 'hard']
export const LEADERS_DIFFICULTIES: QuizDifficulty[] = ['easy', 'medium', 'hard', 'hardcore']
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
export { FACTS_CLUE_TIME_MS }
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
  if (mode === 'factsToName') return FACTS_CLUE_TIME_MS
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
  if (isRankingMode(mode)) return isRankingEasy(country.iso, mode) === (difficulty === 'easy')
  return isEasyForMode(country, mode) === (difficulty === 'easy')
}

export interface Question {
  country: Country
  options: Country[]
  yearOptions?: number[]
  mode?: QuizMode
  facts?: FactClue[]
  year?: number
  waterId?: string
  waterOptions?: string[]
}

export interface RoundAnswer {
  question: Question
  selectedIso: string | null
  timeMs: number
}

export function isCorrect(answer: RoundAnswer): boolean {
  if (answer.question.mode === 'wcTitleYears') {
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
  if (iso === 'af') return '/flags/af.svg'
  if (iso === 'su') return '/flags/su.svg'
  if (iso === 'yu') return '/flags/yu.svg'
  if (iso === 'eng') return 'https://flagcdn.com/gb-eng.svg'
  if (iso === 'tch') return 'https://flagcdn.com/cz.svg'
  return `https://flagcdn.com/${iso}.svg`
}

export function getPool(region: RegionFilter, difficulty: QuizDifficulty, mode: QuizMode): Country[] {
  const regions = parseRegions(region)
  if (isWaterMapMode(mode)) {
    const ids = waterIdsForMode(mode).filter((id) => {
      const inRegion = isosForWater(id, waterDataMode(mode)).some((iso) => {
        const country = COUNTRIES.find((item) => item.iso === iso)
        return Boolean(country && regions.includes(country.region))
      })
      if (!inRegion) return false
      return isEasyWaterBody(id) === (difficulty === 'easy')
    })
    const fallback = ids.length > 0 ? ids : waterIdsForMode(mode).filter((id) =>
      isosForWater(id, waterDataMode(mode)).some((iso) => {
        const country = COUNTRIES.find((item) => item.iso === iso)
        return Boolean(country && regions.includes(country.region))
      }),
    )
    return fallback
      .map((id) => countryForWater(id, mode))
      .filter((country): country is Country => Boolean(country))
  }
  return COUNTRIES.filter((country) => {
    if (!regions.includes(country.region)) return false
    if (mode === 'neighborsToName' && !canAskNeighbors(country.iso)) return false
    if (isWaterMode(mode) && !canAskWater(country.iso, mode)) return false
    if (isRankingMode(mode) && rankingPlaceOf(mode, country.iso) === null) return false
    return matchesPlayDifficulty(country, mode, difficulty)
  })
}

export function getRegionPool(region: RegionFilter): Country[] {
  const regions = parseRegions(region)
  return COUNTRIES.filter((country) => regions.includes(country.region))
}

const FAME_INDEX = new Map(LEVEL_ISOS.flat().map((iso, index) => [iso, index]))
const LEVEL_CHUNKS = new Map<QuizMode, Country[][]>()

function rankedForMode(mode: QuizMode): Country[] {
  return [...COUNTRIES].sort((a, b) => {
    const easyDelta = Number(isEasyForMode(a, mode)) - Number(isEasyForMode(b, mode))
    if (easyDelta !== 0) return -easyDelta
    return (FAME_INDEX.get(a.iso) ?? 999) - (FAME_INDEX.get(b.iso) ?? 999)
  })
}

function levelChunksFor(mode: QuizMode): Country[][] {
  const cached = LEVEL_CHUNKS.get(mode)
  if (cached) return cached
  if (isWaterMode(mode)) {
    const chunks = waterLevelChunks(mode)
    LEVEL_CHUNKS.set(mode, chunks)
    return chunks
  }
  if (mode === 'flagToName' || mode === 'nameToFlag') {
    const byIso = new Map(COUNTRIES.map((country) => [country.iso, country]))
    const chunks = LEVEL_ISOS.map((group) =>
      group.flatMap((iso) => {
        const country = byIso.get(iso)
        return country ? [country] : []
      }),
    )
    LEVEL_CHUNKS.set(mode, chunks)
    return chunks
  }
  const ranked = rankedForMode(mode)
  const chunks: Country[][] = []
  let offset = 0
  for (const group of LEVEL_ISOS) {
    chunks.push(ranked.slice(offset, offset + group.length))
    offset += group.length
  }
  LEVEL_CHUNKS.set(mode, chunks)
  return chunks
}

export function getLevelPool(level: number, mode: QuizMode = 'flagToName'): Country[] {
  if (isFootballMode(mode)) {
    const years = footballLevelYears(mode, level)
    return years.flatMap((year) => footballCountryForYear(mode, year)).filter(Boolean)
  }
  if (isWaterMode(mode)) {
    return waterLevelChunks(mode)[level - 1] ?? []
  }
  if (isLeadersMode(mode)) {
    return leaderLevelChunks(mode)[level - 1] ?? []
  }
  if (!isLevelNumber(level)) return []
  if (isFinalLevel(level)) return [...COUNTRIES]
  return levelChunksFor(mode)[level - 1] ?? []
}

export function levelQuestionCount(level: number, mode: QuizMode): number {
  if (isFootballMode(mode)) return footballLevelYears(mode, level).length
  return getLevelPool(level, mode).length
}

export function sortCountriesByName(countries: Country[], lang: Lang): Country[] {
  const collator = new Intl.Collator(localeTag(lang))
  return [...countries].sort((a, b) => collator.compare(countryName(a, lang), countryName(b, lang)))
}

export function getLearnPool(
  learnFrom: LearnFrom,
  region: RegionFilter,
  level: number,
  mode: QuizMode = 'flagToName',
): Country[] {
  if (isFootballMode(mode)) return footballLearnCountries(mode)
  if (isCodesMode(mode)) return getRegionPool(region)
  if (isLeadersMode(mode)) {
    return learnFrom === 'level' ? getLevelPool(level, mode) : leaderLearnCountries(mode)
  }
  const pool = learnFrom === 'level' ? getLevelPool(level, mode) : getRegionPool(region)
  if (isWaterMapMode(mode)) {
    const used = new Set<string>()
    const countries: Country[] = []
    for (const country of pool.filter((item) => canAskWater(item.iso, mode))) {
      const id = watersFor(country.iso, mode)[0]
      if (!id || used.has(id)) continue
      used.add(id)
      countries.push(countryForWater(id, mode) ?? country)
    }
    return countries
  }
  return isWaterMode(mode)
    ? pool.filter((country) => canAskWater(country.iso, mode))
    : isRankingMode(mode)
      ? pool.filter((country) => rankingPlaceOf(mode, country.iso) !== null)
      : pool
}

export function footballLearnCountries(mode: FootballMode): Country[] {
  const ids = new Set<string>()
  if (mode === 'wcWinners' || mode === 'wcTitleYears') {
    for (const item of WORLD_CUP_WINNERS) ids.add(item.winnerId)
  } else if (mode === 'wcFinalists') {
    for (const item of WORLD_CUP_WINNERS) ids.add(item.runnerUpId)
  } else if (mode === 'wcHosts') {
    for (const item of WORLD_CUP_HOSTS) {
      ids.add(wcHostAnswerId(item.hostIds))
    }
  } else {
    for (const item of EURO_WINNERS) ids.add(item.winnerId)
  }
  return [...ids].map((id) => footballTeamCountry(id))
}

function footballCountryForYear(mode: FootballMode, year: number): Country[] {
  if (mode === 'wcHosts') {
    const item = WORLD_CUP_HOSTS.find((host) => host.year === year)
    return item ? [footballTeamCountry(wcHostAnswerId(item.hostIds))] : []
  }
  if (mode === 'euroWinners') {
    const item = EURO_WINNERS.find((cup) => cup.year === year)
    return item ? [footballTeamCountry(item.winnerId)] : []
  }
  const item = WORLD_CUP_WINNERS.find((cup) => cup.year === year)
  if (!item) return []
  if (mode === 'wcFinalists') return [footballTeamCountry(item.runnerUpId)]
  return [footballTeamCountry(item.winnerId)]
}

export function poolForMode(
  pool: Country[],
  mode: QuizMode,
  difficulty?: QuizDifficulty,
): Country[] {
  let next = pool
  if (mode === 'neighborsToName') {
    next = pool.filter((country) => canAskNeighbors(country.iso))
    if (next.length < 4) next = COUNTRIES.filter((country) => canAskNeighbors(country.iso))
  } else if (isWaterMode(mode)) {
    next = pool.filter((country) => canAskWater(country.iso, mode))
    if (next.length < 4) next = COUNTRIES.filter((country) => canAskWater(country.iso, mode))
  } else if (isRankingMode(mode)) {
    next = pool.filter((country) => rankingPlaceOf(mode, country.iso) !== null)
    if (next.length < 4) next = rankingCountries(mode)
  }
  if (!difficulty) return next
  const filtered = next.filter((country) => matchesPlayDifficulty(country, mode, difficulty))
  return filtered.length > 0 ? filtered : next
}

export function createRound(
  pool: Country[],
  count = QUESTIONS_PER_ROUND,
  uniqueKey: (country: Country) => string = (country) => country.iso,
  mode?: QuizMode,
): Question[] {
  if (mode && isWaterMapMode(mode)) return createWaterMapRound(pool, count, mode)
  if (mode && isWaterMode(mode)) return createWaterRound(pool, count, mode, pool.length > WATER_LEVEL_SIZE)
  if (mode && isRankingMode(mode)) return createRankingRound(pool, count, mode)
  const targets = shuffle(pool).slice(0, Math.min(count, pool.length))

  return targets.map((country) => withFacts({
    country,
    mode,
    options: shuffle([country, ...pickDistractors(country, pool, 3, uniqueKey)]),
  }))
}

export function createWaterRound(
  pool: Country[],
  count: number,
  mode: WaterMode,
  uniqueWaters = true,
): Question[] {
  const eligible = pool.filter((country) => canAskWater(country.iso, mode))
  const used = new Set<string>()
  const questions: Question[] = []
  for (const country of shuffle(eligible)) {
    const waterId = uniqueWaters ? pickWaterId(country.iso, mode, used) : watersFor(country.iso, mode)[0]
    if (!waterId) continue
    if (uniqueWaters && used.has(waterId)) continue
    used.add(waterId)
    const others = eligible.filter(
      (item) => item.iso !== country.iso && !watersFor(item.iso, mode).includes(waterId),
    )
    questions.push({
      country,
      mode,
      waterId,
      options: shuffle([
        country,
        ...pickDistractors(country, others.length >= 3 ? others : eligible, 3, (item) => item.iso),
      ]),
    })
    if (questions.length >= count) break
  }
  return questions
}

function pickWaterMapOptions(correctId: string, mode: WaterMode): string[] {
  const adjacent = shuffle(neighboringWaters(correctId, mode))
  const neighborTake = adjacent.length >= 2 ? (Math.random() < 0.55 ? 2 : 1) : adjacent.length
  const neighbors = adjacent.slice(0, neighborTake)
  const taken = new Set([correctId, ...neighbors])
  const filler = shuffle(waterIdsForMode(mode).filter((id) => !taken.has(id))).slice(
    0,
    Math.max(0, 3 - neighbors.length),
  )
  return shuffle([correctId, ...neighbors, ...filler])
}

export function createWaterMapRound(pool: Country[], count: number, mode: WaterMapMode): Question[] {
  const eligible = pool.filter((country) => canAskWater(country.iso, mode))
  const used = new Set<string>()
  const questions: Question[] = []
  for (const country of shuffle(eligible)) {
    const waterId = pickWaterId(country.iso, mode, used)
    if (!waterId || used.has(waterId)) continue
    used.add(waterId)
    const waterOptions = pickWaterMapOptions(waterId, mode)
    questions.push({
      country,
      mode,
      waterId,
      waterOptions,
      options: [country],
    })
    if (questions.length >= count) break
  }
  return questions
}

export function createFootballRound(
  mode: QuizMode,
  count = QUESTIONS_PER_ROUND,
  difficulty: QuizDifficulty = 'easy',
  years?: number[],
): Question[] {
  if (mode === 'wcFinalists') return createWcFinalistsRound(count, years)
  if (mode === 'wcHosts') return createWcHostsRound(count, difficulty, years)
  if (mode === 'wcTitleYears') return createWcTitleYearsRound(count, years)
  if (mode === 'euroWinners') return createEuroWinnersRound(count, difficulty, years)
  return createWcWinnersRound(count, years)
}

export function createCodesRound(mode: CodesMode, count = QUESTIONS_PER_ROUND): Question[] {
  const pool = COUNTRIES.filter((country) => COUNTRY_CODES[country.iso])
  const targets = shuffle(pool).slice(0, Math.min(count, pool.length))
  return targets.map((country) => ({
    country,
    mode,
    options: shuffle([country, ...pickDistractors(country, pool, 3, (item) => codeAnswerKey(item, mode))]),
  }))
}

export function leaderPoolTerms(mode: LeadersMode, difficulty?: QuizDifficulty): LeaderTerm[] {
  const kind = leaderKindOf(mode)
  if (!kind) return []
  const terms = difficulty ? filterLeaderTerms(termsForKind(kind), difficulty) : termsForKind(kind)
  return isLeaderPhotoMode(mode) ? uniquePersons(terms) : terms
}

export function leaderPoolSize(mode: LeadersMode, difficulty?: QuizDifficulty): number {
  return leaderPoolTerms(mode, difficulty).length
}

export const LEADERS_LEVEL_SIZE = 10

export function leaderLearnCountries(mode: LeadersMode): Country[] {
  return leaderPoolTerms(mode).map(leaderCountry)
}

function rankLeaderTerms(terms: LeaderTerm[]): LeaderTerm[] {
  const order = { easy: 0, medium: 1, hard: 2 }
  return [...terms].sort((a, b) => {
    const byTier = order[a.tier] - order[b.tier]
    if (byTier !== 0) return byTier
    return a.n - b.n
  })
}

export function leaderLevelChunks(mode: LeadersMode): Country[][] {
  const ranked = rankLeaderTerms(leaderPoolTerms(mode))
  const chunks: Country[][] = []
  for (let index = 0; index < ranked.length; index += LEADERS_LEVEL_SIZE) {
    chunks.push(ranked.slice(index, index + LEADERS_LEVEL_SIZE).map(leaderCountry))
  }
  return chunks
}

export function leaderCampaignLevels(mode: LeadersMode): number {
  return leaderLevelChunks(mode).length
}

export function leaderLevelNumbers(mode: LeadersMode): number[] {
  return leaderLevelChunks(mode).map((_, index) => index + 1)
}

export function createLeadersRound(
  mode: LeadersMode,
  count = QUESTIONS_PER_ROUND,
  difficulty?: QuizDifficulty,
  isos?: string[],
): Question[] {
  const full = leaderPoolTerms(mode)
  const pool = isos?.length ? full.filter((term) => isos.includes(term.id)) : leaderPoolTerms(mode, difficulty)
  const distractors = isos?.length ? full : pool
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  return picked.map((term) => ({
    country: leaderCountry(term),
    mode,
    options: pickLeaderNameOptions(term, distractors),
    year: term.from,
  }))
}

function filterLeaderTerms(terms: LeaderTerm[], difficulty: QuizDifficulty): LeaderTerm[] {
  const wanted = difficulty === 'easy' ? 'easy' : difficulty === 'medium' ? 'medium' : 'hard'
  const match = terms.filter((term) => term.tier === wanted)
  if (uniquePersons(match).length >= 4) return match
  const order = ['easy', 'medium', 'hard'] as const
  const start = order.indexOf(wanted)
  for (let span = 1; span < order.length; span += 1) {
    const from = Math.max(0, start - span)
    const to = Math.min(order.length - 1, start + span)
    const allowed = new Set(order.slice(from, to + 1))
    const expanded = terms.filter((term) => allowed.has(term.tier))
    if (uniquePersons(expanded).length >= 4) return expanded
  }
  return terms
}

function pickLeaderNameOptions(term: LeaderTerm, pool: LeaderTerm[]): Country[] {
  const nearby = neighborsByNumber(pool, term, 2)
  const seen = new Set<string>([term.personId, ...nearby.map((item) => item.personId)])
  const fillers = shuffle(pool.filter((item) => !seen.has(item.personId)))
  const picks: LeaderTerm[] = [term, ...nearby]
  for (const item of fillers) {
    if (picks.length === 4) break
    picks.push(item)
    seen.add(item.personId)
  }
  return shuffle(picks.slice(0, 4).map(leaderCountry))
}

export function codeAnswerKey(country: Country, mode: QuizMode): string {
  const codes = COUNTRY_CODES[country.iso]
  if (!codes) return country.iso
  if (mode === 'tldToName' || mode === 'nameToTld') return `tld:${codes.tld}`
  if (mode === 'callingToName' || mode === 'nameToCalling') return `call:${codes.calling}`
  if (mode === 'carToName' || mode === 'nameToCar') return `car:${codes.car}`
  return country.iso
}

export function codePromptLabel(country: Country, mode: QuizMode): string {
  if (mode === 'tldToName' || mode === 'nameToTld') return formatTld(country.iso)
  if (mode === 'callingToName' || mode === 'nameToCalling') return formatCalling(country.iso)
  if (mode === 'carToName' || mode === 'nameToCar') return formatCar(country.iso)
  return country.iso
}

export function createFootballMixedRound(
  modes: readonly FootballMode[],
  count: number,
  difficulty: QuizDifficulty,
): Question[] {
  if (modes.length === 0 || count <= 0) return []
  const questions: Question[] = []
  const used = new Set<string>()
  for (let i = 0; i < count * 6 && questions.length < count; i += 1) {
    const mode = modes[i % modes.length]
    const [question] = createFootballRound(mode, 1, difficulty)
    if (!question) continue
    const key = `${question.mode}:${question.year}:${question.country.iso}`
    if (used.has(key)) continue
    used.add(key)
    questions.push(question)
  }
  return questions
}

export function createWcWinnersRound(count = QUESTIONS_PER_ROUND, years?: number[]): Question[] {
  const source = years?.length
    ? WORLD_CUP_WINNERS.filter((item) => years.includes(item.year))
    : WORLD_CUP_WINNERS
  const picked = shuffle(source).slice(0, Math.min(count, source.length))
  return picked.map((item) => {
    const winner = footballTeamCountry(item.winnerId)
    return {
      country: winner,
      options: pickFootballOptions(winner, wcRelatedTeamIds(item.year), wcChampionCountries()),
      mode: 'wcWinners',
      year: item.year,
    }
  })
}

function createWcFinalistsRound(count: number, years?: number[]): Question[] {
  const source = years?.length
    ? WORLD_CUP_WINNERS.filter((item) => years.includes(item.year))
    : WORLD_CUP_WINNERS
  const picked = shuffle(source).slice(0, Math.min(count, source.length))
  return picked.map((item) => {
    const finalist = footballTeamCountry(item.runnerUpId)
    return {
      country: finalist,
      options: pickFootballOptions(finalist, wcFinalistRelatedIds(item.year), wcFinalistCountries()),
      mode: 'wcFinalists',
      year: item.year,
    }
  })
}

function createWcHostsRound(count: number, difficulty: QuizDifficulty, years?: number[]): Question[] {
  const pool = years?.length
    ? WORLD_CUP_HOSTS.filter((item) => years.includes(item.year))
    : wcHostPool(difficulty)
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  return picked.map((item) => {
    const host = footballTeamCountry(wcHostAnswerId(item.hostIds))
    return {
      country: host,
      options: pickFootballOptions(host, wcHostRelatedIds(item.year), wcHostCountries()),
      mode: 'wcHosts',
      year: item.year,
    }
  })
}

function createWcTitleYearsRound(count: number, years?: number[]): Question[] {
  const source = years?.length
    ? WORLD_CUP_WINNERS.filter((item) => years.includes(item.year))
    : WORLD_CUP_WINNERS
  const picked = shuffle(source).slice(0, Math.min(count, source.length))
  const allYears = WORLD_CUP_WINNERS.map((item) => item.year)
  return picked.map((item) => {
    const winner = footballTeamCountry(item.winnerId)
    const theirYears = new Set(wcWinYearsFor(item.winnerId))
    const related: number[] = []
    const addYear = (year?: number) => {
      if (year === undefined || year === item.year || theirYears.has(year) || related.includes(year)) return
      related.push(year)
    }
    for (const cup of WORLD_CUP_WINNERS) {
      if (cup.runnerUpId === item.winnerId) addYear(cup.year)
    }
    const index = WORLD_CUP_WINNERS.findIndex((cup) => cup.year === item.year)
    addYear(WORLD_CUP_WINNERS[index - 1]?.year)
    addYear(WORLD_CUP_WINNERS[index + 1]?.year)
    const blocked = new Set(theirYears)
    const relatedPicks = shuffle(related).slice(0, 2)
    const fillers = shuffle(allYears.filter((year) => !blocked.has(year) && !relatedPicks.includes(year)))
    const yearOptions: number[] = [item.year]
    for (const year of [...relatedPicks, ...fillers]) {
      if (yearOptions.includes(year) || blocked.has(year)) continue
      yearOptions.push(year)
      if (yearOptions.length === 4) break
    }
    return {
      country: winner,
      options: [],
      yearOptions: shuffle(yearOptions),
      mode: 'wcTitleYears',
      year: item.year,
    }
  })
}

function createEuroWinnersRound(count: number, difficulty: QuizDifficulty, years?: number[]): Question[] {
  const pool = years?.length ? EURO_WINNERS.filter((item) => years.includes(item.year)) : euroPool(difficulty)
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const fillers = euroTeamCountries()
  return picked.map((item) => {
    const winner = footballTeamCountry(item.winnerId)
    return {
      country: winner,
      options: pickFootballOptions(winner, euroRelatedTeamIds(item.year), fillers),
      mode: 'euroWinners',
      year: item.year,
    }
  })
}

function pickFootballOptions(
  correct: Country,
  relatedIds: string[],
  fillers: Country[],
  opts: { shuffleRelated?: boolean; maxRelated?: number } = {},
): Country[] {
  const related: Country[] = []
  const seen = new Set([correct.iso])
  for (const id of relatedIds) {
    const team = footballTeamCountry(id)
    if (seen.has(team.iso) || footballOptionClashes(team.iso, correct.iso)) continue
    seen.add(team.iso)
    related.push(team)
  }
  const maxRelated = opts.maxRelated ?? 2
  const ordered = opts.shuffleRelated === false ? related : shuffle(related)
  const take = Math.min(maxRelated, ordered.length)
  const relatedPicks = ordered.slice(0, take)
  for (const team of relatedPicks) seen.add(team.iso)
  const extra = shuffle(
    fillers.filter((team) => !seen.has(team.iso) && !footballOptionClashes(team.iso, correct.iso)),
  )
  const options: Country[] = [correct]
  const used = new Set<string>([correct.iso])
  for (const team of [...relatedPicks, ...extra]) {
    if (used.has(team.iso) || footballOptionClashes(team.iso, correct.iso)) continue
    used.add(team.iso)
    options.push(team)
    if (options.length === 4) break
  }
  return shuffle(options)
}

export function createMixedRound(
  modes: readonly QuizMode[],
  pool: Country[],
  count: number,
  uniqueKey: (country: Country, mode: QuizMode) => string,
  difficulty?: QuizDifficulty,
): Question[] {
  const cycle = orderedModes(modes)
  if (cycle.length === 0 || count <= 0) return []
  const usedIso = new Set<string>()
  const usedWater = new Set<string>()
  const questions: Question[] = []

  for (let i = 0; i < count; i += 1) {
    let picked: Question | null = null
    for (let offset = 0; offset < cycle.length; offset += 1) {
      const mode = cycle[(i + offset) % cycle.length]
      picked = questionForMode(mode, pool, usedIso, uniqueKey, difficulty, usedWater)
      if (picked) break
    }
    if (!picked) break
    usedIso.add(picked.country.iso)
    if (picked.waterId) usedWater.add(picked.waterId)
    questions.push(picked)
  }

  return questions
}

function questionForMode(
  mode: QuizMode,
  pool: Country[],
  usedIso: Set<string>,
  uniqueKey: (country: Country, mode: QuizMode) => string,
  difficulty?: QuizDifficulty,
  usedWater?: Set<string>,
): Question | null {
  const modePool = poolForMode(pool, mode, difficulty).filter((country) => !usedIso.has(country.iso))
  if (modePool.length === 0) return null
  if (isWaterMapMode(mode)) {
    const candidates = modePool.filter((country) => {
      const waterId = watersFor(country.iso, mode)[0]
      return Boolean(waterId && !usedWater?.has(waterId))
    })
    if (candidates.length === 0) return null
    const country = shuffle(candidates)[0]
    const waterId = watersFor(country.iso, mode)[0]
    if (!waterId) return null
    return {
      country,
      mode,
      waterId,
      waterOptions: pickWaterMapOptions(waterId, mode),
      options: [country],
    }
  }
  const country = shuffle(modePool)[0]
  if (isRankingMode(mode)) {
    return {
      country,
      mode,
      options: shuffle([
        country,
        ...pickRankingDistractors(country, modePool, mode),
      ]),
    }
  }
  if (isWaterMode(mode)) {
    const waterId = watersFor(country.iso, mode)[0]
    if (!waterId) return null
    const others = modePool.filter((item) => item.iso !== country.iso && !watersFor(item.iso, mode).includes(waterId))
    return {
      country,
      mode,
      waterId,
      options: shuffle([
        country,
        ...pickDistractors(country, others.length >= 3 ? others : modePool, 3, (item) => item.iso),
      ]),
    }
  }
  return withFacts({
    country,
    mode,
    options: shuffle([
      country,
      ...pickDistractors(country, modePool, 3, (item) => uniqueKey(item, mode)),
    ]),
  })
}

function withFacts(question: Question): Question {
  if (question.mode !== 'factsToName') return question
  return { ...question, facts: clueSequence(question.country.iso) }
}

function createRankingRound(pool: Country[], count: number, mode: RankingMode): Question[] {
  const eligible = poolForMode(pool, mode)
  const targets = shuffle(eligible).slice(0, Math.min(count, eligible.length))
  return targets.map((country) => ({
    country,
    mode,
    options: shuffle([country, ...pickRankingDistractors(country, eligible, mode)]),
  }))
}

function pickRankingDistractors(correct: Country, pool: Country[], mode: RankingMode): Country[] {
  const nearby = nearbyRankingCountries(mode, correct.iso, pool, 3)
  if (nearby.length >= 3) return nearby
  const extra = pickDistractors(correct, pool, 3 - nearby.length, (item) => item.iso).filter(
    (item) => !nearby.some((near) => near.iso === item.iso),
  )
  return [...nearby, ...extra].slice(0, 3)
}

function pickDistractors(
  correct: Country,
  pool: Country[],
  n: number,
  uniqueKey: (country: Country) => string,
): Country[] {
  const pickedIso = new Set([correct.iso])
  const pickedKey = new Set([uniqueKey(correct)])
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
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}
