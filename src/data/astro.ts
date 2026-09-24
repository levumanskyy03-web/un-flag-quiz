import type { Country } from './countries'
import type { Lang } from '../i18n/lang'
import { pickL, t11, type L11 } from './math'
import type { AstroMode } from '../lib/quiz/astroModes'
import { ASTRO_LEVEL_QUESTIONS } from '../lib/quiz/astroModes'
import { DEEP_SKY_OBJECTS, SPACE_MISSIONS, SPACE_TELESCOPES } from './astroExploration'

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
  { id: 'jupiter', order: 5, kind: 'gas', tier: 'medium' },
  { id: 'saturn', order: 6, kind: 'gas', tier: 'medium' },
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
  { id: 'mimas', name: t11('Мимас', 'Mimas', 'Mimas', '土卫一', 'Mimas', 'मीमास', 'ميماس', 'মিমাস', 'Mimas', 'ミマス', 'מימס'), planet: 'saturn', tier: 'medium' },
  { id: 'rhea', name: t11('Рея', 'Rhea', 'Rhea', '土卫五', 'Rea', 'रिया', 'ريا', 'রিয়া', 'Reia', 'レア', 'ריאה'), planet: 'saturn', tier: 'medium' },
  { id: 'iapetus', name: t11('Япет', 'Iapetus', 'Iapetus', '土卫八', 'Jápeto', 'आइपेटस', 'إيابيتوس', 'ইয়াপেটাস', 'Jápeto', 'イアペトゥス', 'יאפטוס'), planet: 'saturn', tier: 'hard' },
  { id: 'titania', name: t11('Титания', 'Titania', 'Titania', '天卫三', 'Titania', 'टाइटेनिया', 'تيتانيا', 'টাইটানিয়া', 'Titânia', 'チタニア', 'טיטניה'), planet: 'uranus', tier: 'medium' },
  { id: 'oberon', name: t11('Оберон', 'Oberon', 'Oberon', '天卫四', 'Oberón', 'ओबेरॉन', 'أوبيرون', 'ওবেরন', 'Oberon', 'オベロン', 'אוברון'), planet: 'uranus', tier: 'hard' },
  { id: 'triton', name: t11('Тритон', 'Triton', 'Triton', '海卫一', 'Tritón', 'ट्राइटन', 'ترايتون', 'ট্রাইটন', 'Tritão', 'トリトン', 'טריטון'), planet: 'neptune', tier: 'medium' },
  { id: 'nereid', name: t11('Нереида', 'Nereid', 'Nereid', '海卫二', 'Nereida', 'नेरीड', 'نيريد', 'নেরেইড', 'Nereida', 'ネレイド', 'נראיד'), planet: 'neptune', tier: 'hard' },
]

