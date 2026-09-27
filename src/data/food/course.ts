import { t11, type L11 } from '../math'
import { rawRecipe } from './recipe'

export const FOOD_COURSES = ['soup', 'stew', 'noodle', 'rice', 'dumpling', 'bread', 'salad', 'dessert', 'grill', 'fry'] as const
export type FoodCourse = (typeof FOOD_COURSES)[number]

const LABEL: Record<FoodCourse, L11> = {
  soup: t11('суп', 'soup', 'Suppe', '汤', 'sopa', 'सूप', 'حساء', 'স্যুপ', 'sopa', 'スープ', 'מרק'),
  stew: t11('тушёное', 'stew', 'Eintopf', '炖菜', 'guiso', 'स्टू', 'يخنة', 'স্টু', 'guisado', '煮込み', 'תבשיל'),
  noodle: t11('лапша', 'noodles', 'Nudeln', '面条', 'fideos', 'नूडल्स', 'نودلز', 'নুডলস', 'noodles', '麺', 'אטריות'),
  rice: t11('рис', 'rice dish', 'Reisgericht', '米饭', 'arroz', 'चावल का व्यंजन', 'طبق أرز', 'ভাতের পদ', 'arroz', 'ご飯もの', 'מנת אורז'),
  dumpling: t11('пельмени', 'dumpling', 'Teigtasche', '饺子', 'empanada', 'पकौड़ा', 'زلابية', 'ডাম্পলিং', 'pastel', '餃子', 'כיסון'),
  bread: t11('хлеб', 'bread', 'Brot', '面包', 'pan', 'रोटी', 'خبز', 'রুটি', 'pão', 'パン', 'לחם'),
  salad: t11('салат', 'salad', 'Salat', '沙拉', 'ensalada', 'सलाद', 'سلطة', 'সালাদ', 'salada', 'サラダ', 'סלט'),
  dessert: t11('десерт', 'dessert', 'Dessert', '甜点', 'postre', 'मिठाई', 'حلوى', 'মিষ্টি', 'sobremesa', 'デザート', 'קינוח'),
  grill: t11('гриль', 'grill', 'Grill', '烧烤', 'parrilla', 'ग्रिल', 'مشوي', 'গ্রিল', 'grelhado', 'グリル', 'גריל'),
  fry: t11('жареное', 'fried', 'Gebratenes', '煎炸', 'frito', 'तला', 'مقلي', 'ভাজা', 'frito', '揚げ物', 'מטוגן'),
}

const NOODLE = new Set(['noodle', 'pasta', 'riceNoodle', 'glassNoodle', 'vermicelli'])
const RICE = new Set(['rice', 'stickyRice', 'brokenRice'])
const MEAT = new Set([
  'beef', 'pork', 'porkBelly', 'lamb', 'chicken', 'duck', 'sausage', 'bacon', 'ham', 'veal', 'tuna', 'salmon',
  'octopus', 'mussel', 'clam', 'lobster', 'offal', 'heart', 'tripe', 'snail', 'anchovy', 'cod', 'fish', 'shrimp',
  'guanciale', 'chorizo',
])
const SWEET = new Set([
  'sugar', 'honey', 'chocolate', 'chocolateBar', 'cocoa', 'cocoaButter', 'mascarpone', 'ladyfinger', 'condensedMilk',
  'maple', 'palmSugar', 'toffee', 'vanilla', 'kirsch',
])
const DESSERT_ID =
  /(^|-)(cake|pie|cookie|brownie|gelato|pudding|halva|baklava|tiramisu|chocolate|donut|waffle|flan|churro|mousse|strudel|kunafa|gulab|laddu|barfi|mochi|dorayaki|taiyaki|macaron|brulee|pavlova|fudge|candy|cheesecake|souffle|panna|cannoli|eclair|profiterole|truffle|marzipan|nougat|lokum|delight|knafeh|basbousa|qatayef|tangyuan|dango|daifuku|castella|anmitsu|kakigori|bingsu|hotteok|mooncake|brigadeiro|dulce|kheer|jalebi|rasgulla|sandesh|halwa|lokma|loukoumades|meringue|lamington|beignet|sfogliatella|zeppole|bomboloni|sorbet|granita|semifreddo|affogato|zabaglione|crepe|clafoutis|madeleine|financier|cannele|kouign|palmier|churros|bunuelo|rosca|panettone|pandoro|stollen|lebkuchen|linzer|sacher|apfelstrudel|blondie|praline|brittle|kunefe|maamoul|ghriba|chebakia|makroud|luqaimat|imarti|rasmalai|modak|payasam|falooda|kulfi|manju|yokan|songpyeon|anpan|fraisier|millefeuille|sopapilla|alfajor|beijinho|quindim|turron|polvoron|ensaimada|pudim|mazamorra|suspiro|picarones|chocotorta|helado|cupcake|sundae|parfait|nata|custard|ice)(-|$)/

