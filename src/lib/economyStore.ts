import {
  EXCHANGE_TOKEN_PACK,
  KNOWLEDGE_DAY_FROM_TOKENS,
  KNOWLEDGE_TO_TOKEN,
  TOKEN_TO_KNOWLEDGE,
  TOKENS_DAY_FROM_KNOWLEDGE,
  VAULT_GEO_KNOWLEDGE,
  VAULT_POWER_FLOOR,
  VAULT_POWER_OFF,
  WEEK_BOOST_MS,
  weekContracts,
  weekMarketLots,
  weekStamp,
  type EconomyContract,
  type MarketLot,
} from '../data/economy'
import { TOKEN_COST } from '../data/tokens'
import { isQuizWorld, type PlayPath, type QuizWorld } from './quiz'
import { grantCompanyKnowledge, spendCompanyKnowledge } from './companyStore'
import { returnStampCopy, takeStampCopy } from './stamps'
import { creditTokens, extendKnowledgeBoost, spendTokens } from './tokenStore'
import { useSyncExternalStore } from 'react'

export const ECONOMY_KEY = 'un-flag-quiz-economy'

export type EconomyState = {
  dayStamp: string
  weekStamp: string
  knowledgeFromTokensToday: number
  tokensFromKnowledgeToday: number
  claimedLots: string[]
  contracts: EconomyContract[]
  vaultIso: string | null
  worldEarned: Partial<Record<QuizWorld, number>>
}

type Listener = () => void

let memory: EconomyState | null = null
const listeners = new Set<Listener>()

function localDayStamp(now = Date.now()) {
  const date = new Date(now)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function emptyState(now = Date.now()): EconomyState {
  const week = weekStamp(now)
  return {
    dayStamp: localDayStamp(now),
    weekStamp: week,
    knowledgeFromTokensToday: 0,
    tokensFromKnowledgeToday: 0,
    claimedLots: [],
    contracts: weekContracts(week),
    vaultIso: null,
    worldEarned: {},
  }
}

function parseWorldEarned(raw: unknown): Partial<Record<QuizWorld, number>> {
  if (!raw || typeof raw !== 'object') return {}
  const next: Partial<Record<QuizWorld, number>> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!isQuizWorld(key)) continue
    next[key] = Math.max(0, Math.floor(Number(value) || 0))
  }
  return next
}

function parseContracts(raw: unknown, week: string): EconomyContract[] {
  const fresh = weekContracts(week)
  if (!Array.isArray(raw)) return fresh
  const byId = new Map<string, EconomyContract>()
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const row = item as Partial<EconomyContract>
    if (typeof row.id !== 'string') continue
    const template = fresh.find((entry) => entry.id === row.id)
    if (!template) continue
    const status: EconomyContract['status'] =
      row.status === 'active' || row.status === 'won' || row.status === 'lost' || row.status === 'open'
        ? row.status
        : 'open'
    byId.set(row.id, {
      ...template,
      status,
      progress: Math.max(0, Math.floor(Number(row.progress) || 0)),
    })
  }
  return fresh.map((entry) => byId.get(entry.id) ?? entry)
}

function parseState(raw: unknown): EconomyState | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Partial<EconomyState>
  const base = emptyState()
  const week = typeof row.weekStamp === 'string' && /^\d{4}-W\d{2}$/.test(row.weekStamp) ? row.weekStamp : base.weekStamp
  return {
    ...base,
    dayStamp: typeof row.dayStamp === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(row.dayStamp) ? row.dayStamp : base.dayStamp,
    weekStamp: week,
    knowledgeFromTokensToday: Math.max(0, Math.floor(Number(row.knowledgeFromTokensToday) || 0)),
    tokensFromKnowledgeToday: Math.max(0, Math.floor(Number(row.tokensFromKnowledgeToday) || 0)),
    claimedLots: Array.isArray(row.claimedLots) ? row.claimedLots.filter((id): id is string => typeof id === 'string') : [],
    contracts: parseContracts(row.contracts, week),
    vaultIso: typeof row.vaultIso === 'string' && row.vaultIso.length === 2 ? row.vaultIso : null,
    worldEarned: parseWorldEarned(row.worldEarned),
  }
}

function persist(state: EconomyState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ECONOMY_KEY, JSON.stringify(state))
  } catch {
    /* quota */
  }
}

function emit() {
  for (const listener of listeners) listener()
}

function commit(next: EconomyState) {
  memory = next
  persist(next)
  emit()
  return next
}

const SERVER_SNAPSHOT = emptyState(0)
let clientReady = false

