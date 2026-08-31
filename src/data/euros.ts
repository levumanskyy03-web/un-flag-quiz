import {
  footballTeamCountry,
  hostRelatedIds,
  singleHostPool,
  tournamentRelatedFinalistIds,
  tournamentRelatedWinnerIds,
  tournamentWinYears,
  wcHostAnswerId,
  type WorldCupHost,
  type WorldCupWinner,
} from './worldCup'

export const EURO_WINNERS: WorldCupWinner[] = [
  { year: 1960, winnerId: 'su', runnerUpId: 'yu' },
  { year: 1964, winnerId: 'es', runnerUpId: 'su' },
  { year: 1968, winnerId: 'it', runnerUpId: 'yu' },
  { year: 1972, winnerId: 'de', runnerUpId: 'su' },
  { year: 1976, winnerId: 'tch', runnerUpId: 'de' },
  { year: 1980, winnerId: 'de', runnerUpId: 'be' },
  { year: 1984, winnerId: 'fr', runnerUpId: 'es' },
  { year: 1988, winnerId: 'nl', runnerUpId: 'su' },
  { year: 1992, winnerId: 'dk', runnerUpId: 'de' },
  { year: 1996, winnerId: 'de', runnerUpId: 'cz' },
  { year: 2000, winnerId: 'fr', runnerUpId: 'it' },
  { year: 2004, winnerId: 'gr', runnerUpId: 'pt' },
  { year: 2008, winnerId: 'es', runnerUpId: 'de' },
  { year: 2012, winnerId: 'es', runnerUpId: 'it' },
  { year: 2016, winnerId: 'pt', runnerUpId: 'fr' },
  { year: 2020, winnerId: 'it', runnerUpId: 'eng' },
  { year: 2024, winnerId: 'es', runnerUpId: 'eng' },
]

export const EURO_EASY_FROM = 1996

export function euroPool(difficulty: 'easy' | 'medium' | 'hard' | 'hardcore'): WorldCupWinner[] {
  if (difficulty === 'easy') return EURO_WINNERS.filter((item) => item.year >= EURO_EASY_FROM)
  return EURO_WINNERS
}

export function euroChampionCountries() {
  return [...new Set(EURO_WINNERS.map((item) => item.winnerId))].map(footballTeamCountry)
}

export function euroTeamCountries() {
  return [...new Set(EURO_WINNERS.flatMap((item) => [item.winnerId, item.runnerUpId]))].map(footballTeamCountry)
}

export const EURO_HOSTS: WorldCupHost[] = [
  { year: 1960, hostIds: ['fr'] },
  { year: 1964, hostIds: ['es'] },
  { year: 1968, hostIds: ['it'] },
  { year: 1972, hostIds: ['be'] },
  { year: 1976, hostIds: ['yu'] },
  { year: 1980, hostIds: ['it'] },
  { year: 1984, hostIds: ['fr'] },
  { year: 1988, hostIds: ['de'] },
  { year: 1992, hostIds: ['se'] },
  { year: 1996, hostIds: ['eng'] },
  { year: 2000, hostIds: ['be', 'nl'] },
  { year: 2004, hostIds: ['pt'] },
  { year: 2008, hostIds: ['at', 'ch'] },
  { year: 2012, hostIds: ['pl', 'ua'] },
  { year: 2016, hostIds: ['fr'] },
  { year: 2024, hostIds: ['de'] },
]

export function euroHostPool(difficulty: 'easy' | 'medium' | 'hard' | 'hardcore'): WorldCupHost[] {
  return singleHostPool(EURO_HOSTS, difficulty)
}

export function euroHostCountries() {
  const ids = new Set<string>()
  for (const cup of EURO_HOSTS) {
    ids.add(wcHostAnswerId(cup.hostIds))
    for (const id of cup.hostIds) ids.add(id)
  }
  return [...ids].map(footballTeamCountry)
}

export function euroRelatedTeamIds(year: number): string[] {
  return tournamentRelatedWinnerIds(EURO_WINNERS, year)
}

export function euroHostRelatedIds(year: number): string[] {
  return hostRelatedIds(EURO_HOSTS, year)
}

export function euroFinalistRelatedIds(year: number): string[] {
  return tournamentRelatedFinalistIds(EURO_WINNERS, year)
}

export function euroWinYearsFor(winnerId: string): number[] {
  return tournamentWinYears(EURO_WINNERS, winnerId)
}
