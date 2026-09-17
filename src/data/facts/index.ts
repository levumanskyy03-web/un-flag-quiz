import type { Lang } from '../../i18n/strings'
import { pickText, type TextExtra } from '../../i18n/text11'
import { getPassport, passportFact } from '../passports'
import type { CountryFact } from './types'
import allFacts from './all.json'
import FACTS_0 from '../i18n/facts-0.json'
import FACTS_1 from '../i18n/facts-1.json'
import FACTS_2 from '../i18n/facts-2.json'
import FACTS_3 from '../i18n/facts-3.json'
import FACTS_4 from '../i18n/facts-4.json'
import FACTS_5 from '../i18n/facts-5.json'
import FACTS_6 from '../i18n/facts-6.json'
import FACTS_7 from '../i18n/facts-7.json'

type FactPair = [en: string, ru: string]
const FACTS = allFacts as unknown as Record<string, FactPair[]>
const EXTRA = {
  ...FACTS_0,
  ...FACTS_1,
  ...FACTS_2,
  ...FACTS_3,
  ...FACTS_4,
  ...FACTS_5,
  ...FACTS_6,
  ...FACTS_7,
} as Record<string, Array<Partial<TextExtra>>>
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
  if (rows.length === 0) {
    const passport = getPassport(iso)
    if (passport) return passportFact(passport, lang, iso)
    return pickText(lang, fallback.ru, fallback.en)
  }
  const [en, ru] = rows[index % rows.length]
  const extra = EXTRA[iso]?.[index % rows.length]
  return pickText(lang, ru, en, extra)
}

export function constantFactTexts(
  iso: string,
  lang: Lang,
  rotatingIndex: number,
  fallback: CountryFact,
  count = 4,
): string[] {
  const rotating = factText(iso, rotatingIndex, lang, fallback)
  const rows = countryFacts(iso)
  const pool = rows.length > 0 ? rows : [fallback]
  const extras = EXTRA[iso] ?? []
  const texts: string[] = []
  for (let i = 0; i < pool.length; i += 1) {
    const fact = pool[i]
    const text = pickText(lang, fact.ru, fact.en, extras[i])
    if (text === rotating) continue
    texts.push(text)
    if (texts.length >= count) break
  }
  return texts
}
