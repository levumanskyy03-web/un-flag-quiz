import { collectionsOf } from '../../data/collections'
import { EMPIRE_RESOURCE_BY_WORLD, type EmpireBuilding, type EmpireResource } from '../../data/empire'
import { dailyCollection, dailyCollectionOf } from '../dailyChallenge'
import { isQuizWorld, type QuizWorld } from '../quiz/core'
import { buildingLevel, plusActive, withScore, type EmpireState } from './rules'

/**
 * Гейты контента (docs/economy.md, 4.8). Любой гейт открыт подпиской «Империя+»
 * либо прогрессом / разовой покупкой за внутреннюю валюту. Чистые функции — общие
 * для клиента и сервера.
 */

export type GateFeature =
  | { kind: 'difficulty'; difficulty: 'hard' | 'hardcore' }
  | { kind: 'levels'; world: QuizWorld; level: number }
  | { kind: 'levelHardcore' }
  | { kind: 'learn'; world: QuizWorld }
  | { kind: 'mistakes' }
  | { kind: 'list'; world: QuizWorld; index: number }
  | { kind: 'duelRoom' }
  | { kind: 'studio' }
  | { kind: 'board' }

export type GateProgress =
  | { type: 'era'; era: number }
  | { type: 'building'; building: EmpireBuilding; level: number }
  | { type: 'buildings'; rows: Array<{ building: EmpireBuilding; level: number }> }

export type GatePrice =
  | { type: 'coins'; amount: number }
  | { type: 'gems'; amount: number }
  | { type: 'resource'; resource: EmpireResource; amount: number }

export type GateInfo = {
  /** Ключ разовой покупки в `state.unlocks`; `null` — за валюту не открывается. */
  key: string | null
  /** Открыто всем без условий. */
  free: boolean
  progress: GateProgress | null
  price: GatePrice | null
}

export const LEVELS_FREE_MAX = 10
export const LEVELS_TIER2_MAX = 25
export const LEARN_FREE_ROWS = 30
export const LIST_FREE_COUNT = 2
export const MISTAKES_FREE_PER_DAY = 1
export const BOARD_FREE_TOP = 10

export function listRequiredLevel(index: number) {
  return 2 + 2 * (index - LIST_FREE_COUNT)
}

const OPEN: GateInfo = { key: null, free: true, progress: null, price: null }

export function gateInfo(f: GateFeature): GateInfo {
  switch (f.kind) {
    case 'difficulty':
      return f.difficulty === 'hard'
        ? { key: 'difficulty:hard', free: false, progress: { type: 'era', era: 2 }, price: { type: 'coins', amount: 300 } }
        : { key: 'difficulty:hardcore', free: false, progress: { type: 'era', era: 3 }, price: { type: 'gems', amount: 5 } }
    case 'levels': {
      if (f.level <= LEVELS_FREE_MAX) return OPEN
      const tier = f.level <= LEVELS_TIER2_MAX ? 2 : 3
      return {
        key: `levels:${f.world}:${tier}`,
        free: false,
        progress: { type: 'building', building: f.world, level: tier === 2 ? 5 : 15 },
        price: { type: 'resource', resource: EMPIRE_RESOURCE_BY_WORLD[f.world], amount: tier === 2 ? 200 : 800 },
      }
    }
    case 'levelHardcore':
      // Ключ нужен для бесплатной выдачи при миграции (уже проходил хардкор); за валюту не продаётся.
      return { key: 'levelHardcore', free: false, progress: { type: 'era', era: 3 }, price: null }
    case 'learn':
      return {
        key: `learn:${f.world}`,
        free: false,
        progress: { type: 'building', building: f.world, level: 3 },
        price: { type: 'coins', amount: 150 },
      }
    case 'mistakes':
      return { key: null, free: false, progress: { type: 'building', building: 'library', level: 5 }, price: null }
    case 'list': {
      if (f.index < LIST_FREE_COUNT) return OPEN
      const level = listRequiredLevel(f.index)
      return {
        key: `list:${f.world}:${f.index}`,
        free: false,
        progress: { type: 'building', building: f.world, level },
        price: { type: 'resource', resource: EMPIRE_RESOURCE_BY_WORLD[f.world], amount: 40 * level },
      }
    }
    case 'duelRoom':
      return { key: 'duelRoom', free: false, progress: { type: 'era', era: 2 }, price: { type: 'coins', amount: 400 } }
    case 'studio':
      return {
        key: 'studio',
        free: false,
        progress: { type: 'buildings', rows: [{ building: 'math', level: 10 }, { building: 'library', level: 10 }] },
        price: { type: 'gems', amount: 15 },
      }
    case 'board':
      return { key: null, free: false, progress: { type: 'era', era: 3 }, price: null }
  }
}

