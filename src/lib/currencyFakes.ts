import { type Country, type Region } from '../data/countries'
import { PASSPORTS, passportCurrency } from '../data/passports'
import type { Lang } from '../i18n/strings'

type Gender = 'm' | 'f' | 'n'

interface Unit {
  en: string
  ru: string
  gender: Gender
}

interface Adj {
  en: string
  ru: string
}

const UNITS: Unit[] = [
  { en: 'peso', ru: 'песо', gender: 'n' },
  { en: 'dollar', ru: 'доллар', gender: 'm' },
  { en: 'franc', ru: 'франк', gender: 'm' },
  { en: 'dinar', ru: 'динар', gender: 'm' },
  { en: 'pound', ru: 'фунт', gender: 'm' },
  { en: 'rupee', ru: 'рупия', gender: 'f' },
  { en: 'lira', ru: 'лира', gender: 'f' },
  { en: 'krona', ru: 'крона', gender: 'f' },
  { en: 'euro', ru: 'евро', gender: 'n' },
  { en: 'yen', ru: 'иена', gender: 'f' },
  { en: 'yuan', ru: 'юань', gender: 'm' },
  { en: 'won', ru: 'вона', gender: 'f' },
  { en: 'ruble', ru: 'рубль', gender: 'm' },
  { en: 'real', ru: 'реал', gender: 'm' },
  { en: 'escudo', ru: 'эскудо', gender: 'n' },
  { en: 'mark', ru: 'марка', gender: 'f' },
  { en: 'shilling', ru: 'шиллинг', gender: 'm' },
  { en: 'dirham', ru: 'дирхам', gender: 'm' },
  { en: 'rial', ru: 'риал', gender: 'm' },
  { en: 'sucre', ru: 'сукре', gender: 'm' },
]

const REGION_UNITS: Record<Region, string[]> = {
  americas: ['peso', 'dollar', 'real', 'escudo', 'sucre', 'franc', 'pound'],
  europe: ['franc', 'pound', 'lira', 'mark', 'krona', 'euro', 'dinar', 'peso'],
  africa: ['franc', 'pound', 'dinar', 'shilling', 'dollar', 'escudo', 'peso'],
  asia: ['rupee', 'rial', 'dinar', 'dollar', 'yuan', 'won', 'yen', 'pound'],
  oceania: ['dollar', 'pound', 'franc', 'peso', 'rupee'],
}

const ADJ: Record<string, Adj> = {
  ae: { en: 'Emirati', ru: 'эмиратский' },
  af: { en: 'Afghan', ru: 'афганский' },
  ba: { en: 'Bosnian', ru: 'боснийский' },
  cv: { en: 'Cape Verdean', ru: 'кабо-вердианский' },
  gb: { en: 'British', ru: 'британский' },
  ls: { en: 'Lesotho', ru: 'лесотский' },
  pg: { en: 'Papua New Guinean', ru: 'папуа-новогвинейский' },
  sb: { en: 'Solomon Islands', ru: 'соломонский' },
  sl: { en: 'Sierra Leonean', ru: 'сьерра-леонский' },
  st: { en: 'São Toméan', ru: 'сан-томейский' },
  tt: { en: 'Trinidadian', ru: 'тринидадский' },
  us: { en: 'American', ru: 'американский' },
  vu: { en: 'Vanuatu', ru: 'вануатский' },
}

const UNIT_BY_EN = new Map(UNITS.map((unit) => [unit.en, unit]))

export function usesCurrencyFakes(iso: string, currencyEn: string): boolean {
  if (currencyEn === 'Euro' || currencyEn.includes('CFA franc')) return false
  if (currencyEn === 'East Caribbean dollar') return false
  if (currencyEn.startsWith('United States dollar')) return iso === 'us'
  if (currencyEn === 'Australian dollar') return iso === 'au'
  if (currencyEn === 'Swiss franc') return iso === 'ch'
  return true
}

export function currencyChoiceLabel(
  option: Country,
  lang: Lang,
  prompt: Country,
  optionIsos: readonly string[],
  banned: readonly string[] = [],
): string {
  const passport = PASSPORTS[prompt.iso]
  if (!passport) return ''
  if (option.iso === prompt.iso || !usesCurrencyFakes(prompt.iso, passport.currencyEn)) {
    const source = PASSPORTS[option.iso] ?? passport
    return passportCurrency(source, lang)
  }
  const label = distractorLabels(prompt, optionIsos, banned).get(option.iso)
  if (!label) {
    const source = PASSPORTS[option.iso]
    return source ? passportCurrency(source, lang) : ''
  }
  return lang === 'ru' ? label.ru : label.en
}

function distractorLabels(
  prompt: Country,
  optionIsos: readonly string[],
  banned: readonly string[] = [],
): Map<string, { en: string; ru: string }> {
  const result = new Map<string, { en: string; ru: string }>()
  const passport = PASSPORTS[prompt.iso]
  if (!passport) return result
  const distractors = optionIsos.filter((iso) => iso !== prompt.iso).sort()
  if (distractors.length === 0) return result

  const seed = seedKey(prompt.iso, distractors)
  const fakeCount = Math.min(seededShuffle([1, 2], seed)[0] ?? 1, Math.max(1, distractors.length - 1))
  const order = seededShuffle(distractors, `${seed}:order`)
  const fakes = fakeLabels(prompt, fakeCount, banned)
  const used = new Set(
    [
      passport.currencyEn,
      passport.currencyRu,
      ...banned,
      ...fakes.flatMap((label) => [label.en, label.ru]),
    ].map((text) => text.toLowerCase()),
  )

  order.slice(0, fakes.length).forEach((iso, index) => {
    const label = fakes[index]
    if (label) result.set(iso, label)
  })

  const unnamed = seededShuffle(
    unnamedCurrencies().filter(
      (label) => !used.has(label.en.toLowerCase()) && !used.has(label.ru.toLowerCase()),
    ),
    `${seed}:unnamed`,
  )
  let u = 0
  for (const iso of order.slice(fakes.length)) {
    const label = unnamed[u]
    u += 1
    if (label) result.set(iso, label)
  }
  return result
}

