import type { Region } from '../countries'
import { LANGS, localeTag } from '../../i18n/lang'
import type { Text11 } from '../../i18n/text11'
import type { DependentKind, Polity, PolityPassport } from './types'

function n(
  en: string,
  ru: string,
  de: string,
  zh: string,
  es: string,
  hi: string,
  ar: string,
  bn: string,
  pt: string,
  ja: string,
  he: string,
): Text11 {
  return { en, ru, de, zh, es, hi, ar, bn, pt, ja, he }
}

function isoNames(iso: string): Text11 {
  const row = {} as Text11
  for (const lang of LANGS) {
    try {
      row[lang] = new Intl.DisplayNames([localeTag(lang)], { type: 'region' }).of(iso.toUpperCase()) ?? iso
    } catch {
      row[lang] = iso
    }
  }
  return row
}

function city(en: string, ru = en): Text11 {
  return n(en, ru, en, en, en, en, en, en, en, en, en)
}

function metroFlag(parent: string): { flagIso?: string } {
  if (parent.length === 2) return { flagIso: parent }
  if (parent === 'ge-emp') return { flagIso: 'de' }
  if (parent === 'ru-emp') return { flagIso: 'ru' }
  if (parent === 'batavian-republic') return { flagIso: 'nl' }
  return {}
}

const sterling = n(
  'Pound sterling',
  'фунт стерлингов',
  'Pfund Sterling',
  '英镑',
  'libra esterlina',
  'पाउंड स्टर्लिंग',
  'جنيه إسترليني',
  'পাউন্ড স্টার্লিং',
  'libra esterlina',
  'スターリング・ポンド',
  'לירה שטרלינג',
)
const franc = n(
  'French franc',
  'французский франк',
  'Französischer Franc',
  '法国法郎',
  'franco francés',
  'फ़्रांसीसी फ़्रैंक',
  'فرنك فرنسي',
  'ফরাসি ফ্রাঁ',
  'franco francês',
  'フランス・フラン',
  'פרנק צרפתי',
)
const peseta = n(
  'Spanish peseta',
  'испанская песета',
  'Spanische Peseta',
  '西班牙比塞塔',
  'peseta española',
  'स्पेनी पेसेता',
  'بيزيتا إسبانية',
  'স্পেনীয় পেসেতা',
  'peseta espanhola',
  'スペイン・ペセタ',
  'פסטה ספרדית',
)
const guilder = n(
  'Dutch guilder',
  'нидерландский гульден',
  'Niederländischer Gulden',
  '荷兰盾',
  'florín neerlandés',
  'डच गिल्डर',
  'غيلدر هولندي',
  'ডাচ গিল্ডার',
  'florim neerlandês',
  'オランダ・ギルダー',
  'גילדר הולנדי',
)
const belgianFranc = n(
  'Belgian franc',
  'бельгийский франк',
  'Belgischer Franc',
  '比利时法郎',
  'franco belga',
  'बेल्जियम फ़्रैंक',
  'فرنك بلجيكي',
  'বেলজীয় ফ্রাঁ',
  'franco belga',
  'ベルギー・フラン',
  'פרנק בלגי',
)
const lira = n(
  'Italian lira',
  'итальянская лира',
  'Italienische Lira',
  '意大利里拉',
  'lira italiana',
  'इतालवी लीरा',
  'ليرة إيطالية',
  'ইতালীয় লিরা',
  'lira italiana',
  'イタリア・リラ',
  'לירה איטלקית',
)
const mark = n(
  'German mark / gold mark',
  'германская марка',
  'Deutsche Mark / Goldmark',
  '德国马克',
  'marco alemán',
  'जर्मन मार्क',
  'مارك ألماني',
  'জার্মান মার্ক',
  'marco alemão',
  'ドイツ・マルク',
  'מארק גרמני',
)
const usd = n(
  'United States dollar',
  'доллар США',
  'US-Dollar',
  '美元',
  'dólar estadounidense',
  'अमेरिकी डॉलर',
  'دولار أمريكي',
  'মার্কিন ডলার',
  'dólar dos EUA',
  '米ドル',
  'דולר אמריקאי',
)
const yen = n(
  'Japanese yen',
  'японская иена',
  'Japanischer Yen',
  '日元',
  'yen japonés',
  'जापानी येन',
  'ين ياباني',
  'জাপানি ইয়েন',
  'iene japonês',
  '日本円',
  'ין יפני',
)
const krone = n(
  'Danish krone',
  'датская крона',
  'Dänische Krone',
  '丹麦克朗',
  'corona danesa',
  'डेनिश क्रोन',
  'كرونة دنماركية',
  'ড্যানিশ ক্রোন',
  'coroa dinamarquesa',
  'デンマーク・クローネ',
  'כתר דני',
)
const escudo = n(
  'Portuguese escudo / real',
  'португальский эскудо / реал',
  'Portugiesischer Escudo / Real',
  '葡萄牙埃斯库多 / 雷亚尔',
  'escudo / real portugués',
  'पुर्तगाली एस्कुडो / रियाल',
  'اسكودو / ريال برتغالي',
  'পর্তুগিজ এস্কুডো / রিয়াল',
  'escudo / real português',
  'ポルトガル・エスクード / レアル',
  'אסקודו / ריאל פורטוגלי',
)

const METRO: Record<string, { langs: string[]; currency: Text11 }> = {
  gb: { langs: ['en'], currency: sterling },
  fr: { langs: ['fr'], currency: franc },
  es: { langs: ['es'], currency: peseta },
  nl: { langs: ['nl'], currency: guilder },
  be: { langs: ['fr', 'nl'], currency: belgianFranc },
  pt: { langs: ['pt'], currency: escudo },
  it: { langs: ['it'], currency: lira },
  de: { langs: ['de'], currency: mark },
  'ge-emp': { langs: ['de'], currency: mark },
  us: { langs: ['en'], currency: usd },
  jp: { langs: ['ja'], currency: yen },
  dk: { langs: ['da'], currency: krone },
  au: { langs: ['en'], currency: sterling },
  za: { langs: ['en', 'nl'], currency: sterling },
  nz: { langs: ['en'], currency: sterling },
  se: {
    langs: ['sv'],
    currency: n(
      'Swedish riksdaler / krona',
      'шведский риксдалер / крона',
      'Schwedischer Riksdaler / Krone',
      '瑞典里克斯达勒 / 克朗',
      'riksdaler / corona sueca',
      'स्वीडिश रिक्सडेलर / क्रोना',
      'ريكسدالر / كرونة سويدية',
      'সুইডিশ রিক্সডালার / ক্রোনা',
      'riksdaler / coroa sueca',
      'スウェーデン・リクスダーラー / クローナ',
      'ריקסדאלר / כתר שוודי',
    ),
  },
  su: { langs: ['ru'], currency: n('Soviet ruble', 'советский рубль', 'Sowjetrubel', '苏联卢布', 'rublo soviético', 'सोवियत रूबल', 'روبل سوفيتي', 'সোভিয়েত রুবল', 'rublo soviético', 'ソ連ルーブル', 'רובל סובייטי') },
}

