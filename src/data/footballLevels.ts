import { AFCON_WINNERS } from './afcon'
import { COPA_WINNERS } from './copaAmerica'
import { EURO_HOSTS, EURO_WINNERS } from './euros'
import { FOOTBALL_PLAYERS } from './footballPlayers'
import { UCL_WINNERS } from './ucl'
import { WC_SCORERS } from './wcScorers'
import { WORLD_CUP_HOSTS, WORLD_CUP_WINNERS } from './worldCup'

export const FOOTBALL_LEVEL_CHUNK = 4

export function footballYearsForMode(mode: string): number[] {
  if (mode === 'euroWinners' || mode === 'euroFinalists' || mode === 'euroTitleYears') {
    return EURO_WINNERS.map((item) => item.year)
  }
  if (mode === 'euroHosts') return EURO_HOSTS.map((item) => item.year)
  if (mode === 'wcHosts') return WORLD_CUP_HOSTS.map((item) => item.year)
  if (mode === 'wcScorers') return WC_SCORERS.map((item) => item.year)
  if (mode === 'uclWinners') return UCL_WINNERS.map((item) => item.year)
  if (mode === 'copaWinners') return COPA_WINNERS.map((item) => item.year)
  if (mode === 'afconWinners') return AFCON_WINNERS.map((item) => item.year)
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
  if (mode === 'playerPhotoToName') return footballPlayerChunks().length
  return footballLevelChunks(mode).length
}

export function footballLevelPlayerIds(mode: string, level: number): string[] {
  if (mode !== 'playerPhotoToName') return []
  return footballPlayerChunks()[level - 1] ?? []
}

export function footballLevelYears(mode: string, level: number): number[] {
  return footballLevelChunks(mode)[level - 1] ?? []
}

export function footballLevelNumbers(mode: string): number[] {
  return footballLevelChunks(mode).map((_, index) => index + 1)
}
