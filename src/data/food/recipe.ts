import type { Lang } from '../math'
import { t11, type L11, pickL } from '../math'
import { ING } from './ingredients'
import { RECIPE_LINES } from './recipeLines'

export type RecipePart = { id: string; g: number }

export type RecipeStep =
  | { op: string; ids: string[]; n?: number }
  | { op: 'wrap'; shell: string[]; fill: string[] }

export type RawRecipe = { parts: RecipePart[]; steps: RecipeStep[] }

const TIMED = new Set([
  'simmer',
  'bake',
  'soak',
  'rise',
  'slow',
  'chill',
  'cure',
  'marinate',
  'rest',
  'caramel',
])

export function parseRecipeBook(src: string): Record<string, RawRecipe> {
  const out: Record<string, RawRecipe> = {}
  for (const line of src.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const space = trimmed.indexOf(' ')
    if (space < 0) throw new Error(`recipe line has no body: ${trimmed}`)
    const id = trimmed.slice(0, space)
    const segments = trimmed
      .slice(space + 1)
      .split('|')
      .map((part) => part.trim())
      .filter(Boolean)
    if (segments.length < 2) throw new Error(`recipe ${id} needs ingredients and steps`)
    const parts = segments[0].split(/\s+/).map((token) => {
      const colon = token.lastIndexOf(':')
      if (colon <= 0) throw new Error(`recipe ${id} bad amount: ${token}`)
      const name = token.slice(0, colon)
      const g = Number(token.slice(colon + 1))
      if (!Number.isFinite(g) || g <= 0) throw new Error(`recipe ${id} bad grams: ${token}`)
      return { id: name, g }
    })
    const steps = segments.slice(1).map((segment) => parseStep(id, segment))
    if (out[id]) throw new Error(`duplicate recipe: ${id}`)
    out[id] = { parts, steps }
  }
  return out
}

function parseStep(dish: string, segment: string): RecipeStep {
  if (segment.startsWith('wrap ')) {
    const body = segment.slice(5)
    const cut = body.indexOf('>')
    if (cut < 0) throw new Error(`recipe ${dish} wrap needs >`)
    const shell = body.slice(0, cut).trim().split(/\s+/).filter(Boolean)
    const fill = body.slice(cut + 1).trim().split(/\s+/).filter(Boolean)
    if (shell.length === 0 || fill.length === 0) throw new Error(`recipe ${dish} empty wrap`)
    return { op: 'wrap', shell, fill }
  }
  const bits = segment.split(/\s+/).filter(Boolean)
  const head = bits[0]
  const colon = head.indexOf(':')
  if (colon > 0) {
    const op = head.slice(0, colon)
    const n = Number(head.slice(colon + 1))
    if (!TIMED.has(op) || !Number.isFinite(n) || n <= 0) throw new Error(`recipe ${dish} bad time: ${head}`)
    return { op, n, ids: bits.slice(1) }
  }
  if (TIMED.has(head)) throw new Error(`recipe ${dish} ${head} needs minutes`)
  return { op: head, ids: bits.slice(1) }
}

function joinList(lang: Lang, names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  if (lang === 'zh') {
    if (names.length === 2) return `${names[0]}和${names[1]}`
    return `${names.slice(0, -1).join('、')}和${names[names.length - 1]}`
  }
  if (lang === 'ja') return names.join('、')
  if (lang === 'ar') return names.join(' و')
  if (lang === 'he') return `${names.slice(0, -1).join(', ')} ו${names[names.length - 1]}`
  const and: Record<Lang, string> = {
    ru: 'и',
    en: 'and',
    de: 'und',
    zh: '',
    es: 'y',
    hi: 'और',
    ar: '',
    bn: 'এবং',
    pt: 'e',
    ja: '',
    he: '',
  }
  if (names.length === 2) return `${names[0]} ${and[lang]} ${names[1]}`
  return `${names.slice(0, -1).join(', ')} ${and[lang]} ${names[names.length - 1]}`
}

