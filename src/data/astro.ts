import type { Country } from './countries'
import type { Lang } from '../i18n/lang'
import { pickL, t11, type L11 } from './math'
import type { AstroMode } from '../lib/quiz/astroModes'
import { ASTRO_LEVEL_QUESTIONS } from '../lib/quiz/astroModes'

export type AstroTier = 'easy' | 'medium' | 'hard'

export type AstroBodyId =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'

export interface AstroItem {
  id: string
  mode: AstroMode
  tier: AstroTier
  prompt: L11 | string
  answer: L11 | string
  key: string
  body?: AstroBodyId
  wiki?: string
  wikiFile?: string
  personId?: string
  facts?: L11[]
}

export interface AstroPerson {
  id: string
  name: L11
  tier: AstroTier
  wiki: string
  wikiFile?: string
  facts: L11[]
}

function row(
  id: string,
  mode: AstroMode,
  tier: AstroTier,
  prompt: L11 | string,
  answer: L11 | string,
  extra: Partial<AstroItem> = {},
): AstroItem {
  const key = extra.key ?? (typeof answer === 'string' ? answer : answer.en)
  return { id, mode, tier, prompt, answer, key, ...extra }
}

const PLANET = {
  mercury: t11('Меркурий', 'Mercury', 'Merkur', '水星', 'Mercurio', 'बुध', 'عطارد', 'বুধ', 'Mercúrio', '水星', 'כוכב חמה'),
  venus: t11('Венера', 'Venus', 'Venus', '金星', 'Venus', 'शुक्र', 'الزهرة', 'শুক্র', 'Vénus', '金星', 'נוגה'),
  earth: t11('Земля', 'Earth', 'Erde', '地球', 'Tierra', 'पृथ्वी', 'الأرض', 'পৃথিবী', 'Terra', '地球', 'כדור הארץ'),
  mars: t11('Марс', 'Mars', 'Mars', '火星', 'Marte', 'मंगल', 'المريخ', 'মঙ্গল', 'Marte', '火星', 'מאדים'),
  jupiter: t11('Юпитер', 'Jupiter', 'Jupiter', '木星', 'Júpiter', 'गुरु', 'المشتري', 'বৃহস্পতি', 'Júpiter', '木星', 'צדק'),
  saturn: t11('Сатурн', 'Saturn', 'Saturn', '土星', 'Saturno', 'शनि', 'زحل', 'শনি', 'Saturno', '土星', 'שבתאי'),
  uranus: t11('Уран', 'Uranus', 'Uranus', '天王星', 'Urano', 'अरुण', 'أورانوس', 'ইউরেনাস', 'Urano', '天王星', 'אורנוס'),
  neptune: t11('Нептун', 'Neptune', 'Neptun', '海王星', 'Neptuno', 'वरुण', 'نبتون', 'নেপচুন', 'Neptuno', '海王星', 'נפטון'),
} as const

const KIND = {
  rock: t11('каменная', 'terrestrial', 'Gesteinsplanet', '类地行星', 'terrestre', 'स्थलीय', 'صخرية', 'স্থলজ', 'terrestre', '岩石惑星', 'סלעית'),
  gas: t11('газовый гигант', 'gas giant', 'Gasriese', '气巨行星', 'gigante de gas', 'गैस दानव', 'عملاق غازي', 'গ্যাস দানব', 'gigante gasoso', 'ガス巨星', 'ענק גז'),
  ice: t11('ледяной гигант', 'ice giant', 'Eisriese', '冰巨行星', 'gigante de hielo', 'बर्फ दानव', 'عملاق جليدي', 'বরফ দানব', 'gigante de gelo', '氷巨星', 'ענק קרח'),
}

