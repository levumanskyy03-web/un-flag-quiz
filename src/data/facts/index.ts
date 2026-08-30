import type { Lang } from '../../i18n/strings'
import type { CountryFact } from './types'
import allFacts from './all.json'

type FactPair = [en: string, ru: string]
const FACTS = allFacts as unknown as Record<string, FactPair[]>
const LAST_FACTS_KEY = 'unfq-last-passport-facts'
const lastFactIndex = new Map<string, number>()

function readLastIndex(iso: string): number | undefined {
  const memory = lastFactIndex.get(iso)
  if (memory !== undefined) return memory
  if (typeof sessionStorage === 'undefined') return undefined
  try {
    const raw = sessionStorage.getItem(LAST_FACTS_KEY)
    if (!raw) return undefined
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return undefined
    const value = (parsed as Record<string, unknown>)[iso]
    return typeof value === 'number' ? value : undefined
  } catch {
    return undefined
  }
}

function writeLastIndex(iso: string, index: number) {
  lastFactIndex.set(iso, index)
  if (typeof sessionStorage === 'undefined') return
  try {
    const raw = sessionStorage.getItem(LAST_FACTS_KEY)
    const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {}
    parsed[iso] = index
    sessionStorage.setItem(LAST_FACTS_KEY, JSON.stringify(parsed))
  } catch {
    /* ignore quota / private mode */
  }
}

export function countryFacts(iso: string): CountryFact[] {
  return (FACTS[iso] ?? []).map(([en, ru]) => ({ en, ru }))
}

export function pickFactIndex(iso: string): number {
  const n = (FACTS[iso] ?? []).length
  if (n <= 1) return 0
  const last = readLastIndex(iso)
  let i = Math.floor(Math.random() * n)
  if (last !== undefined && i === last) i = (i + 1) % n
  writeLastIndex(iso, i)
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
