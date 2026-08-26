import { footballTeamCountry, type WorldCupWinner } from './worldCup'

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

const EURO_EASY_FROM = 1996

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

export function euroRelatedTeamIds(year: number): string[] {
  const index = EURO_WINNERS.findIndex((item) => item.year === year)
  if (index < 0) return []
  const current = EURO_WINNERS[index]
  const ids: string[] = []
  const add = (id?: string) => {
    if (id && id !== current.winnerId && !ids.includes(id)) ids.push(id)
  }
  add(EURO_WINNERS[index - 1]?.winnerId)
  add(EURO_WINNERS[index + 1]?.winnerId)
  add(current.runnerUpId)
  return ids
}
