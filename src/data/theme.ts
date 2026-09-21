import type { Country } from './countries'
import type { Lang } from '../i18n/lang'
import { pickL, t11, type L11 } from './math'
import { isThemeMode, type ThemeMode } from '../lib/quiz/themeModes'
import { THEME_LEVEL_QUESTIONS } from '../lib/quiz/themeModes'

export type ThemeTier = 'easy' | 'medium' | 'hard'

export interface ThemeItem {
  id: string
  mode: ThemeMode
  tier: ThemeTier
  prompt: L11 | string
  answer: L11 | string
  key: string
  wiki?: string
  wikiFile?: string
}

function row(
  id: string,
  mode: string,
  tier: ThemeTier,
  prompt: L11 | string,
  answer: L11 | string,
  extra: Partial<Omit<ThemeItem, 'id' | 'mode' | 'tier' | 'prompt' | 'answer'>> = {},
): ThemeItem | null {
  if (!isThemeMode(mode)) return null
  const key = extra.key ?? (typeof answer === 'string' ? answer : answer.en)
  return { id, mode, tier, prompt, answer, key, ...extra }
}

const NUCLEUS = t11('ядро', 'nucleus', 'Zellkern', '细胞核', 'núcleo', 'केंद्रक', 'النواة', 'নিউক্লিয়াস', 'núcleo', '核', 'גרעין')
const MITO = t11('митохондрия', 'mitochondrion', 'Mitochondrium', '线粒体', 'mitocondria', 'माइटोकॉन्ड्रिया', 'الميتوكوندريا', 'মাইটোকন্ড্রিয়া', 'mitocôndria', 'ミトコンドリア', 'מיטוכונדריון')
const CHLORO = t11('хлоропласт', 'chloroplast', 'Chloroplast', '叶绿体', 'cloroplasto', 'हरितलवक', 'البلاستيدة', 'ক্লোরোপ্লাস্ট', 'cloroplasto', '葉緑体', 'כלורופלסט')
const RIBO = t11('рибосома', 'ribosome', 'Ribosom', '核糖体', 'ribosoma', 'राइबोसोम', 'الريبوسوم', 'রাইবোসোম', 'ribossomo', 'リボソーム', 'ריבוזום')
const MEMB = t11('мембрана', 'membrane', 'Membran', '细胞膜', 'membrana', 'झिल्ली', 'الغشاء', 'ঝিল্লি', 'membrana', '膜', 'קרום')
const DNA = t11('хранит ДНК', 'stores DNA', 'speichert DNA', '储存 DNA', 'guarda el ADN', 'डीएनए रखता है', 'يخزن الحمض النووي', 'ডিএনএ রাখে', 'guarda o ADN', 'DNAを保管', 'שומר DNA')
const ATP = t11('даёт энергию (АТФ)', 'makes ATP energy', 'liefert ATP', '制造 ATP', 'hace ATP', 'एटीपी बनाता है', 'يصنع ATP', 'ATP তৈরি করে', 'faz ATP', 'ATPをつくる', 'מייצר ATP')
const SUGAR = t11('фотосинтез, сахар', 'photosynthesis, sugar', 'Fotosynthese', '光合作用', 'fotosíntesis', 'प्रकाश संश्लेषण', 'التمثيل الضوئي', 'সালোকসংশ্লেষণ', 'fotossíntese', '光合成', 'פוטוסינתזה')
const PROT = t11('собирает белки', 'builds proteins', 'baut Proteine', '合成蛋白质', 'arma proteínas', 'प्रोटीन बनाता है', 'يبني البروتينات', 'প্রোটিন তৈরি', 'monta proteínas', 'タンパク質を作る', 'בונה חלבונים')
const BORDER = t11('граница клетки', 'cell boundary', 'Zellgrenze', '细胞边界', 'límite celular', 'कोशिका सीमा', 'حدود الخلية', 'কোষসীমা', 'limite da célula', '細胞の境界', 'גבול התא')

const HEART = t11('сердце', 'heart', 'Herz', '心脏', 'corazón', 'हृदय', 'القلب', 'হৃৎপিণ্ড', 'coração', '心臓', 'לב')
const LUNGS = t11('лёгкие', 'lungs', 'Lunge', '肺', 'pulmones', 'फेफड़े', 'الرئتان', 'ফুসফুস', 'pulmões', '肺', 'ריאות')
const BRAIN = t11('мозг', 'brain', 'Gehirn', '脑', 'cerebro', 'मस्तिष्क', 'الدماغ', 'মস্তিষ্ক', 'cérebro', '脳', 'מוח')
const LIVER = t11('печень', 'liver', 'Leber', '肝', 'hígado', 'यकृत', 'الكبد', 'যকৃত', 'fígado', '肝臓', 'כבד')
const STOM = t11('желудок', 'stomach', 'Magen', '胃', 'estómago', 'आमाशय', 'المعدة', 'পাকস্থলী', 'estômago', '胃', 'קיבה')
const KID = t11('почка', 'kidney', 'Niere', '肾', 'riñón', 'वृक्क', 'الكلية', 'কিডনি', 'rim', '腎臓', 'כליה')
const CIRC = t11('кровообращение', 'circulatory', 'Kreislauf', '循环', 'circulatorio', 'परिसंचरण', 'الدوران', 'সঞ্চালন', 'circulatório', '循環', 'מחזור הדם')
const RESP = t11('дыхание', 'respiratory', 'Atmung', '呼吸', 'respiratorio', 'श्वसन', 'التنفس', 'শ্বাস', 'respiratório', '呼吸', 'נשימה')
const NERV = t11('нервная система', 'nervous system', 'Nervensystem', '神经', 'nervioso', 'तंत्रिका', 'العصبي', 'স্নায়ু', 'nervoso', '神経系', 'עצבים')
const DIG = t11('пищеварение', 'digestive', 'Verdauung', '消化', 'digestivo', 'पाचन', 'الهضم', 'হজম', 'digestivo', '消化', 'עיכול')
const EXCR = t11('выделение', 'excretory', 'Ausscheidung', '排泄', 'excretor', 'उत्सर्जन', 'الإخراج', 'মলত্যাগ', 'excretor', '排出', 'הפרשה')

