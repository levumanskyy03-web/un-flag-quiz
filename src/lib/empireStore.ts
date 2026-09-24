import { useSyncExternalStore } from 'react'
import { EMPIRE_BUILDINGS, type EmpireBuilding, type EmpirePerk, type EmpirePowerKind, type EmpireResource } from '../data/empire'
import {
  advanceEra as advanceEraRule,
  applyDuelReward,
  applyRoundReward,
  build as buildRule,
  buyPower as buyPowerRule,
  buyCosmetic as buyCosmeticRule,
  buyPerk as buyPerkRule,
  buyXpBoost as buyXpBoostRule,
  claimAchievements as claimAchievementsRule,
  claimLegacy as claimLegacyRule,
  setTitle as setTitleRule,
  reportAlbum,
  skipBuild as skipBuildRule,
  emptyEmpire,
  equipCosmetic as equipRule,
  parseEmpire,
  rollDay,
  sellResource as sellRule,
  settlePending,
  tick,
  timeBonusMs,
  xpMultiplier,
  type BoostPay,
  type BuildResult,
  type CosmeticId,
  type CosmeticResult,
  type DuelReward,
  type EmpireRoundReward,
  type EmpireState,
  type PowerResult,
  type RoundContext,
  type LegacyClaim,
  type SkipResult,
} from './empire/rules'
import { access, noteMistakesRun, unlock as unlockRule, type Access, type GateFeature, type UnlockResult } from './empire/gates'
import { applyLegacyGrant, hasLegacyValue, legacyGrant, type LegacyGrant } from './empire/migrate'
import { loadLevelClears } from './levelProgress'
import { worldOfMode } from './quiz'
import { loadWorldStampAlbums, returnStampCopy } from './stamps'
import { albumReport } from './empire/album'
import { ACHIEVEMENTS } from '../data/achievements'
import { COLLECTIONS } from '../data/collections'
import type { LegacyMissionId, LegacyTitleId } from '../data/empireLegacy'
import type { QuizMode, QuizWorld } from './quiz'

export const EMPIRE_KEY = 'un-flag-quiz-empire'
/** Конверсия старых store уже применена локально; значение — grant, который ещё ждёт сервер, или '1'. */
export const EMPIRE_LEGACY_KEY = 'un-flag-quiz-empire-migrated'
const LEGACY_KEYS = ['un-flag-quiz-tokens', 'un-flag-quiz-company', 'un-flag-quiz-state', 'un-flag-quiz-state-backup', 'un-flag-quiz-economy'] as const

export type EmpireSync = 'unknown' | 'local' | 'server' | 'offline'

type Listener = () => void

let memory: EmpireState | null = null
let sync: EmpireSync = 'unknown'
let rank: number | null = null
const listeners = new Set<Listener>()
const SERVER_SNAPSHOT = emptyEmpire(0)
let clientReady = false
let connecting: Promise<void> | null = null

function readStored(): EmpireState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(EMPIRE_KEY)
    if (!raw) return null
    return parseEmpire(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

function persist(state: EmpireState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(EMPIRE_KEY, JSON.stringify(state))
  } catch {
    /* quota */
  }
}

function emit() {
  for (const listener of listeners) listener()
}

function commit(next: EmpireState) {
  memory = next
  persist(next)
  emit()
  return next
}

export function getEmpireServerSnapshot(): EmpireState {
  return SERVER_SNAPSHOT
}

export function getEmpireClientSnapshot(): EmpireState {
  if (!clientReady) return SERVER_SNAPSHOT
  return loadEmpire()
}

export function loadEmpire(): EmpireState {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT
  clientReady = true
  if (!memory) {
    memory = migrateLegacy(rollDay(tick(readStored() ?? emptyEmpire())))
    persist(memory)
  }
  return memory
}

// ---------- Конверсия токенов / Компании / Государства (docs/economy.md §6) ----------

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as unknown) : undefined
  } catch {
    return undefined
  }
}