const FACT: Record<DependentKind, Text11> = {
  colony: n(
    'A colony of {parent} on this map — not a sovereign state.',
    'Колония {parent} на этой карте, не суверенное государство.',
    'Eine Kolonie von {parent} auf dieser Karte — kein souveräner Staat.',
    '此地图像上{parent}的殖民地，不是主权国家。',
    'Colonia de {parent} en este mapa: no es un Estado soberano.',
    'इस मानचित्र पर {parent} की कॉलोनी — संप्रभु राज्य नहीं।',
    'مستعمرة لـ {parent} على هذه الخريطة وليست دولة ذات سيادة.',
    'এই মানচিত্রে {parent}-এর উপনিবেশ — সার্বভৌম রাষ্ট্র নয়।',
    'Colónia de {parent} neste mapa — não é um Estado soberano.',
    'この地図上の{parent}の植民地であり、主権国家ではない。',
    'מושבה של {parent} במפה הזו, לא מדינה ריבונית.',
  ),
  protectorate: n(
    'A protectorate of {parent} on this map — not a fully independent state.',
    'Протекторат {parent} на этой карте, не полностью независимое государство.',
    'Ein Protektorat von {parent} auf dieser Karte — kein vollständig unabhängiger Staat.',
    '此地图像上{parent}的保护国，不是完全独立的国家。',
    'Protectorado de {parent} en este mapa: no es un Estado plenamente independiente.',
    'इस मानचित्र पर {parent} का संरक्षित राज्य — पूर्ण स्वतंत्र राज्य नहीं।',
    'محمية لـ {parent} على هذه الخريطة وليست دولة مستقلة تمامًا.',
    'এই মানচিত্রে {parent}-এর রক্ষিত রাজ্য — পুরোপুরি স্বাধীন রাষ্ট্র নয়।',
    'Protectorado de {parent} neste mapa — não é um Estado plenamente independente.',
    'この地図上の{parent}の保護国であり、完全な独立国ではない。',
    'חסות של {parent} במפה הזו, לא מדינה עצמאית לגמרי.',
  ),
  viceroyalty: n(
    'A viceroyalty of {parent} on this map — not a sovereign state.',
    'Вице-королевство {parent} на этой карте, не суверенное государство.',
    'Ein Vizekönigreich von {parent} auf dieser Karte — kein souveräner Staat.',
    '此地图像上{parent}的总督辖区，不是主权国家。',
    'Virreinato de {parent} en este mapa: no es un Estado soberano.',
    'इस मानचित्र पर {parent} की वाइसरॉयल्टी — संप्रभु राज्य नहीं।',
    'نيابة لـ {parent} على هذه الخريطة وليست دولة ذات سيادة.',
    'এই মানচিত্রে {parent}-এর ভাইসরয়্যালটি — সার্বভৌম রাষ্ট্র নয়।',
    'Vice-reino de {parent} neste mapa — não é um Estado soberano.',
    'この地図上の{parent}の総督領であり、主権国家ではない。',
    'משנה למלך של {parent} במפה הזו, לא מדינה ריבונית.',
  ),
  vassal: n(
    'A vassal of {parent} on this map — not a fully independent state.',
    'Вассал {parent} на этой карте, не полностью независимое государство.',
    'Ein Vasall von {parent} auf dieser Karte — kein vollständig unabhängiger Staat.',
    '此地图像上{parent}的附庸，不是完全独立的国家。',
    'Vasallo de {parent} en este mapa: no es un Estado plenamente independiente.',
    'इस मानचित्र पर {parent} का जागीरदार — पूर्ण स्वतंत्र राज्य नहीं।',
    'تابع لـ {parent} على هذه الخريطة وليست دولة مستقلة تمامًا.',
    'এই মানচিত্রে {parent}-এর ভাসাল — পুরোপুরি স্বাধীন রাষ্ট্র নয়।',
    'Vassalo de {parent} neste mapa — não é um Estado plenamente independente.',
    'この地図上の{parent}の属国であり、完全な独立国ではない。',
    'ואסאל של {parent} במפה הזו, לא מדינה עצמאית לגמרי.',
  ),
  company: n(
    'Company territory of {parent} on this map — not a sovereign state.',
    'Территория компании {parent} на этой карте, не суверенное государство.',
    'Gesellschaftsterritorium von {parent} auf dieser Karte — kein souveräner Staat.',
    '此地图像上{parent}的公司领地，不是主权国家。',
    'Territorio de compañía de {parent} en este mapa: no es un Estado soberano.',
    'इस मानचित्र पर {parent} की कंपनी-भूमि — संप्रभु राज्य नहीं।',
    'أرض شركة لـ {parent} على هذه الخريطة وليست دولة ذات سيادة.',
    'এই মানচিত্রে {parent}-এর কোম্পানি এলাকা — সার্বভৌম রাষ্ট্র নয়।',
    'Território de companhia de {parent} neste mapa — não é um Estado soberano.',
    'この地図上の{parent}の会社領であり、主権国家ではない。',
    'שטח חברה של {parent} במפה הזו, לא מדינה ריבונית.',
  ),
  personal_union: n(
    'In personal union with {parent} on this map — not a separate sovereign.',
    'В личной унии с {parent} на этой карте, не отдельный суверен.',
    'In Personalunion mit {parent} auf dieser Karte — kein eigener Souverän.',
    '此地图像上与{parent}共主联邦，不是单独的主权者。',
    'En unión personal con {parent} en este mapa: no es un soberano aparte.',
    'इस मानचित्र पर {parent} के साथ वैयक्तिक संघ — अलग संप्रभु नहीं।',
    'في اتحاد شخصي مع {parent} على هذه الخريطة وليست سيادة منفصلة.',
    'এই মানচিত্রে {parent}-এর সাথে ব্যক্তিগত ইউনিয়ন — আলাদা সার্বভৌম নয়।',
    'Em união pessoal com {parent} neste mapa — não é um soberano à parte.',
    'この地図上は{parent}との同君連合であり、別の主権者ではない。',
    'באיחוד פרסונלי עם {parent} במפה הזו, לא ריבון נפרד.',
  ),
}

function parentNames(parent: string): Text11 {
  if (parent.length === 2) return isoNames(parent)
  const extras: Record<string, Text11> = {
    'ge-emp': n('German Empire', 'Германская империя', 'Deutsches Kaiserreich', '德意志帝国', 'Imperio alemán', 'जर्मन साम्राज्य', 'الإمبراطورية الألمانية', 'জার্মান সাম্রাজ্য', 'Império Alemão', 'ドイツ帝国', 'הקיסרות הגרמנית'),
    'ru-emp': n('Russian Empire', 'Российская империя', 'Russisches Kaiserreich', '俄罗斯帝国', 'Imperio ruso', 'रूसी साम्राज्य', 'الإمبراطورية الروسية', 'রুশ সাম্রাজ্য', 'Império Russo', 'ロシア帝国', 'האימפריה הרוסית'),
    su: n('Soviet Union', 'СССР', 'Sowjetunion', '苏联', 'Unión Soviética', 'सोवियत संघ', 'الاتحاد السوفيتي', 'সোভিয়েত ইউনিয়ন', 'União Soviética', 'ソビエト連邦', 'ברית המועצות'),
    siam: n('Siam', 'Сиам', 'Siam', '暹罗', 'Siam', 'सियाम', 'سيام', 'সিয়াম', 'Sião', 'シャム', 'סיאם'),
  }
  return extras[parent] ?? n(parent, parent, parent, parent, parent, parent, parent, parent, parent, parent, parent)
}

function withParent(template: Text11, parent: string): Text11 {
  const names = parentNames(parent)
  const row = {} as Text11
  for (const lang of LANGS) {
    row[lang] = template[lang].replaceAll('{parent}', names[lang] || names.en)
  }
  return row
}

type Spec = {
  id: string
  region: Region
  from: number
  to: number | null
  parent: string
  dependentKind: DependentKind
  iso?: string
  names?: Text11
  capital?: Text11
  langs?: string[]
  currency?: Text11
  founded?: number
  wikidata?: string
  difficulty?: 'easy' | 'hard'
  successors?: string[]
  fact?: Text11
  flagFile?: string
  flagIso?: string
  parentSpans?: { from: number; to: number; id: string }[]
}

function build(spec: Spec): { polity: Omit<Polity, 'wikidata' | 'marker'>; passport: PolityPassport; wikidata?: string } {
  const metro = METRO[spec.parent]
  const names = spec.names ?? (spec.iso ? isoNames(spec.iso) : n(spec.id, spec.id, spec.id, spec.id, spec.id, spec.id, spec.id, spec.id, spec.id, spec.id, spec.id))
  const polity: Omit<Polity, 'wikidata' | 'marker'> = {
    id: spec.id,
    region: spec.region,
    from: spec.from,
    to: spec.to,
    kind: 'dependent',
    parent: spec.parent,
    parentSpans: spec.parentSpans,
    dependentKind: spec.dependentKind,
    difficulty: spec.difficulty ?? 'hard',
    names,
    capital: spec.capital,
    successors: spec.successors ?? (spec.iso ? [spec.iso] : []),
    fact: spec.fact ?? withParent(FACT[spec.dependentKind], spec.parent),
    flagFile: spec.flagFile,
    flagIso: spec.flagIso ?? metroFlag(spec.parent).flagIso,
  }
  const passport: PolityPassport = {
    founded: spec.founded ?? spec.from,
    langs: spec.langs ?? metro?.langs,
    currency: spec.currency ?? metro?.currency,
  }
  return { polity, passport, wikidata: spec.wikidata }
}

