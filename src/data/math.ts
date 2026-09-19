import type { Country } from './countries'
import type { Lang } from '../i18n/lang'
import type { MathMode } from '../lib/quiz/mathModes'

export type MathTier = 'easy' | 'medium' | 'hard'

export type L11 = Record<Lang, string>

export function t11(
  ru: string,
  en: string,
  de: string,
  zh: string,
  es: string,
  hi: string,
  ar: string,
  bn: string,
  pt: string,
  ja: string,
  he: string,
): L11 {
  return { ru, en, de, zh, es, hi, ar, bn, pt, ja, he }
}

export function pickL(map: L11 | string, lang: Lang): string {
  if (typeof map === 'string') return map
  return map[lang] || map.en
}

export type MathShapeId =
  | 'triangle'
  | 'square'
  | 'rectangle'
  | 'rhombus'
  | 'parallelogram'
  | 'trapezoid'
  | 'pentagon'
  | 'hexagon'
  | 'octagon'
  | 'circle'
  | 'ellipse'
  | 'cube'
  | 'sphere'
  | 'cylinder'
  | 'cone'
  | 'pyramid'

export interface MathItem {
  id: string
  mode: MathMode
  tier: MathTier
  prompt: L11 | string
  answer: L11 | string
  key: string
  shape?: MathShapeId
  wiki?: string
  wikiFile?: string
  iso?: string
  personId?: string
  facts?: L11[]
}

function row(
  id: string,
  mode: MathMode,
  tier: MathTier,
  prompt: L11 | string,
  answer: L11 | string,
  extra: Partial<MathItem> = {},
): MathItem {
  const key = extra.key ?? (typeof answer === 'string' ? answer : answer.en)
  return { id, mode, tier, prompt, answer, key, ...extra }
}

const SHAPE_NAMES: Record<MathShapeId, L11> = {
  triangle: t11('треугольник', 'triangle', 'Dreieck', '三角形', 'triángulo', 'त्रिभुज', 'مثلث', 'ত্রিভুজ', 'triângulo', '三角形', 'משולש'),
  square: t11('квадрат', 'square', 'Quadrat', '正方形', 'cuadrado', 'वर्ग', 'مربع', 'বর্গ', 'quadrado', '正方形', 'ריבוע'),
  rectangle: t11('прямоугольник', 'rectangle', 'Rechteck', '矩形', 'rectángulo', 'आयत', 'مستطيل', 'আয়তক্ষেত্র', 'retângulo', '長方形', 'מלבן'),
  rhombus: t11('ромб', 'rhombus', 'Raute', '菱形', 'rombo', 'समचतुर्भुज', 'معين', 'রম্বস', 'losango', 'ひし形', 'מעוין'),
  parallelogram: t11('параллелограмм', 'parallelogram', 'Parallelogramm', '平行四边形', 'paralelogramo', 'समानांतर चतुर्भुज', 'متوازي أضلاع', 'সমান্তরিক', 'paralelogramo', '平行四辺形', 'מקבילית'),
  trapezoid: t11('трапеция', 'trapezoid', 'Trapez', '梯形', 'trapecio', 'समलंब', 'شبه منحرف', 'ট্রাপিজিয়াম', 'trapézio', '台形', 'טרפז'),
  pentagon: t11('пятиугольник', 'pentagon', 'Fünfeck', '五边形', 'pentágono', 'पंचभुज', 'مخمس', 'পঞ্চভুজ', 'pentágono', '五角形', 'מחומש'),
  hexagon: t11('шестиугольник', 'hexagon', 'Sechseck', '六边形', 'hexágono', 'षट्भुज', 'مسدس', 'ষড়ভুজ', 'hexágono', '六角形', 'משושה'),
  octagon: t11('восьмиугольник', 'octagon', 'Achteck', '八边形', 'octágono', 'अष्टभुज', 'مثمن', 'অষ্টভুজ', 'octógono', '八角形', 'מתומן'),
  circle: t11('круг', 'circle', 'Kreis', '圆', 'círculo', 'वृत्त', 'دائرة', 'বৃত্ত', 'círculo', '円', 'עיגול'),
  ellipse: t11('эллипс', 'ellipse', 'Ellipse', '椭圆', 'elipse', 'दीर्घवृत्त', 'قطع ناقص', 'উপবৃত্ত', 'elipse', '楕円', 'אליפסה'),
  cube: t11('куб', 'cube', 'Würfel', '立方体', 'cubo', 'घन', 'مكعب', 'ঘনক', 'cubo', '立方体', 'קובייה'),
  sphere: t11('шар', 'sphere', 'Kugel', '球体', 'esfera', 'गोला', 'كرة', 'গোলক', 'esfera', '球', 'כדור'),
  cylinder: t11('цилиндр', 'cylinder', 'Zylinder', '圆柱', 'cilindro', 'बेलन', 'أسطوانة', 'সিলিন্ডার', 'cilindro', '円柱', 'גליל'),
  cone: t11('конус', 'cone', 'Kegel', '圆锥', 'cono', 'शंकु', 'مخروط', 'শঙ্কু', 'cone', '円錐', 'חרוט'),
  pyramid: t11('пирамида', 'pyramid', 'Pyramide', '棱锥', 'pirámide', 'पिरामिड', 'هرم', 'পিরামিড', 'pirâmide', '角錐', 'פירמידה'),
}

const SHAPE_TIERS: Record<MathShapeId, MathTier> = {
  triangle: 'easy',
  square: 'easy',
  rectangle: 'easy',
  circle: 'easy',
  cube: 'easy',
  rhombus: 'medium',
  pentagon: 'medium',
  hexagon: 'medium',
  sphere: 'medium',
  cylinder: 'medium',
  parallelogram: 'hard',
  trapezoid: 'hard',
  octagon: 'hard',
  ellipse: 'hard',
  cone: 'hard',
  pyramid: 'hard',
}

export const ANGLE_KIND = {
  acute: t11('острый', 'acute', 'spitz', '锐角', 'agudo', 'न्यून', 'حاد', 'সূক্ষ্ম', 'agudo', '鋭角', 'חד'),
  right: t11('прямой', 'right', 'rechter', '直角', 'recto', 'समकोण', 'قائم', 'সমকোণ', 'reto', '直角', 'ישר'),
  obtuse: t11('тупой', 'obtuse', 'stumpfer', '钝角', 'obtuso', 'अधिक', 'منفرج', 'স্থূল', 'obtuso', '鈍角', 'קהה'),
  straight: t11('развёрнутый', 'straight', 'gestreckter', '平角', 'llano', 'सरलकोण', 'مستقيم', 'সরলকোণ', 'raso', '平角', 'שטוח'),
}

function kindOfAngle(deg: number): keyof typeof ANGLE_KIND {
  if (deg < 90) return 'acute'
  if (deg === 90) return 'right'
  if (deg < 180) return 'obtuse'
  return 'straight'
}

const FORMULAS: Array<{ id: string; formula: string; qty: L11; tier: MathTier }> = [
  { id: 'circ-a', formula: 'S = πr²', qty: t11('площадь круга', 'area of a circle', 'Kreisfläche', '圆的面积', 'área del círculo', 'वृत्त का क्षेत्रफल', 'مساحة الدائرة', 'বৃত্তের ক্ষেত্রফল', 'área do círculo', '円の面積', 'שטח מעגל'), tier: 'easy' },
  { id: 'circ-c', formula: 'C = 2πr', qty: t11('длина окружности', 'circumference', 'Umfang', '圆周长', 'circunferencia', 'परिधि', 'محيط الدائرة', 'পরিধি', 'circunferência', '円周', 'היקף מעגל'), tier: 'easy' },
  { id: 'sq-a', formula: 'S = a²', qty: t11('площадь квадрата', 'area of a square', 'Quadratfläche', '正方形面积', 'área del cuadrado', 'वर्ग का क्षेत्रफल', 'مساحة المربع', 'বর্গের ক্ষেত্রফল', 'área do quadrado', '正方形の面積', 'שטח ריבוע'), tier: 'easy' },
  { id: 'rect-a', formula: 'S = a·b', qty: t11('площадь прямоугольника', 'area of a rectangle', 'Rechteckfläche', '矩形面积', 'área del rectángulo', 'आयत का क्षेत्रफल', 'مساحة المستطيل', 'আয়তক্ষেত্রের ক্ষেত্রফল', 'área do retângulo', '長方形の面積', 'שטח מלבן'), tier: 'easy' },
  { id: 'tri-a', formula: 'S = ab/2', qty: t11('площадь треугольника', 'area of a triangle', 'Dreiecksfläche', '三角形面积', 'área del triángulo', 'त्रिभुज का क्षेत्रफल', 'مساحة المثلث', 'ত্রিভুজের ক্ষেত্রফল', 'área do triângulo', '三角形の面積', 'שטח משולש'), tier: 'medium' },
  { id: 'pyth', formula: 'a² + b² = c²', qty: t11('гипотенуза', 'hypotenuse', 'Hypotenuse', '斜边', 'hipotenusa', 'कर्ण', 'الوتر', 'অতিভুজ', 'hipotenusa', '斜辺', 'יתר'), tier: 'medium' },
  { id: 'trap-a', formula: 'S = (a+b)h/2', qty: t11('площадь трапеции', 'area of a trapezoid', 'Trapezfläche', '梯形面积', 'área del trapecio', 'समलंब का क्षेत्रफल', 'مساحة شبه المنحرف', 'ট্রাপিজিয়ামের ক্ষেত্রফল', 'área do trapézio', '台形の面積', 'שטח טרפז'), tier: 'hard' },
  { id: 'sph-v', formula: 'V = 4/3 πr³', qty: t11('объём шара', 'volume of a sphere', 'Kugelvolumen', '球体积', 'volumen de la esfera', 'गोले का आयतन', 'حجم الكرة', 'গোলকের আয়তন', 'volume da esfera', '球の体積', 'נפח כדור'), tier: 'hard' },
  { id: 'cyl-v', formula: 'V = πr²h', qty: t11('объём цилиндра', 'volume of a cylinder', 'Zylindervolumen', '圆柱体积', 'volumen del cilindro', 'बेलन का आयतन', 'حجم الأسطوانة', 'সিলিন্ডারের আয়তন', 'volume do cilindro', '円柱の体積', 'נפח גליל'), tier: 'medium' },
  { id: 'cone-v', formula: 'V = 1/3 πr²h', qty: t11('объём конуса', 'volume of a cone', 'Kegelvolumen', '圆锥体积', 'volumen del cono', 'शंकु का आयतन', 'حجم المخروط', 'শঙ্কুর আয়তন', 'volume do cone', '円錐の体積', 'נפח חרוט'), tier: 'hard' },
  { id: 'para-a', formula: 'S = a·h', qty: t11('площадь параллелограмма', 'area of a parallelogram', 'Parallelogrammfläche', '平行四边形面积', 'área del paralelogramo', 'समानांतर चतुर्भुज का क्षेत्रफल', 'مساحة متوازي الأضلاع', 'সমান্তরিকের ক্ষেত্রফল', 'área do paralelogramo', '平行四辺形の面積', 'שטח מקבילית'), tier: 'medium' },
  { id: 'rhomb-a', formula: 'S = d₁d₂/2', qty: t11('площадь ромба', 'area of a rhombus', 'Rautenfläche', '菱形面积', 'área del rombo', 'समचतुर्भुज का क्षेत्रफल', 'مساحة المعين', 'রম্বসের ক্ষেত্রফল', 'área do losango', 'ひし形の面積', 'שטח מעוין'), tier: 'hard' },
  { id: 'cube-v', formula: 'V = a³', qty: t11('объём куба', 'volume of a cube', 'Würfelvolumen', '立方体体积', 'volumen del cubo', 'घन का आयतन', 'حجم المكعب', 'ঘনকের আয়তন', 'volume do cubo', '立方体の体積', 'נפח קובייה'), tier: 'easy' },
  { id: 'pyr-v', formula: 'V = ⅓S·h', qty: t11('объём пирамиды', 'volume of a pyramid', 'Pyramidenvolumen', '棱锥体积', 'volumen de la pirámide', 'पिरामिड का आयतन', 'حجم الهرم', 'পিরামিডের আয়তন', 'volume da pirâmide', '角錐の体積', 'נפח פירמידה'), tier: 'hard' },
]