const STEP: Record<string, L11> = {
  poach: t11(
    'Сварите слепленные изделия в подсоленной воде, пока не всплывут.',
    'Boil the sealed dumplings in salted water until they float.',
    'Die zugedrückten Stücke in Salzwasser kochen, bis sie oben schwimmen.',
    '把捏好的饺子放进盐水煮到浮起。',
    'Cueza las piezas cerradas en agua con sal hasta que floten.',
    'बंद किए पकौड़ों को नमकीन पानी में तब तक उबालें जब तक वे ऊपर न आएँ।',
    'اسلق القطع المغلقة في ماء مملح حتى تطفو.',
    'বন্ধ করা পিস নুন জলে ভাসা পর্যন্ত সেদ্ধ করুন।',
    'Coza as peças fechadas em água com sal até flutuarem.',
    '閉じたものを塩水で浮くまでゆでる。',
    'בשלו את הכיסונים הסגורים במים מומלחים עד שהם צפים.',
  ),
  boil: t11(
    'В подсоленной воде доведите до готовности: {list}.',
    'Boil in salted water until cooked: {list}.',
    'In Salzwasser gar kochen: {list}.',
    '用盐水煮熟：{list}。',
    'Cueza en agua con sal hasta que esté hecho: {list}.',
    'नमकीन पानी में पकाएँ: {list}.',
    'اسلقه في ماء مملح حتى ينضج: {list}.',
    'নুন জলে সেদ্ধ করুন: {list}.',
    'Coza em água com sal até ficar pronto: {list}.',
    '塩水でゆでる：{list}。',
    'בשלו במים מומלחים עד שמוכן: {list}.',
  ),
  fry: t11(
    'Обжарьте на небольшом количестве масла: {list}.',
    'Fry in a little oil: {list}.',
    'In wenig Öl anbraten: {list}.',
    '用少许油煎：{list}。',
    'Fría con un poco de aceite: {list}.',
    'थोड़े तेल में भूनें: {list}.',
    'اقله بقليل من الزيت: {list}.',
    'অল্প তেলে ভাজুন: {list}.',
    'Frite em pouco óleo: {list}.',
    '少量の油で炒める：{list}。',
    'טגנו במעט שמן: {list}.',
  ),
  dry: t11(
    'Обжарьте на сухой сковороде, пока не вытопится жир: {list}.',
    'Cook in a dry pan until the fat renders: {list}.',
    'In der trockenen Pfanne braten, bis das Fett austritt: {list}.',
    '干锅煎到出油：{list}。',
    'Cocine en sartén seca hasta que suelte la grasa: {list}.',
    'सूखी कढ़ाई में तब तक पकाएँ जब तक चर्बी न पिघले: {list}.',
    'اطهه في مقلاة جافة حتى يذوب الدهن: {list}.',
    'শুকনো কড়াইয়ে চর্বি গলা পর্যন্ত রান্না করুন: {list}.',
    'Cozinhe numa frigideira seca até a gordura derreter: {list}.',
    '油が出るまで空の鍋で焼く：{list}。',
    'טגנו במחבת יבשה עד שהשומן נמס: {list}.',
  ),
  mix: t11(
    'Смешайте: {list}.',
    'Mix: {list}.',
    'Vermischen: {list}.',
    '混合：{list}。',
    'Mezcle: {list}.',
    'मिलाएँ: {list}.',
    'اخلط: {list}.',
    'মেশান: {list}.',
    'Misture: {list}.',
    '混ぜる：{list}。',
    'ערבבו: {list}.',
  ),
  simmer: t11(
    'Тушите {n} мин: {list}.',
    'Simmer for {n} minutes: {list}.',
    '{n} Minuten köcheln: {list}.',
    '小火煮 {n} 分钟：{list}。',
    'Cocine a fuego lento {n} min: {list}.',
    '{n} मिनट धीमी आँच पर पकाएँ: {list}.',
    'اتركه على نار هادئة {n} د: {list}.',
    '{n} মিনিট ধীরে রান্না করুন: {list}.',
    'Cozinhe em fogo brando {n} min: {list}.',
    '{n}分ことこと煮る：{list}。',
    'בשלו על אש קטנה {n} דקות: {list}.',
  ),
  bake: t11(
    'Выпекайте около {n} мин, пока не подрумянится.',
    'Bake about {n} minutes until browned.',
    'Etwa {n} Minuten backen, bis es Farbe hat.',
    '烤约 {n} 分钟至上色。',
    'Hornee unos {n} min hasta dorar.',
    'लगभग {n} मिनट बेक करें, जब तक रंग न आए।',
    'اخبزه نحو {n} د حتى يحمر.',
    'প্রায় {n} মিনিট বেক করুন, রং না আসা পর্যন্ত।',
    'Asse cerca de {n} min até dourar.',
    '約{n}分、色づくまで焼く。',
    'אפו כ-{n} דקות עד להשחמה.',
  ),
  grill: t11(
    'Жарьте на гриле до готовности: {list}.',
    'Grill until cooked: {list}.',
    'Grillen, bis es gar ist: {list}.',
    '烤至熟：{list}。',
    'Ase a la parrilla hasta que esté hecho: {list}.',
    'ग्रिल पर पकाएँ: {list}.',
    'اشوه حتى ينضج: {list}.',
    'গ্রিল করে সেদ্ধ করুন: {list}.',
    'Grelhe até ficar pronto: {list}.',
    '焼き上げる：{list}。',
    'צלו עד שמוכן: {list}.',
  ),
  steam: t11(
    'Готовьте на пару: {list}.',
    'Steam: {list}.',
    'Dämpfen: {list}.',
    '蒸：{list}。',
    'Cocine al vapor: {list}.',
    'भाप में पकाएँ: {list}.',
    'اطهه على البخار: {list}.',
    'ভাপে রান্না করুন: {list}.',
    'Cozinhe no vapor: {list}.',
    '蒸す：{list}。',
    'אדו: {list}.',
  ),
  soak: t11(
    'Замочите на {n} мин: {list}.',
    'Soak for {n} minutes: {list}.',
    '{n} Minuten einweichen: {list}.',
    '浸泡 {n} 分钟：{list}。',
    'Remoje {n} min: {list}.',
    '{n} मिनट भिगोएँ: {list}.',
    'انقعه {n} د: {list}.',
    '{n} মিনিট ভিজিয়ে রাখুন: {list}.',
    'Deixe de molho {n} min: {list}.',
    '{n}分浸す：{list}。',
    'השרו {n} דקות: {list}.',
  ),
  rise: t11(
    'Оставьте подходить {n} мин: {list}.',
    'Let it rise for {n} minutes: {list}.',
    '{n} Minuten gehen lassen: {list}.',
    '发酵 {n} 分钟：{list}。',
    'Deje levar {n} min: {list}.',
    '{n} मिनट फूलने दें: {list}.',
    'اتركه يختمر {n} د: {list}.',
    '{n} মিনিট ফুলতে দিন: {list}.',
    'Deixe levedar {n} min: {list}.',
    '{n}分発酵させる：{list}。',
    'תנו לתפוח {n} דקות: {list}.',
  ),
  knead: t11(
    'Замесите тесто: {list}.',
    'Knead a dough: {list}.',
    'Teig kneten: {list}.',
    '揉成面团：{list}。',
    'Amase una masa: {list}.',
    'आटा गूँथें: {list}.',
    'اعجن عجينة: {list}.',
    'ডো মাখুন: {list}.',
    'Amasse uma massa: {list}.',
    '生地をこねる：{list}。',
    'לושו בצק: {list}.',
  ),
  layer: t11(
    'Выложите слоями в этом порядке: {list}.',
    'Layer in this order: {list}.',
    'In dieser Reihenfolge schichten: {list}.',
    '按这个顺序铺层：{list}。',
    'Ponga en capas en este orden: {list}.',
    'इस क्रम में परतें लगाएँ: {list}.',
    'رصّه طبقات بهذا الترتيب: {list}.',
    'এই ক্রমে স্তর দিন: {list}.',
    'Disponha em camadas nesta ordem: {list}.',
    'この順に重ねる：{list}。',
    'סדרו בשכבות בסדר הזה: {list}.',
  ),
  wrap: t11(
    'Оболочка — {a}. Начинка — {b}. Слепите и защипните.',
    'Wrapper: {a}. Filling: {b}. Seal them shut.',
    'Hülle: {a}. Füllung: {b}. Zusammendrücken.',
    '皮是{a}。馅是{b}。捏紧。',
    'Masa: {a}. Relleno: {b}. Ciérrelos.',
    'आवरण: {a}. भरावन: {b}. बंद कर दें।',
    'العجينة: {a}. الحشوة: {b}. أغلِقها.',
    'আবরণ: {a}. ভরাট: {b}. বন্ধ করে দিন।',
    'Massa: {a}. Recheio: {b}. Feche bem.',
    '皮は{a}。具は{b}。閉じる。',
    'בצק: {a}. מילוי: {b}. סגרו היטב.',
  ),
  toss: t11(
    'Снимите с огня и смешайте: {list}.',
    'Take off the heat and toss: {list}.',
    'Vom Feuer nehmen und schwenken: {list}.',
    '离火拌匀：{list}。',
    'Retire del fuego y mezcle: {list}.',
    'आँच से हटाकर मिलाएँ: {list}.',
    'أبعده عن النار واخلطه: {list}.',
    'আঁচ থেকে নামিয়ে মেশান: {list}.',
    'Tire do lume e misture: {list}.',
    '火を止めて和える：{list}。',
    'הורידו מהאש וערבבו: {list}.',
  ),
  roast: t11(
    'Запеките до румяной корочки: {list}.',
    'Roast until browned: {list}.',
    'Braten, bis es braun ist: {list}.',
    '烤至上色：{list}。',
    'Ase hasta dorar: {list}.',
    'भूनें जब तक रंग न आए: {list}.',
    'اشوه حتى يحمر: {list}.',
    'রং না আসা পর্যন্ত রোস্ট করুন: {list}.',
    'Asse até dourar: {list}.',
    '色づくまでローストする：{list}。',
    'קלו עד להשחמה: {list}.',
  ),
  slow: t11(
    'Готовьте медленно {n} мин, пока не станет мягким: {list}.',
    'Cook slowly for {n} minutes until tender: {list}.',
    '{n} Minuten langsam garen, bis es weich ist: {list}.',
    '慢煮 {n} 分钟至软：{list}。',
    'Cocine despacio {n} min hasta que esté tierno: {list}.',
    '{n} मिनट धीरे पकाएँ जब तक नरम न हो: {list}.',
    'اطهه ببطء {n} د حتى يلين: {list}.',
    '{n} মিনিট ধীরে রান্না করুন, নরম না হওয়া পর্যন্ত: {list}.',
    'Cozinhe devagar {n} min até ficar macio: {list}.',
    '{n}分、柔らかくなるまで弱火で煮る：{list}。',
    'בשלו לאט {n} דקות עד שרך: {list}.',
  ),
  melt: t11(
    'Растопите на слабом огне: {list}.',
    'Melt over low heat: {list}.',
    'Bei kleiner Hitze schmelzen: {list}.',
    '小火融化：{list}。',
    'Funda a fuego lento: {list}.',
    'धीमी आँच पर पिघलाएँ: {list}.',
    'أذبه على نار هادئة: {list}.',
    'ধীরে গলিয়ে নিন: {list}.',
    'Derreta em fogo brando: {list}.',
    '弱火で溶かす：{list}。',
    'המסו על אש קטנה: {list}.',
  ),
  whisk: t11(
    'Взбейте: {list}.',
    'Whisk: {list}.',
    'Verquirlen: {list}.',
    '打匀：{list}。',
    'Bata: {list}.',
    'फेंटें: {list}.',
    'اخفق: {list}.',
    'ফেটান: {list}.',
    'Bata: {list}.',
    '泡立てる：{list}。',
    'הקציפו: {list}.',
  ),
  chill: t11(
    'Охладите {n} мин: {list}.',
    'Chill for {n} minutes: {list}.',
    '{n} Minuten kühlen: {list}.',
    '冷藏 {n} 分钟：{list}。',
    'Enfríe {n} min: {list}.',
    '{n} मिनट ठंडा करें: {list}.',
    'برّده {n} د: {list}.',
    '{n} মিনিট ঠান্ডা করুন: {list}.',
    'Leve à gelar {n} min: {list}.',
    '{n}分冷やす：{list}。',
    'קררו {n} דקות: {list}.',
  ),
  cure: t11(
    'Накройте и оставьте на {n} мин: {list}.',
    'Cover and leave for {n} minutes: {list}.',
    'Abdecken und {n} Minuten ziehen lassen: {list}.',
    '盖上静置 {n} 分钟：{list}。',
    'Tape y deje {n} min: {list}.',
    'ढककर {n} मिनट रखें: {list}.',
    'غطّه واتركه {n} د: {list}.',
    'ঢেকে {n} মিনিট রাখুন: {list}.',
    'Tape e deixe {n} min: {list}.',
    '覆って{n}分置く：{list}。',
    'כסו והשאירו {n} דקות: {list}.',
  ),
  blend: t11(
    'Пробейте до однородной массы: {list}.',
    'Blend until smooth: {list}.',
    'Pürieren, bis es glatt ist: {list}.',
    '打至顺滑：{list}。',
    'Triture hasta que quede liso: {list}.',
    'चिकना होने तक पीसें: {list}.',
    'اخلطه حتى ينعم: {list}.',
    'মসৃণ না হওয়া পর্যন্ত ব্লেন্ড করুন: {list}.',
    'Bata até ficar liso: {list}.',
    'なめらかになるまでつぶす：{list}。',
    'טרפו עד חלק: {list}.',
  ),
  deep: t11(
    'Обжарьте во фритюре до золотистого цвета: {list}.',
    'Deep-fry until golden: {list}.',
    'Ausbacken, bis es goldgelb ist: {list}.',
    '炸至金黄：{list}。',
    'Fría por inmersión hasta dorar: {list}.',
    'सुनहरा होने तक तलें: {list}.',
    'اقله غمرًا حتى يصبح ذهبيًا: {list}.',
    'সোনালি না হওয়া পর্যন্ত ডুবিয়ে ভাজুন: {list}.',
    'Frite por imersão até dourar: {list}.',
    '黄金色になるまで揚げる：{list}。',
    'טגנו בשמן עמוק עד זהוב: {list}.',
  ),
  crisp: t11(
    'Обваляйте в сухарях и обжарьте до корочки: {list}.',
    'Coat in breadcrumbs and fry until crisp: {list}.',
    'In Paniermehl wenden und knusprig braten: {list}.',
    '裹面包糠煎至酥脆：{list}。',
    'Pase por pan rallado y fría hasta que esté crujiente: {list}.',
    'ब्रेडक्रम्ब में लपेटकर कुरकुरा तलें: {list}.',
    'غطّه ببقسماط واقله حتى يقرمش: {list}.',
    'ব্রেডক্রাম্বে মুড়ে খাস্তা করে ভাজুন: {list}.',
    'Passe por pão ralado e frite até ficar crocante: {list}.',
    'パン粉をつけてカリッと揚げる：{list}。',
    'צפו בפירורי לחם וטגנו עד פריך: {list}.',
  ),
  marinate: t11(
    'Замаринуйте на {n} мин: {list}.',
    'Marinate for {n} minutes: {list}.',
    '{n} Minuten marinieren: {list}.',
    '腌 {n} 分钟：{list}。',
    'Marine {n} min: {list}.',
    '{n} मिनट मैरिनेट करें: {list}.',
    'تبّله {n} د: {list}.',
    '{n} মিনিট ম্যারিনেট করুন: {list}.',
    'Marine {n} min: {list}.',
    '{n}分漬け込む：{list}。',
    'השרו במרינדה {n} דקות: {list}.',
  ),
  reduce: t11(
    'Уварите соус: {list}.',
    'Reduce the sauce: {list}.',
    'Soße einkochen: {list}.',
    '收汁：{list}。',
    'Reduzca la salsa: {list}.',
    'सॉस गाढ़ा करें: {list}.',
    'اغلِ الصلصة حتى تثقل: {list}.',
    'সস ঘন করুন: {list}.',
    'Reduza o molho: {list}.',
    '煮詰める：{list}。',
    'צמצמו את הרוטב: {list}.',
  ),
  caramel: t11(
    'Нагрейте сахар {n} мин, пока он не станет коричневым.',
    'Heat the sugar for {n} minutes until it browns.',
    'Zucker {n} Minuten erhitzen, bis er braun ist.',
    '将糖加热 {n} 分钟至变色。',
    'Caliente el azúcar {n} min hasta que se dore.',
    'चीनी को {n} मिनट गर्म करें जब तक भूरी न हो।',
    'سخّن السكر {n} د حتى يتحمر.',
    'চিনি {n} মিনিট গরম করুন, বাদামি না হওয়া পর্যন্ত।',
    'Aqueça o açúcar {n} min até dourar.',
    '砂糖を{n}分、色づくまで熱する。',
    'חממו סוכר {n} דקות עד שמשחים.',
  ),
  ferment: t11(
    'Оставьте бродить: {list}.',
    'Leave to ferment: {list}.',
    'Gären lassen: {list}.',
    '发酵：{list}。',
    'Deje fermentar: {list}.',
    'खमीर उठने दें: {list}.',
    'اتركه يتخمر: {list}.',
    'গাঁজতে দিন: {list}.',
    'Deixe fermentar: {list}.',
    '発酵させる：{list}。',
    'תנו לתסוס: {list}.',
  ),
  serve: t11(
    'Подавайте с: {list}.',
    'Serve with: {list}.',
    'Dazu reichen: {list}.',
    '配着上：{list}。',
    'Sirva con: {list}.',
    'इसके साथ परोसें: {list}.',
    'قدّمه مع: {list}.',
    'এর সাথে পরিবেশন করুন: {list}.',
    'Sirva com: {list}.',
    '添える：{list}。',
    'הגישו עם: {list}.',
  ),
  finish: t11(
    'В конце вмешайте: {list}.',
    'Stir in at the end: {list}.',
    'Zum Schluss unterrühren: {list}.',
    '最后拌入：{list}。',
    'Incorpore al final: {list}.',
    'अंत में मिलाएँ: {list}.',
    'أضف في النهاية: {list}.',
    'শেষে মেশান: {list}.',
    'Junte no fim: {list}.',
    '最後に加える：{list}。',
    'בסוף ערבבו: {list}.',
  ),
  assemble: t11(
    'Соберите в этом порядке и сразу подавайте: {list}.',
    'Assemble in this order and serve at once: {list}.',
    'In dieser Reihenfolge anrichten und sofort servieren: {list}.',
    '按此顺序装盘，立刻上桌：{list}。',
    'Monte en este orden y sirva enseguida: {list}.',
    'इस क्रम में सजाकर तुरंत परोसें: {list}.',
    'ركّبه بهذا الترتيب وقدّمه فورًا: {list}.',
    'এই ক্রমে সাজিয়ে সঙ্গে সঙ্গে দিন: {list}.',
    'Monte nesta ordem e sirva logo: {list}.',
    'この順に盛り、すぐ出す：{list}。',
    'הרכיבו בסדר הזה והגישו מיד: {list}.',
  ),
  rest: t11(
    'Дайте отдохнуть {n} мин.',
    'Rest for {n} minutes.',
    '{n} Minuten ruhen lassen.',
    '静置 {n} 分钟。',
    'Deje reposar {n} min.',
    '{n} मिनट आराम दें।',
    'اتركه يرتاح {n} د.',
    '{n} মিনিট বিশ্রাম দিন।',
    'Deixe descansar {n} min.',
    '{n}分休ませる。',
    'תנו לנוח {n} דקות.',
  ),
  shape: t11(
    'Сформуйте: {list}.',
    'Shape: {list}.',
    'Formen: {list}.',
    '成型：{list}。',
    'Dé forma: {list}.',
    'आकार दें: {list}.',
    'شكّله: {list}.',
    'আকার দিন: {list}.',
    'Modele: {list}.',
    '形を作る：{list}。',
    'עצבו: {list}.',
  ),
  season: t11(
    'Посолите и приправьте: {list}.',
    'Season: {list}.',
    'Würzen: {list}.',
    '调味：{list}。',
    'Sazone: {list}.',
    'स्वादानुसार डालें: {list}.',
    'تبّل: {list}.',
    'স্বাদ দিন: {list}.',
    'Tempere: {list}.',
    '味をつける：{list}。',
    'תבלו: {list}.',
  ),
  drain: t11(
    'Слейте воду: {list}.',
    'Drain: {list}.',
    'Abgießen: {list}.',
    '沥干：{list}。',
    'Escurra: {list}.',
    'पानी निथारें: {list}.',
    'صفِّ الماء: {list}.',
    'জল ঝরিয়ে নিন: {list}.',
    'Escorra: {list}.',
    '湯を切る：{list}。',
    'סננו: {list}.',
  ),
  mash: t11(
    'Разомните: {list}.',
    'Mash: {list}.',
    'Zerdrücken: {list}.',
    '捣成泥：{list}。',
    'Triture: {list}.',
    'मैश करें: {list}.',
    'اهرسه: {list}.',
    'ম্যাশ করুন: {list}.',
    'Esmague: {list}.',
    'つぶす：{list}。',
    'מעכו: {list}.',
  ),
  sear: t11(
    'Быстро обжарьте до корочки: {list}.',
    'Sear until a crust forms: {list}.',
    'Scharf anbraten, bis eine Kruste entsteht: {list}.',
    '煎出焦面：{list}。',
    'Selle hasta que haga costra: {list}.',
    'परत पड़ने तक तेज़ आँच पर सेकें: {list}.',
    'حمّره حتى تتكون قشرة: {list}.',
    'খোসা না হওয়া পর্যন্ত তীব্র আঁচে ভাজুন: {list}.',
    'Sele até ganhar crosta: {list}.',
    '焼き色がつくまで強火で焼く：{list}。',
    'צרבו עד שנוצר קרום: {list}.',
  ),
  whip: t11(
    'Взбейте до устойчивых пиков: {list}.',
    'Whip to firm peaks: {list}.',
    'Zu festen Spitzen schlagen: {list}.',
    '打发至硬性发泡：{list}。',
    'Monte a punto de nieve: {list}.',
    'सख्त झाग तक फेंटें: {list}.',
    'اخفقه حتى تتكون قمم ثابتة: {list}.',
    'শক্ত ফেনা হওয়া পর্যন্ত ফেটান: {list}.',
    'Bata até picos firmes: {list}.',
    'ツノが立つまで泡立てる：{list}。',
    'הקציפו עד קצפת יציבה: {list}.',
  ),
  toast: t11(
    'Подсушите: {list}.',
    'Toast: {list}.',
    'Rösten: {list}.',
    '烤香：{list}。',
    'Tueste: {list}.',
    'सेकें: {list}.',
    'حمّصه: {list}.',
    'সেঁকে নিন: {list}.',
    'Torre: {list}.',
    '香ばしく焼く：{list}。',
    'קלו: {list}.',
  ),
  warm: t11(
    'Прогрейте, не доводя до кипения: {list}.',
    'Warm without boiling: {list}.',
    'Erwärmen, ohne zu kochen: {list}.',
    '加热但不要煮沸：{list}。',
    'Caliente sin hervir: {list}.',
    'उबाले बिना गरम करें: {list}.',
    'سخّنه دون غليان: {list}.',
    'ফোটানো ছাড়া গরম করুন: {list}.',
    'Aqueça sem ferver: {list}.',
    '沸騰させずに温める：{list}。',
    'חממו בלי להרתיח: {list}.',
  ),
  fold: t11(
    'Осторожно вмешайте: {list}.',
    'Fold in gently: {list}.',
    'Vorsichtig unterheben: {list}.',
    '轻轻拌入：{list}。',
    'Incorpore con cuidado: {list}.',
    'हल्के हाथ से मिलाएँ: {list}.',
    'أدخلها برفق: {list}.',
    'আলতো করে মেশান: {list}.',
    'Incorpore com cuidado: {list}.',
    'さっくり混ぜる：{list}。',
    'קפלו בעדינות: {list}.',
  ),
  glaze: t11(
    'Смажьте: {list}.',
    'Brush with: {list}.',
    'Bestreichen mit: {list}.',
    '刷上：{list}。',
    'Pinte con: {list}.',
    'इससे ब्रश करें: {list}.',
    'ادهن بـ: {list}.',
    'এতে ব্রাশ করুন: {list}.',
    'Pincele com: {list}.',
    '塗る：{list}。',
    'מרחו: {list}.',
  ),
  dissolve: t11(
    'Растворите: {list}.',
    'Dissolve: {list}.',
    'Auflösen: {list}.',
    '溶化：{list}。',
    'Disuelva: {list}.',
    'घोलें: {list}.',
    'ذوّب: {list}.',
    'গলিয়ে নিন: {list}.',
    'Dissolva: {list}.',
    '溶かす：{list}。',
    'המסו: {list}.',
  ),
  pound: t11(
    'Растолките в пюре: {list}.',
    'Pound to a mash: {list}.',
    'Zu Brei stampfen: {list}.',
    '捣成泥：{list}。',
    'Machaque hasta hacer puré: {list}.',
    'कूटकर पेस्ट बनाएँ: {list}.',
    'ادقّه حتى يصير هريسًا: {list}.',
    'পিষে পেস্ট করুন: {list}.',
    'Pile até virar puré: {list}.',
    'つぶしてペーストにする：{list}。',
    'כתשו למחית: {list}.',
  ),
  pickle: t11(
    'Посолите и оставьте кваситься: {list}.',
    'Salt and leave to ferment: {list}.',
    'Salzen und gären lassen: {list}.',
    '加盐发酵：{list}。',
    'Sale y deje fermentar: {list}.',
    'नमक डालकर खट्टा होने दें: {list}.',
    'ملّحه واتركه يتخمر: {list}.',
    'নুন দিয়ে গাঁজতে দিন: {list}.',
    'Salgue e deixe fermentar: {list}.',
    '塩をして発酵させる：{list}。',
    'המליחו והשאירו לתסוס: {list}.',
  ),
  batter: t11(
    'Обмакните в кляр и обжарьте: {list}.',
    'Dip in batter and fry: {list}.',
    'In Teig tauchen und ausbacken: {list}.',
    '裹面糊炸：{list}。',
    'Pase por rebozado y fría: {list}.',
    'बैटर में डुबोकर तलें: {list}.',
    'اغمسه في عجينة واقله: {list}.',
    'বেটারে ডুবিয়ে ভাজুন: {list}.',
    'Passe por polme e frite: {list}.',
    '衣をつけて揚げる：{list}。',
    'טבלו בבלילה וטגנו: {list}.',
  ),
  syrup: t11(
    'Сварите сироп: {list}.',
    'Boil a syrup: {list}.',
    'Sirup kochen: {list}.',
    '煮成糖浆：{list}。',
    'Haga un almíbar: {list}.',
    'चाशनी पकाएँ: {list}.',
    'اصنع قطرًا: {list}.',
    'সিরাপ বানান: {list}.',
    'Faça uma calda: {list}.',
    'シロップを煮る：{list}。',
    'בשלו סירופ: {list}.',
  ),
  custard: t11(
    'На слабом огне заварите крем, не давая закипеть: {list}.',
    'Cook a custard over low heat without boiling: {list}.',
    'Bei kleiner Hitze eine Creme kochen, ohne sie kochen zu lassen: {list}.',
    '小火煮成蛋奶糊，不要沸腾：{list}。',
    'Cueza una crema a fuego lento sin hervir: {list}.',
    'धीमी आँच पर कस्टर्ड पकाएँ, उबाले बिना: {list}.',
    'اطبخ الكاسترد على نار هادئة دون غليان: {list}.',
    'ধীরে কাস্টার্ড রান্না করুন, ফোটানো ছাড়া: {list}.',
    'Cozinhe um creme em fogo brando sem ferver: {list}.',
    '沸騰させず弱火でカスタードにする：{list}。',
    'בשלו קרם על אש קטנה בלי רתיחה: {list}.',
  ),
}

