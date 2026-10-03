import { type WorldCupHost, type WorldCupWinner } from './worldCup'

export const ASIAN_CUP_WINNERS: WorldCupWinner[] = [
  { year: 1956, winnerId: 'kr', runnerUpId: 'il' },
  { year: 1960, winnerId: 'kr', runnerUpId: 'il' },
  { year: 1964, winnerId: 'il', runnerUpId: 'in' },
  { year: 1968, winnerId: 'ir', runnerUpId: 'mm' },
  { year: 1972, winnerId: 'ir', runnerUpId: 'kr' },
  { year: 1976, winnerId: 'ir', runnerUpId: 'kw' },
  { year: 1980, winnerId: 'kw', runnerUpId: 'kr' },
  { year: 1984, winnerId: 'sa', runnerUpId: 'cn' },
  { year: 1988, winnerId: 'sa', runnerUpId: 'kr' },
  { year: 1992, winnerId: 'jp', runnerUpId: 'sa' },
  { year: 1996, winnerId: 'sa', runnerUpId: 'ae' },
  { year: 2000, winnerId: 'jp', runnerUpId: 'sa' },
  { year: 2004, winnerId: 'jp', runnerUpId: 'cn' },
  { year: 2007, winnerId: 'iq', runnerUpId: 'sa' },
  { year: 2011, winnerId: 'jp', runnerUpId: 'au' },
  { year: 2015, winnerId: 'au', runnerUpId: 'kr' },
  { year: 2019, winnerId: 'qa', runnerUpId: 'jp' },
  { year: 2023, winnerId: 'qa', runnerUpId: 'jo' },
]

export const ASIAN_CUP_EASY_FROM = 2004
export const GOLD_CUP_EASY_FROM = 2009
export const NATIONS_LEAGUE_EASY_FROM = 2019
export const LIBERTADORES_EASY_FROM = 2008
export const EUROPA_EASY_FROM = 2006
export const LEAGUE_EASY_FROM = 2010
export const BALLON_DOR_EASY_FROM = 2008

export const GOLD_CUP_WINNERS: WorldCupWinner[] = [
  { year: 1991, winnerId: 'us', runnerUpId: 'hn' },
  { year: 1993, winnerId: 'mx', runnerUpId: 'us' },
  { year: 1996, winnerId: 'mx', runnerUpId: 'br' },
  { year: 1998, winnerId: 'mx', runnerUpId: 'us' },
  { year: 2000, winnerId: 'ca', runnerUpId: 'co' },
  { year: 2002, winnerId: 'us', runnerUpId: 'cr' },
  { year: 2003, winnerId: 'mx', runnerUpId: 'br' },
  { year: 2005, winnerId: 'us', runnerUpId: 'pa' },
  { year: 2007, winnerId: 'us', runnerUpId: 'mx' },
  { year: 2009, winnerId: 'mx', runnerUpId: 'us' },
  { year: 2011, winnerId: 'mx', runnerUpId: 'us' },
  { year: 2013, winnerId: 'us', runnerUpId: 'pa' },
  { year: 2015, winnerId: 'mx', runnerUpId: 'jm' },
  { year: 2017, winnerId: 'us', runnerUpId: 'jm' },
  { year: 2019, winnerId: 'mx', runnerUpId: 'us' },
  { year: 2021, winnerId: 'us', runnerUpId: 'mx' },
  { year: 2023, winnerId: 'mx', runnerUpId: 'pa' },
  { year: 2025, winnerId: 'mx', runnerUpId: 'us' },
]

export const NATIONS_LEAGUE_WINNERS: WorldCupWinner[] = [
  { year: 2019, winnerId: 'pt', runnerUpId: 'nl' },
  { year: 2021, winnerId: 'fr', runnerUpId: 'es' },
  { year: 2023, winnerId: 'es', runnerUpId: 'hr' },
  { year: 2025, winnerId: 'pt', runnerUpId: 'es' },
]

/** Finals hosts. 1956 Asian Cup was in Hong Kong, which is not a quiz country. */
export const ASIAN_CUP_HOSTS: WorldCupHost[] = [
  { year: 1960, hostIds: ['kr'] },
  { year: 1964, hostIds: ['il'] },
  { year: 1968, hostIds: ['ir'] },
  { year: 1972, hostIds: ['th'] },
  { year: 1976, hostIds: ['ir'] },
  { year: 1980, hostIds: ['kw'] },
  { year: 1984, hostIds: ['sg'] },
  { year: 1988, hostIds: ['qa'] },
  { year: 1992, hostIds: ['jp'] },
  { year: 1996, hostIds: ['ae'] },
  { year: 2000, hostIds: ['lb'] },
  { year: 2004, hostIds: ['cn'] },
  { year: 2007, hostIds: ['id', 'my', 'th', 'vn'] },
  { year: 2011, hostIds: ['qa'] },
  { year: 2015, hostIds: ['au'] },
  { year: 2019, hostIds: ['ae'] },
  { year: 2023, hostIds: ['qa'] },
]

export const GOLD_CUP_HOSTS: WorldCupHost[] = [
  { year: 1991, hostIds: ['us'] },
  { year: 1993, hostIds: ['us', 'mx'] },
  { year: 1996, hostIds: ['us'] },
  { year: 1998, hostIds: ['us'] },
  { year: 2000, hostIds: ['us'] },
  { year: 2002, hostIds: ['us'] },
  { year: 2003, hostIds: ['us', 'mx'] },
  { year: 2005, hostIds: ['us'] },
  { year: 2007, hostIds: ['us'] },
  { year: 2009, hostIds: ['us'] },
  { year: 2011, hostIds: ['us'] },
  { year: 2013, hostIds: ['us'] },
  { year: 2015, hostIds: ['us', 'ca'] },
  { year: 2017, hostIds: ['us'] },
  { year: 2019, hostIds: ['us', 'cr', 'jm'] },
  { year: 2021, hostIds: ['us'] },
  { year: 2023, hostIds: ['us', 'ca'] },
  { year: 2025, hostIds: ['us', 'ca'] },
]

export const NATIONS_LEAGUE_HOSTS: WorldCupHost[] = [
  { year: 2019, hostIds: ['pt'] },
  { year: 2021, hostIds: ['it'] },
  { year: 2023, hostIds: ['nl'] },
  { year: 2025, hostIds: ['de'] },
]