const LIGHT = t11('свет + CO₂ + вода → сахар', 'light + CO₂ + water → sugar', 'Licht + CO₂ + Wasser → Zucker', '光+二氧化碳+水→糖', 'luz + CO₂ + agua → azúcar', 'प्रकाश + CO₂ + जल → शर्करा', 'ضوء + CO₂ + ماء → سكر', 'আলো + CO₂ + জল → চিনি', 'luz + CO₂ + água → açúcar', '光+CO₂+水→糖', 'אור + CO₂ + מים → סוכר')
const PHOTO = t11('фотосинтез', 'photosynthesis', 'Fotosynthese', '光合作用', 'fotosíntesis', 'प्रकाश संश्लेषण', 'التمثيل الضوئي', 'সালোকসংশ্লেষণ', 'fotossíntese', '光合成', 'פוטוסינתזה')
const SUGAR2 = t11('сахар + O₂ → энергия + CO₂', 'sugar + O₂ → energy + CO₂', 'Zucker + O₂ → Energie + CO₂', '糖+氧→能量+二氧化碳', 'azúcar + O₂ → energía + CO₂', 'शर्करा + O₂ → ऊर्जा', 'سكر + O₂ → طاقة', 'চিনি + O₂ → শক্তি', 'açúcar + O₂ → energia', '糖+O₂→エネルギー', 'סוכר + O₂ → אנרגיה')
const CELLR = t11('клеточное дыхание', 'cellular respiration', 'Zellatmung', '细胞呼吸', 'respiración celular', 'कोशिकीय श्वसन', 'التنفس الخلوي', 'কোষীয় শ্বসন', 'respiração celular', '細胞呼吸', 'נשימה תאית')

const ANIMAL = t11('животные', 'animals', 'Tiere', '动物', 'animales', 'जानवर', 'حيوانات', 'প্রাণী', 'animais', '動物', 'בעלי חיים')
const PLANT = t11('растения', 'plants', 'Pflanzen', '植物', 'plantas', 'पौधे', 'نباتات', 'উদ্ভিদ', 'plantas', '植物', 'צמחים')
const FUNGI = t11('грибы', 'fungi', 'Pilze', '真菌', 'hongos', 'कवक', 'فطريات', 'ছত্রাক', 'fungos', '菌類', 'פטריות')
const BACT = t11('бактерии', 'bacteria', 'Bakterien', '细菌', 'bacterias', 'जीवाणु', 'بكتيريا', 'ব্যাকটেরিয়া', 'bactérias', '細菌', 'חיידקים')
const LION = t11('лев, рыба, человек', 'lion, fish, human', 'Löwe, Fisch, Mensch', '狮、鱼、人', 'león, pez, humano', 'शेर, मछली, इंसान', 'أسد وسمك وإنسان', 'সিংহ, মাছ, মানুষ', 'leão, peixe, humano', 'ライオン、魚、人', 'אריה, דג, אדם')
const TREE = t11('дуб, водоросль, мох', 'oak, alga, moss', 'Eiche, Alge, Moos', '橡树、藻、苔', 'roble, alga, musgo', 'ओक, शैवाल, काई', 'بلوط وطحلب', 'ওক, শৈবাল, শ্যাওলা', 'carvalho, alga, musgo', 'オーク、藻、苔', 'אלון, אצה, טחב')
const MUSH = t11('шампиньон, дрожжи', 'mushroom, yeast', 'Champignon, Hefe', '蘑菇、酵母', 'champiñón, levadura', 'मशरूम, खमीर', 'فطر وخميرة', 'মাশরুম, ইস্ট', 'cogumelo, levedura', 'キノコ、酵母', 'פטרייה, שמר')
const ECOLI = t11('кишечная палочка', 'E. coli', 'E. coli', '大肠杆菌', 'E. coli', 'ई. कोलाई', 'الإشريكية', 'ই. কোলাই', 'E. coli', '大腸菌', 'אי. קולי')