export function perKiloGrams(grams: number[]): number[] {
  const total = grams.reduce((sum, g) => sum + g, 0)
  if (total <= 0) return grams.map(() => 0)
  const rounded = grams.map((g) => Math.max(1, Math.round((g * 1000) / total)))
  let drift = rounded.reduce((sum, g) => sum + g, 0) - 1000
  const order = rounded
    .map((g, index) => ({ g, index }))
    .sort((a, b) => b.g - a.g)
    .map((row) => row.index)
  let guard = 0
  while (drift !== 0 && guard < 10000) {
    let moved = false
    for (const index of order) {
      if (drift === 0) break
      if (drift > 0 && rounded[index] > 1) {
        rounded[index] -= 1
        drift -= 1
        moved = true
      } else if (drift < 0) {
        rounded[index] += 1
        drift += 1
        moved = true
      }
    }
    if (!moved) break
    guard += 1
  }
  return rounded
}

export type ScaledRecipe = {
  rows: { name: string; g: number; perKg: number }[]
  steps: string[]
  total: number
}

const BOOK = parseRecipeBook(RECIPE_LINES)

export function recipeIds(): string[] {
  return Object.keys(BOOK)
}

export function rawRecipe(id: string): RawRecipe | undefined {
  return BOOK[id]
}

