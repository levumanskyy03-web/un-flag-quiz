import {
  STATE_EDU_KNOWLEDGE,
  STATE_ECONOMY_RATE,
  STATE_FOREIGN_TOKENS,
  STATE_INFRA_MS,
  STATE_MINISTRY_MAX,
  STATE_ROUND_KNOWLEDGE,
  STATE_SERVANT_MAX,
  STATE_SERVANT_RATE,
  stateConvertCap,
  stateIdleCap,
  stateMinistryCost,
  stateServantCap,
  stateStampTokens,
  type StateMinistry,
} from '../data/state'
import { grantCompanyKnowledge, spendCompanyKnowledge } from './companyStore'
import { takeStampCopy } from './stamps'
import { creditTokens, spendTokens } from './tokenStore'
import { useSyncExternalStore } from 'react'

export const STATE_KEY = 'un-flag-quiz-state'
const STATE_BACKUP_KEY = `${STATE_KEY}-backup`

export type StateMinistries = Record<StateMinistry, number>

export type RealmState = {
  name: string
  ministries: StateMinistries
  servants: number
  lastTick: number
  pending: number
  idleToday: number
  convertToday: number
  dayStamp: string
  updatedAt: number
}

type Listener = () => void

let memory: RealmState | null = null
const listeners = new Set<Listener>()
let loop: number | null = null
let lastWrite = 0
let clientReady = false

function localDayStamp(now = Date.now()) {
  const date = new Date(now)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function emptyMinistries(): StateMinistries {
  return { education: 0, infra: 0, foreign: 0, economy: 0, trade: 0, administration: 0 }
}

function emptyState(now = Date.now()): RealmState {
  return {
    name: '',
    ministries: emptyMinistries(),
    servants: 0,
    lastTick: now,
    pending: 0,
    idleToday: 0,
    convertToday: 0,
    dayStamp: localDayStamp(now),
    updatedAt: 0,
  }
}

function clampLevel(value: unknown) {
  return Math.max(0, Math.min(STATE_MINISTRY_MAX, Math.floor(Number(value) || 0)))
}

function parseState(raw: unknown): RealmState | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Partial<RealmState> & { ministries?: Partial<StateMinistries> }
  const now = Date.now()
  const base = emptyState(now)
  return {
    ...base,
    name: typeof row.name === 'string' ? row.name.trim().slice(0, 32) : '',
    ministries: {
      education: clampLevel(row.ministries?.education),
      infra: clampLevel(row.ministries?.infra),
      foreign: clampLevel(row.ministries?.foreign),
      economy: clampLevel(row.ministries?.economy),
      trade: clampLevel(row.ministries?.trade),
      administration: clampLevel(row.ministries?.administration),
    },
    servants: Math.max(0, Math.min(STATE_SERVANT_MAX, Math.floor(Number(row.servants) || 0))),
    lastTick: Math.max(0, Number(row.lastTick) || now),
    pending: Math.max(0, Number(row.pending) || 0),
    idleToday: Math.max(0, Math.floor(Number(row.idleToday) || 0)),
    convertToday: Math.max(0, Math.floor(Number(row.convertToday) || 0)),
    dayStamp: typeof row.dayStamp === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(row.dayStamp) ? row.dayStamp : base.dayStamp,
    updatedAt: Math.max(0, Number(row.updatedAt) || 0),
  }
}

function persist(state: RealmState) {
  if (typeof window === 'undefined') return
  try {
    const json = JSON.stringify(state)
    localStorage.setItem(STATE_KEY, json)
    localStorage.setItem(STATE_BACKUP_KEY, json)
  } catch {
    /* quota */
  }
}

function emit() {
  for (const listener of listeners) listener()
}

function commit(next: RealmState, save = true) {
  memory = save ? { ...next, updatedAt: Date.now() } : next
  if (save) persist(memory)
  emit()
  return memory
}

const SERVER_SNAPSHOT = emptyState(0)

function readStored(): RealmState | null {
  if (typeof window === 'undefined') return null
  const rows: RealmState[] = []
  for (const key of [STATE_KEY, STATE_BACKUP_KEY]) {
    try {
      const raw = localStorage.getItem(key)
      const parsed = raw ? parseState(JSON.parse(raw) as unknown) : null
      if (parsed) rows.push(parsed)
    } catch {
      /* try backup */
    }
  }
  return rows.sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null
}

function roll(state: RealmState, now = Date.now()): RealmState {
  const day = localDayStamp(now)
  if (state.dayStamp === day) return state
  return { ...state, dayStamp: day, idleToday: 0, convertToday: 0 }
}

export function getStateServerSnapshot(): RealmState {
  return SERVER_SNAPSHOT
}

export function loadRealm(): RealmState {
  const now = Date.now()
  if (memory) {
    const stored = readStored()
    if (stored && stored.updatedAt > memory.updatedAt) memory = stored
    const next = roll(memory, now)
    if (next !== memory) commit(next)
    return memory
  }
  const stored = roll(readStored() ?? emptyState(now), now)
  memory = stored
  return stored
}

