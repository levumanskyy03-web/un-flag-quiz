import { footballClub } from './footballClubs'
import { footballTeamCountry, uniqueIds, type WorldCupWinner } from './worldCup'

export interface UclWinner {
  year: number
  clubId: string
  runnerUpId: string
}

export const UCL_WINNERS: UclWinner[] = [
  { year: 1956, clubId: 'real', runnerUpId: 'reims' },
  { year: 1957, clubId: 'real', runnerUpId: 'fiorentina' },
  { year: 1958, clubId: 'real', runnerUpId: 'milan' },
  { year: 1959, clubId: 'real', runnerUpId: 'reims' },
  { year: 1960, clubId: 'real', runnerUpId: 'frankfurt' },
  { year: 1961, clubId: 'benfica', runnerUpId: 'barca' },
  { year: 1962, clubId: 'benfica', runnerUpId: 'real' },
  { year: 1963, clubId: 'milan', runnerUpId: 'benfica' },
  { year: 1964, clubId: 'inter', runnerUpId: 'real' },
  { year: 1965, clubId: 'inter', runnerUpId: 'benfica' },
  { year: 1966, clubId: 'real', runnerUpId: 'partizan' },
  { year: 1967, clubId: 'celtic', runnerUpId: 'inter' },
  { year: 1968, clubId: 'manutd', runnerUpId: 'benfica' },
  { year: 1969, clubId: 'milan', runnerUpId: 'ajax' },
  { year: 1970, clubId: 'feyenoord', runnerUpId: 'celtic' },
  { year: 1971, clubId: 'ajax', runnerUpId: 'panathinaikos' },
  { year: 1972, clubId: 'ajax', runnerUpId: 'inter' },
  { year: 1973, clubId: 'ajax', runnerUpId: 'juve' },
  { year: 1974, clubId: 'bayern', runnerUpId: 'atletico' },
  { year: 1975, clubId: 'bayern', runnerUpId: 'leeds' },
  { year: 1976, clubId: 'bayern', runnerUpId: 'saintetienne' },
  { year: 1977, clubId: 'liverpool', runnerUpId: 'gladbach' },
  { year: 1978, clubId: 'liverpool', runnerUpId: 'brugge' },
  { year: 1979, clubId: 'forest', runnerUpId: 'malmo' },
  { year: 1980, clubId: 'forest', runnerUpId: 'hamburg' },
  { year: 1981, clubId: 'liverpool', runnerUpId: 'real' },
  { year: 1982, clubId: 'villa', runnerUpId: 'bayern' },
  { year: 1983, clubId: 'hamburg', runnerUpId: 'juve' },
  { year: 1984, clubId: 'liverpool', runnerUpId: 'roma' },
  { year: 1985, clubId: 'juve', runnerUpId: 'liverpool' },
  { year: 1986, clubId: 'steaua', runnerUpId: 'barca' },
  { year: 1987, clubId: 'porto', runnerUpId: 'bayern' },
  { year: 1988, clubId: 'psv', runnerUpId: 'benfica' },
  { year: 1989, clubId: 'milan', runnerUpId: 'steaua' },
  { year: 1990, clubId: 'milan', runnerUpId: 'benfica' },
  { year: 1991, clubId: 'redstar', runnerUpId: 'marseille' },
  { year: 1992, clubId: 'barca', runnerUpId: 'sampdoria' },
  { year: 1993, clubId: 'marseille', runnerUpId: 'milan' },
  { year: 1994, clubId: 'milan', runnerUpId: 'barca' },
  { year: 1995, clubId: 'ajax', runnerUpId: 'milan' },
  { year: 1996, clubId: 'juve', runnerUpId: 'ajax' },
  { year: 1997, clubId: 'dortmund', runnerUpId: 'juve' },
  { year: 1998, clubId: 'real', runnerUpId: 'juve' },
  { year: 1999, clubId: 'manutd', runnerUpId: 'bayern' },
  { year: 2000, clubId: 'real', runnerUpId: 'valencia' },
  { year: 2001, clubId: 'bayern', runnerUpId: 'valencia' },
  { year: 2002, clubId: 'real', runnerUpId: 'leverkusen' },
  { year: 2003, clubId: 'milan', runnerUpId: 'juve' },
  { year: 2004, clubId: 'porto', runnerUpId: 'monaco' },
  { year: 2005, clubId: 'liverpool', runnerUpId: 'milan' },
  { year: 2006, clubId: 'barca', runnerUpId: 'arsenal' },
  { year: 2007, clubId: 'milan', runnerUpId: 'liverpool' },
  { year: 2008, clubId: 'manutd', runnerUpId: 'chelsea' },
  { year: 2009, clubId: 'barca', runnerUpId: 'manutd' },
  { year: 2010, clubId: 'inter', runnerUpId: 'bayern' },
  { year: 2011, clubId: 'barca', runnerUpId: 'manutd' },
  { year: 2012, clubId: 'chelsea', runnerUpId: 'bayern' },
  { year: 2013, clubId: 'bayern', runnerUpId: 'dortmund' },
  { year: 2014, clubId: 'real', runnerUpId: 'atletico' },
  { year: 2015, clubId: 'barca', runnerUpId: 'juve' },
  { year: 2016, clubId: 'real', runnerUpId: 'atletico' },
  { year: 2017, clubId: 'real', runnerUpId: 'juve' },
  { year: 2018, clubId: 'real', runnerUpId: 'liverpool' },
  { year: 2019, clubId: 'liverpool', runnerUpId: 'tottenham' },
  { year: 2020, clubId: 'bayern', runnerUpId: 'psg' },
  { year: 2021, clubId: 'chelsea', runnerUpId: 'mancity' },
  { year: 2022, clubId: 'real', runnerUpId: 'liverpool' },
  { year: 2023, clubId: 'mancity', runnerUpId: 'inter' },
  { year: 2024, clubId: 'real', runnerUpId: 'dortmund' },
  { year: 2025, clubId: 'psg', runnerUpId: 'inter' },
]

export const UCL_EASY_FROM = 2000

export function uclAsCup(item: UclWinner): WorldCupWinner {
  return { year: item.year, winnerId: item.clubId, runnerUpId: item.runnerUpId }
}

export function uclClubCountries() {
  return [...new Set(UCL_WINNERS.flatMap((item) => [item.clubId, item.runnerUpId]))].map(footballTeamCountry)
}

export function uclWinYearsFor(clubId: string): number[] {
  return UCL_WINNERS.filter((item) => item.clubId === clubId).map((item) => item.year)
}

export function uclRelatedClubIds(year: number): string[] {
  const index = UCL_WINNERS.findIndex((item) => item.year === year)
  if (index < 0) return []
  const current = UCL_WINNERS[index]
  const nation = footballClub(current.clubId)?.nation
  const sameNation = UCL_WINNERS.map((item) => item.clubId).filter(
    (id) => id !== current.clubId && footballClub(id)?.nation === nation,
  )
  return uniqueIds(
    [current.runnerUpId, UCL_WINNERS[index - 1]?.clubId, UCL_WINNERS[index + 1]?.clubId, sameNation[0], sameNation[1]],
    current.clubId,
  )
}

export function uclRelatedFinalistIds(year: number): string[] {
  const index = UCL_WINNERS.findIndex((item) => item.year === year)
  if (index < 0) return []
  const current = UCL_WINNERS[index]
  return uniqueIds(
    [current.clubId, UCL_WINNERS[index - 1]?.runnerUpId, UCL_WINNERS[index + 1]?.runnerUpId, UCL_WINNERS[index - 1]?.clubId],
    current.runnerUpId,
  )
}
