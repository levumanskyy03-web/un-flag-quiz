import { EURO_WINNERS } from './euros'
import { WORLD_CUP_HOSTS, WORLD_CUP_WINNERS } from './worldCup'

export const FOOTBALL_LEVEL_CHUNK = 4

const FOOTBALL_LEVEL_MODES = ['wcWinners', 'wcFinalists', 'wcHosts', 'wcTitleYears', 'euroWinners'] as const
export type FootballLevelMode = (typeof FOOTBALL_LEVEL_MODES)[number]

export function isFootballLevelMode(value: string): value is FootballLevelMode {
  return (FOOTBALL_LEVEL_MODES as readonly string[]).includes(value)
}

export function footballYearsForMode(mode: string): number[] {
  if (mode === 'euroWinners') return EURO_WINNERS.map((item) => item.year)
  if (mode === 'wcHosts') return WORLD_CUP_HOSTS.map((item) => item.year)
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

export function footballCampaignLevels(mode: string): number {
  return footballLevelChunks(mode).length
}

export function footballLevelYears(mode: string, level: number): number[] {
  return footballLevelChunks(mode)[level - 1] ?? []
}

export function footballLevelNumbers(mode: string): number[] {
  return footballLevelChunks(mode).map((_, index) => index + 1)
}