const ATHENS = t11('Афины', 'Athens', 'Athen', '雅典', 'Atenas', 'एथेंस', 'أثينا', 'এথেন্স', 'Atenas', 'アテネ', 'אתונה')
const PARIS = t11('Париж', 'Paris', 'Paris', '巴黎', 'París', 'पेरिस', 'باريس', 'প্যারিস', 'Paris', 'パリ', 'פריז')
const TOKYO = t11('Токио', 'Tokyo', 'Tokio', '东京', 'Tokio', 'टोक्यो', 'طوكيو', 'টোকিও', 'Tóquio', '東京', 'טוקיו')
const LONDON = t11('Лондон', 'London', 'London', '伦敦', 'Londres', 'लंदन', 'لندن', 'লন্ডন', 'Londres', 'ロンドン', 'לונדון')
const BEIJING = t11('Пекин', 'Beijing', 'Peking', '北京', 'Pekín', 'बीजिंग', 'بكين', 'বেইজিং', 'Pequim', '北京', 'בייג׳ינג')
const RIO = t11('Рио-де-Жанейро', 'Rio de Janeiro', 'Rio de Janeiro', '里约', 'Río de Janeiro', 'रियो', 'ريو', 'রিও', 'Rio de Janeiro', 'リオ', 'ריו')
const SYDNEY = t11('Сидней', 'Sydney', 'Sydney', '悉尼', 'Sídney', 'सिडनी', 'سيدني', 'সিডনি', 'Sydney', 'シドニー', 'סידני')
const BARC = t11('Барселона', 'Barcelona', 'Barcelona', '巴塞罗那', 'Barcelona', 'बार्सिलोना', 'برشلونة', 'বার্সেলোনা', 'Barcelona', 'バルセロナ', 'ברצלונה')
const Y1896 = t11('1896, лето', '1896 Summer', 'Sommer 1896', '1896 夏奥', 'Verano 1896', '1896 ग्रीष्म', 'صيف 1896', '১৮৯৬ গ্রীষ্ম', 'Verão 1896', '1896夏', 'קיץ 1896')
const Y2024 = t11('2024, лето', '2024 Summer', 'Sommer 2024', '2024 夏奥', 'Verano 2024', '2024 ग्रीष्म', 'صيف 2024', '২০২৪ গ্রীষ্ম', 'Verão 2024', '2024夏', 'קיץ 2024')
const Y2020 = t11('2020/21, лето', '2020/21 Summer', 'Sommer 2020/21', '2020/21 夏奥', 'Verano 2020/21', '2020/21 ग्रीष्म', 'صيف 2020/21', '২০২০/২১ গ্রীষ্ম', 'Verão 2020/21', '2020/21夏', 'קיץ 2020/21')
const Y2012 = t11('2012, лето', '2012 Summer', 'Sommer 2012', '2012 夏奥', 'Verano 2012', '2012 ग्रीष्म', 'صيف 2012', '২০১২ গ্রীষ্ম', 'Verão 2012', '2012夏', 'קיץ 2012')
const Y2008 = t11('2008, лето', '2008 Summer', 'Sommer 2008', '2008 夏奥', 'Verano 2008', '2008 ग्रीष्म', 'صيف 2008', '২০০৮ গ্রীষ্ম', 'Verão 2008', '2008夏', 'קיץ 2008')
const Y2016 = t11('2016, лето', '2016 Summer', 'Sommer 2016', '2016 夏奥', 'Verano 2016', '2016 ग्रीष्म', 'صيف 2016', '২০১৬ গ্রীষ্ম', 'Verão 2016', '2016夏', 'קיץ 2016')
const Y2000 = t11('2000, лето', '2000 Summer', 'Sommer 2000', '2000 夏奥', 'Verano 2000', '2000 ग्रीष्म', 'صيف 2000', '২০০০ গ্রীষ্ম', 'Verão 2000', '2000夏', 'קיץ 2000')
const Y1992 = t11('1992, лето', '1992 Summer', 'Sommer 1992', '1992 夏奥', 'Verano 1992', '1992 ग्रीष्म', 'صيف 1992', '১৯৯২ গ্রীষ্ম', 'Verão 1992', '1992夏', 'קיץ 1992')

const TRACK = t11('лёгкая атлетика', 'athletics', 'Leichtathletik', '田径', 'atletismo', 'एथलेटिक्स', 'ألعاب القوى', 'অ্যাথলেটিক্স', 'atletismo', '陸上', 'אתלטיקה')
const SWIM = t11('плавание', 'swimming', 'Schwimmen', '游泳', 'natación', 'तैराकी', 'السباحة', 'সাঁতার', 'natação', '競泳', 'שחייה')
const GYM = t11('спортивная гимнастика', 'artistic gymnastics', 'Gerätturnen', '体操', 'gimnasia artística', 'जिम्नास्टिक', 'الجمباز', 'জিমন্যাস্টিকস', 'ginástica artística', '体操', 'התעמלות')
const JUDO = t11('дзюдо', 'judo', 'Judo', '柔道', 'judo', 'जूडो', 'الجودو', 'জুডো', 'judo', '柔道', 'ג׳ודו')
const BASK = t11('баскетбол', 'basketball', 'Basketball', '篮球', 'baloncesto', 'बास्केटबॉल', 'كرة السلة', 'বাস্কেটবল', 'basquetebol', 'バスケ', 'כדורסל')
const ARCH = t11('стрельба из лука', 'archery', 'Bogenschießen', '射箭', 'tiro con arco', 'तीरंदाजी', 'الرماية بالقوس', 'তীরন্দাজি', 'arco', 'アーチェリー', 'קשתות')
const AQUA = t11('водные виды', 'aquatic', 'Wassersport', '水上', 'acuático', 'जलीय', 'مائي', 'জলক্রীড়া', 'aquático', '水泳系', 'ימי')
const COMB = t11('единоборства', 'combat', 'Kampfsport', '格斗', 'combate', 'युद्ध कला', 'قتالي', 'যুদ্ধকলা', 'combate', '格闘', 'לחימה')
const BALL = t11('игровые', 'ball sports', 'Ballsport', '球类', 'pelota', 'गेंद खेल', 'كرة', 'বল খেলা', 'bola', '球技', 'כדור')
const PREC = t11('точностные', 'precision', 'Präzision', '精准', 'precisión', 'सटीकता', 'دقة', 'নিখুঁত', 'precisão', '的中', 'דיוק')
const MULTI = t11('многоборье / дорожка', 'track & field', 'Leichtathletik', '田径场', 'pista', 'ट्रैक', 'مضمار', 'ট্র্যাক', 'pista', 'トラック', 'מסלול')