const ORDER = {
  1: t11('1-я от Солнца', '1st from the Sun', '1. von der Sonne', '距太阳第 1', '1.ª del Sol', 'सूर्य से 1वीं', 'الأولى من الشمس', 'সূর্য থেকে ১ম', '1.ª do Sol', '太陽から1番目', 'הראשונה מהשמש'),
  2: t11('2-я от Солнца', '2nd from the Sun', '2. von der Sonne', '距太阳第 2', '2.ª del Sol', 'सूर्य से 2वीं', 'الثانية من الشمس', 'সূর্য থেকে ২য়', '2.ª do Sol', '太陽から2番目', 'השנייה מהשמש'),
  3: t11('3-я от Солнца', '3rd from the Sun', '3. von der Sonne', '距太阳第 3', '3.ª del Sol', 'सूर्य से 3वीं', 'الثالثة من الشمس', 'সূর্য থেকে ৩য়', '3.ª do Sol', '太陽から3番目', 'השלישית מהשמש'),
  4: t11('4-я от Солнца', '4th from the Sun', '4. von der Sonne', '距太阳第 4', '4.ª del Sol', 'सूर्य से 4वीं', 'الرابعة من الشمس', 'সূর্য থেকে ৪র্থ', '4.ª do Sol', '太陽から4番目', 'הרביעית מהשמש'),
  5: t11('5-я от Солнца', '5th from the Sun', '5. von der Sonne', '距太阳第 5', '5.ª del Sol', 'सूर्य से 5वीं', 'الخامسة من الشمس', 'সূর্য থেকে ৫ম', '5.ª do Sol', '太陽から5番目', 'החמישית מהשמש'),
  6: t11('6-я от Солнца', '6th from the Sun', '6. von der Sonne', '距太阳第 6', '6.ª del Sol', 'सूर्य से 6वीं', 'السادسة من الشمس', 'সূর্য থেকে ৬ষ্ঠ', '6.ª do Sol', '太陽から6番目', 'השישית מהשמש'),
  7: t11('7-я от Солнца', '7th from the Sun', '7. von der Sonne', '距太阳第 7', '7.ª del Sol', 'सूर्य से 7वीं', 'السابعة من الشمس', 'সূর্য থেকে ৭ম', '7.ª do Sol', '太陽から7番目', 'השביעית מהשמש'),
  8: t11('8-я от Солнца', '8th from the Sun', '8. von der Sonne', '距太阳第 8', '8.ª del Sol', 'सूर्य से 8वीं', 'الثامنة من الشمس', 'সূর্য থেকে ৮ম', '8.ª do Sol', '太陽から8番目', 'השמינית מהשמש'),
} as const

const PLANET_META: { id: AstroBodyId; order: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; kind: keyof typeof KIND; tier: AstroTier }[] = [
  { id: 'mercury', order: 1, kind: 'rock', tier: 'easy' },
  { id: 'venus', order: 2, kind: 'rock', tier: 'easy' },
  { id: 'earth', order: 3, kind: 'rock', tier: 'easy' },
  { id: 'mars', order: 4, kind: 'rock', tier: 'easy' },
  { id: 'jupiter', order: 5, kind: 'gas', tier: 'easy' },
  { id: 'saturn', order: 6, kind: 'gas', tier: 'easy' },
  { id: 'uranus', order: 7, kind: 'ice', tier: 'medium' },
  { id: 'neptune', order: 8, kind: 'ice', tier: 'medium' },
]

const MOONS: { id: string; name: L11; planet: AstroBodyId; tier: AstroTier }[] = [
  { id: 'moon', name: t11('Луна', 'Moon', 'Mond', '月球', 'Luna', 'चंद्रमा', 'القمر', 'চাঁদ', 'Lua', '月', 'ירח'), planet: 'earth', tier: 'easy' },
  { id: 'phobos', name: t11('Фобос', 'Phobos', 'Phobos', '火卫一', 'Fobos', 'फोबोस', 'فوبوس', 'ফোবোস', 'Fobos', 'フォボス', 'פובוס'), planet: 'mars', tier: 'medium' },
  { id: 'deimos', name: t11('Деймос', 'Deimos', 'Deimos', '火卫二', 'Deimos', 'डीमोस', 'ديموس', 'ডেইমোস', 'Deimos', 'ダイモス', 'דימוס'), planet: 'mars', tier: 'hard' },
  { id: 'io', name: t11('Ио', 'Io', 'Io', '木卫一', 'Ío', 'आईओ', 'آيو', 'আইও', 'Io', 'イオ', 'איו'), planet: 'jupiter', tier: 'easy' },
  { id: 'europa', name: t11('Европа', 'Europa', 'Europa', '木卫二', 'Europa', 'यूरोपा', 'أوروبا', 'ইউরোপা', 'Europa', 'エウロパ', 'אירופה'), planet: 'jupiter', tier: 'easy' },
  { id: 'ganymede', name: t11('Ганимед', 'Ganymede', 'Ganymed', '木卫三', 'Ganimedes', 'गैनिमीड', 'غانيميد', 'গ্যানিমিড', 'Ganimedes', 'ガニメデ', 'גנימד'), planet: 'jupiter', tier: 'medium' },
  { id: 'callisto', name: t11('Каллисто', 'Callisto', 'Kallisto', '木卫四', 'Calisto', 'कैलिस्टो', 'كاليستو', 'ক্যালিস্টো', 'Calisto', 'カリスト', 'קליסטו'), planet: 'jupiter', tier: 'medium' },
  { id: 'titan', name: t11('Титан', 'Titan', 'Titan', '土卫六', 'Titán', 'टाइटन', 'تيتان', 'টাইটান', 'Titã', 'タイタン', 'טיטאן'), planet: 'saturn', tier: 'easy' },
  { id: 'enceladus', name: t11('Энцелад', 'Enceladus', 'Enceladus', '土卫二', 'Encélado', 'एन्सेलैडस', 'إنسيلادوس', 'এনসেলাডাস', 'Encélado', 'エンケラドゥス', 'אנקלדוס'), planet: 'saturn', tier: 'hard' },
  { id: 'triton', name: t11('Тритон', 'Triton', 'Triton', '海卫一', 'Tritón', 'ट्राइटन', 'ترايتون', 'ট্রাইটন', 'Tritão', 'トリトン', 'טריטון'), planet: 'neptune', tier: 'medium' },
]