/** Разово переносит старые store в локальную Империю и удаляет их ключи. */
function migrateLegacy(state: EmpireState): EmpireState {
  try {
    if (localStorage.getItem(EMPIRE_LEGACY_KEY)) return state
    const clears = loadLevelClears().map((c) => ({ world: worldOfMode(c.mode), level: c.level, hardcore: c.hardcore }))
    const grant = legacyGrant(
      {
        tokens: readJson('un-flag-quiz-tokens'),
        company: readJson('un-flag-quiz-company'),
        state: readJson('un-flag-quiz-state'),
        economy: readJson('un-flag-quiz-economy'),
      },
      clears,
    )
    if (grant.vaultIso) returnStampCopy(grant.vaultIso)
    const worth = hasLegacyValue(grant)
    localStorage.setItem(EMPIRE_LEGACY_KEY, worth ? JSON.stringify({ ...grant, vaultIso: null }) : '1')
    for (const key of LEGACY_KEYS) localStorage.removeItem(key)
    return worth ? applyLegacyGrant(state, grant) : state
  } catch {
    return state
  }
}

function pendingLegacyGrant(): LegacyGrant | null {
  try {
    const raw = localStorage.getItem(EMPIRE_LEGACY_KEY)
    if (!raw || raw === '1') return null
    return JSON.parse(raw) as LegacyGrant
  } catch {
    return null
  }
}

/** Досылает серверу конверсию, если у аккаунта она ещё не зачтена. */
async function syncLegacy(server: EmpireState) {
  const pending = pendingLegacyGrant()
  if (!pending) return
  if (server.legacyAt === null) {
    const reply = await post({ action: 'legacy', grant: pending })
    if (!reply || (reply.error && reply.error !== 'exists')) return
    adopt(reply)
  }
  try {
    localStorage.setItem(EMPIRE_LEGACY_KEY, '1')
  } catch {
    /* quota */
  }
}

