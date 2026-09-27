import type { Country } from './countries'
import type { Lang } from '../i18n/lang'
import { pickL, t11, type L11 } from './math'
import { isThemeMode, type ThemeMode } from '../lib/quiz/themeModes'
import { THEME_LEVEL_QUESTIONS } from '../lib/quiz/themeModes'
import { olyGeneratedRows } from './olympics/rows'
import { csGeneratedRows } from './cs/rows'
import { foodGeneratedRows } from './food/rows'
import { BIO_CLASS_PHOTO, bioGeneratedRows } from './biology/rows'
import { olyPortrait } from './olympics/portraits'

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
  note?: L11
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

function star(
  id: string,
  mode: string,
  tier: ThemeTier,
  prompt: L11,
  answer: L11,
  extra: Partial<Omit<ThemeItem, 'id' | 'mode' | 'tier' | 'prompt' | 'answer'>> = {},
): ThemeItem | null {
  return row(id, mode, tier, prompt, answer, { ...olyPortrait(pickL(prompt, 'en')), ...extra })
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
const LYSOS = t11('лизосома', 'lysosome', 'Lysosom', '溶酶体', 'lisosoma', 'लाइसोसोम', 'الليسوسوم', 'লাইসোসোম', 'lisossomo', 'リソソーム', 'ליזוזום')
const GOLGI = t11('аппарат Гольджи', 'Golgi apparatus', 'Golgi-Apparat', '高尔基体', 'aparato de Golgi', 'गॉल्जी काय', 'جهاز غولجي', 'গলজি যন্ত্র', 'complexo de Golgi', 'ゴルジ体', 'מערכת גולג׳י')
const ER = t11('эндоплазматическая сеть', 'endoplasmic reticulum', 'endoplasmatisches Retikulum', '内质网', 'retículo endoplasmático', 'अंतर्द्रव्यी जालिका', 'الشبكة الإندوبلازمية', 'এন্ডোপ্লাজমিক রেটিকুলাম', 'retículo endoplasmático', '小胞体', 'רשתית אנדופלזמית')
const VAC = t11('вакуоль', 'vacuole', 'Vakuole', '液泡', 'vacuola', 'रिक्तिका', 'الفجوة', 'ভ্যাকুওল', 'vacúolo', '液胞', 'חלולית')
const WALL = t11('клеточная стенка', 'cell wall', 'Zellwand', '细胞壁', 'pared celular', 'कोशिका भित्ति', 'الجدار الخلوي', 'কোষপ্রাচীর', 'parede celular', '細胞壁', 'דופן התא')
const WASTE = t11('переваривает отходы', 'digests waste', 'verdaut Abfall', '分解废物', 'digiere residuos', 'कचरा पचाता है', 'يهضم الفضلات', 'বর্জ্য হজম করে', 'digere resíduos', '廃棄物を分解', 'מפרק פסולת')
const PACK = t11('упаковывает белки', 'packages proteins', 'packt Proteine', '包装蛋白质', 'empaqueta proteínas', 'प्रोटीन पैक करता है', 'يغلف البروتينات', 'প্রোটিন মোড়ায়', 'empacota proteínas', 'タンパク質を梱包', 'ארוז חלבונים')
const TRANS = t11('транспорт веществ', 'transports materials', 'transportiert Stoffe', '运输物质', 'transporta materiales', 'पदार्थ पहुँचाता है', 'ينقل المواد', 'পদার্থ পরিবহন', 'transporta materiais', '物質を運ぶ', 'מעביר חומרים')
const STORE = t11('запас воды', 'stores water', 'speichert Wasser', '储存水分', 'almacena agua', 'पानी जमा करता है', 'يخزن الماء', 'জল সঞ্চয়', 'armazena água', '水を蓄える', 'אוגר מים')
const SUPPORT = t11('опора клетки', 'cell support', 'Zellstütze', '细胞支撑', 'soporte celular', 'कोशिका सहारा', 'دعم الخلية', 'কোষের সাপোর্ট', 'suporte da célula', '細胞の支え', 'תמיכת התא')

const SKIN = t11('кожа', 'skin', 'Haut', '皮肤', 'piel', 'त्वचा', 'الجلد', 'ত্বক', 'pele', '皮膚', 'עור')
const BONE = t11('кость', 'bone', 'Knochen', '骨', 'hueso', 'हड्डी', 'العظم', 'হাড়', 'osso', '骨', 'עצם')
const SPLEEN = t11('селезёнка', 'spleen', 'Milz', '脾', 'bazo', 'प्लीहा', 'الطحال', 'প্লীহা', 'baço', '脾臓', 'טחול')
const THYR = t11('щитовидная железа', 'thyroid', 'Schilddrüse', '甲状腺', 'tiroides', 'थायरॉइड', 'الغدة الدرقية', 'থাইরয়েড', 'tiroide', '甲状腺', 'בלוטת התריס')
const OVARY = t11('яичник', 'ovary', 'Eierstock', '卵巢', 'ovario', 'अंडाशय', 'المبيض', 'ডিম্বাশয়', 'ovário', '卵巣', 'שחלה')
const INTEG = t11('покровная система', 'integumentary', 'Hautsystem', '皮肤系统', 'tegumentario', 'अधिचर्म', 'غلافي', 'ত্বকতন্ত্র', 'tegumentar', '皮膚系', 'כיסוי')
const MUSC = t11('опорно-двигательная', 'musculoskeletal', 'Bewegungsapparat', '运动系统', 'musculoesquelético', 'कंकाल-पेशी', 'عضلي هيكلي', 'পেশি-কঙ্কাল', 'musculoesquelético', '運動器系', 'שלד-שריר')
const IMM = t11('иммунная система', 'immune system', 'Immunsystem', '免疫', 'inmunitario', 'प्रतिरक्षा', 'المناعة', 'রোগপ্রতিরোধ', 'imunitário', '免疫系', 'חיסון')
const ENDO = t11('эндокринная система', 'endocrine', 'endokrin', '内分泌', 'endocrino', 'अंतःस्रावी', 'الغدد الصماء', 'অন্তঃক্ষরা', 'endócrino', '内分泌系', 'אנדוקרינית')
const REPRO = t11('половая система', 'reproductive', 'Fortpflanzung', '生殖', 'reproductor', 'प्रजनन', 'التكاثر', 'প্রজনন', 'reprodutor', '生殖系', 'רבייה')

const MITOS = t11('митоз', 'mitosis', 'Mitose', '有丝分裂', 'mitosis', 'समसूत्री विभाजन', 'الانقسام المتساوي', 'মাইটোসিস', 'mitose', '有糸分裂', 'מיטוזה')
const MEIOS = t11('мейоз', 'meiosis', 'Meiose', '减数分裂', 'meiosis', 'अर्धसूत्री विभाजन', 'الانقسام الاختزالي', 'মিয়োসিস', 'meiose', '減数分裂', 'מיוזה')
const FERM = t11('брожение', 'fermentation', 'Gärung', '发酵', 'fermentación', 'किण्वन', 'التخمير', 'গাঁজন', 'fermentação', '発酵', 'תסיסה')
const TRANSP = t11('транспирация', 'transpiration', 'Transpiration', '蒸腾', 'transpiración', 'वाष्पोत्सर्जन', 'النتح', 'প্রস্বেদন', 'transpiração', '蒸散', 'דיות')
const OSMO = t11('осмос', 'osmosis', 'Osmose', '渗透', 'ósmosis', 'परासरण', 'التناضح', 'অসমোসিস', 'osmose', '浸透', 'אוסמוזה')
const DIFF = t11('диффузия', 'diffusion', 'Diffusion', '扩散', 'difusión', 'विसरण', 'الانتشار', 'ব্যাপন', 'difusão', '拡散', 'דיפוזיה')
const REPL = t11('репликация ДНК', 'DNA replication', 'DNA-Replikation', 'DNA 复制', 'replicación del ADN', 'डीएनए प्रतिकृति', 'استنساخ الحمض النووي', 'ডিএনএ প্রতিলিপি', 'replicação do ADN', 'DNA複製', 'שכפול DNA')
const TRANSL = t11('синтез белка', 'protein synthesis', 'Proteinsynthese', '蛋白质合成', 'síntesis de proteínas', 'प्रोटीन संश्लेषण', 'تصنيع البروتين', 'প্রোটিন সংশ্লেষণ', 'síntese de proteínas', 'タンパク質合成', 'סינתזת חלבון')
const MITOSD = t11('одна клетка → две одинаковые', 'one cell → two identical', 'eine Zelle → zwei gleiche', '一细胞→两个相同', 'una célula → dos iguales', 'एक कोशिका → दो समान', 'خلية → خليتان متماثلتان', 'এক কোষ → দুই অনুরূপ', 'uma célula → duas iguais', '1細胞→同じ2つ', 'תא אחד → שני זהים')
const MEIOSD = t11('деление для половых клеток', 'division for gametes', 'Teilung für Keimzellen', '形成配子', 'división para gametos', 'युग्मकों के लिए विभाजन', 'انقسام للأمشاج', 'গ্যামেটের জন্য বিভাজন', 'divisão para gâmetas', '生殖細胞のための分裂', 'חלוקה לתאי מין')
const FERMD = t11('сахар → энергия без O₂', 'sugar → energy without O₂', 'Zucker → Energie ohne O₂', '糖→能量（无氧）', 'azúcar → energía sin O₂', 'शर्करा → ऊर्जा बिना O₂', 'سكر → طاقة بلا أكسجين', 'চিনি → শক্তি O₂ ছাড়া', 'açúcar → energia sem O₂', '糖→酸素なしでエネルギー', 'סוכר → אנרגיה בלי O₂')
const TRANSPD = t11('вода испаряется из листьев', 'water evaporates from leaves', 'Wasser verdunstet aus Blättern', '水分从叶面蒸发', 'el agua se evapora de las hojas', 'पत्तियों से जल भाप बनता है', 'الماء يتبخر من الأوراق', 'পাতা থেকে জল বাষ্প হয়', 'água evapora das folhas', '葉から水が蒸発', 'מים מתאדים מהעלים')
const OSMOD = t11('вода через мембрану', 'water through a membrane', 'Wasser durch eine Membran', '水穿过膜', 'agua a través de una membrana', 'झिल्ली से होकर जल', 'ماء عبر غشاء', 'ঝিল্লি দিয়ে জল', 'água através de uma membrana', '膜を通る水', 'מים דרך קרום')
const DIFFD = t11('частицы растекаются', 'particles spread out', 'Teilchen verteilen sich', '粒子扩散开', 'las partículas se dispersan', 'कण फैल जाते हैं', 'الجسيمات تنتشر', 'কণা ছড়িয়ে পড়ে', 'as partículas espalham-se', '粒子が広がる', 'חלקיקים מתפזרים')
const REPLD = t11('ДНК копирует себя', 'DNA copies itself', 'DNA kopiert sich', 'DNA 自我复制', 'el ADN se copia', 'डीएनए अपनी प्रति बनाता है', 'الحمض النووي ينسخ نفسه', 'ডিএনএ নিজের কপি করে', 'o ADN copia-se', 'DNAが自分を複製', 'DNA מעתיק את עצמו')
const TRANSLD = t11('с мРНК собирается белок', 'protein is built from mRNA', 'Protein entsteht aus mRNA', '由 mRNA 合成蛋白质', 'se arma proteína desde ARNm', 'mRNA से प्रोटीन बनता है', 'بروتين يُبنى من mRNA', 'mRNA থেকে প্রোটিন তৈরি', 'proteína a partir do ARNm', 'mRNAからタンパク質', 'חלבון נבנה מ-mRNA')

const PROTIST = t11('протисты', 'protists', 'Protisten', '原生生物', 'protistas', 'प्रोटिस्ट', 'الطلائعيات', 'প্রোটিস্ট', 'protistas', '原生生物', 'פרוטיסטים')
const AMOEBA = t11('амёба, инфузория', 'amoeba, paramecium', 'Amöbe, Pantoffeltierchen', '变形虫、草履虫', 'ameba, paramecio', 'अमीबा, पैरामिशियम', 'أميبا وباراميسيوم', 'অ্যামিবা, প্যারামেসিয়াম', 'ameba, paramécio', 'アメーバ、ゾウリムシ', 'אמבה, סנדלית')
const OAK = t11('дуб', 'oak', 'Eiche', '橡树', 'roble', 'ओक', 'بلوط', 'ওক', 'carvalho', 'オーク', 'אלון')
const MUSH1 = t11('шампиньон', 'mushroom', 'Champignon', '蘑菇', 'champiñón', 'मशरूम', 'فطر', 'মাশরুম', 'cogumelo', 'キノコ', 'פטרייה')
const AMOEBA1 = t11('амёба', 'amoeba', 'Amöbe', '变形虫', 'ameba', 'अमीबा', 'أميبا', 'অ্যামিবা', 'ameba', 'アメーバ', 'אמבה')
const LION1 = t11('лев', 'lion', 'Löwe', '狮', 'león', 'शेर', 'أسد', 'সিংহ', 'leão', 'ライオン', 'אריה')

const EAGLE = t11('орёл', 'eagle', 'Adler', '鹰', 'águila', 'ईगल', 'نسر', 'ঈগল', 'águia', 'ワシ', 'עיט')
const SHARK = t11('акула', 'shark', 'Hai', '鲨', 'tiburón', 'शार्क', 'قرش', 'হাঙ্গর', 'tubarão', 'サメ', 'כריש')
const FROG = t11('лягушка', 'frog', 'Frosch', '蛙', 'rana', 'मेंढक', 'ضفدع', 'ব্যাঙ', 'rã', 'カエル', 'צפרדע')
const SNAKE = t11('змея', 'snake', 'Schlange', '蛇', 'serpiente', 'साँप', 'ثعبان', 'সাপ', 'cobra', 'ヘビ', 'נחש')
const BEE = t11('пчела', 'bee', 'Biene', '蜂', 'abeja', 'मधुमक्खी', 'نحلة', 'মৌমাছি', 'abelha', 'ミツバチ', 'דבורה')
const SPIDER = t11('паук', 'spider', 'Spinne', '蜘蛛', 'araña', 'मकड़ी', 'عنكبوت', 'মাকড়সা', 'aranha', 'クモ', 'עכביש')
const SNAIL = t11('улитка', 'snail', 'Schnecke', '蜗牛', 'caracol', 'घोंघा', 'حلزون', 'শামুক', 'caracol', 'カタツムリ', 'חילזון')
const CRAB = t11('краб', 'crab', 'Krabbe', '蟹', 'cangrejo', 'केकड़ा', 'سلطعون', 'কাঁকড়া', 'caranguejo', 'カニ', 'סרטן')
const WORM = t11('дождевой червь', 'earthworm', 'Regenwurm', '蚯蚓', 'lombriz', 'केंचुआ', 'دودة الأرض', 'কেঁচো', 'minhoca', 'ミミズ', 'תולעת אדמה')
const MAMMAL = t11('млекопитающие', 'mammals', 'Säugetiere', '哺乳动物', 'mamíferos', 'स्तनधारी', 'ثدييات', 'স্তন্যপায়ী', 'mamíferos', '哺乳類', 'יונקים')
const BIRD = t11('птицы', 'birds', 'Vögel', '鸟类', 'aves', 'पक्षी', 'طيور', 'পাখি', 'aves', '鳥類', 'עופות')
const FISH = t11('рыбы', 'fish', 'Fische', '鱼类', 'peces', 'मछलियाँ', 'أسماك', 'মাছ', 'peixes', '魚類', 'דגים')
const AMPH = t11('земноводные', 'amphibians', 'Amphibien', '两栖动物', 'anfibios', 'उभयचर', 'برمائيات', 'উভচর', 'anfíbios', '両生類', 'דו־חיים')
const REPT = t11('пресмыкающиеся', 'reptiles', 'Reptilien', '爬行动物', 'reptiles', 'सरीसृप', 'زواحف', 'সরীসৃপ', 'répteis', '爬虫類', 'זוחלים')
const INSECT = t11('насекомые', 'insects', 'Insekten', '昆虫', 'insectos', 'कीट', 'حشرات', 'পোকা', 'insetos', '昆虫', 'חרקים')
const ARACH = t11('паукообразные', 'arachnids', 'Spinnentiere', '蛛形纲', 'arácnidos', 'अरैक्निड', 'عنكبيات', 'আরাকনিড', 'aracnídeos', 'クモ綱', 'עכבישניים')
const MOLL = t11('моллюски', 'molluscs', 'Weichtiere', '软体动物', 'moluscos', 'मोलस्क', 'رخويات', 'মলাস্ক', 'moluscos', '軟体動物', 'רכיכות')
const CRUST = t11('ракообразные', 'crustaceans', 'Krebstiere', '甲壳动物', 'crustáceos', 'क्रस्टेशियन', 'قشريات', 'ক্রাস্টেশিয়ান', 'crustáceos', '甲殻類', 'סרטנאים')
const ANNEL = t11('кольчатые черви', 'annelids', 'Ringelwürmer', '环节动物', 'anélidos', 'एनेलिड', 'حلقيات', 'অ্যানেলিড', 'anelídeos', '環形動物', 'תולעים טבעתיות')

const ATHENS = t11('Афины', 'Athens', 'Athen', '雅典', 'Atenas', 'एथेंस', 'أثينا', 'এথেন্স', 'Atenas', 'アテネ', 'אתונה')
const PARIS = t11('Париж', 'Paris', 'Paris', '巴黎', 'París', 'पेरिस', 'باريس', 'প্যারিস', 'Paris', 'パリ', 'פריז')
const TOKYO = t11('Токио', 'Tokyo', 'Tokio', '东京', 'Tokio', 'टोक्यो', 'طوكيو', 'টোকিও', 'Tóquio', '東京', 'טוקיו')
const LONDON = t11('Лондон', 'London', 'London', '伦敦', 'Londres', 'लंदन', 'لندن', 'লন্ডন', 'Londres', 'ロンドン', 'לונדון')
const BEIJING = t11('Пекин', 'Beijing', 'Peking', '北京', 'Pekín', 'बीजिंग', 'بكين', 'বেইজিং', 'Pequim', '北京', 'בייג׳ינג')
const RIO = t11('Рио-де-Жанейро', 'Rio de Janeiro', 'Rio de Janeiro', '里约', 'Río de Janeiro', 'रियो', 'ريو', 'রিও', 'Rio de Janeiro', 'リオ', 'ריו')
const SYDNEY = t11('Сидней', 'Sydney', 'Sydney', '悉尼', 'Sídney', 'सिडनी', 'سيدني', 'সিডনি', 'Sydney', 'シドニー', 'סידני')
const BARC = t11('Барселона', 'Barcelona', 'Barcelona', '巴塞罗那', 'Barcelona', 'बार्सिलोना', 'برشلونة', 'বার্সেলোনা', 'Barcelona', 'バルセロナ', 'ברצלונה')
const STLOUIS = t11('Сент-Луис', 'St. Louis', 'St. Louis', '圣路易斯', 'San Luis', 'सेंट लुइस', 'سانت لويس', 'সেন্ট লুইস', 'St. Louis', 'セントルイス', 'סנט לואיס')
const STOCK = t11('Стокгольм', 'Stockholm', 'Stockholm', '斯德哥尔摩', 'Estocolmo', 'स्टॉकहोम', 'ستوكهولم', 'স্টকহোম', 'Estocolmo', 'ストックホルム', 'שטוקהולם')
const ANTW = t11('Антверпен', 'Antwerp', 'Antwerpen', '安特卫普', 'Amberes', 'एंटवर्प', 'أنتويرب', 'অ্যান্টওয়ার্প', 'Antuérpia', 'アントワープ', 'אנטוורפן')
const AMST = t11('Амстердам', 'Amsterdam', 'Amsterdam', '阿姆斯特丹', 'Ámsterdam', 'एम्स्टर्डम', 'أمستردام', 'আমস্টারডাম', 'Amesterdão', 'アムステルダム', 'אמסטרדם')
const LA = t11('Лос-Анджелес', 'Los Angeles', 'Los Angeles', '洛杉矶', 'Los Ángeles', 'लॉस एंजिल्स', 'لوس أنجلوس', 'লস অ্যাঞ্জেলেস', 'Los Angeles', 'ロサンゼルス', 'לוס אנג׳לס')
const BERLIN = t11('Берлин', 'Berlin', 'Berlin', '柏林', 'Berlín', 'बर्लिन', 'برلين', 'বার্লিন', 'Berlim', 'ベルリン', 'ברלין')
const HELS = t11('Хельсинки', 'Helsinki', 'Helsinki', '赫尔辛基', 'Helsinki', 'हेलसिंकी', 'هلسنكي', 'হেলসিঙ্কি', 'Helsínquia', 'ヘルシンキ', 'הלסינקי')
const MELB = t11('Мельбурн', 'Melbourne', 'Melbourne', '墨尔本', 'Melbourne', 'मेलबर्न', 'ملبورن', 'মেলবোর্ন', 'Melbourne', 'メルボルン', 'מלבורן')
const ROME = t11('Рим', 'Rome', 'Rom', '罗马', 'Roma', 'रोम', 'روما', 'রোম', 'Roma', 'ローマ', 'רומא')
const MEXCITY = t11('Мехико', 'Mexico City', 'Mexiko-Stadt', '墨西哥城', 'Ciudad de México', 'मेक्सिको सिटी', 'مكسيكو', 'মেক্সিকো সিটি', 'Cidade do México', 'メキシコシティ', 'מקסיקו סיטי')
const MUNICH = t11('Мюнхен', 'Munich', 'München', '慕尼黑', 'Múnich', 'म्यूनिख', 'ميونخ', 'মিউনিখ', 'Munique', 'ミュンヘン', 'מינכן')
const MONTREAL = t11('Монреаль', 'Montreal', 'Montreal', '蒙特利尔', 'Montreal', 'मॉन्ट्रियल', 'مونتريال', 'মন্ট্রিয়ল', 'Montreal', 'モントリオール', 'מונטריאול')
const MOSCOW = t11('Москва', 'Moscow', 'Moskau', '莫斯科', 'Moscú', 'मास्को', 'موسكو', 'মস্কো', 'Moscovo', 'モスクワ', 'מוסקבה')
const SEOUL = t11('Сеул', 'Seoul', 'Seoul', '首尔', 'Seúl', 'सियोल', 'سيول', 'সিউল', 'Seul', 'ソウル', 'סיאול')
const ATLANTA = t11('Атланта', 'Atlanta', 'Atlanta', '亚特兰大', 'Atlanta', 'अटलांटा', 'أتلانتا', 'আটলান্টা', 'Atlanta', 'アトランタ', 'אטלנטה')
const Y1896 = t11('1896, лето', '1896 Summer', 'Sommer 1896', '1896 夏奥', 'Verano 1896', '1896 ग्रीष्म', 'صيف 1896', '১৮৯৬ গ্রীষ্ম', 'Verão 1896', '1896夏', 'קיץ 1896')
const Y2024 = t11('2024, лето', '2024 Summer', 'Sommer 2024', '2024 夏奥', 'Verano 2024', '2024 ग्रीष्म', 'صيف 2024', '২০২৪ গ্রীষ্ম', 'Verão 2024', '2024夏', 'קיץ 2024')
const Y2020 = t11('2020/21, лето', '2020/21 Summer', 'Sommer 2020/21', '2020/21 夏奥', 'Verano 2020/21', '2020/21 ग्रीष्म', 'صيف 2020/21', '২০২০/২১ গ্রীষ্ম', 'Verão 2020/21', '2020/21夏', 'קיץ 2020/21')
const Y2012 = t11('2012, лето', '2012 Summer', 'Sommer 2012', '2012 夏奥', 'Verano 2012', '2012 ग्रीष्म', 'صيف 2012', '২০১২ গ্রীষ্ম', 'Verão 2012', '2012夏', 'קיץ 2012')
const Y2008 = t11('2008, лето', '2008 Summer', 'Sommer 2008', '2008 夏奥', 'Verano 2008', '2008 ग्रीष्म', 'صيف 2008', '২০০৮ গ্রীষ্ম', 'Verão 2008', '2008夏', 'קיץ 2008')
const Y2016 = t11('2016, лето', '2016 Summer', 'Sommer 2016', '2016 夏奥', 'Verano 2016', '2016 ग्रीष्म', 'صيف 2016', '২০১৬ গ্রীষ্ম', 'Verão 2016', '2016夏', 'קיץ 2016')
const Y2000 = t11('2000, лето', '2000 Summer', 'Sommer 2000', '2000 夏奥', 'Verano 2000', '2000 ग्रीष्म', 'صيف 2000', '২০০০ গ্রীষ্ম', 'Verão 2000', '2000夏', 'קיץ 2000')
const Y1992 = t11('1992, лето', '1992 Summer', 'Sommer 1992', '1992 夏奥', 'Verano 1992', '1992 ग्रीष्म', 'صيف 1992', '১৯৯২ গ্রীষ্ম', 'Verão 1992', '1992夏', 'קיץ 1992')

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

function code(s: string) {
  return t11(s, s, s, s, s, s, s, s, s, s, s)
}

function winterY(n: string) {
  return t11(`${n}, зима`, `${n} Winter`, `Winter ${n}`, `${n} 冬奥`, `Invierno ${n}`, `${n} शीत`, `شتاء ${n}`, `${n} শীত`, `Inverno ${n}`, `${n}冬`, `חורף ${n}`)
}

function summerY(n: string) {
  return t11(`${n}, лето`, `${n} Summer`, `Sommer ${n}`, `${n} 夏奥`, `Verano ${n}`, `${n} ग्रीष्म`, `صيف ${n}`, `${n} গ্রীষ্ম`, `Verão ${n}`, `${n}夏`, `קיץ ${n}`)
}

const ESP = t11('Испания', 'Spain', 'Spanien', '西班牙', 'España', 'स्पेन', 'إسبانيا', 'স্পেন', 'Espanha', 'スペイン', 'ספרד')
const ITA = t11('Италия', 'Italy', 'Italien', '意大利', 'Italia', 'इटली', 'إيطاليا', 'ইতালি', 'Itália', 'イタリア', 'איטליה')
const GER = t11('Германия', 'Germany', 'Deutschland', '德国', 'Alemania', 'जर्मनी', 'ألمانيا', 'জার্মানি', 'Alemanha', 'ドイツ', 'גרמניה')
const CAN = t11('Канада', 'Canada', 'Kanada', '加拿大', 'Canadá', 'कनाडा', 'كندا', 'কানাডা', 'Canadá', 'カナダ', 'קנדה')
const KOR = t11('Южная Корея', 'South Korea', 'Südkorea', '韩国', 'Corea del Sur', 'दक्षिण कोरिया', 'كوريا الجنوبية', 'দক্ষিণ কোরিয়া', 'Coreia do Sul', '韓国', 'דרום קוריאה')
const NOR = t11('Норвегия', 'Norway', 'Norwegen', '挪威', 'Noruega', 'नॉर्वे', 'النرويج', 'নরওয়ে', 'Noruega', 'ノルウェー', 'נורווגיה')
const AUT = t11('Австрия', 'Austria', 'Österreich', '奥地利', 'Austria', 'ऑस्ट्रिया', 'النمسا', 'অস্ট্রিয়া', 'Áustria', 'オーストリア', 'אוסטריה')
const JAM = t11('Ямайка', 'Jamaica', 'Jamaika', '牙买加', 'Jamaica', 'जमैका', 'جامايكا', 'জামাইকা', 'Jamaica', 'ジャマイカ', 'ג׳מייקה')
const KEN = t11('Кения', 'Kenya', 'Kenia', '肯尼亚', 'Kenia', 'केन्या', 'كينيا', 'কেনিয়া', 'Quénia', 'ケニア', 'קניה')
const ETH = t11('Эфиопия', 'Ethiopia', 'Äthiopien', '埃塞俄比亚', 'Etiopía', 'इथियोपिया', 'إثيوبيا', 'ইথিওপিয়া', 'Etiópia', 'エチオピア', 'אתיופיה')
const CUB = t11('Куба', 'Cuba', 'Kuba', '古巴', 'Cuba', 'क्यूबा', 'كوبا', 'কিউবা', 'Cuba', 'キューバ', 'קובה')
const ROU = t11('Румыния', 'Romania', 'Rumänien', '罗马尼亚', 'Rumanía', 'रोमानिया', 'رومانيا', 'রোমানিয়া', 'Roménia', 'ルーマニア', 'רומניה')
const FIN = t11('Финляндия', 'Finland', 'Finnland', '芬兰', 'Finlandia', 'फ़िनलैंड', 'فنلندا', 'ফিনল্যান্ড', 'Finlândia', 'フィンランド', 'פינלנד')
const HUN = t11('Венгрия', 'Hungary', 'Ungarn', '匈牙利', 'Hungría', 'हंगरी', 'المجر', 'হাঙ্গেরি', 'Hungria', 'ハンガリー', 'הונגריה')
const SWE = t11('Швеция', 'Sweden', 'Schweden', '瑞典', 'Suecia', 'स्वीडन', 'السويد', 'সুইডেন', 'Suécia', 'スウェーデン', 'שוודיה')
const NED = t11('Нидерланды', 'Netherlands', 'Niederlande', '荷兰', 'Países Bajos', 'नीदरलैंड', 'هولندا', 'নেদারল্যান্ডস', 'Países Baixos', 'オランダ', 'הולנד')
const RUS = t11('Россия', 'Russia', 'Russland', '俄罗斯', 'Rusia', 'रूस', 'روسيا', 'রাশিয়া', 'Rússia', 'ロシア', 'רוסיה')
const BEL = t11('Бельгия', 'Belgium', 'Belgien', '比利时', 'Bélgica', 'बेल्जियम', 'بلجيكا', 'বেলজিয়াম', 'Bélgica', 'ベルギー', 'בלגיה')
const MEX = t11('Мексика', 'Mexico', 'Mexiko', '墨西哥', 'México', 'मेक्सिको', 'المكسيك', 'মেক্সিকো', 'México', 'メキシコ', 'מקסיקו')
const URS = t11('СССР', 'Soviet Union', 'Sowjetunion', '苏联', 'Unión Soviética', 'सोवियत संघ', 'الاتحاد السوفيتي', 'সোভিয়েত ইউনিয়ন', 'União Soviética', 'ソ連', 'ברית המועצות')

const CHAMONIX = t11('Шамони', 'Chamonix', 'Chamonix', '霞慕尼', 'Chamonix', 'शामोनी', 'شاموني', 'শামোনি', 'Chamonix', 'シャモニー', 'שאמוני')
const PLACID = t11('Лейк-Плэсид', 'Lake Placid', 'Lake Placid', '普莱西德湖', 'Lake Placid', 'लेक प्लैसिड', 'ليك بلاسيد', 'লেক প্লাসিড', 'Lake Placid', 'レークプラシッド', 'לייק פלאסיד')
const INNSBRUCK = t11('Инсбрук', 'Innsbruck', 'Innsbruck', '因斯布鲁克', 'Innsbruck', 'इन्सब्रुक', 'إنسبروك', 'ইন্সবরুক', 'Innsbruck', 'インスブルック', 'אינסברוק')
const SAPPORO = t11('Саппоро', 'Sapporo', 'Sapporo', '札幌', 'Sapporo', 'सप्पोरो', 'سابورو', 'সাপ্পোরো', 'Sapporo', '札幌', 'סאפורו')
const CALGARY = t11('Калгари', 'Calgary', 'Calgary', '卡尔加里', 'Calgary', 'कैलगरी', 'كالغاري', 'ক্যালগারি', 'Calgary', 'カルガリー', 'קלגרי')
const LILLEH = t11('Лиллехаммер', 'Lillehammer', 'Lillehammer', '利勒哈默尔', 'Lillehammer', 'लिल्लेहैमर', 'ليلهامر', 'লিলহামার', 'Lillehammer', 'リレハンメル', 'לילהאמר')
const NAGANO = t11('Нагано', 'Nagano', 'Nagano', '长野', 'Nagano', 'नागानो', 'ناغانو', 'নাগানো', 'Nagano', '長野', 'נגנו')
const SALT = t11('Солт-Лейк-Сити', 'Salt Lake City', 'Salt Lake City', '盐湖城', 'Salt Lake City', 'सॉल्ट लेक सिटी', 'سولت ليك', 'সল্ট লেক সিটি', 'Salt Lake City', 'ソルトレイク', 'סולט לייק סיטי')
const TURIN = t11('Турин', 'Turin', 'Turin', '都灵', 'Turín', 'ट्यूरिन', 'تورينو', 'তুরিন', 'Turim', 'トリノ', 'טורינו')
const VANC = t11('Ванкувер', 'Vancouver', 'Vancouver', '温哥华', 'Vancouver', 'वैंकूवर', 'فانكوفر', 'ভ্যাঙ্কুভার', 'Vancouver', 'バンクーバー', 'ונקובר')
const SOCHI = t11('Сочи', 'Sochi', 'Sotschi', '索契', 'Sochi', 'सोची', 'سوتشي', 'সোচি', 'Sochi', 'ソチ', 'סוצ׳י')
const PYEONG = t11('Пхёнчхан', 'Pyeongchang', 'Pyeongchang', '平昌', 'Pyeongchang', 'प्योंगचांग', 'بيونغتشانغ', 'পিয়ংচাং', 'Pyeongchang', '平昌', 'פיונגצ׳אנג')
const MILAN = t11('Милан — Кортина', 'Milan–Cortina', 'Mailand–Cortina', '米兰–科尔蒂纳', 'Milán–Cortina', 'मिलान–कोर्तिना', 'ميلانو–كورتينا', 'মিলান–কোর্তিনা', 'Milão–Cortina', 'ミラノ–コルティナ', 'מילאנו–קורטינה')

const GOLD1000 = t11('больше 1000', 'more than 1000', 'über 1000', '超过1000', 'más de 1000', '1000 से अधिक', 'أكثر من 1000', '১০০০-এর বেশি', 'mais de 1000', '1000超', 'יותר מ-1000')
const GOLD200 = t11('200–500', '200–500', '200–500', '200–500', '200–500', '200–500', '200–500', '200–500', '200–500', '200–500', '200–500')
const GOLD50 = t11('50–200', '50–200', '50–200', '50–200', '50–200', '50–200', '50–200', '50–200', '50–200', '50–200', '50–200')
const GOLD1 = t11('меньше 50', 'fewer than 50', 'unter 50', '少于50', 'menos de 50', '50 से कम', 'أقل من 50', '৫০-এর কম', 'menos de 50', '50未満', 'פחות מ-50')

const BOLT = t11('Усэйн Болт', 'Usain Bolt', 'Usain Bolt', '尤塞恩·博尔特', 'Usain Bolt', 'यूसेन बोल्ट', 'يوسين بولت', 'উসাইন বোল্ট', 'Usain Bolt', 'ウサイン・ボルト', 'יוסיין בולט')
const PHELPS = t11('Майкл Фелпс', 'Michael Phelps', 'Michael Phelps', '迈克尔·菲尔普斯', 'Michael Phelps', 'माइकल फेल्प्स', 'مايكل فيلبس', 'মাইকেল ফেলপস', 'Michael Phelps', 'マイケル・フェルプス', 'מייקל פלפס')
const OWENS = t11('Джесси Оуэнс', 'Jesse Owens', 'Jesse Owens', '杰西·欧文斯', 'Jesse Owens', 'जेसी ओवेन्स', 'جيسي أوينز', 'জেসি ওয়েন্স', 'Jesse Owens', 'ジェシー・オーエンス', 'ג׳סי אוונס')
const NADIA = t11('Надя Команечи', 'Nadia Comăneci', 'Nadia Comăneci', '纳迪娅·科马内奇', 'Nadia Comăneci', 'नादिया कोमनेची', 'ناديا كومانتشي', 'নাদিয়া কোমানেচি', 'Nadia Comăneci', 'ナディア・コマネチ', 'נדיה קומנץ׳')
const NURMI = t11('Пааво Нурми', 'Paavo Nurmi', 'Paavo Nurmi', '帕沃·努尔米', 'Paavo Nurmi', 'पावो नूर्मी', 'بافو نورمي', 'পাভো নুরমি', 'Paavo Nurmi', 'パーヴォ・ヌルミ', 'פאבו נורמי')
const BIKILA = t11('Абебе Бикила', 'Abebe Bikila', 'Abebe Bikila', '阿贝贝·比基拉', 'Abebe Bikila', 'अबेबे बिकिला', 'أبيبي بيكيلا', 'আবেবে বিকিলার', 'Abebe Bikila', 'アベベ・ビキラ', 'אבבה ביקילה')
const FREEMAN = t11('Кэти Фримен', 'Cathy Freeman', 'Cathy Freeman', '凯茜·弗里曼', 'Cathy Freeman', 'कैथी फ़्रीमैन', 'كاثي فريمان', 'ক্যাথি ফ্রিম্যান', 'Cathy Freeman', 'キャシー・フリーマン', 'קתי פרימן')
const FARAH = t11('Мо Фарах', 'Mo Farah', 'Mo Farah', '莫·法拉', 'Mo Farah', 'मो फराह', 'مو فرح', 'মো ফারাহ', 'Mo Farah', 'モ・ファラー', 'מו פארח')
const LEWIS = t11('Карл Льюис', 'Carl Lewis', 'Carl Lewis', '卡尔·刘易斯', 'Carl Lewis', 'कार्ल लुईस', 'كارل لويس', 'কার্ল লুইস', 'Carl Lewis', 'カール・ルイス', 'קארל לואיס')
const SPITZ = t11('Марк Спитц', 'Mark Spitz', 'Mark Spitz', '马克·施皮茨', 'Mark Spitz', 'मार्क स्पिट्ज़', 'مارك سبيتز', 'মার্ক স্পিটজ', 'Mark Spitz', 'マーク・スピッツ', 'מארק שפיץ')
const UCHI = t11('Кохэй Утимура', 'Kōhei Uchimura', 'Kōhei Uchimura', '内村航平', 'Kōhei Uchimura', 'कोहेई उचिमुरा', 'كوهي أوتشيمورا', 'কোহেই উচিমুরা', 'Kōhei Uchimura', '内村航平', 'קוהיי אוצ׳ימורה')
const RINER = t11('Тедди Ринер', 'Teddy Riner', 'Teddy Riner', '特迪·里内', 'Teddy Riner', 'टेडी रिनर', 'تيدي رينر', 'টেডি রিনার', 'Teddy Riner', 'テディ・リネール', 'טדי רינר')
const STEVE = t11('Теофило Стивенсон', 'Teófilo Stevenson', 'Teófilo Stevenson', '特奥菲洛·史蒂文森', 'Teófilo Stevenson', 'तेओफिलो स्टीवेन्सन', 'تيوفيلو ستيفنسون', 'তেওফিলো স্টিভেনসন', 'Teófilo Stevenson', 'テオフィロ・ステベンソン', 'תאופילו סטיבנסון')
const KIPCH = t11('Элиуд Кипчоге', 'Eliud Kipchoge', 'Eliud Kipchoge', '埃利乌德·基普乔格', 'Eliud Kipchoge', 'एलियुड किपचोगे', 'إليود كيبتشوغي', 'এলিউড কিপচোগে', 'Eliud Kipchoge', 'エリウド・キプチョゲ', 'אליוד קיפצ׳וגה')
const FISCH = t11('Биргит Фишер', 'Birgit Fischer', 'Birgit Fischer', '比吉特·菲舍尔', 'Birgit Fischer', 'बिर्गिट फिशर', 'بيرغيت فيشر', 'বির্গিট ফিশার', 'Birgit Fischer', 'ビルギット・フィッシャー', 'בירגיט פישר')
const PELL = t11('Федерика Пеллегрини', 'Federica Pellegrini', 'Federica Pellegrini', '费代丽卡·佩莱格里尼', 'Federica Pellegrini', 'फेडरिका पेलेग्रीनी', 'فيديريكا بيليغريني', 'ফেডেরিকা পেলেগ্রিনি', 'Federica Pellegrini', 'フェデリカ・ペレグリニ', 'פדריקה פלגריני')
const KRISZ = t11('Кристина Эгерсеги', 'Krisztina Egerszegi', 'Krisztina Egerszegi', '克里斯蒂娜·埃格尔塞吉', 'Krisztina Egerszegi', 'क्रिस्टिना एगेर्सेगी', 'كريستينا إجيرسيغي', 'ক্রিস্টিনা এগেরসেগি', 'Krisztina Egerszegi', 'クリスティナ・エゲルセギ', 'קריסטינה אגרסגי')
const THORPE = t11('Иан Торп', 'Ian Thorpe', 'Ian Thorpe', '伊恩·索普', 'Ian Thorpe', 'इयान थॉर्प', 'إيان ثورب', 'ইয়ান থর্প', 'Ian Thorpe', 'イアン・ソープ', 'איאן תורפ')
const FRASER = t11('Шэлли-Энн Фрейзер-Прайс', 'Shelly-Ann Fraser-Pryce', 'Shelly-Ann Fraser-Pryce', '谢莉-安·弗雷泽-普赖斯', 'Shelly-Ann Fraser-Pryce', 'शेली-एन फ़्रेज़र-प्राइस', 'شيلي آن فريزر برايس', 'শেলি-অ্যান ফ্রেজার-প্রাইস', 'Shelly-Ann Fraser-Pryce', 'シェリーアン・フレーザープライス', 'שלי-אן פרייזר-פרייס')
const FELIX = t11('Эллисон Феликс', 'Allyson Felix', 'Allyson Felix', '阿莉森·费利克斯', 'Allyson Felix', 'एलीसन फेलिक्स', 'أليسون فيليكس', 'অ্যালিসন ফেলিক্স', 'Allyson Felix', 'アリソン・フェリックス', 'אליסון פליקס')
const BLANK = t11('Фанни Бланкерс-Кун', 'Fanny Blankers-Koen', 'Fanny Blankers-Koen', '范妮·布兰克尔斯-科恩', 'Fanny Blankers-Koen', 'फ़ैनी ब्लैंकर्स-कोएन', 'فاني بلانكرز كوين', 'ফ্যানি ব্ল্যাঙ্কার্স-কোয়েন', 'Fanny Blankers-Koen', 'ファニー・ブランカーズ・クーン', 'פני בלנקרס-קון')

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

const RINGS = t11('пять колец', 'five rings', 'fünf Ringe', '五环', 'cinco anillos', 'पाँच छल्ले', 'خمس حلقات', 'পাঁচটি রিং', 'cinco anéis', '五輪', 'חמש טבעות')
const CONTINENTS = t11('пять континентов', 'five continents', 'fünf Kontinente', '五大洲', 'cinco continentes', 'पाँच महाद्वीप', 'خمس قارات', 'পাঁচ মহাদেশ', 'cinco continentes', '五大陸', 'חמש יבשות')
const FLAME = t11('олимпийский огонь', 'Olympic flame', 'olympische Flamme', '奥运圣火', 'llama olímpica', 'ओलंपिक ज्योति', 'الشعلة الأولمبية', 'অলিম্পিক শিখা', 'chama olímpica', '聖火', 'הלפיד האולימפי')
const RELAY = t11('эстафета от Олимпии', 'relay from Olympia', 'Staffel aus Olympia', '来自奥林匹亚的传递', 'relevo desde Olimpia', 'ओलंपिया से रिले', 'تتابع من أولمبيا', 'অলিম্পিয়া থেকে রিলে', 'revezamento desde Olímpia', 'オリンピアからのリレー', 'שליחים מאולימפיה')
const MOTTO = t11('Citius, Altius, Fortius', 'Citius, Altius, Fortius', 'Citius, Altius, Fortius', 'Citius, Altius, Fortius', 'Citius, Altius, Fortius', 'Citius, Altius, Fortius', 'Citius, Altius, Fortius', 'Citius, Altius, Fortius', 'Citius, Altius, Fortius', 'Citius, Altius, Fortius', 'Citius, Altius, Fortius')
const FASTER = t11('быстрее, выше, сильнее', 'faster, higher, stronger', 'schneller, höher, stärker', '更快、更高、更强', 'más rápido, más alto, más fuerte', 'तेज़, ऊँचा, मज़बूत', 'أسرع، أعلى، أقوى', 'দ্রুত, উঁচু, শক্তিশালী', 'mais rápido, mais alto, mais forte', 'より速く、より高く、より強く', 'מהר יותר, גבוה יותר, חזק יותר')
const WREATH = t11('оливковый венок', 'olive wreath', 'Olivenkranz', '橄榄枝花环', 'corona de olivo', 'जैतून की माला', 'إكليل الزيتون', 'জলপাই মালা', 'coroa de oliveira', 'オリーブの冠', 'זר זית')
const PRIZE = t11('награда древних Игр', 'prize of the ancient Games', 'Preis der antiken Spiele', '古代奥运会的奖品', 'premio de los Juegos antiguos', 'प्राचीन खेलों का पुरस्कार', 'جائزة الألعاب القديمة', 'প্রাচীন গেমসের পুরস্কার', 'prémio dos Jogos antigos', '古代大会の賞', 'פרס המשחקים העתיקים')
const COUB = t11('Пьер де Кубертен', 'Pierre de Coubertin', 'Pierre de Coubertin', '顾拜旦', 'Pierre de Coubertin', 'पियरे दे कुबेर्तेन', 'بيير دي كوبرتان', 'পিয়ের দ্য কুবেরতাঁ', 'Pierre de Coubertin', 'クーベルタン', 'פייר דה קובטן')
const FOUNDER = t11('основатель современных Игр', 'founder of the modern Games', 'Gründer der modernen Spiele', '现代奥运会创始人', 'fundador de los Juegos modernos', 'आधुनिक खेलों के संस्थापक', 'مؤسس الألعاب الحديثة', 'আধুনিক গেমসের প্রতিষ্ঠাতা', 'fundador dos Jogos modernos', '近代大会の創始者', 'מייסד המשחקים המודרניים')
const WHITE = t11('белый флаг с кольцами', 'white flag with rings', 'weiße Flagge mit Ringen', '带五环的白旗', 'bandera blanca con anillos', 'छल्लों वाला सफेद झंडा', 'علم أبيض بحلقات', 'রিংসহ সাদা পতাকা', 'bandeira branca com anéis', '五輪の白旗', 'דגל לבן עם טבעות')
const IOC = t11('флаг МОК', 'IOC flag', 'IOC-Flagge', '国际奥委会旗', 'bandera del COI', 'IOC झंडा', 'علم اللجنة الأولمبية', 'আইওসি পতাকা', 'bandeira do COI', 'IOC旗', 'דגל הוועד האולימפי')
const GOLD = t11('золотая медаль', 'gold medal', 'Goldmedaille', '金牌', 'medalla de oro', 'स्वर्ण पदक', 'ميدالية ذهبية', 'স্বর্ণপদক', 'medalha de ouro', '金メダル', 'מדליית זהב')
const FIRST = t11('первое место', 'first place', 'erster Platz', '第一名', 'primer puesto', 'पहला स्थान', 'المركز الأول', 'প্রথম স্থান', 'primeiro lugar', '1位', 'מקום ראשון')
const OLYMPIAD = t11('олимпиада', 'Olympiad', 'Olympiade', '奥林匹克周期', 'olimpiada', 'ओलंपियाड', 'الأولمبياد', 'অলিম্পিয়াড', 'Olimpíada', 'オリンピアード', 'אולימפיאדה')
const FOUR = t11('четыре года', 'four years', 'vier Jahre', '四年', 'cuatro años', 'चार वर्ष', 'أربع سنوات', 'চার বছর', 'quatro anos', '4年', 'ארבע שנים')

export const THEME_ITEMS: ThemeItem[] = [
  row('n-role', 'organelleToRole', 'easy', NUCLEUS, DNA, { key: 'dna' }),
  row('m-role', 'organelleToRole', 'easy', MITO, ATP, { key: 'atp' }),
  row('c-role', 'organelleToRole', 'medium', CHLORO, SUGAR, { key: 'sugar' }),
  row('r-role', 'organelleToRole', 'medium', RIBO, PROT, { key: 'prot' }),
  row('b-role', 'organelleToRole', 'easy', MEMB, BORDER, { key: 'border' }),
  row('ly-role', 'organelleToRole', 'medium', LYSOS, WASTE, { key: 'waste' }),
  row('go-role', 'organelleToRole', 'hard', GOLGI, PACK, { key: 'pack' }),
  row('er-role', 'organelleToRole', 'hard', ER, TRANS, { key: 'trans' }),
  row('va-role', 'organelleToRole', 'medium', VAC, STORE, { key: 'store' }),
  row('wa-role', 'organelleToRole', 'easy', WALL, SUPPORT, { key: 'support' }),
  row('n-from', 'roleToOrganelle', 'easy', DNA, NUCLEUS, { key: 'nuc' }),
  row('m-from', 'roleToOrganelle', 'easy', ATP, MITO, { key: 'mito' }),
  row('c-from', 'roleToOrganelle', 'medium', SUGAR, CHLORO, { key: 'chl' }),
  row('r-from', 'roleToOrganelle', 'medium', PROT, RIBO, { key: 'ribo' }),
  row('b-from', 'roleToOrganelle', 'easy', BORDER, MEMB, { key: 'mem' }),
  row('ly-from', 'roleToOrganelle', 'medium', WASTE, LYSOS, { key: 'lyso' }),
  row('go-from', 'roleToOrganelle', 'hard', PACK, GOLGI, { key: 'golgi' }),
  row('er-from', 'roleToOrganelle', 'hard', TRANS, ER, { key: 'er' }),
  row('va-from', 'roleToOrganelle', 'medium', STORE, VAC, { key: 'vac' }),
  row('wa-from', 'roleToOrganelle', 'easy', SUPPORT, WALL, { key: 'wall' }),
  row('h-sys', 'organToSystem', 'easy', HEART, CIRC, { key: 'circ' }),
  row('l-sys', 'organToSystem', 'easy', LUNGS, RESP, { key: 'resp' }),
  row('br-sys', 'organToSystem', 'easy', BRAIN, NERV, { key: 'nerv' }),
  row('s-sys', 'organToSystem', 'medium', STOM, DIG, { key: 'dig' }),
  row('k-sys', 'organToSystem', 'medium', KID, EXCR, { key: 'exc' }),
  row('li-sys', 'organToSystem', 'hard', LIVER, DIG, { key: 'dig' }),
  row('sk-sys', 'organToSystem', 'easy', SKIN, INTEG, { key: 'integ' }),
  row('bo-sys', 'organToSystem', 'easy', BONE, MUSC, { key: 'musc' }),
  row('sp-sys', 'organToSystem', 'medium', SPLEEN, IMM, { key: 'imm' }),
  row('th-sys', 'organToSystem', 'hard', THYR, ENDO, { key: 'endo' }),
  row('ov-sys', 'organToSystem', 'medium', OVARY, REPRO, { key: 'repro' }),
  row('circ-org', 'systemToOrgan', 'easy', CIRC, HEART, { key: 'heart' }),
  row('resp-org', 'systemToOrgan', 'easy', RESP, LUNGS, { key: 'lungs' }),
  row('nerv-org', 'systemToOrgan', 'easy', NERV, BRAIN, { key: 'brain' }),
  row('dig-org', 'systemToOrgan', 'easy', DIG, STOM, { key: 'stom' }),
  row('exc-org', 'systemToOrgan', 'medium', EXCR, KID, { key: 'kid' }),
  row('integ-org', 'systemToOrgan', 'easy', INTEG, SKIN, { key: 'skin' }),
  row('musc-org', 'systemToOrgan', 'easy', MUSC, BONE, { key: 'bone' }),
  row('imm-org', 'systemToOrgan', 'medium', IMM, SPLEEN, { key: 'spleen' }),
  row('endo-org', 'systemToOrgan', 'hard', ENDO, THYR, { key: 'thyr' }),
  row('repro-org', 'systemToOrgan', 'medium', REPRO, OVARY, { key: 'ovary' }),
  row('ph-name', 'photoStepToName', 'easy', LIGHT, PHOTO, { key: 'photo' }),
  row('cr-name', 'photoStepToName', 'medium', SUGAR2, CELLR, { key: 'cellr' }),
  row('mi-name', 'photoStepToName', 'easy', MITOSD, MITOS, { key: 'mitos' }),
  row('me-name', 'photoStepToName', 'medium', MEIOSD, MEIOS, { key: 'meios' }),
  row('fe-name', 'photoStepToName', 'medium', FERMD, FERM, { key: 'ferm' }),
  row('tr-name', 'photoStepToName', 'easy', TRANSPD, TRANSP, { key: 'transp' }),
  row('os-name', 'photoStepToName', 'medium', OSMOD, OSMO, { key: 'osmo' }),
  row('di-name', 'photoStepToName', 'easy', DIFFD, DIFF, { key: 'diff' }),
  row('rp-name', 'photoStepToName', 'hard', REPLD, REPL, { key: 'repl' }),
  row('ps-name', 'photoStepToName', 'hard', TRANSLD, TRANSL, { key: 'transl' }),
  row('ph-from', 'nameToProcess', 'easy', PHOTO, LIGHT, { key: 'light' }),
  row('cr-from', 'nameToProcess', 'medium', CELLR, SUGAR2, { key: 'sugar2' }),
  row('mi-from', 'nameToProcess', 'easy', MITOS, MITOSD, { key: 'mitosd' }),
  row('me-from', 'nameToProcess', 'medium', MEIOS, MEIOSD, { key: 'meiosd' }),
  row('fe-from', 'nameToProcess', 'medium', FERM, FERMD, { key: 'fermd' }),
  row('tr-from', 'nameToProcess', 'easy', TRANSP, TRANSPD, { key: 'transpd' }),
  row('os-from', 'nameToProcess', 'medium', OSMO, OSMOD, { key: 'osmod' }),
  row('di-from', 'nameToProcess', 'easy', DIFF, DIFFD, { key: 'diffd' }),
  row('rp-from', 'nameToProcess', 'hard', REPL, REPLD, { key: 'repld' }),
  row('ps-from', 'nameToProcess', 'hard', TRANSL, TRANSLD, { key: 'transld' }),
  row('an-ex', 'kingdomToExample', 'easy', ANIMAL, LION, { key: 'lion' }),
  row('pl-ex', 'kingdomToExample', 'easy', PLANT, TREE, { key: 'tree' }),
  row('fu-ex', 'kingdomToExample', 'medium', FUNGI, MUSH, { key: 'mush' }),
  row('ba-ex', 'kingdomToExample', 'medium', BACT, ECOLI, { key: 'coli' }),
  row('pr-ex', 'kingdomToExample', 'hard', PROTIST, AMOEBA, { key: 'amoeba' }),
  row('an-king', 'exampleToKingdom', 'easy', LION1, ANIMAL, { key: 'animal' }),
  row('pl-king', 'exampleToKingdom', 'easy', OAK, PLANT, { key: 'plant' }),
  row('fu-king', 'exampleToKingdom', 'medium', MUSH1, FUNGI, { key: 'fungi' }),
  row('ba-king', 'exampleToKingdom', 'medium', ECOLI, BACT, { key: 'bact' }),
  row('pr-king', 'exampleToKingdom', 'hard', AMOEBA1, PROTIST, { key: 'protist' }),
  row('lion-cl', 'animalToClass', 'easy', LION1, MAMMAL, { key: 'mammal', wikiFile: BIO_CLASS_PHOTO.lion }),
  row('eagle-cl', 'animalToClass', 'easy', EAGLE, BIRD, { key: 'bird', wikiFile: BIO_CLASS_PHOTO.eagle }),
  row('shark-cl', 'animalToClass', 'easy', SHARK, FISH, { key: 'fish', wikiFile: BIO_CLASS_PHOTO.shark }),
  row('frog-cl', 'animalToClass', 'easy', FROG, AMPH, { key: 'amph', wikiFile: BIO_CLASS_PHOTO.frog }),
  row('snake-cl', 'animalToClass', 'easy', SNAKE, REPT, { key: 'rept', wikiFile: BIO_CLASS_PHOTO.snake }),
  row('bee-cl', 'animalToClass', 'easy', BEE, INSECT, { key: 'insect', wikiFile: BIO_CLASS_PHOTO.bee }),
  row('spider-cl', 'animalToClass', 'medium', SPIDER, ARACH, { key: 'arach', wikiFile: BIO_CLASS_PHOTO.spider }),
  row('snail-cl', 'animalToClass', 'medium', SNAIL, MOLL, { key: 'moll', wikiFile: BIO_CLASS_PHOTO.snail }),
  row('crab-cl', 'animalToClass', 'medium', CRAB, CRUST, { key: 'crust', wikiFile: BIO_CLASS_PHOTO.crab }),
  row('worm-cl', 'animalToClass', 'hard', WORM, ANNEL, { key: 'annel', wikiFile: BIO_CLASS_PHOTO.worm }),
  row('mam-an', 'classToAnimal', 'easy', MAMMAL, LION1, { key: 'lion1', wikiFile: BIO_CLASS_PHOTO.lion }),
  row('bird-an', 'classToAnimal', 'easy', BIRD, EAGLE, { key: 'eagle', wikiFile: BIO_CLASS_PHOTO.eagle }),
  row('fish-an', 'classToAnimal', 'easy', FISH, SHARK, { key: 'shark', wikiFile: BIO_CLASS_PHOTO.shark }),
  row('amph-an', 'classToAnimal', 'easy', AMPH, FROG, { key: 'frog', wikiFile: BIO_CLASS_PHOTO.frog }),
  row('rept-an', 'classToAnimal', 'easy', REPT, SNAKE, { key: 'snake', wikiFile: BIO_CLASS_PHOTO.snake }),
  row('ins-an', 'classToAnimal', 'easy', INSECT, BEE, { key: 'bee', wikiFile: BIO_CLASS_PHOTO.bee }),
  row('ara-an', 'classToAnimal', 'medium', ARACH, SPIDER, { key: 'spider', wikiFile: BIO_CLASS_PHOTO.spider }),
  row('mol-an', 'classToAnimal', 'medium', MOLL, SNAIL, { key: 'snail', wikiFile: BIO_CLASS_PHOTO.snail }),
  row('cru-an', 'classToAnimal', 'medium', CRUST, CRAB, { key: 'crab', wikiFile: BIO_CLASS_PHOTO.crab }),
  row('ann-an', 'classToAnimal', 'hard', ANNEL, WORM, { key: 'worm', wikiFile: BIO_CLASS_PHOTO.worm }),
  ...bioGeneratedRows(),

  row('y-1896', 'olyYearToHost', 'easy', Y1896, ATHENS, { key: 'athens' }),
  row('y-1900', 'olyYearToHost', 'hard', summerY('1900'), PARIS, { key: 'paris' }),
  row('y-1904', 'olyYearToHost', 'hard', summerY('1904'), STLOUIS, { key: 'stlouis' }),
  row('y-1908', 'olyYearToHost', 'hard', summerY('1908'), LONDON, { key: 'london' }),
  row('y-1912', 'olyYearToHost', 'hard', summerY('1912'), STOCK, { key: 'stockholm' }),
  row('y-1920', 'olyYearToHost', 'hard', summerY('1920'), ANTW, { key: 'antwerp' }),
  row('y-1924', 'olyYearToHost', 'medium', summerY('1924'), PARIS, { key: 'paris' }),
  row('y-1928', 'olyYearToHost', 'hard', summerY('1928'), AMST, { key: 'amsterdam' }),
  row('y-1932', 'olyYearToHost', 'medium', summerY('1932'), LA, { key: 'la' }),
  row('y-1936', 'olyYearToHost', 'medium', summerY('1936'), BERLIN, { key: 'berlin' }),
  row('y-1948', 'olyYearToHost', 'medium', summerY('1948'), LONDON, { key: 'london' }),
  row('y-1952', 'olyYearToHost', 'hard', summerY('1952'), HELS, { key: 'helsinki' }),
  row('y-1956', 'olyYearToHost', 'medium', summerY('1956'), MELB, { key: 'melbourne' }),
  row('y-1960', 'olyYearToHost', 'medium', summerY('1960'), ROME, { key: 'rome' }),
  row('y-1964', 'olyYearToHost', 'medium', summerY('1964'), TOKYO, { key: 'tokyo' }),
  row('y-1968', 'olyYearToHost', 'medium', summerY('1968'), MEXCITY, { key: 'mexico' }),
  row('y-1972', 'olyYearToHost', 'medium', summerY('1972'), MUNICH, { key: 'munich' }),
  row('y-1976', 'olyYearToHost', 'medium', summerY('1976'), MONTREAL, { key: 'montreal' }),
  row('y-1980', 'olyYearToHost', 'easy', summerY('1980'), MOSCOW, { key: 'moscow' }),
  row('y-1984', 'olyYearToHost', 'medium', summerY('1984'), LA, { key: 'la' }),
  row('y-1988', 'olyYearToHost', 'medium', summerY('1988'), SEOUL, { key: 'seoul' }),
  row('y-1992', 'olyYearToHost', 'hard', Y1992, BARC, { key: 'barc' }),
  row('y-1996', 'olyYearToHost', 'medium', summerY('1996'), ATLANTA, { key: 'atlanta' }),
  row('y-2000', 'olyYearToHost', 'medium', Y2000, SYDNEY, { key: 'sydney' }),
  row('y-2004', 'olyYearToHost', 'medium', summerY('2004'), ATHENS, { key: 'athens' }),
  row('y-2008', 'olyYearToHost', 'medium', Y2008, BEIJING, { key: 'beijing' }),
  row('y-2012', 'olyYearToHost', 'easy', Y2012, LONDON, { key: 'london' }),
  row('y-2016', 'olyYearToHost', 'medium', Y2016, RIO, { key: 'rio' }),
  row('y-2020', 'olyYearToHost', 'easy', Y2020, TOKYO, { key: 'tokyo' }),
  row('y-2024', 'olyYearToHost', 'easy', Y2024, PARIS, { key: 'paris' }),
  row('h-1896', 'olyHostToYear', 'easy', ATHENS, Y1896, { key: '1896' }),
  row('h-1904', 'olyHostToYear', 'hard', STLOUIS, summerY('1904'), { key: '1904' }),
  row('h-1912', 'olyHostToYear', 'hard', STOCK, summerY('1912'), { key: '1912' }),
  row('h-1920', 'olyHostToYear', 'hard', ANTW, summerY('1920'), { key: '1920' }),
  row('h-1928', 'olyHostToYear', 'hard', AMST, summerY('1928'), { key: '1928' }),
  row('h-1936', 'olyHostToYear', 'medium', BERLIN, summerY('1936'), { key: '1936' }),
  row('h-1952', 'olyHostToYear', 'hard', HELS, summerY('1952'), { key: '1952' }),
  row('h-1956', 'olyHostToYear', 'medium', MELB, summerY('1956'), { key: '1956' }),
  row('h-1960', 'olyHostToYear', 'medium', ROME, summerY('1960'), { key: '1960' }),
  row('h-1968', 'olyHostToYear', 'medium', MEXCITY, summerY('1968'), { key: '1968' }),
  row('h-1972', 'olyHostToYear', 'medium', MUNICH, summerY('1972'), { key: '1972' }),
  row('h-1976', 'olyHostToYear', 'medium', MONTREAL, summerY('1976'), { key: '1976' }),
  row('h-1980', 'olyHostToYear', 'easy', MOSCOW, summerY('1980'), { key: '1980' }),
  row('h-1988', 'olyHostToYear', 'medium', SEOUL, summerY('1988'), { key: '1988' }),
  row('h-1992', 'olyHostToYear', 'hard', BARC, Y1992, { key: '1992' }),
  row('h-1996', 'olyHostToYear', 'medium', ATLANTA, summerY('1996'), { key: '1996' }),
  row('h-2000', 'olyHostToYear', 'medium', SYDNEY, Y2000, { key: '2000' }),
  row('h-2008', 'olyHostToYear', 'medium', BEIJING, Y2008, { key: '2008' }),
  row('h-2012', 'olyHostToYear', 'easy', LONDON, Y2012, { key: '2012' }),
  row('h-2016', 'olyHostToYear', 'medium', RIO, Y2016, { key: '2016' }),
  row('h-2020', 'olyHostToYear', 'easy', TOKYO, Y2020, { key: '2020' }),
  row('h-2024', 'olyHostToYear', 'easy', PARIS, Y2024, { key: '2024' }),
  row('hc-usa', 'olyHostCount', 'medium', USA, COUNT4, { key: 'c4' }),
  row('hc-gbr', 'olyHostCount', 'medium', GBR, COUNT3, { key: 'c3' }),
  row('hc-fra', 'olyHostCount', 'hard', FRA, COUNT3, { key: 'c3' }),
  row('hc-jpn', 'olyHostCount', 'easy', JPN, COUNT2, { key: 'c2' }),
  row('hc-gre', 'olyHostCount', 'easy', GRE, COUNT2, { key: 'c2' }),
  row('hc-chn', 'olyHostCount', 'easy', CHN, COUNT1, { key: 'c1' }),
  row('hc-aus', 'olyHostCount', 'easy', AUS, COUNT2, { key: 'c2' }),
  row('hc-bra', 'olyHostCount', 'easy', BRA, COUNT1, { key: 'c1' }),
  row('noc-usa', 'nocToName', 'easy', t11('USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA'), USA, { key: 'usa' }),
  row('noc-gbr', 'nocToName', 'easy', t11('GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR', 'GBR'), GBR, { key: 'gbr' }),
  row('noc-jpn', 'nocToName', 'easy', t11('JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN', 'JPN'), JPN, { key: 'jpn' }),
  row('noc-fra', 'nocToName', 'easy', t11('FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA', 'FRA'), FRA, { key: 'fra' }),
  row('noc-chn', 'nocToName', 'easy', t11('CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN', 'CHN'), CHN, { key: 'chn' }),
  row('noc-aus', 'nocToName', 'medium', t11('AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS', 'AUS'), AUS, { key: 'aus' }),
  row('noc-bra', 'nocToName', 'medium', t11('BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA', 'BRA'), BRA, { key: 'bra' }),
  row('noc-gre', 'nocToName', 'medium', t11('GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE', 'GRE'), GRE, { key: 'gre' }),
  row('noc-ger', 'nocToName', 'easy', code('GER'), GER, { key: 'ger' }),
  row('noc-ita', 'nocToName', 'easy', code('ITA'), ITA, { key: 'ita' }),
  row('noc-esp', 'nocToName', 'medium', code('ESP'), ESP, { key: 'esp' }),
  row('noc-can', 'nocToName', 'medium', code('CAN'), CAN, { key: 'can' }),
  row('noc-kor', 'nocToName', 'medium', code('KOR'), KOR, { key: 'kor' }),
  row('noc-nor', 'nocToName', 'medium', code('NOR'), NOR, { key: 'nor' }),
  row('noc-aut', 'nocToName', 'hard', code('AUT'), AUT, { key: 'aut' }),
  row('noc-jam', 'nocToName', 'easy', code('JAM'), JAM, { key: 'jam' }),
  row('noc-ken', 'nocToName', 'medium', code('KEN'), KEN, { key: 'ken' }),
  row('noc-eth', 'nocToName', 'medium', code('ETH'), ETH, { key: 'eth' }),
  row('noc-cub', 'nocToName', 'hard', code('CUB'), CUB, { key: 'cub' }),
  row('noc-rou', 'nocToName', 'hard', code('ROU'), ROU, { key: 'rou' }),
  row('noc-fin', 'nocToName', 'medium', code('FIN'), FIN, { key: 'fin' }),
  row('noc-hun', 'nocToName', 'hard', code('HUN'), HUN, { key: 'hun' }),
  row('noc-swe', 'nocToName', 'hard', code('SWE'), SWE, { key: 'swe' }),
  row('noc-ned', 'nocToName', 'medium', code('NED'), NED, { key: 'ned' }),

  row('hc2-ath', 'hostToCountry', 'easy', ATHENS, GRE, { key: 'gre' }),
  row('hc2-par', 'hostToCountry', 'easy', PARIS, FRA, { key: 'fra' }),
  row('hc2-stl', 'hostToCountry', 'hard', STLOUIS, USA, { key: 'usa' }),
  row('hc2-sto', 'hostToCountry', 'hard', STOCK, SWE, { key: 'swe' }),
  row('hc2-ant', 'hostToCountry', 'hard', ANTW, BEL, { key: 'bel' }),
  row('hc2-ams', 'hostToCountry', 'hard', AMST, NED, { key: 'ned' }),
  row('hc2-la', 'hostToCountry', 'medium', LA, USA, { key: 'usa' }),
  row('hc2-ber', 'hostToCountry', 'medium', BERLIN, GER, { key: 'ger' }),
  row('hc2-hel', 'hostToCountry', 'hard', HELS, FIN, { key: 'fin' }),
  row('hc2-mel', 'hostToCountry', 'medium', MELB, AUS, { key: 'aus' }),
  row('hc2-rom', 'hostToCountry', 'medium', ROME, ITA, { key: 'ita' }),
  row('hc2-tok', 'hostToCountry', 'easy', TOKYO, JPN, { key: 'jpn' }),
  row('hc2-mex', 'hostToCountry', 'medium', MEXCITY, MEX, { key: 'mex' }),
  row('hc2-mun', 'hostToCountry', 'medium', MUNICH, GER, { key: 'ger' }),
  row('hc2-mon', 'hostToCountry', 'medium', MONTREAL, CAN, { key: 'can' }),
  row('hc2-mos', 'hostToCountry', 'easy', MOSCOW, URS, { key: 'urs' }),
  row('hc2-seo', 'hostToCountry', 'medium', SEOUL, KOR, { key: 'kor' }),
  row('hc2-lon', 'hostToCountry', 'easy', LONDON, GBR, { key: 'gbr' }),
  row('hc2-bar', 'hostToCountry', 'medium', BARC, ESP, { key: 'esp' }),
  row('hc2-atl', 'hostToCountry', 'medium', ATLANTA, USA, { key: 'usa' }),
  row('hc2-syd', 'hostToCountry', 'medium', SYDNEY, AUS, { key: 'aus' }),
  row('hc2-bei', 'hostToCountry', 'medium', BEIJING, CHN, { key: 'chn' }),
  row('hc2-rio', 'hostToCountry', 'easy', RIO, BRA, { key: 'bra' }),
  row('hc2-soc', 'hostToCountry', 'hard', SOCHI, RUS, { key: 'rus' }),
  row('hc2-pye', 'hostToCountry', 'medium', PYEONG, KOR, { key: 'kor' }),
  row('hc2-cal', 'hostToCountry', 'medium', CALGARY, CAN, { key: 'can' }),
  row('hc2-lil', 'hostToCountry', 'hard', LILLEH, NOR, { key: 'nor' }),

  row('yc-1896', 'olyYearToCountry', 'easy', Y1896, GRE, { key: 'gre' }),
  row('yc-1900', 'olyYearToCountry', 'hard', summerY('1900'), FRA, { key: 'fra' }),
  row('yc-1904', 'olyYearToCountry', 'hard', summerY('1904'), USA, { key: 'usa' }),
  row('yc-1908', 'olyYearToCountry', 'hard', summerY('1908'), GBR, { key: 'gbr' }),
  row('yc-1912', 'olyYearToCountry', 'hard', summerY('1912'), SWE, { key: 'swe' }),
  row('yc-1920', 'olyYearToCountry', 'hard', summerY('1920'), BEL, { key: 'bel' }),
  row('yc-1924', 'olyYearToCountry', 'medium', summerY('1924'), FRA, { key: 'fra' }),
  row('yc-1928', 'olyYearToCountry', 'hard', summerY('1928'), NED, { key: 'ned' }),
  row('yc-1932', 'olyYearToCountry', 'medium', summerY('1932'), USA, { key: 'usa' }),
  row('yc-1936', 'olyYearToCountry', 'medium', summerY('1936'), GER, { key: 'ger' }),
  row('yc-1948', 'olyYearToCountry', 'medium', summerY('1948'), GBR, { key: 'gbr' }),
  row('yc-1952', 'olyYearToCountry', 'hard', summerY('1952'), FIN, { key: 'fin' }),
  row('yc-1956', 'olyYearToCountry', 'medium', summerY('1956'), AUS, { key: 'aus' }),
  row('yc-1960', 'olyYearToCountry', 'medium', summerY('1960'), ITA, { key: 'ita' }),
  row('yc-1964', 'olyYearToCountry', 'medium', summerY('1964'), JPN, { key: 'jpn' }),
  row('yc-1968', 'olyYearToCountry', 'medium', summerY('1968'), MEX, { key: 'mex' }),
  row('yc-1972', 'olyYearToCountry', 'medium', summerY('1972'), GER, { key: 'ger' }),
  row('yc-1976', 'olyYearToCountry', 'medium', summerY('1976'), CAN, { key: 'can' }),
  row('yc-1980', 'olyYearToCountry', 'easy', summerY('1980'), URS, { key: 'urs' }),
  row('yc-1984', 'olyYearToCountry', 'medium', summerY('1984'), USA, { key: 'usa' }),
  row('yc-1988', 'olyYearToCountry', 'medium', summerY('1988'), KOR, { key: 'kor' }),
  row('yc-1992', 'olyYearToCountry', 'medium', Y1992, ESP, { key: 'esp' }),
  row('yc-1996', 'olyYearToCountry', 'medium', summerY('1996'), USA, { key: 'usa' }),
  row('yc-2000', 'olyYearToCountry', 'medium', Y2000, AUS, { key: 'aus' }),
  row('yc-2004', 'olyYearToCountry', 'medium', summerY('2004'), GRE, { key: 'gre' }),
  row('yc-2008', 'olyYearToCountry', 'medium', Y2008, CHN, { key: 'chn' }),
  row('yc-2012', 'olyYearToCountry', 'easy', Y2012, GBR, { key: 'gbr' }),
  row('yc-2016', 'olyYearToCountry', 'easy', Y2016, BRA, { key: 'bra' }),
  row('yc-2020', 'olyYearToCountry', 'easy', Y2020, JPN, { key: 'jpn' }),
  row('yc-2024', 'olyYearToCountry', 'easy', Y2024, FRA, { key: 'fra' }),

  row('wy-1924', 'winterYearToHost', 'medium', winterY('1924'), CHAMONIX, { key: 'chamonix' }),
  row('wy-1980', 'winterYearToHost', 'medium', winterY('1980'), PLACID, { key: 'placid' }),
  row('wy-1964', 'winterYearToHost', 'hard', winterY('1964'), INNSBRUCK, { key: 'innsbruck' }),
  row('wy-1972', 'winterYearToHost', 'easy', winterY('1972'), SAPPORO, { key: 'sapporo' }),
  row('wy-1988', 'winterYearToHost', 'easy', winterY('1988'), CALGARY, { key: 'calgary' }),
  row('wy-1994', 'winterYearToHost', 'easy', winterY('1994'), LILLEH, { key: 'lillehammer' }),
  row('wy-1998', 'winterYearToHost', 'medium', winterY('1998'), NAGANO, { key: 'nagano' }),
  row('wy-2002', 'winterYearToHost', 'medium', winterY('2002'), SALT, { key: 'salt' }),
  row('wy-2006', 'winterYearToHost', 'easy', winterY('2006'), TURIN, { key: 'turin' }),
  row('wy-2010', 'winterYearToHost', 'medium', winterY('2010'), VANC, { key: 'vancouver' }),
  row('wy-2014', 'winterYearToHost', 'easy', winterY('2014'), SOCHI, { key: 'sochi' }),
  row('wy-2018', 'winterYearToHost', 'easy', winterY('2018'), PYEONG, { key: 'pyeong' }),
  row('wy-2022', 'winterYearToHost', 'easy', winterY('2022'), BEIJING, { key: 'beijing' }),
  row('wy-2026', 'winterYearToHost', 'medium', winterY('2026'), MILAN, { key: 'milan' }),

  row('wh-1924', 'winterHostToYear', 'hard', CHAMONIX, winterY('1924'), { key: '1924' }),
  row('wh-1964', 'winterHostToYear', 'hard', INNSBRUCK, winterY('1964'), { key: '1964' }),
  row('wh-1972', 'winterHostToYear', 'medium', SAPPORO, winterY('1972'), { key: '1972' }),
  row('wh-1980', 'winterHostToYear', 'medium', PLACID, winterY('1980'), { key: '1980' }),
  row('wh-1988', 'winterHostToYear', 'medium', CALGARY, winterY('1988'), { key: '1988' }),
  row('wh-1994', 'winterHostToYear', 'medium', LILLEH, winterY('1994'), { key: '1994' }),
  row('wh-1998', 'winterHostToYear', 'medium', NAGANO, winterY('1998'), { key: '1998' }),
  row('wh-2002', 'winterHostToYear', 'medium', SALT, winterY('2002'), { key: '2002' }),
  row('wh-2006', 'winterHostToYear', 'easy', TURIN, winterY('2006'), { key: '2006' }),
  row('wh-2010', 'winterHostToYear', 'easy', VANC, winterY('2010'), { key: '2010' }),
  row('wh-2014', 'winterHostToYear', 'easy', SOCHI, winterY('2014'), { key: '2014' }),
  row('wh-2018', 'winterHostToYear', 'easy', PYEONG, winterY('2018'), { key: '2018' }),
  row('wh-2022', 'winterHostToYear', 'easy', BEIJING, winterY('2022'), { key: '2022' }),
  row('wh-2026', 'winterHostToYear', 'medium', MILAN, winterY('2026'), { key: '2026' }),

  row('wc-1924', 'winterHostToCountry', 'hard', CHAMONIX, FRA, { key: 'fra' }),
  row('wc-1964', 'winterHostToCountry', 'hard', INNSBRUCK, AUT, { key: 'aut' }),
  row('wc-1972', 'winterHostToCountry', 'medium', SAPPORO, JPN, { key: 'jpn' }),
  row('wc-1980', 'winterHostToCountry', 'medium', PLACID, USA, { key: 'usa' }),
  row('wc-1988', 'winterHostToCountry', 'medium', CALGARY, CAN, { key: 'can' }),
  row('wc-1994', 'winterHostToCountry', 'medium', LILLEH, NOR, { key: 'nor' }),
  row('wc-1998', 'winterHostToCountry', 'medium', NAGANO, JPN, { key: 'jpn' }),
  row('wc-2002', 'winterHostToCountry', 'medium', SALT, USA, { key: 'usa' }),
  row('wc-2006', 'winterHostToCountry', 'easy', TURIN, ITA, { key: 'ita' }),
  row('wc-2010', 'winterHostToCountry', 'easy', VANC, CAN, { key: 'can' }),
  row('wc-2014', 'winterHostToCountry', 'easy', SOCHI, RUS, { key: 'rus' }),
  row('wc-2018', 'winterHostToCountry', 'easy', PYEONG, KOR, { key: 'kor' }),
  row('wc-2022', 'winterHostToCountry', 'easy', BEIJING, CHN, { key: 'chn' }),
  row('wc-2026', 'winterHostToCountry', 'medium', MILAN, ITA, { key: 'ita' }),

  row('sy-rings', 'olySymbolToMeaning', 'easy', RINGS, CONTINENTS, { key: 'continents' }),
  row('sy-flame', 'olySymbolToMeaning', 'easy', FLAME, RELAY, { key: 'relay' }),
  row('sy-motto', 'olySymbolToMeaning', 'easy', MOTTO, FASTER, { key: 'faster' }),
  row('sy-wreath', 'olySymbolToMeaning', 'medium', WREATH, PRIZE, { key: 'prize' }),
  row('sy-coub', 'olySymbolToMeaning', 'medium', COUB, FOUNDER, { key: 'founder' }),
  row('sy-flag', 'olySymbolToMeaning', 'easy', WHITE, IOC, { key: 'ioc' }),
  row('sy-gold', 'olySymbolToMeaning', 'easy', GOLD, FIRST, { key: 'first' }),
  row('sy-span', 'olySymbolToMeaning', 'medium', OLYMPIAD, FOUR, { key: 'four' }),
  row('sm-rings', 'olyMeaningToSymbol', 'easy', CONTINENTS, RINGS, { key: 'rings' }),
  row('sm-flame', 'olyMeaningToSymbol', 'easy', RELAY, FLAME, { key: 'flame' }),
  row('sm-motto', 'olyMeaningToSymbol', 'easy', FASTER, MOTTO, { key: 'motto' }),
  row('sm-wreath', 'olyMeaningToSymbol', 'medium', PRIZE, WREATH, { key: 'wreath' }),
  row('sm-coub', 'olyMeaningToSymbol', 'medium', FOUNDER, COUB, { key: 'coub' }),
  row('sm-flag', 'olyMeaningToSymbol', 'easy', IOC, WHITE, { key: 'flag' }),
  row('sm-gold', 'olyMeaningToSymbol', 'easy', FIRST, GOLD, { key: 'gold' }),
  row('sm-span', 'olyMeaningToSymbol', 'medium', FOUR, OLYMPIAD, { key: 'olympiad' }),

  row('nn-usa', 'nameToNoc', 'easy', USA, code('USA'), { key: 'usa' }),
  row('nn-gbr', 'nameToNoc', 'easy', GBR, code('GBR'), { key: 'gbr' }),
  row('nn-jpn', 'nameToNoc', 'easy', JPN, code('JPN'), { key: 'jpn' }),
  row('nn-fra', 'nameToNoc', 'easy', FRA, code('FRA'), { key: 'fra' }),
  row('nn-chn', 'nameToNoc', 'easy', CHN, code('CHN'), { key: 'chn' }),
  row('nn-aus', 'nameToNoc', 'medium', AUS, code('AUS'), { key: 'aus' }),
  row('nn-bra', 'nameToNoc', 'medium', BRA, code('BRA'), { key: 'bra' }),
  row('nn-gre', 'nameToNoc', 'medium', GRE, code('GRE'), { key: 'gre' }),
  row('nn-ger', 'nameToNoc', 'easy', GER, code('GER'), { key: 'ger' }),
  row('nn-ita', 'nameToNoc', 'easy', ITA, code('ITA'), { key: 'ita' }),
  row('nn-esp', 'nameToNoc', 'medium', ESP, code('ESP'), { key: 'esp' }),
  row('nn-can', 'nameToNoc', 'medium', CAN, code('CAN'), { key: 'can' }),
  row('nn-kor', 'nameToNoc', 'medium', KOR, code('KOR'), { key: 'kor' }),
  row('nn-jam', 'nameToNoc', 'easy', JAM, code('JAM'), { key: 'jam' }),
  row('nn-ken', 'nameToNoc', 'medium', KEN, code('KEN'), { key: 'ken' }),
  row('nn-ned', 'nameToNoc', 'hard', NED, code('NED'), { key: 'ned' }),

  row('gg-usa', 'countryToGolds', 'easy', USA, GOLD1000, { key: 'g1000' }),
  row('gg-chn', 'countryToGolds', 'medium', CHN, GOLD200, { key: 'g200' }),
  row('gg-gbr', 'countryToGolds', 'medium', GBR, GOLD200, { key: 'g200' }),
  row('gg-fra', 'countryToGolds', 'hard', FRA, GOLD200, { key: 'g200' }),
  row('gg-jpn', 'countryToGolds', 'easy', JPN, GOLD50, { key: 'g50' }),
  row('gg-aus', 'countryToGolds', 'easy', AUS, GOLD50, { key: 'g50' }),
  row('gg-bra', 'countryToGolds', 'easy', BRA, GOLD1, { key: 'g1' }),
  row('gg-gre', 'countryToGolds', 'easy', GRE, GOLD1, { key: 'g1' }),

  star('at-bolt', 'athleteToNoc', 'easy', BOLT, JAM, { key: 'jam' }),
  star('at-phelps', 'athleteToNoc', 'easy', PHELPS, USA, { key: 'usa' }),
  star('at-owens', 'athleteToNoc', 'easy', OWENS, USA, { key: 'usa' }),
  star('at-nadia', 'athleteToNoc', 'easy', NADIA, ROU, { key: 'rou' }),
  star('at-nurmi', 'athleteToNoc', 'medium', NURMI, FIN, { key: 'fin' }),
  star('at-bikila', 'athleteToNoc', 'medium', BIKILA, ETH, { key: 'eth' }),
  star('at-free', 'athleteToNoc', 'medium', FREEMAN, AUS, { key: 'aus' }),
  star('at-farah', 'athleteToNoc', 'easy', FARAH, GBR, { key: 'gbr' }),
  star('at-lewis', 'athleteToNoc', 'easy', LEWIS, USA, { key: 'usa' }),
  star('at-spitz', 'athleteToNoc', 'medium', SPITZ, USA, { key: 'usa' }),
  star('at-uchi', 'athleteToNoc', 'medium', UCHI, JPN, { key: 'jpn' }),
  star('at-riner', 'athleteToNoc', 'easy', RINER, FRA, { key: 'fra' }),
  star('at-steve', 'athleteToNoc', 'hard', STEVE, CUB, { key: 'cub' }),
  star('at-kip', 'athleteToNoc', 'easy', KIPCH, KEN, { key: 'ken' }),
  star('at-fisch', 'athleteToNoc', 'hard', FISCH, GER, { key: 'ger' }),
  star('at-pell', 'athleteToNoc', 'medium', PELL, ITA, { key: 'ita' }),
  star('at-krisz', 'athleteToNoc', 'hard', KRISZ, HUN, { key: 'hun' }),
  star('at-thorpe', 'athleteToNoc', 'medium', THORPE, AUS, { key: 'aus' }),
  star('at-fraser', 'athleteToNoc', 'medium', FRASER, JAM, { key: 'jam' }),
  star('at-felix', 'athleteToNoc', 'easy', FELIX, USA, { key: 'usa' }),
  star('at-blank', 'athleteToNoc', 'hard', BLANK, NED, { key: 'ned' }),

  star('oph-nurmi', 'olyPhotoToName', 'medium', NURMI, NURMI, { key: 'nurmi' }),
  star('oph-bikila', 'olyPhotoToName', 'medium', BIKILA, BIKILA, { key: 'bikila' }),
  star('oph-free', 'olyPhotoToName', 'medium', FREEMAN, FREEMAN, { key: 'free' }),
  star('oph-farah', 'olyPhotoToName', 'easy', FARAH, FARAH, { key: 'farah' }),
  star('oph-lewis', 'olyPhotoToName', 'easy', LEWIS, LEWIS, { key: 'lewis' }),
  star('oph-spitz', 'olyPhotoToName', 'medium', SPITZ, SPITZ, { key: 'spitz' }),
  star('oph-kip', 'olyPhotoToName', 'easy', KIPCH, KIPCH, { key: 'kip' }),
  star('oph-pell', 'olyPhotoToName', 'medium', PELL, PELL, { key: 'pell' }),
  star('oph-krisz', 'olyPhotoToName', 'hard', KRISZ, KRISZ, { key: 'krisz' }),
  star('oph-fraser', 'olyPhotoToName', 'medium', FRASER, FRASER, { key: 'fraser' }),
  star('oph-blank', 'olyPhotoToName', 'hard', BLANK, BLANK, { key: 'blank' }),

  ...csGeneratedRows(),
  ...foodGeneratedRows(),

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
  ...olyGeneratedRows(),
].filter((item): item is ThemeItem => item !== null)

const BY_ID = new Map(THEME_ITEMS.map((item) => [item.id, item]))

export function themeById(id: string): ThemeItem | undefined {
  return BY_ID.get(id)
}

export function themeWikis(): string[] {
  const titles = new Set<string>()
  for (const item of THEME_ITEMS) {
    if (item.wiki) titles.add(item.wiki)
  }
  return [...titles]
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
