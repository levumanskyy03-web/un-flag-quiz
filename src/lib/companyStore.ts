import {
  COMPANY_BASE_RATE,
  COMPANY_BUFF_MS,
  COMPANY_DEFAULT_CAP_MS,
  COMPANY_HQ_COST,
  COMPANY_OFFLINE_FACTOR,
  COMPANY_ROUND_KNOWLEDGE,
  COMPANY_SPARK_LIFE_MS,
  COMPANY_STAGE_COUNT,
  companyStage,
  sparkIntervalMs,
  type CompanyTask,
} from '../data/company'
import type { QuizWorld } from './quiz'
import { tokenKnowledgeBoostActive } from './tokenStore'

export const COMPANY_KEY = 'un-flag-quiz-company'

export type CompanySpark = {
  x: number
  y: number
  until: number
}

export type CompanyState = {
  knowledge: number
  ratePct: number
  capMs: number
  hq: boolean
  claimed: number
  sparks: number
  stageRounds: number
  stageWorldRounds: Partial<Record<QuizWorld, number>>
  stageCompletes: number
  stageFocusMs: number
  stageSparks: number
  lastTick: number
  buffUntil: number
  spark: CompanySpark | null
  nextSparkAt: number
}

type Listener = () => void

let memory: CompanyState | null = null
const listeners = new Set<Listener>()
let loop: number | null = null
let lastWrite = 0

function emptyState(now = Date.now()): CompanyState {
  return {
    knowledge: 0,
    ratePct: 0,
    capMs: COMPANY_DEFAULT_CAP_MS,
    hq: false,
    claimed: 0,
    sparks: 0,
    stageRounds: 0,
    stageWorldRounds: {},
    stageCompletes: 0,
    stageFocusMs: 0,
    stageSparks: 0,
    lastTick: now,
    buffUntil: 0,
    spark: null,
    nextSparkAt: now + 50_000 + Math.random() * 40_000,
  }
}

function parseState(raw: unknown): CompanyState | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Partial<CompanyState>
  const now = Date.now()
  const base = emptyState(now)
  return {
    ...base,
    knowledge: Math.max(0, Number(row.knowledge) || 0),
    ratePct: Math.max(0, Number(row.ratePct) || 0),
    capMs: Math.max(COMPANY_DEFAULT_CAP_MS, Number(row.capMs) || COMPANY_DEFAULT_CAP_MS),
    hq: Boolean(row.hq),
    claimed: Math.min(COMPANY_STAGE_COUNT, Math.max(0, Math.floor(Number(row.claimed) || 0))),
    sparks: Math.max(0, Math.floor(Number(row.sparks) || 0)),
    stageRounds: Math.max(0, Math.floor(Number(row.stageRounds) || 0)),
    stageWorldRounds: row.stageWorldRounds && typeof row.stageWorldRounds === 'object' ? row.stageWorldRounds : {},
    stageCompletes: Math.max(0, Math.floor(Number(row.stageCompletes) || 0)),
    stageFocusMs: Math.max(0, Math.floor(Number(row.stageFocusMs) || 0)),
    stageSparks: Math.max(0, Math.floor(Number(row.stageSparks) || 0)),
    lastTick: Math.max(0, Number(row.lastTick) || now),
    buffUntil: Math.max(0, Number(row.buffUntil) || 0),
    spark: null,
    nextSparkAt: Math.max(now, Number(row.nextSparkAt) || now + sparkIntervalMs(Number(row.claimed) || 0)),
  }
}

function readStored(): CompanyState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(COMPANY_KEY)
    if (!raw) return null
    return parseState(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

function persist(state: CompanyState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(COMPANY_KEY, JSON.stringify({ ...state, spark: null }))
  } catch {
    /* quota */
  }
}

function emit() {
  for (const listener of listeners) listener()
}

function commit(next: CompanyState, save = true) {
  memory = next
  const now = Date.now()
  if (save || now - lastWrite > 10_000) {
    persist(next)
    lastWrite = now
  }
  emit()
  return next
}

const SERVER_SNAPSHOT = emptyState(0)
let clientReady = false

export function getCompanyServerSnapshot(): CompanyState {
  return SERVER_SNAPSHOT
}

export function getCompanyClientSnapshot(): CompanyState {
  if (!clientReady) return SERVER_SNAPSHOT
  return loadCompany()
}

export function loadCompany(): CompanyState {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT
  if (memory) return memory
  memory = readStored() ?? emptyState()
  return memory
}

