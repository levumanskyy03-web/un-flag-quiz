import type { Country } from '../data/countries'
import {
  FOOTBALL_PLAYERS,
  playerById,
  playerClubName,
  playerCountry,
  type FootballPlayer,
} from '../data/footballPlayers'
import { footballTeamCountry } from '../data/worldCup'
import { type Lang } from '../i18n/lang'
import { STRINGS } from '../i18n/strings'
import { mulberry32, seedFrom } from './countryFacts'
import { FACTS_MAX } from './factsRules'

export type PlayerFactKind =
  | 'playerNation'
  | 'playerPosition'
  | 'playerClub'
  | 'playerWcWinner'
  | 'playerEuroWinner'
  | 'playerCopaWinner'
  | 'playerAfconWinner'
  | 'playerUclWinner'
  | 'playerBallonDor'
  | 'playerBallonDorYear'
  | 'playerBallonDorCount'
  | 'playerWcCount'
  | 'playerBornDecade'
  | 'playerWcFinalGoal'
  | 'playerWcCaptain'
  | 'playerGoldenBoot'
  | 'playerBothClasico'
  | 'playerLeftFoot'
  | 'playerNumber10'

export interface PlayerFactClue {
  id: string
  kind: PlayerFactKind
  uniqueness: number
  nation?: string
  position?: FootballPlayer['position']
  clubId?: string
  year?: number
  count?: number
  decade?: number
}

const EARLY_MIN = 3
const EARLY_UNIQUENESS = 4

let cached: { byId: Map<string, PlayerFactClue[]>; byKey: Map<string, Set<string>> } | null = null

function store() {
  if (!cached) cached = buildBank()
  return cached
}

function buildBank() {
  const byId = new Map<string, PlayerFactClue[]>()
  const byKey = new Map<string, Set<string>>()

  function add(playerId: string, clue: Omit<PlayerFactClue, 'uniqueness'>, key: string) {
    const list = byId.get(playerId) ?? []
    list.push({ ...clue, uniqueness: 0 })
    byId.set(playerId, list)
    const set = byKey.get(key) ?? new Set()
    set.add(playerId)
    byKey.set(key, set)
  }

  for (const player of FOOTBALL_PLAYERS) {
    add(player.id, { id: `nation:${player.nation}`, kind: 'playerNation', nation: player.nation }, `nation:${player.nation}`)
    add(
      player.id,
      { id: `position:${player.position}`, kind: 'playerPosition', position: player.position },
      `position:${player.position}`,
    )
    const decade = Math.floor(player.born / 10) * 10
    add(player.id, { id: `born:${decade}`, kind: 'playerBornDecade', decade }, `born:${decade}`)
    const wcBand = player.wcYears.length === 0 ? 0 : player.wcYears.length === 1 ? 1 : player.wcYears.length === 2 ? 2 : 3
    add(player.id, { id: `wcCount:${wcBand}`, kind: 'playerWcCount', count: wcBand }, `wcCount:${wcBand}`)
    if (player.wcWins.length > 0) add(player.id, { id: 'wcWin', kind: 'playerWcWinner' }, 'wcWin')
    if (player.euroWins.length > 0) add(player.id, { id: 'euroWin', kind: 'playerEuroWinner' }, 'euroWin')
    if (player.copaWins.length > 0) add(player.id, { id: 'copaWin', kind: 'playerCopaWinner' }, 'copaWin')
    if (player.afconWins.length > 0) add(player.id, { id: 'afconWin', kind: 'playerAfconWinner' }, 'afconWin')
    if (player.uclWins.length > 0) add(player.id, { id: 'uclWin', kind: 'playerUclWinner' }, 'uclWin')
    if (player.ballonDor.length > 0) {
      add(player.id, { id: 'ballon', kind: 'playerBallonDor' }, 'ballon')
      const n = player.ballonDor.length >= 3 ? 3 : player.ballonDor.length
      add(player.id, { id: `ballonN:${n}`, kind: 'playerBallonDorCount', count: n }, `ballonN:${n}`)
      for (const year of player.ballonDor) {
        add(player.id, { id: `ballonY:${year}`, kind: 'playerBallonDorYear', year }, `ballonY:${year}`)
      }
    }
    if (player.wcFinalGoal) add(player.id, { id: 'wcFinalGoal', kind: 'playerWcFinalGoal' }, 'wcFinalGoal')
    if (player.wcCaptain) add(player.id, { id: 'wcCaptain', kind: 'playerWcCaptain' }, 'wcCaptain')
    if (player.goldenBoot) add(player.id, { id: 'goldenBoot', kind: 'playerGoldenBoot' }, 'goldenBoot')
    if (player.leftFoot) add(player.id, { id: 'leftFoot', kind: 'playerLeftFoot' }, 'leftFoot')
    if (player.number10) add(player.id, { id: 'number10', kind: 'playerNumber10' }, 'number10')
    if (player.clubs.includes('barca') && player.clubs.includes('real')) {
      add(player.id, { id: 'clasico', kind: 'playerBothClasico' }, 'clasico')
    }
    for (const clubId of player.clubs) {
      add(player.id, { id: `club:${clubId}`, kind: 'playerClub', clubId }, `club:${clubId}`)
    }
  }

  for (const list of byId.values()) {
    for (const clue of list) {
      clue.uniqueness = byKey.get(clue.id)?.size ?? 1
    }
  }
  return { byId, byKey }
}