const STARS: { id: string; name: L11; klass: L11; tier: AstroTier }[] = [
  {
    id: 'sun',
    name: t11('Солнце', 'Sun', 'Sonne', '太阳', 'Sol', 'सूर्य', 'الشمس', 'সূর্য', 'Sol', '太陽', 'שמש'),
    klass: t11('G2V, жёлтый карлик', 'G2V yellow dwarf', 'G2V gelber Zwerg', 'G2V 黄矮星', 'Enana amarilla G2V', 'G2V पीला बौना', 'قزم أصفر G2V', 'G2V হলুদ বামন', 'Anã amarela G2V', 'G2V黄色矮星', 'G2V ננס צהוב'),
    tier: 'easy',
  },
  {
    id: 'sirius',
    name: t11('Сириус', 'Sirius', 'Sirius', '天狼星', 'Sirio', 'सीरियस', 'الشعرى', 'সিরিয়াস', 'Sírius', 'シリウス', 'סיריוס'),
    klass: t11('A1V, ярчайшая ночная', 'A1V, brightest at night', 'A1V, hellster Nachtstern', 'A1V，夜空最亮', 'A1V, la más brillante de noche', 'A1V, रात की सबसे चमकीली', 'A1V الأسطع ليلاً', 'A1V রাতের উজ্জ্বলতম', 'A1V, a mais brilhante à noite', 'A1V、夜空で最も明るい', 'A1V, הבהירה בלילה'),
    tier: 'easy',
  },
  {
    id: 'polaris',
    name: t11('Полярная', 'Polaris', 'Polarstern', '北极星', 'Polaris', 'ध्रुव तारा', 'القطبي', 'ধ্রুবতারা', 'Polaris', 'ポラリス', 'כוכב הצפון'),
    klass: t11('F7Ib, северный полюс мира', 'F7Ib, north celestial pole', 'F7Ib, nördlicher Himmelspol', 'F7Ib，北天极', 'F7Ib, polo celeste norte', 'F7Ib, उत्तरी ध्रुव', 'F7Ib القطب السماوي الشمالي', 'F7Ib উত্তর মেরু', 'F7Ib, polo celeste norte', 'F7Ib、天の北極', 'F7Ib, הקוטב השמימי הצפוני'),
    tier: 'easy',
  },
  {
    id: 'betelgeuse',
    name: t11('Бетельгейзе', 'Betelgeuse', 'Beteigeuze', '参宿四', 'Betelgeuse', 'बेटेल्ज्यूज़', 'منكب الجوزاء', 'বেটেলজিউজ', 'Betelgeuse', 'ベテルギウス', 'בטלג׳וז'),
    klass: t11('M1–2, красный сверхгигант', 'M1–2 red supergiant', 'M1–2 Roter Überriese', 'M1–2 红超巨星', 'Supergigante roja M1–2', 'M1–2 लाल महादानव', 'عملاق أحمر فائق M1–2', 'M1–2 লাল অতিদানব', 'Supergigante vermelha M1–2', 'M1–2赤色超巨星', 'M1–2 על־ענק אדום'),
    tier: 'medium',
  },
  {
    id: 'vega',
    name: t11('Вега', 'Vega', 'Vega', '织女星', 'Vega', 'वेगा', 'النسر الواقع', 'ভেগা', 'Vega', 'ベガ', 'וגה'),
    klass: t11('A0V, Лира', 'A0V, Lyra', 'A0V, Leier', 'A0V，天琴', 'A0V, Lira', 'A0V, वीणा', 'A0V القيثارة', 'A0V, লিরা', 'A0V, Lira', 'A0V、こと座', 'A0V, נבל'),
    tier: 'medium',
  },
  {
    id: 'proxima',
    name: t11('Проксима Центавра', 'Proxima Centauri', 'Proxima Centauri', '比邻星', 'Próxima Centauri', 'प्रॉक्सिमा सेंटॉरी', 'قنطورस الأقرب', 'প্রক্সিমা সেন্টাউরি', 'Proxima Centauri', 'プロキシマ・ケンタウリ', 'פרוקסימה קנטאורי'),
    klass: t11('M5.5V, ближайшая после Солнца', 'M5.5V, nearest after the Sun', 'M5.5V, nächster Stern nach der Sonne', 'M5.5V，太阳后最近', 'M5.5V, la más cercana tras el Sol', 'M5.5V, सूर्य के बाद निकटतम', 'M5.5V الأقرب بعد الشمس', 'M5.5V সূর্যের পর নিকটতম', 'M5.5V, a mais próxima após o Sol', 'M5.5V、太陽の次に近い', 'M5.5V, הקרובה אחרי השמש'),
    tier: 'hard',
  },
]