function names(lang: Lang, ids: string[]): string[] {
  return ids.map((id) => {
    const row = ING[id]
    if (!row) throw new Error(`unknown ingredient: ${id}`)
    return pickL(row, lang)
  })
}

export function scaledRecipe(id: string, lang: Lang): ScaledRecipe | null {
  const recipe = BOOK[id]
  if (!recipe) return null
  const kilos = perKiloGrams(recipe.parts.map((part) => part.g))
  const rows = recipe.parts.map((part, index) => ({
    name: names(lang, [part.id])[0],
    g: part.g,
    perKg: kilos[index],
  }))
  const steps = recipe.steps.map((step) => renderStep(step, lang))
  return {
    rows,
    steps,
    total: recipe.parts.reduce((sum, part) => sum + part.g, 0),
  }
}

function renderStep(step: RecipeStep, lang: Lang): string {
  const text = STEP[step.op]
  if (!text) throw new Error(`unknown step: ${step.op}`)
  let line = pickL(text, lang)
  if (step.op === 'wrap') {
    const wrap = step as { shell: string[]; fill: string[] }
    line = line
      .split('{a}')
      .join(joinList(lang, names(lang, wrap.shell)))
      .split('{b}')
      .join(joinList(lang, names(lang, wrap.fill)))
    return line
  }
  const timed = step as { ids: string[]; n?: number }
  const list = joinList(lang, names(lang, timed.ids))
  line = line.split('{list}').join(list)
  if (timed.n != null) line = line.split('{n}').join(String(timed.n))
  return line
}

