import { MATH_DIGIT_IDS, type MathDigitId } from '../data/mathDigits'

export const DIGIT_PROGRESS_KEY = 'un-flag-quiz-digits'

export type DigitBests = Record<MathDigitId, number>

export const EMPTY_DIGIT_BESTS: DigitBests = { pi: 0, phi: 0, e: 0, sqrt2: 0 }

function isBestRecord(value: unknown): value is Partial<Record<MathDigitId, unknown>> {
  return typeof value === 'object' && value !== null
}

export function loadDigitBests(): DigitBests {
  if (typeof window === 'undefined') return { ...EMPTY_DIGIT_BESTS }
  try {
    const raw = localStorage.getItem(DIGIT_PROGRESS_KEY)
    if (!raw) return { ...EMPTY_DIGIT_BESTS }
    const parsed: unknown = JSON.parse(raw)
    if (!isBestRecord(parsed)) return { ...EMPTY_DIGIT_BESTS }
    const next = { ...EMPTY_DIGIT_BESTS }
    for (const id of MATH_DIGIT_IDS) {
      const value = parsed[id]
      if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        next[id] = Math.min(1000, Math.floor(value))
      }
    }
    return next
  } catch {
    return { ...EMPTY_DIGIT_BESTS }
  }
}

export function saveDigitBest(id: MathDigitId, length: number): DigitBests {
  const current = loadDigitBests()
  const nextLength = Math.max(current[id], Math.min(1000, Math.max(0, Math.floor(length))))
  if (nextLength === current[id]) return current
  const next = { ...current, [id]: nextLength }
  if (typeof window !== 'undefined') {
    localStorage.setItem(DIGIT_PROGRESS_KEY, JSON.stringify(next))
  }
  return next
}