const CONSTELS: { id: string; clue: L11; name: L11; tier: AstroTier }[] = [
  {
    id: 'orion',
    clue: t11('Охотник с поясом из трёх звёзд', 'Hunter with a three-star belt', 'Jäger mit Drei-Sterne-Gürtel', '三星腰带的猎人', 'Cazador con cinturón de tres estrellas', 'तीन तारों की पेटी वाला शिकारी', 'صياد بحزام من ثلاث نجوم', 'তিন তারার বেল্টওয়ালা শিকারি', 'Caçador com cinturão de três estrelas', '三つ星の帯の狩人', 'צייד עם חגורת שלושה כוכבים'),
    name: t11('Орион', 'Orion', 'Orion', '猎户座', 'Orión', 'मृगशिरा', 'الجبار', 'ওরায়ন', 'Órion', 'オリオン座', 'אוריון'),
    tier: 'easy',
  },
  {
    id: 'uma',
    clue: t11('Большой ковш, указатель на Полярную', 'Big Dipper, points to Polaris', 'Großer Wagen, zeigt zum Polarstern', '北斗，指向北极星', 'Carro Mayor, apunta a Polaris', 'बड़ा डिपर, ध्रुव की ओर', 'المغرفة الكبرى نحو القطبي', 'বিগ ডিপার, ধ্রুবতারার দিকে', 'Grande Carro, aponta a Polar', '北斗七星、北極星を指す', 'העגלה הגדולה, מצביעה לצפון'),
    name: t11('Большая Медведица', 'Ursa Major', 'Großer Bär', '大熊座', 'Osa Mayor', 'सप्तर्षि', 'الدب الأكبر', 'বৃহৎ ভালুক', 'Ursa Maior', 'おおぐま座', 'הדובה הגדולה'),
    tier: 'easy',
  },
  {
    id: 'cas',
    clue: t11('W на северном небе', 'W on the northern sky', 'W am Nordhimmel', '北天的 W', 'W en el cielo norte', 'उत्तर आकाश में W', 'حرف W في الشمال', 'উত্তর আকাশে W', 'W no céu norte', '北天のW', 'W בשמי הצפון'),
    name: t11('Кассиопея', 'Cassiopeia', 'Kassiopeia', '仙后座', 'Casiopea', 'कैसियोपिया', 'ذات الكرسي', 'ক্যাসিওপিয়া', 'Cassiopeia', 'カシオペヤ座', 'קסיופאה'),
    tier: 'easy',
  },
  {
    id: 'sco',
    clue: t11('Скорпион с Антаресом', 'Scorpion with Antares', 'Skorpion mit Antares', '带心宿二的蝎子', 'Escorpión con Antares', 'अंतारेस वाला बिच्छू', 'عقرب مع قلب العقرب', 'অ্যান্টারেসসহ বৃশ্চিক', 'Escorpião com Antares', 'アンタレスのさそり', 'עקרב עם אנטארס'),
    name: t11('Скорпион', 'Scorpius', 'Skorpion', '天蝎座', 'Escorpión', 'वृश्चिक', 'العقرب', 'বৃশ্চিক', 'Escorpião', 'さそり座', 'עקרב'),
    tier: 'medium',
  },
  {
    id: 'cru',
    clue: t11('Южный крест, навигация в южном полушарии', 'Southern Cross, southern navigation', 'Kreuz des Südens', '南十字，南半球导航', 'Cruz del Sur', 'दक्षिणी क्रूस', 'الصليب الجنوبي', 'দক্ষিণ ক্রুশ', 'Cruzeiro do Sul', '南十字', 'הצלב הדרומי'),
    name: t11('Южный Крест', 'Crux', 'Kreuz des Südens', '南十字座', 'Cruz', 'क्रक्स', 'الصليب الجنوبي', 'ক্রাক্স', 'Cruzeiro do Sul', 'みなみじゅうじ座', 'הצלב הדרומי'),
    tier: 'medium',
  },
  {
    id: 'and',
    clue: t11('Галактика M31 «висит» в этом созвездии', 'Galaxy M31 sits in this constellation', 'Galaxie M31 in diesem Sternbild', 'M31 星系在此星座', 'La galaxia M31 está aquí', 'M31 यहीं है', 'مجرة M31 هنا', 'M31 এখানে', 'A galáxia M31 fica aqui', 'M31はこの星座', 'גלקסיית M31 כאן'),
    name: t11('Андромеда', 'Andromeda', 'Andromeda', '仙女座', 'Andrómeda', 'अंड्रोमेडा', 'المرأة المسلسلة', 'অ্যান্ড্রোমিডা', 'Andrómeda', 'アンドロメダ座', 'אנדרומדה'),
    tier: 'medium',
  },
]

