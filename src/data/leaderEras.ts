import { DYNASTY_LATE_FROM, isDynastyKind, type DynastyKind } from './dynastyLeaders'
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
  | `${DynastyKind}Early`
  | `${DynastyKind}Late`

const BY_KIND: Record<LeaderKind, readonly LeaderEraId[]> = {
  us: ['usEarly', 'us1800s', 'usModern'],
  pope: ['popeEarly', 'popeMedieval', 'popeModern'],
  rus: ['rusKiev', 'rusMoscow', 'rusEmpire', 'rusSoviet'],
  uk: ['ukMedieval', 'ukTudor', 'ukModern'],
  ott: ['ottEarly', 'ottLate'],
  jp: ['jpEarly', 'jpLate'],
  mc: ['mcEarly', 'mcLate'],
  bn: ['bnEarly', 'bnLate'],
  jo: ['joEarly', 'joLate'],
  ma: ['maEarly', 'maLate'],
  dk: ['dkEarly', 'dkLate'],
  nl: ['nlEarly', 'nlLate'],
  li: ['liEarly', 'liLate'],
  sz: ['szEarly', 'szLate'],
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
  if (term.kind === 'uk') {
    if (term.from < 1485) return 'ukMedieval'
    if (term.from < 1714) return 'ukTudor'
    return 'ukModern'
  }
  if (isDynastyKind(term.kind)) {
    return term.from < DYNASTY_LATE_FROM[term.kind] ? `${term.kind}Early` : `${term.kind}Late`
  }
  return 'ukModern'
}
