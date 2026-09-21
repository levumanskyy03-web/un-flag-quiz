import { ACHIEVEMENTS, isAchievementId, type AchievementId } from '../data/achievements'
import {
  isCardFrameId,
  isShareThemeId,
  isShopItemId,
  shopItem,
  tokensForAchievementTier,
  TOKEN_DAY_CAP,
  TOKEN_KNOWLEDGE_BOOST_MS,
  TOKEN_XP_BOOST,
  TOKEN_XP_BOOST_MS,
  type CardFrameId,
  type ShareThemeId,
  type ShopItemId,
} from '../data/tokens'
import { unlockedAchievementIds } from './achievements'
import type { RoundRecord } from './history'
import type { LevelClear } from './levelProgress'
import { useSyncExternalStore } from 'react'

export const TOKENS_KEY = 'un-flag-quiz-tokens'

export type TokenState = {
  balance: number
  earnedToday: number
  dayStamp: string
  claimedAchievements: AchievementId[]
  lastGain: number
  ownedFrames: CardFrameId[]
  frame: CardFrameId | null
  ownedShare: ShareThemeId[]
  shareTheme: ShareThemeId | null
  hqSkin: boolean
  knowledgeBoostUntil: number
  xpBoostUntil: number
  updatedAt: number
}

type Listener = () => void

let memory: TokenState | null = null
const listeners = new Set<Listener>()
let storageReady = false

function localDayStamp(now = Date.now()) {
  const date = new Date(now)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function emptyState(now = Date.now()): TokenState {
  return {
    balance: 0,
    earnedToday: 0,
    dayStamp: localDayStamp(now),
    claimedAchievements: [],
    lastGain: 0,
    ownedFrames: [],
    frame: null,
    ownedShare: [],
    shareTheme: null,
    hqSkin: false,
    knowledgeBoostUntil: 0,
    xpBoostUntil: 0,
    updatedAt: 0,
  }
}

function parseIdList<T extends string>(raw: unknown, check: (value: unknown) => value is T): T[] {
  if (!Array.isArray(raw)) return []
  const next: T[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    if (!check(item) || seen.has(item)) continue
    seen.add(item)
    next.push(item)
  }
  return next
}

function parseState(raw: unknown): TokenState | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Partial<TokenState>
  const base = emptyState()
  const claimed = Array.isArray(row.claimedAchievements)
    ? row.claimedAchievements.filter(isAchievementId)
    : []
  return {
    ...base,
    balance: Math.max(0, Math.floor(Number(row.balance) || 0)),
    earnedToday: Math.max(0, Math.floor(Number(row.earnedToday) || 0)),
    dayStamp: typeof row.dayStamp === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(row.dayStamp) ? row.dayStamp : base.dayStamp,
    claimedAchievements: claimed,
    lastGain: Math.max(0, Math.floor(Number(row.lastGain) || 0)),
    ownedFrames: parseIdList(row.ownedFrames, isCardFrameId),
    frame: isCardFrameId(row.frame) ? row.frame : null,
    ownedShare: parseIdList(row.ownedShare, isShareThemeId),
    shareTheme: isShareThemeId(row.shareTheme) ? row.shareTheme : null,
    hqSkin: Boolean(row.hqSkin),
    knowledgeBoostUntil: Math.max(0, Number(row.knowledgeBoostUntil) || 0),
    xpBoostUntil: Math.max(0, Number(row.xpBoostUntil) || 0),
    updatedAt: Math.max(0, Number(row.updatedAt) || 0),
  }
}

function persist(state: TokenState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(state))
  } catch {
    /* quota */
  }
}

function emit() {
  for (const listener of listeners) listener()
}

function commit(next: TokenState) {
  memory = { ...next, updatedAt: Date.now() }
  persist(memory)
  emit()
  return memory
}

const SERVER_SNAPSHOT = emptyState(0)
let clientReady = false

