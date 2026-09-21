import { QUIZ_WORLDS, type QuizWorld } from '../lib/quiz'

const ECONOMY_WORLDS = QUIZ_WORLDS

export const TOKEN_TO_KNOWLEDGE = 12
export const EXCHANGE_TOKEN_PACK = 4
export const KNOWLEDGE_DAY_FROM_TOKENS = 96
export const KNOWLEDGE_TO_TOKEN = 45
export const TOKENS_DAY_FROM_KNOWLEDGE = 6
export const VAULT_GEO_KNOWLEDGE = 14
export const VAULT_POWER_OFF = 4
export const VAULT_POWER_FLOOR = 6
export const WEEK_BOOST_MS = 20 * 60 * 1000
export const WEEK_CRATE_COST = 40
export const WEEK_CRATE_KNOWLEDGE = 220
export const WEEK_WORLD_COST = 18
export const WEEK_WORLD_KNOWLEDGE = 80
export const WEEK_WORLD_NEED = 10
export const WEEK_BOOST_COST = 28

export type MarketLotKind = 'knowledge' | 'worldGrant' | 'longBoost'

export type MarketLot = {
  id: string
  kind: MarketLotKind
  cost: number
  knowledge?: number
  world?: QuizWorld
  worldNeed?: number
}

export type ContractKind = 'worldRounds' | 'worldComplete' | 'perfect' | 'stampGeo'

export type ContractStatus = 'open' | 'active' | 'won' | 'lost'

export type EconomyContract = {
  id: string
  kind: ContractKind
  world: QuizWorld
  goal: number
  stake: number
  payout: number
  stamp: boolean
  status: ContractStatus
  progress: number
}

export function weekStamp(now = Date.now()) {
  const date = new Date(now)
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const day = new Date(utc).getUTCDay() || 7
  const thursday = new Date(utc)
  thursday.setUTCDate(new Date(utc).getUTCDate() + 4 - day)
  const year = thursday.getUTCFullYear()
  const yearStart = Date.UTC(year, 0, 1)
  const week = Math.ceil(((+thursday - yearStart) / 86400000 + 1) / 7)
  return `${year}-W${String(week).padStart(2, '0')}`
}

function hash32(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function worldAt(week: string, shift: number): QuizWorld {
  const worlds = ECONOMY_WORLDS
  const index = (hash32(week) + shift) % worlds.length
  return worlds[index] ?? 'geo'
}

export function weekMarketLots(week: string): MarketLot[] {
  const world = worldAt(week, 1)
  return [
    { id: `${week}-crate`, kind: 'knowledge', cost: WEEK_CRATE_COST, knowledge: WEEK_CRATE_KNOWLEDGE },
    {
      id: `${week}-world`,
      kind: 'worldGrant',
      cost: WEEK_WORLD_COST,
      knowledge: WEEK_WORLD_KNOWLEDGE,
      world,
      worldNeed: WEEK_WORLD_NEED,
    },
    { id: `${week}-boost`, kind: 'longBoost', cost: WEEK_BOOST_COST },
  ]
}

export function weekContracts(week: string): EconomyContract[] {
  const playWorld = worldAt(week, 3)
  return [
    {
      id: `${week}-rounds`,
      kind: 'worldRounds',
      world: 'geo',
      goal: 3,
      stake: 18,
      payout: 32,
      stamp: false,
      status: 'open',
      progress: 0,
    },
    {
      id: `${week}-complete`,
      kind: 'worldComplete',
      world: playWorld,
      goal: 2,
      stake: 20,
      payout: 38,
      stamp: false,
      status: 'open',
      progress: 0,
    },
    {
      id: `${week}-perfect`,
      kind: playWorld === 'geo' ? 'stampGeo' : 'perfect',
      world: playWorld === 'geo' ? 'geo' : playWorld,
      goal: playWorld === 'geo' ? 2 : 1,
      stake: playWorld === 'geo' ? 0 : 24,
      payout: playWorld === 'geo' ? 24 : 44,
      stamp: playWorld === 'geo',
      status: 'open',
      progress: 0,
    },
  ]
}