function readStored(): EconomyState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(ECONOMY_KEY)
    if (!raw) return null
    return parseState(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

function failWeek(state: EconomyState): EconomyState {
  return state
}

function roll(state: EconomyState, now = Date.now()): EconomyState {
  const day = localDayStamp(now)
  const week = weekStamp(now)
  let next = state
  if (next.weekStamp !== week) {
    const failed = failWeek(next)
    next = {
      ...failed,
      weekStamp: week,
      claimedLots: [],
      contracts: weekContracts(week),
      worldEarned: {},
    }
  }
  if (next.dayStamp !== day) {
    next = { ...next, dayStamp: day, knowledgeFromTokensToday: 0, tokensFromKnowledgeToday: 0 }
  }
  return next
}

export function getEconomyServerSnapshot(): EconomyState {
  return SERVER_SNAPSHOT
}

export function getEconomyClientSnapshot(): EconomyState {
  if (!clientReady) return SERVER_SNAPSHOT
  return loadEconomy()
}

export function loadEconomy(): EconomyState {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT
  clientReady = true
  if (memory) {
    const rolled = roll(memory)
    if (rolled !== memory) commit(rolled)
    return memory
  }
  memory = roll(readStored() ?? emptyState())
  persist(memory)
  return memory
}

export function subscribeEconomy(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useEconomy() {
  return useSyncExternalStore(subscribeEconomy, getEconomyClientSnapshot, getEconomyServerSnapshot)
}

export function vaultIso() {
  return loadEconomy().vaultIso
}

export function powerTokenCost(kind: 'hint' | 'skip' | 'life') {
  const off = loadEconomy().vaultIso ? VAULT_POWER_OFF : 0
  return Math.max(VAULT_POWER_FLOOR, TOKEN_COST[kind] - off)
}

export function noteWorldTokenGain(world: QuizWorld, amount: number) {
  const n = Math.max(0, Math.floor(amount))
  if (n <= 0) return
  const prev = loadEconomy()
  commit({
    ...prev,
    worldEarned: { ...prev.worldEarned, [world]: (prev.worldEarned[world] ?? 0) + n },
  })
}

export function sellTokenPack(): boolean {
  const prev = loadEconomy()
  const knowledge = EXCHANGE_TOKEN_PACK * TOKEN_TO_KNOWLEDGE
  if (prev.knowledgeFromTokensToday + knowledge > KNOWLEDGE_DAY_FROM_TOKENS) return false
  if (!spendTokens(EXCHANGE_TOKEN_PACK)) return false
  grantCompanyKnowledge(knowledge)
  commit({ ...prev, knowledgeFromTokensToday: prev.knowledgeFromTokensToday + knowledge })
  return true
}

export function buyTokenFromKnowledge(): boolean {
  const prev = loadEconomy()
  if (prev.tokensFromKnowledgeToday >= TOKENS_DAY_FROM_KNOWLEDGE) return false
  if (!spendCompanyKnowledge(KNOWLEDGE_TO_TOKEN)) return false
  creditTokens(1, false)
  commit({ ...prev, tokensFromKnowledgeToday: prev.tokensFromKnowledgeToday + 1 })
  return true
}

export function marketLotsNow(): MarketLot[] {
  return weekMarketLots(loadEconomy().weekStamp)
}

export function buyMarketLot(id: string): boolean {
  const prev = loadEconomy()
  if (prev.claimedLots.includes(id)) return false
  const lot = weekMarketLots(prev.weekStamp).find((item) => item.id === id)
  if (!lot) return false
  if (lot.world && (prev.worldEarned[lot.world] ?? 0) < (lot.worldNeed ?? 0)) return false
  if (!spendTokens(lot.cost)) return false
  if (lot.kind === 'longBoost') extendKnowledgeBoost(WEEK_BOOST_MS)
  else if (lot.knowledge) grantCompanyKnowledge(lot.knowledge)
  commit({ ...prev, claimedLots: [...prev.claimedLots, id] })
  return true
}

function stampContractActive(state: EconomyState) {
  return state.contracts.some((item) => item.stamp && item.status === 'active')
}

export function setVaultIso(iso: string | null) {
  const prev = loadEconomy()
  commit({ ...prev, vaultIso: iso })
}

export function pledgeStamp(iso: string): boolean {
  const prev = loadEconomy()
  if (prev.vaultIso) return false
  if (!takeStampCopy(iso)) return false
  commit({ ...prev, vaultIso: iso })
  return true
}

export function recallStamp(): boolean {
  const prev = loadEconomy()
  if (!prev.vaultIso || stampContractActive(prev)) return false
  returnStampCopy(prev.vaultIso)
  commit({ ...prev, vaultIso: null })
  return true
}

export function takeContract(id: string): boolean {
  const prev = loadEconomy()
  const item = prev.contracts.find((row) => row.id === id)
  if (!item || item.status !== 'open') return false
  if (item.stamp) {
    if (!prev.vaultIso) return false
  } else if (!spendTokens(item.stake)) return false
  commit({
    ...prev,
    contracts: prev.contracts.map((row) => (row.id === id ? { ...row, status: 'active' } : row)),
  })
  return true
}

function bumpContract(item: EconomyContract, ctx: { world: QuizWorld; complete: boolean; perfect: boolean }) {
  if (item.status !== 'active') return item
  if (item.kind === 'worldRounds' && ctx.world === item.world) {
    return { ...item, progress: item.progress + 1 }
  }
  if (item.kind === 'worldComplete' && ctx.world === item.world && ctx.complete) {
    return { ...item, progress: item.progress + 1 }
  }
  if (item.kind === 'perfect' && ctx.world === item.world && ctx.perfect) {
    return { ...item, progress: item.progress + 1 }
  }
  if (item.kind === 'stampGeo' && ctx.world === 'geo' && ctx.complete) {
    return { ...item, progress: item.progress + 1 }
  }
  return item
}

function settle(item: EconomyContract): EconomyContract {
  if (item.status !== 'active' || item.progress < item.goal) return item
  creditTokens(item.payout, false)
  return { ...item, status: 'won' }
}

export function economyOnRound(ctx: {
  world: QuizWorld
  path: PlayPath
  complete: boolean
  perfect: boolean
}) {
  const prev = loadEconomy()
  if (ctx.path !== 'pool' && ctx.path !== 'levels') return
  if (ctx.world === 'geo' && prev.vaultIso) grantCompanyKnowledge(VAULT_GEO_KNOWLEDGE)
  const contracts = prev.contracts.map((item) => settle(bumpContract(item, ctx)))
  commit({ ...prev, contracts })
}
