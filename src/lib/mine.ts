import {
  astroModeLinks,
  footballModeLinks,
  geoModeLinks,
  leaderModeLinks,
  mathModeLinks,
  themeModeLinks,
} from './modePairs'
import { isQuizMode, isThemeWorld, QUIZ_WORLDS, worldOfMode, type QuizMode, type QuizWorld } from './quiz'

const MINE_KEY = 'un-flag-quiz-mine'
const RUN_KEY = 'un-flag-quiz-mine-run'
const LEG_KEY = 'un-flag-quiz-mine-leg'

export const MINE_MIN_QUIZZES = 5
export const MINE_MIN_THEMES = 3

export type MineQuiz = { world: QuizWorld; mode: QuizMode }

export function mineCatalog(): MineQuiz[] {
  const rows: MineQuiz[] = []
  const seen = new Set<QuizMode>()
  function push(links: readonly { mode: QuizMode }[]) {
    for (const link of links) {
      if (seen.has(link.mode)) continue
      seen.add(link.mode)
      rows.push({ world: worldOfMode(link.mode), mode: link.mode })
    }
  }
  push(geoModeLinks())
  push(leaderModeLinks())
  push(footballModeLinks())
  push(mathModeLinks())
  push(astroModeLinks())
  for (const world of QUIZ_WORLDS) {
    if (isThemeWorld(world)) push(themeModeLinks(world))
  }
  return rows
}

const CATALOG_MODES = new Set(mineCatalog().map((row) => row.mode))

export function loadMine(): QuizMode[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(MINE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const seen = new Set<QuizMode>()
    const modes: QuizMode[] = []
    for (const item of parsed) {
      if (!isQuizMode(item) || !CATALOG_MODES.has(item) || seen.has(item)) continue
      seen.add(item)
      modes.push(item)
    }
    return modes
  } catch {
    return []
  }
}

export function saveMine(modes: readonly QuizMode[]) {
  localStorage.setItem(MINE_KEY, JSON.stringify(modes))
}

export function mineThemeCount(modes: readonly QuizMode[]) {
  return new Set(modes.map((mode) => worldOfMode(mode))).size
}

export function mineReady(modes: readonly QuizMode[]) {
  return modes.length >= MINE_MIN_QUIZZES && mineThemeCount(modes) >= MINE_MIN_THEMES
}

/** Round-robin across themes so the route changes subject instead of dumping one world in a block. */
export function mineRoute(modes: readonly QuizMode[]): QuizMode[] {
  const buckets = new Map<QuizWorld, QuizMode[]>()
  for (const mode of modes) {
    const world = worldOfMode(mode)
    const list = buckets.get(world)
    if (list) list.push(mode)
    else buckets.set(world, [mode])
  }
  const out: QuizMode[] = []
  while (out.length < modes.length) {
    for (const list of buckets.values()) {
      const next = list.shift()
      if (next) out.push(next)
    }
  }
  return out
}

export function minePhase(index: number, total: number): 1 | 2 | 3 | 4 | 5 {
  if (total <= 1 || index <= 0) return 1
  if (index >= total - 1) return 5
  const pos = (index - 1) / Math.max(1, total - 2)
  if (pos < 1 / 3) return 2
  if (pos < 2 / 3) return 3
  return 4
}

function routeSignature(route: readonly QuizMode[]) {
  return route.join('|')
}

export function loadMineCleared(route: readonly QuizMode[]): number {
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

export function saveMineCleared(route: readonly QuizMode[], cleared: number) {
  const next = Math.max(0, Math.min(route.length, Math.floor(cleared)))
  localStorage.setItem(RUN_KEY, JSON.stringify({ signature: routeSignature(route), cleared: next }))
}

export function readMineLeg(): number | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(LEG_KEY)
  if (raw == null) return null
  const index = Number(raw)
  return Number.isInteger(index) && index >= 0 ? index : null
}

export function writeMineLeg(index: number) {
  sessionStorage.setItem(LEG_KEY, String(index))
}

export function clearMineLeg() {
  sessionStorage.removeItem(LEG_KEY)
}
