export type LeaderKind = 'us' | 'pope' | 'rus' | 'uk'
export type LeaderTier = 'easy' | 'medium' | 'hard'

const US_EASY = new Set([
  'washington',
  'jefferson',
  'jackson',
  'lincoln',
  'troosevelt',
  'wilson',
  'fdr',
  'truman',
  'eisenhower',
  'kennedy',
  'nixon',
  'reagan',
  'clinton',
  'gwbush',
  'obama',
  'trump',
  'biden',
])

const US_MEDIUM = new Set([
  'jadams',
  'madison',
  'monroe',
  'jqadams',
  'vanburen',
  'polk',
  'grant',
  'cleveland',
  'mckinley',
  'taft',
  'hoover',
  'lbj',
  'carter',
  'ghwbush',
  'coolidge',
  'ford',
])

const POPE_EASY = new Set([1, 45, 64, 176, 216, 217, 255, 256, 260, 261, 262, 264, 265, 266, 267])
const POPE_MEDIUM = new Set([33, 96, 105, 157, 159, 214, 220, 225, 226, 235, 251, 257, 258, 259, 263])

const RUS_EASY = new Set([
  'askold',
  'rurik',
  'vladimir',
  'yaroslav',
  'nevsky',
  'ivan3',
  'ivan4',
  'peter1',
  'catherine2',
  'alexander2',
  'nicholas2',
  'lenin',
  'stalin',
  'khrushchev',
  'gorbachev',
])

const RUS_MEDIUM = new Set([
  'oleg',
  'olga',
  'sviatoslav',
  'monomakh',
  'yuri',
  'dmitry',
  'ivan1',
  'godunov',
  'mikhail',
  'elizabeth',
  'alexander1',
  'nicholas1',
  'alexander3',
  'kerensky',
  'brezhnev',
])

const UK_EASY = new Set([
  'william1',
  'richard1',
  'john',
  'henry2',
  'henry5',
  'henry8',
  'richard3',
  'elizabeth1',
  'charles1',
  'george3',
  'victoria',
  'elizabeth2',
  'charles3',
])

const UK_MEDIUM = new Set([
  'stephen',
  'henry3',
  'edward1',
  'edward3',
  'henry4',
  'henry6',
  'edward4',
  'henry7',
  'edward6',
  'jane',
  'mary1',
  'james1',
  'charles2',
  'james2',
  'william3',
  'mary2',
  'anne',
  'george4',
  'william4',
  'edward7',
  'george5',
  'edward8',
  'george6',
])

export function leaderFame(kind: LeaderKind, personId: string, n: number, from: number): LeaderTier {
  if (kind === 'us') {
    if (US_EASY.has(personId)) return 'easy'
    if (US_MEDIUM.has(personId)) return 'medium'
    return 'hard'
  }
  if (kind === 'pope') {
    if (POPE_EASY.has(n)) return 'easy'
    if (POPE_MEDIUM.has(n)) return 'medium'
    if (from < 1500) return 'hard'
    return 'hard'
  }
  if (kind === 'uk') {
    if (UK_EASY.has(personId)) return 'easy'
    if (UK_MEDIUM.has(personId)) return 'medium'
    return 'hard'
  }
  if (RUS_EASY.has(personId)) return 'easy'
  if (RUS_MEDIUM.has(personId)) return 'medium'
  if (from < 1500) return 'hard'
  return 'hard'
}

export function leaderShowsNumber(kind: LeaderKind): boolean {
  return kind === 'us' || kind === 'pope'
}