function fakeLabels(
  prompt: Country,
  count: number,
  banned: readonly string[] = [],
): Array<{ en: string; ru: string }> {
  const adj = adjectiveFor(prompt)
  const passport = PASSPORTS[prompt.iso]
  if (!adj || !passport || count <= 0) return []

  const realEn = passport.currencyEn.toLowerCase()
  const realRu = passport.currencyRu.toLowerCase()
  const bannedLower = new Set(banned.map((text) => text.toLowerCase()))
  const realUnit = unitKey(splitEn(passport.currencyEn).unit)
  const { preferred, extra } = unitPool(prompt.region, realUnit)
  const picked = [
    ...seededShuffle(preferred, `${prompt.iso}:units`),
    ...seededShuffle(extra, `${prompt.iso}:extra`),
  ]
  const labels: Array<{ en: string; ru: string }> = []
  for (const unit of picked) {
    if (labels.length >= count) break
    const label = {
      en: `${adj.en} ${unit.en}`,
      ru: `${inflectRu(adj.ru, unit.gender)} ${unit.ru}`,
    }
    if (label.en.toLowerCase() === realEn || label.ru.toLowerCase() === realRu) continue
    if (bannedLower.has(label.en.toLowerCase()) || bannedLower.has(label.ru.toLowerCase())) continue
    labels.push(label)
  }
  return labels
}

function unnamedCurrencies(): Array<{ en: string; ru: string }> {
  return [
    { en: 'Euro', ru: 'евро' },
    { en: 'CFA franc', ru: 'франк КФА' },
    { en: 'East Caribbean dollar', ru: 'восточнокарибский доллар' },
    { en: 'Pound sterling', ru: 'фунт стерлингов' },
  ]
}

function adjectiveFor(country: Country): Adj | null {
  if (ADJ[country.iso]) return ADJ[country.iso]
  const passport = PASSPORTS[country.iso]
  if (!passport) return null
  const ruFirst = passport.currencyRu.split(/\s+/)[0]
  if (!ruFirst || !isRuAdj(ruFirst)) return null
  const { adj } = splitEn(passport.currencyEn)
  if (!adj) return null
  return { en: adj, ru: toMasculine(ruFirst) }
}

function unitPool(region: Region, realUnit: string): { preferred: Unit[]; extra: Unit[] } {
  const preferred = REGION_UNITS[region]
    .map((en) => UNIT_BY_EN.get(en))
    .filter((unit): unit is Unit => unit !== undefined && unitKey(unit.en) !== realUnit)
  const extra = UNITS.filter((unit) => unitKey(unit.en) !== realUnit && !preferred.includes(unit))
  return { preferred, extra }
}

function seedKey(iso: string, distractors: string[]): string {
  return `${iso}:${distractors.join(',')}`
}

function splitEn(en: string): { adj: string; unit: string } {
  const zig = en.match(/^(.*)\s+gold \(ZiG\)$/)
  if (zig) return { adj: zig[1], unit: 'gold (ZiG)' }
  const i = en.lastIndexOf(' ')
  if (i <= 0) return { adj: '', unit: en }
  return { adj: en.slice(0, i), unit: en.slice(i + 1) }
}

function unitKey(unitEn: string): string {
  const key = unitEn
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
  if (key === 'krone' || key === 'krona' || key === 'koruna') return 'krona'
  if (key === 'riyal' || key === 'rial') return 'rial'
  if (key === 'colon') return 'colon'
  return key
}

function isRuAdj(word: string): boolean {
  return /(?:ский|цкий|ной|ный|ий|ый|ой|ская|цкая|ная|ая|яя|ское|цкое|ное|ое|ее)$/.test(word)
}

function toMasculine(adj: string): string {
  if (/(?:ский|цкий|ный|ной|ий|ый|ой)$/.test(adj)) return adj
  if (adj.endsWith('ская') || adj.endsWith('цкая')) return `${adj.slice(0, -2)}ий`
  if (adj.endsWith('ское') || adj.endsWith('цкое')) return `${adj.slice(0, -2)}ий`
  if (adj.endsWith('яя') || adj.endsWith('ее')) return `${adj.slice(0, -2)}ий`
  if (adj.endsWith('ая') || adj.endsWith('ое')) return `${adj.slice(0, -2)}ый`
  return adj
}

function inflectRu(masc: string, gender: Gender): string {
  if (gender === 'm') return masc
  if (masc.endsWith('ский') || masc.endsWith('цкий')) {
    const stem = masc.slice(0, -2)
    return gender === 'f' ? `${stem}ая` : `${stem}ое`
  }
  if (masc.endsWith('ый') || masc.endsWith('ой')) {
    const stem = masc.slice(0, -2)
    return gender === 'f' ? `${stem}ая` : `${stem}ое`
  }
  if (masc.endsWith('ий')) {
    const stem = masc.slice(0, -2)
    return gender === 'f' ? `${stem}яя` : `${stem}ее`
  }
  return masc
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  const next = [...items]
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  for (let i = next.length - 1; i > 0; i -= 1) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0
    const j = h % (i + 1)
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}