const SPECS: Spec[] = [
  { id: 'british-raj', region: 'asia', from: 1858, to: 1947, parent: 'gb', dependentKind: 'colony', difficulty: 'easy', successors: ['in', 'pk', 'bd', 'mm'], capital: city('Calcutta / New Delhi', 'Калькутта / Нью-Дели'), founded: 1858, wikidata: 'Q129286', names: n('British Raj', 'Британская Индия', 'Britisch-Indien', '英属印度', 'Raj británico', 'ब्रिटिश राज', 'الراج البريطاني', 'ব্রিটিশ রাজ', 'Raj britânico', 'イギリス領インド', 'הראג׳ הבריטי') },
  { id: 'british-east-india-company', region: 'asia', from: 1757, to: 1858, parent: 'gb', dependentKind: 'company', successors: ['in'], capital: city('Calcutta', 'Калькутта'), founded: 1600, wikidata: 'Q129286', names: n('British East India Company', 'Британская Ост-Индская компания', 'Britische Ostindien-Kompanie', '英属东印度公司', 'Compañía Británica de las Indias Orientales', 'ब्रिटिश ईस्ट इंडिया कंपनी', 'شركة الهند الشرقية البريطانية', 'ব্রিটিশ ইস্ট ইন্ডিয়া কোম্পানি', 'Companhia Britânica das Índias Orientais', 'イギリス東インド会社', 'חברת הודו המזרחית הבריטית') },
  { id: 'french-indochina', region: 'asia', from: 1887, to: 1954, parent: 'fr', dependentKind: 'colony', difficulty: 'easy', successors: ['vn', 'la', 'kh'], capital: city('Hanoi', 'Ханой'), founded: 1887, wikidata: 'Q178898', names: n('French Indochina', 'Французский Индокитай', 'Französisch-Indochina', '法属印度支那', 'Indochina francesa', 'फ़्रांसीसी इंडोचाइना', 'الهند الصينية الفرنسية', 'ফরাসি ইন্দোচিন', 'Indochina francesa', 'フランス領インドシナ', 'הודו־סין הצרפתית') },
  { id: 'french-west-africa', region: 'africa', from: 1895, to: 1958, parent: 'fr', dependentKind: 'colony', difficulty: 'easy', successors: ['sn', 'ml', 'ci', 'gn', 'bf', 'ne', 'bj', 'mr'], capital: city('Dakar', 'Дакар'), founded: 1895, wikidata: 'Q210730', names: n('French West Africa', 'Французская Западная Африка', 'Französisch-Westafrika', '法属西非', 'África Occidental Francesa', 'फ़्रांसीसी पश्चिम अफ्रीका', 'إفريقيا الغربية الفرنسية', 'ফরাসি পশ্চিম আফ্রিকা', 'África Ocidental Francesa', 'フランス領西アフリカ', 'מערב אפריקה הצרפתית') },
  { id: 'french-equatorial-africa', region: 'africa', from: 1910, to: 1958, parent: 'fr', dependentKind: 'colony', difficulty: 'easy', successors: ['cg', 'ga', 'cf', 'td'], capital: city('Brazzaville', 'Браззавиль'), founded: 1910, wikidata: 'Q271894', names: n('French Equatorial Africa', 'Французская Экваториальная Африка', 'Französisch-Äquatorialafrika', '法属赤道非洲', 'África Ecuatorial Francesa', 'फ़्रांसीसी विषुवतीय अफ्रीका', 'إفريقيا الاستوائية الفرنسية', 'ফরাসি নিরক্ষীয় আফ্রিকা', 'África Equatorial Francesa', 'フランス領赤道アフリカ', 'אפריקה המשוונית הצרפתית') },
  { id: 'french-cameroons', region: 'africa', from: 1919, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'cm', capital: city('Yaoundé', 'Яунде'), founded: 1919, wikidata: 'Q650583' },
  { id: 'french-somaliland', region: 'africa', from: 1884, to: 1977, parent: 'fr', dependentKind: 'colony', iso: 'dj', capital: city('Djibouti', 'Джибути'), founded: 1884, wikidata: 'Q653721', names: n('French Somaliland', 'Французский берег Сомали', 'Französisch-Somaliland', '法属索马里', 'Somalilandia francesa', 'फ़्रांसीसी सोमालीलैंड', 'الصومال الفرنسي', 'ফরাসি সোমালিল্যান্ড', 'Somalilândia francesa', 'フランス領ソマリランド', 'סומלילנד הצרפתית') },
  { id: 'belgian-congo', region: 'africa', from: 1908, to: 1960, parent: 'be', dependentKind: 'colony', difficulty: 'easy', iso: 'cd', capital: city('Léopoldville', 'Леопольдвиль'), founded: 1908, wikidata: 'Q213510', names: n('Belgian Congo', 'Бельгийское Конго', 'Belgisch-Kongo', '比属刚果', 'Congo belga', 'बेल्जियन कांगो', 'الكونغو البلجيكية', 'বেলজীয় কঙ্গো', 'Congo Belga', 'ベルギー領コンゴ', 'קונגו הבלגית') },
  { id: 'british-east-africa', region: 'africa', from: 1895, to: 1920, parent: 'gb', dependentKind: 'colony', iso: 'ke', capital: city('Nairobi', 'Найроби'), founded: 1895, wikidata: 'Q918076', names: n('British East Africa', 'Британская Восточная Африка', 'Britisch-Ostafrika', '英属东非', 'África Oriental Británica', 'ब्रिटिश पूर्वी अफ्रीका', 'شرق إفريقيا البريطانية', 'ব্রিটিশ পূর্ব আফ্রিকা', 'África Oriental Britânica', 'イギリス領東アフリカ', 'מזרח אפריקה הבריטית') },
  { id: 'british-somaliland', region: 'africa', from: 1884, to: 1960, parent: 'gb', dependentKind: 'protectorate', iso: 'so', capital: city('Hargeisa', 'Харгейса'), founded: 1884, wikidata: 'Q837320', names: n('British Somaliland', 'Британское Сомали', 'Britisch-Somaliland', '英属索马里兰', 'Somalilandia británica', 'ब्रिटिश सोमालीलैंड', 'الصومال البريطاني', 'ব্রিটিশ সোমালিল্যান্ড', 'Somalilândia britânica', 'イギリス領ソマリランド', 'סומלילנד הבריטית') },
  { id: 'italian-somaliland', region: 'africa', from: 1889, to: 1960, parent: 'it', dependentKind: 'colony', iso: 'so', capital: city('Mogadishu', 'Могадишо'), founded: 1889, wikidata: 'Q242351', names: n('Italian Somaliland', 'Итальянское Сомали', 'Italienisch-Somaliland', '意属索马里', 'Somalilandia italiana', 'इतालवी सोमालीलैंड', 'الصومال الإيطالي', 'ইতালীয় সোমালিল্যান্ড', 'Somalilândia italiana', 'イタリア領ソマリランド', 'סומלילנד האיטלקית') },
  { id: 'german-e-africa-tanganyika', region: 'africa', from: 1885, to: 1919, parent: 'ge-emp', dependentKind: 'colony', successors: ['tz', 'rw', 'bi'], capital: city('Dar es Salaam', 'Дар-эс-Салам'), founded: 1885, wikidata: 'Q153963', names: n('German East Africa', 'Германская Восточная Африка', 'Deutsch-Ostafrika', '德属东非', 'África Oriental Alemana', 'जर्मन पूर्वी अफ्रीका', 'شرق إفريقيا الألمانية', 'জার্মান পূর্ব আফ্রিকা', 'África Oriental Alemã', 'ドイツ領東アフリカ', 'מזרח אפריקה הגרמנית') },
  { id: 'german-south-west-africa', region: 'africa', from: 1884, to: 1915, parent: 'ge-emp', dependentKind: 'colony', iso: 'na', capital: city('Windhoek', 'Виндхук'), founded: 1884, wikidata: 'Q153614', names: n('German South-West Africa', 'Германская Юго-Западная Африка', 'Deutsch-Südwestafrika', '德属西南非洲', 'África del Sudoeste Alemana', 'जर्मन दक्षिण-पश्चिम अफ्रीका', 'جنوب غرب إفريقيا الألمانية', 'জার্মান দক্ষিণ-পশ্চিম আফ্রিকা', 'Sudoeste Africano Alemão', 'ドイツ領南西アフリカ', 'דרום־מערב אפריקה הגרמנית') },
  { id: 'gold-coast', region: 'africa', from: 1821, to: 1957, parent: 'gb', dependentKind: 'colony', iso: 'gh', capital: city('Accra', 'Аккра'), founded: 1821, wikidata: 'Q503623', names: n('Gold Coast', 'Золотой Берег', 'Goldküste', '黄金海岸', 'Costa de Oro', 'गोल्ड कोस्ट', 'ساحل الذهب', 'গোল্ড কোস্ট', 'Costa do Ouro', 'ゴールド・コースト', 'חוף הזהב') },
  { id: 'anglo-egyptian-sudan', region: 'africa', from: 1899, to: 1956, parent: 'gb', dependentKind: 'colony', iso: 'sd', capital: city('Khartoum', 'Хартум'), founded: 1899, wikidata: 'Q207531', names: n('Anglo-Egyptian Sudan', 'Англо-Египетский Судан', 'Anglo-Ägyptischer Sudan', '英埃苏丹', 'Sudán anglo-egipcio', 'एंग्लो-मिस्री सूडान', 'السودان الإنجليزي المصري', 'অ্যাংলো-মিশরীয় সুদান', 'Sudão Anglo-Egípcio', '英埃領スーダン', 'סודאן האנגלו־מצרית') },
  { id: 'mandatory-palestine-gb', region: 'asia', from: 1920, to: 1948, parent: 'gb', dependentKind: 'colony', successors: ['il', 'jo', 'ps'], capital: city('Jerusalem', 'Иерусалим'), founded: 1920, wikidata: 'Q164387', names: n('Mandatory Palestine', 'Подмандатная Палестина', 'Völkerbundsmandat für Palästina', '英属巴勒斯坦托管地', 'Palestina mandataria', 'मैंडेटरी फिलिस्तीन', 'فلسطين الانتدابية', 'ম্যান্ডেটরি প্যালেস্টাইন', 'Palestina Mandatária', 'イギリス委任統治領パレスチナ', 'פלשתינה (א"י) המנדטורית') },
  { id: 'mesopotamia-gb', region: 'asia', from: 1920, to: 1932, parent: 'gb', dependentKind: 'colony', iso: 'iq', capital: city('Baghdad', 'Багдад'), founded: 1920, wikidata: 'Q192425', names: n('Mandatory Iraq', 'Подмандатный Ирак', 'Mandat Mesopotamien', '英属美索不达米亚', 'Mesopotamia británica', 'मैंडेटरी इराक', 'العراق الانتدابي', 'ম্যান্ডেটরি ইরাক', 'Mesopotâmia britânica', 'イギリス委任統治領イラク', 'עיראק המנדטורית') },
  { id: 'syria-france', region: 'asia', from: 1920, to: 1946, parent: 'fr', dependentKind: 'colony', successors: ['sy', 'lb'], capital: city('Damascus', 'Дамаск'), founded: 1920, wikidata: 'Q210141', names: n('French Mandate for Syria', 'Французский мандат в Сирии', 'Französisches Mandat Syrien', '法属叙利亚委任统治', 'Mandato francés de Siria', 'सीरिया का फ़्रांसीसी मैंडेट', 'الانتداب الفرنسي على سوريا', 'সিরিয়ার ফরাসি ম্যান্ডেট', 'Mandato francês da Síria', 'フランス委任統治領シリア', 'המנדט הצרפתי בסוריה') },
  { id: 'spanish-sahara', region: 'africa', from: 1884, to: 1975, parent: 'es', dependentKind: 'colony', successors: ['eh', 'ma'], capital: city('El Aaiún', 'Эль-Аюн'), founded: 1884, wikidata: 'Q763295', names: n('Spanish Sahara', 'Испанская Сахара', 'Spanisch-Sahara', '西属撒哈拉', 'Sáhara español', 'स्पेनी सहारा', 'الصحراء الإسبانية', 'স্পেনীয় সাহারা', 'Saara Espanhol', 'スペイン領サハラ', 'סהרה הספרדית') },
  { id: 'rio-de-oro', region: 'africa', from: 1884, to: 1975, parent: 'es', dependentKind: 'colony', successors: ['eh'], capital: city('Villa Cisneros', 'Вилья-Сиснерос'), founded: 1884, wikidata: 'Q1140991', names: n('Río de Oro', 'Рио-де-Оро', 'Río de Oro', '里奥德奥罗', 'Río de Oro', 'रियो दे ओरो', 'ريو دي أورو', 'রিও দে ওরো', 'Rio do Ouro', 'リオ・デ・オロ', 'ריו דה אורו') },
  { id: 'spanish-morocco', region: 'africa', from: 1912, to: 1956, parent: 'es', dependentKind: 'protectorate', iso: 'ma', capital: city('Tétouan', 'Тетуан'), founded: 1912, wikidata: 'Q1210213', names: n('Spanish Morocco', 'Испанское Марокко', 'Spanisch-Marokko', '西属摩洛哥', 'Marruecos español', 'स्पेनी मोरक्को', 'المغرب الإسباني', 'স্পেনীয় মরক্কো', 'Marrocos espanhol', 'スペイン領モロッコ', 'מרוקו הספרדית') },
  { id: 'spanish-guinea', region: 'africa', from: 1778, to: 1968, parent: 'es', dependentKind: 'colony', iso: 'gq', capital: city('Santa Isabel', 'Санта-Исабель'), founded: 1778, wikidata: 'Q916047', names: n('Spanish Guinea', 'Испанская Гвинея', 'Spanisch-Guinea', '西属几内亚', 'Guinea española', 'स्पेनी गिनी', 'غينيا الإسبانية', 'স্পেনীয় গিনি', 'Guiné Espanhola', 'スペイン領ギニア', 'גינאה הספרדית') },
  { id: 'trucial-oman', region: 'asia', from: 1820, to: 1971, parent: 'gb', dependentKind: 'protectorate', iso: 'ae', capital: city('Abu Dhabi', 'Абу-Даби'), founded: 1820, wikidata: 'Q315423', names: n('Trucial States', 'Договорный Оман', 'Vertragsoman', '特鲁西尔阿曼', 'Omán de la Tregua', 'ट्रूशियल ओमान', 'عمان المتصالحة', 'ট্রুসিয়াল ওমান', 'Omã da Trégua', '休戦オマーン', 'עומאן החוזה') },
  { id: 'dominion-of-newfoundland', region: 'americas', from: 1907, to: 1949, parent: 'gb', dependentKind: 'colony', iso: 'ca', capital: city('St. John\'s', 'Сент-Джонс'), founded: 1907, wikidata: 'Q182584', names: n('Dominion of Newfoundland', 'Доминион Ньюфаундленд', 'Dominion Neufundland', '纽芬兰自治领', 'Dominio de Terranova', 'न्यूफ़ाउंडलैंड डोमिनियन', 'دومينيون نيوفندلاند', 'নিউফাউন্ডল্যান্ড ডোমিনিয়ন', 'Domínio de Terra Nova', 'ニューファンドランド自治領', 'דומיניון ניופאונדלנד') },
  { id: 'sweden-norway', region: 'europe', from: 1814, to: 1905, parent: 'se', dependentKind: 'personal_union', successors: ['se', 'no'], capital: city('Stockholm / Christiania', 'Стокгольм / Христиания'), founded: 1814, flagIso: 'se', langs: ['sv', 'no'], wikidata: 'Q1096456', names: n('Sweden–Norway', 'Шведско-норвежская уния', 'Schweden-Norwegen', '瑞典–挪威联盟', 'Suecia-Noruega', 'स्वीडन–नॉर्वे', 'السويد-النرويج', 'সুইডেন–নরওয়ে', 'Suécia-Noruega', 'スウェーデン＝ノルウェー', 'שוודיה–נורווגיה') },
  { id: 'togoland', region: 'africa', from: 1884, to: 1916, parent: 'ge-emp', dependentKind: 'colony', iso: 'tg', capital: city('Lomé', 'Ломе'), founded: 1884, wikidata: 'Q161250', names: n('Togoland', 'Тоголенд', 'Togoland', '多哥兰', 'Togolandia', 'टोगोलैंड', 'توغولاند', 'টোগোল্যান্ড', 'Togolândia', 'トーゴランド', 'טוגולנד') },
  { id: 'kamerun', region: 'africa', from: 1884, to: 1916, parent: 'ge-emp', dependentKind: 'colony', iso: 'cm', capital: city('Buea', 'Буэа'), founded: 1884, wikidata: 'Q161406', names: n('Kamerun', 'Камерун (германский)', 'Kamerun', '德属喀麦隆', 'Kamerun', 'कैमरून (जर्मन)', 'كاميرون الألمانية', 'জার্মান কামেরুন', 'Kamerun', 'カメルーン（ドイツ領）', 'קאמרון הגרמנית') },
  { id: 'nyasaland', region: 'africa', from: 1907, to: 1964, parent: 'gb', dependentKind: 'protectorate', iso: 'mw', capital: city('Zomba', 'Зомба'), founded: 1907, wikidata: 'Q867568', names: n('Nyasaland', 'Ньясаленд', 'Njassaland', '尼亚萨兰', 'Nyasalandia', 'न्यासालैंड', 'نياسلاند', 'ন্যাসাল্যান্ড', 'Niassalândia', 'ニアサランド', 'ניאסאלנד') },
  { id: 'northern-rhodesia', region: 'africa', from: 1911, to: 1964, parent: 'gb', dependentKind: 'colony', iso: 'zm', capital: city('Lusaka', 'Лусака'), founded: 1911, wikidata: 'Q953987', names: n('Northern Rhodesia', 'Северная Родезия', 'Nordrhodesien', '北罗得西亚', 'Rodesia del Norte', 'उत्तरी रोडेशिया', 'روديسيا الشمالية', 'উত্তর রোডেশিয়া', 'Rodésia do Norte', '北ローデシア', 'רודזיה הצפונית') },
  { id: 'southern-rhodesia', region: 'africa', from: 1923, to: 1965, parent: 'gb', dependentKind: 'colony', iso: 'zw', capital: city('Salisbury', 'Солсбери'), founded: 1923, wikidata: 'Q750583', names: n('Southern Rhodesia', 'Южная Родезия', 'Südrhodesien', '南罗得西亚', 'Rodesia del Sur', 'दक्षिणी रोडेशिया', 'روديسيا الجنوبية', 'দক্ষিণ রোডেশিয়া', 'Rodésia do Sul', '南ローデシア', 'רודזיה הדרומית') },
  { id: 'basutoland', region: 'africa', from: 1868, to: 1966, parent: 'gb', dependentKind: 'protectorate', iso: 'ls', capital: city('Maseru', 'Масеру'), founded: 1868, wikidata: 'Q817350', names: n('Basutoland', 'Басутоленд', 'Basutoland', '巴苏陀兰', 'Basutolandia', 'बासुटोलैंड', 'باسوتولاند', 'বাসুতোল্যান্ড', 'Basutolândia', 'バストゥランド', 'בסותולנד') },
  { id: 'malaya', region: 'asia', from: 1826, to: 1957, parent: 'gb', dependentKind: 'colony', iso: 'my', capital: city('Kuala Lumpur', 'Куала-Лумпур'), founded: 1826, wikidata: 'Q1369864', names: n('British Malaya', 'Британская Малайя', 'Britisch-Malaya', '英属马来亚', 'Malaya británica', 'ब्रिटिश मलाया', 'الملايو البريطانية', 'ব্রিটিশ মালয়া', 'Malaia britânica', 'イギリス領マラヤ', 'מלאיה הבריטית') },
  { id: 'annam', region: 'asia', from: 1802, to: 1945, parent: 'fr', dependentKind: 'protectorate', iso: 'vn', capital: city('Huế', 'Хюэ'), founded: 1802, wikidata: 'Q1088964', names: n('Annam', 'Аннам', 'Annam', '安南', 'Annam', 'अन्नाम', 'أنام', 'আনাম', 'Annam', 'アンナン', 'אנאם') },
  { id: 'cochin-china', region: 'asia', from: 1862, to: 1949, parent: 'fr', dependentKind: 'colony', iso: 'vn', capital: city('Saigon', 'Сайгон'), founded: 1862, wikidata: 'Q1060127', names: n('Cochinchina', 'Кохинхина', 'Kochinchina', '交趾支那', 'Cochinchina', 'कोचीनचीन', 'كوكوشينشينا', 'কোচিনচিন', 'Cochinchina', 'コーチシナ', 'קוצ׳ינצ׳ינה') },
  { id: 'tonkin', region: 'asia', from: 1884, to: 1945, parent: 'fr', dependentKind: 'protectorate', iso: 'vn', capital: city('Hanoi', 'Ханой'), founded: 1884, wikidata: 'Q1192922', names: n('Tonkin', 'Тонкин', 'Tonkin', '东京（北圻）', 'Tonkín', 'टोंकिन', 'تونكين', 'টনকিন', 'Tonquim', 'トンキン', 'טונקין') },
  { id: 'muscat-and-oman', region: 'asia', from: 1820, to: 1970, parent: 'gb', dependentKind: 'protectorate', iso: 'om', capital: city('Muscat', 'Маскат'), founded: 1820, wikidata: 'Q2066866', names: n('Muscat and Oman', 'Маскат и Оман', 'Maskat und Oman', '马斯喀特和阿曼', 'Mascate y Omán', 'मस्कट और ओमान', 'مسقط وعمان', 'মাস্কাট ও ওমান', 'Mascate e Omão', 'マスカット・オマーン', 'מוסקט ועומאן') },
  { id: 'new-hebrides', region: 'oceania', from: 1906, to: 1980, parent: 'gb', dependentKind: 'colony', iso: 'vu', capital: city('Port Vila', 'Порт-Вила'), founded: 1906, wikidata: 'Q668274', names: n('New Hebrides', 'Новые Гебриды', 'Neue Hebriden', '新赫布里底', 'Nuevas Hébridas', 'न्यू हेब्रिडीज़', 'هبريدس الجديدة', 'নিউ হেব্রিডিজ', 'Novas Hébridas', 'ニューヘブリディーズ', 'הברידים החדשים') },
  { id: 'new-caledonia', region: 'oceania', from: 1853, to: null, parent: 'fr', dependentKind: 'colony', iso: 'nc', capital: city('Nouméa', 'Нумеа'), founded: 1853, wikidata: 'Q33788' },
  { id: 'saar-protectorate', region: 'europe', from: 1947, to: 1956, parent: 'fr', dependentKind: 'protectorate', iso: 'de', capital: city('Saarbrücken', 'Саарбрюккен'), founded: 1947, wikidata: 'Q310022', names: n('Saar Protectorate', 'Саарский протекторат', 'Saarprotektorat', '萨尔保护领', 'Protectorado del Sarre', 'सार संरक्षित राज्य', 'محمية السار', 'জার প্রোটেক্টরেট', 'Protetorado do Sarre', 'ザール保護領', 'חבל הסאר') },
  { id: 'dutch-guiana', region: 'americas', from: 1667, to: 1975, parent: 'nl', dependentKind: 'colony', iso: 'sr', capital: city('Paramaribo', 'Парамарибо'), founded: 1667, wikidata: 'Q764630', names: n('Dutch Guiana', 'Нидерландская Гвиана', 'Niederländisch-Guayana', '荷属圭亚那', 'Guayana neerlandesa', 'डच गयाना', 'غويانا الهولندية', 'ডাচ গায়ানা', 'Guiana Neerlandesa', 'オランダ領ギアナ', 'גיאנה ההולנדית') },
  { id: 'dodecanese-islands', region: 'europe', from: 1912, to: 1947, parent: 'it', dependentKind: 'colony', iso: 'gr', capital: city('Rhodes', 'Родос'), founded: 1912, wikidata: 'Q1232587', names: n('Italian Dodecanese', 'Итальянский Додеканес', 'Italienische Dodekanes', '意属十二群岛', 'Dodecaneso italiano', 'इतालवी डोडेकेनीज़', 'دوديكانيسيا الإيطالية', 'ইতালীয় ডোডেকানিজ', 'Dodecaneso italiano', 'イタリア領ドデカネス', 'הדודקאנס האיטלקי') },
  { id: 'natal', region: 'africa', from: 1843, to: 1910, parent: 'gb', dependentKind: 'colony', iso: 'za', capital: city('Pietermaritzburg', 'Питермарицбург'), founded: 1843, wikidata: 'Q61332', names: n('Colony of Natal', 'Наталь', 'Natal', '纳塔尔殖民地', 'Natal', 'नेटाल', 'ناتال', 'নাটাল', 'Natal', 'ナタール植民地', 'נטאל') },
  { id: 'new-south-wales-uk', region: 'oceania', from: 1788, to: 1901, parent: 'gb', dependentKind: 'colony', iso: 'au', capital: city('Sydney', 'Сидней'), founded: 1788, wikidata: 'Q3224', names: n('New South Wales', 'Новый Южный Уэльс', 'New South Wales', '新南威尔士', 'Nueva Gales del Sur', 'न्यू साउथ वेल्स', 'نيو ساوث ويلز', 'নিউ সাউথ ওয়েলস', 'Nova Gales do Sul', 'ニューサウスウェールズ', 'ניו סאות׳ ויילס') },
  { id: 'queensland-uk', region: 'oceania', from: 1859, to: 1901, parent: 'gb', dependentKind: 'colony', iso: 'au', capital: city('Brisbane', 'Брисбен'), founded: 1859, names: n('Queensland', 'Квинсленд', 'Queensland', '昆士兰', 'Queensland', 'क्वींसलैंड', 'كوينزلاند', 'কুইন্সল্যান্ড', 'Queensland', 'クイーンズランド', 'קווינסלנד') },
  { id: 'south-australia-uk', region: 'oceania', from: 1836, to: 1901, parent: 'gb', dependentKind: 'colony', iso: 'au', capital: city('Adelaide', 'Аделаида'), founded: 1836, names: n('South Australia', 'Южная Австралия', 'Südaustralien', '南澳大利亚', 'Australia Meridional', 'दक्षिण ऑस्ट्रेलिया', 'جنوب أستراليا', 'দক্ষিণ অস্ট্রেলিয়া', 'Austrália do Sul', '南オーストラリア', 'דרום אוסטרליה') },
  { id: 'western-australia-uk', region: 'oceania', from: 1829, to: 1901, parent: 'gb', dependentKind: 'colony', iso: 'au', capital: city('Perth', 'Перт'), founded: 1829, names: n('Western Australia', 'Западная Австралия', 'Westaustralien', '西澳大利亚', 'Australia Occidental', 'पश्चिमी ऑस्ट्रेलिया', 'غرب أستراليا', 'পশ্চিম অস্ট্রেলিয়া', 'Austrália Ocidental', '西オーストラリア', 'מערב אוסট্রליה') },
  { id: 'victoria-uk', region: 'oceania', from: 1851, to: 1901, parent: 'gb', dependentKind: 'colony', iso: 'au', capital: city('Melbourne', 'Мельбурн'), founded: 1851, names: n('Victoria', 'Виктория', 'Victoria', '维多利亚（澳）', 'Victoria', 'विक्टोरिया', 'فيكتوريا', 'ভিক্টোরিয়া', 'Vitória', 'ビクトリア（豪）', 'ויקטוריה') },
  { id: 'northern-territory-uk', region: 'oceania', from: 1863, to: 1901, parent: 'gb', dependentKind: 'colony', iso: 'au', capital: city('Palmerston / Darwin', 'Палмерстон / Дарвин'), founded: 1863, names: n('Northern Territory', 'Северная территория', 'Northern Territory', '北领地', 'Territorio del Norte', 'उत्तरी क्षेत्र', 'الإقليم الشمالي', 'উত্তরাঞ্চল', 'Território do Norte', 'ノーザンテリトリー', 'הטריטוריה הצפונית') },
  { id: 'germany-usa', region: 'europe', from: 1945, to: 1949, parent: 'us', dependentKind: 'colony', iso: 'de', capital: city('Frankfurt'), founded: 1945, names: n('American occupation zone (Germany)', 'Американская зона оккупации Германии', 'Amerikanische Besatzungszone', '德国美占区', 'Zona de ocupación estadounidense', 'जर्मनी का अमेरिकी अधिभोग क्षेत्र', 'منطقة الاحتلال الأمريكي في ألمانيا', 'জার্মানির মার্কিন দখল অঞ্চল', 'Zona de ocupação americana', 'ドイツ米軍占領地区', 'אזור הכיבוש האמריקאי בגרמניה') },
  { id: 'germany-uk', region: 'europe', from: 1945, to: 1949, parent: 'gb', dependentKind: 'colony', iso: 'de', capital: city('Bad Oeynhausen'), founded: 1945, names: n('British occupation zone (Germany)', 'Британская зона оккупации Германии', 'Britische Besatzungszone', '德国英占区', 'Zona de ocupación británica', 'जर्मनी का ब्रिटिश अधिभोग क्षेत्र', 'منطقة الاحتلال البريطاني في ألمانيا', 'জার্মানির ব্রিটিশ দখল অঞ্চল', 'Zona de ocupação britânica', 'ドイツ英軍占領地区', 'אזור הכיבוש הבריטי בגרמניה') },
  { id: 'germany-france', region: 'europe', from: 1945, to: 1949, parent: 'fr', dependentKind: 'colony', iso: 'de', capital: city('Baden-Baden'), founded: 1945, names: n('French occupation zone (Germany)', 'Французская зона оккупации Германии', 'Französische Besatzungszone', '德国法占区', 'Zona de ocupación francesa', 'जर्मनी का फ़्रांसीसी अधिभोग क्षेत्र', 'منطقة الاحتلال الفرنسي في ألمانيا', 'জার্মানির ফরাসি দখল অঞ্চল', 'Zona de ocupação francesa', 'ドイツ仏軍占領地区', 'אזור הכיבוש הצרפתי בגרמניה') },
  { id: 'germany-soviet', region: 'europe', from: 1945, to: 1949, parent: 'su', dependentKind: 'colony', iso: 'dd', flagIso: 'su', capital: city('East Berlin', 'Восточный Берлин'), founded: 1945, names: n('Soviet occupation zone (Germany)', 'Советская зона оккупации Германии', 'Sowjetische Besatzungszone', '德国苏占区', 'Zona de ocupación soviética', 'जर्मनी का सोवियत अधिभोग क्षेत्र', 'منطقة الاحتلال السوفيتي في ألمانيا', 'জার্মানির সোভিয়েত দখল অঞ্চল', 'Zona de ocupação soviética', 'ドイツソ連占領地区', 'אזור הכיבוש הסובייטי בגרמניה') },
  { id: 'japan-usa', region: 'asia', from: 1945, to: 1952, parent: 'us', dependentKind: 'colony', iso: 'jp', capital: city('Tokyo', 'Токио'), founded: 1945, names: n('Occupied Japan', 'Оккупированная Япония', 'Besetztes Japan', '盟军占领日本', 'Japón ocupado', 'अधिकृत जापान', 'اليابان المحتلة', 'দখলকৃত জাপান', 'Japão ocupado', '占領下の日本', 'יפן הכבושה') },
  { id: 'korea-usa', region: 'asia', from: 1945, to: 1948, parent: 'us', dependentKind: 'colony', iso: 'kr', capital: city('Seoul', 'Сеул'), founded: 1945, names: n('US occupation of Korea', 'Американская оккупация Кореи', 'US-Besatzung Koreas', '美军占领朝鲜南部', 'Ocupación estadounidense de Corea', 'कोरिया का अमेरिकी अधिभोग', 'الاحتلال الأمريكي لكوريا', 'কোরিয়ার মার্কিন দখল', 'Ocupação americana da Coreia', 'アメリカ軍政庁（朝鮮）', 'הכיבוש האמריקאי בקוריאה') },
  { id: 'korea-ussr', region: 'asia', from: 1945, to: 1948, parent: 'su', dependentKind: 'colony', iso: 'kp', flagIso: 'su', capital: city('Pyongyang', 'Пхеньян'), founded: 1945, names: n('Soviet occupation of Korea', 'Советская оккупация Кореи', 'Sowjetische Besatzung Koreas', '苏军占领朝鲜北部', 'Ocupación soviética de Corea', 'कोरिया का सोवियत अधिभोग', 'الاحتلال السوفيتي لكوريا', 'কোরিয়ার সোভিয়েত দখল', 'Ocupação soviética da Coreia', 'ソ連軍政（朝鮮）', 'הכיבוש הסובייטי בקוריאה') },
  { id: 'cyraneica-uk-lybia', region: 'africa', from: 1943, to: 1951, parent: 'gb', dependentKind: 'colony', iso: 'ly', capital: city('Benghazi', 'Бенгази'), founded: 1943, names: n('Cyrenaica (British Libya)', 'Киренаика (брит. Ливия)', 'Cyrenaika (britisches Libyen)', '昔兰尼加（英占利比亚）', 'Cirenaica (Libia británica)', 'साइरेनिका (ब्रिटिश लीबिया)', 'برقة (ليبيا البريطانية)', 'সাইরেনাইকা (ব্রিটিশ লিবিয়া)', 'Cirenaica (Líbia britânica)', 'キレナイカ（英領リビア）', 'קירנאיקה (לוב הבריטית)') },
  { id: 'tripolitana-uk-lybia', region: 'africa', from: 1943, to: 1951, parent: 'gb', dependentKind: 'colony', iso: 'ly', capital: city('Tripoli', 'Триполи'), founded: 1943, names: n('Tripolitania (British Libya)', 'Триполитания (брит. Ливия)', 'Tripolitanien (britisches Libyen)', '的黎波里塔尼亚（英占利比亚）', 'Tripolitania (Libia británica)', 'त्रिपोलितानिया (ब्रिटिश लीबिया)', 'طرابلس (ليبيا البريطانية)', 'ত্রিপোলিটানিয়া (ব্রিটিশ লিবিয়া)', 'Tripolitânia (Líbia britânica)', 'トリポリタニア（英領リビア）', 'טריפוליטניה (לוב הבריטית)') },
  { id: 'fezzan-frech-lybia', region: 'africa', from: 1943, to: 1951, parent: 'fr', dependentKind: 'colony', iso: 'ly', capital: city('Sabha', 'Сабха'), founded: 1943, names: n('Fezzan (French Libya)', 'Феццан (франц. Ливия)', 'Fessan (französisches Libyen)', '费赞（法占利比亚）', 'Fezán (Libia francesa)', 'फेज़ान (फ़्रांसीसी लीबिया)', 'فزان (ليبيا الفرنسية)', 'ফেজান (ফরাসি লিবিয়া)', 'Fezã (Líbia francesa)', 'フェザーン（仏領リビア）', 'פזאן (לוב הצרפתית)') },
  { id: 'yemen-uk', region: 'asia', from: 1839, to: 1967, parent: 'gb', dependentKind: 'colony', iso: 'ye', capital: city('Aden', 'Аден'), founded: 1839, names: n('Aden Protectorate', 'Протекторат Аден', 'Protektorat Aden', '亚丁保护地', 'Protectorado de Adén', 'अदन संरक्षित राज्य', 'محمية عدن', 'এডেন প্রোটেক্টরেট', 'Protectorado de Áden', 'アデン保護領', 'חסות עדן') },
  { id: 'hong-kong', region: 'asia', from: 1800, to: 1997, parent: 'gb', dependentKind: 'colony', iso: 'hk', capital: city('Victoria / Hong Kong', 'Виктория / Гонконг'), founded: 1842, wikidata: 'Q1055853' },
  { id: 'puerto-rico', region: 'americas', from: 1898, to: null, parent: 'us', dependentKind: 'colony', iso: 'pr', capital: city('San Juan', 'Сан-Хуан'), founded: 1898, wikidata: 'Q1183' },
  { id: 'french-guiana', region: 'americas', from: 1667, to: null, parent: 'fr', dependentKind: 'colony', iso: 'gf', capital: city('Cayenne', 'Кайенна'), founded: 1667, wikidata: 'Q3769' },
  { id: 'greenland', region: 'americas', from: 1721, to: null, parent: 'dk', dependentKind: 'colony', iso: 'gl', capital: city('Godthåb / Nuuk', 'Готхоб / Нуук'), founded: 1721, wikidata: 'Q223' },
  { id: 'guadeloupe', region: 'americas', from: 1635, to: null, parent: 'fr', dependentKind: 'colony', iso: 'gp', capital: city('Basse-Terre', 'Бас-Тер'), founded: 1635, wikidata: 'Q17012' },
  { id: 'martinique', region: 'americas', from: 1635, to: null, parent: 'fr', dependentKind: 'colony', iso: 'mq', capital: city('Fort-de-France', 'Фор-де-Франс'), founded: 1635, wikidata: 'Q17054' },
  { id: 'algeria', region: 'africa', from: 1830, to: 1962, parent: 'fr', dependentKind: 'colony', difficulty: 'easy', iso: 'dz', capital: city('Algiers', 'Алжир'), founded: 1830, wikidata: 'Q218272' },
  { id: 'angola', region: 'africa', from: 1575, to: 1975, parent: 'pt', dependentKind: 'colony', iso: 'ao', capital: city('Luanda', 'Луанда'), founded: 1575, wikidata: 'Q215750' },
  { id: 'mozambique', region: 'africa', from: 1505, to: 1975, parent: 'pt', dependentKind: 'colony', iso: 'mz', capital: city('Lourenço Marques', 'Лоренсу-Маркиш'), founded: 1505 },
  { id: 'nigeria', region: 'africa', from: 1914, to: 1960, parent: 'gb', dependentKind: 'colony', difficulty: 'easy', iso: 'ng', capital: city('Lagos', 'Лагос'), founded: 1914, wikidata: 'Q668294' },
  { id: 'kenya', region: 'africa', from: 1920, to: 1963, parent: 'gb', dependentKind: 'colony', iso: 'ke', capital: city('Nairobi', 'Найроби'), founded: 1920, wikidata: 'Q329948' },
  { id: 'uganda', region: 'africa', from: 1894, to: 1962, parent: 'gb', dependentKind: 'protectorate', iso: 'ug', capital: city('Entebbe / Kampala', 'Энтеббе / Кампала'), founded: 1894 },
  { id: 'tanzania-united-republic-of', region: 'africa', from: 1919, to: 1961, parent: 'gb', dependentKind: 'colony', iso: 'tz', capital: city('Dar es Salaam', 'Дар-эс-Салам'), founded: 1919, names: n('Tanganyika', 'Танганьика', 'Tanganjika', '坦噶尼喀', 'Tanganica', 'तांगानिका', 'تنجانيقا', 'টাঙ্গানিকা', 'Tanganica', 'タンガニーカ', 'טנגניקה') },
  { id: 'sudan', region: 'africa', from: 1899, to: 1956, parent: 'gb', dependentKind: 'colony', iso: 'sd', capital: city('Khartoum', 'Хартум') },
  { id: 'tunisia', region: 'africa', from: 1881, to: 1956, parent: 'fr', dependentKind: 'protectorate', iso: 'tn', capital: city('Tunis', 'Тунис'), founded: 1881, wikidata: 'Q62447' },
  { id: 'libya', region: 'africa', from: 1911, to: 1951, parent: 'it', dependentKind: 'colony', iso: 'ly', capital: city('Tripoli', 'Триполи'), founded: 1911, wikidata: 'Q67365' },
  { id: 'madagascar', region: 'africa', from: 1896, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'mg', capital: city('Antananarivo', 'Антананариву'), founded: 1896 },
  { id: 'ivory-coast', region: 'africa', from: 1893, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'ci', capital: city('Abidjan', 'Абиджан') },
  { id: 'benin', region: 'africa', from: 1894, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'bj', capital: city('Porto-Novo', 'Порто-Ново') },
  { id: 'gabon', region: 'africa', from: 1885, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'ga', capital: city('Libreville', 'Либревиль') },
  { id: 'congo', region: 'africa', from: 1880, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'cg', capital: city('Brazzaville', 'Браззавиль') },
  { id: 'chad', region: 'africa', from: 1900, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'td', capital: city("N'Djamena", 'Нджамена') },
  { id: 'central-african-republic', region: 'africa', from: 1903, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'cf', capital: city('Bangui', 'Банги') },
  { id: 'mali', region: 'africa', from: 1892, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'ml', capital: city('Bamako', 'Бамако') },
  { id: 'mauritania', region: 'africa', from: 1903, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'mr', capital: city('Saint-Louis / Nouakchott', 'Сен-Луи / Нуакшот') },
  { id: 'niger', region: 'africa', from: 1922, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'ne', capital: city('Niamey', 'Ниамей') },
  { id: 'burkina-faso', region: 'africa', from: 1919, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'bf', capital: city('Ouagadougou', 'Уагадугу') },
  { id: 'guinea', region: 'africa', from: 1891, to: 1958, parent: 'fr', dependentKind: 'colony', iso: 'gn', capital: city('Conakry', 'Конакри') },
  { id: 'cameroon', region: 'africa', from: 1919, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'cm', capital: city('Yaoundé', 'Яунде') },
  { id: 'togo', region: 'africa', from: 1916, to: 1960, parent: 'fr', dependentKind: 'colony', iso: 'tg', capital: city('Lomé', 'Ломе') },
  { id: 'djibouti', region: 'africa', from: 1884, to: 1977, parent: 'fr', dependentKind: 'colony', iso: 'dj', capital: city('Djibouti', 'Джибути') },
  { id: 'morocco-france', region: 'africa', from: 1912, to: 1956, parent: 'fr', dependentKind: 'protectorate', iso: 'ma', capital: city('Rabat', 'Рабат'), founded: 1912, names: n('French Morocco', 'Французское Марокко', 'Französisch-Marokko', '法属摩洛哥', 'Marruecos francés', 'फ़्रांसीसी मोरक्को', 'المغرب الفرنسي', 'ফরাসি মরক্কো', 'Marrocos francês', 'フランス領モロッコ', 'מרוקו הצרפתית') },
  { id: 'botswana', region: 'africa', from: 1885, to: 1966, parent: 'gb', dependentKind: 'protectorate', iso: 'bw', capital: city('Mafeking / Gaborone', 'Мафекинг / Габороне') },
  { id: 'lesotho', region: 'africa', from: 1868, to: 1966, parent: 'gb', dependentKind: 'protectorate', iso: 'ls', capital: city('Maseru', 'Масеру') },
  { id: 'swaziland', region: 'africa', from: 1903, to: 1968, parent: 'gb', dependentKind: 'protectorate', iso: 'sz', capital: city('Mbabane', 'Мбабане') },
  { id: 'malawi', region: 'africa', from: 1891, to: 1964, parent: 'gb', dependentKind: 'protectorate', iso: 'mw', capital: city('Zomba', 'Зомба') },
  { id: 'zambia', region: 'africa', from: 1911, to: 1964, parent: 'gb', dependentKind: 'colony', iso: 'zm', capital: city('Lusaka', 'Лусака') },
  { id: 'zimbabwe', region: 'africa', from: 1923, to: 1965, parent: 'gb', dependentKind: 'colony', iso: 'zw', capital: city('Salisbury', 'Солсбери') },
  { id: 'sierra-leone', region: 'africa', from: 1808, to: 1961, parent: 'gb', dependentKind: 'colony', iso: 'sl', capital: city('Freetown', 'Фритаун') },
  { id: 'gambia-the', region: 'africa', from: 1821, to: 1965, parent: 'gb', dependentKind: 'colony', iso: 'gm', capital: city('Bathurst', 'Батерст') },
  { id: 'ghana', region: 'africa', from: 1821, to: 1957, parent: 'gb', dependentKind: 'colony', iso: 'gh', capital: city('Accra', 'Аккра') },
  { id: 'namibia', region: 'africa', from: 1915, to: 1990, parent: 'za', dependentKind: 'colony', iso: 'na', capital: city('Windhoek', 'Виндхук') },
  { id: 'rwanda', region: 'africa', from: 1916, to: 1962, parent: 'be', dependentKind: 'colony', iso: 'rw', capital: city('Kigali', 'Кигали') },
  { id: 'burundi', region: 'africa', from: 1916, to: 1962, parent: 'be', dependentKind: 'colony', iso: 'bi', capital: city('Usumbura', 'Усумбура') },
  { id: 'eritrea', region: 'africa', from: 1890, to: 1941, parent: 'it', dependentKind: 'colony', iso: 'er', capital: city('Asmara', 'Асмэра'), founded: 1890, wikidata: 'Q677516' },
  { id: 'ethiopia-italy', region: 'africa', from: 1936, to: 1941, parent: 'it', dependentKind: 'colony', iso: 'et', capital: city('Addis Ababa', 'Аддис-Абеба'), founded: 1936, names: n('Italian East Africa (Ethiopia)', 'Итальянская Восточная Африка', 'Italienisch-Ostafrika', '意属埃塞俄比亚', 'África Oriental Italiana', 'इतालवी पूर्वी अफ्रीका', 'شرق إفريقيا الإيطالية', 'ইতালীয় পূর্ব আফ্রিকা', 'África Oriental Italiana', 'イタリア領東アフリカ', 'מזרח אפריקה האיטלקית') },
  { id: 'somalia', region: 'africa', from: 1889, to: 1960, parent: 'it', dependentKind: 'colony', iso: 'so', capital: city('Mogadishu', 'Могадишо') },
  { id: 'equatorial-guinea', region: 'africa', from: 1778, to: 1968, parent: 'es', dependentKind: 'colony', iso: 'gq', capital: city('Santa Isabel', 'Санта-Исабель') },
  { id: 'guinea-bissau', region: 'africa', from: 1879, to: 1974, parent: 'pt', dependentKind: 'colony', iso: 'gw', capital: city('Bissau', 'Бисау') },
  { id: 'belize', region: 'americas', from: 1862, to: 1981, parent: 'gb', dependentKind: 'colony', iso: 'bz', capital: city('Belize Town', 'Белиз') },
  { id: 'guyana', region: 'americas', from: 1814, to: 1966, parent: 'gb', dependentKind: 'colony', iso: 'gy', capital: city('Georgetown', 'Джорджтаун') },
  { id: 'suriname', region: 'americas', from: 1667, to: 1975, parent: 'nl', dependentKind: 'colony', iso: 'sr', capital: city('Paramaribo', 'Парамарибо') },
  { id: 'jamaica', region: 'americas', from: 1655, to: 1962, parent: 'gb', dependentKind: 'colony', iso: 'jm', capital: city('Kingston', 'Кингстон') },
  { id: 'trinidad', region: 'americas', from: 1797, to: 1962, parent: 'gb', dependentKind: 'colony', iso: 'tt', capital: city('Port of Spain', 'Порт-оф-Спейн') },
  { id: 'dominica', region: 'americas', from: 1763, to: 1978, parent: 'gb', dependentKind: 'colony', iso: 'dm', capital: city('Roseau', 'Розо') },
  { id: 'saint-lucia', region: 'americas', from: 1814, to: 1979, parent: 'gb', dependentKind: 'colony', iso: 'lc', capital: city('Castries', 'Кастри') },
  { id: 'fiji', region: 'oceania', from: 1874, to: 1970, parent: 'gb', dependentKind: 'colony', iso: 'fj', capital: city('Suva', 'Сува') },
  { id: 'samoa', region: 'oceania', from: 1899, to: 1962, parent: 'nz', dependentKind: 'colony', iso: 'ws', flagIso: 'gb', capital: city('Apia', 'Апиа'), langs: ['en'] },
  { id: 'papua-new-guinea', region: 'oceania', from: 1884, to: 1975, parent: 'au', dependentKind: 'colony', iso: 'pg', capital: city('Port Moresby', 'Порт-Морсби') },
  { id: 'brunei', region: 'asia', from: 1888, to: 1984, parent: 'gb', dependentKind: 'protectorate', iso: 'bn', capital: city('Brunei Town', 'Бруней-Таун') },
  { id: 'qatar', region: 'asia', from: 1878, to: 1971, parent: 'gb', dependentKind: 'protectorate', iso: 'qa', capital: city('Doha', 'Доха') },
  { id: 'kuwait', region: 'asia', from: 1899, to: 1961, parent: 'gb', dependentKind: 'protectorate', iso: 'kw', capital: city('Kuwait City', 'Эль-Кувейт') },
  { id: 'united-arab-emirates', region: 'asia', from: 1820, to: 1971, parent: 'gb', dependentKind: 'protectorate', iso: 'ae', capital: city('Abu Dhabi', 'Абу-Даби') },
  { id: 'oman', region: 'asia', from: 1891, to: 1970, parent: 'gb', dependentKind: 'protectorate', iso: 'om', capital: city('Muscat', 'Маскат') },
  { id: 'iraq', region: 'asia', from: 1920, to: 1932, parent: 'gb', dependentKind: 'colony', iso: 'iq', capital: city('Baghdad', 'Багдад') },
  { id: 'jordan', region: 'asia', from: 1921, to: 1946, parent: 'gb', dependentKind: 'colony', iso: 'jo', capital: city('Amman', 'Амман') },
  { id: 'lebanon', region: 'asia', from: 1920, to: 1943, parent: 'fr', dependentKind: 'colony', iso: 'lb', capital: city('Beirut', 'Бейрут') },
  { id: 'syria', region: 'asia', from: 1920, to: 1946, parent: 'fr', dependentKind: 'colony', iso: 'sy', capital: city('Damascus', 'Дамаск') },
  { id: 'laos', region: 'asia', from: 1893, to: 1953, parent: 'fr', dependentKind: 'protectorate', iso: 'la', capital: city('Vientiane', 'Вьентьян') },
  { id: 'malaysia', region: 'asia', from: 1826, to: 1957, parent: 'gb', dependentKind: 'colony', iso: 'my', capital: city('Kuala Lumpur', 'Куала-Лумпур') },
  { id: 'burma', region: 'asia', from: 1886, to: 1948, parent: 'gb', dependentKind: 'colony', iso: 'mm', capital: city('Rangoon', 'Рангун'), names: n('British Burma', 'Британская Бирма', 'Britisch-Burma', '英属缅甸', 'Birmania británica', 'ब्रिटिश बर्मा', 'بورما البريطانية', 'ব্রিটিশ বর্মা', 'Birmânia britânica', 'イギリス領ビルマ', 'בורמה הבריטית') },
  { id: 'india', region: 'asia', from: 1858, to: 1947, parent: 'gb', dependentKind: 'colony', iso: 'in', capital: city('Calcutta / New Delhi', 'Калькутта / Нью-Дели') },
  { id: 'indonesia', region: 'asia', from: 1800, to: 1949, parent: 'nl', dependentKind: 'colony', iso: 'id', capital: city('Batavia', 'Батавия') },
  { id: 'sri-lanka', region: 'asia', from: 1815, to: 1948, parent: 'gb', dependentKind: 'colony', iso: 'lk', capital: city('Colombo', 'Коломбо') },
  { id: 'cyprus', region: 'europe', from: 1878, to: 1960, parent: 'gb', dependentKind: 'colony', iso: 'cy', capital: city('Nicosia', 'Никосия') },
  { id: 'taiwan', region: 'asia', from: 1895, to: 1945, parent: 'jp', dependentKind: 'colony', iso: 'tw', capital: city('Taihoku / Taipei', 'Тайхоку / Тайбэй'), langs: ['ja'] },
  { id: 'israel', region: 'asia', from: 1920, to: 1948, parent: 'gb', dependentKind: 'colony', iso: 'il', capital: city('Jerusalem', 'Иерусалим') },
  { id: 'zaire', region: 'africa', from: 1885, to: 1960, parent: 'be', dependentKind: 'colony', iso: 'cd', capital: city('Léopoldville', 'Леопольдвиль') },
]

