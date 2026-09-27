import { EMPIRE_RESOURCE_BY_WORLD, type EmpireResource } from '../../data/empire'
import { QUIZ_WORLDS, isQuizWorld, type PlayPath, type QuizDifficulty, type QuizWorld, type RoundEnd } from '../quiz/core'

/** Указ страны. Фокус — `focus:${world}`. Меняется раз в день. */
export type EmpireDecree = 'balanced' | 'tax' | 'scholarship' | `focus:${QuizWorld}`

export type EmpireContractKind = 'correct' | 'perfect' | 'path'

export type EmpireContract = {
  id: string
  kind: EmpireContractKind
  world: QuizWorld | null
  path: PlayPath | null
  goal: number
  progress: number
  claimed: boolean
  coins: number
  resource: number
  gems: number
}

export type EmpireEconomy = {
  /** 0–100. Растёт от точности в мире, по 5 в сутки тает. */
  mastery: Record<QuizWorld, number>
  decree: EmpireDecree
  /** День, когда указ уже меняли. Пусто — ещё можно. */
  decreeDay: string
  /** Сколько ресурса уже обменяли сегодня. */
  tradeSpent: number
  contracts: EmpireContract[]
  /** Созревший урожай грядки мира. Забирается на складе вручную. */
  fields: Record<QuizWorld, number>
}

export type EmpireRewardNote = 'focus' | 'tax' | 'scholar' | 'expert' | 'contract'

export type RoundShape = {
  world: QuizWorld
  path: PlayPath
  endedBy: RoundEnd
  correct: number
  total: number
  difficulty: QuizDifficulty
  hardcore?: boolean
  perfect: boolean
}

const PATHS: readonly PlayPath[] = ['pool', 'levels', 'learn', 'mistakes', 'list', 'daily']

export function emptyEconomy(): EmpireEconomy {
  return {
    mastery: Object.fromEntries(QUIZ_WORLDS.map((w) => [w, 0])) as Record<QuizWorld, number>,
    decree: 'balanced',
    decreeDay: '',
    tradeSpent: 0,
    contracts: [],
    fields: Object.fromEntries(QUIZ_WORLDS.map((w) => [w, 0])) as Record<QuizWorld, number>,
  }
}

/** Сколько урожая держит грядка: немного даже без здания, дальше — от его уровня. */
export function fieldCap(level: number) {
  return 6 + 8 * Math.max(0, level)
}

/** Один верный ответ — одна единица ресурса мира на грядке. Идеальный раунд даёт ещё две. */
export function farmYield(ctx: { correct: number; endedBy: string; perfect: boolean }) {
  if (ctx.correct <= 0) return 0
  return ctx.correct + (ctx.endedBy === 'complete' && ctx.perfect ? 2 : 0)
}

export function sowField(economy: EmpireEconomy, world: QuizWorld, amount: number, cap: number): EmpireEconomy {
  const add = Math.floor(amount)
  if (add <= 0) return economy
  const have = economy.fields?.[world] ?? 0
  const next = Math.min(Math.max(0, cap), have + add)
  if (next === have) return economy
  const fields = { ...(economy.fields ?? emptyEconomy().fields), [world]: next }
  return { ...economy, fields }
}

export function isEmpireDecree(value: unknown): value is EmpireDecree {
  if (value === 'balanced' || value === 'tax' || value === 'scholarship') return true
  return typeof value === 'string' && value.startsWith('focus:') && isQuizWorld(value.slice(6))
}

export function focusWorld(decree: EmpireDecree): QuizWorld | null {
  return decree.startsWith('focus:') ? (decree.slice(6) as QuizWorld) : null
}

/** Мир-поставщик: предыдущий в кольце QUIZ_WORLDS. География кормится специями, лидеры — картами. */
export function partnerWorld(world: QuizWorld): QuizWorld {
  const index = QUIZ_WORLDS.indexOf(world)
  return QUIZ_WORLDS[(index + QUIZ_WORLDS.length - 1) % QUIZ_WORLDS.length]
}

export function partnerResource(world: QuizWorld): EmpireResource {
  return EMPIRE_RESOURCE_BY_WORLD[partnerWorld(world)]
}

export function supplyNeed(level: number) {
  return 8 + 6 * Math.max(0, level)
}

/** Пустой склад поставщика — 0.72, полный — 1.2. */
export function supplyMult(stock: number, level: number) {
  if (level <= 0) return 1
  const ratio = Math.min(1, Math.max(0, stock) / supplyNeed(level))
  return 0.72 + 0.48 * ratio
}

