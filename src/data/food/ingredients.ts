import type { L11 } from '../math'
import raw from './ingredients.json'

const LANGS = ['ru', 'en', 'de', 'zh', 'es', 'hi', 'ar', 'bn', 'pt', 'ja', 'he'] as const

export const ING: Record<string, L11> = Object.fromEntries(
  Object.entries(raw as Record<string, string[]>).map(([id, names]) => [
    id,
    Object.fromEntries(LANGS.map((lang, index) => [lang, names[index]])),
  ]),
) as Record<string, L11>