export const ASTRO_PEOPLE: AstroPerson[] = [
  {
    id: 'copernicus',
    name: t11('Коперник', 'Copernicus', 'Kopernikus', '哥白尼', 'Copérnico', 'कोपरनिकस', 'كوبرنيكوس', 'কোপার্নিকাস', 'Copérnico', 'コペルニクス', 'קופרניקוס'),
    tier: 'easy',
    wiki: 'Nicolaus Copernicus',
    wikiFile: 'Nikolaus Kopernikus.jpg',
    facts: [
      t11('Гелиоцентрическая система.', 'Heliocentric system.', 'Heliozentrisches System.', '日心说。', 'Sistema heliocéntrico.', 'सूर्यकेन्द्रित तंत्र।', 'النظام الشمسي المركزي.', 'সূর্যকেন্দ্রিক ব্যবস্থা।', 'Sistema heliocêntrico.', '地動説。', 'מערכת הליוצנטרית.'),
      t11('«О вращениях небесных сфер».', 'On the Revolutions of the Heavenly Spheres.', 'De revolutionibus.', '《天体运行论》。', 'De revolutionibus.', 'डी रिवोल्यूशनिबस।', 'في دورات الأجرام.', 'ডি রেভোলিউশনিবাস।', 'De revolutionibus.', '天球の回転について。', 'על סיבובי כדורי השמים.'),
    ],
  },
  {
    id: 'galileo',
    name: t11('Галилей', 'Galileo', 'Galilei', '伽利略', 'Galileo', 'गैलीलियो', 'غاليليو', 'গ্যালিলিও', 'Galileu', 'ガリレオ', 'גלילאו'),
    tier: 'easy',
    wiki: 'Galileo Galilei',
    wikiFile: 'Justus Sustermans - Portrait of Galileo Galilei, 1636.jpg',
    facts: [
      t11('Телескоп: спутники Юпитера, фазы Венеры.', 'Telescope: Jupiter moons, Venus phases.', 'Teleskop: Jupitermonde, Venosphasen.', '望远镜：木星卫星、金星相位。', 'Telescopio: lunas de Júpiter, fases de Venus.', 'दूरबीन: बृहस्पति के चंद्रमा।', 'التلسكوب: أقمار المشتري.', 'টেলিস্কোপ: বৃহস্পতির চাঁদ।', 'Telescópio: luas de Júpiter.', '望遠鏡：木星の衛星。', 'טלסקופ: ירחי צדק.'),
      t11('Пиза и Падуя; конфликт с инквизицией.', 'Pisa and Padua; Inquisition.', 'Pisa und Padua; Inquisition.', '比萨与帕多瓦；宗教法庭。', 'Pisa y Padua; Inquisición.', 'पीसा और पडुआ।', 'بيزا وبادوفا.', 'পিসা ও পাডুয়া।', 'Pisa e Pádua.', 'ピサとパドヴァ。', 'פיזה ופדובה.'),
    ],
  },
  {
    id: 'kepler',
    name: t11('Кеплер', 'Kepler', 'Kepler', '开普勒', 'Kepler', 'केपलर', 'كيبلر', 'কেপলার', 'Kepler', 'ケプラー', 'קפלר'),
    tier: 'easy',
    wiki: 'Johannes Kepler',
    wikiFile: 'Johannes Kepler 1610.jpg',
    facts: [
      t11('Три закона движения планет.', 'Three laws of planetary motion.', 'Drei Planetengesetze.', '行星运动三定律。', 'Tres leyes planetarias.', 'ग्रह गति के तीन नियम।', 'ثلاثة قوانين لحركة الكواكب.', 'গ্রহগতির তিন সূত্র।', 'Três leis planetárias.', '惑星運動の三法則。', 'שלושת חוקי התנועה.'),
      t11('Эллиптические орбиты, не круги.', 'Elliptical orbits, not circles.', 'Ellipsenbahnen, keine Kreise.', '椭圆轨道而非圆。', 'Órbitas elípticas.', 'दीर्घवृत्तीय कक्षाएँ।', 'مدارات إهليلجية.', 'উপবৃত্তাকার কক্ষ।', 'Órbitas elípticas.', '楕円軌道。', 'מסלולים אליפטיים.'),
    ],
  },
  {
    id: 'hubble',
    name: t11('Хаббл', 'Hubble', 'Hubble', '哈勃', 'Hubble', 'हबल', 'هابل', 'হাবল', 'Hubble', 'ハッブル', 'האבל'),
    tier: 'easy',
    wiki: 'Edwin Hubble',
    wikiFile: 'Edwin Hubble.jpg',
    facts: [
      t11('Галактики за пределами Млечного Пути.', 'Galaxies beyond the Milky Way.', 'Galaxien jenseits der Milchstraße.', '银河系外的星系。', 'Galaxias más allá de la Vía Láctea.', 'आकाशगंगा से परे गैलेक्सियाँ।', 'مجرات خارج درب التبانة.', 'আকাশগঙ্গার বাইরের ছায়াপথ।', 'Galáxias além da Via Láctea.', '天の川の外の銀河。', 'גלקסיות מחוץ לשביל החלב.'),
      t11('Разбегание: закон Хаббла.', 'Expansion: Hubble’s law.', 'Expansion: Hubblesches Gesetz.', '哈勃定律。', 'Ley de Hubble.', 'हबल का नियम।', 'قانون هابل.', 'হাবলের সূত্র।', 'Lei de Hubble.', 'ハッブルの法則。', 'חוק האבל.'),
    ],
  },
  {
    id: 'sagan',
    name: t11('Саган', 'Sagan', 'Sagan', '萨根', 'Sagan', 'सैगन', 'ساغان', 'স্যাগান', 'Sagan', 'セーガン', 'סאגן'),
    tier: 'medium',
    wiki: 'Carl Sagan',
    wikiFile: 'Carl Sagan Planetary Society.jpg',
    facts: [
      t11('«Космос», «бледно-голубая точка».', 'Cosmos; Pale Blue Dot.', 'Kosmos; Pale Blue Dot.', '《宇宙》；暗淡蓝点。', 'Cosmos; Punto azul pálido.', 'कॉसमॉस; पेल ब्लू डॉट।', 'الكون؛ النقطة الزرقاء الباهتة.', 'কসমস; পেল ব্লু ডট।', 'Cosmos; Pálido Ponto Azul.', 'コスモス、ペールブルー・ドット。', 'קוסמוס; הנקודה הכחולה.'),
      t11('Voyager: золотая пластинка.', 'Voyager Golden Record.', 'Voyager Golden Record.', '旅行者镀金唱片。', 'Disco de oro de Voyager.', 'वॉयेजर स्वर्ण डिस्क।', 'أسطوانة فويجر الذهبية.', 'ভয়েজার গোল্ডেন রেকর্ড।', 'Disco de ouro da Voyager.', 'ボイジャーのゴールデンレコード。', 'תקליט הזהב של וויאג׳ר.'),
    ],
  },
  {
    id: 'rubin',
    name: t11('Вера Рубин', 'Vera Rubin', 'Vera Rubin', '维拉·鲁宾', 'Vera Rubin', 'वेरा रुबिन', 'فيرا روبين', 'ভেড়া রুবিন', 'Vera Rubin', 'ベラ・ルービン', 'ורה רובין'),
    tier: 'medium',
    wiki: 'Vera Rubin',
    wikiFile: 'Vera Rubin.jpg',
    facts: [
      t11('Кривые вращения галактик и тёмная материя.', 'Galaxy rotation curves and dark matter.', 'Rotationskurven und dunkle Materie.', '星系旋转曲线与暗物质。', 'Curvas de rotación y materia oscura.', 'घूर्णन वक्र और डार्क मैटर।', 'منحنيات الدوران والمادة المظلمة.', 'ঘূর্ণন বক্র ও অন্ধকার পদার্থ।', 'Curvas de rotação e matéria escura.', '回転曲線とダークマター。', 'עקומות סיבוב וחומר אפל.'),
      t11('Наблюдения спиральных галактик.', 'Observed spiral galaxies.', 'Beobachtete Spiralgalaxien.', '观测旋涡星系。', 'Observó galaxias espirales.', 'सर्पिल गैलेक्सियाँ देखीं।', 'رصدت المجرات الحلزونية.', 'সর্পিল ছায়াপথ দেখেছেন।', 'Observou galáxias espirais.', '渦巻銀河を観測。', 'צפתה בגלקסיות ספירלה.'),
    ],
  },
  {
    id: 'herschel',
    name: t11('Кэролайн Гершель', 'Caroline Herschel', 'Caroline Herschel', '卡罗琳·赫歇尔', 'Caroline Herschel', 'कैरोलिन हर्शेल', 'كارولين هيرشل', 'ক্যারোলিন হার্শেল', 'Caroline Herschel', 'カロライン・ハーシェル', 'קרוליין הרשל'),
    tier: 'hard',
    wiki: 'Caroline Herschel',
    wikiFile: 'Caroline Herschel.jpg',
    facts: [
      t11('Кометы; работала с братом Уильямом.', 'Comets; worked with William Herschel.', 'Kometen; mit Wilhelm Herschel.', '彗星；与威廉合作。', 'Cometas; con William Herschel.', 'धूमकेतु; विलियम के साथ।', 'مذنبات مع ويليام.', 'ধূমকেতু; উইলিয়ামের সাথে।', 'Cometas; com William.', '彗星。ウィリアムと協働。', 'שביטים; עם ויליאם.'),
      t11('Первая женщина с королевской пенсией за науку в Британии.', 'First British woman paid a royal science pension.', 'Erste Britin mit königlicher Wissenschaftspension.', '首位获英国王室科学津贴的女性。', 'Primera británica con pensión científica real.', 'ब्रिटेन में वैज्ञानिक पेंशन पाने वाली पहली महिला।', 'أول بريطانية بتقاعد علمي ملكي.', 'রাজকীয় বিজ্ঞান পেনশন পাওয়া প্রথম ব্রিটিশ নারী।', 'Primeira britânica com pensão científica real.', '英国で科学の王室年金を得た最初の女性。', 'הראשונה בבריטניה לפנסיה מדעית מלכותית.'),
    ],
  },
  {
    id: 'cannon',
    name: t11('Энни Кэннон', 'Annie Jump Cannon', 'Annie Jump Cannon', '安妮·坎农', 'Annie Jump Cannon', 'एनी जंप कैनन', 'آني جمب كانون', 'অ্যানি জাম্প ক্যানন', 'Annie Jump Cannon', 'アニー・ジャンプ・キャノン', 'אני ג׳אמפ קנון'),
    tier: 'hard',
    wiki: 'Annie Jump Cannon',
    wikiFile: 'Annie Jump Cannon 1922 portrait.jpg',
    facts: [
      t11('Классификация спектров OBAFGKM.', 'OBAFGKM spectral classes.', 'Spektralklassen OBAFGKM.', 'OBAFGKM 光谱分类。', 'Clases espectrales OBAFGKM.', 'OBAFGKM वर्णक्रम।', 'أصناف أطياف OBAFGKM.', 'OBAFGKM বর্ণালি শ্রেণি।', 'Classes espectrais OBAFGKM.', 'OBAFGKMスペクトル型。', 'סיווג ספקטרלי OBAFGKM.'),
      t11('Гарвард, каталог Генри Дрейпера.', 'Harvard, Henry Draper Catalogue.', 'Harvard, Henry-Draper-Katalog.', '哈佛，亨利·德雷珀星表。', 'Harvard, catálogo Henry Draper.', 'हार्वर्ड, ड्रेपर सूची।', 'هارفارد وفهرس دريبر.', 'হার্ভার্ড, ড্রেপার ক্যাটালগ।', 'Harvard, catálogo Draper.', 'ハーバード、ドレイパーカタログ。', 'הרווארד, קטלוג דרייפר.'),
    ],
  },
]

