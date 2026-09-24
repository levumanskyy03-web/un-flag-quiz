import { isCardFrameId, isShareThemeId, type CardFrameId, type ShareThemeId } from '../../data/cosmetics'
import { QUIZ_WORLDS, isQuizWorld, type QuizWorld } from '../quiz/core'
import { LEVELS_FREE_MAX, LEVELS_TIER2_MAX } from './gates'
import { addSpecialists, withScore, type EmpireState } from './rules'

/**
 * Разовая конверсия старых store (токены, Компания, Государство, Казначейство) в Империю.
 * docs/economy.md, раздел 6. Чистая часть — общая для клиента и сервера (сервер повторно
 * валидирует по капам). Сырые снапшоты читаются из localStorage без импорта старых модулей.
 */

export type LegacySnapshot = {
  tokens?: unknown
  company?: unknown
  state?: unknown
  economy?: unknown
}

export type LegacyGrant = {
  coins: number
  gems: number
  hallLevel: number
  geoSpecialists: number
  frames: CardFrameId[]
  frame: CardFrameId | null
  shares: ShareThemeId[]
  share: ShareThemeId | null
  xpUntil: number
  /** Гейты, которые игрок уже прошёл до Империи (уровни 11+/26+, хардкор) — открываются бесплатно. */
  unlocks: string[]
  /** Марка, лежавшая в сейфе Казначейства — вернуть в альбом на клиенте. */
  vaultIso: string | null
}

export type LegacyClear = { world: QuizWorld; level: number; hardcore: boolean }

/** Какие ключи `unlocks` полагаются за уже пройденную кампанию. */
export function grandfatherUnlocks(clears: readonly LegacyClear[]): string[] {
  const keys = new Set<string>()
  for (const c of clears) {
    if (c.level > LEVELS_FREE_MAX) keys.add(`levels:${c.world}:2`)
    if (c.level > LEVELS_TIER2_MAX) keys.add(`levels:${c.world}:3`)
    if (c.hardcore) keys.add('levelHardcore')
  }
  return [...keys]
}

const UNLOCK_RE = /^levels:([a-z]+):(2|3)$/

function isGrandfatherKey(key: unknown): key is string {
  if (typeof key !== 'string') return false
  if (key === 'levelHardcore') return true
  const m = UNLOCK_RE.exec(key)
  return Boolean(m && isQuizWorld(m[1]))
}

// Капы серверной валидации: больше этого legacy дать не может.
export const LEGACY_COINS_MAX = 20_000
export const LEGACY_GEMS_MAX = 30
export const LEGACY_HALL_MAX = 3
export const LEGACY_SPECIALISTS_MAX = 60

const num = (v: unknown) => (Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : 0)
const obj = (v: unknown) => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {})

export function legacyGrant(raw: LegacySnapshot, clears: readonly LegacyClear[] = []): LegacyGrant {
  const tokens = obj(raw.tokens)
  const company = obj(raw.company)
  const realm = obj(raw.state)
  const economy = obj(raw.economy)

  let coins = Math.floor(num(tokens.balance))
  coins += Math.floor(num(company.knowledge) / 4)
  const gems = Math.floor(num(company.claimed) / 10)

  const ministries = obj(realm.ministries)
  const sum = Object.values(ministries).reduce<number>((acc, v) => acc + Math.floor(num(v)), 0)
  coins += 40 * sum
  const hallLevel = Math.min(LEGACY_HALL_MAX, Math.floor(sum / 10))
  const geoSpecialists = Math.floor(num(realm.servants))

  const contracts = Array.isArray(economy.contracts) ? economy.contracts : []
  for (const c of contracts) {
    const row = obj(c)
    if (row.status === 'active') coins += Math.floor(num(row.stake))
  }

  const frames = Array.isArray(tokens.ownedFrames) ? tokens.ownedFrames.filter(isCardFrameId) : []
  const shares = Array.isArray(tokens.ownedShare) ? tokens.ownedShare.filter(isShareThemeId) : []
  const frame = isCardFrameId(tokens.frame) && frames.includes(tokens.frame) ? tokens.frame : null
  const share = isShareThemeId(tokens.shareTheme) && shares.includes(tokens.shareTheme) ? tokens.shareTheme : null

  return {
    coins: Math.min(LEGACY_COINS_MAX, coins),
    gems: Math.min(LEGACY_GEMS_MAX, gems),
    hallLevel,
    geoSpecialists: Math.min(LEGACY_SPECIALISTS_MAX, geoSpecialists),
    frames,
    frame,
    shares,
    share,
    xpUntil: num(tokens.xpBoostUntil),
    unlocks: grandfatherUnlocks(clears),
    vaultIso: typeof economy.vaultIso === 'string' && economy.vaultIso.length === 2 ? economy.vaultIso : null,
  }
}

