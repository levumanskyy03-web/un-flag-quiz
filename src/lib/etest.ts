import { mineCatalog } from './mine'
import type { QuizMode } from './quiz'

const RUN_KEY = 'un-flag-quiz-etest'
const LEG_KEY = 'un-flag-quiz-etest-leg'

/** One sitting per mode: five questions, then the next mode. */
export const ETEST_QUESTIONS = 5 as const

/**
 * Station numbers that were removed. Later stations keep the numbers they had
 * before the deletion. 35 was the Rus rulers number mode.
 */
const ETEST_HOLES = [35] as const

export type EtestStation = { n: number; mode: QuizMode }

export function etestStations(): EtestStation[] {
  const holes = new Set<number>(ETEST_HOLES)
  const stations: EtestStation[] = []
  let n = 1
  for (const row of mineCatalog()) {
    while (holes.has(n)) n += 1
    stations.push({ n, mode: row.mode })
    n += 1
  }
  return stations
}

export function etestRoute(): QuizMode[] {
  return etestStations().map((station) => station.mode)
}

/** Highest station number, including holes, so labels stay stable. */
export function etestStationTotal(stations: readonly EtestStation[] = etestStations()): number {
  return stations.length === 0 ? 0 : stations[stations.length - 1].n
}

/** Compact route index for a typed station number. A hole snaps forward. */
export function etestIndexForNumber(n: number, stations: readonly EtestStation[] = etestStations()): number {
  if (stations.length === 0) return 0
  const want = Math.floor(n)
  const exact = stations.findIndex((station) => station.n === want)
  if (exact >= 0) return exact
  const next = stations.findIndex((station) => station.n >= want)
  return next >= 0 ? next : stations.length - 1
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
