import { t11, type L11 } from '../math'
import type { ThemeItem, ThemeTier } from '../theme'
import type { ThemeMode } from '../../lib/quiz/themeModes'

export type { L11 }

export function n(
  ru: string,
  en: string,
  de: string,
  zh: string,
  es: string,
  hi: string,
  ar: string,
  bn: string,
  pt: string,
  ja: string,
  he: string,
): L11 {
  return t11(ru, en, de, zh, es, hi, ar, bn, pt, ja, he)
}

export function card(
  id: string,
  mode: ThemeMode,
  tier: ThemeTier,
  prompt: L11,
  answer: L11,
  key: string,
  note: L11,
): ThemeItem {
  return { id, mode, tier, prompt, answer, key, note }
}

export function both(
  id: string,
  forward: ThemeMode,
  back: ThemeMode,
  tier: ThemeTier,
  term: L11,
  meaning: L11,
  termKey: string,
  meaningKey: string,
  note: L11,
): ThemeItem[] {
  return [
    card(`${id}f`, forward, tier, term, meaning, meaningKey, note),
    card(`${id}b`, back, tier, meaning, term, termKey, note),
  ]
}