export function subscribeCompany(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function companyRate(state: CompanyState, now = Date.now()) {
  const hq = state.hq ? 1.5 : 1
  const buff = now < state.buffUntil ? 2 : 1
  const tokenBuff = tokenKnowledgeBoostActive(now) ? 2 : 1
  return COMPANY_BASE_RATE * (1 + state.ratePct / 100) * hq * buff * tokenBuff
}

export function companyRatePerMin(state: CompanyState, now = Date.now()) {
  return companyRate(state, now) * 60
}

function accrue(state: CompanyState, ms: number, factor: number, now: number): CompanyState {
  if (ms <= 0) return state
  const gained = companyRate(state, now) * (ms / 1000) * factor
  return { ...state, knowledge: state.knowledge + gained, lastTick: now }
}

function visibleNow() {
  return typeof document !== 'undefined' && document.visibilityState === 'visible'
}

export function companyTick(now = Date.now()): CompanyState {
  const prev = loadCompany()
  const visible = visibleNow()
  const elapsed = Math.max(0, now - prev.lastTick)
  let next = prev

  if (!visible) {
    if (next.spark && next.spark.until <= now) {
      next = { ...next, spark: null, nextSparkAt: now + sparkIntervalMs(next.claimed) }
      return commit(next, true)
    }
    return prev
  }

  if (elapsed > 2500) {
    const offline = Math.min(elapsed, next.capMs)
    next = accrue(next, offline, COMPANY_OFFLINE_FACTOR, now)
  } else if (elapsed > 0) {
    next = accrue(next, elapsed, 1, now)
    next = { ...next, stageFocusMs: next.stageFocusMs + elapsed }
  }

  if (next.spark && next.spark.until <= now) {
    next = { ...next, spark: null, nextSparkAt: now + sparkIntervalMs(next.claimed) }
  }

  if (!next.spark && now >= next.nextSparkAt) {
    next = {
      ...next,
      spark: {
        x: 10 + Math.random() * 80,
        y: 18 + Math.random() * 62,
        until: now + COMPANY_SPARK_LIFE_MS,
      },
    }
  }

  return commit(next, false)
}

export function catchCompanySpark(now = Date.now()): CompanyState {
  const prev = loadCompany()
  if (!prev.spark || prev.spark.until < now) return prev
  const burst = 25 * (1 + prev.ratePct / 100) * (prev.hq ? 1.2 : 1)
  return commit({
    ...prev,
    spark: null,
    knowledge: prev.knowledge + burst,
    sparks: prev.sparks + 1,
    stageSparks: prev.stageSparks + 1,
    buffUntil: now + COMPANY_BUFF_MS,
    nextSparkAt: now + sparkIntervalMs(prev.claimed),
    lastTick: now,
  })
}

export function companyOnRound(world: QuizWorld, complete: boolean): CompanyState {
  const prev = loadCompany()
  const pack = COMPANY_ROUND_KNOWLEDGE * (complete ? 1.5 : 1)
  const worldRounds = { ...prev.stageWorldRounds }
  worldRounds[world] = (worldRounds[world] ?? 0) + 1
  return commit({
    ...prev,
    knowledge: prev.knowledge + pack,
    stageRounds: prev.stageRounds + 1,
    stageWorldRounds: worldRounds,
    stageCompletes: prev.stageCompletes + (complete ? 1 : 0),
  })
}

export function buyCompanyHq(): CompanyState {
  const prev = loadCompany()
  if (prev.hq || prev.knowledge < COMPANY_HQ_COST) return prev
  return commit({ ...prev, hq: true, knowledge: prev.knowledge - COMPANY_HQ_COST })
}

function resetStageCounters(state: CompanyState): CompanyState {
  return {
    ...state,
    stageRounds: 0,
    stageWorldRounds: {},
    stageCompletes: 0,
    stageFocusMs: 0,
    stageSparks: 0,
  }
}

export function taskProgress(state: CompanyState, task: CompanyTask): { current: number; goal: number } {
  const goal = Math.max(1, task.n)
  if (task.kind === 'focus') return { current: Math.floor(state.stageFocusMs / 60_000), goal }
  if (task.kind === 'sparks') return { current: state.stageSparks, goal }
  if (task.kind === 'rounds') return { current: state.stageRounds, goal }
  if (task.kind === 'completes') return { current: state.stageCompletes, goal }
  if (task.kind === 'buyHq') return { current: state.hq ? 1 : 0, goal: 1 }
  return { current: state.stageWorldRounds[task.world ?? 'geo'] ?? 0, goal }
}

export function taskDone(state: CompanyState, task: CompanyTask) {
  const { current, goal } = taskProgress(state, task)
  return current >= goal
}

export function stageStars(state: CompanyState, level = state.claimed + 1) {
  const stage = companyStage(level)
  if (!stage) return 0
  if (level <= state.claimed) return 3
  if (level > state.claimed + 1) return 0
  return stage.tasks.filter((task) => taskDone(state, task)).length
}

export function stageReady(state: CompanyState) {
  const stage = companyStage(state.claimed + 1)
  if (!stage) return false
  return stage.tasks.every((task) => taskDone(state, task))
}

export function claimCompanyStage(): CompanyState {
  const prev = loadCompany()
  const stage = companyStage(prev.claimed + 1)
  if (!stage || !stage.tasks.every((task) => taskDone(prev, task))) return prev
  return commit(
    resetStageCounters({
      ...prev,
      claimed: stage.level,
      knowledge: prev.knowledge + stage.reward.knowledge,
      ratePct: prev.ratePct + stage.reward.ratePct,
      capMs: prev.capMs + stage.reward.capMs,
    }),
  )
}

function onCompanyVisibility() {
  companyTick()
}

export function startCompanyLoop() {
  if (typeof window === 'undefined') return
  clientReady = true
  if (loop !== null) {
    emit()
    return
  }
  onCompanyVisibility()
  loop = window.setInterval(onCompanyVisibility, 1000)
  document.addEventListener('visibilitychange', onCompanyVisibility)
  emit()
}

export function stopCompanyLoop() {
  if (typeof window === 'undefined' || loop === null) return
  window.clearInterval(loop)
  loop = null
  document.removeEventListener('visibilitychange', onCompanyVisibility)
}
