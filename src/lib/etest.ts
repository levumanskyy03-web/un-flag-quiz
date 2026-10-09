import { mineCatalog } from './mine'
import type { QuizMode } from './quiz'

const RUN_KEY = 'un-flag-quiz-etest'
const LEG_KEY = 'un-flag-quiz-etest-leg'

/** One sitting per mode: five questions, then the next mode. */
export const ETEST_QUESTIONS = 5 as const

export function etestRoute(): QuizMode[] {
  return mineCatalog().map((row) => row.mode)
}

function routeSignature(route: readonly QuizMode[]) {
  return route.join('|')
}

export function loadEtestCleared(route: readonly QuizMode[]): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem(RUN_KEY)
    if (!raw) return 0
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return 0
    const row = parsed as { signature?: unknown; cleared?: unknown }
    if (row.signature !== routeSignature(route) || typeof row.cleared !== 'number') return 0
    return Math.max(0, Math.min(route.length, Math.floor(row.cleared)))
  } catch {
    return 0
  }
}

export function saveEtestCleared(route: readonly QuizMode[], cleared: number) {
  const next = Math.max(0, Math.min(route.length, Math.floor(cleared)))
  localStorage.setItem(RUN_KEY, JSON.stringify({ signature: routeSignature(route), cleared: next }))
}

export function resetEtest(route: readonly QuizMode[]) {
  saveEtestCleared(route, 0)
  clearEtestLeg()
}

export function readEtestLeg(): number | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(LEG_KEY)
  if (raw == null) return null
  const index = Number(raw)
  return Number.isInteger(index) && index >= 0 ? index : null
}

export function writeEtestLeg(index: number) {
  sessionStorage.setItem(LEG_KEY, String(index))
}

export function clearEtestLeg() {
  sessionStorage.removeItem(LEG_KEY)
}