/** Мастерство только усиливает: 1 на нуле, 1.45 на сотне. */
export function masteryMult(mastery: number) {
  return 1 + 0.0045 * Math.min(100, Math.max(0, mastery))
}

export function decreeProduction(decree: EmpireDecree, world: QuizWorld) {
  if (decree === 'tax') return { res: 0.82, coins: 1.35 }
  if (decree === 'scholarship') return { res: 1.12, coins: 0.78 }
  if (decree === `focus:${world}`) return { res: 1.4, coins: 1.12 }
  if (decree.startsWith('focus:')) return { res: 0.9, coins: 0.95 }
  return { res: 1, coins: 1 }
}

export function tradeRate(treasuryLevel: number) {
  return Math.min(0.9, 0.42 + 0.035 * Math.max(0, treasuryLevel))
}

export function tradeOut(amount: number, treasuryLevel: number) {
  return Math.floor(amount * tradeRate(treasuryLevel))
}

export function tradeFee(amount: number) {
  return Math.ceil(amount * 0.35)
}

export function tradeCap(era: number) {
  return 50 + 25 * Math.max(1, era)
}

function hashDay(day: string) {
  let h = 2166136261
  for (let i = 0; i < day.length; i++) h = Math.imul(h ^ day.charCodeAt(i), 16777619)
  return h >>> 0
}

/** Три контракта на календарный день. Одинаковы у всех — день общий. */
export function rollContracts(day: string, era: number): EmpireContract[] {
  const h = hashDay(day)
  const worldA = QUIZ_WORLDS[h % QUIZ_WORLDS.length]
  const worldB = QUIZ_WORLDS[(h >>> 5) % QUIZ_WORLDS.length]
  const paths: readonly PlayPath[] = ['pool', 'levels', 'list', 'daily']
  const path = paths[(h >>> 9) % paths.length]
  const scale = 1 + (Math.max(1, era) - 1) * 0.35
  const correctGoal = 8 + (h % 5) * 4
  return [
    {
      id: `${day}:correct`,
      kind: 'correct',
      world: worldA,
      path: null,
      goal: correctGoal,
      progress: 0,
      claimed: false,
      coins: Math.round(36 * scale),
      resource: Math.round(14 * scale),
      gems: 0,
    },
    {
      id: `${day}:perfect`,
      kind: 'perfect',
      world: null,
      path: null,
      goal: era >= 5 ? 2 : 1,
      progress: 0,
      claimed: false,
      coins: Math.round(28 * scale),
      resource: 0,
      gems: era >= 3 ? 1 : 0,
    },
    {
      id: `${day}:path`,
      kind: 'path',
      world: path === 'daily' ? null : worldB,
      path,
      goal: 1,
      progress: 0,
      claimed: false,
      coins: Math.round(32 * scale),
      resource: Math.round(16 * scale),
      gems: 0,
    },
  ]
}

function clampContract(raw: unknown): EmpireContract | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Partial<EmpireContract>
  if (row.kind !== 'correct' && row.kind !== 'perfect' && row.kind !== 'path') return null
  if (typeof row.id !== 'string' || row.id.length > 40) return null
  const world = isQuizWorld(row.world) ? row.world : null
  const path = typeof row.path === 'string' && (PATHS as readonly string[]).includes(row.path) ? row.path : null
  const n = (v: unknown, max: number) => {
    const x = Math.floor(Number(v))
    return Number.isFinite(x) ? Math.min(max, Math.max(0, x)) : 0
  }
  const goal = Math.max(1, n(row.goal, 80))
  return {
    id: row.id,
    kind: row.kind,
    world,
    path,
    goal,
    progress: Math.min(goal, n(row.progress, 80)),
    claimed: Boolean(row.claimed),
    coins: n(row.coins, 5000),
    resource: n(row.resource, 5000),
    gems: n(row.gems, 20),
  }
}