const SYMBOLS: Array<{ id: string; glyph: string; meaning: L11; tier: MathTier }> = [
  { id: 'pi', glyph: 'π', meaning: t11('число пи', 'pi', 'Pi', '圆周率', 'pi', 'पाई', 'باي', 'পাই', 'pi', '円周率', 'פאי'), tier: 'easy' },
  { id: 'e', glyph: 'e', meaning: t11('основание натурального логарифма', 'Euler’s number', 'Eulersche Zahl', '自然常数 e', 'número e', 'यूलर संख्या', 'عدد أويلر', 'ইউলার সংখ্যা', 'número de Euler', 'ネイピア数', 'מספר אוילר'), tier: 'medium' },
  { id: 'inf', glyph: '∞', meaning: t11('бесконечность', 'infinity', 'Unendlich', '无穷', 'infinito', 'अनंत', 'لانهاية', 'অসীম', 'infinito', '無限', 'אינסוף'), tier: 'easy' },
  { id: 'sum', glyph: '∑', meaning: t11('сумма', 'sum', 'Summe', '求和', 'suma', 'योग', 'مجموع', 'যোগফল', 'soma', '総和', 'סכום'), tier: 'easy' },
  { id: 'sqrt', glyph: '√', meaning: t11('корень', 'square root', 'Wurzel', '根号', 'raíz', 'वर्गमूल', 'جذر', 'বর্গমূল', 'raiz', '根号', 'שורש'), tier: 'easy' },
  { id: 'le', glyph: '≤', meaning: t11('меньше или равно', 'less or equal', 'kleiner gleich', '小于或等于', 'menor o igual', 'छोटा या बराबर', 'أصغر أو يساوي', 'ছোট বা সমান', 'menor ou igual', '以下', 'קטן או שווה'), tier: 'medium' },
  { id: 'ge', glyph: '≥', meaning: t11('больше или равно', 'greater or equal', 'größer gleich', '大于或等于', 'mayor o igual', 'बड़ा या बराबर', 'أكبر أو يساوي', 'বড় বা সমান', 'maior ou igual', '以上', 'גדול או שווה'), tier: 'medium' },
  { id: 'ne', glyph: '≠', meaning: t11('не равно', 'not equal', 'ungleich', '不等于', 'distinto', 'असमान', 'لا يساوي', 'সমান নয়', 'diferente', '等しくない', 'לא שווה'), tier: 'easy' },
  { id: 'pm', glyph: '±', meaning: t11('плюс-минус', 'plus-minus', 'plus minus', '正负', 'más menos', 'धन-ऋण', 'زائد ناقص', 'যোগ-বিয়োগ', 'mais ou menos', 'プラスマイナス', 'פלוס-מינוס'), tier: 'medium' },
  { id: 'times', glyph: '×', meaning: t11('умножение', 'multiplication', 'Mal', '乘', 'multiplicación', 'गुणा', 'ضرب', 'গুণ', 'multiplicação', '掛け算', 'כפל'), tier: 'easy' },
  { id: 'div', glyph: '÷', meaning: t11('деление', 'division', 'Geteilt', '除', 'división', 'भाग', 'قسمة', 'ভাগ', 'divisão', '割り算', 'חילוק'), tier: 'easy' },
  { id: 'in', glyph: '∈', meaning: t11('принадлежит', 'element of', 'Element von', '属于', 'pertenece', 'सदस्य', 'ينتمي', 'সদস্য', 'pertence', '属する', 'איבר של'), tier: 'hard' },
  { id: 'subset', glyph: '⊂', meaning: t11('подмножество', 'subset', 'Teilmenge', '子集', 'subconjunto', 'उपसमुच्चय', 'مجموعة جزئية', 'উপসেট', 'subconjunto', '部分集合', 'תת-קבוצה'), tier: 'hard' },
  { id: 'forall', glyph: '∀', meaning: t11('для всех', 'for all', 'für alle', '任意', 'para todo', 'सभी के लिए', 'لكل', 'সবার জন্য', 'para todo', '任意', 'לכל'), tier: 'hard' },
  { id: 'exists', glyph: '∃', meaning: t11('существует', 'there exists', 'es existiert', '存在', 'existe', 'अस्तित्व', 'يوجد', 'অস্তিত্ব', 'existe', '存在する', 'קיים'), tier: 'hard' },
  { id: 'empty', glyph: '∅', meaning: t11('пустое множество', 'empty set', 'leere Menge', '空集', 'conjunto vacío', 'रिक्त समुच्चय', 'مجموعة خالية', 'শূন্য সেট', 'conjunto vazio', '空集合', 'קבוצה ריקה'), tier: 'hard' },
  { id: 'approx', glyph: '≈', meaning: t11('приблизительно', 'approximately', 'ungefähr', '约等于', 'aproximadamente', 'लगभग', 'تقريبا', 'প্রায়', 'aproximadamente', 'およそ', 'בערך'), tier: 'medium' },
  { id: 'angle', glyph: '∠', meaning: t11('угол', 'angle', 'Winkel', '角', 'ángulo', 'कोण', 'زاوية', 'কোণ', 'ângulo', '角', 'זווית'), tier: 'easy' },
  { id: 'perp', glyph: '⊥', meaning: t11('перпендикулярно', 'perpendicular', 'senkrecht', '垂直', 'perpendicular', 'लंब', 'عمودي', 'লম্ব', 'perpendicular', '垂直', 'ניצב'), tier: 'medium' },
  { id: 'parallel', glyph: '∥', meaning: t11('параллельно', 'parallel', 'parallel', '平行', 'paralelo', 'समानांतर', 'توازٍ', 'সমান্তরাল', 'paralelo', '平行', 'מקביל'), tier: 'medium' },
  { id: 'integral', glyph: '∫', meaning: t11('интеграл', 'integral', 'Integral', '积分', 'integral', 'समाकल', 'تكامل', 'সমাকল', 'integral', '積分', 'אינטגרל'), tier: 'hard' },
  { id: 'partial', glyph: '∂', meaning: t11('частная производная', 'partial derivative', 'partielle Ableitung', '偏导数', 'derivada parcial', 'आंशिक अवकलज', 'مشتق جزئي', 'আংশিক অন্তরক', 'derivada parcial', '偏微分', 'נגזרת חלקית'), tier: 'hard' },
  { id: 'union', glyph: '∪', meaning: t11('объединение', 'union', 'Vereinigung', '并集', 'unión', 'संघ', 'اتحاد', 'সংযোগ', 'união', '和集合', 'איחוד'), tier: 'hard' },
  { id: 'intersect', glyph: '∩', meaning: t11('пересечение', 'intersection', 'Schnitt', '交集', 'intersección', 'प्रतिच्छेदन', 'تقاطع', 'ছেদ', 'interseção', '共通部分', 'חיתוך'), tier: 'hard' },
]

export interface MathPerson {
  id: string
  name: L11
  iso: string
  century: number
  tier: MathTier
  wiki: string
  wikiFile?: string
  facts: L11[]
}

