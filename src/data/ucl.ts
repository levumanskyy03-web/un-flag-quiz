import { footballClub } from './footballClubs'
import { footballTeamCountry, uniqueIds } from './worldCup'

export interface UclWinner {
  year: number
  clubId: string
}

export const UCL_WINNERS: UclWinner[] = [
  { year: 1956, clubId: 'real' },
  { year: 1957, clubId: 'real' },
  { year: 1958, clubId: 'real' },
  { year: 1959, clubId: 'real' },
  { year: 1960, clubId: 'real' },
  { year: 1961, clubId: 'benfica' },
  { year: 1962, clubId: 'benfica' },
  { year: 1963, clubId: 'milan' },
  { year: 1964, clubId: 'inter' },
  { year: 1965, clubId: 'inter' },
  { year: 1966, clubId: 'real' },
  { year: 1967, clubId: 'celtic' },
  { year: 1968, clubId: 'manutd' },
  { year: 1969, clubId: 'milan' },
  { year: 1970, clubId: 'feyenoord' },
  { year: 1971, clubId: 'ajax' },
  { year: 1972, clubId: 'ajax' },
  { year: 1973, clubId: 'ajax' },
  { year: 1974, clubId: 'bayern' },
  { year: 1975, clubId: 'bayern' },
  { year: 1976, clubId: 'bayern' },
  { year: 1977, clubId: 'liverpool' },
  { year: 1978, clubId: 'liverpool' },
  { year: 1979, clubId: 'forest' },
  { year: 1980, clubId: 'forest' },
  { year: 1981, clubId: 'liverpool' },
  { year: 1982, clubId: 'villa' },
  { year: 1983, clubId: 'hamburg' },
  { year: 1984, clubId: 'liverpool' },
  { year: 1985, clubId: 'juve' },
  { year: 1986, clubId: 'steaua' },
  { year: 1987, clubId: 'porto' },
  { year: 1988, clubId: 'psv' },
  { year: 1989, clubId: 'milan' },
  { year: 1990, clubId: 'milan' },
  { year: 1991, clubId: 'redstar' },
  { year: 1992, clubId: 'barca' },
  { year: 1993, clubId: 'marseille' },
  { year: 1994, clubId: 'milan' },
  { year: 1995, clubId: 'ajax' },
  { year: 1996, clubId: 'juve' },
  { year: 1997, clubId: 'dortmund' },
  { year: 1998, clubId: 'real' },
  { year: 1999, clubId: 'manutd' },
  { year: 2000, clubId: 'real' },
  { year: 2001, clubId: 'bayern' },
  { year: 2002, clubId: 'real' },
  { year: 2003, clubId: 'milan' },
  { year: 2004, clubId: 'porto' },
  { year: 2005, clubId: 'liverpool' },
  { year: 2006, clubId: 'barca' },
  { year: 2007, clubId: 'milan' },
  { year: 2008, clubId: 'manutd' },
  { year: 2009, clubId: 'barca' },
  { year: 2010, clubId: 'inter' },
  { year: 2011, clubId: 'barca' },
  { year: 2012, clubId: 'chelsea' },
  { year: 2013, clubId: 'bayern' },
  { year: 2014, clubId: 'real' },
  { year: 2015, clubId: 'barca' },
  { year: 2016, clubId: 'real' },
  { year: 2017, clubId: 'real' },
  { year: 2018, clubId: 'real' },
  { year: 2019, clubId: 'liverpool' },
  { year: 2020, clubId: 'bayern' },
  { year: 2021, clubId: 'chelsea' },
  { year: 2022, clubId: 'real' },
  { year: 2023, clubId: 'mancity' },
  { year: 2024, clubId: 'real' },
  { year: 2025, clubId: 'psg' },
]

export const UCL_EASY_FROM = 2000

export function uclClubCountries() {
  return [...new Set(UCL_WINNERS.map((item) => item.clubId))].map(footballTeamCountry)
}

export function uclWinYearsFor(clubId: string): number[] {
  return UCL_WINNERS.filter((item) => item.clubId === clubId).map((item) => item.year)
}

export function uclRelatedClubIds(year: number): string[] {
  const index = UCL_WINNERS.findIndex((item) => item.year === year)
  if (index < 0) return []
  const current = UCL_WINNERS[index]
  const nation = footballClub(current.clubId)?.nation
  const sameNation = UCL_WINNERS.map((item) => item.clubId).filter((id) => id !== current.clubId && footballClub(id)?.nation === nation)
  return uniqueIds(
    [UCL_WINNERS[index - 1]?.clubId, UCL_WINNERS[index + 1]?.clubId, sameNation[0], sameNation[1]],
    current.clubId,
  )
}