const USA = t11('США', 'United States', 'USA', '美国', 'Estados Unidos', 'संयुक्त राज्य', 'الولايات المتحدة', 'মার্কিন যুক্তরাষ্ট্র', 'Estados Unidos', 'アメリカ', 'ארה״ב')
const GBR = t11('Великобритания', 'Great Britain', 'Großbritannien', '英国', 'Gran Bretaña', 'ब्रिटेन', 'بريطانيا', 'গ্রেট ব্রিটেন', 'Grã-Bretanha', 'イギリス', 'בריטניה')
const JPN = t11('Япония', 'Japan', 'Japan', '日本', 'Japón', 'जापान', 'اليابان', 'জাপান', 'Japão', '日本', 'יפן')
const FRA = t11('Франция', 'France', 'Frankreich', '法国', 'Francia', 'फ़्रांस', 'فرنسا', 'ফ্রান্স', 'França', 'フランス', 'צרפת')
const CHN = t11('Китай', 'China', 'China', '中国', 'China', 'चीन', 'الصين', 'চীন', 'China', '中国', 'סין')
const AUS = t11('Австралия', 'Australia', 'Australien', '澳大利亚', 'Australia', 'ऑस्ट्रेलिया', 'أستراليا', 'অস্ট্রেলিয়া', 'Austrália', 'オーストラリア', 'אוסטרליה')
const BRA = t11('Бразилия', 'Brazil', 'Brasilien', '巴西', 'Brasil', 'ब्राज़ील', 'البرازيل', 'ব্রাজিল', 'Brasil', 'ブラジル', 'ברזיל')
const GRE = t11('Греция', 'Greece', 'Griechenland', '希腊', 'Grecia', 'ग्रीस', 'اليونان', 'গ্রিস', 'Grécia', 'ギリシャ', 'יוון')
const COUNT4 = t11('4 летних Игр', '4 Summer Games', '4 Sommerspiele', '4 届夏奥', '4 Juegos de verano', '4 ग्रीष्म खेल', '4 دورات صيفية', '৪ গ্রীষ্মকালীন', '4 Jogos de verão', '夏季4回', '4 משחקי קיץ')
const COUNT3 = t11('3 летних Игр', '3 Summer Games', '3 Sommerspiele', '3 届夏奥', '3 Juegos de verano', '3 ग्रीष्म खेल', '3 دورات صيفية', '৩ গ্রীষ্মকালীন', '3 Jogos de verão', '夏季3回', '3 משחקי קיץ')
const COUNT2 = t11('2 летние Игры', '2 Summer Games', '2 Sommerspiele', '2 届夏奥', '2 Juegos de verano', '2 ग्रीष्म खेल', 'دورتان صيفيتان', '২ গ্রীষ্মকালীন', '2 Jogos de verão', '夏季2回', '2 משחקי קיץ')
const COUNT1 = t11('1 летние Игры', '1 Summer Games', '1 Sommerspiele', '1 届夏奥', '1 Juegos de verano', '1 ग्रीष्म खेल', 'دورة صيفية واحدة', '১ গ্রীষ্মকালীন', '1 Jogos de verão', '夏季1回', 'משחקי קיץ אחד')

const ALGO = t11('алгоритм', 'algorithm', 'Algorithmus', '算法', 'algoritmo', 'एल्गोरिदम', 'خوارزمية', 'অ্যালগরিদম', 'algoritmo', 'アルゴリズム', 'אלגוריתם')
const VARB = t11('переменная', 'variable', 'Variable', '变量', 'variable', 'चर', 'متغير', 'ভেরিয়েবল', 'variável', '変数', 'משתנה')
const LOOP = t11('цикл', 'loop', 'Schleife', '循环', 'bucle', 'लूप', 'حلقة', 'লুপ', 'ciclo', 'ループ', 'לולאה')
const HTML = t11('HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML')
const HTTP = t11('HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP')
const BIT = t11('бит', 'bit', 'Bit', '比特', 'bit', 'बिट', 'بت', 'বিট', 'bit', 'ビット', 'סיבית')
const ALGOA = t11('пошаговый план решения', 'step-by-step solution plan', 'Schrittfolge zur Lösung', '逐步解题计划', 'plan paso a paso', 'चरणबद्ध हल', 'خطة حل خطوة بخطوة', 'ধাপে ধাপে সমাধান', 'plano passo a passo', '手順のある解法', 'תוכנית פתרון שלב-שלב')
const VARA = t11('именованное значение в памяти', 'named value in memory', 'benannter Speicherwert', '内存中的命名值', 'valor con nombre', 'स्मृति में नामित मान', 'قيمة مسماة في الذاكرة', 'মেমোরিতে নামযুক্ত মান', 'valor nomeado na memória', 'メモリ上の名前付き値', 'ערך בעל שם בזיכרון')
const LOOPA = t11('повтор действий', 'repeat actions', 'Aktionen wiederholen', '重复操作', 'repetir acciones', 'क्रिया दोहराना', 'تكرار الأفعال', 'কাজ পুনরাবৃত্তি', 'repetir ações', '処理の繰り返し', 'חזרה על פעולות')
const HTMLA = t11('язык разметки веб-страниц', 'web page markup language', 'Auszeichnungssprache für Seiten', '网页标记语言', 'lenguaje de marcado web', 'वेब मार्कअप भाषा', 'لغة ترميز الويب', 'ওয়েব মার্কআপ ভাষা', 'linguagem de marcação web', 'ウェブのマークアップ', 'שפת סימון לדפים')
const HTTPA = t11('протокол запроса страниц', 'page request protocol', 'Protokoll für Seitenabruf', '网页请求协议', 'protocolo de petición', 'पेज अनुरोध प्रोटोकॉल', 'بروتوكول طلب الصفحات', 'পেজ অনুরোধ প্রোটোকল', 'protocolo de pedido', 'ページ要求のプロトコル', 'פרוטוקול בקשת דפים')
const BITA = t11('0 или 1', '0 or 1', '0 oder 1', '0 或 1', '0 o 1', '0 या 1', '0 أو 1', '০ বা ১', '0 ou 1', '0か1', '0 או 1')

const D5 = t11('5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5')
const B101 = t11('101₂', '101₂', '101₂', '101₂', '101₂', '101₂', '101₂', '101₂', '101₂', '101₂', '101₂')
const D8 = t11('8', '8', '8', '8', '8', '8', '8', '8', '8', '8', '8')
const B1000 = t11('1000₂', '1000₂', '1000₂', '1000₂', '1000₂', '1000₂', '1000₂', '1000₂', '1000₂', '1000₂', '1000₂')
const D10 = t11('10', '10', '10', '10', '10', '10', '10', '10', '10', '10', '10')
const B1010 = t11('1010₂', '1010₂', '1010₂', '1010₂', '1010₂', '1010₂', '1010₂', '1010₂', '1010₂', '1010₂', '1010₂')
const D15 = t11('15', '15', '15', '15', '15', '15', '15', '15', '15', '15', '15')
const B1111 = t11('1111₂', '1111₂', '1111₂', '1111₂', '1111₂', '1111₂', '1111₂', '1111₂', '1111₂', '1111₂', '1111₂')

