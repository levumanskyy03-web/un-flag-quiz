#!/usr/bin/env node
/**
 * Build history cards for every polity / people named on the history snapshots.
 * Names come from historical-basemaps (NAME + SUBJECTO); facts from Wikidata.
 *
 * Output (read by the map + HistoryCard):
 *   public/maps/history/cards/index.json   language-neutral fields
 *   public/maps/history/cards/{lang}.json  names and labels per site language
 *
 * Run before `npm run history-maps` (the map build reads the kinds from here).
 * HTTP responses are cached in .cache/history-cards, so reruns are offline.
 */
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { YEARS, OUT, ISO2, mapId, loadYear } = require('./history-lib.cjs')

const LANGS = ['ru', 'en', 'de', 'zh', 'es', 'hi', 'ar', 'bn', 'pt', 'ja', 'he']
const LABEL_CHAIN = {
  en: ['en', 'mul'],
  ru: ['ru'],
  de: ['de', 'mul'],
  zh: ['zh', 'zh-hans', 'zh-cn', 'zh-hant', 'zh-tw'],
  es: ['es', 'mul'],
  hi: ['hi'],
  ar: ['ar'],
  bn: ['bn'],
  pt: ['pt', 'pt-br', 'mul'],
  ja: ['ja'],
  he: ['he'],
}
const WD_LANGS = [...new Set(Object.values(LABEL_CHAIN).flat())].join('|')
const CACHE = path.join(__dirname, '../.cache/history-cards')
const CARDS_OUT = path.join(OUT, 'cards')
const UA = 'un-flag-quiz-history-cards/1.0 (educational quiz; https://github.com/aourednik/historical-basemaps)'