export const MATH_PEOPLE: MathPerson[] = [
  {
    id: 'euclid',
    name: t11('Евклид', 'Euclid', 'Euklid', '欧几里得', 'Euclides', 'यूक्लिड', 'إقليدس', 'ইউক্লিড', 'Euclides', 'エウクレイデス', 'אוקלידס'),
    iso: 'gr',
    century: -3,
    tier: 'easy',
    wiki: 'Euclid',
    wikiFile: 'Euklid.jpg',
    facts: [
      t11('Автор «Начал».', 'Author of the Elements.', 'Autor der Elemente.', '《几何原本》作者。', 'Autor de los Elementos.', 'एलीमेंट्स के लेखक।', 'مؤلف الأصول.', 'এলিমেন্টসের লেখক।', 'Autor dos Elementos.', '『原論』の著者。', 'מחבר היסודות.'),
      t11('Александрия, эллинизм.', 'Alexandria, Hellenistic age.', 'Alexandria, Hellenismus.', '亚历山大城，希腊化时代。', 'Alejandría, época helenística.', 'सिकंदरिया, हेलेनिस्टिक युग।', 'الإسكندرية في العصر الهلنستي.', 'আলেকজান্দ্রিয়া, হেলেনিস্টিক যুগ।', 'Alexandria, época helenística.', 'アレクサンドリア、ヘレニズム期。', 'אלכסנדריה, התקופה ההלניסטית.'),
    ],
  },
  {
    id: 'archimedes',
    name: t11('Архимед', 'Archimedes', 'Archimedes', '阿基米德', 'Arquímedes', 'आर्किमिडीज़', 'أرخميدس', 'আর্কিমিডিস', 'Arquimedes', 'アルキメデス', 'ארכימדס'),
    iso: 'gr',
    century: -3,
    tier: 'easy',
    wiki: 'Archimedes',
    wikiFile: 'Domenico-Fetti Archimedes 1620.jpg',
    facts: [
      t11('Сиракузы, рычаг и выталкивающая сила.', 'Syracuse; lever and buoyancy.', 'Syrakus; Hebel und Auftrieb.', '叙拉古；杠杆与浮力。', 'Siracusa; palanca y flotación.', 'सिरैक्यूज़; उत्तोलक और उत्प्लावन।', 'سرقوسة؛ العتلة والطفو.', 'সিরাكيউজ; লিভার ও উচ্ছ্বাস।', 'Siracusa; alavanca e flutuação.', 'シュラクサイ。てこと浮力。', 'סירקוסאי; מנוף וציפה.'),
      t11('Оценка числа π.', 'Estimated π.', 'Schätzte π.', '估算了 π。', 'Estimó π.', 'π का अनुमान।', 'قدّر π.', 'π-এর অনুমান।', 'Estimou π.', '円周率を評価。', 'העריך את π.'),
    ],
  },
  {
    id: 'pythagoras',
    name: t11('Пифагор', 'Pythagoras', 'Pythagoras', '毕达哥拉斯', 'Pitágoras', 'पाइथागोरस', 'فيثاغورس', 'পিথাগোরাস', 'Pitágoras', 'ピタゴラス', 'פיתגורס'),
    iso: 'gr',
    century: -6,
    tier: 'easy',
    wiki: 'Pythagoras',
    wikiFile: 'Kapitolinischer Pythagoras.jpg',
    facts: [
      t11('Теорема о прямоугольном треугольнике.', 'Right-triangle theorem.', 'Satz vom rechtwinkligen Dreieck.', '直角三角形定理。', 'Teorema del triángulo rectángulo.', 'समकोण त्रिभुज प्रमेय।', 'مبرهنة المثلث القائم.', 'সমকোণী ত্রিভুজের উপপাদ্য।', 'Teorema do triângulo retângulo.', '直角三角形の定理。', 'משפט המשולש ישר הזווית.'),
      t11('Кротон, школа пифагорейцев.', 'Croton, Pythagorean school.', 'Kroton, pythagoreische Schule.', '克罗托内，毕达哥拉斯学派。', 'Crotona, escuela pitagórica.', 'क्रोटन, पाइथागोरस स्कूल।', 'كروتونا ومدرسة فيثاغورس.', 'ক্রোটন, পিথাগোরীয় স্কুল।', 'Crotone, escola pitagórica.', 'クロトン、ピタゴラス派。', 'קרוטון, אסכולה פיתגוראית.'),
    ],
  },
  {
    id: 'khwarizmi',
    name: t11('Аль-Хорезми', 'Al-Khwarizmi', 'Al-Chwarizmi', '花拉子米', 'Al-Juarismi', 'अल-ख़्वारिज़्मी', 'الخوارزمي', 'আল-খোয়ারিজমি', 'Al-Khwarizmi', 'フワーリズミー', 'אל-חוואריזמי'),
    iso: 'uz',
    century: 9,
    tier: 'medium',
    wiki: 'Muhammad ibn Musa al-Khwarizmi',
    wikiFile: '1983 CPA 5413.jpg',
    facts: [
      t11('Трактат об ал-джабр — корень слова «алгебра».', 'Treatise on al-jabr, root of “algebra”.', 'Abhandlung über al-ğabr, Ursprung von „Algebra“.', '论“还原”，代数一词的来源。', 'Tratado de al-jabr, origen de «álgebra».', 'अल-जब्र ग्रंथ, algebra शब्द की जड़।', 'رسالة الجبر، أصل كلمة الجبر.', 'আল-জাবর গ্রন্থ, algebra শব্দের উৎস।', 'Tratado de al-jabr, origem de «álgebra».', 'アルジャブルの書。「代数」の語源。', 'חיבור אל-ג׳בר, שורש המילה אלגברה.'),
      t11('Багдад, Дом мудрости.', 'Baghdad, House of Wisdom.', 'Bagdad, Haus der Weisheit.', '巴格达智慧宫。', 'Bagdad, Casa de la Sabiduría.', 'बगदाद, ज्ञान गृह।', 'بغداد، بيت الحكمة.', 'বাগদাদ, হাউস অব উইজডম।', 'Bagdade, Casa da Sabedoria.', 'バグダード、知恵の館。', 'בגדאד, בית החוכמה.'),
    ],
  },
  {
    id: 'descartes',
    name: t11('Декарт', 'Descartes', 'Descartes', '笛卡尔', 'Descartes', 'देकार्त', 'ديكارت', 'দেকার্ত', 'Descartes', 'デカルト', 'דקארט'),
    iso: 'fr',
    century: 17,
    tier: 'easy',
    wiki: 'René Descartes',
    wikiFile: 'Frans Hals - Portret van René Descartes.jpg',
    facts: [
      t11('Декартовы координаты.', 'Cartesian coordinates.', 'Kartesisches Koordinatensystem.', '笛卡尔坐标系。', 'Coordenadas cartesianas.', 'कार्तीय निर्देशांक।', 'الإحداثيات الديكارتية.', 'কার্তেসীয় স্থানাঙ্ক।', 'Coordenadas cartesianas.', '直交座標。', 'קואורדינטות קרטזיות.'),
      t11('«Мыслю, следовательно существую».', '“I think, therefore I am.”', '„Ich denke, also bin ich.“', '“我思故我在”。', '«Pienso, luego existo».', '“मैं सोचता हूँ, इसलिए हूँ।”', '«أنا أفكر إذن أنا موجود».', '“আমি ভাবি, অতএব আমি আছি।”', '«Penso, logo existo».', '「我思う、ゆえに我あり」。', '״אני חושב משמע אני קיים״.'),
    ],
  },
  {
    id: 'newton',
    name: t11('Ньютон', 'Newton', 'Newton', '牛顿', 'Newton', 'न्यूटन', 'نيوتن', 'নিউটন', 'Newton', 'ニュートン', 'ניוטון'),
    iso: 'gb',
    century: 17,
    tier: 'easy',
    wiki: 'Isaac Newton',
    wikiFile: 'GodfreyKneller-IsaacNewton-1689.jpg',
    facts: [
      t11('Principia: механика и гравитация.', 'Principia: mechanics and gravity.', 'Principia: Mechanik und Gravitation.', '《原理》：力学与引力。', 'Principia: mecánica y gravedad.', 'प्रिंसिपिया: यांत्रिकी और गुरुत्वाकर्षण।', 'المبادئ: الميكانيكا والجاذبية.', 'প্রিন্সিপিয়া: বলবিদ্যা ও মহাকর্ষ।', 'Principia: mecânica e gravidade.', 'プリンキピア：力学と重力。', 'פרינקיפיה: מכניקה וכבידה.'),
      t11('Исчисление бесконечно малых (независимо от Лейбница).', 'Infinitesimal calculus (independently of Leibniz).', 'Infinitesimalrechnung (unabhängig von Leibniz).', '微积分（与莱布尼茨独立）。', 'Cálculo infinitesimal (independiente de Leibniz).', 'अनंतसूक्ष्म कलन (लाइबनिज से स्वतंत्र)।', 'حساب التفاضل (مستقل عن لايبنتس).', 'অসীম ক্যালকুলাস (লাইবনিজ থেকে স্বাধীন)।', 'Cálculo infinitesimal (independente de Leibniz).', '無限小解析（ライプニッツと独立）。', 'חשבון אינפיניטסימלי (בנפרד מלייבניץ).'),
    ],
  },
  {
    id: 'leibniz',
    name: t11('Лейбниц', 'Leibniz', 'Leibniz', '莱布尼茨', 'Leibniz', 'लाइब्नित्ज़', 'لايبنتس', 'লাইবনিজ', 'Leibniz', 'ライプニッツ', 'לייבניץ'),
    iso: 'de',
    century: 17,
    tier: 'medium',
    wiki: 'Gottfried Wilhelm Leibniz',
    wikiFile: 'Gottfried Wilhelm Leibniz, Bernhard Christoph Francke.jpg',
    facts: [
      t11('Современная запись dx, ∫.', 'Modern notation dx, ∫.', 'Heutige Notation dx, ∫.', '现代记号 dx、∫。', 'Notación moderna dx, ∫.', 'आधुनिक संकेत dx, ∫।', 'الترميز الحديث dx و ∫.', 'আধুনিক প্রতীক dx, ∫।', 'Notação moderna dx, ∫.', '現代的な記法 dx、∫。', 'סימון מודרני dx, ∫.'),
      t11('Двоичная система счисления.', 'Binary number system.', 'Binärsystem.', '二进制。', 'Sistema binario.', 'द्विआधारी संख्या प्रणाली।', 'النظام الثنائي.', 'বাইনারি সংখ্যা পদ্ধতি।', 'Sistema binário.', '二進法。', 'שיטה בינארית.'),
    ],
  },
  {
    id: 'euler',
    name: t11('Эйлер', 'Euler', 'Euler', '欧拉', 'Euler', 'आयलर', 'أويلر', 'ইউলার', 'Euler', 'オイラー', 'אוילר'),
    iso: 'ch',
    century: 18,
    tier: 'easy',
    wiki: 'Leonhard Euler',
    wikiFile: 'Leonhard Euler.jpg',
    facts: [
      t11('e^{iπ} + 1 = 0.', 'e^{iπ} + 1 = 0.', 'e^{iπ} + 1 = 0.', 'e^{iπ} + 1 = 0。', 'e^{iπ} + 1 = 0.', 'e^{iπ} + 1 = 0.', 'e^{iπ} + 1 = 0.', 'e^{iπ} + 1 = 0.', 'e^{iπ} + 1 = 0.', 'e^{iπ} + 1 = 0。', 'e^{iπ} + 1 = 0.'),
      t11('Базель, Петербург, теория графов.', 'Basel, St Petersburg, graph theory.', 'Basel, Sankt Petersburg, Graphentheorie.', '巴塞尔、圣彼得堡、图论。', 'Basilea, San Petersburgo, teoría de grafos.', 'बेसल, सेंट पीटर्सबर्ग, ग्राफ सिद्धांत।', 'بازل وسانت بطرسبرغ ونظرية الرسوم.', 'বাজেল, সেন্ট পিটার্সবার্গ, গ্রাফ তত্ত্ব।', 'Basileia, São Petersburgo, teoria dos grafos.', 'バーゼル、ペテルブルク、グラフ理論。', 'באזל, סנקט פטרבורג, תורת הגרפים.'),
    ],
  },
  {
    id: 'gauss',
    name: t11('Гаусс', 'Gauss', 'Gauß', '高斯', 'Gauss', 'गाउस', 'غاوس', 'গাউস', 'Gauss', 'ガウス', 'גאוס'),
    iso: 'de',
    century: 19,
    tier: 'easy',
    wiki: 'Carl Friedrich Gauss',
    wikiFile: 'Carl Friedrich Gauss.jpg',
    facts: [
      t11('Основная теорема алгебры; нормальное распределение.', 'Fundamental theorem of algebra; normal distribution.', 'Fundamentalsatz der Algebra; Normalverteilung.', '代数基本定理；正态分布。', 'Teorema fundamental del álgebra; distribución normal.', 'बीजगणित का मूल प्रमेय; प्रसामान्य बंटन।', 'المبرهنة الأساسية في الجبر؛ التوزيع الطبيعي.', 'বীজগণিতের মৌলিক উপপাদ্য; স্বাভাবিক বণ্টন।', 'Teorema fundamental da álgebra; distribuição normal.', '代数学の基本定理、正規分布。', 'המשפט היסודי של האלגברה; התפלגות נורמלית.'),
      t11('Гёттинген, «князь математиков».', 'Göttingen, “prince of mathematicians”.', 'Göttingen, „Fürst der Mathematiker“.', '哥廷根，“数学王子”。', 'Gotinga, «príncipe de las matemáticas».', 'गोटिंगेन, “गणितज्ञों के राजकुमार”।', 'غوتنغن، «أمير الرياضيات».', 'গেটিঙেন, “গণিতের রাজপুত্র”।', 'Gotinga, «príncipe dos matemáticos».', 'ゲッティンゲン、「数学の王子」。', 'גטינגן, ״נסיך המתמטיקאים״.'),
    ],
  },
  {
    id: 'riemann',
    name: t11('Риман', 'Riemann', 'Riemann', '黎曼', 'Riemann', 'रीमान', 'ريمان', 'রিমান', 'Riemann', 'リーマン', 'רימן'),
    iso: 'de',
    century: 19,
    tier: 'hard',
    wiki: 'Bernhard Riemann',
    wikiFile: 'Georg Friedrich Bernhard Riemann.jpeg',
    facts: [
      t11('Гипотеза о нулях дзета-функции.', 'Hypothesis on zeros of the zeta function.', 'Vermutung über Nullstellen der Zetafunktion.', '关于ζ函数零点的猜想。', 'Hipótesis sobre los ceros de zeta.', 'जीटा फलन के शून्यों की परिकल्पना।', 'فرضية أصفار دالة زيتا.', 'জিটা ফাংশনের শূন্যের অনুমান।', 'Hipótese sobre os zeros de zeta.', 'ゼータ関数の零点に関する予想。', 'השערת האפסים של זטה.'),
      t11('Риманова геометрия.', 'Riemannian geometry.', 'Riemannsche Geometrie.', '黎曼几何。', 'Geometría riemanniana.', 'रीमानी ज्यामिति।', 'هندسة ريمانية.', 'রিমানীয় জ্যামিতি।', 'Geometria riemanniana.', 'リーマン幾何。', 'גאומטריה רימנית.'),
    ],
  },
  {
    id: 'kovalevskaya',
    name: t11('Ковалевская', 'Kovalevskaya', 'Kowalewskaja', '科瓦列夫斯卡娅', 'Kovalevskaya', 'कोवालेवस्काया', 'كوفاليفسكايا', 'কোভালেভস্কায়া', 'Kovalevskaya', 'コワレフスカヤ', 'קובלבסקה'),
    iso: 'ru',
    century: 19,
    tier: 'medium',
    wiki: 'Sofya Kovalevskaya',
    wikiFile: 'Sofja Wassiljewna Kowalewskaja 1880.jpg',
    facts: [
      t11('Первая женщина — профессор математики в Европе (Стокгольм).', 'First woman professor of mathematics in Europe (Stockholm).', 'Erste Mathematikprofessorin Europas (Stockholm).', '欧洲首位女数学教授（斯德哥尔摩）。', 'Primera catedrática de matemáticas en Europa (Estocolmo).', 'यूरोप की पहली महिला गणित प्रोफेसर (स्टॉकहोम)।', 'أول أستاذة رياضيات في أوروبا (ستوكهولم).', 'ইউরোপের প্রথম নারী গণিত অধ্যাপক (স্টকহোম)।', 'Primeira professora de matemática na Europa (Estocolmo).', '欧州初の女性数学教授（ストックホルム）。', 'הפרופסורית הראשונה למתמטיקה באירופה (שטוקהולם).'),
      t11('Задача вращения твёрдого тела.', 'Rotation of a rigid body.', 'Kreiselproblem.', '刚体旋转问题。', 'Rotación de un sólido rígido.', 'दृढ़ पिंड का घूर्णन।', 'دوران الجسم الصلب.', 'কঠিন বস্তুর ঘূর্ণন।', 'Rotação de um corpo rígido.', '剛体の回転。', 'סיבוב גוף קשיח.'),
    ],
  },
  {
    id: 'ramanujan',
    name: t11('Рамануджан', 'Ramanujan', 'Ramanujan', '拉马努金', 'Ramanujan', 'रामानुजन', 'رامانوجان', 'রামানুজন', 'Ramanujan', 'ラマヌジャン', 'רמנוג׳ן'),
    iso: 'in',
    century: 20,
    tier: 'medium',
    wiki: 'Srinivasa Ramanujan',
    wikiFile: 'Srinivasa Ramanujan - OPC - 1.jpg',
    facts: [
      t11('Число 1729 — такси Рамануджана–Харди.', '1729, the Hardy–Ramanujan taxi number.', '1729, die Taxi-Zahl Hardy–Ramanujan.', '1729，哈代–拉马努金出租车数。', '1729, el número del taxi Hardy–Ramanujan.', '1729, हार्डी–रामानुजन टैक्सी संख्या।', '1729 رقم سيارة هاردي–رامانوجان.', '1729, হার্ডি–রামানুজন ট্যাক্সি সংখ্যা।', '1729, o número do táxi Hardy–Ramanujan.', '1729、ハーディ＝ラマヌジャン数。', '1729, מספר המונית של הארדי–רמנוג׳ן.'),
      t11('Кембридж, совместно с Харди.', 'Cambridge, with Hardy.', 'Cambridge, mit Hardy.', '剑桥，与哈代合作。', 'Cambridge, con Hardy.', 'कैम्ब्रिज, हार्डी के साथ।', 'كامبريدج مع هاردي.', 'কেমব্রিজ, হার্ডির সঙ্গে।', 'Cambridge, com Hardy.', 'ケンブリッジ、ハーディと。', 'קיימברידג׳, עם הארדי.'),
    ],
  },
  {
    id: 'lovelace',
    name: t11('Лавлейс', 'Lovelace', 'Lovelace', '洛夫莱斯', 'Lovelace', 'लवलेस', 'لوفليس', 'লাভলেস', 'Lovelace', 'ラヴレス', 'לאבלייס'),
    iso: 'gb',
    century: 19,
    tier: 'medium',
    wiki: 'Ada Lovelace',
    wikiFile: 'Ada Lovelace portrait.jpg',
    facts: [
      t11('Комментарии к аналитической машине Бэббиджа.', 'Notes on Babbage’s Analytical Engine.', 'Notizen zur Analytical Engine Babbages.', '巴贝奇分析机注释。', 'Notas sobre la máquina analítica de Babbage.', 'बैबेज की विश्लेषणी मशीन पर टिप्पणियाँ।', 'تعليقات على المحرك التحليلي لبابيج.', 'ব্যাবেজের অ্যানালিটিক্যাল ইঞ্জিনের নোট।', 'Notas sobre a máquina analítica de Babbage.', 'バベッジ解析機関への注釈。', 'הערות על המנוע האנליטי של באבג׳.'),
      t11('Часто называют первым программистом.', 'Often called the first programmer.', 'Oft als erste Programmiererin bezeichnet.', '常被称为第一位程序员。', 'A menudo llamada la primera programadora.', 'अक्सर पहली प्रोग्रामर कही जाती हैं।', 'تُعد غالباً أول مبرمجة.', 'প্রায়ই প্রথম প্রোগ্রামার বলা হয়।', 'Muitas vezes dita a primeira programadora.', '最初のプログラマと呼ばれることが多い。', 'לעיתים מכונה המתכנתת הראשונה.'),
    ],
  },
  {
    id: 'hilbert',
    name: t11('Гильберт', 'Hilbert', 'Hilbert', '希尔伯特', 'Hilbert', 'हिल्बर्ट', 'هلبرت', 'হিলবার্ট', 'Hilbert', 'ヒルベルト', 'הילברט'),
    iso: 'de',
    century: 20,
    tier: 'hard',
    wiki: 'David Hilbert',
    wikiFile: 'Hilbert.jpg',
    facts: [
      t11('23 проблемы 1900 года.', '23 problems of 1900.', '23 Probleme von 1900.', '1900 年的 23 个问题。', '23 problemas de 1900.', '1900 की 23 समस्याएँ।', '23 مسألة عام 1900.', '১৯০০-এর ২৩ সমস্যা।', '23 problemas de 1900.', '1900年の23の問題。', '23 הבעיות של 1900.'),
      t11('Гильбертовы пространства.', 'Hilbert spaces.', 'Hilberträume.', '希尔伯特空间。', 'Espacios de Hilbert.', 'हिल्बर्ट समष्टि।', 'فضاءات هلبرت.', 'হিলবার্ট স্পেস।', 'Espaços de Hilbert.', 'ヒルベルト空間。', 'מרחבי הילברט.'),
    ],
  },
  {
    id: 'poincare',
    name: t11('Пуанкаре', 'Poincaré', 'Poincaré', '庞加莱', 'Poincaré', 'पॉंकारे', 'بوانكاريه', 'পোয়াঁকারে', 'Poincaré', 'ポアンカレ', 'פואנקרה'),
    iso: 'fr',
    century: 20,
    tier: 'hard',
    wiki: 'Henri Poincaré',
    wikiFile: 'Henri Poincaré-2.jpg',
    facts: [
      t11('Гипотеза Пуанкаре (доказана Перельманом).', 'Poincaré conjecture (proved by Perelman).', 'Poincaré-Vermutung (von Perelman bewiesen).', '庞加莱猜想（佩雷尔曼证明）。', 'Conjetura de Poincaré (demostrada por Perelmán).', 'पॉंकारे अनुमान (पेरेलमान ने सिद्ध)।', 'حدسية بوانكاريه (أثبتها بيرلمان).', 'পোয়াঁকারে অনুমান (পেরেলমান প্রমাণ করেন)।', 'Conjectura de Poincaré (provada por Perelman).', 'ポアンカレ予想（ペレルマンが証明）。', 'השערת פואנקרה (הוכחה בידי פרלמן).'),
      t11('Качественная теория дифференциальных уравнений.', 'Qualitative theory of differential equations.', 'Qualitative Theorie der Differenzialgleichungen.', '微分方程定性理论。', 'Teoría cualitativa de las ecuaciones diferenciales.', 'अवकल समीकरणों का गुणात्मक सिद्धांत।', 'النظرية النوعية للمعادلات التفاضلية.', 'অন্তরক সমীকরণের গুণগত তত্ত্ব।', 'Teoria qualitativa das equações diferenciais.', '微分方程式の定性理論。', 'תורה איכותית של משוואות דיפרנציאליות.'),
    ],
  },
  {
    id: 'cantor',
    name: t11('Кантор', 'Cantor', 'Cantor', '康托尔', 'Cantor', 'कैंटर', 'كانتور', 'কান্টর', 'Cantor', 'カントール', 'קנטור'),
    iso: 'de',
    century: 19,
    tier: 'hard',
    wiki: 'Georg Cantor',
    wikiFile: 'Georg Cantor2.jpg',
    facts: [
      t11('Теория множеств; мощности бесконечностей.', 'Set theory; cardinalities of infinities.', 'Mengenlehre; Mächtigkeiten des Unendlichen.', '集合论；无穷的基数。', 'Teoría de conjuntos; cardinales del infinito.', 'समुच्चय सिद्धांत; अनंत की गणनीयता।', 'نظرية المجموعات وقدرات اللانهاية.', 'সেট তত্ত্ব; অসীমের মূলত্ব।', 'Teoria dos conjuntos; cardinalidades do infinito.', '集合論、無限の濃度。', 'תורת הקבוצות; עוצמות האינסוף.'),
      t11('Диагональный аргумент.', 'Diagonal argument.', 'Diagonalargument.', '对角线论证。', 'Argumento diagonal.', 'विकर्ण युक्ति।', 'الحجة القطرية.', 'তির্যক যুক্তি।', 'Argumento diagonal.', '対角線論法。', 'הטיעון האלכסוני.'),
    ],
  },
  {
    id: 'fermat',
    name: t11('Ферма', 'Fermat', 'Fermat', '费马', 'Fermat', 'फ़र्मा', 'فيرما', 'ফের্মা', 'Fermat', 'フェルマー', 'פרמה'),
    iso: 'fr',
    century: 17,
    tier: 'medium',
    wiki: 'Pierre de Fermat',
    wikiFile: 'Pierre de Fermat.jpg',
    facts: [
      t11('Великая теорема: xⁿ+yⁿ=zⁿ при n>2 не имеет решений.', 'Last theorem: no positive solutions to xⁿ+yⁿ=zⁿ for n>2.', 'Großer Satz: keine Lösungen von xⁿ+yⁿ=zⁿ für n>2.', '大定理：n>2 时 xⁿ+yⁿ=zⁿ 无正整数解。', 'Último teorema: no hay soluciones de xⁿ+yⁿ=zⁿ si n>2.', 'अंतिम प्रमेय: n>2 पर xⁿ+yⁿ=zⁿ का हल नहीं।', 'المبرهنة الأخيرة: لا حلول لـ xⁿ+yⁿ=zⁿ إذا n>2.', 'শেষ উপপাদ্য: n>2 হলে xⁿ+yⁿ=zⁿ-এর সমাধান নেই।', 'Último teorema: sem soluções de xⁿ+yⁿ=zⁿ para n>2.', '最終定理：n>2 で xⁿ+yⁿ=zⁿ に正の解なし。', 'המשפט האחרון: אין פתרונות ל-xⁿ+yⁿ=zⁿ כאשר n>2.'),
      t11('Тулуза, теория чисел.', 'Toulouse, number theory.', 'Toulouse, Zahlentheorie.', '图卢兹，数论。', 'Toulouse, teoría de números.', 'टूलूज़, संख्या सिद्धांत।', 'تولوز ونظرية الأعداد.', 'টুলুজ, সংখ্যাতত্ত্ব।', 'Toulouse, teoria dos números.', 'トゥールーズ、数論。', 'טולוז, תורת המספרים.'),
    ],
  },
  {
    id: 'noether',
    name: t11('Нётер', 'Noether', 'Noether', '诺特', 'Noether', 'नॉएथर', 'نوتر', 'নয়েথার', 'Noether', 'ネーター', 'נתר'),
    iso: 'de',
    century: 20,
    tier: 'hard',
    wiki: 'Emmy Noether',
    facts: [
      t11('Теорема: симметрии ↔ законы сохранения.', 'Theorem: symmetries ↔ conservation laws.', 'Satz: Symmetrien ↔ Erhaltungssätze.', '定理：对称性对应守恒律。', 'Teorema: simetrías ↔ leyes de conservación.', 'प्रमेय: सममिति ↔ संरक्षण नियम।', 'مبرهنة: التناظرات ↔ قوانين الحفظ.', 'উপপাদ্য: প্রতিসাম্য ↔ সংরক্ষণ সূত্র।', 'Teorema: simetrias ↔ leis de conservação.', '定理：対称性と保存則。', 'משפט: סימטריות ↔ חוקי שימור.'),
      t11('Гёттинген, абстрактная алгебра.', 'Göttingen, abstract algebra.', 'Göttingen, abstrakte Algebra.', '哥廷根，抽象代数。', 'Gotinga, álgebra abstracta.', 'गोटिंगेन, अमूर्त बीजगणित।', 'غوتنغن والجبر المجرد.', 'গেটিঙেন, বিমূর্ত বীজগণিত।', 'Gotinga, álgebra abstrata.', 'ゲッティンゲン、抽象代数。', 'גטינגן, אלגברה מופשטת.'),
    ],
  },
  {
    id: 'ramanujan',
    name: t11('Рамануджан', 'Ramanujan', 'Ramanujan', '拉马努金', 'Ramanujan', 'रामानुजन', 'رامانوجان', 'রামানুজন', 'Ramanujan', 'ラマヌジャン', 'רמנוג׳ן'),
    iso: 'in',
    century: 20,
    tier: 'medium',
    wiki: 'Srinivasa Ramanujan',
    facts: [
      t11('Самоучка из Мадраса, формулы для π и разбиений.', 'Self-taught from Madras; formulas for π and partitions.', 'Autodidakt aus Madras; Formeln für π und Partitionen.', '马德拉斯自学成才；π 与分拆公式。', 'Autodidacta de Madrás; fórmulas para π y particiones.', 'मद्रास के स्वशिक्षित; π और विभाजन सूत्र।', 'عصامي من مدراس؛ صيغ π والتجزئة.', 'মাদ্রাজের স্বশিক্ষিত; π ও বিভাজন সূত্র।', 'Autodidata de Madras; fórmulas para π e partições.', 'マドラスの独学者。円周率と分割の公式。', 'אוטודידקט ממדארס; נוסחאות ל-π ולחלוקות.'),
      t11('Переписка с Харди, Кембридж.', 'Correspondence with Hardy; Cambridge.', 'Briefwechsel mit Hardy; Cambridge.', '与哈代通信，剑桥。', 'Correspondencia con Hardy; Cambridge.', 'हार्डी से पत्र, कैम्ब्रिज।', 'مراسلات هاردي وكامبريدج.', 'হার্ডির চিঠি, কেমব্রিজ।', 'Correspondência com Hardy; Cambridge.', 'ハーディとの文通、ケンブリッジ。', 'התכתבות עם הארדי, קיימברידג׳.'),
    ],
  },
  {
    id: 'lovelace',
    name: t11('Лавлейс', 'Lovelace', 'Lovelace', '洛夫莱斯', 'Lovelace', 'लवलेस', 'لفليس', 'লাভলেস', 'Lovelace', 'ラヴレス', 'לאבלייס'),
    iso: 'gb',
    century: 19,
    tier: 'medium',
    wiki: 'Ada Lovelace',
    facts: [
      t11('Заметки к аналитической машине Бэббиджа.', 'Notes on Babbage’s Analytical Engine.', 'Notizen zur Analytical Engine Babbages.', '巴贝奇分析机注释。', 'Notas sobre la máquina analítica de Babbage.', 'बैबेज विश्लेषण इंजन पर टिप्पणियाँ।', 'ملاحظات على المحرك التحليلي لبابيج.', 'ব্যাবেজের অ্যানালিটিক্যাল ইঞ্জিনের টীকা।', 'Notas sobre a máquina analítica de Babbage.', 'バベッジの解析機関への注釈。', 'הערות למנוע האנליטי של באבג׳.'),
      t11('Часто называют первым программистом.', 'Often called the first programmer.', 'Oft als erste Programmiererin genannt.', '常被称为第一位程序员。', 'A menudo llamada la primera programadora.', 'अक्सर पहली प्रोग्रामर कही जाती हैं।', 'تُدعى غالباً أول مبرمجة.', 'প্রায়ই প্রথম প্রোগ্রামার বলা হয়।', 'Muitas vezes chamada a primeira programadora.', '最初のプログラマと呼ばれることが多い。', 'לעיתים נחשבת למתכנתת הראשונה.'),
    ],
  },
  {
    id: 'turing',
    name: t11('Тьюринг', 'Turing', 'Turing', '图灵', 'Turing', 'ट्यूरिंग', 'تورنغ', 'টিউরিং', 'Turing', 'チューリング', 'טיורינג'),
    iso: 'gb',
    century: 20,
    tier: 'medium',
    wiki: 'Alan Turing',
    facts: [
      t11('Машина Тьюринга и тезис Чёрча — Тьюринга.', 'Turing machine and Church–Turing thesis.', 'Turingmaschine und Church-Turing-These.', '图灵机与丘奇—图灵论题。', 'Máquina de Turing y tesis de Church-Turing.', 'ट्यूरिंग मशीन और चर्च-ट्यूरिंग थीसिस।', 'آلة تورنغ وأطروحة تشورش-تورنغ.', 'টিউরিং মেশিন ও চার্চ-টিউরিং থিসিস।', 'Máquina de Turing e tese de Church-Turing.', 'チューリング機械とチャーチ＝チューリングのテーゼ。', 'מכונת טיורינג ומשפט צ׳רץ׳–טיורינג.'),
      t11('Расшифровка «Энигмы», вычислимость.', 'Enigma cryptanalysis; computability.', 'Enigma-Kryptoanalyse; Berechenbarkeit.', '破解恩尼格玛；可计算性。', 'Criptanálisis de Enigma; computabilidad.', 'एनिग्मा विश्लेषण; संगणनीयता।', 'فك إنجما والقابلية للحساب.', 'এনিগমা বিশ্লেষণ; গণনীয়তা।', 'Criptanálise de Enigma; computabilidade.', 'エニグマ解読と計算可能性。', 'פיצוח אניגמה; כריעות.'),
    ],
  },
]