const TURING = t11('Тьюринг', 'Turing', 'Turing', '图灵', 'Turing', 'ट्यूरिंग', 'تورنغ', 'টিউরিং', 'Turing', 'チューリング', 'טיורינג')
const ADA = t11('Лавлейс', 'Lovelace', 'Lovelace', '洛夫莱斯', 'Lovelace', 'लवलेस', 'لافليس', 'লাভলেস', 'Lovelace', 'ラブレース', 'לאבלייס')
const TBL = t11('Бернерс-Ли', 'Berners-Lee', 'Berners-Lee', '伯纳斯-李', 'Berners-Lee', 'बर्नर्स-ली', 'بيرنرز-لي', 'বার্নাস-লি', 'Berners-Lee', 'バーナーズ＝リー', 'ברנרס-לי')
const HOPPER = t11('Хоппер', 'Hopper', 'Hopper', '霍珀', 'Hopper', 'हॉपर', 'هوبر', 'হপার', 'Hopper', 'ホッパー', 'הופר')

const SUSHI = t11('суши', 'sushi', 'Sushi', '寿司', 'sushi', 'सुशी', 'سوشي', 'সুশি', 'sushi', '寿司', 'סושי')
const PIZZA = t11('пицца', 'pizza', 'Pizza', '披萨', 'pizza', 'पिज़्ज़ा', 'بيتزا', 'পিজা', 'pizza', 'ピザ', 'פיצה')
const TACO = t11('тако', 'taco', 'Taco', '塔可', 'taco', 'टैको', 'تاكو', 'টাকো', 'taco', 'タコス', 'טאקו')
const PAELLA = t11('паэлья', 'paella', 'Paella', '海鲜饭', 'paella', 'पायेला', 'باييلا', 'পায়েয়া', 'paella', 'パエリア', 'פאייה')
const PAD = t11('пад тай', 'pad thai', 'Pad Thai', '泰式炒河粉', 'pad thai', 'पैड थाई', 'باد تاي', 'প্যাড থাই', 'pad thai', 'パッタイ', 'פאד תאי')
const FEIJO = t11('фейжоада', 'feijoada', 'Feijoada', '黑豆饭', 'feijoada', 'फेजोआडा', 'فيجوادا', 'ফেইজুয়াদা', 'feijoada', 'フェイジョアーダ', 'פייז׳ואדה')
const CURRY = t11('карри', 'curry', 'Curry', '咖喱', 'curry', 'करी', 'كاري', 'কারি', 'caril', 'カレー', 'קארי')
const CROIS = t11('круассан', 'croissant', 'Croissant', '可颂', 'cruasán', 'क्रुआसाँ', 'كرواسون', 'ক্রুয়াসাঁ', 'croissant', 'クロワッサン', 'קרואסון')
const JP = t11('Япония', 'Japan', 'Japan', '日本', 'Japón', 'जापान', 'اليابان', 'জাপান', 'Japão', '日本', 'יפן')
const IT = t11('Италия', 'Italy', 'Italien', '意大利', 'Italia', 'इटली', 'إيطاليا', 'ইতালি', 'Itália', 'イタリア', 'איטליה')
const MX = t11('Мексика', 'Mexico', 'Mexiko', '墨西哥', 'México', 'मेक्सिको', 'المكسيك', 'মেক্সিকো', 'México', 'メキシコ', 'מקסיקו')
const ES = t11('Испания', 'Spain', 'Spanien', '西班牙', 'España', 'स्पेन', 'إسبانيا', 'স্পেন', 'Espanha', 'スペイン', 'ספרד')
const TH = t11('Таиланд', 'Thailand', 'Thailand', '泰国', 'Tailandia', 'थाईलैंड', 'تايلاند', 'থাইল্যান্ড', 'Tailândia', 'タイ', 'תאילנד')
const BR = t11('Бразилия', 'Brazil', 'Brasilien', '巴西', 'Brasil', 'ब्राज़ील', 'البرازيل', 'ব্রাজিল', 'Brasil', 'ブラジル', 'ברזיל')
const IN = t11('Индия', 'India', 'Indien', '印度', 'India', 'भारत', 'الهند', 'ভারত', 'Índia', 'インド', 'הודו')
const FR = t11('Франция', 'France', 'Frankreich', '法国', 'Francia', 'फ़्रांस', 'فرنسا', 'ফ্রান্স', 'França', 'フランス', 'צרפת')
const RICE = t11('рис и сырая рыба', 'rice and raw fish', 'Reis und roher Fisch', '米饭与生鱼', 'arroz y pescado crudo', 'चावल और कच्ची मछली', 'أرز وسمك نيء', 'ভাত ও কাঁচা মাছ', 'arroz e peixe cru', 'ご飯と生魚', 'אורז ודג חי')
const DOUGH = t11('тесто, томат, сыр', 'dough, tomato, cheese', 'Teig, Tomate, Käse', '面团、番茄、奶酪', 'masa, tomate, queso', 'आटा, टमाटर, पनीर', 'عجينة وطماطم وجبن', 'ডো, টমেটো, পনির', 'massa, tomate, queijo', '生地・トマト・チーズ', 'בצק, עגבנייה, גבינה')
const MAIZE = t11('кукурузная тортилья', 'corn tortilla', 'Maistortilla', '玉米饼', 'tortilla de maíz', 'मक्का टॉर्टिला', 'تورتيلا ذرة', 'ভুট্টার টরটিলা', 'tortilha de milho', 'トルティーヤ', 'טורטייה')