const COLD_OPS = new Set(['mix', 'toss', 'cure', 'chill', 'assemble', 'serve', 'finish', 'season', 'mash', 'fold', 'drain'])

export function foodCourseLabel(course: FoodCourse): L11 {
  return LABEL[course]
}

export function foodCourse(id: string): FoodCourse {
  const recipe = rawRecipe(id)
  const parts = recipe?.parts ?? []
  const steps = recipe?.steps ?? []
  const ids = new Set(parts.map((part) => part.id))
  const ops = new Set(steps.map((step) => step.op))
  const heaviest = [...parts].sort((a, b) => b.g - a.g)[0]?.id
  const total = parts.reduce((sum, part) => sum + part.g, 0) || 1
  const stock = parts
    .filter((part) => part.id.startsWith('stock') || part.id === 'dashi' || part.id === 'broth')
    .reduce((sum, part) => sum + part.g, 0)
  const sugar = parts.filter((part) => SWEET.has(part.id)).reduce((sum, part) => sum + part.g, 0)
  const hasMeat = [...ids].some((item) => MEAT.has(item))
  const sweetBake = sugar >= 40 && !hasMeat && (ops.has('bake') || ops.has('chill') || ops.has('whip') || ids.has('chocolate') || ids.has('mascarpone'))

  if (DESSERT_ID.test(id) || sweetBake || ops.has('custard') || ops.has('caramel')) return 'dessert'
  if (steps.some((step) => step.op === 'wrap') || id === 'gnocchi') return 'dumpling'
  if ([...ids].some((item) => NOODLE.has(item))) return 'noodle'
  if (stock / total >= 0.35 || /soup|broth|ramen|pho|borscht|tom-yum|miso|gazpacho|chowder|bisque/.test(id)) return 'soup'
  if ([...ids].some((item) => RICE.has(item)) && (heaviest != null && RICE.has(heaviest) || /rice|risotto|paella|biryani|pilaf|plov|congee|onigiri|bibimbap/.test(id))) {
    return 'rice'
  }
  if ((ids.has('flour') || ids.has('teff') || ids.has('yeast') || ids.has('sourdough')) && (ops.has('bake') || ops.has('rise') || ops.has('ferment')) && !hasMeat) {
    return 'bread'
  }
  if (ops.size > 0 && [...ops].every((op) => COLD_OPS.has(op))) return 'salad'
  if (ops.has('grill') || ops.has('roast')) return 'grill'
  if (ops.has('simmer') || ops.has('slow')) return 'stew'
  if (ops.has('fry') || ops.has('deep') || ops.has('sear') || ops.has('crisp')) return 'fry'
  if (ops.has('bake')) return 'bread'
  if ([...ids].some((item) => RICE.has(item))) return 'rice'
  if (/salad|slaw|tabbouleh|fattoush|olivier|nicoise|som-tam|gado-gado|sauerkraut|kimchi|hummus|pkhali|kartoffel/.test(id)) {
    return 'salad'
  }
  return 'stew'
}