const THEOREMS: Array<{ id: string; name: L11; authorId: string; tier: MathTier }> = [
  { id: 'th-pyth', authorId: 'pythagoras', tier: 'easy', name: t11('теорема Пифагора', 'Pythagorean theorem', 'Satz des Pythagoras', '勾股定理', 'teorema de Pitágoras', 'पाइथागोरस प्रमेय', 'مبرهنة فيثاغورس', 'পিথাগোরাসের উপপাদ্য', 'teorema de Pitágoras', 'ピタゴラスの定理', 'משפט פיתגורס') },
  { id: 'th-fermat', authorId: 'fermat', tier: 'medium', name: t11('великая теорема Ферма', 'Fermat’s Last Theorem', 'großer Satz von Fermat', '费马大定理', 'último teorema de Fermat', 'फ़र्मा का अंतिम प्रमेय', 'مبرهنة فيرما الأخيرة', 'ফের্মার শেষ উপপাদ্য', 'último teorema de Fermat', 'フェルマーの最終定理', 'המשפט האחרון של פרמה') },
  { id: 'th-euclid', authorId: 'euclid', tier: 'easy', name: t11('алгоритм Евклида', 'Euclidean algorithm', 'euklidischer Algorithmus', '欧几里得算法', 'algoritmo de Euclides', 'यूक्लिडीय एल्गोरिथम', 'خوارزمية إقليدس', 'ইউক্লিডীয় অ্যালগরিদম', 'algoritmo de Euclides', 'ユークリッドの互除法', 'האלגוריתם של אוקלידס') },
  { id: 'th-euler', authorId: 'euler', tier: 'medium', name: t11('тождество Эйлера', 'Euler’s identity', 'eulersche Identität', '欧拉恒等式', 'identidad de Euler', 'आयलर तत्समक', 'متطابقة أويلر', 'ইউলারের অভেদ', 'identidade de Euler', 'オイラーの等式', 'זהות אוילר') },
  { id: 'th-gauss', authorId: 'gauss', tier: 'hard', name: t11('основная теорема алгебры', 'fundamental theorem of algebra', 'Fundamentalsatz der Algebra', '代数基本定理', 'teorema fundamental del álgebra', 'बीजगणित का मूल प्रमेय', 'المبرهنة الأساسية في الجبر', 'বীজগণিতের মৌলিক উপপাদ্য', 'teorema fundamental da álgebra', '代数学の基本定理', 'המשפט היסודי של האלגברה') },
  { id: 'th-newton', authorId: 'newton', tier: 'medium', name: t11('бином Ньютона', 'binomial theorem', 'binomischer Lehrsatz', '二项式定理', 'teorema del binomio', 'द्विपद प्रमेय', 'مبرهنة ذات الحدين', 'দ্বিপদী উপপাদ্য', 'teorema binomial', '二項定理', 'המשפט הבינומי') },
  { id: 'th-descartes', authorId: 'descartes', tier: 'easy', name: t11('декартовы координаты', 'Cartesian coordinates', 'kartesische Koordinaten', '笛卡尔坐标', 'coordenadas cartesianas', 'कार्तीय निर्देशांक', 'الإحداثيات الديكارتية', 'কার্তেসীয় স্থানাঙ্ক', 'coordenadas cartesianas', '直交座標', 'קואורדינטות קרטזיות') },
  { id: 'th-cantor', authorId: 'cantor', tier: 'hard', name: t11('диагональный аргумент Кантора', 'Cantor’s diagonal argument', 'Cantorsches Diagonalargument', '康托尔对角线法', 'argumento diagonal de Cantor', 'कैंटर विकर्ण युक्ति', 'الحجة القطرية لكانتور', 'কান্টরের তির্যক যুক্তি', 'argumento diagonal de Cantor', 'カントールの対角線論法', 'הטיעון האלכסוני של קנטור') },
  { id: 'th-noether', authorId: 'noether', tier: 'hard', name: t11('теорема Нётер', 'Noether’s theorem', 'Noether-Theorem', '诺特定理', 'teorema de Noether', 'नॉएथर प्रमेय', 'مبرهنة نوتر', 'নয়েথারের উপপাদ্য', 'teorema de Noether', 'ネーターの定理', 'משפט נתר') },
  { id: 'th-aljabr', authorId: 'khwarizmi', tier: 'medium', name: t11('алгебра (ал-джабр)', 'algebra (al-jabr)', 'Algebra (al-ğabr)', '代数（还原）', 'álgebra (al-jabr)', 'बीजगणित (अल-जब्र)', 'الجبر', 'বীজগণিত (আল-জাবর)', 'álgebra (al-jabr)', '代数学（アルジャブル）', 'אלגברה (אל-ג׳בר)') },
  { id: 'th-riemann', authorId: 'riemann', tier: 'hard', name: t11('гипотеза Римана', 'Riemann hypothesis', 'Riemannsche Vermutung', '黎曼猜想', 'hipótesis de Riemann', 'रीमान परिकल्पना', 'فرضية ريمان', 'রিমান অনুমান', 'hipótese de Riemann', 'リーマン予想', 'השערת רימן') },
  { id: 'th-poincare', authorId: 'poincare', tier: 'hard', name: t11('гипотеза Пуанкаре', 'Poincaré conjecture', 'Poincaré-Vermutung', '庞加莱猜想', 'conjetura de Poincaré', 'पॉंकारे अनुमान', 'حدسية بوانكاريه', 'পোয়াঁকারে অনুমান', 'conjectura de Poincaré', 'ポアンカレ予想', 'השערת פואנקרה') },
  { id: 'th-turing', authorId: 'turing', tier: 'medium', name: t11('машина Тьюринга', 'Turing machine', 'Turingmaschine', '图灵机', 'máquina de Turing', 'ट्यूरिंग मशीन', 'آلة تورنغ', 'টিউরিং মেশিন', 'máquina de Turing', 'チューリング機械', 'מכונת טיורינג') },
  { id: 'th-raman', authorId: 'ramanujan', tier: 'hard', name: t11('формулы Рамануджана для π', 'Ramanujan’s π series', 'Ramanujans π-Reihen', '拉马努金 π 级数', 'series de Ramanujan para π', 'रामानुजन π श्रेणी', 'متسلسلات رامانوجان لـ π', 'রামানুজনের π ধারা', 'séries de Ramanujan para π', 'ラマヌジャンの円周率級数', 'טורי π של רמנוג׳ן') },
]

