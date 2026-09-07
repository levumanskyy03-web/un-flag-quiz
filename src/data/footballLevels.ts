import { AFCON_HOSTS, AFCON_WINNERS } from './afcon'
import { COPA_HOSTS, COPA_WINNERS } from './copaAmerica'
import { EURO_HOSTS, EURO_WINNERS } from './euros'
import { FOOTBALL_PLAYERS } from './footballPlayers'
import { FOOTBALL_MANAGERS } from './footballManagers'
import { allFootballClubs } from './footballClubs'
import { FOOTBALL_STADIUMS } from './footballStadiums'
import { UCL_WINNERS } from './ucl'
import { WC_SCORERS } from './wcScorers'
import { WORLD_CUP_HOSTS, WORLD_CUP_WINNERS } from './worldCup'
import { ASIAN_CUP_WINNERS, GOLD_CUP_WINNERS, NATIONS_LEAGUE_WINNERS } from './footballCups'
import { EUROPA_WINNERS } from './europaLeague'
import { LIBERTADORES_WINNERS } from './libertadores'
import { LEAGUE_TITLES } from './topLeagues'
import { BALLON_DOR_WINNERS, GOLDEN_BALL_WINNERS } from './ballonDor'

export const FOOTBALL_LEVEL_CHUNK = 4

export function footballYearsForMode(mode: string): number[] {
  if (mode === 'euroWinners' || mode === 'euroFinalists' || mode === 'euroTitleYears') {
    return EURO_WINNERS.map((item) => item.year)
  }
  if (mode === 'euroHosts') return EURO_HOSTS.map((item) => item.year)
  if (mode === 'wcHosts') return WORLD_CUP_HOSTS.map((item) => item.year)
  if (mode === 'copaHosts') return COPA_HOSTS.map((item) => item.year)
  if (mode === 'afconHosts') return AFCON_HOSTS.map((item) => item.year)
  if (mode === 'wcScorers') return WC_SCORERS.map((item) => item.year)
  if (mode === 'uclWinners' || mode === 'uclFinalists' || mode === 'uclTitleYears') {
    return UCL_WINNERS.map((item) => item.year)
  }
  if (mode === 'copaWinners' || mode === 'copaFinalists') return COPA_WINNERS.map((item) => item.year)
  if (mode === 'afconWinners' || mode === 'afconFinalists') return AFCON_WINNERS.map((item) => item.year)
  if (mode === 'asianCupWinners') return ASIAN_CUP_WINNERS.map((item) => item.year)
  if (mode === 'goldCupWinners') return GOLD_CUP_WINNERS.map((item) => item.year)
  if (mode === 'nationsLeagueWinners') return NATIONS_LEAGUE_WINNERS.map((item) => item.year)
  if (mode === 'europaWinners') return EUROPA_WINNERS.map((item) => item.year)
  if (mode === 'libertadoresWinners') return LIBERTADORES_WINNERS.map((item) => item.year)
  if (mode === 'leagueWinners') return LEAGUE_TITLES.map((item) => item.year)
  if (mode === 'ballonDorWinners') return BALLON_DOR_WINNERS.map((item) => item.year)
  if (mode === 'goldenBallWinners') return GOLDEN_BALL_WINNERS.map((item) => item.year)
  return WORLD_CUP_WINNERS.map((item) => item.year)
}

export function footballLevelChunks(mode: string): number[][] {
  const years = footballYearsForMode(mode)
  const chunks: number[][] = []
  for (let index = 0; index < years.length; index += FOOTBALL_LEVEL_CHUNK) {
    chunks.push(years.slice(index, index + FOOTBALL_LEVEL_CHUNK))
  }
  return chunks
}

export function footballPlayerChunks(): string[][] {
  const ids = FOOTBALL_PLAYERS.map((player) => player.id)
  const chunks: string[][] = []
  for (let index = 0; index < ids.length; index += FOOTBALL_LEVEL_CHUNK) {
    chunks.push(ids.slice(index, index + FOOTBALL_LEVEL_CHUNK))
  }
  return chunks
}

export function footballCampaignLevels(mode: string): number {
  if (mode === 'playerFactsToName') return 0
  if (mode === 'clubCrestToName') return chunksOf(allFootballClubs().map((club) => club.id)).length
  if (mode === 'stadiumToClub') return chunksOf(FOOTBALL_STADIUMS.map((item) => item.id)).length
  if (mode === 'managerPhotoToName') return chunksOf(FOOTBALL_MANAGERS.map((item) => item.id)).length
  if (
    mode === 'playerPhotoToName' ||
    mode === 'playerToNation' ||
    mode === 'playerToClub' ||
    mode === 'playerClubToName' ||
    mode === 'playerShirtToName'
  ) {
    return footballPlayerChunks().length
  }
  return footballLevelChunks(mode).length
}

function chunksOf(ids: string[]): string[][] {
  const chunks: string[][] = []
  for (let index = 0; index < ids.length; index += FOOTBALL_LEVEL_CHUNK) {
    chunks.push(ids.slice(index, index + FOOTBALL_LEVEL_CHUNK))
  }
  return chunks
}

export function footballLevelPlayerIds(mode: string, level: number): string[] {
  if (
    mode === 'playerPhotoToName' ||
    mode === 'playerToNation' ||
    mode === 'playerToClub' ||
    mode === 'playerClubToName' ||
    mode === 'playerShirtToName'
  ) {
    return footballPlayerChunks()[level - 1] ?? []
  }
  if (mode === 'managerPhotoToName') return chunksOf(FOOTBALL_MANAGERS.map((item) => item.id))[level - 1] ?? []
  if (mode === 'clubCrestToName') return chunksOf(allFootballClubs().map((club) => club.id))[level - 1] ?? []
  if (mode === 'stadiumToClub') return chunksOf(FOOTBALL_STADIUMS.map((item) => item.id))[level - 1] ?? []
  return []
}

export function footballLevelYears(mode: string, level: number): number[] {
  return footballLevelChunks(mode)[level - 1] ?? []
}

export function footballLevelNumbers(mode: string): number[] {
  return footballLevelChunks(mode).map((_, index) => index + 1)
}