const MOON_FACTS: Record<string, L11[]> = {
  moon: [t11('Единственный естественный спутник Земли; на нём были люди.', 'Earth’s only natural satellite; visited by humans.', 'Einziger natürlicher Erdmond; von Menschen besucht.', '地球唯一的天然卫星；人类曾登临。', 'Único satélite natural de la Tierra; visitado por humanos.', 'पृथ्वी का एकमात्र प्राकृतिक उपग्रह; मानव वहाँ गए।', 'القمر الطبيعي الوحيد للأرض؛ زاره البشر.', 'পৃথিবীর একমাত্র প্রাকৃতিক উপগ্রহ; মানুষ সেখানে গেছে।', 'Único satélite natural da Terra; visitado por humanos.', '地球唯一の天然衛星。人類が訪問。', 'הלוויין הטבעי היחיד של כדור הארץ; בני אדם ביקרו בו.')],
  phobos: [t11('Крупнейший спутник Марса; медленно приближается к планете.', 'Larger moon of Mars; slowly spiraling inward.', 'Größerer Marsmond; nähert sich langsam dem Planeten.', '火星较大的卫星；正缓慢接近火星。', 'La mayor luna de Marte; se acerca lentamente.', 'मंगल का बड़ा चंद्रमा; धीरे-धीरे पास आ रहा है।', 'قمر المريخ الأكبر؛ يقترب ببطء من الكوكب.', 'মঙ্গলের বড় চাঁদ; ধীরে ধীরে কাছে আসছে।', 'Maior lua de Marte; aproxima-se lentamente.', '火星の大きい方の衛星。徐々に接近中。', 'הירח הגדול של מאדים; מתקרב אליו לאט.')],
  deimos: [t11('Меньший и внешний спутник Марса.', 'Smaller, outer moon of Mars.', 'Kleinerer äußerer Marsmond.', '火星较小、较外侧的卫星。', 'La luna menor y exterior de Marte.', 'मंगल का छोटा बाहरी चंद्रमा।', 'قمر المريخ الأصغر والأبعد.', 'মঙ্গলের ছোট বাইরের চাঁদ।', 'Lua menor e exterior de Marte.', '火星の小さく外側の衛星。', 'הירח הקטן והחיצוני של מאדים.')],
  io: [t11('Самый вулканически активный мир Солнечной системы.', 'Most volcanically active world in the Solar System.', 'Vulkanisch aktivste Welt im Sonnensystem.', '太阳系火山活动最活跃的天体。', 'El mundo con más actividad volcánica del Sistema Solar.', 'सौर मंडल की सबसे ज्वालामुखीय दुनिया।', 'أكثر عوالم النظام الشمسي نشاطاً بركانياً.', 'সৌরজগতের সবচেয়ে আগ্নেয় সক্রিয় জগৎ।', 'Mundo mais vulcanicamente ativo do Sistema Solar.', '太陽系で最も火山活動が活発。', 'העולם הפעיל ביותר געשית במערכת השמש.')],
  europa: [t11('Под ледяной корой скрыт глобальный океан.', 'A global ocean lies beneath its icy crust.', 'Unter der Eiskruste liegt ein globaler Ozean.', '冰壳下存在全球性海洋。', 'Oculta un océano global bajo su corteza helada.', 'बर्फीली पपड़ी के नीचे वैश्विक महासागर।', 'محيط عالمي تحت قشرته الجليدية.', 'বরফের খোলসের নিচে বৈশ্বিক মহাসাগর।', 'Tem um oceano global sob a crosta gelada.', '氷の地殻下に全球規模の海。', 'אוקיינוס עולמי מסתתר מתחת לקרום הקרח.')],
  ganymede: [t11('Крупнейший спутник Солнечной системы; больше Меркурия.', 'Largest moon in the Solar System; bigger than Mercury.', 'Größter Mond; größer als Merkur.', '太阳系最大卫星；比水星还大。', 'La mayor luna del Sistema Solar; mayor que Mercurio.', 'सौर मंडल का सबसे बड़ा चंद्रमा; बुध से बड़ा।', 'أكبر قمر في النظام الشمسي؛ أكبر من عطارد.', 'সৌরজগতের বৃহত্তম চাঁদ; বুধের চেয়েও বড়।', 'Maior lua do Sistema Solar; maior que Mercúrio.', '太陽系最大の衛星。水星より大きい。', 'הירח הגדול במערכת השמש; גדול מכוכב חמה.')],
  callisto: [t11('Древняя поверхность покрыта множеством кратеров.', 'Ancient surface densely covered with craters.', 'Alte, dicht mit Kratern bedeckte Oberfläche.', '古老表面密布撞击坑。', 'Superficie antigua cubierta de cráteres.', 'प्राचीन सतह घने गड्ढों से ढकी है।', 'سطح قديم مغطى بكثافة بالفوهات.', 'প্রাচীন পৃষ্ঠ ঘন গহ্বরে ঢাকা।', 'Superfície antiga coberta de crateras.', '古い表面はクレーターだらけ。', 'פני שטח עתיקים ומכוסים במכתשים.')],
  titan: [t11('Плотная азотная атмосфера и озёра жидкого метана.', 'Thick nitrogen atmosphere and liquid-methane lakes.', 'Dichte Stickstoffatmosphäre und Methanseen.', '浓厚氮气大气与液态甲烷湖。', 'Atmósfera densa de nitrógeno y lagos de metano.', 'घना नाइट्रोजन वायुमंडल और मीथेन झीलें।', 'غلاف نيتروجيني كثيف وبحيرات ميثان سائل.', 'ঘন নাইট্রোজেন বায়ুমণ্ডল ও তরল মিথেন হ্রদ।', 'Atmosfera densa de azoto e lagos de metano.', '濃い窒素大気と液体メタンの湖。', 'אטמוספרת חנקן סמיכה ואגמי מתאן נוזלי.')],
  enceladus: [t11('Ледяные гейзеры выбрасываются из подповерхностного океана.', 'Icy geysers erupt from a subsurface ocean.', 'Eisgeysire speisen sich aus einem unterirdischen Ozean.', '冰喷泉来自地下海洋。', 'Géiseres helados brotan de un océano subterráneo.', 'भूमिगत महासागर से बर्फीले फव्वारे निकलते हैं।', 'نوافير جليدية تنبع من محيط تحت السطح.', 'ভূগর্ভস্থ মহাসাগর থেকে বরফের গিজার বের হয়।', 'Géiseres gelados vêm de um oceano subterrâneo.', '地下海から氷の間欠泉が噴出。', 'גייזרי קרח פורצים מאוקיינוס תת־קרקעי.')],
  mimas: [t11('Огромный кратер Гершель делает его похожим на «Звезду смерти».', 'Huge Herschel crater makes it resemble the Death Star.', 'Der große Herschel-Krater erinnert an den Todesstern.', '巨大的赫歇尔陨石坑使其酷似“死星”。', 'El enorme cráter Herschel recuerda a la Estrella de la Muerte.', 'विशाल हर्शेल गड्ढा इसे डेथ स्टार जैसा बनाता है।', 'تجعله فوهة هيرشل الضخمة شبيهاً بنجمة الموت.', 'বিশাল হার্শেল গহ্বর একে ডেথ স্টারের মতো করে।', 'A enorme cratera Herschel lembra a Estrela da Morte.', '巨大なハーシェル・クレーターでデス・スターに似る。', 'מכתש הרשל הענק גורם לו להיראות כמו כוכב המוות.')],
  rhea: [t11('Второй по величине спутник Сатурна.', 'Second-largest moon of Saturn.', 'Zweitgrößter Saturnmond.', '土星第二大卫星。', 'Segunda luna más grande de Saturno.', 'शनि का दूसरा सबसे बड़ा चंद्रमा।', 'ثاني أكبر أقمار زحل.', 'শনির দ্বিতীয় বৃহত্তম চাঁদ।', 'Segunda maior lua de Saturno.', '土星で2番目に大きい衛星。', 'הירח השני בגודלו של שבתאי.')],
  iapetus: [t11('Одно полушарие намного темнее другого; на экваторе есть хребет.', 'One hemisphere is far darker; an equatorial ridge circles it.', 'Eine Hälfte ist viel dunkler; ein Äquatorwall umgibt ihn.', '一侧远暗于另一侧；赤道有高脊。', 'Un hemisferio es mucho más oscuro; tiene una cresta ecuatorial.', 'एक गोलार्ध बहुत गहरा; भूमध्यरेखा पर पर्वत-रीढ़।', 'نصفه أغمق كثيراً وله سلسلة على خط الاستواء.', 'এক গোলার্ধ অনেক গাঢ়; বিষুবীয় পর্বতশ্রেণি আছে।', 'Um hemisfério é muito mais escuro; tem uma crista equatorial.', '片側が非常に暗く、赤道に尾根がある。', 'חצי אחד כהה בהרבה; רכס מקיף את קו המשווה.')],
  titania: [t11('Крупнейший спутник Урана.', 'Largest moon of Uranus.', 'Größter Mond des Uranus.', '天王星最大卫星。', 'La mayor luna de Urano.', 'यूरेनस का सबसे बड़ा चंद्रमा।', 'أكبر أقمار أورانوس.', 'ইউরেনাসের বৃহত্তম চাঁদ।', 'Maior lua de Urano.', '天王星最大の衛星。', 'הירח הגדול ביותר של אורנוס.')],
  oberon: [t11('Второй по величине спутник Урана, покрытый кратерами.', 'Second-largest moon of Uranus, heavily cratered.', 'Zweitgrößter Uranusmond, stark verkratert.', '天王星第二大、布满撞击坑的卫星。', 'Segunda luna de Urano, muy craterizada.', 'यूरेनस का दूसरा बड़ा, गड्ढों वाला चंद्रमा।', 'ثاني أكبر أقمار أورانوس ومليء بالفوهات.', 'ইউরেনাসের দ্বিতীয় বৃহত্তম, গহ্বরময় চাঁদ।', 'Segunda maior lua de Urano, cheia de crateras.', '天王星で2番目に大きくクレーターが多い。', 'הירח השני בגודלו של אורנוס, מלא מכתשים.')],
  triton: [t11('Движется по ретроградной орбите и имеет азотные гейзеры.', 'Has a retrograde orbit and nitrogen geysers.', 'Retrograde Bahn und Stickstoffgeysire.', '逆行轨道，并有氮喷泉。', 'Órbita retrógrada y géiseres de nitrógeno.', 'प्रतिगामी कक्षा और नाइट्रोजन गीजर।', 'مدار رجعي ونوافير نيتروجين.', 'বিপরীতমুখী কক্ষপথ ও নাইট্রোজেন গিজার।', 'Órbita retrógrada e géiseres de azoto.', '逆行軌道と窒素の間欠泉。', 'מסלול נסוג וגייזרי חנקן.')],
  nereid: [t11('Один из самых вытянутых спутниковых орбит в Солнечной системе.', 'One of the most eccentric moon orbits in the Solar System.', 'Eine der exzentrischsten Mondbahnen im Sonnensystem.', '拥有太阳系最偏心的卫星轨道之一。', 'Una de las órbitas lunares más excéntricas del Sistema Solar.', 'सौर मंडल की सबसे दीर्घवृत्तीय चंद्र कक्षाओं में एक।', 'له أحد أكثر مدارات الأقمار استطالة في النظام الشمسي.', 'সৌরজগতের অন্যতম উপবৃত্তাকার চাঁদের কক্ষপথ।', 'Uma das órbitas lunares mais excêntricas do Sistema Solar.', '太陽系でも特に離心率が大きい衛星軌道。', 'אחד ממסלולי הירחים האליפטיים ביותר במערכת השמש.')],
}

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
  {
    id: 'rigel',
    name: t11('Ригель', 'Rigel', 'Rigel', '参宿七', 'Rigel', 'रिगेल', 'رجل الجبار', 'রাইজেল', 'Rigel', 'リゲル', 'ריג׳ל'),
    klass: t11('B8Ia, голубой сверхгигант Ориона', 'B8Ia blue supergiant in Orion', 'B8Ia blauer Überriese im Orion', 'B8Ia，猎户座蓝超巨星', 'Supergigante azul B8Ia de Orión', 'B8Ia, ओरायन का नीला महादानव', 'عملاق أزرق فائق B8Ia في الجبار', 'B8Ia, ওরায়নের নীল অতিদানব', 'Supergigante azul B8Ia em Órion', 'B8Ia、オリオン座の青色超巨星', 'B8Ia, על־ענק כחול באוריון'),
    tier: 'easy',
  },
  {
    id: 'alpha-centauri',
    name: t11('Альфа Центавра', 'Alpha Centauri', 'Alpha Centauri', '南门二', 'Alfa Centauri', 'अल्फा सेंटॉरी', 'ألفا قنطورس', 'আলফা সেন্টরি', 'Alpha Centauri', 'アルファ・ケンタウリ', 'אלפא קנטאורי'),
    klass: t11('Тройная система, ближайшая к Солнцу', 'Nearest star system to the Sun; triple system', 'Nächstes Sternsystem; Dreifachsystem', '距太阳最近的三星系统', 'Sistema triple más cercano al Sol', 'सूर्य के निकटतम तीन तारों का तंत्र', 'أقرب نظام نجمي إلى الشمس؛ ثلاثي', 'সূর্যের নিকটতম ত্রৈত তারকা ব্যবস্থা', 'Sistema triplo mais próximo do Sol', '太陽に最も近い三重星系', 'מערכת משולשת הקרובה ביותר לשמש'),
    tier: 'easy',
  },
  {
    id: 'arcturus',
    name: t11('Арктур', 'Arcturus', 'Arktur', '大角星', 'Arturo', 'स्वाति', 'السماك الرامح', 'স্বাতী', 'Arcturus', 'アークトゥルス', 'ארקטורוס'),
    klass: t11('K1.5III, яркий оранжевый гигант', 'K1.5III bright orange giant', 'K1.5III heller oranger Riese', 'K1.5III，明亮橙巨星', 'Gigante naranja brillante K1.5III', 'K1.5III, चमकीला नारंगी दानव', 'عملاق برتقالي ساطع K1.5III', 'K1.5III, উজ্জ্বল কমলা দানব', 'Gigante laranja brilhante K1.5III', 'K1.5III、明るい橙色巨星', 'K1.5III, ענק כתום בהיר'),
    tier: 'medium',
  },
  {
    id: 'antares',
    name: t11('Антарес', 'Antares', 'Antares', '心宿二', 'Antares', 'ज्येष्ठा', 'قلب العقرب', 'জ্যেষ্ঠা', 'Antares', 'アンタレス', 'אנטארס'),
    klass: t11('M1.5Iab, красный сверхгигант Скорпиона', 'M1.5Iab red supergiant in Scorpius', 'M1.5Iab roter Überriese im Skorpion', 'M1.5Iab，天蝎座红超巨星', 'Supergigante roja M1.5Iab de Escorpio', 'M1.5Iab, वृश्चिक का लाल महादानव', 'عملاق أحمر فائق M1.5Iab في العقرب', 'M1.5Iab, বৃশ্চিকের লাল অতিদানব', 'Supergigante vermelha M1.5Iab em Escorpião', 'M1.5Iab、さそり座の赤色超巨星', 'M1.5Iab, על־ענק אדום בעקרב'),
    tier: 'medium',
  },
  {
    id: 'deneb',
    name: t11('Денеб', 'Deneb', 'Deneb', '天津四', 'Deneb', 'देनेब', 'ذنب الدجاجة', 'ডেনেব', 'Deneb', 'デネブ', 'דנב'),
    klass: t11('A2Ia, белый сверхгигант в Лебеде', 'A2Ia white supergiant in Cygnus', 'A2Ia weißer Überriese im Schwan', 'A2Ia，天鹅座白超巨星', 'Supergigante blanca A2Ia del Cisne', 'A2Ia, हंस का श्वेत महादानव', 'عملاق أبيض فائق A2Ia في الدجاجة', 'A2Ia, রাজহাঁসের সাদা অতিদানব', 'Supergigante branca A2Ia no Cisne', 'A2Ia、はくちょう座の白色超巨星', 'A2Ia, על־ענק לבן בברבור'),
    tier: 'hard',
  },
  {
    id: 'altair',
    name: t11('Альтаир', 'Altair', 'Altair', '牛郎星', 'Altair', 'श्रवण', 'النسر الطائر', 'শ্রবণা', 'Altair', 'アルタイル', 'אלטאיר'),
    klass: t11('A7V, быстро вращается; вершина Летнего треугольника', 'A7V fast rotator; Summer Triangle star', 'A7V schnell rotierend; Sommerdreieck', 'A7V，快速自转；夏季大三角之一', 'A7V, rotación rápida; Triángulo de Verano', 'A7V, तेज घूर्णन; ग्रीष्म त्रिकोण', 'A7V سريع الدوران؛ من مثلث الصيف', 'A7V, দ্রুত ঘূর্ণন; গ্রীষ্ম ত্রিভুজ', 'A7V, rotação rápida; Triângulo de Verão', 'A7V、高速自転。夏の大三角', 'A7V, מסתובב במהירות; משולש הקיץ'),
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
  {
    id: 'leo',
    clue: t11('Лев с ярким Регулом', 'Lion with bright Regulus', 'Löwe mit dem hellen Regulus', '拥有明亮轩辕十四的狮子', 'León con la brillante Régulo', 'चमकीले रेगुलस वाला सिंह', 'الأسد مع النجم اللامع قلب الأسد', 'উজ্জ্বল রেগুলাসসহ সিংহ', 'Leão com o brilhante Régulo', 'レグルスを持つ獅子', 'אריה עם רגולוס הבהיר'),
    name: t11('Лев', 'Leo', 'Löwe', '狮子座', 'Leo', 'सिंह', 'الأسد', 'সিংহ', 'Leão', 'しし座', 'אריה'),
    tier: 'easy',
  },
  {
    id: 'cyg',
    clue: t11('Северный Крест с ярким Денебом', 'Northern Cross with bright Deneb', 'Nordkreuz mit dem hellen Deneb', '拥有明亮天津四的北十字', 'Cruz del Norte con la brillante Deneb', 'चमकीले डेनेब वाला उत्तरी क्रॉस', 'الصليب الشمالي مع ذنب الدجاجة', 'উজ্জ্বল ডেনেবসহ উত্তর ক্রুশ', 'Cruz do Norte com o brilhante Deneb', 'デネブを持つ北十字', 'הצלב הצפוני עם דנב'),
    name: t11('Лебедь', 'Cygnus', 'Schwan', '天鹅座', 'Cisne', 'हंस', 'الدجاجة', 'রাজহাঁস', 'Cisne', 'はくちょう座', 'ברבור'),
    tier: 'easy',
  },
  {
    id: 'lyr',
    clue: t11('Небольшое созвездие с Вегой', 'Small constellation containing Vega', 'Kleines Sternbild mit Wega', '包含织女星的小星座', 'Pequeña constelación con Vega', 'वेगा वाला छोटा तारामंडल', 'كوكبة صغيرة تضم النسر الواقع', 'ভেগাসহ ছোট তারামণ্ডল', 'Pequena constelação com Vega', 'ベガを含む小さな星座', 'קבוצה קטנה ובה וגה'),
    name: t11('Лира', 'Lyra', 'Leier', '天琴座', 'Lira', 'वीणा', 'القيثارة', 'বীণা', 'Lira', 'こと座', 'נבל'),
    tier: 'medium',
  },
  {
    id: 'tau',
    clue: t11('Бык с Альдебараном и Плеядами', 'Bull with Aldebaran and the Pleiades', 'Stier mit Aldebaran und Plejaden', '拥有毕宿五和昴星团的公牛', 'Toro con Aldebarán y las Pléyades', 'अल्देबारन और कृत्तिका वाला वृषभ', 'الثور مع الدبران والثريا', 'অ্যালডেবারান ও কৃত্তিকাসহ বৃষ', 'Touro com Aldebarã e as Plêiades', 'アルデバランとプレアデスの牡牛', 'שור עם אלדברן והפליאדות'),
    name: t11('Телец', 'Taurus', 'Stier', '金牛座', 'Tauro', 'वृषभ', 'الثور', 'বৃষ', 'Touro', 'おうし座', 'שור'),
    tier: 'medium',
  },
  {
    id: 'gem',
    clue: t11('Близнецы Кастор и Поллукс', 'Twins Castor and Pollux', 'Zwillinge Kastor und Pollux', '北河二与北河三双子', 'Gemelos Cástor y Pólux', 'कैस्टर और पोलक्स जुड़वाँ', 'التوأمان كاستور وبولوكس', 'ক্যাস্টর ও পোলাক্স যমজ', 'Gémeos Castor e Pólux', 'カストルとポルックスの双子', 'התאומים קסטור ופולוקס'),
    name: t11('Близнецы', 'Gemini', 'Zwillinge', '双子座', 'Géminis', 'मिथुन', 'التوأمان', 'মিথুন', 'Gémeos', 'ふたご座', 'תאומים'),
    tier: 'hard',
  },
  {
    id: 'sgr',
    clue: t11('«Чайник» у центра Млечного Пути', 'Teapot shape toward the Milky Way’s center', 'Teekanne Richtung Zentrum der Milchstraße', '朝向银河系中心的“茶壶”', 'La Tetera hacia el centro de la Vía Láctea', 'आकाशगंगा केंद्र की ओर चायदानी आकृति', 'شكل إبريق الشاي نحو مركز درب التبانة', 'আকাশগঙ্গার কেন্দ্রের দিকে চায়ের পাত্র', 'Bule voltado ao centro da Via Láctea', '天の川中心方向の「ティーポット」', 'צורת קומקום לכיוון מרכז שביל החלב'),
    name: t11('Стрелец', 'Sagittarius', 'Schütze', '人马座', 'Sagitario', 'धनु', 'القوس', 'ধনু', 'Sagitário', 'いて座', 'קשת'),
    tier: 'hard',
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
  {
    id: 'newton',
    name: t11('Исаак Ньютон', 'Isaac Newton', 'Isaac Newton', '艾萨克·牛顿', 'Isaac Newton', 'आइज़ैक न्यूटन', 'إسحاق نيوتن', 'আইজ্যাক নিউটন', 'Isaac Newton', 'アイザック・ニュートン', 'אייזק ניוטון'),
    tier: 'easy',
    wiki: 'Isaac Newton',
    wikiFile: 'GodfreyKneller-IsaacNewton-1689.jpg',
    facts: [
      t11('Закон всемирного тяготения объяснил орбиты небесных тел.', 'Universal gravitation explained the orbits of celestial bodies.', 'Die Gravitation erklärte die Bahnen der Himmelskörper.', '万有引力解释了天体轨道。', 'La gravitación universal explicó las órbitas celestes.', 'सार्वत्रिक गुरुत्व ने खगोलीय कक्षाएँ समझाईं।', 'فسر قانون الجاذبية مدارات الأجرام السماوية.', 'মহাকর্ষ সূত্র আকাশীয় কক্ষপথ ব্যাখ্যা করেছে।', 'A gravitação universal explicou as órbitas celestes.', '万有引力で天体の軌道を説明。', 'הכבידה האוניברסלית הסבירה מסלולי גרמי שמיים.'),
      t11('Построил первый практичный телескоп-рефлектор.', 'Built the first practical reflecting telescope.', 'Baute das erste praktische Spiegelteleskop.', '制造首台实用反射望远镜。', 'Construyó el primer telescopio reflector práctico.', 'पहला व्यावहारिक परावर्ती दूरबीन बनाया।', 'بنى أول تلسكوب عاكس عملي.', 'প্রথম ব্যবহারিক প্রতিফলক দূরবীন তৈরি করেন।', 'Construiu o primeiro telescópio refletor prático.', '初の実用的な反射望遠鏡を製作。', 'בנה את טלסקופ המראות המעשי הראשון.'),
    ],
  },
  {
    id: 'leavitt',
    name: t11('Генриетта Ливитт', 'Henrietta Swan Leavitt', 'Henrietta Swan Leavitt', '亨丽爱塔·勒维特', 'Henrietta Leavitt', 'हेनरिएटा लेविट', 'هنريتا ليفيت', 'হেনরিয়েটা লিভিট', 'Henrietta Leavitt', 'ヘンリエッタ・リービット', 'הנרייטה ליוויט'),
    tier: 'medium',
    wiki: 'Henrietta Swan Leavitt',
    wikiFile: 'Henrietta Swan Leavitt.jpg',
    facts: [
      t11('Открыла связь периода и светимости цефеид.', 'Discovered the period–luminosity relation of Cepheids.', 'Entdeckte die Perioden-Leuchtkraft-Beziehung der Cepheiden.', '发现造父变星的周光关系。', 'Descubrió la relación período-luminosidad de las cefeidas.', 'सेफिड तारों का अवधि-दीप्ति संबंध खोजा।', 'اكتشفت علاقة الفترة باللمعان للنجوم القيفاوية.', 'সেফিডের পর্যায়-উজ্জ্বলতা সম্পর্ক আবিষ্কার করেন।', 'Descobriu a relação período-luminosidade das Cefeidas.', 'セファイドの周期光度関係を発見。', 'גילתה את קשר המחזור־בהירות של קפאידים.'),
      t11('Её работа позволила измерять расстояния до галактик.', 'Her work enabled measurements of galactic distances.', 'Ihre Arbeit ermöglichte Entfernungen zu Galaxien.', '她的工作使测量星系距离成为可能。', 'Su trabajo permitió medir distancias galácticas.', 'उनके काम से आकाशगंगाओं की दूरी मापी गई।', 'أتاح عملها قياس المسافات إلى المجرات.', 'তাঁর কাজ ছায়াপথের দূরত্ব মাপা সম্ভব করে।', 'O seu trabalho permitiu medir distâncias galácticas.', '銀河までの距離測定を可能にした。', 'עבודתה אפשרה למדוד מרחקים לגלקסיות.'),
    ],
  },
  {
    id: 'payne',
    name: t11('Сесилия Пейн-Гапошкина', 'Cecilia Payne-Gaposchkin', 'Cecilia Payne-Gaposchkin', '塞西莉亚·佩恩-加波施金', 'Cecilia Payne-Gaposchkin', 'सेसिलिया पेन-गापोश्किन', 'سيسيليا باين غابوشكين', 'সিসিলিয়া পেইন-গ্যাপোশকিন', 'Cecilia Payne-Gaposchkin', 'セシリア・ペイン＝ガポーシュキン', 'ססיליה פיין־גפושקין'),
    tier: 'hard',
    wiki: 'Cecilia Payne-Gaposchkin',
    wikiFile: 'Cecilia Payne-Gaposchkin.jpg',
    facts: [
      t11('Доказала, что звёзды состоят в основном из водорода и гелия.', 'Showed that stars are mostly hydrogen and helium.', 'Zeigte, dass Sterne vor allem aus Wasserstoff und Helium bestehen.', '证明恒星主要由氢和氦组成。', 'Demostró que las estrellas son sobre todo hidrógeno y helio.', 'दिखाया कि तारे मुख्यतः हाइड्रोजन और हीलियम हैं।', 'أثبتت أن النجوم تتكون أساساً من الهيدروجين والهيليوم.', 'প্রমাণ করেন তারা মূলত হাইড্রোজেন ও হিলিয়াম।', 'Mostrou que as estrelas são sobretudo hidrogénio e hélio.', '恒星が主に水素とヘリウムでできると示した。', 'הראתה שכוכבים מורכבים בעיקר ממימן והליום.'),
      t11('Её диссертация изменила звёздную астрофизику.', 'Her thesis transformed stellar astrophysics.', 'Ihre Dissertation veränderte die stellare Astrophysik.', '她的论文改变了恒星天体物理学。', 'Su tesis transformó la astrofísica estelar.', 'उनकी थीसिस ने तारकीय खगोलभौतिकी बदल दी।', 'غيّرت أطروحتها الفيزياء الفلكية النجمية.', 'তাঁর থিসিস নাক্ষত্রিক জ্যোতির্পদার্থবিদ্যা বদলে দেয়।', 'A sua tese transformou a astrofísica estelar.', '博士論文が恒星天体物理学を変えた。', 'עבודת הדוקטור שלה שינתה את האסטרופיזיקה הכוכבית.'),
    ],
  },
  {
    id: 'hawking',
    name: t11('Стивен Хокинг', 'Stephen Hawking', 'Stephen Hawking', '斯蒂芬·霍金', 'Stephen Hawking', 'स्टीफन हॉकिंग', 'ستيفن هوكينغ', 'স্টিফেন হকিং', 'Stephen Hawking', 'スティーヴン・ホーキング', 'סטיבן הוקינג'),
    tier: 'medium',
    wiki: 'Stephen Hawking',
    wikiFile: 'Stephen Hawking.StarChild.jpg',
    facts: [
      t11('Предсказал квантовое излучение чёрных дыр.', 'Predicted quantum radiation from black holes.', 'Sagte Quantenstrahlung Schwarzer Löcher voraus.', '预言黑洞的量子辐射。', 'Predijo la radiación cuántica de los agujeros negros.', 'ब्लैक होल से क्वांटम विकिरण की भविष्यवाणी की।', 'تنبأ بالإشعاع الكمي من الثقوب السوداء.', 'কৃষ্ণগহ্বরের কোয়ান্টাম বিকিরণের পূর্বাভাস দেন।', 'Previu radiação quântica dos buracos negros.', 'ブラックホールの量子放射を予言。', 'חזה קרינה קוונטית מחורים שחורים.'),
      t11('Автор «Краткой истории времени».', 'Author of A Brief History of Time.', 'Autor von Eine kurze Geschichte der Zeit.', '《时间简史》作者。', 'Autor de Breve historia del tiempo.', 'ए ब्रीफ हिस्ट्री ऑफ टाइम के लेखक।', 'مؤلف «تاريخ موجز للزمن».', 'এ ব্রিফ হিস্ট্রি অব টাইম-এর লেখক।', 'Autor de Uma Breve História do Tempo.', '『ホーキング、宇宙を語る』の著者。', 'מחבר ״קיצור תולדות הזמן״.'),
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
    row(`p-fact-${planet.id}`, 'planetFactsToName', planet.tier, PLANET[planet.id], PLANET[planet.id], {
      body: planet.id,
      facts: [ORDER[planet.order], KIND[planet.kind]],
      key: `pl:${planet.id}`,
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
    row(`moonf-${moon.id}`, 'moonFactsToName', moon.tier, moon.name, moon.name, {
      body: moon.planet,
      facts: MOON_FACTS[moon.id],
      key: `mo:${moon.id}`,
    }),
  ]),
  ...STARS.map((star) =>
    row(`s-${star.id}`, 'starToClass', star.tier, star.name, star.klass, { key: `st:${star.id}` }),
  ),
  ...CONSTELS.map((item) =>
    row(`c-${item.id}`, 'constelToName', item.tier, item.clue, item.name, { key: `cs:${item.id}` }),
  ),
  ...DEEP_SKY_OBJECTS.map((item) =>
    row(`ds-${item.id}`, 'deepSkyFactsToName', item.tier, item.name, item.name, {
      facts: item.facts,
      key: `ds:${item.id}`,
    }),
  ),
  ...SPACE_MISSIONS.flatMap((item) => [
    row(`mt-${item.id}`, 'missionToTarget', item.tier, item.name, item.target ?? item.name, {
      key: `target:${item.id}`,
    }),
    row(`mf-${item.id}`, 'missionFactsToName', item.tier, item.name, item.name, {
      facts: item.facts,
      key: `mission:${item.id}`,
    }),
  ]),
  ...SPACE_TELESCOPES.map((item) =>
    row(`tf-${item.id}`, 'telescopeFactsToName', item.tier, item.name, item.name, {
      facts: item.facts,
      key: `telescope:${item.id}`,
    }),
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
  if (item.facts?.length) {
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