function centuryLabel(n: number): L11 {
  const abs = Math.abs(n)
  return t11(
    n < 0 ? `${abs}-й в. до н. э.` : `${n}-й век`,
    n < 0 ? `${abs}th century BCE` : `${n}th century`,
    n < 0 ? `${abs}. Jh. v. Chr.` : `${n}. Jahrhundert`,
    n < 0 ? `前${abs}世纪` : `${n}世纪`,
    n < 0 ? `siglo ${abs} a. C.` : `siglo ${n}`,
    n < 0 ? `${abs}वीं सदी ईसा पूर्व` : `${n}वीं सदी`,
    n < 0 ? `القرن ${abs} ق.م` : `القرن ${n}`,
    n < 0 ? `খ্রিস্টপূর্ব ${abs} শতক` : `${n} শতক`,
    n < 0 ? `séc. ${abs} a.C.` : `século ${n}`,
    n < 0 ? `前${abs}世紀` : `${n}世紀`,
    n < 0 ? `המאה ה-${abs} לפנה״ס` : `המאה ה-${n}`,
  )
}

const ARITH: MathItem[] = [
  row('e1', 'exprToValue', 'easy', '6 × 7', '42'),
  row('e2', 'exprToValue', 'easy', '8 × 9', '72'),
  row('e3', 'exprToValue', 'easy', '12 + 15', '27'),
  row('e4', 'exprToValue', 'easy', '20 − 8', '12'),
  row('e5', 'exprToValue', 'easy', '9 × 4', '36'),
  row('e6', 'exprToValue', 'easy', '100 − 40', '60'),
  row('e7', 'exprToValue', 'easy', '5 × 5', '25'),
  row('e8', 'exprToValue', 'easy', '11 + 19', '30'),
  row('e9', 'exprToValue', 'medium', '12 × 12', '144'),
  row('e10', 'exprToValue', 'medium', '13 × 7', '91'),
  row('e11', 'exprToValue', 'medium', '15 × 8', '120'),
  row('e12', 'exprToValue', 'medium', '18 × 6', '108'),
  row('e13', 'exprToValue', 'medium', '16 × 9', '144', { key: '144b' }),
  row('e14', 'exprToValue', 'medium', '25 × 4', '100'),
  row('e15', 'exprToValue', 'hard', '23 × 17', '391'),
  row('e16', 'exprToValue', 'hard', '19 × 21', '399'),
  row('e17', 'exprToValue', 'hard', '24 × 25', '600'),
  row('e18', 'exprToValue', 'hard', '37 × 13', '481'),
  row('e19', 'exprToValue', 'hard', '48 × 12', '576'),
  row('e20', 'exprToValue', 'hard', '29 × 31', '899'),
]