/** Wrong or ambiguous basemap names → the English Wikipedia article for that era. */
const TITLE_OVERRIDES = {
  castille: 'Crown of Castile',
  'arago-n': 'Crown of Aragon',
  sard: 'Kingdom of Sardinia',
  'a-i-vie-t': 'Đại Việt',
  'kr-emp': 'Joseon',
  hre: 'Holy Roman Empire',
  'sa-mi': 'Sámi people',
  'tu-i-tonga-empire': 'Tuʻi Tonga Empire',
  pruss: 'Kingdom of Prussia',
  'lu-beck': 'Free City of Lübeck',
  papal: 'Papal States',
  florence: 'Republic of Florence',
  milan: 'Duchy of Milan',
  savoy: 'Duchy of Savoy',
  malacca: 'Malacca Sultanate',
  'japan-warring-states': 'Sengoku period',
  'hispaniola-spain': 'Captaincy General of Santo Domingo',
  'papua-new-guinea': 'Papuans',
  'australian-aboriginal-hunter-gatherers': 'Aboriginal Australians',
  'subarctic-forest-hunter-gatherers': 'Subarctic peoples',
  'savanna-hunter-gatherers': 'Hunter-gatherer',
  'andean-hunter-gatherers': 'Hunter-gatherer',
  'desert-hunter-gatherers': 'Hunter-gatherer',
  'amazon-hunter-gatherers': 'Indigenous peoples of South America',
  'west-african-cereal-farmers': 'History of West Africa',
  'bantu-peoples': 'Bantu peoples',
  'pampas-cultures': 'Indigenous peoples in Argentina',
  'plateau-fichers-and-hunter-gatherers': 'Indigenous peoples of the Northwest Plateau',
  'north-american-pacific-foraging-hunting-and-fishing-peoples': 'Indigenous peoples of the Pacific Northwest Coast',
  'patagonian-shellfish-and-marine-mammal-hunters': 'Chono people',
  'malaysian-islamic-states': 'Malay world',
  bella: 'Nuxalk',
  tlinoit: 'Tlingit',
  huron: 'Wyandot people',
  'england-and-ireland': 'Kingdom of England',
  chtimacha: 'Chitimacha',
  alabama: 'Alabama people',
  illinois: 'Illinois Confederation',
  serano: 'Serrano people',
  papago: 'Tohono Oʼodham',
  cahulia: 'Cahuilla',
  catawba: 'Catawba people',
  iowa: 'Iowa people',
  omaha: 'Omaha people',
  fox: 'Meskwaki',
  obiwa: 'Ojibwe',
  winebago: 'Ho-Chunk',
  miami: 'Miami people',
  yuma: 'Quechan',
  kamia: 'Kumeyaay',
  eyaq: 'Eyak people',
  suspiaq: 'Alutiiq',
  coahuiltec: 'Coahuiltecan people',
  muskogee: 'Muscogee',
  thompson: 'Nlaka\'pamux',
  kijkitat: 'Klickitat people',
  acaxea: 'Acaxee',
  'bukara-khanate': 'Khanate of Bukhara',
  crow: 'Crow people',
  natchez: 'Natchez people',
  tunica: 'Tunica people',
  wichita: 'Wichita people',
  susquehanna: 'Susquehannock',
  biloxi: 'Biloxi people',
  missouri: 'Missouria',
  kansa: 'Kaw people',
  teton: 'Lakota people',
  erie: 'Erie people',
  flathead: 'Bitterroot Salish',
  yakima: 'Yakama',
  blackfoot: 'Blackfoot Confederacy',
  hopie: 'Hopi people',
  pocumtuk: 'Pocumtuck',
  atakapa: 'Atakapa people',
  athabaskan: 'Athabaskan-speaking peoples',
  athabascan: 'Athabaskan-speaking peoples',
  tepehuane: 'Tepehuán people',
  yukagir: 'Yukaghir people',
  minang: 'Minang people',
  kariyarra: 'Kariyarra people',
  nyikina: 'Nyikina people',
  'wadi-wadi': 'Wadi Wadi people',
  mardu: 'Martu people',
  kija: 'Kija people',
  kalkadoon: 'Kalkadoon people',
  garawa: 'Garrwa',
  finnmark: 'Finnmark',
  ava: 'Toungoo dynasty',
  florida: 'Spanish Florida',
  'south-carolina': 'Province of Carolina',
  geneva: 'Republic of Geneva',
  arma: 'Pashalik of Timbuktu',
  air: 'Sultanate of Agadez',
  'guyana-netherlands': 'Surinam (Dutch colony)',
  sind: 'Kalhora dynasty',
  kanara: 'Canara',
  papu: 'Papuans',
  'm-ori': 'Māori people',
  'sultinate-of-zanzibar': 'Sultanate of Zanzibar',
  'senegal-fr': 'French Senegal',
  senegal: 'French Senegal',
  'spanish-guinea': 'Spanish Guinea',
  'harer-egypt': 'Emirate of Harar',
  'tukular-caliphate': 'Toucouleur Empire',
  'mesopotamia-gb': 'Mandatory Iraq',
  hail: 'Emirate of Jabal Shammar',
  'walbis-bay': 'Walvis Bay',
  'fezzan-frech-lybia': 'Fezzan-Ghadames Military Territory',
  antarctica: 'Antarctica',
  'cyraneica-uk-lybia': 'Emirate of Cyrenaica',
  'tripolitana-uk-lybia': 'British Military Administration (Libya)',
  'tokugawa-shogunate': 'Tokugawa shogunate',
  'laotian-states': 'Lan Xang',
  'franche-comt': 'Free County of Burgundy',
  cayenne: 'French Guiana',
  virginia: 'Colony of Virginia',
  'massachusetts-bay': 'Massachusetts Bay Colony',
  'post-ming-warlords': 'Southern Ming',
  ceylon: 'Kingdom of Kotte',
  'arakan-indian-princely-state': 'Kingdom of Mrauk U',
  trinidad: 'Spanish Trinidad',
  hohenzollern: 'Hohenzollern-Sigmaringen',
  zanzibar: 'Sultanate of Zanzibar',
  segu: 'Bambara Empire',
  louisiana: 'Louisiana (New France)',
  'barbados-uk': 'Colony of Barbados',
  'saint-kitts-and-nevis-uk': 'Saint Christopher (colony)',
  'british-american-colonies': 'Thirteen Colonies',
  baden: 'Margraviate of Baden',
  anhalt: 'Duchy of Anhalt',
  holstein: 'Duchy of Holstein',
  nejd: 'Emirate of Diriyah',
  goa: 'Portuguese India',
  assam: 'Ahom kingdom',
  'acadian-peninsula-uk': 'Nova Scotia (colony)',
  africa: 'Africa',
  malabar: 'Zamorin of Calicut',
  cochin: 'Kingdom of Cochin',
  mysore: 'Kingdom of Mysore',
  madras: 'Madras Presidency',
  golconda: 'Golconda Sultanate',
  'mecklenburg-schwerin': 'Duchy of Mecklenburg-Schwerin',
  thuringia: 'Ernestine duchies',
  quebec: 'Province of Quebec (1763–1791)',
  'anglo-egyptian-sudan': 'Anglo-Egyptian Sudan',
  'gold-coast': 'Gold Coast (British colony)',
  'sakhalin-ru': 'Sakhalin Oblast',
  'zaire-belgium': 'Belgian Congo',
  'mandatory-palestine-gb': 'Mandatory Palestine',
  'yemen-uk': 'Aden Protectorate',
  'korea-ussr': 'Soviet Civil Administration',
  'japan-usa': 'Occupation of Japan',
  'korea-usa': 'United States Army Military Government in Korea',
  'germany-soviet': 'Soviet occupation zone in Germany',
  'germany-uk': 'British occupation zone in Germany',
  'germany-usa': 'American occupation zone in Germany',
  'germany-france': 'French occupation zone in Germany',
  tonkin: 'Tonkin (French protectorate)',
  'white-russia': 'Belarusian People\'s Republic',
  'far-eastern-ssr': 'Far Eastern Republic',
  danzig: 'Free City of Danzig',
  hejaz: 'Kingdom of Hejaz',
  'libya-it': 'Italian Libya',
  'oman-british-raj': 'Muscat and Oman',
  britany: 'Duchy of Brittany',
  venice: 'Republic of Venice',
  genoa: 'Republic of Genoa',
  'mamluke-sultanate': 'Mamluk Sultanate',
  england: 'Kingdom of England',
  scotland: 'Kingdom of Scotland',
  navarre: 'Kingdom of Navarre',
  tuscany: 'Grand Duchy of Tuscany',
  naples: 'Kingdom of Naples',
  sicily: 'Kingdom of Sicily',
  'imperial-hungary': 'Royal Hungary',
  georgia: 'Kingdom of Georgia',
  bengal: 'Bengal Sultanate',
  orissa: 'Gajapati Kingdom',
  rajastan: 'Rajputana',
  laos: 'Lan Xang',
  mali: 'Mali Empire',
  songhai: 'Songhai Empire',
  benin: 'Kingdom of Benin',
  congo: 'Kingdom of Kongo',
  oyo: 'Oyo Empire',
  cambodia: 'Post-Angkor period',
  'ming-chinese-empire': 'Ming dynasty',
  'aztec-empire': 'Aztec Empire',
  'inca-empire': 'Inca Empire',
  'mixtec-empire': 'Mixtec',
  'maya-city-states': 'Maya civilization',
  'islamic-city-states': 'Swahili coast',
  'sinhalese-kingdoms': 'Kingdom of Kotte',
  'hausa-states': 'Hausa Kingdoms',
  'mossi-states': 'Mossi Kingdoms',
  akan: 'Akan people',
  'kanem-bornu': 'Bornu Empire',
  yemen: 'Zaydi imamate',
  muscat: 'Sultanate of Muscat',
  hadramaut: 'Kathiri',
  arabs: 'Arabs',
  'emirate-of-the-white-sheep-turks': 'Aq Qoyunlu',
  'islamic-states': 'Muslim world',
  'sultanate-of-delhi': 'Delhi Sultanate',
  'bahmani-kingdom': 'Bahmani Sultanate',
  vijayanagara: 'Vijayanagara Empire',
  arakan: 'Kingdom of Mrauk U',
  champa: 'Champa',
  'burmese-kingdoms': 'Ava Kingdom',
  pegu: 'Hanthawaddy kingdom',
  guanches: 'Guanches',
  'swiss-confederation': 'Old Swiss Confederacy',
  'teutonic-knights': 'State of the Teutonic Order',
  'poland-lithuania': 'Polish–Lithuanian union',
  'denmark-norway': 'Denmark–Norway',
  'kalmar-union': 'Kalmar Union',
  thule: 'Thule people',
  'chagatai-khanate': 'Chagatai Khanate',
  'oirat-confederation': 'Four Oirat',
  'timurid-emirates': 'Timurid Empire',
  bidar: 'Bidar Sultanate',
  bijapur: 'Bijapur Sultanate',
  ahmadnagar: 'Ahmadnagar Sultanate',
  golkonda: 'Qutb Shahi dynasty',
  ayutthaya: 'Ayutthaya Kingdom',
  siberians: 'Indigenous peoples of Siberia',
  'white-horde': 'White Horde',
  ryazan: 'Grand Duchy of Ryazan',
  'golden-horde': 'Golden Horde',
  'novgorod-seversky': 'Principality of Novgorod-Seversk',
  'grand-duchy-of-moscow': 'Grand Duchy of Moscow',
  'khanate-of-sibir': 'Khanate of Sibir',
  pskov: 'Pskov Republic',
  'crimean-khanate': 'Crimean Khanate',
  polynesians: 'Polynesians',
  maori: 'Māori people',
  madagascar: 'Madagascar',
  'merina-kingdom': 'Merina Kingdom',
  'zayyanid-caliphate': 'Kingdom of Tlemcen',
  'hafsid-caliphate': 'Hafsid dynasty',
  adal: 'Adal Sultanate',
  alwa: 'Alodia',
  funj: 'Funj Sultanate',
  mwenemutapa: 'Kingdom of Mutapa',
  ndongo: 'Kingdom of Ndongo',
  philippines: 'Barangay state',
  taiwan: 'Taiwanese indigenous peoples',
  'tsardom-of-muscovy': 'Tsardom of Russia',
  'dutch-republic': 'Dutch Republic',
  'polish-lithuanian-commonwealth': 'Polish–Lithuanian Commonwealth',
  'safavid-empire': 'Safavid Iran',
  'central-asian-khanates': 'Khanate of Bukhara',
  maratha: 'Maratha Confederacy',
  'mughal-empire': 'Mughal Empire',
  hanover: 'Electorate of Hanover',
  brandenburg: 'Margraviate of Brandenburg',
  lombardy: 'Duchy of Milan',
  modena: 'Duchy of Modena and Reggio',
  parma: 'Duchy of Parma',
  lucca: 'Republic of Lucca',
  massa: 'Duchy of Massa and Carrara',
  oldenburg: 'Duchy of Oldenburg',
  bremen: 'Free Hanseatic City of Bremen',
  hamburg: 'Free and Hanseatic City of Hamburg',
  'nogai-horde': 'Nogai Horde',
  'quazaq-khanate': 'Kazakh Khanate',
  'khiva-khanate': 'Khanate of Khiva',
  'lan-na': 'Lan Na',
  kandy: 'Kingdom of Kandy',
  lunda: 'Lunda Empire',
  luba: 'Luba Empire',
  rozwi: 'Rozvi Empire',
  wadai: 'Wadai Empire',
  darfur: 'Sultanate of Darfur',
  algiers: 'Regency of Algiers',
  tunis: 'Beylik of Tunis',
  tripolitania: 'Ottoman Tripolitania',
  cyrenaica: 'Cyrenaica',
  'mosquito-coast': 'Mosquito Coast',
  'delagoa-bay': 'Maputo Bay',
  'hindu-kingdoms': 'Hinduism in Indonesia',
  'cuba-spain': 'Captaincy General of Cuba',
  'santo-domingo-spain': 'Captaincy General of Santo Domingo',
  'jamaica-uk': 'Colony of Jamaica',
  'virgin-islands-danemark': 'Danish West Indies',
  belize: 'British Honduras',
  'dutch-east-indies': 'Dutch East India Company',
  'cape-colony': 'Dutch Cape Colony',
  'austrian-netherlands': 'Austrian Netherlands',
  'british-east-india-company': 'East India Company',
  india: 'Company rule in India',
}

