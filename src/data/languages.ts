import { COUNTRIES } from './countries'
import { COUNTRY_LANGS, LANGUAGES, type SpokenShare } from './languageData'
import { getPassport } from './passports'
import type { Lang } from '../i18n/lang'

export { LANGUAGES, COUNTRY_LANGS, type SpokenShare } from './languageData'

export function languagePath(id: string) {
  return `/language/${id.trim().toLowerCase()}`
}

export function languageById(id: string) {
  return LANGUAGES[id.trim().toLowerCase()]
}

export function languageName(id: string, lang: Lang): string {
  const info = languageById(id)
  if (!info) return id
  const raw = lang === 'ru' ? info.nameRu : info.nameEn
  if (lang !== 'en' && raw && raw[0] === raw[0].toLowerCase()) {
    return raw.charAt(0).toUpperCase() + raw.slice(1)
  }
  return raw
}

export function countryLangs(iso: string) {
  return COUNTRY_LANGS[iso] ?? { official: [], spoken: [] }
}

export function officialLanguageIds(iso: string): string[] {
  return countryLangs(iso).official
}

export function spokenLanguages(iso: string): SpokenShare[] {
  return countryLangs(iso).spoken
}

export function quizLanguageId(iso: string): string | null {
  const data = countryLangs(iso)
  if (data.official[0]) return data.official[0]
  return data.spoken[0]?.id ?? null
}

/** Languages that would be a valid answer for this country. */
export function correctLanguageIds(iso: string): string[] {
  const official = officialLanguageIds(iso)
  if (official.length > 0) return official
  const quiz = quizLanguageId(iso)
  return quiz ? [quiz] : []
}

export function countriesSpeaking(id: string) {
  const lang = id.trim().toLowerCase()
  return COUNTRIES.filter((country) => spokenLanguages(country.iso).some((item) => item.id === lang)).sort((a, b) => {
    const pa = spokenShare(a.iso, lang)
    const pb = spokenShare(b.iso, lang)
    return pb - pa || a.nameRu.localeCompare(b.nameRu, 'ru')
  })
}

export function spokenShare(iso: string, id: string): number {
  return spokenLanguages(iso).find((item) => item.id === id)?.pct ?? 0
}

export function speakerCount(iso: string, pct: number): number {
  const population = getPassport(iso)?.population ?? 0
  return Math.round((population * pct) / 100)
}

export function formatSpokenPct(pct: number, lang: Lang): string {
  const whole = Number.isInteger(pct)
  const body = whole ? String(pct) : pct.toFixed(1)
  const localized = lang === 'ru' || lang === 'de' ? body.replace('.', ',') : body
  return `${localized} %`
}

export function nationalPreview(iso: string, lang: Lang, max = 3): { names: string[]; extra: number } {
  const ids = officialLanguageIds(iso)
  return {
    names: ids.slice(0, max).map((id) => languageName(id, lang)),
    extra: Math.max(0, ids.length - max),
  }
}

export function allLanguageIds(): string[] {
  return Object.keys(LANGUAGES).sort((a, b) => languageName(a, 'ru').localeCompare(languageName(b, 'ru'), 'ru'))
}

export function languagesIndex() {
  return allLanguageIds()
    .map((id) => ({
      id,
      countries: countriesSpeaking(id),
    }))
    .filter((item) => item.countries.length > 0)
    .sort((a, b) => b.countries.length - a.countries.length || languageName(a.id, 'ru').localeCompare(languageName(b.id, 'ru'), 'ru'))
}