export function parseEconomy(raw: unknown): EmpireEconomy {
  const base = emptyEconomy()
  if (!raw || typeof raw !== 'object') return base
  const row = raw as Partial<EmpireEconomy>
  if (row.mastery && typeof row.mastery === 'object') {
    for (const world of QUIZ_WORLDS) {
      const n = Math.floor(Number((row.mastery as Record<string, unknown>)[world]))
      if (Number.isFinite(n)) base.mastery[world] = Math.min(100, Math.max(0, n))
    }
  }
  if (isEmpireDecree(row.decree)) base.decree = row.decree
  if (typeof row.decreeDay === 'string') base.decreeDay = row.decreeDay.slice(0, 10)
  const spent = Math.floor(Number(row.tradeSpent))
  if (Number.isFinite(spent)) base.tradeSpent = Math.min(10_000, Math.max(0, spent))
  if (Array.isArray(row.contracts)) {
    base.contracts = row.contracts.map(clampContract).filter((c): c is EmpireContract => c !== null).slice(0, 3)
  }
  const fields = (row as { fields?: unknown }).fields
  if (fields && typeof fields === 'object') {
    for (const world of QUIZ_WORLDS) {
      const n = Math.floor(Number((fields as Record<string, unknown>)[world]))
      if (Number.isFinite(n)) base.fields[world] = Math.min(5000, Math.max(0, n))
    }
  }
  return base
}

/** Списание мастерства и новый набор контрактов на новый день. */
export function rollEconomyDay(economy: EmpireEconomy, day: string, era: number): EmpireEconomy {
  const mastery = { ...economy.mastery }
  for (const world of QUIZ_WORLDS) mastery[world] = Math.max(0, mastery[world] - 5)
  return { ...economy, mastery, tradeSpent: 0, contracts: rollContracts(day, era) }
}

export function ensureContracts(economy: EmpireEconomy, day: string, era: number): EmpireEconomy {
  if (economy.contracts.length > 0) return economy
  return { ...economy, contracts: rollContracts(day, era) }
}

function hardRound(ctx: RoundShape) {
  return ctx.difficulty === 'hard' || ctx.difficulty === 'hardcore' || Boolean(ctx.hardcore)
}

export function roundMods(economy: EmpireEconomy, level: number, ctx: RoundShape) {
  const complete = ctx.endedBy === 'complete'
  const mastery = economy.mastery[ctx.world] ?? 0
  let resMult = 1
  let coinMult = 1
  let specialists = 0
  const notes: EmpireRewardNote[] = []
  if (economy.decree === `focus:${ctx.world}`) {
    resMult *= 1.5
    notes.push('focus')
  } else if (economy.decree.startsWith('focus:')) {
    resMult *= 0.85
  }
  if (economy.decree === 'tax') {
    coinMult *= 1.25
    resMult *= 0.8
    notes.push('tax')
  }
  if (economy.decree === 'scholarship') {
    coinMult *= 0.85
    if (complete && ctx.perfect && ctx.path !== 'learn' && ctx.path !== 'mistakes') {
      specialists += 1
      notes.push('scholar')
    }
  }
  if (mastery >= 75 && ctx.correct > 0) {
    resMult *= 1.25
    notes.push('expert')
  } else if (mastery < 12 && level >= 4) {
    resMult *= 0.85
  }
  return { resMult, coinMult, specialists, notes }
}

export function growMastery(economy: EmpireEconomy, ctx: RoundShape): { economy: EmpireEconomy; delta: number } {
  if (ctx.correct <= 0) return { economy, delta: 0 }
  const acc = ctx.total > 0 ? ctx.correct / ctx.total : 0
  const complete = ctx.endedBy === 'complete'
  const gain = Math.round((complete ? 10 : 4) * acc + (ctx.perfect ? 8 : 0) + (hardRound(ctx) ? 4 : 0))
  const prev = economy.mastery[ctx.world] ?? 0
  const next = Math.min(100, prev + gain)
  if (next === prev) return { economy, delta: 0 }
  return { economy: { ...economy, mastery: { ...economy.mastery, [ctx.world]: next } }, delta: next - prev }
}

export function growContracts(economy: EmpireEconomy, ctx: RoundShape): { economy: EmpireEconomy; completed: boolean } {
  let completed = false
  const contracts = economy.contracts.map((contract) => {
    if (contract.claimed || contract.progress >= contract.goal) return contract
    let add = 0
    if (contract.kind === 'correct' && contract.world === ctx.world) add = ctx.correct
    if (contract.kind === 'perfect' && ctx.endedBy === 'complete' && ctx.perfect) add = 1
    if (
      contract.kind === 'path' &&
      ctx.endedBy === 'complete' &&
      contract.path === ctx.path &&
      (contract.path === 'daily' || contract.world === ctx.world)
    ) {
      add = 1
    }
    if (add <= 0) return contract
    const progress = Math.min(contract.goal, contract.progress + add)
    if (progress >= contract.goal && contract.progress < contract.goal) completed = true
    return { ...contract, progress }
  })
  return { economy: { ...economy, contracts }, completed }
}
