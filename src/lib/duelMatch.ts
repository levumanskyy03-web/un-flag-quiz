import type { Lang } from '../i18n/lang'
import { STRINGS, modeLabel } from '../i18n/strings'
import {
  EASY_FOOTBALL_MIX_MODES,
  EASY_MIX_MODES,
  FLAGS_MIX_MODES,
  MAP_MIX_MODES,
  MATCH_FOOTBALL_MODES,
  MATCH_GEO_MODES,
  MATCH_LEADERS_MODES,
  MATH_MATCH_MIX,
  ASTRO_MATCH_MIX,
  MATCH_MATH_MODES,
  MATCH_ASTRO_MODES,
  THEME_MATCH_MIX,
  MATCH_THEME_MODES,
  THEME_WORLDS,
  PHOTO_LEADERS_MATCH_MIX,
  PLAYER_FOOTBALL_MATCH_MIX,
  US_LEADERS_MATCH_MIX,
  sameModes,
  worldOfMode,
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
]

export const FOOTBALL_MATCH_MIXES: MatchQueue[] = [
  { id: 'fb-easy', modes: [...EASY_FOOTBALL_MIX_MODES] },
  { id: 'fb-players', modes: [...PLAYER_FOOTBALL_MATCH_MIX] },
]

export const LEADERS_MATCH_MIXES: MatchQueue[] = [
  { id: 'ld-us', modes: [...US_LEADERS_MATCH_MIX] },
  { id: 'ld-photos', modes: [...PHOTO_LEADERS_MATCH_MIX] },
]

export const GEO_MATCH_SINGLES: MatchQueue[] = MATCH_GEO_MODES.map((mode) => ({
  id: `geo-${mode}`,
  modes: [mode],
}))

export const FOOTBALL_MATCH_SINGLES: MatchQueue[] = MATCH_FOOTBALL_MODES.map((mode) => ({
  id: `fb-${mode}`,
  modes: [mode],
}))

export const LEADERS_MATCH_SINGLES: MatchQueue[] = MATCH_LEADERS_MODES.map((mode) => ({
  id: `ld-${mode}`,
  modes: [mode],
}))

export const MATH_MATCH_MIXES: MatchQueue[] = [
  { id: 'math-easy', modes: [...MATH_MATCH_MIX] },
]

export const MATH_MATCH_SINGLES: MatchQueue[] = MATCH_MATH_MODES.map((mode) => ({
  id: `math-${mode}`,
  modes: [mode],
}))

export const ASTRO_MATCH_MIXES: MatchQueue[] = [
  { id: 'astro-easy', modes: [...ASTRO_MATCH_MIX] },
]

export const ASTRO_MATCH_SINGLES: MatchQueue[] = MATCH_ASTRO_MODES.map((mode) => ({
  id: `astro-${mode}`,
  modes: [mode],
}))

export const THEME_MATCH_MIXES: MatchQueue[] = THEME_WORLDS.map((world) => ({
  id: `${world}-easy`,
  modes: [...THEME_MATCH_MIX[world]],
}))

export const THEME_MATCH_SINGLES: MatchQueue[] = THEME_WORLDS.flatMap((world) =>
  MATCH_THEME_MODES[world].map((mode) => ({
    id: `${world}-${mode}`,
    modes: [mode],
  })),
)

export function matchQueues(): { mixes: MatchQueue[]; singles: MatchQueue[] } {
  return {
    mixes: [...GEO_MATCH_MIXES, ...FOOTBALL_MATCH_MIXES, ...LEADERS_MATCH_MIXES, ...MATH_MATCH_MIXES, ...ASTRO_MATCH_MIXES, ...THEME_MATCH_MIXES],
    singles: [...GEO_MATCH_SINGLES, ...FOOTBALL_MATCH_SINGLES, ...LEADERS_MATCH_SINGLES, ...MATH_MATCH_SINGLES, ...ASTRO_MATCH_SINGLES, ...THEME_MATCH_SINGLES],
  }
}

function queueWorldLabel(queue: MatchQueue, lang: Lang): string {
  const t = STRINGS[lang]
  const mode = queue.modes[0]
  if (!mode) return t.geography
  const world = worldOfMode(mode)
  if (world === 'football') return t.football
  if (world === 'leaders') return t.leaders
  if (world === 'math') return t.math
  if (world === 'astronomy') return t.astronomy
  if (world === 'biology') return t.biology
  if (world === 'olympics') return t.olympics
  if (world === 'cs') return t.cs
  if (world === 'food') return t.food
  return t.geography
}

export function matchQueueTitle(queue: MatchQueue, lang: Lang): string {
  const t = STRINGS[lang]
  const world = queueWorldLabel(queue, lang)
  if (sameModes(queue.modes, EASY_MIX_MODES) || sameModes(queue.modes, EASY_FOOTBALL_MIX_MODES) || sameModes(queue.modes, MATH_MATCH_MIX) || sameModes(queue.modes, ASTRO_MATCH_MIX) || THEME_WORLDS.some((world) => sameModes(queue.modes, THEME_MATCH_MIX[world]))) {
    return `${world} · ${t.easyMix}`
  }
  if (sameModes(queue.modes, FLAGS_MIX_MODES)) return `${world} · ${t.familyFlags}`
  if (sameModes(queue.modes, MAP_MIX_MODES)) return `${world} · ${t.familyMap}`
  if (sameModes(queue.modes, PLAYER_FOOTBALL_MATCH_MIX)) return `${world} · ${t.footballGroupPlayers}`
  if (sameModes(queue.modes, US_LEADERS_MATCH_MIX)) return `${world} · ${t.usPresidents}`
  if (sameModes(queue.modes, PHOTO_LEADERS_MATCH_MIX)) return `${world} · ${t.leaderAskPhoto}`
  if (queue.modes.length === 1) return `${world} · ${modeLabel(queue.modes[0], lang)}`
  return `${world} · ${queue.modes.map((mode) => modeLabel(mode, lang)).join(' · ')}`
}

export function matchQueueNote(queue: MatchQueue, lang: Lang): string {
  const t = STRINGS[lang]
  if (sameModes(queue.modes, EASY_MIX_MODES)) return t.easyMixNote
  if (sameModes(queue.modes, EASY_FOOTBALL_MIX_MODES)) return t.footballEasyMixNote
  if (sameModes(queue.modes, MATH_MATCH_MIX)) return t.mathEasyMixNote
  if (sameModes(queue.modes, ASTRO_MATCH_MIX)) return t.astroEasyMixNote
  if (THEME_WORLDS.some((world) => sameModes(queue.modes, THEME_MATCH_MIX[world]))) {
    const world = worldOfMode(queue.modes[0])
    if (world === 'biology') return t.bioEasyMixNote
    if (world === 'olympics') return t.olyEasyMixNote
    if (world === 'cs') return t.csEasyMixNote
    if (world === 'food') return t.foodEasyMixNote
  }
  if (queue.modes.length === 1) return ''
  return queue.modes.map((mode) => modeLabel(mode, lang)).join(' · ')
}

export function initialMatchModes(initialMode?: QuizMode): QuizMode[] {
  const { mixes, singles } = matchQueues()
  if (initialMode) {
    const single = singles.find((queue) => queue.modes[0] === initialMode)
    if (single) return [...single.modes]
  }
  return [...mixes[0].modes]
}
