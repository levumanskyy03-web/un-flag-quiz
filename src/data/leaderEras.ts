import type { LeaderKind, LeaderTerm } from './leaders'

export type LeaderEraId =
  | 'usEarly'
  | 'us1800s'
  | 'usModern'
  | 'popeEarly'
  | 'popeMedieval'
  | 'popeModern'
  | 'rusKiev'
  | 'rusMoscow'
  | 'rusEmpire'
  | 'rusSoviet'
  | 'ukMedieval'
  | 'ukTudor'
  | 'ukModern'

const BY_KIND: Record<LeaderKind, readonly LeaderEraId[]> = {
  us: ['usEarly', 'us1800s', 'usModern'],
  pope: ['popeEarly', 'popeMedieval', 'popeModern'],
  rus: ['rusKiev', 'rusMoscow', 'rusEmpire', 'rusSoviet'],
  uk: ['ukMedieval', 'ukTudor', 'ukModern'],
}

export function erasForKind(kind: LeaderKind): readonly LeaderEraId[] {
  return BY_KIND[kind]
}

export function leaderEraOf(term: LeaderTerm): LeaderEraId {
  if (term.kind === 'us') {
    if (term.from < 1861) return 'usEarly'
    if (term.from < 1933) return 'us1800s'
    return 'usModern'
  }
  if (term.kind === 'pope') {
    if (term.from < 600) return 'popeEarly'
    if (term.from < 1500) return 'popeMedieval'
    return 'popeModern'
  }
  if (term.kind === 'rus') {
    if (term.from < 1157) return 'rusKiev'
    if (term.from < 1682) return 'rusMoscow'
    if (term.from < 1917) return 'rusEmpire'
    return 'rusSoviet'
  }
  if (term.from < 1485) return 'ukMedieval'
  if (term.from < 1714) return 'ukTudor'
  return 'ukModern'
}
