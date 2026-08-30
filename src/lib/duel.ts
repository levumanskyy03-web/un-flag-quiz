import { COUNTRIES, type Country } from '../data/countries'
import { footballTeamCountry, isNamedFootballTeam } from '../data/worldCup'
import type { DuelQuestionWire, DuelView } from './duelTypes'
import type { FactsDuelConfig } from './factsRules'
import { isPlayerId } from './leaderboard'
import { isFactsToName, isFootballMode, isFootballYearChoice, isQuizMode, type Question } from './quiz'

const DUEL_ID_KEY = 'pq-duel-player'

export type { DuelView, DuelQuestionWire }

export function duelPlayerId(): string {
  try {
    const existing = sessionStorage.getItem(DUEL_ID_KEY)
    if (existing && isPlayerId(existing)) return existing
    const id = crypto.randomUUID()
    sessionStorage.setItem(DUEL_ID_KEY, id)
    return id
  } catch {
    return crypto.randomUUID()
  }
}

export function questionFromWire(wire: DuelQuestionWire | null): Question | null {
  if (!wire) return null
  const byIso = new Map(COUNTRIES.map((country) => [country.iso, country]))
  const country =
    byIso.get(wire.countryIso) ??
    (isFootballMode(wire.mode) || isNamedFootballTeam(wire.countryIso) || wire.countryIso.includes('+')
      ? footballTeamCountry(wire.countryIso)
      : undefined)
  if (!country) return null
  if (isFactsToName(wire.mode ?? 'flagToName')) {
    return {
      country,
      options: [country],
      mode: 'factsToName',
      facts: wire.facts ?? [],
    }
  }
  if (isFootballYearChoice(wire.mode ?? 'flagToName')) {
    return {
      country,
      options: [],
      yearOptions: wire.yearOptions,
      mode: wire.mode,
      year: wire.year,
    }
  }
  const options = wire.optionIsos
    .map((iso) => byIso.get(iso) ?? (isNamedFootballTeam(iso) || iso.includes('+') ? footballTeamCountry(iso) : undefined))
    .filter((item): item is Country => item !== undefined)
  if (options.length < 2 && !(wire.waterOptions && wire.waterOptions.length >= 2)) return null
  return {
    country,
    options: options.length > 0 ? options : [country],
    mode: isQuizMode(wire.mode) ? wire.mode : undefined,
    year: wire.year,
    waterId: wire.waterId,
    waterOptions: wire.waterOptions,
  }
}

export async function createDuel(input: {
  name: string
  modes: DuelView['modes']
  region: DuelView['region']
  difficulty: DuelView['difficulty']
  roundSize: number
  facts?: FactsDuelConfig
}): Promise<{ ok: true; room: DuelView } | { ok: false; error: string }> {
  return post('/api/duel/create', {
    ...input,
    playerId: duelPlayerId(),
    name: input.name || 'Player',
    mode: input.modes[0],
    facts: input.facts,
    factsEnd: input.facts?.end,
    factsHardcore: input.facts?.hardcore,
    factsSeries: input.facts?.series,
  })
}

export async function joinDuel(
  code: string,
  name: string,
): Promise<{ ok: true; room: DuelView } | { ok: false; error: string }> {
  return post('/api/duel/join', { code, playerId: duelPlayerId(), name: name || 'Player' })
}

export async function fetchDuel(code: string): Promise<{ ok: true; room: DuelView } | { ok: false; error: string }> {
  try {
    const response = await fetch(`/api/duel/${code}?playerId=${encodeURIComponent(duelPlayerId())}`, {
      cache: 'no-store',
    })
    return parseResponse(response)
  } catch {
    return { ok: false, error: 'offline' }
  }
}

export async function answerDuel(
  code: string,
  iso: string | null,
): Promise<{ ok: true; room: DuelView } | { ok: false; error: string }> {
  return post(`/api/duel/${code}`, { playerId: duelPlayerId(), iso })
}

export async function rematchDuel(
  code: string,
): Promise<{ ok: true; room: DuelView } | { ok: false; error: string }> {
  return post(`/api/duel/${code}`, { playerId: duelPlayerId(), action: 'rematch' })
}

export async function advanceDuelFact(
  code: string,
): Promise<{ ok: true; room: DuelView } | { ok: false; error: string }> {
  return post(`/api/duel/${code}`, { playerId: duelPlayerId(), action: 'advanceFact' })
}

export async function leaveDuel(code: string): Promise<void> {
  try {
    await fetch(`/api/duel/${code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: duelPlayerId(), action: 'leave' }),
    })
  } catch {
    /* lobby close should still work offline */
  }
}

async function post(
  url: string,
  body: unknown,
): Promise<{ ok: true; room: DuelView } | { ok: false; error: string }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return parseResponse(response)
  } catch {
    return { ok: false, error: 'offline' }
  }
}

async function parseResponse(
  response: Response,
): Promise<{ ok: true; room: DuelView } | { ok: false; error: string }> {
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok || !body || typeof body !== 'object') {
    const error = body && typeof body === 'object' && typeof (body as { error?: unknown }).error === 'string'
      ? (body as { error: string }).error
      : 'offline'
    return { ok: false, error }
  }
  const room = (body as { room?: unknown }).room
  if (!room || typeof room !== 'object') return { ok: false, error: 'offline' }
  return { ok: true, room: room as DuelView }
}
