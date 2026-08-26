import { COUNTRIES, REGIONS, type Country, type Difficulty, type Region } from '../data/countries'
import { LEVEL_ISOS, isFinalLevel, isLevelNumber } from '../data/levels'
import { isEasyForMode } from '../data/modeDifficulty'
import { canAskNeighbors } from '../data/neighbors'
import { localeTag, type Lang } from '../i18n/lang'
import { clueSequence, type FactClue } from './countryFacts'
import { FACTS_CLUE_TIME_MS } from './factsRules'

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
] as const
export type QuizMode = (typeof QUIZ_MODES)[number]
export const LEVEL_MODES: QuizMode[] = QUIZ_MODES.filter(
  (mode) => mode !== 'neighborsToName' && mode !== 'factsToName',
)
export const EASY_MIX_MODES: QuizMode[] = ['flagToName', 'nameToFlag', 'nameToCapital']
export const HARD_MIX_MODES: QuizMode[] = QUIZ_MODES.filter((mode) => mode !== 'factsToName')

export function isQuizMode(value: unknown): value is QuizMode {
  return typeof value === 'string' && (QUIZ_MODES as readonly string[]).includes(value)
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
  return QUIZ_MODES.filter((mode) => set.has(mode))
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

export function hasLevels(mode: QuizMode): boolean {
  return mode !== 'neighborsToName' && mode !== 'factsToName'
}
export type PlayPath = 'pool' | 'levels' | 'learn'
export type LearnFrom = 'region' | 'level'
export type RegionFilter = string
export type RoundEnd = 'complete' | 'timeout' | 'lives'
export type QuizDifficulty = 'easy' | 'hard' | 'hardcore'
export const PLAY_DIFFICULTIES: QuizDifficulty[] = ['easy', 'hard', 'hardcore']
export const QUESTIONS_PER_ROUND = 10
export const ROUND_SIZES = [5, 10, 20] as const
export type RoundSize = (typeof ROUND_SIZES)[number]

export function isQuizDifficulty(value: unknown): value is QuizDifficulty {
  return typeof value === 'string' && (PLAY_DIFFICULTIES as readonly string[]).includes(value)
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
): number {
  if (path === 'learn') return Number.MAX_SAFE_INTEGER
  if (path !== 'levels') return maxLives(difficulty)
  if (isFinalLevel(level)) return levelHardcore ? 1 : levelLives
  return levelHardcore ? 1 : MAX_LIVES
}

export function countryDifficultyOf(difficulty: QuizDifficulty): Difficulty {
  return difficulty === 'hardcore' ? 'hard' : difficulty
}

export interface Question {
  country: Country
  options: Country[]
  mode?: QuizMode
  facts?: FactClue[]
}

export interface RoundAnswer {
  question: Question
  selectedIso: string | null
  timeMs: number
}

export function isCorrect(answer: RoundAnswer): boolean {
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
  return `https://flagcdn.com/${iso}.svg`
}

export function getPool(region: RegionFilter, difficulty: QuizDifficulty, mode: QuizMode): Country[] {
  const regions = parseRegions(region)
  const wantEasy = countryDifficultyOf(difficulty) === 'easy'
  return COUNTRIES.filter((country) => {
    if (!regions.includes(country.region)) return false
    if (mode === 'neighborsToName' && !canAskNeighbors(country.iso)) return false
    return isEasyForMode(country, mode) === wantEasy
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
  if (!isLevelNumber(level)) return []
  if (isFinalLevel(level)) return [...COUNTRIES]
  return levelChunksFor(mode)[level - 1] ?? []
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
  return learnFrom === 'level' ? getLevelPool(level, mode) : getRegionPool(region)
}

export function poolForMode(
  pool: Country[],
  mode: QuizMode,
  difficulty?: QuizDifficulty,
): Country[] {
  let next =
    mode === 'neighborsToName' ? pool.filter((country) => canAskNeighbors(country.iso)) : pool
  if (mode === 'neighborsToName' && next.length < 4) {
    next = COUNTRIES.filter((country) => canAskNeighbors(country.iso))
  }
  if (!difficulty) return next
  const wantEasy = countryDifficultyOf(difficulty) === 'easy'
  const filtered = next.filter((country) => isEasyForMode(country, mode) === wantEasy)
  return filtered.length > 0 ? filtered : next
}

export function createRound(
  pool: Country[],
  count = QUESTIONS_PER_ROUND,
  uniqueKey: (country: Country) => string = (country) => country.iso,
  mode?: QuizMode,
): Question[] {
  const targets = shuffle(pool).slice(0, Math.min(count, pool.length))

  return targets.map((country) => withFacts({
    country,
    mode,
    options: shuffle([country, ...pickDistractors(country, pool, 3, uniqueKey)]),
  }))
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
  const questions: Question[] = []

  for (let i = 0; i < count; i += 1) {
    let picked: Question | null = null
    for (let offset = 0; offset < cycle.length; offset += 1) {
      const mode = cycle[(i + offset) % cycle.length]
      picked = questionForMode(mode, pool, usedIso, uniqueKey, difficulty)
      if (picked) break
    }
    if (!picked) break
    usedIso.add(picked.country.iso)
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
): Question | null {
  const modePool = poolForMode(pool, mode, difficulty).filter((country) => !usedIso.has(country.iso))
  if (modePool.length === 0) return null
  const country = shuffle(modePool)[0]
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
