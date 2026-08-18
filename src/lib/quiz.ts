import { COUNTRIES, type Country, type Difficulty, type Region } from '../data/countries'

export type QuizMode = 'flagToName' | 'nameToFlag'
export type RegionFilter = Region | 'all'

export const QUESTIONS_PER_ROUND = 10
export const QUESTION_TIME_MS = 10_000
export const ANSWER_PAUSE_MS = 900

export interface Question {
  country: Country
  options: Country[]
}

export interface RoundAnswer {
  question: Question
  selectedIso: string | null
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

export function countryName(country: Country, lang: 'ru' | 'en'): string {
  return lang === 'ru' ? country.nameRu : country.nameEn
}

export function flagUrl(iso: string): string {
  if (iso === 'af') return '/flags/af.svg'
  return `https://flagcdn.com/${iso}.svg`
}

export function getPool(region: RegionFilter, difficulty: Difficulty): Country[] {
  return COUNTRIES.filter(
    (country) =>
      (region === 'all' || country.region === region) &&
      country.difficulty === difficulty,
  )
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
