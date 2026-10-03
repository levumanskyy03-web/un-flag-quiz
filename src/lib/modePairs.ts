import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import type { Strings } from '../i18n/strings'
import { RANKING_MODES } from '../data/rankings'
import {
  ASTRO_MODES,
  CODES_MODES,
  LEADERS_TOPICS,
  MATH_MODES,
  QUIZ_MODES,
  leadersAsksOf,
  leadersModeOf,
  themeModesOfWorld,
  type QuizMode,
  type ThemeWorld,
} from './quiz'
import { FOOTBALL_PLAY_FAMILIES, modesOfFootballFamily } from './modeFamilies'

export type ModeLink = {
  mode: QuizMode
  left: string
  right: string
  /** Нет стрелки в названии: левая сторона — семейство, правая — сам режим. */
  plain?: boolean
}

function englishLabel(mode: QuizMode): string | null {
  const raw = STRINGS.en[mode as keyof Strings]
  return typeof raw === 'string' ? raw : null
}

function englishEnds(mode: QuizMode): { left: string; right: string } | null {
  const raw = englishLabel(mode)
  if (!raw) return null
  const arrow = raw.split(/\s*→\s*/)
  const bits = arrow.length === 2 ? arrow : raw.split(/\s+to\s+/i)
  if (bits.length !== 2) return null
  const left = bits[0].trim().toLowerCase()
  const right = bits[1].trim().toLowerCase()
  if (!left || !right) return null
  return { left, right }
}

function splitLabel(text: string): [string, string] | null {
  const arrow = text.split(/\s*[→←]\s*/)
  if (arrow.length === 2 && arrow[0].trim() && arrow[1].trim()) {
    return [arrow[0].trim(), arrow[1].trim()]
  }
  const word = text.split(/\s+to\s+/i)
  if (word.length === 2 && word[0].trim() && word[1].trim()) {
    return [word[0].trim(), word[1].trim()]
  }
  return null
}

export function linksFromModes(modes: readonly QuizMode[]): ModeLink[] {
  const links: ModeLink[] = []
  for (const mode of modes) {
    const ends = englishEnds(mode)
    if (ends) {
      links.push({ mode, ...ends })
      continue
    }
    links.push({ mode, left: mode, right: mode, plain: true })
  }
  return links
}

export function geoModeLinks(): ModeLink[] {
  return [
    ...linksFromModes([...QUIZ_MODES, ...CODES_MODES]),
    ...RANKING_MODES.map((mode) => ({ mode, left: 'rankings', right: mode })),
  ]
}

export function footballModeLinks(): ModeLink[] {
  const modes = FOOTBALL_PLAY_FAMILIES.flatMap((id) => modesOfFootballFamily(id))
  return linksFromModes(modes)
}

export function mathModeLinks(): ModeLink[] {
  return linksFromModes(MATH_MODES)
}

export function astroModeLinks(): ModeLink[] {
  return linksFromModes(ASTRO_MODES)
}

export function themeModeLinks(world: ThemeWorld): ModeLink[] {
  return linksFromModes(themeModesOfWorld(world))
}

export function leaderModeLinks(): ModeLink[] {
  const links: ModeLink[] = []
  for (const kind of LEADERS_TOPICS) {
    for (const ask of leadersAsksOf(kind)) {
      links.push({ mode: leadersModeOf(kind, ask), left: kind, right: ask })
    }
  }
  return links
}

export function sideIds(links: readonly ModeLink[], side: 'left' | 'right'): string[] {
  const seen = new Set<string>()
  const ids: string[] = []
  for (const link of links) {
    const id = link[side]
    if (seen.has(id)) continue
    seen.add(id)
    ids.push(id)
  }
  return ids
}

export function sideText(links: readonly ModeLink[], side: 'left' | 'right', id: string, lang: Lang): string {
  const link = links.find((item) => item[side] === id)
  if (!link) return id
  if (id === 'rankings' && side === 'left') return STRINGS[lang].rankings
  if (link.plain) return modeLabel(link.mode, lang)
  const raw = STRINGS[lang][link.mode as keyof Strings]
  const text = typeof raw === 'string' ? raw : modeLabel(link.mode, lang)
  const parts = splitLabel(text)
  if (!parts) return modeLabel(link.mode, lang)
  return parts[side === 'left' ? 0 : 1]
}

export function linkForMode(links: readonly ModeLink[], mode: QuizMode): ModeLink | null {
  return links.find((item) => item.mode === mode) ?? null
}

export function pickLink(
  links: readonly ModeLink[],
  current: QuizMode,
  side: 'left' | 'right',
  id: string,
): QuizMode {
  const active = linkForMode(links, current)
  const other = side === 'left' ? 'right' : 'left'
  const kept = active
    ? links.find((item) => item[side] === id && item[other] === active[other])
    : undefined
  return (kept ?? links.find((item) => item[side] === id) ?? active)?.mode ?? current
}
