import type { Lang } from '../i18n/lang'
import { STRINGS, modeLabel } from '../i18n/strings'
import {
  CLUB_FOOTBALL_MATCH_MIX,
  CODES_MODES,
  EASY_FOOTBALL_MIX_MODES,
  EASY_MIX_MODES,
  FLAGS_MIX_MODES,
  MAP_MIX_MODES,
  MATCH_FOOTBALL_MODES,
  MATCH_GEO_MODES,
  PLAYER_FOOTBALL_MATCH_MIX,
  WC_FOOTBALL_MATCH_MIX,
  sameModes,
  type QuizDifficulty,
  type QuizMode,
} from './quiz'

export const MATCH_ROUND_SIZE = 10
export const MATCH_DIFFICULTY: QuizDifficulty = 'hard'

export interface MatchQueue {
  id: string
  modes: QuizMode[]
}

export const GEO_MATCH_MIXES: MatchQueue[] = [
  { id: 'geo-easy', modes: [...EASY_MIX_MODES] },
  { id: 'geo-flags', modes: [...FLAGS_MIX_MODES] },
  { id: 'geo-map', modes: [...MAP_MIX_MODES] },
  { id: 'geo-codes', modes: [...CODES_MODES] },
]

export const GEO_MATCH_SINGLES: MatchQueue[] = MATCH_GEO_MODES.map((mode) => ({
  id: `geo-${mode}`,
  modes: [mode],
}))

export const FOOTBALL_MATCH_MIXES: MatchQueue[] = [
  { id: 'fb-easy', modes: [...EASY_FOOTBALL_MIX_MODES] },
  { id: 'fb-wc', modes: [...WC_FOOTBALL_MATCH_MIX] },
  { id: 'fb-players', modes: [...PLAYER_FOOTBALL_MATCH_MIX] },
  { id: 'fb-clubs', modes: [...CLUB_FOOTBALL_MATCH_MIX] },
]

export const FOOTBALL_MATCH_SINGLES: MatchQueue[] = MATCH_FOOTBALL_MODES.map((mode) => ({
  id: `fb-${mode}`,
  modes: [mode],
}))

export function matchQueues(football: boolean): { mixes: MatchQueue[]; singles: MatchQueue[] } {
  return football
    ? { mixes: FOOTBALL_MATCH_MIXES, singles: FOOTBALL_MATCH_SINGLES }
    : { mixes: GEO_MATCH_MIXES, singles: GEO_MATCH_SINGLES }
}

export function matchQueueTitle(queue: MatchQueue, lang: Lang): string {
  const t = STRINGS[lang]
  if (sameModes(queue.modes, EASY_MIX_MODES) || sameModes(queue.modes, EASY_FOOTBALL_MIX_MODES)) return t.easyMix
  if (sameModes(queue.modes, FLAGS_MIX_MODES)) return t.familyFlags
  if (sameModes(queue.modes, MAP_MIX_MODES)) return t.familyMap
  if (sameModes(queue.modes, CODES_MODES)) return t.codes
  if (sameModes(queue.modes, WC_FOOTBALL_MATCH_MIX)) return t.footballGroupWc
  if (sameModes(queue.modes, PLAYER_FOOTBALL_MATCH_MIX)) return t.footballGroupPlayers
  if (sameModes(queue.modes, CLUB_FOOTBALL_MATCH_MIX)) return t.footballGroupClubs
  return queue.modes.map((mode) => modeLabel(mode, lang)).join(' · ')
}

export function matchQueueNote(queue: MatchQueue, lang: Lang): string {
  const t = STRINGS[lang]
  if (sameModes(queue.modes, EASY_MIX_MODES)) return t.easyMixNote
  if (sameModes(queue.modes, EASY_FOOTBALL_MIX_MODES)) return t.footballEasyMixNote
  if (queue.modes.length === 1) return ''
  return queue.modes.map((mode) => modeLabel(mode, lang)).join(' · ')
}

export function initialMatchModes(initialMode: QuizMode, football: boolean): QuizMode[] {
  const { mixes, singles } = matchQueues(football)
  const single = singles.find((queue) => queue.modes[0] === initialMode)
  if (single) return [...single.modes]
  return [...mixes[0].modes]
}
