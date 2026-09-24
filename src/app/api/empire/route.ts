import { ACHIEVEMENTS } from '../../../data/achievements'
import {
  EMPIRE_ALL_BUILDINGS,
  EMPIRE_BUILDINGS,
  EMPIRE_PERKS,
  EMPIRE_POWER_BASE,
  EMPIRE_RESOURCES,
  type EmpireBuilding,
  type EmpirePowerKind,
  type EmpireResource,
} from '../../../data/empire'
import { accountFromRequest, parseAccountName } from '../../../lib/authStore'
import { normalizeCode, parsePlayerId, readDuel, viewFor } from '../../../lib/duelStore'
import {
  advanceEra,
  applyDuelReward,
  applyRoundReward,
  build,
  buyCosmetic,
  buyPerk,
  buyPower,
  buyXpBoost,
  claimAchievements,
  claimLegacy,
  equipCosmetic,
  setTitle,
  reportAlbum,
  skipBuild,
  type CosmeticId,
  rollDay,
  sellResource,
  settlePending,
  tick,
  type EmpireState,
  type RoundContext,
} from '../../../lib/empire/rules'
import { access, grantPlus, listGateOf, noteMistakesRun, parseGateFeature, unlock, type GateFeature } from '../../../lib/empire/gates'
import { applyLegacyGrant, clampLegacyGrant } from '../../../lib/empire/migrate'
import { isCardFrameId, isShareThemeId } from '../../../data/cosmetics'
import { isLegacyMissionId, isLegacyTitleId } from '../../../data/empireLegacy'
import { COLLECTIONS } from '../../../data/collections'
import { claimNonce, clampTrial, readEmpire, readRank, writeEmpire } from '../../../lib/empireServerStore'
import { isQuizDifficulty, isQuizWorld, type PlayPath } from '../../../lib/quiz'
import { consumeRateLimit } from '../../../lib/rateLimit'
import {
  RATING_MIN_MS_PER_QUESTION,
  RATING_ROUND_LIMIT,
  RATING_ROUND_WINDOW_SEC,
  parseRatedRound,
  scoreRatedRound,
} from '../../../lib/ratingRound'

export const runtime = 'nodejs'

const ACTIONS_PER_MIN = 60
const ACHIEVEMENT_TIER = new Map(ACHIEVEMENTS.map((a) => [a.id as string, a.tier as number]))
const PATHS: readonly PlayPath[] = ['pool', 'levels', 'learn', 'mistakes', 'list', 'daily']

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

async function withState(request: Request) {
  const account = await accountFromRequest(request)
  if (!account) return { error: json({ error: 'auth' }, 401) } as const
  const stored = await readEmpire(account.id)
  if (!stored) return { error: json({ error: 'unavailable' }, 503) } as const
  const now = Date.now()
  return { account, now, state: rollDay(tick(stored, now), now) } as const
}

export async function GET(request: Request) {
  const ctx = await withState(request)
  if ('error' in ctx) return ctx.error
  const rank = await readRank(ctx.account.id).catch(() => null)
  return json({ state: ctx.state, rank })
}