const CAR = t11('автомобиль', 'car', 'Auto', '汽车', 'coche', 'कार', 'سيارة', 'গাড়ি', 'carro', '自動車', 'מכונית')
const TRAIN = t11('поезд', 'train', 'Zug', '火车', 'tren', 'रेल', 'قطار', 'ট্রেন', 'comboio', '列車', 'רכבת')
const SHIP = t11('корабль', 'ship', 'Schiff', '船', 'barco', 'जहाज', 'سفينة', 'জাহাজ', 'navio', '船', 'ספינה')
const PLANE = t11('самолёт', 'airplane', 'Flugzeug', '飞机', 'avión', 'विमान', 'طائرة', 'বিমান', 'avião', '飛行機', 'מטוס')
const BIKE = t11('велосипед', 'bicycle', 'Fahrrad', '自行车', 'bicicleta', 'साइकिल', 'دراجة', 'সাইকেল', 'bicicleta', '自転車', 'אופניים')
const METRO = t11('метро', 'metro', 'U-Bahn', '地铁', 'metro', 'मेट्रो', 'مترو', 'মেট্রো', 'metro', '地下鉄', 'רכבת תחתית')
const LAND = t11('сухопутный', 'land', 'Land', '陆路', 'terrestre', 'स्थल', 'بري', 'স্থল', 'terrestre', '陸上', 'יבשתי')
const RAIL = t11('рельсовый', 'rail', 'Schiene', '轨道', 'ferroviario', 'रेल', 'سكة', 'রেল', 'ferroviário', '軌道', 'מסילה')
const WATER = t11('водный', 'water', 'Wasser', '水路', 'acuático', 'जल', 'مائي', 'জল', 'aquático', '水上', 'ימי')
const AIR = t11('воздушный', 'air', 'Luft', '空中', 'aéreo', 'वायु', 'جوي', 'আকাশ', 'aéreo', '空', 'אווירי')
const BENZ = t11('Карл Бенц', 'Karl Benz', 'Carl Benz', '卡尔·本茨', 'Karl Benz', 'कार्ल बेंज', 'كارل بنز', 'কার্ল বেঞ্জ', 'Karl Benz', 'カール・ベンツ', 'קארל בנץ')
const WRIGHT = t11('братья Райт', 'Wright brothers', 'Brüder Wright', '莱特兄弟', 'hermanos Wright', 'राइट बंधु', 'الأخوان رايت', 'রাইট ভাইয়েরা', 'irmãos Wright', 'ライト兄弟', 'האחים רייט')
const STEPH = t11('Стивенсон', 'Stephenson', 'Stephenson', '斯蒂芬森', 'Stephenson', 'स्टीफेंसन', 'ستيفنسون', 'স্টিফেনসন', 'Stephenson', 'スチーブンソン', 'סטיבנסון')