function personById(id: string): AstroPerson | undefined {
  return ASTRO_PEOPLE.find((person) => person.id === id)
}

export const ASTRO_ITEMS: AstroItem[] = [
  ...PLANET_META.flatMap((planet) => [
    row(`p-ord-${planet.id}`, 'planetToOrder', planet.tier, PLANET[planet.id], ORDER[planet.order], {
      body: planet.id,
      key: `ord:${planet.order}`,
    }),
    row(`p-from-${planet.id}`, 'orderToPlanet', planet.tier, ORDER[planet.order], PLANET[planet.id], {
      body: planet.id,
      key: `pl:${planet.id}`,
    }),
    row(`p-kind-${planet.id}`, 'planetToKind', planet.tier, PLANET[planet.id], KIND[planet.kind], {
      body: planet.id,
      key: `k:${planet.kind}`,
    }),
  ]),
  ...MOONS.flatMap((moon) => [
    row(`m-${moon.id}`, 'moonToPlanet', moon.tier, moon.name, PLANET[moon.planet], {
      body: moon.planet,
      key: `pl:${moon.planet}`,
    }),
    row(`pm-${moon.id}`, 'planetToMoon', moon.tier, PLANET[moon.planet], moon.name, {
      body: moon.planet,
      key: `mo:${moon.id}`,
    }),
  ]),
  ...STARS.map((star) =>
    row(`s-${star.id}`, 'starToClass', star.tier, star.name, star.klass, { key: `st:${star.id}` }),
  ),
  ...CONSTELS.map((item) =>
    row(`c-${item.id}`, 'constelToName', item.tier, item.clue, item.name, { key: `cs:${item.id}` }),
  ),
  ...ASTRO_PEOPLE.filter((person) => person.wikiFile).map((person) =>
    row(`ph-${person.id}`, 'astroPhotoToName', person.tier, person.name, person.name, {
      personId: person.id,
      wiki: person.wiki,
      wikiFile: person.wikiFile,
      key: `pe:${person.id}`,
    }),
  ),
  ...ASTRO_PEOPLE.map((person) =>
    row(`fa-${person.id}`, 'astroFactsToName', person.tier, person.name, person.name, {
      personId: person.id,
      wiki: person.wiki,
      wikiFile: person.wikiFile,
      facts: person.facts,
      key: `pe:${person.id}`,
    }),
  ),
]