const built = SPECS.map(build)

export const RAW_MAP_DEPENDENTS: Omit<Polity, 'wikidata' | 'marker'>[] = built.map((item) => item.polity)

export const MAP_DEPENDENT_PASSPORTS: Record<string, PolityPassport> = Object.fromEntries(
  built.map((item) => [item.polity.id, item.passport]),
)

export const MAP_DEPENDENT_WIKIDATA: Record<string, string> = Object.fromEntries(
  built.flatMap((item) => (item.wikidata ? [[item.polity.id, item.wikidata]] : [])),
)

/** Map polygon ids that should open an existing polity card. */
export const MAP_DEPENDENT_ALIASES: Record<string, string> = {
  'netherlands-indies': 'dutch-east-indies',
  ceylon: 'ceylon-dutch',
  'french-indo-china': 'french-indochina',
  'algeria-fr': 'algeria',
  'algeria-france': 'algeria',
  'senegal-fr': 'senegal',
  'angola-portugal': 'angola',
  'mozambique-portugal': 'mozambique',
  'guinea-bissau-portugal': 'guinea-bissau',
  'madagascar-france': 'madagascar',
  'wattasid-caliphate': 'ma',
  'watassid-morocco': 'ma',
  'wattasid-morocco': 'ma',
  'gold-coast-gb': 'gold-coast',
  'libya-it': 'libya',
  'eritrea-italy': 'eritrea',
  'congo-france': 'congo',
  'rwanda-belgium': 'rwanda',
  'zaire-belgium': 'belgian-congo',
  'jamaica-uk': 'jamaica',
  'martinique-france': 'martinique',
  gambia: 'gambia-the',
  'oman-british-raj': 'oman',
}
