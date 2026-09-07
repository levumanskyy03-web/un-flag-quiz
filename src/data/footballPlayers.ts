import type { Country } from './countries'
import { footballClub } from './footballClubs'
import { FOOTBALL_PLAYER_ROWS, type FootballPlayerRow, type PlayerEra, type PlayerPos, type PlayerTier } from './footballPlayerRows'

export type PlayerPosition = PlayerPos
export type { PlayerTier, PlayerEra }

export interface FootballPlayer {
  id: string
  en: string
  ru: string
  wiki: string
  nation: string
  bornNation: string
  position: PlayerPosition
  clubs: string[]
  born: number
  died?: number
  era: PlayerEra
  wcYears: number[]
  wcWins: number[]
  euroWins: number[]
  copaWins: number[]
  afconWins: number[]
  uclWins: number[]
  ballonDor: number[]
  wcGoals: number
  tier: PlayerTier
  heightCm?: number
  foot?: 'left' | 'right' | 'both'
  number?: number
  caps?: number
  intlGoals?: number
  leftFoot?: boolean
  number10?: boolean
  wcFinalGoal?: boolean
  wcCaptain?: boolean
  goldenBoot?: boolean
}

function fromRow(row: FootballPlayerRow): FootballPlayer {
  return {
    id: row.id,
    en: row.en,
    ru: row.ru,
    wiki: row.wiki ?? row.en,
    nation: row.nation,
    bornNation: row.bornNation ?? row.nation,
    position: row.pos,
    clubs: row.clubs,
    born: row.born,
    died: row.died,
    era: row.era,
    wcYears: row.wcYears ?? [],
    wcWins: row.wcWins ?? [],
    euroWins: row.euroWins ?? [],
    copaWins: row.copaWins ?? [],
    afconWins: row.afconWins ?? [],
    uclWins: row.uclWins ?? [],
    ballonDor: row.ballonDor ?? [],
    wcGoals: row.wcGoals ?? 0,
    tier: row.tier,
    heightCm: row.heightCm,
    foot: row.foot ?? (row.leftFoot ? 'left' : undefined),
    number: row.number ?? (row.number10 ? 10 : undefined),
    caps: row.caps,
    intlGoals: row.intlGoals,
    leftFoot: row.leftFoot ?? row.foot === 'left',
    number10: row.number10 ?? row.number === 10,
    wcFinalGoal: row.wcFinalGoal,
    wcCaptain: row.wcCaptain,
    goldenBoot: row.goldenBoot,
  }
}

export const FOOTBALL_PLAYERS: FootballPlayer[] = FOOTBALL_PLAYER_ROWS.map(fromRow)

const BY_ID = new Map(FOOTBALL_PLAYERS.map((player) => [player.id, player]))

export function playerById(id: string): FootballPlayer | undefined {
  return BY_ID.get(id)
}

export function isFootballPlayerId(id: string): boolean {
  return BY_ID.has(id)
}

export function playerCountry(player: FootballPlayer): Country {
  return {
    iso: player.id,
    nameEn: player.en,
    nameRu: player.ru,
    region: 'europe',
    difficulty: player.tier === 'easy' ? 'easy' : 'hard',
  }
}

export function playerClubName(id: string, lang: 'en' | 'ru'): string {
  const fromCatalog = footballClub(id)
  if (fromCatalog) return lang === 'ru' ? fromCatalog.nameRu : fromCatalog.nameEn
  return id
}

export function footballPlayerWikis(): string[] {
  return FOOTBALL_PLAYERS.map((player) => player.wiki)
}

export function footballPlayerPool(difficulty: 'easy' | 'medium' | 'hard' | 'hardcore' = 'hard'): FootballPlayer[] {
  const wanted: PlayerTier = difficulty === 'easy' ? 'easy' : difficulty === 'medium' ? 'medium' : 'hard'
  const match = FOOTBALL_PLAYERS.filter((player) => player.tier === wanted)
  if (match.length >= 4) return match
  const order: PlayerTier[] = ['easy', 'medium', 'hard']
  const start = order.indexOf(wanted)
  for (let span = 1; span < order.length; span += 1) {
    const from = Math.max(0, start - span)
    const to = Math.min(order.length - 1, start + span)
    const allowed = new Set(order.slice(from, to + 1))
    const expanded = FOOTBALL_PLAYERS.filter((player) => allowed.has(player.tier))
    if (expanded.length >= 4) return expanded
  }
  return FOOTBALL_PLAYERS
}

export function playersWithShirtNumber(): FootballPlayer[] {
  return FOOTBALL_PLAYERS.filter((player) => player.number !== undefined)
}
