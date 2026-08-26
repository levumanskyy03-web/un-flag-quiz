import { COUNTRIES, type Country } from './countries'

export interface WorldCupWinner {
  year: number
  winnerId: string
  runnerUpId: string
}

export interface WorldCupHost {
  year: number
  hostIds: string[]
}

const TEAM_NAMES: Record<string, { nameEn: string; nameRu: string }> = {
  eng: { nameEn: 'England', nameRu: 'Англия' },
  tch: { nameEn: 'Czechoslovakia', nameRu: 'Чехословакия' },
  su: { nameEn: 'Soviet Union', nameRu: 'СССР' },
  yu: { nameEn: 'Yugoslavia', nameRu: 'Югославия' },
}

export const WORLD_CUP_WINNERS: WorldCupWinner[] = [
  { year: 1930, winnerId: 'uy', runnerUpId: 'ar' },
  { year: 1934, winnerId: 'it', runnerUpId: 'tch' },
  { year: 1938, winnerId: 'it', runnerUpId: 'hu' },
  { year: 1950, winnerId: 'uy', runnerUpId: 'br' },
  { year: 1954, winnerId: 'de', runnerUpId: 'hu' },
  { year: 1958, winnerId: 'br', runnerUpId: 'se' },
  { year: 1962, winnerId: 'br', runnerUpId: 'tch' },
  { year: 1966, winnerId: 'eng', runnerUpId: 'de' },
  { year: 1970, winnerId: 'br', runnerUpId: 'it' },
  { year: 1974, winnerId: 'de', runnerUpId: 'nl' },
  { year: 1978, winnerId: 'ar', runnerUpId: 'nl' },
  { year: 1982, winnerId: 'it', runnerUpId: 'de' },
  { year: 1986, winnerId: 'ar', runnerUpId: 'de' },
  { year: 1990, winnerId: 'de', runnerUpId: 'ar' },
  { year: 1994, winnerId: 'br', runnerUpId: 'it' },
  { year: 1998, winnerId: 'fr', runnerUpId: 'br' },
  { year: 2002, winnerId: 'br', runnerUpId: 'de' },
  { year: 2006, winnerId: 'it', runnerUpId: 'fr' },
  { year: 2010, winnerId: 'es', runnerUpId: 'nl' },
  { year: 2014, winnerId: 'de', runnerUpId: 'ar' },
  { year: 2018, winnerId: 'fr', runnerUpId: 'hr' },
  { year: 2022, winnerId: 'ar', runnerUpId: 'fr' },
  { year: 2026, winnerId: 'es', runnerUpId: 'ar' },
]

export const WORLD_CUP_HOSTS: WorldCupHost[] = [
  { year: 1930, hostIds: ['uy'] },
  { year: 1934, hostIds: ['it'] },
  { year: 1938, hostIds: ['fr'] },
  { year: 1950, hostIds: ['br'] },
  { year: 1954, hostIds: ['ch'] },
  { year: 1958, hostIds: ['se'] },
  { year: 1962, hostIds: ['cl'] },
  { year: 1966, hostIds: ['eng'] },
  { year: 1970, hostIds: ['mx'] },
  { year: 1974, hostIds: ['de'] },
  { year: 1978, hostIds: ['ar'] },
  { year: 1982, hostIds: ['es'] },
  { year: 1986, hostIds: ['mx'] },
  { year: 1990, hostIds: ['it'] },
  { year: 1994, hostIds: ['us'] },
  { year: 1998, hostIds: ['fr'] },
  { year: 2002, hostIds: ['jp', 'kr'] },
  { year: 2006, hostIds: ['de'] },
  { year: 2010, hostIds: ['za'] },
  { year: 2014, hostIds: ['br'] },
  { year: 2018, hostIds: ['ru'] },
  { year: 2022, hostIds: ['qa'] },
  { year: 2026, hostIds: ['ca', 'mx', 'us'] },
]

export const WC_CHAMPION_IDS = [...new Set(WORLD_CUP_WINNERS.map((item) => item.winnerId))]
export const WC_FINALIST_IDS = [...new Set(WORLD_CUP_WINNERS.map((item) => item.runnerUpId))]