function readStored(): TokenState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(TOKENS_KEY)
    if (!raw) return null
    return parseState(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

export function getTokenServerSnapshot(): TokenState {
  return SERVER_SNAPSHOT
}

export function getTokenClientSnapshot(): TokenState {
  if (!clientReady) return SERVER_SNAPSHOT
  return loadTokens()
}

export function loadTokens(): TokenState {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT
  clientReady = true
  ensureStorageSync()
  const stored = readStored()
  if (memory && stored && stored.updatedAt > memory.updatedAt) memory = stored
  if (memory) return rollDay(memory)
  memory = rollDay(stored ?? emptyState())
  return memory
}

function ensureStorageSync() {
  if (storageReady || typeof window === 'undefined') return
  storageReady = true
  window.addEventListener('storage', (event) => {
    if (event.key !== TOKENS_KEY || !event.newValue) return
    try {
      const next = parseState(JSON.parse(event.newValue) as unknown)
      if (!next || (memory && next.updatedAt <= memory.updatedAt)) return
      memory = next
      emit()
    } catch {
      /* ignore malformed external write */
    }
  })
}

export function subscribeTokens(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function rollDay(state: TokenState, now = Date.now()): TokenState {
  const stamp = localDayStamp(now)
  if (state.dayStamp === stamp) return state
  const next = { ...state, dayStamp: stamp, earnedToday: 0, updatedAt: Date.now() }
  memory = next
  persist(next)
  return next
}

function addCapped(state: TokenState, amount: number): { state: TokenState; granted: number } {
  const rolled = rollDay(state)
  const grant = Math.min(Math.max(0, Math.floor(amount)), Math.max(0, TOKEN_DAY_CAP - rolled.earnedToday))
  if (grant <= 0) return { state: { ...rolled, lastGain: 0 }, granted: 0 }
  return {
    granted: grant,
    state: {
      ...rolled,
      balance: rolled.balance + grant,
      earnedToday: rolled.earnedToday + grant,
      lastGain: grant,
    },
  }
}

export function awardPlayTokens(amount: number): number {
  const prev = loadTokens()
  const { state, granted } = addCapped(prev, amount)
  commit(state)
  return granted
}

export function awardAchievementTokens(
  history: RoundRecord[],
  bests: RoundRecord[],
  levels: LevelClear[],
  createdAt?: number,
): number {
  const prev = loadTokens()
  const unlocked = unlockedAchievementIds(history, bests, levels, createdAt)
  const claimed = new Set(prev.claimedAchievements)
  let grant = 0
  const nextClaimed = [...prev.claimedAchievements]
  for (const id of unlocked) {
    if (claimed.has(id)) continue
    const info = ACHIEVEMENTS.find((item) => item.id === id)
    if (!info) continue
    claimed.add(id)
    nextClaimed.push(id)
    grant += tokensForAchievementTier(info.tier)
  }
  if (grant <= 0) return 0
  commit({
    ...prev,
    balance: prev.balance + grant,
    claimedAchievements: nextClaimed,
    lastGain: prev.lastGain + grant,
  })
  return grant
}

export function spendTokens(amount: number): boolean {
  const cost = Math.max(0, Math.floor(amount))
  const prev = loadTokens()
  if (cost <= 0 || prev.balance < cost) return false
  commit({ ...prev, balance: prev.balance - cost })
  return true
}

export function creditTokens(amount: number, towardCap: boolean): number {
  const n = Math.max(0, Math.floor(amount))
  if (n <= 0) return 0
  const prev = loadTokens()
  if (towardCap) {
    const { state, granted } = addCapped(prev, n)
    commit(state)
    return granted
  }
  commit({ ...prev, balance: prev.balance + n, lastGain: n })
  return n
}

export function extendKnowledgeBoost(ms: number, now = Date.now()) {
  const extra = Math.max(0, Math.floor(ms))
  if (extra <= 0) return
  const prev = loadTokens()
  const start = Math.max(now, prev.knowledgeBoostUntil)
  commit({ ...prev, knowledgeBoostUntil: start + extra })
}

export function tokenKnowledgeBoostActive(now = Date.now()) {
  return loadTokens().knowledgeBoostUntil > now
}

export function tokenXpBoostActive(now = Date.now()) {
  return loadTokens().xpBoostUntil > now
}

export function tokenXpMultiplier(now = Date.now()) {
  return tokenXpBoostActive(now) ? TOKEN_XP_BOOST : 1
}

export function buyShopItem(id: ShopItemId, companyClaimed = 0): boolean {
  if (!isShopItemId(id)) return false
  const item = shopItem(id)
  if (!item) return false
  const prev = loadTokens()
  const now = Date.now()
  if (item.kind === 'frame' && item.frame) {
    if (prev.ownedFrames.includes(item.frame)) {
      commit({ ...prev, frame: item.frame })
      return true
    }
    if (prev.balance < item.cost) return false
    commit({
      ...prev,
      balance: prev.balance - item.cost,
      ownedFrames: [...prev.ownedFrames, item.frame],
      frame: item.frame,
    })
    return true
  }
  if (item.kind === 'share' && item.share) {
    if (prev.ownedShare.includes(item.share)) {
      commit({ ...prev, shareTheme: item.share })
      return true
    }
    if (prev.balance < item.cost) return false
    commit({
      ...prev,
      balance: prev.balance - item.cost,
      ownedShare: [...prev.ownedShare, item.share],
      shareTheme: item.share,
    })
    return true
  }
  if (item.kind === 'hqSkin') {
    if (prev.hqSkin) return true
    if (companyClaimed < (item.requiresStages ?? 80)) return false
    if (prev.balance < item.cost) return false
    commit({ ...prev, balance: prev.balance - item.cost, hqSkin: true })
    return true
  }
  if (item.id === 'boost-knowledge') {
    if (prev.balance < item.cost) return false
    const start = Math.max(now, prev.knowledgeBoostUntil)
    commit({
      ...prev,
      balance: prev.balance - item.cost,
      knowledgeBoostUntil: start + TOKEN_KNOWLEDGE_BOOST_MS,
    })
    return true
  }
  if (item.id === 'boost-xp') {
    if (prev.balance < item.cost) return false
    const start = Math.max(now, prev.xpBoostUntil)
    commit({
      ...prev,
      balance: prev.balance - item.cost,
      xpBoostUntil: start + TOKEN_XP_BOOST_MS,
    })
    return true
  }
  return false
}

export function unequipFrame() {
  const prev = loadTokens()
  commit({ ...prev, frame: null })
}

export function unequipShare() {
  const prev = loadTokens()
  commit({ ...prev, shareTheme: null })
}

export function useTokens() {
  return useSyncExternalStore(subscribeTokens, getTokenClientSnapshot, getTokenServerSnapshot)
}
