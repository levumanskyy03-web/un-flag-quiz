import { STRINGS, mixLabel, modeLabel, modesLabel, type Lang } from '../i18n/strings'
import { worldOfMode, type MixKind, type QuizMode, type QuizWorld } from './quiz'

export function quizWorldTitle(world: QuizWorld, lang: Lang): string {
  const t = STRINGS[lang]
  if (world === 'geo') return t.geography
  if (world === 'leaders') return t.leaders
  if (world === 'football') return t.football
  if (world === 'olympics') return t.olympics
  if (world === 'biology') return t.biology
  if (world === 'math') return t.math
  if (world === 'astronomy') return t.astronomy
  if (world === 'cs') return t.cs
  if (world === 'music') return t.musicWorld
  if (world === 'melody') return t.melodyWorld
  return t.food
}

export function shareThemeLabel(
  lang: Lang,
  mode: QuizMode,
  mix: MixKind | null = null,
  mixModes: readonly QuizMode[] = [],
): string {
  const world = quizWorldTitle(worldOfMode(mixModes[0] ?? mode), lang)
  const topic =
    mix === 'custom' && mixModes.length > 0
      ? modesLabel(mixModes, lang)
      : mix
        ? mixLabel(mix, lang)
        : modeLabel(mode, lang)
  return `${world} · ${topic}`
}