export const THEME_ITEMS: ThemeItem[] = [
  row('n-role', 'organelleToRole', 'easy', NUCLEUS, DNA, { key: 'dna' }),
  row('m-role', 'organelleToRole', 'easy', MITO, ATP, { key: 'atp' }),
  row('c-role', 'organelleToRole', 'medium', CHLORO, SUGAR, { key: 'sugar' }),
  row('r-role', 'organelleToRole', 'medium', RIBO, PROT, { key: 'prot' }),
  row('b-role', 'organelleToRole', 'easy', MEMB, BORDER, { key: 'border' }),
  row('n-from', 'roleToOrganelle', 'easy', DNA, NUCLEUS, { key: 'nuc' }),
  row('m-from', 'roleToOrganelle', 'easy', ATP, MITO, { key: 'mito' }),
  row('c-from', 'roleToOrganelle', 'medium', SUGAR, CHLORO, { key: 'chl' }),
  row('r-from', 'roleToOrganelle', 'medium', PROT, RIBO, { key: 'ribo' }),
  row('b-from', 'roleToOrganelle', 'easy', BORDER, MEMB, { key: 'mem' }),
  row('h-sys', 'organToSystem', 'easy', HEART, CIRC, { key: 'circ' }),
  row('l-sys', 'organToSystem', 'easy', LUNGS, RESP, { key: 'resp' }),
  row('br-sys', 'organToSystem', 'easy', BRAIN, NERV, { key: 'nerv' }),
  row('s-sys', 'organToSystem', 'medium', STOM, DIG, { key: 'dig' }),
  row('k-sys', 'organToSystem', 'medium', KID, EXCR, { key: 'exc' }),
  row('li-sys', 'organToSystem', 'hard', LIVER, DIG, { key: 'dig' }),
  row('ph-name', 'photoStepToName', 'easy', LIGHT, PHOTO, { key: 'photo' }),
  row('cr-name', 'photoStepToName', 'medium', SUGAR2, CELLR, { key: 'cellr' }),
  row('an-ex', 'kingdomToExample', 'easy', ANIMAL, LION, { key: 'lion' }),
  row('pl-ex', 'kingdomToExample', 'easy', PLANT, TREE, { key: 'tree' }),
  row('fu-ex', 'kingdomToExample', 'medium', FUNGI, MUSH, { key: 'mush' }),
  row('ba-ex', 'kingdomToExample', 'medium', BACT, ECOLI, { key: 'coli' }),

  row('y-1896', 'olyYearToHost', 'easy', Y1896, ATHENS, { key: 'athens' }),
  row('y-2024', 'olyYearToHost', 'easy', Y2024, PARIS, { key: 'paris' }),
  row('y-2020', 'olyYearToHost', 'easy', Y2020, TOKYO, { key: 'tokyo' }),
  row('y-2012', 'olyYearToHost', 'easy', Y2012, LONDON, { key: 'london' }),
  row('y-2008', 'olyYearToHost', 'medium', Y2008, BEIJING, { key: 'beijing' }),
  row('y-2016', 'olyYearToHost', 'medium', Y2016, RIO, { key: 'rio' }),
  row('y-2000', 'olyYearToHost', 'medium', Y2000, SYDNEY, { key: 'sydney' }),
  row('y-1992', 'olyYearToHost', 'hard', Y1992, BARC, { key: 'barc' }),
  row('h-1896', 'olyHostToYear', 'easy', ATHENS, Y1896, { key: '1896' }),
  row('h-2024', 'olyHostToYear', 'easy', PARIS, Y2024, { key: '2024' }),
  row('h-2020', 'olyHostToYear', 'easy', TOKYO, Y2020, { key: '2020' }),
  row('h-2012', 'olyHostToYear', 'easy', LONDON, Y2012, { key: '2012' }),
  row('h-2008', 'olyHostToYear', 'medium', BEIJING, Y2008, { key: '2008' }),
  row('h-2016', 'olyHostToYear', 'medium', RIO, Y2016, { key: '2016' }),
  row('h-2000', 'olyHostToYear', 'medium', SYDNEY, Y2000, { key: '2000' }),
  row('h-1992', 'olyHostToYear', 'hard', BARC, Y1992, { key: '1992' }),
  row('hc-usa', 'olyHostCount', 'medium', USA, COUNT4, { key: 'c4' }),
  row('hc-gbr', 'olyHostCount', 'medium', GBR, COUNT3, { key: 'c3' }),
  row('hc-fra', 'olyHostCount', 'hard', FRA, COUNT3, { key: 'c3' }),
  row('hc-jpn', 'olyHostCount', 'easy', JPN, COUNT2, { key: 'c2' }),
  row('hc-gre', 'olyHostCount', 'easy', GRE, COUNT2, { key: 'c2' }),
  row('hc-chn', 'olyHostCount', 'easy', CHN, COUNT1, { key: 'c1' }),
  row('hc-aus', 'olyHostCount', 'easy', AUS, COUNT2, { key: 'c2' }),
  row('hc-bra', 'olyHostCount', 'easy', BRA, COUNT1, { key: 'c1' }),
  row('sp-ath', 'sportToCategory', 'easy', TRACK, MULTI, { key: 'multi' }),
  row('sp-sw', 'sportToCategory', 'easy', SWIM, AQUA, { key: 'aqua' }),
  row('sp-gy', 'sportToCategory', 'medium', GYM, MULTI, { key: 'multi' }),
  row('sp-ju', 'sportToCategory', 'easy', JUDO, COMB, { key: 'comb' }),
  row('sp-ba', 'sportToCategory', 'easy', BASK, BALL, { key: 'ball' }),
  row('sp-ar', 'sportToCategory', 'medium', ARCH, PREC, { key: 'prec' }),
  row('noc-usa', 'nocToName', 'easy', t11('USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA'), USA, { key: 'usa' }),
  row('noc-gbr', 'nocToName', 'easy', t11('GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR'), GBR, { key: 'gbr' }),
  row('noc-jpn', 'nocToName', 'easy', t11('JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN'), JPN, { key: 'jpn' }),
  row('noc-fra', 'nocToName', 'easy', t11('FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA'), FRA, { key: 'fra' }),
  row('noc-chn', 'nocToName', 'easy', t11('CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN'), CHN, { key: 'chn' }),
  row('noc-aus', 'nocToName', 'medium', t11('AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS'), AUS, { key: 'aus' }),
  row('noc-bra', 'nocToName', 'medium', t11('BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA'), BRA, { key: 'bra' }),
  row('noc-gre', 'nocToName', 'medium', t11('GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE'), GRE, { key: 'gre' }),

  row('t-al', 'csTermToMeaning', 'easy', ALGO, ALGOA, { key: 'algoa' }),
  row('t-va', 'csTermToMeaning', 'easy', VARB, VARA, { key: 'vara' }),
  row('t-lo', 'csTermToMeaning', 'easy', LOOP, LOOPA, { key: 'loopa' }),
  row('t-ht', 'csTermToMeaning', 'medium', HTML, HTMLA, { key: 'htmla' }),
  row('t-hp', 'csTermToMeaning', 'medium', HTTP, HTTPA, { key: 'httpa' }),
  row('t-bi', 'csTermToMeaning', 'easy', BIT, BITA, { key: 'bita' }),
  row('m-al', 'meaningToCsTerm', 'easy', ALGOA, ALGO, { key: 'algo' }),
  row('m-va', 'meaningToCsTerm', 'easy', VARA, VARB, { key: 'var' }),
  row('m-lo', 'meaningToCsTerm', 'easy', LOOPA, LOOP, { key: 'loop' }),
  row('m-ht', 'meaningToCsTerm', 'medium', HTMLA, HTML, { key: 'html' }),
  row('m-hp', 'meaningToCsTerm', 'medium', HTTPA, HTTP, { key: 'http' }),
  row('m-bi', 'meaningToCsTerm', 'easy', BITA, BIT, { key: 'bit' }),
  row('d-5', 'decToBinary', 'easy', D5, B101, { key: 'b101' }),
  row('d-8', 'decToBinary', 'easy', D8, B1000, { key: 'b1000' }),
  row('d-10', 'decToBinary', 'medium', D10, B1010, { key: 'b1010' }),
  row('d-15', 'decToBinary', 'medium', D15, B1111, { key: 'b1111' }),
  row('b-5', 'binaryToDec', 'easy', B101, D5, { key: 'd5' }),
  row('b-8', 'binaryToDec', 'easy', B1000, D8, { key: 'd8' }),
  row('b-10', 'binaryToDec', 'medium', B1010, D10, { key: 'd10' }),
  row('b-15', 'binaryToDec', 'medium', B1111, D15, { key: 'd15' }),
  row('ph-tu', 'csPhotoToName', 'easy', TURING, TURING, { key: 'tur', wiki: 'Alan Turing', wikiFile: 'Alan Turing Aged 16.jpg' }),
  row('ph-ad', 'csPhotoToName', 'easy', ADA, ADA, { key: 'ada', wiki: 'Ada Lovelace', wikiFile: 'Ada Lovelace portrait.jpg' }),
  row('ph-tb', 'csPhotoToName', 'medium', TBL, TBL, { key: 'tbl', wiki: 'Tim Berners-Lee', wikiFile: 'Tim Berners-Lee 2014.jpg' }),
  row('ph-ho', 'csPhotoToName', 'medium', HOPPER, HOPPER, { key: 'hop', wiki: 'Grace Hopper', wikiFile: 'Commodore Grace M. Hopper, USN (covered).jpg' }),

  row('di-su', 'dishToCuisine', 'easy', SUSHI, JP, { key: 'jp' }),
  row('di-pi', 'dishToCuisine', 'easy', PIZZA, IT, { key: 'it' }),
  row('di-ta', 'dishToCuisine', 'easy', TACO, MX, { key: 'mx' }),
  row('di-pa', 'dishToCuisine', 'medium', PAELLA, ES, { key: 'es' }),
  row('di-pd', 'dishToCuisine', 'medium', PAD, TH, { key: 'th' }),
  row('di-fe', 'dishToCuisine', 'hard', FEIJO, BR, { key: 'br' }),
  row('di-cu', 'dishToCuisine', 'easy', CURRY, IN, { key: 'in' }),
  row('di-cr', 'dishToCuisine', 'easy', CROIS, FR, { key: 'fr' }),
  row('cu-su', 'cuisineToDish', 'easy', JP, SUSHI, { key: 'sushi' }),
  row('cu-pi', 'cuisineToDish', 'easy', IT, PIZZA, { key: 'pizza' }),
  row('cu-ta', 'cuisineToDish', 'easy', MX, TACO, { key: 'taco' }),
  row('cu-pa', 'cuisineToDish', 'medium', ES, PAELLA, { key: 'paella' }),
  row('cu-pd', 'cuisineToDish', 'medium', TH, PAD, { key: 'pad' }),
  row('cu-fe', 'cuisineToDish', 'hard', BR, FEIJO, { key: 'fei' }),
  row('cu-cu', 'cuisineToDish', 'easy', IN, CURRY, { key: 'curry' }),
  row('cu-cr', 'cuisineToDish', 'easy', FR, CROIS, { key: 'crois' }),
  row('or-su', 'foodToOrigin', 'easy', RICE, SUSHI, { key: 'sushi' }),
  row('or-pi', 'foodToOrigin', 'easy', DOUGH, PIZZA, { key: 'pizza' }),
  row('or-ta', 'foodToOrigin', 'medium', MAIZE, TACO, { key: 'taco' }),

  row('ve-car', 'vehicleToKind', 'easy', CAR, LAND, { key: 'land' }),
  row('ve-tr', 'vehicleToKind', 'easy', TRAIN, RAIL, { key: 'rail' }),
  row('ve-sh', 'vehicleToKind', 'easy', SHIP, WATER, { key: 'water' }),
  row('ve-pl', 'vehicleToKind', 'easy', PLANE, AIR, { key: 'air' }),
  row('ve-bi', 'vehicleToKind', 'easy', BIKE, LAND, { key: 'land' }),
  row('ve-me', 'vehicleToKind', 'medium', METRO, RAIL, { key: 'rail' }),
  row('ki-car', 'kindToVehicle', 'easy', LAND, CAR, { key: 'car' }),
  row('ki-tr', 'kindToVehicle', 'easy', RAIL, TRAIN, { key: 'train' }),
  row('ki-sh', 'kindToVehicle', 'easy', WATER, SHIP, { key: 'ship' }),
  row('ki-pl', 'kindToVehicle', 'easy', AIR, PLANE, { key: 'plane' }),
  row('inv-be', 'inventorToVehicle', 'easy', BENZ, CAR, { key: 'car' }),
  row('inv-wr', 'inventorToVehicle', 'easy', WRIGHT, PLANE, { key: 'plane' }),
  row('inv-st', 'inventorToVehicle', 'medium', STEPH, TRAIN, { key: 'train' }),
].filter((item): item is ThemeItem => item !== null)

