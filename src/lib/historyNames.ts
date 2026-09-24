import { findCountry } from '../data/extras'
import { mapIndependence, polityById, polityName } from '../data/history'
import { localeTag, type Lang } from '../i18n/lang'
import type { HistoryCards } from './historyCards'
import type { HistoryMapFeature } from './historyMap'
import { countryName } from './quiz'

const regionNames = new Map<Lang, Intl.DisplayNames>()

/** Modern country / territory name for an ISO code (detached territories use these). */
export function placeName(iso: string, lang: Lang): string {
  const country = findCountry(iso)
  if (country) return countryName(country, lang)
  let names = regionNames.get(lang)
  if (!names) {
    names = new Intl.DisplayNames([localeTag(lang)], { type: 'region' })
    regionNames.set(lang, names)
  }
  try {
    return names.of(iso.toUpperCase()) ?? iso
  } catch {
    return iso
  }
}

/** Display name for any id the history map can reference: polity, modern ISO, map slug or `${parent}~${iso}`. */
export function historyEntityName(
  id: string,
  lang: Lang,
  year: number,
  cards: HistoryCards | null,
  fallback?: string,
): string {
  const tilde = id.indexOf('~')
  if (tilde > 0) {
    const parent = historyEntityName(id.slice(0, tilde), lang, year, cards)
    return `${placeName(id.slice(tilde + 1), lang)} (${parent})`
  }
  const status = mapIndependence(id, year)
  if (status.status === 'modern') {
    const country = findCountry(status.id)
    if (country) return countryName(country, lang)
  } else if (status.status !== 'not_independent') {
    const name = polityName(status.id, lang)
    if (name) return name
  }
  const text = cards?.text[id]?.n
  if (text) return text
  if (polityById(id)) return polityName(id, lang) ?? id
  const country = findCountry(id)
  if (country) return countryName(country, lang)
  return fallback ?? cards?.text[id]?.n ?? id
}

/** Short label drawn on the map: detached territories show just the modern place. */
export function historyMapLabel(feature: HistoryMapFeature, lang: Lang, year: number, cards: HistoryCards | null) {
  if (feature.m) return placeName(feature.m, lang)
  return historyEntityName(feature.id, lang, year, cards, feature.name)
}
