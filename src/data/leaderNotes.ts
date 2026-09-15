import type { LeaderTerm } from './leaders'

export type LeaderNoteId = 'deJure' | 'parallel' | 'disputed' | 'abdicated' | 'vpDeath' | 'vpResign'

const BY_PERSON: Record<string, LeaderNoteId> = {
  'rus:malenkov': 'deJure',
  'rus:ivan6': 'deJure',
  'rus:fyodor1': 'deJure',
  'rus:askold': 'parallel',
  'rus:rurik': 'parallel',
  'rus:olga': 'parallel',
  'rus:sviatoslav': 'parallel',
  'rus:yuri': 'parallel',
  'rus:andrei': 'parallel',
  'rus:sophia': 'parallel',
  'rus:false-dmitry': 'disputed',
  'rus:shuisky': 'disputed',
  'uk:stephen': 'disputed',
  'uk:edward5': 'disputed',
  'uk:jane': 'disputed',
  'uk:james2': 'disputed',
  'uk:henry6': 'parallel',
  'uk:edward4': 'parallel',
  'uk:mary2': 'parallel',
  'uk:william3': 'parallel',
  'uk:edward8': 'abdicated',
  'us:tyler': 'vpDeath',
  'us:fillmore': 'vpDeath',
  'us:ajohnson': 'vpDeath',
  'us:arthur': 'vpDeath',
  'us:troosevelt': 'vpDeath',
  'us:coolidge': 'vpDeath',
  'us:truman': 'vpDeath',
  'us:lbj': 'vpDeath',
  'us:ford': 'vpResign',
}

const POPE_N: Record<number, LeaderNoteId> = {
  3: 'disputed',
  29: 'disputed',
  36: 'disputed',
  42: 'parallel',
  51: 'parallel',
  58: 'disputed',
  70: 'disputed',
  74: 'parallel',
  75: 'parallel',
  111: 'disputed',
  113: 'disputed',
  118: 'disputed',
  119: 'disputed',
  122: 'disputed',
  125: 'disputed',
  130: 'disputed',
  131: 'parallel',
  132: 'parallel',
  145: 'disputed',
  146: 'disputed',
  147: 'disputed',
  148: 'disputed',
  150: 'disputed',
  164: 'parallel',
  170: 'parallel',
  202: 'parallel',
  203: 'parallel',
  204: 'parallel',
  205: 'parallel',
}

export type LeaderWhyId =
  | 'rusMalenkov'
  | 'rusIvan6'
  | 'rusFyodor1'
  | 'rusAskoldRurik'
  | 'rusOlgaSviatoslav'
  | 'rusYuriAndrei'
  | 'rusSophia'
  | 'rusFalseDmitry'
  | 'rusShuisky'
  | 'ukStephen'
  | 'ukEdward5'
  | 'ukJane'
  | 'ukJames2'
  | 'ukRoses'
  | 'ukJoint'
  | 'ukEdward8'
  | 'usVpDeath'
  | 'usVpResign'
  | 'popeAnacletus'
  | 'popeMarcellinus'
  | 'popeLiberius'
  | 'popeDoubleElection'
  | 'popeSilverius'
  | 'popeHonorius'
  | 'popeMartinEugene'
  | 'popeFormosus'
  | 'popeStephen6'
  | 'popeLeo5'
  | 'popeSaeculum'
  | 'popeLeoBenedict'
  | 'popeBenedict9'
  | 'popeInnocent2'
  | 'popeAlexander3'
  | 'popeSchism'

const WHY_PERSON: Record<string, LeaderWhyId> = {
  'rus:malenkov': 'rusMalenkov',
  'rus:ivan6': 'rusIvan6',
  'rus:fyodor1': 'rusFyodor1',
  'rus:askold': 'rusAskoldRurik',
  'rus:rurik': 'rusAskoldRurik',
  'rus:olga': 'rusOlgaSviatoslav',
  'rus:sviatoslav': 'rusOlgaSviatoslav',
  'rus:yuri': 'rusYuriAndrei',
  'rus:andrei': 'rusYuriAndrei',
  'rus:sophia': 'rusSophia',
  'rus:false-dmitry': 'rusFalseDmitry',
  'rus:shuisky': 'rusShuisky',
  'uk:stephen': 'ukStephen',
  'uk:edward5': 'ukEdward5',
  'uk:jane': 'ukJane',
  'uk:james2': 'ukJames2',
  'uk:henry6': 'ukRoses',
  'uk:edward4': 'ukRoses',
  'uk:mary2': 'ukJoint',
  'uk:william3': 'ukJoint',
  'uk:edward8': 'ukEdward8',
  'us:tyler': 'usVpDeath',
  'us:fillmore': 'usVpDeath',
  'us:ajohnson': 'usVpDeath',
  'us:arthur': 'usVpDeath',
  'us:troosevelt': 'usVpDeath',
  'us:coolidge': 'usVpDeath',
  'us:truman': 'usVpDeath',
  'us:lbj': 'usVpDeath',
  'us:ford': 'usVpResign',
}

const WHY_POPE_N: Record<number, LeaderWhyId> = {
  3: 'popeAnacletus',
  29: 'popeMarcellinus',
  36: 'popeLiberius',
  42: 'popeDoubleElection',
  51: 'popeDoubleElection',
  58: 'popeSilverius',
  70: 'popeHonorius',
  74: 'popeMartinEugene',
  75: 'popeMartinEugene',
  111: 'popeFormosus',
  113: 'popeStephen6',
  118: 'popeLeo5',
  119: 'popeSaeculum',
  122: 'popeSaeculum',
  125: 'popeSaeculum',
  130: 'popeSaeculum',
  131: 'popeLeoBenedict',
  132: 'popeLeoBenedict',
  145: 'popeBenedict9',
  146: 'popeBenedict9',
  147: 'popeBenedict9',
  148: 'popeBenedict9',
  150: 'popeBenedict9',
  164: 'popeInnocent2',
  170: 'popeAlexander3',
  202: 'popeSchism',
  203: 'popeSchism',
  204: 'popeSchism',
  205: 'popeSchism',
}

export function leaderNoteOf(term: LeaderTerm): LeaderNoteId | null {
  if (term.kind === 'pope') {
    const byN = POPE_N[term.n]
    if (byN) return byN
  }
  return BY_PERSON[`${term.kind}:${term.personId}`] ?? null
}

export function leaderNoteWhyId(term: LeaderTerm): LeaderWhyId | null {
  if (term.kind === 'pope') {
    const byN = WHY_POPE_N[term.n]
    if (byN) return byN
  }
  return WHY_PERSON[`${term.kind}:${term.personId}`] ?? null
}
