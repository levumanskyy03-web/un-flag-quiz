import type { Country } from './countries'
import type { LeaderKind, LeaderTier } from './leaderFame'
import { POPES } from './popes'
import { US_PRESIDENTS } from './usPresidents'
import { RUS_LEADERS } from './varangianLeaders'

export type { LeaderKind, LeaderTier } from './leaderFame'

export interface LeaderTerm {
  id: string
  personId: string
  kind: LeaderKind
  n: number
  from: number
  to: number | null
  en: string
  ru: string
  wiki: string
  tier: LeaderTier
}

export const ALL_LEADER_TERMS: LeaderTerm[] = [...US_PRESIDENTS, ...POPES, ...RUS_LEADERS]

const BY_ID = new Map(ALL_LEADER_TERMS.map((term) => [term.id, term]))

export function termById(id: string): LeaderTerm | undefined {
  return BY_ID.get(id)
}

export function yearsLabel(from: number, to: number | null, present: string) {
  return to === null ? `${from}–${present}` : `${from}–${to}`
}

export function leaderYearsIso(term: LeaderTerm): string {
  return `y:${term.from}-${term.to ?? 'now'}`
}

export function yearsCountry(term: LeaderTerm): Country {
  return {
    iso: leaderYearsIso(term),
    nameEn: yearsLabel(term.from, term.to, 'present'),
    nameRu: yearsLabel(term.from, term.to, 'н. в.'),
    region: 'americas',
    difficulty: 'easy',
  }
}

export function leaderCountry(term: LeaderTerm): Country {
  return {
    iso: term.id,
    nameEn: term.en,
    nameRu: term.ru,
    region: 'americas',
    difficulty: term.tier === 'easy' ? 'easy' : 'hard',
  }
}

export function uniquePersons(terms: LeaderTerm[]): LeaderTerm[] {
  const seen = new Set<string>()
  const next: LeaderTerm[] = []
  for (const term of terms) {
    if (seen.has(term.personId)) continue
    seen.add(term.personId)
    next.push(term)
  }
  return next
}

export function neighborsByNumber(terms: LeaderTerm[], term: LeaderTerm, take = 2): LeaderTerm[] {
  const same = terms.filter((item) => item.kind === term.kind && item.personId !== term.personId)
  return [...same].sort((a, b) => Math.abs(a.n - term.n) - Math.abs(b.n - term.n)).slice(0, take)
}

export function termsForKind(kind: LeaderKind): LeaderTerm[] {
  if (kind === 'us') return US_PRESIDENTS
  if (kind === 'pope') return POPES
  return RUS_LEADERS
}