const BY_ID = new Map(ASTRO_ITEMS.map((item) => [item.id, item]))

export function astroById(id: string): AstroItem | undefined {
  return BY_ID.get(id)
}

export function astroPersonOf(id: string): AstroPerson | undefined {
  const item = astroById(id)
  if (item?.personId) return personById(item.personId)
  return personById(id)
}

export function astroCountry(item: AstroItem): Country {
  return {
    iso: item.id,
    nameEn: pickL(item.answer, 'en'),
    nameRu: pickL(item.answer, 'ru'),
    region: 'europe',
    difficulty: item.tier === 'easy' ? 'easy' : 'hard',
  }
}

export function astroItemFromCountry(country: Country, mode: AstroMode): AstroItem {
  const existing = astroById(country.iso)
  if (existing) return existing
  return {
    id: country.iso,
    mode,
    tier: 'medium',
    prompt: country.nameRu,
    answer: country.nameEn,
    key: country.iso,
  }
}

export function astroDisplayName(item: AstroItem, lang: Lang): string {
  return pickL(item.answer, lang)
}

export function astroPromptOf(item: AstroItem, lang: Lang): string {
  if (item.mode === 'astroFactsToName' && item.facts?.length) {
    return item.facts.map((fact) => pickL(fact, lang)).join('\n')
  }
  return pickL(item.prompt, lang)
}

export function astroItemsOf(mode: AstroMode, difficulty?: 'easy' | 'medium' | 'hard'): AstroItem[] {
  const pool = ASTRO_ITEMS.filter((item) => item.mode === mode)
  if (!difficulty) return pool
  const match = pool.filter((item) => item.tier === difficulty)
  if (match.length >= 4) return match
  if (difficulty === 'easy') return pool.filter((item) => item.tier !== 'hard')
  if (difficulty === 'hard') return pool.filter((item) => item.tier !== 'easy')
  return pool
}

export function astroLearnLine(item: AstroItem, lang: Lang): { prompt: string; answer: string } {
  return { prompt: astroPromptOf(item, lang), answer: astroDisplayName(item, lang) }
}

export function astroLevelIsos(mode: AstroMode, level: number): string[] {
  const pool = astroItemsOf(mode)
  if (pool.length === 0) return []
  const out: string[] = []
  const start = ((level - 1) * ASTRO_LEVEL_QUESTIONS) % pool.length
  for (let i = 0; i < ASTRO_LEVEL_QUESTIONS; i += 1) {
    out.push(pool[(start + i) % pool.length].id)
  }
  return out
}

export function astroWikis(): string[] {
  return ASTRO_PEOPLE.map((person) => person.wiki)
}