export function assertRecipeBook(dishIds: string[]): string[] {
  const errors: string[] = []
  const known = new Set(Object.keys(ING))
  const seen = new Set<string>()
  for (const id of dishIds) {
    const recipe = BOOK[id]
    if (!recipe) {
      errors.push(`missing recipe: ${id}`)
      continue
    }
    seen.add(id)
    const partIds = new Set(recipe.parts.map((part) => part.id))
    for (const part of recipe.parts) {
      if (!known.has(part.id)) errors.push(`${id} unknown ingredient ${part.id}`)
    }
    if (recipe.steps.length < 2) errors.push(`${id} needs at least 2 steps`)
    for (const step of recipe.steps) {
      if (!STEP[step.op]) errors.push(`${id} unknown step ${step.op}`)
      const ids = step.op === 'wrap' ? [...step.shell, ...step.fill] : step.ids
      for (const item of ids) {
        if (!partIds.has(item)) errors.push(`${id} step uses ${item} not in the ingredient list`)
      }
    }
  }
  for (const id of Object.keys(BOOK)) {
    if (!seen.has(id)) errors.push(`recipe without a dish: ${id}`)
  }
  const kilos = perKiloGrams([100, 50, 25])
  if (kilos.reduce((sum, g) => sum + g, 0) !== 1000) errors.push('per-kilo scale does not sum to 1000')
  return errors
}