const VALUE_EXPR: MathItem[] = ARITH.map((item) =>
  row(`v-${item.id}`, 'valueToExpr', item.tier, item.answer, item.prompt, { key: pickL(item.prompt, 'en') }),
)

const FRACTIONS: MathItem[] = [
  row('f1', 'fractionDecimal', 'easy', '1/2', '0.5'),
  row('f2', 'fractionDecimal', 'easy', '1/4', '0.25'),
  row('f3', 'fractionDecimal', 'easy', '3/4', '0.75'),
  row('f4', 'fractionDecimal', 'easy', '1/5', '0.2'),
  row('f5', 'fractionDecimal', 'easy', '2/5', '0.4'),
  row('f6', 'fractionDecimal', 'medium', '1/8', '0.125'),
  row('f7', 'fractionDecimal', 'medium', '3/8', '0.375'),
  row('f8', 'fractionDecimal', 'medium', '1/10', '0.1'),
  row('f9', 'fractionDecimal', 'medium', '9/10', '0.9'),
  row('f10', 'fractionDecimal', 'hard', '1/3', '0.333…'),
  row('f11', 'fractionDecimal', 'hard', '2/3', '0.666…'),
  row('f12', 'fractionDecimal', 'hard', '5/4', '1.25'),
  row('f13', 'fractionDecimal', 'hard', '7/2', '3.5'),
  row('fd1', 'fractionDecimal', 'easy', '0.5', '1/2'),
  row('fd2', 'fractionDecimal', 'easy', '0.25', '1/4'),
  row('fd3', 'fractionDecimal', 'medium', '0.2', '1/5'),
  row('fd4', 'fractionDecimal', 'hard', '1.25', '5/4'),
]