export function footballIsos(iso: string): string[] {
  return iso.split('+').filter(Boolean)
}

export function combinedTeamId(ids: readonly string[]): string {
  return [...new Set(ids)].sort().join('+')
}

export function wcHostAnswerId(hostIds: readonly string[]): string {
  return hostIds.length === 1 ? hostIds[0] : combinedTeamId(hostIds)
}

export function footballTeamCountry(id: string): Country {
  const named = TEAM_NAMES[id]
  if (named) {
    return { iso: id, nameEn: named.nameEn, nameRu: named.nameRu, region: 'europe', difficulty: 'easy' }
  }
  const country = COUNTRIES.find((item) => item.iso === id)
  if (!country) {
    return { iso: id, nameEn: id, nameRu: id, region: 'europe', difficulty: 'easy' }
  }
  return country
}

export function wcChampionCountries(): Country[] {
  return WC_CHAMPION_IDS.map(footballTeamCountry)
}

export function wcFinalistCountries(): Country[] {
  return [...new Set([...WC_CHAMPION_IDS, ...WC_FINALIST_IDS])].map(footballTeamCountry)
}

export function wcHostCountries(): Country[] {
  const ids = new Set<string>()
  for (const cup of WORLD_CUP_HOSTS) {
    ids.add(wcHostAnswerId(cup.hostIds))
    for (const id of cup.hostIds) ids.add(id)
  }
  return [...ids].map(footballTeamCountry)
}

export function footballOptionClashes(optionId: string, answerId: string): boolean {
  if (optionId === answerId) return false
  const answer = new Set(footballIsos(answerId))
  return footballIsos(optionId).some((id) => answer.has(id))
}

export function wcWinYearsFor(winnerId: string): number[] {
  return WORLD_CUP_WINNERS.filter((item) => item.winnerId === winnerId).map((item) => item.year)
}

export function isNamedFootballTeam(iso: string): boolean {
  return iso in TEAM_NAMES
}

export function wcHostPool(difficulty: 'easy' | 'medium' | 'hard' | 'hardcore'): WorldCupHost[] {
  if (difficulty === 'easy') return WORLD_CUP_HOSTS.filter((item) => item.hostIds.length === 1)
  return WORLD_CUP_HOSTS
}

export function wcRelatedTeamIds(year: number): string[] {
  const index = WORLD_CUP_WINNERS.findIndex((item) => item.year === year)
  if (index < 0) return []
  const current = WORLD_CUP_WINNERS[index]
  return uniqueIds([
    WORLD_CUP_WINNERS[index - 1]?.winnerId,
    WORLD_CUP_WINNERS[index + 1]?.winnerId,
    current.runnerUpId,
  ], current.winnerId)
}

export function wcFinalistRelatedIds(year: number): string[] {
  const index = WORLD_CUP_WINNERS.findIndex((item) => item.year === year)
  if (index < 0) return []
  const current = WORLD_CUP_WINNERS[index]
  return uniqueIds([
    current.winnerId,
    WORLD_CUP_WINNERS[index - 1]?.runnerUpId,
    WORLD_CUP_WINNERS[index + 1]?.runnerUpId,
  ], current.runnerUpId)
}

export function wcHostRelatedIds(year: number): string[] {
  const index = WORLD_CUP_HOSTS.findIndex((item) => item.year === year)
  if (index < 0) return []
  const current = WORLD_CUP_HOSTS[index]
  const answerId = wcHostAnswerId(current.hostIds)
  const prev = WORLD_CUP_HOSTS[index - 1]
  const next = WORLD_CUP_HOSTS[index + 1]
  return uniqueIds([
    prev ? wcHostAnswerId(prev.hostIds) : undefined,
    next ? wcHostAnswerId(next.hostIds) : undefined,
  ], answerId)
}

function uniqueIds(ids: Array<string | undefined>, exclude: string): string[] {
  const seen = new Set<string>([exclude])
  const next: string[] = []
  for (const id of ids) {
    if (!id || seen.has(id)) continue
    seen.add(id)
    next.push(id)
  }
  return next
}