/** Разбор `LegacyGrant`, пришедшего с клиента: те же капы, что и у `legacyGrant`. */
export function clampLegacyGrant(raw: unknown): LegacyGrant {
  const g = obj(raw)
  const frames = Array.isArray(g.frames) ? g.frames.filter(isCardFrameId) : []
  const shares = Array.isArray(g.shares) ? g.shares.filter(isShareThemeId) : []
  return {
    coins: Math.min(LEGACY_COINS_MAX, Math.floor(num(g.coins))),
    gems: Math.min(LEGACY_GEMS_MAX, Math.floor(num(g.gems))),
    hallLevel: Math.min(LEGACY_HALL_MAX, Math.floor(num(g.hallLevel))),
    geoSpecialists: Math.min(LEGACY_SPECIALISTS_MAX, Math.floor(num(g.geoSpecialists))),
    frames,
    frame: isCardFrameId(g.frame) && frames.includes(g.frame) ? g.frame : null,
    shares,
    share: isShareThemeId(g.share) && shares.includes(g.share) ? g.share : null,
    xpUntil: num(g.xpUntil),
    unlocks: Array.isArray(g.unlocks) ? g.unlocks.filter(isGrandfatherKey).slice(0, 2 * QUIZ_WORLDS.length + 1) : [],
    vaultIso: null,
  }
}

export function hasLegacyValue(grant: LegacyGrant) {
  return (
    grant.coins > 0 ||
    grant.gems > 0 ||
    grant.hallLevel > 0 ||
    grant.geoSpecialists > 0 ||
    grant.frames.length > 0 ||
    grant.shares.length > 0 ||
    grant.unlocks.length > 0 ||
    grant.xpUntil > Date.now()
  )
}

/** Накладывает конверсию на состояние; повторно не применяется (`legacyAt`). */
export function applyLegacyGrant(state: EmpireState, grant: LegacyGrant, now = Date.now()): EmpireState {
  if (state.legacyAt !== null) return state
  let next: EmpireState = {
    ...state,
    coins: state.coins + grant.coins,
    gems: state.gems + grant.gems,
    boosts: { xpUntil: Math.max(state.boosts.xpUntil, grant.xpUntil) },
    unlocks: Array.from(new Set([...state.unlocks, ...grant.unlocks])),
    cosmetics: {
      frames: Array.from(new Set([...state.cosmetics.frames, ...grant.frames])),
      frame: state.cosmetics.frame ?? grant.frame,
      shares: Array.from(new Set([...state.cosmetics.shares, ...grant.shares])),
      share: state.cosmetics.share ?? grant.share,
    },
    legacyAt: now,
  }
  if (grant.hallLevel > next.buildings.hall.level) {
    next = { ...next, buildings: { ...next.buildings, hall: { level: grant.hallLevel, buildUntil: null } } }
  }
  // Слуги → специалисты географии; сверх Жилья уходят в очередь.
  if (grant.geoSpecialists > 0) next = addSpecialists(next, 'geo', grant.geoSpecialists)
  return withScore(next)
}