const PERCENTS: MathItem[] = [
  row('p1', 'percentToValue', 'easy', '10% × 50', '5'),
  row('p2', 'percentToValue', 'easy', '25% × 80', '20'),
  row('p3', 'percentToValue', 'easy', '50% × 90', '45'),
  row('p4', 'percentToValue', 'easy', '20% × 40', '8'),
  row('p5', 'percentToValue', 'medium', '15% × 200', '30'),
  row('p6', 'percentToValue', 'medium', '12% × 50', '6'),
  row('p7', 'percentToValue', 'medium', '5% × 80', '4'),
  row('p8', 'percentToValue', 'medium', '75% × 40', '30', { key: '30p' }),
  row('p9', 'percentToValue', 'hard', '18% × 250', '45', { key: '45p' }),
  row('p10', 'percentToValue', 'hard', '35% × 80', '28'),
  row('p11', 'percentToValue', 'hard', '2.5% × 200', '5', { key: '5p' }),
  row('p12', 'percentToValue', 'hard', '125% × 40', '50'),
]

const POWERS: MathItem[] = [
  row('w1', 'powerToValue', 'easy', '2³', '8'),
  row('w2', 'powerToValue', 'easy', '2⁵', '32'),
  row('w3', 'powerToValue', 'easy', '5²', '25'),
  row('w4', 'powerToValue', 'easy', '10³', '1000'),
  row('w5', 'powerToValue', 'easy', '√9', '3'),
  row('w6', 'powerToValue', 'easy', '√16', '4'),
  row('w7', 'powerToValue', 'medium', '2⁸', '256'),
  row('w8', 'powerToValue', 'medium', '2¹⁰', '1024'),
  row('w9', 'powerToValue', 'medium', '3⁴', '81'),
  row('w10', 'powerToValue', 'medium', '√144', '12'),
  row('w11', 'powerToValue', 'medium', '³√8', '2'),
  row('w12', 'powerToValue', 'medium', '³√27', '3', { key: '3c' }),
  row('w13', 'powerToValue', 'hard', '2¹²', '4096'),
  row('w14', 'powerToValue', 'hard', '5³', '125'),
  row('w15', 'powerToValue', 'hard', '√169', '13'),
  row('w16', 'powerToValue', 'hard', '10⁵', '100000'),
]

const ORDER: MathItem[] = [
  row('o1', 'orderOfOps', 'easy', '2 + 3 × 4', '14'),
  row('o2', 'orderOfOps', 'easy', '(2 + 3) × 4', '20'),
  row('o3', 'orderOfOps', 'easy', '10 − 6 ÷ 2', '7'),
  row('o4', 'orderOfOps', 'easy', '5 + 5 × 5', '30'),
  row('o5', 'orderOfOps', 'medium', '8 ÷ 2 × (2 + 2)', '16'),
  row('o6', 'orderOfOps', 'medium', '3² + 4²', '25'),
  row('o7', 'orderOfOps', 'medium', '1 + 2 × 3 + 4', '11'),
  row('o8', 'orderOfOps', 'medium', '2³ × 3', '24'),
  row('o9', 'orderOfOps', 'hard', '4 × 3² − 6', '30', { key: '30o' }),
  row('o10', 'orderOfOps', 'hard', '18 ÷ 3² + 1', '3'),
  row('o11', 'orderOfOps', 'hard', '(7 − 1)² ÷ 4', '9'),
  row('o12', 'orderOfOps', 'hard', '2 + 2³ × 2', '18'),
]

const ANGLES: MathItem[] = [15, 30, 45, 60, 89, 90, 91, 120, 135, 150, 180].map((deg) => {
  const kind = kindOfAngle(deg)
  const tier: MathTier = deg === 90 || deg === 180 || deg === 45 ? 'easy' : deg === 30 || deg === 60 || deg === 120 ? 'medium' : 'hard'
  return row(`a${deg}`, 'angleToKind', tier, `${deg}°`, ANGLE_KIND[kind], { key: kind })
})

const UNITS: MathItem[] = [
  row('u1', 'unitsConvert', 'easy', '1 km', '1000 m'),
  row('u2', 'unitsConvert', 'easy', '1 m', '100 cm'),
  row('u3', 'unitsConvert', 'easy', '1 kg', '1000 g'),
  row('u4', 'unitsConvert', 'easy', '1 L', '1000 mL'),
  row('u5', 'unitsConvert', 'medium', '1 h', '3600 s'),
  row('u6', 'unitsConvert', 'medium', '1 cm', '10 mm'),
  row('u7', 'unitsConvert', 'medium', '1 t', '1000 kg'),
  row('u8', 'unitsConvert', 'medium', '180°', 'π rad'),
  row('u9', 'unitsConvert', 'hard', '90°', 'π/2 rad'),
  row('u10', 'unitsConvert', 'hard', '1 m', '1000 mm', { key: '1000mm' }),
  row('u11', 'unitsConvert', 'hard', '1 km²', '1 000 000 m²'),
  row('u12', 'unitsConvert', 'hard', '1 ha', '10 000 m²'),
  row('u13', 'unitsConvert', 'easy', '2 km', '2000 m'),
  row('u14', 'unitsConvert', 'easy', '5 m', '500 cm'),
  row('u15', 'unitsConvert', 'medium', '3 kg', '3000 g'),
  row('u16', 'unitsConvert', 'medium', '2 h', '7200 s'),
  row('u17', 'unitsConvert', 'hard', '45°', 'π/4 rad'),
  row('u18', 'unitsConvert', 'hard', '1 cm³', '1 mL'),
]

