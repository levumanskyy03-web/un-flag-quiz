import type { Lang } from '../i18n/lang'
import type { LeaderTerm } from './leaders'
import { POPE_BIOS } from './leaderBiosPopes'
import { RUS_BIOS } from './leaderBiosRus'
import { UK_BIOS } from './leaderBiosUk'
import { US_BIOS } from './leaderBiosUs'

export interface LeaderBio {
  ru: string
  en: string
}

const BY_ID: Record<string, LeaderBio> = { ...US_BIOS, ...RUS_BIOS, ...POPE_BIOS, ...UK_BIOS }

export function leaderBio(term: LeaderTerm, lang: Lang): string | null {
  const entry = BY_ID[term.id] ?? BY_ID[term.personId]
  if (!entry) return null
  return lang === 'ru' ? entry.ru : entry.en
}