export function subscribeEmpire(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useEmpire() {
  return useSyncExternalStore(subscribeEmpire, getEmpireClientSnapshot, getEmpireServerSnapshot)
}

export function useEmpireSync(): EmpireSync {
  return useSyncExternalStore(
    subscribeEmpire,
    () => sync,
    () => 'unknown' as EmpireSync,
  )
}

export function empireRank() {
  return rank
}

// ---------- Сервер ----------

type ServerReply = { state?: unknown; reward?: EmpireRoundReward; rank?: number | null; error?: string }

async function post(body: Record<string, unknown>): Promise<ServerReply | null> {
  try {
    const response = await fetch('/api/empire', {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.status === 401) {
      sync = 'local'
      emit()
      return null
    }
    if (response.status === 503) {
      sync = 'offline'
      emit()
      return null
    }
    const reply = (await response.json()) as ServerReply
    return reply
  } catch {
    return null
  }
}

function adopt(reply: ServerReply | null) {
  if (!reply?.state) return
  const parsed = parseEmpire(reply.state)
  if (!parsed) return
  if (typeof reply.rank === 'number') rank = reply.rank
  commit(parsed)
}

function hasProgress(state: EmpireState) {
  return EMPIRE_BUILDINGS.some((b) => state.buildings[b].level > 0)
}

/** Один раз за сессию: узнаёт, есть ли аккаунт, и при наличии переносит локальную пробу. */
export function empireConnect(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (connecting) return connecting
  connecting = (async () => {
    const local = loadEmpire()
    try {
      const response = await fetch('/api/empire', { credentials: 'include', cache: 'no-store' })
      if (response.status === 401) {
        sync = 'local'
        emit()
        return
      }
      if (!response.ok) {
        sync = 'offline'
        emit()
        return
      }
      const reply = (await response.json()) as ServerReply
      const server = reply.state ? parseEmpire(reply.state) : null
      if (!server) {
        sync = 'offline'
        emit()
        return
      }
      if (server.migratedAt === null && !hasProgress(server) && hasProgress(local)) {
        const imported = await post({ action: 'import', trial: local })
        sync = 'server'
        adopt(imported ?? reply)
        await syncLegacy(loadEmpire())
        return
      }
      sync = 'server'
      adopt(reply)
      await syncLegacy(server)
    } catch {
      sync = 'offline'
      emit()
    }
  })()
  return connecting
}

function isServer() {
  return sync === 'server'
}

// ---------- Действия ----------

export function empireTick(now = Date.now()): EmpireState {
  const prev = loadEmpire()
  const next = rollDay(tick(prev, now), now)
  if (next === prev) return prev
  return commit(next)
}

export function empireBuild(building: EmpireBuilding): BuildResult {
  const result = buildRule(empireTick(), building)
  if (result.ok) {
    commit(settlePending(result.state))
    if (isServer()) void post({ action: 'build', building }).then(adopt)
  }
  return result
}

export function empireAdvanceEra(): boolean {
  const next = advanceEraRule(empireTick())
  if (!next) return false
  commit(next)
  if (isServer()) void post({ action: 'advanceEra' }).then(adopt)
  return true
}

export function empireSell(key: EmpireResource, amount: number): boolean {
  const next = sellRule(empireTick(), key, amount)
  if (!next) return false
  commit(next)
  if (isServer()) void post({ action: 'sell', resource: key, amount }).then(adopt)
  return true
}

/** Подсказка / пропуск / жизнь в викторине. Оптимистично; сервер подтверждает. */
export function empireBuyPower(kind: EmpirePowerKind): PowerResult {
  const result = buyPowerRule(loadEmpire(), kind)
  if (result.ok) {
    commit(result.state)
    if (isServer()) void post({ action: 'buyPower', kind }).then(adopt)
  }
  return result
}

export function empireBuyXpBoost(pay: BoostPay): boolean {
  const next = buyXpBoostRule(loadEmpire(), pay)
  if (!next) return false
  commit(next)
  if (isServer()) void post({ action: 'buyBoost', kind: 'xp', pay }).then(adopt)
  return true
}

/** Рамка аватара / тема карточки за монеты. Купленное сразу надевается. */
export function empireBuyCosmetic(item: CosmeticId): CosmeticResult {
  const result = buyCosmeticRule(empireTick(), item)
  if (result.ok) {
    commit(result.state)
    if (isServer()) void post({ action: 'buyCosmetic', kind: item.kind, id: item.id }).then(adopt)
  }
  return result
}

export function empireEquip(kind: CosmeticId['kind'], id: string | null): boolean {
  const next = equipRule(loadEmpire(), kind, id)
  if (!next) return false
  commit(next)
  if (isServer()) void post({ action: 'equip', kind, id }).then(adopt)
  return true
}

/** Достроить за кристаллы. */
export function empireSkipBuild(building: EmpireBuilding): SkipResult {
  const result = skipBuildRule(loadEmpire(), building)
  if (result.ok) {
    commit(settlePending(result.state))
    if (isServer()) void post({ action: 'skipBuild', building }).then(adopt)
  }
  return result
}

export function empireBuyPerk(perk: EmpirePerk): boolean {
  const next = buyPerkRule(empireTick(), perk)
  if (!next) return false
  commit(next)
  if (isServer()) void post({ action: 'buyPerk', perk }).then(adopt)
  return true
}

/** Пересчитывает сводку альбома марок и забирает кристаллы за новые полные наборы. */
export function empireSyncAlbum(): number {
  const { report, sets } = albumReport(loadWorldStampAlbums())
  const result = reportAlbum(loadEmpire(), report, sets)
  if (result.state === loadEmpire()) return 0
  commit(result.state)
  if (isServer()) void post({ action: 'album', report, sets }).then(adopt)
  return result.gems
}

const ACHIEVEMENT_TIER = new Map(ACHIEVEMENTS.map((a) => [a.id as string, a.tier as number]))

/** Кристаллы за новые достижения (tier 3 → 2, tier 5 → 5). */
export function empireClaimAchievements(ids: readonly string[]): number {
  const result = claimAchievementsRule(loadEmpire(), ids, (id) => ACHIEVEMENT_TIER.get(id) ?? null)
  if (result.claimed.length === 0) return 0
  commit(result.state)
  if (isServer()) void post({ action: 'achievements', ids: result.claimed }).then(adopt)
  return result.gems
}

export const LEGACY_ENV = { collections: COLLECTIONS.length }

/** Забрать ступень или финал миссии Наследия. Гость — локально; на сервере ответ авторитетен. */
export function empireClaimLegacy(id: LegacyMissionId): LegacyClaim {
  const result = claimLegacyRule(loadEmpire(), id, LEGACY_ENV)
  if (!result.ok) return result
  commit(result.state)
  if (isServer()) void post({ action: 'claimLegacy', id }).then(adopt)
  return result
}

export function empireSetTitle(title: LegacyTitleId | null): boolean {
  const next = setTitleRule(loadEmpire(), title)
  if (!next) return false
  commit(next)
  if (isServer()) void post({ action: 'setTitle', title }).then(adopt)
  return true
}

export function empireXpMultiplier(now = Date.now()) {
  return xpMultiplier(loadEmpire(), now)
}

export function empireTimeBonusMs(world: QuizWorld) {
  return timeBonusMs(loadEmpire(), world)
}

/** Итог дуэли. `code` + `playerId` нужны серверу, чтобы проверить комнату. */
export function empireOnDuel(youWon: boolean | null, proof?: { code: string; playerId: string }): DuelReward {
  const { state, reward } = applyDuelReward(loadEmpire(), youWon)
  commit(state)
  if (isServer() && proof) {
    void post({ action: 'duelReward', code: proof.code, playerId: proof.playerId }).then(adopt)
  }
  return reward
}

// ---------- Гейты ----------

export function empireAccess(feature: GateFeature, now = Date.now()): Access {
  return access(loadEmpire(), feature, now)
}

export function empireUnlock(feature: GateFeature): UnlockResult {
  const result = unlockRule(empireTick(), feature)
  if (result.ok) {
    commit(result.state)
    if (isServer()) void post({ action: 'unlock', feature }).then(adopt)
  }
  return result
}

/** Запуск тренажёра ошибок: проверяет гейт и тратит бесплатный дневной запуск. */
export function empireStartMistakes(): boolean {
  const state = empireTick()
  if (access(state, { kind: 'mistakes' }) === 'locked') return false
  commit(noteMistakesRun(state))
  if (isServer()) void post({ action: 'mistakesRun' }).then(adopt)
  return true
}

export function empireRename(name: string): EmpireState {
  const trimmed = name.trim().slice(0, 24)
  const next = commit({ ...loadEmpire(), name: trimmed })
  if (isServer()) void post({ action: 'rename', name: trimmed }).then(adopt)
  return next
}

/** Поля, нужные серверу для проверки зачётного раунда. */
export type RoundProof = {
  mode: QuizMode
  roundMs: number
  level?: number
  livesLeft?: number
  livesLimit?: number
  listId?: string
}

export function empireOnRound(ctx: RoundContext, proof?: RoundProof): EmpireRoundReward {
  const { state, reward } = applyRoundReward(loadEmpire(), proof?.listId ? { ...ctx, listId: proof.listId } : ctx)
  commit(state)
  if (isServer() && proof) {
    const nonce = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
    void post({
      action: 'roundReward',
      nonce,
      world: ctx.world,
      path: ctx.path,
      endedBy: ctx.endedBy,
      correct: ctx.correct,
      total: ctx.total,
      difficulty: ctx.difficulty,
      hardcore: Boolean(ctx.hardcore),
      deltaXp: ctx.deltaXp,
      worldRecord: ctx.worldRecord,
      mode: proof.mode,
      roundMs: proof.roundMs,
      questions: ctx.total,
      level: proof.level,
      livesLeft: proof.livesLeft,
      livesLimit: proof.livesLimit,
      listId: proof.listId,
    }).then(adopt)
  }
  return reward
}

let loopId: number | null = null
let loopRefs = 0

export function startEmpireLoop() {
  loopRefs += 1
  if (typeof window === 'undefined' || loopId !== null) return
  void empireConnect()
  loopId = window.setInterval(() => empireTick(), 1000)
}

export function stopEmpireLoop() {
  loopRefs = Math.max(0, loopRefs - 1)
  if (loopRefs > 0 || loopId === null || typeof window === 'undefined') return
  window.clearInterval(loopId)
  loopId = null
}
