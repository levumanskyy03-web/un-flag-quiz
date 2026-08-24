const SEPARATORS = /[^\p{L}\p{N}]+/gu
const MARKS = /\p{M}/gu

const LEET: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  $: 's',
  '!': 'i',
}

const HOMOGLYPH: Record<string, string> = {
  а: 'a',
  в: 'b',
  е: 'e',
  ё: 'e',
  к: 'k',
  м: 'm',
  н: 'h',
  о: 'o',
  р: 'p',
  с: 'c',
  т: 't',
  у: 'y',
  х: 'x',
}

const SUBSTRING_TERMS = [
  'nazis',
  'nazism',
  'hitler',
  'adolf',
  'fuhrer',
  'fuehrer',
  'heilhitler',
  'siegheil',
  'swastika',
  'gestapo',
  'goebbels',
  'himmler',
  '1488',
  'whitepower',
  'nigger',
  'nigga',
  'faggot',
  'retard',
  'kike',
  'chink',
  'gook',
  'tranny',
  'pedo',
  'paedo',
  'нацист',
  'нацизм',
  'гитлер',
  'хитлер',
  'свастика',
  'зигхайль',
  'зига',
  'фюрер',
  'фашист',
  'фашизм',
  'ниггер',
  'пидор',
  'пидрила',
  'педик',
  'чурка',
  'хач',
  'жид',
  'хохол',
  'кацап',
  'москаль',
  'черножоп',
  'педофил',
  'maricon',
  'nazista',
  'hijodeputa',
  'hijoedeputa',
  'كسم',
  'شرموط',
  'عرص',
  'ابنالكلب',
  'هتلر',
  'نازي',
  'نازية',
  'זין',
  'כוסעמך',
  'בןזונה',
  'היטלר',
  'נאצי',
  'नाज़ी',
  'हिटलर',
  'নাৎসি',
  'হিটলার',
  '纳粹',
  '希特勒',
  'ファシスト',
  'ヒトラー',
  'ナチス',
].map(foldKey)

const WHOLE_TERMS = ['ss', '88', '14', 'wpww', 'kkk', 'nazi', 'даун', 'жид', 'хач'].map(foldKey)
const NAZI_NAME = /^(nazim|nazir|naziha|nazia|nazira)s?\d*$/

export function isNameAllowed(name: string): boolean {
  return namePolicyError(name) === null
}

export function namePolicyError(name: string): 'blocked' | null {
  const compact = foldKey(name)
  const latin = latinize(compact)
  if (!compact) return null
  if (compact.includes('卐')) return 'blocked'
  if (WHOLE_TERMS.includes(compact) || WHOLE_TERMS.includes(latin)) return 'blocked'
  if (!NAZI_NAME.test(compact) && !NAZI_NAME.test(latin) && (compact.includes('nazi') || latin.includes('nazi'))) {
    return 'blocked'
  }
  for (const term of SUBSTRING_TERMS) {
    if (compact.includes(term) || latin.includes(term)) return 'blocked'
  }
  return null
}

function foldKey(value: string): string {
  return value.normalize('NFKD').replace(MARKS, '').toLowerCase().replace(SEPARATORS, '')
}

function latinize(value: string): string {
  let out = ''
  for (const ch of value) {
    out += LEET[ch] ?? HOMOGLYPH[ch] ?? ch
  }
  return out
}