export function progressMet(state: EmpireState, progress: GateProgress | null) {
  if (!progress) return false
  if (progress.type === 'era') return state.era >= progress.era
  if (progress.type === 'building') return buildingLevel(state, progress.building) >= progress.level
  return progress.rows.every((row) => buildingLevel(state, row.building) >= row.level)
}

export type Access = 'open' | 'locked'

export function access(state: EmpireState, f: GateFeature, now = Date.now()): Access {
  const info = gateInfo(f)
  if (info.free) return 'open'
  if (plusActive(state, now)) return 'open'
  if (info.key && state.unlocks.includes(info.key)) return 'open'
  if (progressMet(state, info.progress)) return 'open'
  if (f.kind === 'mistakes' && state.daily.mistakesRuns < MISTAKES_FREE_PER_DAY) return 'open'
  return 'locked'
}

export function canPay(state: EmpireState, price: GatePrice | null) {
  if (!price) return false
  if (price.type === 'coins') return state.coins >= price.amount
  if (price.type === 'gems') return state.gems >= price.amount
  return (state.res[price.resource] ?? 0) >= price.amount
}

export type UnlockResult = { ok: true; state: EmpireState } | { ok: false; reason: 'open' | 'nokey' | 'cost' }

/** Разовая покупка гейта за валюту. */
export function unlock(state: EmpireState, f: GateFeature, now = Date.now()): UnlockResult {
  const info = gateInfo(f)
  if (access(state, f, now) === 'open') return { ok: false, reason: 'open' }
  if (!info.key || !info.price) return { ok: false, reason: 'nokey' }
  if (!canPay(state, info.price)) return { ok: false, reason: 'cost' }
  const price = info.price
  const next: EmpireState = {
    ...state,
    coins: price.type === 'coins' ? state.coins - price.amount : state.coins,
    gems: price.type === 'gems' ? state.gems - price.amount : state.gems,
    res: price.type === 'resource' ? { ...state.res, [price.resource]: state.res[price.resource] - price.amount } : state.res,
    unlocks: [...state.unlocks, info.key],
  }
  return { ok: true, state: withScore(next) }
}

/** Отмечает запуск тренажёра ошибок (бесплатный лимит в день). */
export function noteMistakesRun(state: EmpireState): EmpireState {
  return { ...state, daily: { ...state.daily, mistakesRuns: state.daily.mistakesRuns + 1 } }
}

export function grantPlus(state: EmpireState, days: number, now = Date.now()): EmpireState {
  const from = Math.max(now, state.plus.until)
  return { ...state, plus: { until: from + days * 86_400_000, source: 'grant' } }
}

/**
 * Гейт коллекции по её id; `null` — открыта (первые две в мире, сегодняшняя ежедневная
 * или тематическая ежедневная коллекция).
 */
export function listGateOf(world: QuizWorld, id: string, at = new Date()): GateFeature | null {
  const daily = dailyCollection(at)
  if (daily.world === world && daily.id === id) return null
  const theme = dailyCollectionOf(world, at)
  if (theme && theme.id === id) return null
  const index = collectionsOf(world).findIndex((item) => item.id === id)
  if (index < LIST_FREE_COUNT) return null
  return { kind: 'list', world, index }
}

/** Разбор гейта из тела запроса. */
export function parseGateFeature(raw: unknown): GateFeature | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const world = typeof r.world === 'string' && isQuizWorld(r.world) ? r.world : null
  const int = (v: unknown) => (Number.isInteger(v) && (v as number) >= 0 ? (v as number) : null)
  switch (r.kind) {
    case 'difficulty':
      return r.difficulty === 'hard' || r.difficulty === 'hardcore' ? { kind: 'difficulty', difficulty: r.difficulty } : null
    case 'levels': {
      const level = int(r.level)
      return world && level !== null ? { kind: 'levels', world, level } : null
    }
    case 'levelHardcore':
      return { kind: 'levelHardcore' }
    case 'learn':
      return world ? { kind: 'learn', world } : null
    case 'mistakes':
      return { kind: 'mistakes' }
    case 'list': {
      const index = int(r.index)
      return world && index !== null ? { kind: 'list', world, index } : null
    }
    case 'duelRoom':
      return { kind: 'duelRoom' }
    case 'studio':
      return { kind: 'studio' }
    case 'board':
      return { kind: 'board' }
    default:
      return null
  }
}