const PEOPLE_NAME = /hunter|gatherer|peoples?\b|cultures?\b|farmers|fishers|fichers|hunters|herders|nomads|foragers|aboriginal|tribes\b/i
const PEOPLE_DESC =
  /\b(people|peoples|ethnic group|ethnic groups|tribe|tribes|tribal|indigenous|aboriginal|clan|culture|hunter-gatherers?|language group|nation of|first nation|native american)\b/i
const STATE_DESC =
  /\b(state|states|kingdom|empire|sultanate|khanate|caliphate|dynasty|republic|duchy|principality|emirate|confedera\w*|federation|polity|country|colony|colonial|territory|protectorate|province|viceroyalty|captaincy|chiefdom|horde|tsardom|realm|imamate|shogunate|monarchy|dominion|mandate|margraviate|electorate|bishopric|order|league|union|khaganate|beylik|vassal|possession|company|regency|eyalet|vilayet|city-state|island|islands|archipelago|civilization)\b/i
const BAD_DESC =
  /\b(film|album|song|band|novel|video game|television|footballer|politician|species|genus|given name|surname|family name|family$|asteroid|ship|disambiguation|painting|journal|magazine|company based|software|laws?|river|lake|canal|mountains?|mountain range|valley|municipality|suburb|village|town in|town and|city in|city and|capital city|county seat|county in|hurricane|election|museum|genocide|language|languages|dialect|railway|census|commune|plateau|falls|desert|strait|sermon|season|attacks?|battle|operation|invasion|incident|shooting|legislat\w*|assembly|parliament|landtag|team|relations|code|talks|deportation|terror|purchase|annexation|military operation|war between|cave|paintings|record)\b/i