const BY_ID = new Map(THEME_ITEMS.map((item) => [item.id, item]))

export function themeById(id: string): ThemeItem | undefined {
  return BY_ID.get(id)
}

export function themeCountry(item: ThemeItem): Country {
  return {
    iso: item.id,
    nameEn: pickL(item.answer, 'en'),
    nameRu: pickL(item.answer, 'ru'),
    region: 'europe',
    difficulty: item.tier === 'easy' ? 'easy' : 'hard',
  }
}

export function themeItemFromCountry(country: Country, mode: ThemeMode): ThemeItem {
  const existing = themeById(country.iso)
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

export function themeDisplayName(item: ThemeItem, lang: Lang): string {
  return pickL(item.answer, lang)
}

export function themePromptOf(item: ThemeItem, lang: Lang): string {
  return pickL(item.prompt, lang)
}

export function themeItemsOf(mode: ThemeMode, difficulty?: ThemeTier): ThemeItem[] {
  const pool = THEME_ITEMS.filter((item) => item.mode === mode)
  if (!difficulty) return pool
  const match = pool.filter((item) => item.tier === difficulty)
  if (match.length >= 4) return match
  if (difficulty === 'easy') return pool.filter((item) => item.tier !== 'hard')
  if (difficulty === 'hard') return pool.filter((item) => item.tier !== 'easy')
  return pool
}

export function themeLevelIsos(mode: ThemeMode, level: number): string[] {
  const pool = themeItemsOf(mode)
  if (pool.length === 0) return []
  const out: string[] = []
  const start = ((level - 1) * THEME_LEVEL_QUESTIONS) % pool.length
  for (let i = 0; i < THEME_LEVEL_QUESTIONS; i += 1) {
    out.push(pool[(start + i) % pool.length].id)
  }
  return out
}