const SI: MathItem[] = [
  row('si-k', 'siPrefixToFactor', 'easy', 'k', '10³'),
  row('si-M', 'siPrefixToFactor', 'easy', 'M', '10⁶'),
  row('si-m', 'siPrefixToFactor', 'easy', 'm', '10⁻³'),
  row('si-c', 'siPrefixToFactor', 'medium', 'c', '10⁻²'),
  row('si-G', 'siPrefixToFactor', 'medium', 'G', '10⁹'),
  row('si-n', 'siPrefixToFactor', 'medium', 'n', '10⁻⁹'),
  row('si-d', 'siPrefixToFactor', 'hard', 'd', '10⁻¹'),
  row('si-h', 'siPrefixToFactor', 'hard', 'h', '10²'),
  row('si-T', 'siPrefixToFactor', 'hard', 'T', '10¹²'),
  row('si-u', 'siPrefixToFactor', 'hard', 'μ', '10⁻⁶'),
  row('si-p', 'siPrefixToFactor', 'hard', 'p', '10⁻¹²'),
  row('si-f', 'siPrefixToFactor', 'hard', 'f', '10⁻¹⁵'),
  row('si-da', 'siPrefixToFactor', 'medium', 'da', '10¹'),
]

const CONSTANTS: MathItem[] = [
  row('c-pi', 'constantToValue', 'easy', 'π', '≈ 3.14'),
  row('c-e', 'constantToValue', 'medium', 'e', '≈ 2.72'),
  row('c-phi', 'constantToValue', 'hard', 'φ', '≈ 1.62'),
  row('c-sqrt2', 'constantToValue', 'medium', '√2', '≈ 1.41'),
  row('c-sqrt3', 'constantToValue', 'hard', '√3', '≈ 1.73'),
  row('c-0f', 'constantToValue', 'medium', '0!', '1'),
  row('c-i2', 'constantToValue', 'hard', 'i²', '−1'),
  row('c-2pi', 'constantToValue', 'easy', '2π', '≈ 6.28'),
  row('c-1f', 'constantToValue', 'easy', '1!', '1', { key: '1f' }),
  row('c-tau', 'constantToValue', 'hard', 'τ', '≈ 6.28', { key: 'tau' }),
  row('c-ln2', 'constantToValue', 'hard', 'ln 2', '≈ 0.69'),
  row('c-log2', 'constantToValue', 'medium', 'log₁₀ 2', '≈ 0.30'),
  row('c-2f', 'constantToValue', 'easy', '2!', '2'),
  row('c-3f', 'constantToValue', 'easy', '3!', '6'),
]

function shapeItems(): MathItem[] {
  const ids = Object.keys(SHAPE_NAMES) as MathShapeId[]
  const toName = ids.map((shape) =>
    row(`sn-${shape}`, 'shapeToName', SHAPE_TIERS[shape], shape, SHAPE_NAMES[shape], { shape, key: shape }),
  )
  const toShape = ids.map((shape) =>
    row(`ns-${shape}`, 'nameToShape', SHAPE_TIERS[shape], SHAPE_NAMES[shape], shape, { shape, key: shape }),
  )
  return [...toName, ...toShape]
}

function formulaItems(): MathItem[] {
  return FORMULAS.map((item) => row(`fm-${item.id}`, 'formulaToQuantity', item.tier, item.formula, item.qty, { key: item.id }))
}

function symbolItems(): MathItem[] {
  return SYMBOLS.map((item) => row(`sy-${item.id}`, 'symbolToMeaning', item.tier, item.glyph, item.meaning, { key: item.id }))
}

function personById(id: string): MathPerson | undefined {
  return MATH_PEOPLE.find((person) => person.id === id)
}

function peopleItems(): MathItem[] {
  const photo = MATH_PEOPLE.filter((person) => person.wikiFile).map((person) =>
    row(`ph-${person.id}`, 'mathPhotoToName', person.tier, person.name, person.name, {
      personId: person.id,
      wiki: person.wiki,
      wikiFile: person.wikiFile,
      iso: person.iso,
      key: person.id,
    }),
  )
  const facts = MATH_PEOPLE.map((person) =>
    row(`fa-${person.id}`, 'mathFactsToName', person.tier, person.facts[0] ?? person.name, person.name, {
      personId: person.id,
      wiki: person.wiki,
      wikiFile: person.wikiFile,
      iso: person.iso,
      facts: person.facts,
      key: person.id,
    }),
  )
  const place = MATH_PEOPLE.flatMap((person) => [
    row(`pc-${person.id}`, 'mathPersonToPlace', person.tier, person.name, person.iso.toUpperCase(), {
      personId: person.id,
      iso: person.iso,
      key: `c:${person.iso}`,
    }),
    row(`py-${person.id}`, 'mathPersonToPlace', person.tier, person.name, centuryLabel(person.century), {
      personId: person.id,
      iso: person.iso,
      key: `y:${person.century}`,
    }),
  ])
  const theorems = THEOREMS.map((item) => {
    const author = personById(item.authorId)
    return row(`th-${item.id}`, 'theoremToAuthor', item.tier, item.name, author?.name ?? item.authorId, {
      personId: item.authorId,
      wiki: author?.wiki,
      wikiFile: author?.wikiFile,
      iso: author?.iso,
      key: item.authorId,
    })
  })
  return [...photo, ...facts, ...place, ...theorems]
}

export const MATH_ITEMS: MathItem[] = [
  ...ARITH,
  ...VALUE_EXPR,
  ...FRACTIONS,
  ...PERCENTS,
  ...POWERS,
  ...ORDER,
  ...shapeItems(),
  ...ANGLES,
  ...formulaItems(),
  ...UNITS,
  ...symbolItems(),
  ...CONSTANTS,
  ...SI,
  ...peopleItems(),
]

const BY_ID = new Map(MATH_ITEMS.map((item) => [item.id, item]))
const LIVE = new Map<string, MathItem>()
const LIVE_KEY = 'un-flag-quiz-math-live'
let liveHydrated = false

function hydrateLive() {
  if (liveHydrated || typeof window === 'undefined') return
  liveHydrated = true
  try {
    const raw = localStorage.getItem(LIVE_KEY)
    if (!raw) return
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return
    for (const item of parsed) {
      if (!item || typeof item !== 'object') continue
      const row = item as MathItem
      if (typeof row.id === 'string' && typeof row.mode === 'string') LIVE.set(row.id, row)
    }
  } catch {
    /* ignore */
  }
}

export function rememberMathItem(item: MathItem) {
  hydrateLive()
  LIVE.set(item.id, item)
  if (typeof window === 'undefined') return
  try {
    const rows = [...LIVE.values()].slice(-500)
    localStorage.setItem(LIVE_KEY, JSON.stringify(rows))
  } catch {
    /* ignore */
  }
}

export function mathById(id: string): MathItem | undefined {
  hydrateLive()
  return LIVE.get(id) ?? BY_ID.get(id)
}

export function mathPersonOf(id: string): MathPerson | undefined {
  const item = mathById(id)
  if (item?.personId) return personById(item.personId)
  return personById(id)
}

export function mathCountry(item: MathItem): Country {
  const answerEn = pickL(typeof item.answer === 'string' && /^[A-Z]{2}$/.test(item.answer) ? item.prompt : item.answer, 'en')
  const answerRu = pickL(typeof item.answer === 'string' && /^[A-Z]{2}$/.test(item.answer) ? item.prompt : item.answer, 'ru')
  const generated = item.id.startsWith('mg-')
  return {
    iso: item.id,
    nameEn: generated ? pickL(item.answer, 'en') : typeof answerEn === 'string' ? answerEn : item.id,
    nameRu: generated ? pickL(item.prompt, 'en') : typeof answerRu === 'string' ? answerRu : item.id,
    region: 'europe',
    difficulty: item.tier === 'easy' ? 'easy' : 'hard',
  }
}

export function mathItemFromCountry(country: Country, mode: MathMode): MathItem {
  const existing = mathById(country.iso)
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

export function mathDisplayName(item: MathItem, lang: Lang): string {
  if (item.personId) return pickL(typeof item.answer === 'string' && item.answer.length === 2 ? item.prompt : item.answer, lang)
  if (item.mode === 'nameToShape') return pickL(item.prompt, lang)
  return pickL(item.answer, lang)
}

export function mathPromptOf(item: MathItem, lang: Lang): string {
  if (item.mode === 'mathFactsToName' && item.facts?.length) {
    return item.facts.map((fact) => pickL(fact, lang)).join('\n')
  }
  return pickL(item.prompt, lang)
}

export function mathAnswerOf(item: MathItem, lang: Lang): string {
  if (item.mode === 'mathPersonToPlace' && item.key.startsWith('c:') && item.iso) {
    return item.iso.toUpperCase()
  }
  return pickL(item.answer, lang)
}

export function mathItemsOf(mode: MathMode, difficulty?: 'easy' | 'medium' | 'hard'): MathItem[] {
  const pool = MATH_ITEMS.filter((item) => item.mode === mode)
  if (!difficulty) return pool
  const match = pool.filter((item) => item.tier === difficulty)
  if (match.length >= 4) return match
  if (difficulty === 'easy') return pool.filter((item) => item.tier !== 'hard')
  if (difficulty === 'hard') return pool.filter((item) => item.tier !== 'easy')
  return pool
}

export function mathWikis(): string[] {
  return MATH_PEOPLE.map((person) => person.wiki)
}