export async function POST(request: Request) {
  const ctx = await withState(request)
  if ('error' in ctx) return ctx.error
  const { account, now } = ctx
  let state = ctx.state

  if (!(await consumeRateLimit(`empire:${account.id}`, ACTIONS_PER_MIN, 60))) {
    return json({ error: 'limited', state }, 429)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid', state }, 400)
  }
  if (!body || typeof body !== 'object') return json({ error: 'invalid', state }, 400)
  const record = body as Record<string, unknown>
  const action = record.action

  if (action === 'tick') {
    await writeEmpire(account.id, state)
    return json({ state })
  }

  if (action === 'build') {
    const building = record.building
    if (typeof building !== 'string' || !(EMPIRE_ALL_BUILDINGS as readonly string[]).includes(building)) {
      return json({ error: 'invalid', state }, 400)
    }
    const result = build(state, building as EmpireBuilding, now)
    if (!result.ok) return json({ error: result.reason, state }, 409)
    state = settlePending(result.state)
    await writeEmpire(account.id, state)
    return json({ state })
  }

  if (action === 'advanceEra') {
    const next = advanceEra(state)
    if (!next) return json({ error: 'conditions', state }, 409)
    await writeEmpire(account.id, next)
    return json({ state: next })
  }

  if (action === 'sell') {
    const key = record.resource
    const amount = Number(record.amount)
    if (typeof key !== 'string' || !(EMPIRE_RESOURCES as readonly string[]).includes(key) || !Number.isFinite(amount)) {
      return json({ error: 'invalid', state }, 400)
    }
    const next = sellResource(state, key as EmpireResource, amount)
    if (!next) return json({ error: 'cost', state }, 409)
    await writeEmpire(account.id, next)
    return json({ state: next })
  }

  if (action === 'rename') {
    const name = record.name === '' ? '' : parseAccountName(record.name)
    if (name === null) return json({ error: 'invalid', state }, 400)
    state = { ...state, name }
    await writeEmpire(account.id, state)
    return json({ state })
  }

  if (action === 'unlock') {
    const feature = parseGateFeature(record.feature)
    if (!feature) return json({ error: 'invalid', state }, 400)
    const result = unlock(state, feature, now)
    if (!result.ok) return json({ error: result.reason, state }, 409)
    await writeEmpire(account.id, result.state)
    return json({ state: result.state })
  }

  if (action === 'mistakesRun') {
    if (access(state, { kind: 'mistakes' }, now) === 'locked') return json({ error: 'locked', state }, 403)
    state = noteMistakesRun(state)
    await writeEmpire(account.id, state)
    return json({ state })
  }

  if (action === 'grantPlus') {
    const admins = (process.env.EMPIRE_ADMIN_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    if (!admins.includes(account.id)) return json({ error: 'forbidden', state }, 403)
    const days = Number(record.days)
    if (!Number.isFinite(days) || days <= 0 || days > 3650) return json({ error: 'invalid', state }, 400)
    state = grantPlus(state, days, now)
    await writeEmpire(account.id, state)
    return json({ state })
  }

  if (action === 'buyPower') {
    const kind = record.kind
    if (typeof kind !== 'string' || !(kind in EMPIRE_POWER_BASE)) return json({ error: 'invalid', state }, 400)
    const result = buyPower(state, kind as EmpirePowerKind, now)
    if (!result.ok) return json({ error: result.reason, state }, 409)
    await writeEmpire(account.id, result.state)
    return json({ state: result.state, paid: result.paid })
  }

  if (action === 'buyBoost') {
    const pay = record.pay
    if (record.kind !== 'xp' || (pay !== 'coins' && pay !== 'gems')) return json({ error: 'invalid', state }, 400)
    const next = buyXpBoost(state, pay, now)
    if (!next) return json({ error: 'cost', state }, 409)
    await writeEmpire(account.id, next)
    return json({ state: next })
  }

  if (action === 'duelReward') {
    const code = normalizeCode(record.code)
    const playerId = parsePlayerId(record.playerId)
    if (!code || !playerId) return json({ error: 'invalid', state }, 400)
    const room = await readDuel(code)
    if (!room) return json({ error: 'invalid', state }, 400)
    const view = viewFor(room, playerId)
    if (!view || view.phase !== 'done' || view.total === 0) return json({ error: 'invalid', state }, 400)
    if (!(await claimNonce(account.id, `duel:${code}:${room.playStartedAt}`))) return json({ error: 'duplicate', state }, 409)
    const applied = applyDuelReward(state, view.youWon, now)
    await writeEmpire(account.id, applied.state)
    return json({ state: applied.state, duel: applied.reward })
  }

  if (action === 'roundReward') {
    if (!(await consumeRateLimit(`empire-round:${account.id}`, RATING_ROUND_LIMIT, RATING_ROUND_WINDOW_SEC))) {
      return json({ error: 'limited', state }, 429)
    }
    const round = parseRoundContext(record)
    if (!round) return json({ error: 'invalid', state }, 400)
    const gate = roundGate(round.ctx, record)
    if (gate && access(state, gate, now) === 'locked') return json({ error: 'locked', state }, 403)
    const nonce = record.nonce
    if (typeof nonce !== 'string' || nonce.length < 8 || nonce.length > 64) return json({ error: 'invalid', state }, 400)
    if (!(await claimNonce(account.id, nonce))) return json({ error: 'duplicate', state }, 409)
    const applied = applyRoundReward(state, round.ctx, now)
    await writeEmpire(account.id, applied.state)
    return json({ state: applied.state, reward: applied.reward })
  }

  if (action === 'import') {
    if (state.migratedAt !== null || hasProgress(state)) return json({ error: 'exists', state }, 409)
    const trial = clampTrial(record.trial, now)
    state = { ...trial, migratedAt: now }
    await writeEmpire(account.id, state)
    return json({ state })
  }

  if (action === 'legacy') {
    if (state.legacyAt !== null) return json({ error: 'exists', state }, 409)
    state = applyLegacyGrant(state, clampLegacyGrant(record.grant), now)
    await writeEmpire(account.id, state)
    return json({ state })
  }

  if (action === 'skipBuild') {
    const building = record.building
    if (typeof building !== 'string' || !(EMPIRE_ALL_BUILDINGS as readonly string[]).includes(building)) return json({ error: 'invalid', state }, 400)
    const result = skipBuild(state, building as EmpireBuilding, now)
    if (!result.ok) return json({ error: result.reason, state }, 409)
    await writeEmpire(account.id, result.state)
    return json({ state: result.state, paid: result.paid })
  }

  if (action === 'buyPerk') {
    const perk = record.perk
    if (typeof perk !== 'string' || !(perk in EMPIRE_PERKS)) return json({ error: 'invalid', state }, 400)
    const next = buyPerk(state, perk as keyof typeof EMPIRE_PERKS, now)
    if (!next) return json({ error: 'cost', state }, 409)
    await writeEmpire(account.id, next)
    return json({ state: next })
  }

  if (action === 'album') {
    const result = reportAlbum(state, record.report, record.sets)
    if (result.state !== state) await writeEmpire(account.id, result.state)
    return json({ state: result.state, gems: result.gems })
  }

  if (action === 'achievements') {
    const ids = Array.isArray(record.ids) ? record.ids.filter((x): x is string => typeof x === 'string').slice(0, 200) : []
    const result = claimAchievements(state, ids, (id) => ACHIEVEMENT_TIER.get(id) ?? null)
    if (result.claimed.length > 0) await writeEmpire(account.id, result.state)
    return json({ state: result.state, gems: result.gems })
  }

  if (action === 'claimLegacy') {
    const id = record.id
    if (!isLegacyMissionId(id)) return json({ error: 'invalid', state }, 400)
    const result = claimLegacy(state, id, { collections: COLLECTIONS.length }, now)
    if (!result.ok) return json({ error: result.reason, state }, 409)
    await writeEmpire(account.id, result.state)
    return json({ state: result.state, rewards: result.rewards, title: result.title })
  }

  if (action === 'setTitle') {
    const title = record.title === null ? null : record.title
    if (title !== null && !isLegacyTitleId(title)) return json({ error: 'invalid', state }, 400)
    const next = setTitle(state, title)
    if (!next) return json({ error: 'locked', state }, 409)
    await writeEmpire(account.id, next)
    return json({ state: next })
  }

  if (action === 'buyCosmetic') {
    const item = parseCosmeticId(record.kind, record.id)
    if (!item) return json({ error: 'invalid', state }, 400)
    const result = buyCosmetic(state, item, now)
    if (!result.ok) return json({ error: result.reason, state }, 409)
    await writeEmpire(account.id, result.state)
    return json({ state: result.state })
  }

  if (action === 'equip') {
    const kind = record.kind
    if (kind !== 'frame' && kind !== 'share') return json({ error: 'invalid', state }, 400)
    const id = record.id === null ? null : typeof record.id === 'string' ? record.id : undefined
    if (id === undefined) return json({ error: 'invalid', state }, 400)
    const next = equipCosmetic(state, kind, id)
    if (!next) return json({ error: 'invalid', state }, 400)
    await writeEmpire(account.id, next)
    return json({ state: next })
  }

  return json({ error: 'invalid', state }, 400)
}

function hasProgress(state: EmpireState) {
  return EMPIRE_BUILDINGS.some((b) => state.buildings[b].level > 0)
}

type ParsedRound = { ctx: RoundContext }

function parseCosmeticId(kind: unknown, id: unknown): CosmeticId | null {
  if (kind === 'frame' && isCardFrameId(id)) return { kind: 'frame', id }
  if (kind === 'share' && isShareThemeId(id)) return { kind: 'share', id }
  return null
}

/** Какой гейт покрывает этот раунд; `null` — контент открыт всем. Daily гейты игнорирует. */
function roundGate(ctx: RoundContext, record: Record<string, unknown>): GateFeature | null {
  if (ctx.path === 'pool') {
    if (ctx.hardcore || ctx.difficulty === 'hardcore') return { kind: 'difficulty', difficulty: 'hardcore' }
    if (ctx.difficulty === 'hard') return { kind: 'difficulty', difficulty: 'hard' }
    return null
  }
  if (ctx.path === 'levels') {
    if (ctx.hardcore) return { kind: 'levelHardcore' }
    const level = Number(record.level)
    return Number.isInteger(level) ? { kind: 'levels', world: ctx.world, level } : null
  }
  if (ctx.path === 'list') {
    const id = typeof record.listId === 'string' ? record.listId : null
    return id ? listGateOf(ctx.world, id) : null
  }
  if (ctx.path === 'mistakes') return null // бесплатный запуск уже учтён действием `mistakesRun`
  return null
}

function parseRoundContext(record: Record<string, unknown>): ParsedRound | null {
  const path = record.path
  if (typeof path !== 'string' || !(PATHS as readonly string[]).includes(path)) return null
  const world = record.world
  if (!isQuizWorld(world)) return null
  const endedBy = record.endedBy
  if (endedBy !== 'complete' && endedBy !== 'timeout' && endedBy !== 'lives') return null
  const correct = record.correct
  const total = record.total
  if (!Number.isInteger(correct) || !Number.isInteger(total)) return null
  const c = correct as number
  const n = total as number
  if (n < 1 || n > 40 || c < 0 || c > n) return null
  const difficulty = isQuizDifficulty(record.difficulty) ? record.difficulty : 'medium'
  const roundMs = Number(record.roundMs)
  if (!Number.isFinite(roundMs) || roundMs < n * RATING_MIN_MS_PER_QUESTION) return null
  const hardcore = record.hardcore === true
  const perfect = endedBy === 'complete' && c === n

  const ctx: RoundContext = {
    world,
    path: path as PlayPath,
    endedBy,
    correct: c,
    total: n,
    difficulty,
    hardcore,
    perfect,
    listId: typeof record.listId === 'string' ? record.listId.slice(0, 64) : undefined,
  }

  // Для зачётных раундов требуем ту же проверку, что и рейтинг: режим, число вопросов, тайминг, жизни.
  const rated = path === 'pool' || (path === 'levels' && endedBy === 'complete')
  if (rated) {
    if (c < 1) return { ctx: { ...ctx, perfect: false } }
    const parsed = parseRatedRound({ kind: 'round', ...record, questions: n, correct: c, roundMs })
    if (!parsed) return null
    const scored = scoreRatedRound(parsed)
    if (!scored || scored.world !== world) return null
    if (path === 'levels') {
      ctx.deltaXp = Math.max(0, Math.floor(Number(record.deltaXp) || 0))
      ctx.deltaXp = Math.min(ctx.deltaXp, scored.runXp)
      ctx.worldRecord = record.worldRecord === true
    }
  }
  return { ctx }
}