const GENERIC_WORDS =
  /\b(the|of|and|people|peoples|kingdom|empire|sultanate|khanate|duchy|grand|republic|principality|colony|colonial|british|french|spanish|portuguese|dutch|danish|german|italian|belgian|captaincy|general|dynasty|state|states|nation|tribe|island|islands)\b/g

function lettersOnly(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(GENERIC_WORDS, ' ')
    .replace(/[^a-z]/g, '')
}

function bigrams(text) {
  const out = []
  for (let i = 0; i < text.length - 1; i += 1) out.push(text.slice(i, i + 2))
  return out
}

/** Dice coefficient on letter bigrams, ignoring generic polity words. */
function similar(a, b) {
  const x = bigrams(lettersOnly(a))
  const y = bigrams(lettersOnly(b))
  if (x.length === 0 || y.length === 0) return 0
  const pool = new Map()
  for (const g of y) pool.set(g, (pool.get(g) || 0) + 1)
  let common = 0
  for (const g of x) {
    const n = pool.get(g) || 0
    if (n > 0) {
      common += 1
      pool.set(g, n - 1)
    }
  }
  return (2 * common) / (x.length + y.length)
}
const BAD_CLASS = new Set(['Q5', 'Q4167410', 'Q13406463', 'Q11424', 'Q482994', 'Q7366', 'Q101352', 'Q202444'])

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getJson(url) {
  fs.mkdirSync(CACHE, { recursive: true })
  const key = crypto.createHash('md5').update(url).digest('hex')
  const file = path.join(CACHE, `${key}.json`)
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))
  for (let attempt = 0; attempt < 5; attempt += 1) {
    let res
    try {
      res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json' },
        signal: AbortSignal.timeout(30000),
      })
    } catch {
      await sleep(1500 * (attempt + 1))
      continue
    }
    if (res.status === 429 || res.status >= 500) {
      await sleep(1500 * (attempt + 1))
      continue
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`)
    const data = await res.json()
    fs.writeFileSync(file, JSON.stringify(data))
    await sleep(120)
    return data
  }
  throw new Error(`retry limit ${url}`)
}

function chunks(list, size) {
  const out = []
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size))
  return out
}

function cleanName(raw) {
  const m = String(raw).match(/^(.*?)\s*\(([^)]*)\)\s*$/)
  if (!m) return { base: String(raw).trim(), hint: '' }
  return { base: m[1].trim(), hint: m[2].replace(/Indian princely state/i, 'princely state').trim() }
}

/** title → { qid, disambiguation } via en.wikipedia (follows redirects). */
async function titlesToQids(titles) {
  const out = new Map()
  for (const batch of chunks([...new Set(titles)], 50)) {
    const url =
      'https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageprops&ppprop=wikibase_item|disambiguation&titles=' +
      encodeURIComponent(batch.join('|'))
    const data = await getJson(url)
    const q = data.query || {}
    const sources = new Map()
    const link = (from, to) => {
      if (!sources.has(to)) sources.set(to, [])
      sources.get(to).push(from)
    }
    for (const row of q.normalized || []) link(row.from, row.to)
    for (const row of q.redirects || []) link(row.from, row.to)
    for (const page of Object.values(q.pages || {})) {
      if (!page.pageprops || !page.pageprops.wikibase_item) continue
      const hit = {
        qid: page.pageprops.wikibase_item,
        title: page.title,
        disambiguation: 'disambiguation' in page.pageprops,
      }
      const queue = [page.title]
      const seen = new Set()
      while (queue.length) {
        const title = queue.shift()
        if (seen.has(title)) continue
        seen.add(title)
        out.set(title, hit)
        queue.push(...(sources.get(title) || []))
      }
    }
  }
  return out
}

async function searchTitles(query) {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srlimit=6&srnamespace=0&srsearch=' +
    encodeURIComponent(query)
  const data = await getJson(url)
  return ((data.query && data.query.search) || []).map((row) => row.title)
}

async function fetchEntities(qids, props) {
  const out = new Map()
  for (const batch of chunks([...new Set(qids)], 50)) {
    const url =
      `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=${props}&languages=${WD_LANGS}&ids=` +
      batch.join('|')
    const data = await getJson(url)
    for (const [id, entity] of Object.entries(data.entities || {})) {
      if (entity.missing !== undefined) continue
      out.set(id, entity)
      if (entity.id && entity.id !== id) out.set(entity.id, entity)
    }
  }
  return out
}

function claimValues(entity, prop) {
  const list = ((entity.claims || {})[prop] || []).filter((c) => c.rank !== 'deprecated' && c.mainsnak && c.mainsnak.datavalue)
  const preferred = list.filter((c) => c.rank === 'preferred')
  return (preferred.length > 0 ? [...preferred, ...list.filter((c) => c.rank !== 'preferred')] : list)
}

function itemIds(entity, prop, limit = 3) {
  const ids = []
  for (const c of claimValues(entity, prop)) {
    const v = c.mainsnak.datavalue.value
    if (v && v.id && !ids.includes(v.id)) ids.push(v.id)
    if (ids.length >= limit) break
  }
  return ids
}

function timeYear(value) {
  if (!value || !value.time) return undefined
  const m = String(value.time).match(/^([+-])(\d+)-/)
  if (!m) return undefined
  const year = Number(m[2]) * (m[1] === '-' ? -1 : 1)
  return Number.isFinite(year) ? year : undefined
}

function firstYear(entity, prop) {
  const years = claimValues(entity, prop)
    .map((c) => timeYear(c.mainsnak.datavalue.value))
    .filter((y) => y !== undefined)
  if (years.length === 0) return undefined
  return prop === 'P576' ? Math.max(...years) : Math.min(...years)
}

function stringValue(entity, prop) {
  const c = claimValues(entity, prop)[0]
  return c ? String(c.mainsnak.datavalue.value) : undefined
}

function population(entity, mid) {
  let best
  for (const c of claimValues(entity, 'P1082')) {
    const amount = Number(c.mainsnak.datavalue.value.amount)
    if (!Number.isFinite(amount) || amount <= 0) continue
    const q = (c.qualifiers || {}).P585 || []
    const year = q[0] && q[0].datavalue ? timeYear(q[0].datavalue.value) : undefined
    const score = year === undefined ? 1e6 : Math.abs(year - mid)
    if (!best || score < best.score) best = { amount: Math.round(amount), year, score }
  }
  return best
}

function areaKm2(entity) {
  for (const c of claimValues(entity, 'P2046')) {
    const v = c.mainsnak.datavalue.value
    const amount = Number(v.amount)
    if (!Number.isFinite(amount) || amount <= 0) continue
    const unit = String(v.unit || '').split('/').pop()
    if (unit === 'Q712226') return Math.round(amount)
    if (unit === 'Q25343') return Math.round(amount / 1e6)
    if (unit === 'Q232291') return Math.round(amount * 2.58999)
    if (unit === 'Q35852') return Math.round(amount / 100)
  }
  return undefined
}

function pickLabel(entity, lang) {
  for (const code of LABEL_CHAIN[lang]) {
    const label = entity && entity.labels && entity.labels[code]
    if (label && label.value) return label.value
  }
  return undefined
}

function pickDesc(entity, lang) {
  for (const code of LABEL_CHAIN[lang]) {
    if (code === 'mul') continue
    const desc = entity && entity.descriptions && entity.descriptions[code]
    if (desc && desc.value) return desc.value
  }
  return undefined
}

function sitelink(entity, lang) {
  const row = entity && entity.sitelinks && entity.sitelinks[`${lang}wiki`]
  return row ? row.title : undefined
}

function classes(entity) {
  return itemIds(entity, 'P31', 20)
}

/** Is this Wikidata item a plausible match for a basemap name seen in these years? */
function acceptable(entity, years) {
  if (!entity) return false
  if (classes(entity).some((id) => BAD_CLASS.has(id))) return false
  const desc = pickDesc(entity, 'en') || ''
  if (BAD_DESC.test(desc)) return false
  if (/^(names|list|timeline|outline) of\b/i.test(pickLabel(entity, 'en') || '')) return false
  const first = Math.min(...years)
  const last = Math.max(...years)
  const inc = firstYear(entity, 'P571')
  const dis = firstYear(entity, 'P576')
  if (inc !== undefined && inc > last + 25) return false
  if (dis !== undefined && dis < first - 60) return false
  if (!desc) return true
  return STATE_DESC.test(desc) || PEOPLE_DESC.test(desc)
}

function kindOf(rawName, entity) {
  if (PEOPLE_NAME.test(rawName)) return 'x'
  const desc = (entity && pickDesc(entity, 'en')) || ''
  if (PEOPLE_DESC.test(desc) && !/\b(state|kingdom|empire|sultanate|khanate|confedera\w*|chiefdom|polity|country|dynasty)\b/i.test(desc)) {
    return 'x'
  }
  return 's'
}

async function collectNames() {
  const entries = new Map()
  function add(id, name, year, fromSubject) {
    if (!id || id === 'unknown' || !name) return
    if (!entries.has(id)) entries.set(id, { id, names: new Map(), years: new Set(), subjectOnly: true })
    const row = entries.get(id)
    row.names.set(name, (row.names.get(name) || 0) + 1)
    row.years.add(year)
    if (!fromSubject) row.subjectOnly = false
  }
  for (const year of YEARS) {
    const geo = await loadYear(year)
    for (const feature of geo.features || []) {
      const props = feature.properties || {}
      const name = props.NAME ? String(props.NAME).trim() : ''
      if (!name) continue
      add(mapId(props), name, year, false)
      const subject = props.SUBJECTO ? String(props.SUBJECTO).trim() : ''
      if (subject && subject !== name) add(mapId({ NAME: subject }), subject, year, true)
    }
  }
  return [...entries.values()]
    .filter((row) => !ISO2.has(row.id))
    .map((row) => {
      const name = [...row.names.entries()].sort((a, b) => b[1] - a[1])[0][0]
      return { id: row.id, name, years: [...row.years].sort((a, b) => a - b), subjectOnly: row.subjectOnly }
    })
}

async function resolveQids(rows) {
  const chosen = new Map()
  const direct = new Map()
  for (const row of rows) direct.set(row.id, TITLE_OVERRIDES[row.id] || row.name)
  const titleHits = await titlesToQids([...direct.values()])
  const directQids = []
  for (const row of rows) {
    const hit = titleHits.get(direct.get(row.id))
    if (hit && !hit.disambiguation) directQids.push(hit.qid)
  }
  const firstPass = await fetchEntities(directQids, 'labels|descriptions|claims')
  const missingOverrides = []
  for (const row of rows) {
    const hit = titleHits.get(direct.get(row.id))
    const qid = hit && !hit.disambiguation ? hit.qid : undefined
    if (TITLE_OVERRIDES[row.id]) {
      if (qid) chosen.set(row.id, qid)
      else missingOverrides.push(`${row.id} → ${TITLE_OVERRIDES[row.id]}`)
      continue
    }
    if (qid && acceptable(firstPass.get(qid), row.years)) chosen.set(row.id, qid)
  }
  if (missingOverrides.length) console.log(`overrides without a page: ${missingOverrides.join('; ')}`)
  console.log(`direct ${chosen.size}/${rows.length}`)

  const rounds = [
    (base, hint) => (hint ? `${base} ${hint}` : base),
    (base) => `${base} people`,
    (base) => `${base} kingdom`,
  ]
  for (const makeQuery of rounds) {
    const need = rows.filter((row) => !chosen.has(row.id))
    if (need.length === 0) break
    const found = new Map()
    let done = 0
    for (const batch of chunks(need, 6)) {
      await Promise.all(
        batch.map(async (row) => {
          const { base, hint } = cleanName(row.name)
          found.set(row.id, await searchTitles(makeQuery(base, hint)))
        }),
      )
      done += batch.length
      if (done % 60 < 6) console.log(`  search ${done}/${need.length}`)
    }
    const hits = await titlesToQids([...found.values()].flat())
    const pass = await fetchEntities(
      [...hits.values()].filter((hit) => !hit.disambiguation).map((hit) => hit.qid),
      'labels|descriptions|claims',
    )
    for (const row of need) {
      const { base } = cleanName(row.name)
      for (const title of found.get(row.id) || []) {
        const hit = hits.get(title)
        if (!hit || hit.disambiguation) continue
        const entity = pass.get(hit.qid)
        if (!acceptable(entity, row.years)) continue
        const label = pickLabel(entity, 'en') || hit.title
        if (similar(base, label) < 0.45 && similar(base, hit.title) < 0.45) continue
        chosen.set(row.id, hit.qid)
        break
      }
    }
    console.log(`after search round: ${chosen.size}/${rows.length}`)
  }
  return chosen
}

async function isoCodes(qids) {
  const out = new Map()
  for (const batch of chunks([...new Set(qids)], 200)) {
    const query = `SELECT ?item ?iso WHERE { VALUES ?item { ${batch.map((q) => `wd:${q}`).join(' ')} } ?item wdt:P297 ?iso }`
    const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`
    const data = await getJson(url)
    for (const b of data.results.bindings) {
      out.set(b.item.value.split('/').pop(), b.iso.value.toLowerCase())
    }
  }
  return out
}

