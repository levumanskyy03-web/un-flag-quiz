import type { Lang } from '../../i18n/strings'
import type { CountryFact } from './types'
import allFacts from './all.json'

type FactPair = [en: string, ru: string]
const FACTS = allFacts as unknown as Record<string, FactPair[]>
const lastFactIndex = new Map<string, number>()

export function countryFacts(iso: string): CountryFact[] {
  return (FACTS[iso] ?? []).map(([en, ru]) => ({ en, ru }))
}

export function pickFactIndex(iso: string): number {
  const n = (FACTS[iso] ?? []).length
  if (n <= 1) return 0
  const last = lastFactIndex.get(iso)
  let i = Math.floor(Math.random() * n)
  if (last !== undefined && i === last) i = (i + 1) % n
  lastFactIndex.set(iso, i)
  return i
}

export function factText(
  iso: string,
  index: number,
  lang: Lang,
  fallback: CountryFact,
): string {
  const rows = FACTS[iso] ?? []
  if (rows.length === 0) return lang === 'ru' ? fallback.ru : fallback.en
  const [en, ru] = rows[index % rows.length]
  return lang === 'ru' ? ru : en
}
