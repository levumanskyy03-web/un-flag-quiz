import { COUNTRIES, REGIONS, type Country, type Difficulty, type Region } from '../data/countries'
import { LEVEL_ISOS, isFinalLevel, isLevelNumber } from '../data/levels'

export type QuizMode = 'flagToName' | 'nameToFlag'
export type PlayPath = 'pool' | 'levels'
export type RegionFilter = string
export type RoundEnd = 'complete' | 'timeout' | 'lives'
export type QuizDifficulty = 'easy' | 'hard' | 'hardcore'
export const PLAY_DIFFICULTIES: QuizDifficulty[] = ['easy', 'hard', 'hardcore']

export const QUESTIONS_PER_ROUND = 10
export const ROUND_SIZES = [5, 10, 20] as const
export type RoundSize = (typeof ROUND_SIZES)[number]

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
export const ANSWER_PAUSE_MS = 900
export const MAX_LIVES = 3

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

export function formatSeconds(ms: number, lang: 'ru' | 'en'): string {
  const value = (Math.max(0, ms) / 1000).toFixed(1)
  return lang === 'ru' ? value.replace('.', ',') : value
}

export function averageTimeMs(answers: RoundAnswer[]): number {
  if (answers.length === 0) return 0
  return answers.reduce((sum, answer) => sum + answer.timeMs, 0) / answers.length
}

export function slowestAnswer(answers: RoundAnswer[]): RoundAnswer | null {
  if (answers.length === 0) return null
  return answers.reduce((slowest, answer) => (answer.timeMs > slowest.timeMs ? answer : slowest))
}

export function countryName(country: Country, lang: 'ru' | 'en'): string {
  return lang === 'ru' ? country.nameRu : country.nameEn
}

export function flagUrl(iso: string): string {
  if (iso === 'af') return '/flags/af.svg'
  return `https://flagcdn.com/${iso}.svg`
}

export function getPool(region: RegionFilter, difficulty: QuizDifficulty): Country[] {
  const regions = parseRegions(region)
  const poolDifficulty = countryDifficultyOf(difficulty)
  return COUNTRIES.filter(
    (country) => regions.includes(country.region) && country.difficulty === poolDifficulty,
  )
}

export function getLevelPool(level: number): Country[] {
  if (!isLevelNumber(level)) return []
  if (isFinalLevel(level)) return [...COUNTRIES]
  const wanted = new Set(LEVEL_ISOS[level - 1])
  return COUNTRIES.filter((country) => wanted.has(country.iso))
}

export function createRound(
  pool: Country[],
  count = QUESTIONS_PER_ROUND,
): Question[] {
  const targets = shuffle(pool).slice(0, Math.min(count, pool.length))

  return targets.map((country) => ({
    country,
    options: shuffle([country, ...pickDistractors(country, pool, 3)]),
  }))
}

function pickDistractors(
  correct: Country,
  pool: Country[],
  n: number,
): Country[] {
  const picked = new Set([correct.iso])
  const distractors: Country[] = []

  const addFrom = (list: Country[]) => {
    for (const country of shuffle(list)) {
      if (distractors.length >= n) return
      if (picked.has(country.iso)) continue
      picked.add(country.iso)
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