export function getStateClientSnapshot(): RealmState {
  if (!clientReady) {
    clientReady = true
    memory = roll(readStored() ?? emptyState(), Date.now())
  }
  return loadRealm()
}

export function subscribeRealm(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useRealm() {
  return useSyncExternalStore(subscribeRealm, getStateClientSnapshot, getStateServerSnapshot)
}

function visibleNow() {
  return typeof document !== 'undefined' && document.visibilityState === 'visible'
}

export function stateServantRate(state: RealmState = loadRealm()) {
  return STATE_SERVANT_RATE * state.servants * (1 + state.ministries.economy * STATE_ECONOMY_RATE)
}

export function stateInfraBonusMs(state: RealmState = loadRealm()) {
  return STATE_INFRA_MS * state.ministries.infra
}

export function realmTick(now = Date.now()): RealmState {
  const prev = roll(loadRealm(), now)
  const idleCap = stateIdleCap(prev.ministries.administration)
  if (!visibleNow() || prev.servants <= 0 || prev.idleToday >= idleCap) {
    if (prev.lastTick === now) return prev
    return commit({ ...prev, lastTick: now }, now - lastWrite > 4_000)
  }
  const elapsed = Math.max(0, now - prev.lastTick)
  if (elapsed <= 0) return prev
  const gained = stateServantRate(prev) * (elapsed / 1000)
  let pending = prev.pending + gained
  let idleToday = prev.idleToday
  let whole = Math.floor(pending)
  const room = idleCap - idleToday
  if (whole > room) whole = Math.max(0, room)
  if (whole > 0) {
    creditTokens(whole, false)
    pending -= whole
    idleToday += whole
    lastWrite = now
  }
  const save = whole > 0 || now - lastWrite > 4_000
  if (save) lastWrite = now
  return commit({ ...prev, pending, idleToday, lastTick: now }, save)
}

function onStateVisibility() {
  realmTick()
}

function onStateStorage(event: StorageEvent) {
  if (event.key !== STATE_KEY && event.key !== STATE_BACKUP_KEY) return
  const stored = readStored()
  if (!stored || (memory && stored.updatedAt <= memory.updatedAt)) return
  memory = stored
  emit()
}

export function startStateLoop() {
  if (typeof window === 'undefined') return
  clientReady = true
  if (loop !== null) {
    emit()
    return
  }
  onStateVisibility()
  loop = window.setInterval(onStateVisibility, 1000)
  document.addEventListener('visibilitychange', onStateVisibility)
  window.addEventListener('storage', onStateStorage)
  emit()
}

export function stopStateLoop() {
  if (typeof window === 'undefined' || loop === null) return
  window.clearInterval(loop)
  loop = null
  document.removeEventListener('visibilitychange', onStateVisibility)
  window.removeEventListener('storage', onStateStorage)
}

export function renameRealm(name: string): RealmState {
  const prev = loadRealm()
  return commit({ ...prev, name: name.trim().slice(0, 32) })
}

export function upgradeMinistry(kind: StateMinistry): boolean {
  const prev = loadRealm()
  const level = prev.ministries[kind]
  if (level >= STATE_MINISTRY_MAX) return false
  const cost = stateMinistryCost(kind, level)
  if (kind === 'education') {
    if (!spendCompanyKnowledge(cost)) return false
  } else if (!spendTokens(cost)) return false
  commit({
    ...prev,
    ministries: { ...prev.ministries, [kind]: level + 1 },
  })
  return true
}

export function convertStampToTreasury(iso: string): boolean {
  const prev = loadRealm()
  if (prev.convertToday >= stateConvertCap(prev.ministries.administration)) return false
  if (!takeStampCopy(iso)) return false
  creditTokens(stateStampTokens(prev.ministries.trade), false)
  commit({ ...prev, convertToday: prev.convertToday + 1 })
  return true
}

export function hireServant(iso: string): boolean {
  const prev = loadRealm()
  if (prev.servants >= stateServantCap(prev.ministries.administration)) return false
  if (prev.convertToday >= stateConvertCap(prev.ministries.administration)) return false
  if (!takeStampCopy(iso)) return false
  commit({ ...prev, servants: prev.servants + 1, convertToday: prev.convertToday + 1, lastTick: Date.now() })
  return true
}

export function realmOnRound(complete: boolean) {
  const prev = loadRealm()
  const knowledge = STATE_ROUND_KNOWLEDGE + STATE_EDU_KNOWLEDGE * prev.ministries.education
  grantCompanyKnowledge(knowledge)
  if (!complete || prev.ministries.foreign <= 0) return 0
  const extra = STATE_FOREIGN_TOKENS * prev.ministries.foreign
  creditTokens(extra, false)
  return extra
}
