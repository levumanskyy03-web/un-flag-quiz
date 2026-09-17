import { type Country, type Region } from '../data/countries'
import { PASSPORTS, passportCurrency } from '../data/passports'
import { localeTag, type Lang } from '../i18n/lang'
import { pickText, type TextExtra } from '../i18n/text11'

type Gender = 'm' | 'f' | 'n'

interface Unit {
  en: string
  ru: string
  gender: Gender
  extra: TextExtra
}

interface Adj {
  en: string
  ru: string
}

function u(en: string, ru: string, gender: Gender, extra: TextExtra): Unit {
  return { en, ru, gender, extra }
}

const UNITS: Unit[] = [
  u('peso', 'песо', 'n', { de: 'Peso', zh: '比索', es: 'peso', hi: 'पेसो', ar: 'بيزو', bn: 'পেসো', pt: 'peso', ja: 'ペソ', he: 'פסו' }),
  u('dollar', 'доллар', 'm', { de: 'Dollar', zh: '元', es: 'dólar', hi: 'डॉलर', ar: 'دولار', bn: 'ডলার', pt: 'dólar', ja: 'ドル', he: 'דולר' }),
  u('franc', 'франк', 'm', { de: 'Franc', zh: '法郎', es: 'franco', hi: 'फ़्रैंक', ar: 'فرنك', bn: 'ফ্রাঙ্ক', pt: 'franco', ja: 'フラン', he: 'פרנק' }),
  u('dinar', 'динар', 'm', { de: 'Dinar', zh: '第纳尔', es: 'dinar', hi: 'दीनार', ar: 'دينار', bn: 'দিনার', pt: 'dinar', ja: 'ディナール', he: 'דינר' }),
  u('pound', 'фунт', 'm', { de: 'Pfund', zh: '镑', es: 'libra', hi: 'पाउंड', ar: 'جنيه', bn: 'পাউন্ড', pt: 'libra', ja: 'ポンド', he: 'לירה' }),
  u('rupee', 'рупия', 'f', { de: 'Rupie', zh: '卢比', es: 'rupia', hi: 'रुपया', ar: 'روبية', bn: 'রুপি', pt: 'rupia', ja: 'ルピー', he: 'רופי' }),
  u('lira', 'лира', 'f', { de: 'Lira', zh: '里拉', es: 'lira', hi: 'लीरा', ar: 'ليرة', bn: 'লিরা', pt: 'lira', ja: 'リラ', he: 'לירה' }),
  u('krona', 'крона', 'f', { de: 'Krone', zh: '克朗', es: 'corona', hi: 'क्रोना', ar: 'كرونة', bn: 'ক্রোনা', pt: 'coroa', ja: 'クローナ', he: 'כתר' }),
  u('euro', 'евро', 'n', { de: 'Euro', zh: '欧元', es: 'euro', hi: 'यूरो', ar: 'يورو', bn: 'ইউরো', pt: 'euro', ja: 'ユーロ', he: 'יורו' }),
  u('yen', 'иена', 'f', { de: 'Yen', zh: '日元', es: 'yen', hi: 'येन', ar: 'ين', bn: 'ইয়েন', pt: 'iene', ja: '円', he: 'ין' }),
  u('yuan', 'юань', 'm', { de: 'Yuan', zh: '元', es: 'yuan', hi: 'युआन', ar: 'يوان', bn: 'ইউয়ান', pt: 'yuan', ja: '元', he: 'יואן' }),
  u('won', 'вона', 'f', { de: 'Won', zh: '韩元', es: 'won', hi: 'वॉन', ar: 'وون', bn: 'ওন', pt: 'won', ja: 'ウォン', he: 'וון' }),
  u('ruble', 'рубль', 'm', { de: 'Rubel', zh: '卢布', es: 'rublo', hi: 'रूबल', ar: 'روبل', bn: 'রুবেল', pt: 'rublo', ja: 'ルーブル', he: 'רובל' }),
  u('real', 'реал', 'm', { de: 'Real', zh: '雷亚尔', es: 'real', hi: 'रियल', ar: 'ريال', bn: 'রেয়াল', pt: 'real', ja: 'レアル', he: 'ריאל' }),
  u('escudo', 'эскудо', 'n', { de: 'Escudo', zh: '埃斯库多', es: 'escudo', hi: 'एस्कुदो', ar: 'إسكودو', bn: 'এস্কুডো', pt: 'escudo', ja: 'エスクード', he: 'אסקודו' }),
  u('mark', 'марка', 'f', { de: 'Mark', zh: '马克', es: 'marco', hi: 'मार्क', ar: 'مارك', bn: 'মার্ক', pt: 'marco', ja: 'マルク', he: 'מארק' }),
  u('shilling', 'шиллинг', 'm', { de: 'Schilling', zh: '先令', es: 'chelín', hi: 'शिलिंग', ar: 'شلن', bn: 'শিলিং', pt: 'xelim', ja: 'シリング', he: 'שילינג' }),
  u('dirham', 'дирхам', 'm', { de: 'Dirham', zh: '迪拉姆', es: 'dírham', hi: 'दिर्हम', ar: 'درهم', bn: 'দিরহাম', pt: 'dirham', ja: 'ディルハム', he: 'דירהם' }),
  u('rial', 'риал', 'm', { de: 'Rial', zh: '里亚尔', es: 'rial', hi: 'रियाल', ar: 'ريال', bn: 'রিয়াল', pt: 'rial', ja: 'リアル', he: 'ריאל' }),
  u('sucre', 'сукре', 'm', { de: 'Sucre', zh: '苏克雷', es: 'sucre', hi: 'सुक्रे', ar: 'سوكري', bn: 'সুক্রে', pt: 'sucre', ja: 'スクレ', he: 'סוקרה' }),
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
    const sourceIso = PASSPORTS[option.iso] ? option.iso : prompt.iso
    const source = PASSPORTS[sourceIso] ?? passport
    return passportCurrency(source, lang, sourceIso)
  }
  const label = distractorLabels(prompt, optionIsos, banned).get(option.iso)
  if (!label) {
    const source = PASSPORTS[option.iso]
    return source ? passportCurrency(source, lang, option.iso) : ''
  }
  return pickText(lang, label.ru, label.en, extraFake(label, lang, prompt))
}