function joinLabels(ids, refs, lang) {
  const labels = ids.map((id) => pickLabel(refs.get(id), lang)).filter(Boolean)
  return labels.length > 0 ? [...new Set(labels)].join(', ') : undefined
}

function stripWikiTitle(title) {
  return title ? title.replace(/\s*\([^)]*\)\s*$/, '') : undefined
}

async function main() {
  const rows = await collectNames()
  console.log(`${rows.length} names`)
  const known = new Set(rows.map((row) => row.id))
  const stale = Object.keys(TITLE_OVERRIDES).filter((id) => !known.has(id))
  if (stale.length) console.log(`override ids not on any map: ${stale.join(', ')}`)
  const chosen = await resolveQids(rows)
  console.log(`matched ${chosen.size}/${rows.length}`)
  const entities = await fetchEntities([...chosen.values()], 'labels|descriptions|claims|sitelinks')
  const qidToId = new Map()
  for (const [id, qid] of chosen) if (!qidToId.has(qid)) qidToId.set(qid, id)

  const refIds = new Set()
  const linkIds = new Set()
  for (const qid of chosen.values()) {
    const e = entities.get(qid)
    if (!e) continue
    for (const p of ['P36', 'P37', 'P2936', 'P38', 'P122', 'P140']) itemIds(e, p).forEach((id) => refIds.add(id))
    for (const p of ['P1365', 'P1366']) itemIds(e, p, 8).forEach((id) => linkIds.add(id))
  }
  const refs = await fetchEntities([...refIds], 'labels')
  const isoByQid = await isoCodes([...linkIds].filter((q) => !qidToId.has(q)))

  const index = {}
  const perLang = Object.fromEntries(LANGS.map((lang) => [lang, {}]))
  const unmatched = []
  for (const row of rows) {
    const qid = chosen.get(row.id)
    const e = qid ? entities.get(qid) : undefined
    if (!e) unmatched.push(`${row.id}\t${row.name}\t${row.years[0]}–${row.years[row.years.length - 1]}`)
    const mid = (row.years[0] + row.years[row.years.length - 1]) / 2
    const meta = { k: kindOf(row.name, e) }
    if (e) {
      meta.q = qid
      const flag = stringValue(e, 'P41')
      const coa = stringValue(e, 'P94')
      if (flag) meta.f = flag
      if (coa) meta.e = coa
      const inc = firstYear(e, 'P571')
      const dis = firstYear(e, 'P576')
      if (inc !== undefined) meta.i = inc
      if (dis !== undefined) meta.d = dis
      const pop = population(e, mid)
      if (pop) {
        meta.p = pop.amount
        if (pop.year !== undefined) meta.py = pop.year
      }
      const area = areaKm2(e)
      if (area) meta.a = area
      const link = (qids) =>
        qids
          .map((q) => (qidToId.has(q) ? qidToId.get(q) : isoByQid.get(q)))
          .filter((id) => id && id !== row.id)
      const pre = [...new Set(link(itemIds(e, 'P1365', 8)))]
      const suc = [...new Set(link(itemIds(e, 'P1366', 8)))]
      if (pre.length) meta.pre = pre
      if (suc.length) meta.suc = suc
    }
    index[row.id] = meta
    for (const lang of LANGS) {
      const wiki = sitelink(e, lang)
      const name = pickLabel(e, lang) || stripWikiTitle(wiki) || (lang === 'en' ? row.name : undefined)
      const out = {}
      if (name) out.n = name
      if (e) {
        const desc = pickDesc(e, lang)
        if (desc) out.s = desc
        const cap = joinLabels(itemIds(e, 'P36', 2), refs, lang)
        const langsOfficial = itemIds(e, 'P37', 3)
        const langs = joinLabels(langsOfficial.length ? langsOfficial : itemIds(e, 'P2936', 3), refs, lang)
        const cur = joinLabels(itemIds(e, 'P38', 2), refs, lang)
        const gov = joinLabels(itemIds(e, 'P122', 2), refs, lang)
        const rel = joinLabels(itemIds(e, 'P140', 2), refs, lang)
        if (cap) out.c = cap
        if (langs) out.l = langs
        if (cur) out.m = cur
        if (gov) out.g = gov
        if (rel) out.r = rel
        if (wiki) out.w = wiki
      }
      if (Object.keys(out).length > 0) perLang[lang][row.id] = out
    }
  }
  fs.mkdirSync(CARDS_OUT, { recursive: true })
  fs.writeFileSync(path.join(CARDS_OUT, 'index.json'), JSON.stringify(index))
  for (const lang of LANGS) fs.writeFileSync(path.join(CARDS_OUT, `${lang}.json`), JSON.stringify(perLang[lang]))
  fs.writeFileSync(path.join(CACHE, '..', 'history-cards-unmatched.txt'), unmatched.join('\n'))
  const matchedLog = rows
    .filter((row) => chosen.has(row.id))
    .map((row) => `${row.id}\t${row.name}\t${chosen.get(row.id)}\t${pickLabel(entities.get(chosen.get(row.id)), 'en') || ''}\t${pickDesc(entities.get(chosen.get(row.id)), 'en') || ''}`)
  fs.writeFileSync(path.join(CACHE, '..', 'history-cards-matched.txt'), matchedLog.join('\n'))
  console.log(`cards ${Object.keys(index).length}, unmatched ${unmatched.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