function matching(clue: PlayerFactClue): Set<string> {
  return new Set(store().byKey.get(clue.id) ?? [])
}

function intersection(clues: PlayerFactClue[]): Set<string> {
  if (clues.length === 0) return new Set(FOOTBALL_PLAYERS.map((player) => player.id))
  let set = matching(clues[0])
  for (let i = 1; i < clues.length; i += 1) {
    const next = matching(clues[i])
    set = new Set([...set].filter((id) => next.has(id)))
  }
  return set
}

export function playerClueSequence(
  playerId: string,
  count = FACTS_MAX,
  rng: () => number = Math.random,
): PlayerFactClue[] {
  const all = [...(store().byId.get(playerId) ?? [])]
  if (all.length === 0) return []
  const size = Math.max(1, Math.min(count, all.length))
  const used = new Set<string>()
  const picked: PlayerFactClue[] = []
  const nation = all.find((clue) => clue.kind === 'playerNation')
  const broad = all
    .filter((clue) => clue.uniqueness >= EARLY_UNIQUENESS && clue.kind !== 'playerBallonDorYear')
    .sort((a, b) => b.uniqueness - a.uniqueness || rng() - 0.5)
  const unique = all
    .filter((clue) => clue.uniqueness <= 3 || clue.kind === 'playerBallonDorYear' || clue.kind === 'playerClub')
    .sort((a, b) => a.uniqueness - b.uniqueness || rng() - 0.5)

  const take = (pool: PlayerFactClue[], keepMin: number) => {
    for (const clue of pool) {
      if (picked.length >= size) return
      if (used.has(clue.id)) continue
      const next = [...picked, clue]
      if (intersection(next).size < keepMin && picked.length < 3) continue
      picked.push(clue)
      used.add(clue.id)
    }
  }

  take(broad, EARLY_MIN)
  if (nation && !used.has(nation.id) && picked.length < 5) {
    picked.splice(Math.min(4, picked.length), 0, nation)
    used.add(nation.id)
  }
  take(unique, 1)
  take(
    [...all].sort((a, b) => a.uniqueness - b.uniqueness),
    1,
  )
  return picked.slice(0, size)
}

function nationName(iso: string, lang: Lang): string {
  const country = footballTeamCountry(iso)
  return lang === 'ru' ? country.nameRu : country.nameEn
}

export function playerFactLabel(clue: PlayerFactClue, lang: Lang): string {
  const t = STRINGS[lang]
  const clubLang = lang === 'ru' ? 'ru' : 'en'
  switch (clue.kind) {
    case 'playerNation':
      return t.playerFactNation(nationName(clue.nation ?? '', lang))
    case 'playerPosition':
      return t.playerFactPosition(
        clue.position === 'gk'
          ? t.playerPositionGk
          : clue.position === 'df'
            ? t.playerPositionDf
            : clue.position === 'mf'
              ? t.playerPositionMf
              : t.playerPositionFw,
      )
    case 'playerClub':
      return t.playerFactClub(playerClubName(clue.clubId ?? '', clubLang))
    case 'playerWcWinner':
      return t.playerFactWcWinner
    case 'playerEuroWinner':
      return t.playerFactEuroWinner
    case 'playerCopaWinner':
      return t.playerFactCopaWinner
    case 'playerAfconWinner':
      return t.playerFactAfconWinner
    case 'playerUclWinner':
      return t.playerFactUclWinner
    case 'playerBallonDor':
      return t.playerFactBallonDor
    case 'playerBallonDorYear':
      return t.playerFactBallonDorYear(clue.year ?? 0)
    case 'playerBallonDorCount':
      return t.playerFactBallonDorCount(clue.count ?? 1)
    case 'playerWcCount':
      return t.playerFactWcCount(clue.count ?? 0)
    case 'playerBornDecade':
      return t.playerFactBornDecade(clue.decade ?? 0)
    case 'playerWcFinalGoal':
      return t.playerFactWcFinalGoal
    case 'playerWcCaptain':
      return t.playerFactWcCaptain
    case 'playerGoldenBoot':
      return t.playerFactGoldenBoot
    case 'playerBothClasico':
      return t.playerFactBothClasico
    case 'playerLeftFoot':
      return t.playerFactLeftFoot
    case 'playerNumber10':
      return t.playerFactNumber10
    default:
      return clue.id
  }
}

export function searchPlayers(query: string, lang: Lang, limit = 8): Country[] {
  const needle = query.trim().toLowerCase()
  if (needle.length === 0) return []
  const scored: Array<{ player: FootballPlayer; score: number }> = []
  for (const player of FOOTBALL_PLAYERS) {
    const names = [player.en, player.ru]
    let score = 0
    for (const name of names) {
      const lower = name.toLowerCase()
      if (lower.startsWith(needle)) score = Math.max(score, 3)
      else if (lower.split(/[\s'-]+/).some((word) => word.startsWith(needle))) score = Math.max(score, 2)
    }
    if (score > 0) scored.push({ player, score })
  }
  scored.sort((a, b) => b.score - a.score || a.player.en.localeCompare(b.player.en))
  return scored.slice(0, limit).map((row) => playerCountry(row.player))
}

export function playerFromIso(id: string): FootballPlayer | undefined {
  return playerById(id)
}

export { mulberry32, seedFrom }