function extraFake(label: { en: string; ru: string }, lang: Lang, prompt: Country): Partial<TextExtra> | undefined {
  if (lang === 'ru' || lang === 'en') return undefined
  const unnamed = unnamedCurrencies().find((item) => item.en === label.en)
  if (unnamed) return unnamed.extra
  const unit = UNITS.find((item) => label.en.endsWith(` ${item.en}`) || label.en === item.en)
  if (!unit) return undefined
  const place = placeName(prompt, lang)
  const u = pickText(lang, unit.ru, unit.en, unit.extra)
  return { [lang]: fakePhrase(lang, place, u) } as Partial<TextExtra>
}

function placeName(country: Country, lang: Lang): string {
  if (lang === 'ru') return country.nameRu
  if (lang === 'en') return country.nameEn
  try {
    const name = new Intl.DisplayNames([localeTag(lang)], { type: 'region' }).of(country.iso.toUpperCase())
    if (name) return name
  } catch {
    /* fall back */
  }
  return country.nameEn
}

function fakePhrase(lang: Lang, place: string, unit: string): string {
  switch (lang) {
    case 'zh':
      return `${place}${unit}`
    case 'ja':
      return `${place}の${unit}`
    case 'de':
      return `${place}-${unit}`
    case 'es':
    case 'pt':
      return `${unit} de ${place}`
    case 'ar':
      return `${unit} ${place}`
    case 'he':
      return `${unit} של ${place}`
    default:
      return `${place} ${unit}`
  }
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

function unnamedCurrencies(): Array<{ en: string; ru: string; extra: TextExtra }> {
  return [
    {
      en: 'Euro',
      ru: 'евро',
      extra: { de: 'Euro', zh: '欧元', es: 'euro', hi: 'यूरो', ar: 'يورو', bn: 'ইউরো', pt: 'euro', ja: 'ユーロ', he: 'יורו' },
    },
    {
      en: 'CFA franc',
      ru: 'франк КФА',
      extra: {
        de: 'CFA-Franc',
        zh: '非洲金融共同体法郎',
        es: 'franco CFA',
        hi: 'सीएफए फ़्रैंक',
        ar: 'فرنك غرب/وسط أفريقيا',
        bn: 'সিএফএ ফ্রাঙ্ক',
        pt: 'franco CFA',
        ja: 'CFAフラン',
        he: 'פרנק CFA',
      },
    },
    {
      en: 'East Caribbean dollar',
      ru: 'восточнокарибский доллар',
      extra: {
        de: 'Ostkaribischer Dollar',
        zh: '东加勒比元',
        es: 'dólar del Caribe Oriental',
        hi: 'पूर्वी कैरिबियाई डॉलर',
        ar: 'دولار شرق الكاريبي',
        bn: 'পূর্ব ক্যারিবীয় ডলার',
        pt: 'dólar do Caribe Oriental',
        ja: '東カリブドル',
        he: 'דולר מזרח־קריבי',
      },
    },
    {
      en: 'Pound sterling',
      ru: 'фунт стерлингов',
      extra: {
        de: 'Pfund Sterling',
        zh: '英镑',
        es: 'libra esterlina',
        hi: 'पाउंड स्टर्लिंग',
        ar: 'جنيه إسترليني',
        bn: 'পাউন্ড স্টার্লিং',
        pt: 'libra esterlina',
        ja: 'スターリング・ポンド',
        he: 'לירה שטרלינג',
      },
    },
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
