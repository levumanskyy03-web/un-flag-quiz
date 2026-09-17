import type { Lang } from '../i18n/lang'
import { pickText, type TextExtra } from '../i18n/text11'
import type { LeaderTerm } from './leaders'
import { POPE_BIOS } from './leaderBiosPopes'
import { RUS_BIOS } from './leaderBiosRus'
import { UK_BIOS } from './leaderBiosUk'
import { US_BIOS } from './leaderBiosUs'
import BIOS_US from './i18n/leaderBiosUs.json'
import BIOS_UK from './i18n/leaderBiosUk.json'
import BIOS_RUS from './i18n/leaderBiosRus.json'
import BIOS_POPES_A from './i18n/leaderBiosPopesA.json'
import BIOS_POPES_B from './i18n/leaderBiosPopesB.json'

export interface LeaderBio {
  ru: string
  en: string
  featRu?: string
  featEn?: string
}

const BY_ID: Record<string, LeaderBio> = { ...US_BIOS, ...RUS_BIOS, ...POPE_BIOS, ...UK_BIOS }

type BioExtra = { bio?: Partial<TextExtra>; feat?: Partial<TextExtra> }
const EXTRA = {
  ...BIOS_US,
  ...BIOS_UK,
  ...BIOS_RUS,
  ...BIOS_POPES_A,
  ...BIOS_POPES_B,
} as Record<string, BioExtra>

function extraOf(term: LeaderTerm): BioExtra | undefined {
  return EXTRA[term.id] ?? EXTRA[term.personId]
}

export function leaderBio(term: LeaderTerm, lang: Lang): string | null {
  const entry = BY_ID[term.id] ?? BY_ID[term.personId]
  if (!entry) return null
  return pickText(lang, entry.ru, entry.en, extraOf(term)?.bio)
}

export function leaderFeat(term: LeaderTerm, lang: Lang): string | null {
  const entry = BY_ID[term.id] ?? BY_ID[term.personId]
  if (!entry) return null
  const feat = pickText(lang, entry.featRu ?? '', entry.featEn ?? '', extraOf(term)?.feat)
  return feat.trim() ? feat : null
}
