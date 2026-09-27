import type { LearnFrom, RegionFilter } from './quiz/core'

const KEY = 'pq-dish-return'
const MAX_AGE_MS = 30 * 60 * 1000

export type DishReturn = {
  mode: string
  learnFrom: LearnFrom
  level: number
  region: RegionFilter
}

export function rememberDishReturn(value: DishReturn) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...value, at: Date.now() }))
  } catch {
    /* private mode */
  }
}

export function clearDishReturn() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* private mode */
  }
}

/** Pending return to the food learn list, set when a dish card is opened from it. */
export function readDishReturn(): DishReturn | null {
  let raw: string | null = null
  try {
    raw = sessionStorage.getItem(KEY)
  } catch {
    return null
  }
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<DishReturn> & { at?: unknown }
    if (typeof parsed.at !== 'number' || Date.now() - parsed.at > MAX_AGE_MS) return null
    if (typeof parsed.mode !== 'string' || !parsed.mode) return null
    return {
      mode: parsed.mode,
      learnFrom: parsed.learnFrom === 'level' ? 'level' : 'region',
      level: typeof parsed.level === 'number' && Number.isFinite(parsed.level) ? parsed.level : 1,
      region: typeof parsed.region === 'string' && parsed.region ? parsed.region : 'all',
    }
  } catch {
    return null
  }
}
