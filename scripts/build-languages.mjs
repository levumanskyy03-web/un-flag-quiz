import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const UA = 'UNFlagQuiz/1.0 (https://geoguiz.online; language data build)'

function primaryLang(code) {
  return String(code || '')
    .split('_')[0]
    .split('-')[0]
    .toLowerCase()
}

function parseIsos() {
  const text = readFileSync(join(ROOT, 'src/data/countries.ts'), 'utf8')
  return [...text.matchAll(/iso: '([a-z]{2})'/g)].map((m) => m[1])
}

function parsePopulations() {
  const text = readFileSync(join(ROOT, 'src/data/passports.ts'), 'utf8')
  const pop = {}
  for (const match of text.matchAll(/^  ([a-z]{2}): p\("[^"]+", "[^"]+", ([\d_]+)/gm)) {
    pop[match[1]] = Number(match[2].replaceAll('_', ''))
  }
  return pop
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return res.json()
}

async function fetchWikidataOfficial(isos) {
  const values = isos.map((iso) => `"${iso.toUpperCase()}"`).join(' ')
  const query = `
SELECT ?iso ?code1 ?code3 WHERE {
  VALUES ?iso { ${values} }
  ?country wdt:P297 ?iso.
  ?country wdt:P37 ?lang.
  OPTIONAL { ?lang wdt:P218 ?code1 }
  OPTIONAL { ?lang wdt:P220 ?code3 }
}`
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`
  const json = await fetchJson(url)
  const byIso = {}
  for (const row of json.results.bindings) {
    const iso = row.iso.value.toLowerCase()
    const id = primaryLang(row.code1?.value || row.code3?.value || '')
    if (!id) continue
    byIso[iso] ??= []
    if (!byIso[iso].includes(id)) byIso[iso].push(id)
  }
  return byIso
}

const STATUS_RANK = {
  official: 4,
  de_facto_official: 3,
  official_regional: 2,
  official_minority: 1,
}

function mergeSpoken(entries) {
  const map = new Map()
  for (const entry of entries) {
    const id = primaryLang(entry.id)
    if (!id) continue
    const prev = map.get(id)
    if (!prev) {
      map.set(id, { id, pct: entry.pct, status: entry.status })
      continue
    }
    prev.pct = Math.min(100, Math.round((prev.pct + entry.pct) * 10) / 10)
    if ((STATUS_RANK[entry.status] || 0) > (STATUS_RANK[prev.status] || 0)) prev.status = entry.status
  }
  return [...map.values()]
}

function nationalIds(wiki, langs) {
  const byId = new Map(langs.map((item) => [item.id, item]))
  const cldrOfficial = langs.filter((item) => item.status === 'official').map((item) => item.id)
  const wikiRegional = wiki.filter((id) => byId.get(id)?.status === 'official_regional')
  const national = [...cldrOfficial]
  if (cldrOfficial.length >= 2 || wikiRegional.length >= 4) {
    for (const id of wikiRegional) {
      if (!national.includes(id)) national.push(id)
    }
  }
  return national
}

async function main() {
  const isos = parseIsos()
  const pop = parsePopulations()
  const [territoryInfo, enNames, ruNames, wikiOfficial] = await Promise.all([
    fetchJson(
      'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/supplemental/territoryInfo.json',
    ),
    fetchJson(
      'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/en/languages.json',
    ),
    fetchJson(
      'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/ru/languages.json',
    ),
    fetchWikidataOfficial(isos).catch((err) => {
      console.warn('Wikidata official languages failed, using CLDR official only:', err.message)
      return {}
    }),
  ])

  const en = enNames.main.en.localeDisplayNames.languages
  const ru = ruNames.main.ru.localeDisplayNames.languages
  const territories = territoryInfo.supplemental.territoryInfo
  const countryLangs = {}
  const used = new Set()

  for (const iso of isos) {
    const info = territories[iso.toUpperCase()]
    const raw = info?.languagePopulation || {}
    const merged = mergeSpoken(
      Object.entries(raw).map(([code, row]) => ({
        id: code,
        pct: Number(row._populationPercent) || 0,
        status: row._officialStatus || '',
      })),
    )
    const population = pop[iso] || 0
    const spoken = merged
      .filter((item) => item.pct >= 1 && (population * item.pct) / 100 >= 5000)
      .sort((a, b) => b.pct - a.pct || a.id.localeCompare(b.id))
      .slice(0, 20)
      .map((item) => ({ id: item.id, pct: item.pct }))

    const wiki = wikiOfficial[iso] || []
    const spokenPct = new Map(spoken.map((item) => [item.id, item.pct]))
    for (const item of merged) {
      if (!spokenPct.has(item.id)) spokenPct.set(item.id, item.pct)
    }
    const official = nationalIds(wiki, merged)
      .filter((id) => en[id] || ru[id])
      .sort((a, b) => (spokenPct.get(b) || 0) - (spokenPct.get(a) || 0) || a.localeCompare(b))

    countryLangs[iso] = { official, spoken }
    for (const id of official) used.add(id)
    for (const item of spoken) used.add(item.id)
  }

  const languages = {}
  for (const id of [...used].sort()) {
    const nameEn = en[id]
    const nameRu = ru[id] || nameEn
    if (!nameEn && !nameRu) continue
    languages[id] = { nameEn: nameEn || id, nameRu: nameRu || nameEn || id }
  }

  const missingOfficial = isos.filter((iso) => (countryLangs[iso].official || []).some((id) => !languages[id]))
  for (const iso of isos) {
    countryLangs[iso].official = countryLangs[iso].official.filter((id) => languages[id])
    countryLangs[iso].spoken = countryLangs[iso].spoken.filter((item) => languages[item.id])
  }

  const body = `/* Unicode CLDR 48 territoryInfo + language names (Unicode License).
   Official languages: Wikidata P37, fallback CLDR officialStatus=official.
   Spoken share: CLDR languagePopulation (people who speak the language). */
export interface LanguageInfo {
  nameEn: string
  nameRu: string
}

export interface SpokenShare {
  id: string
  pct: number
}

export interface CountryLangs {
  official: string[]
  spoken: SpokenShare[]
}

export const LANGUAGES: Record<string, LanguageInfo> = ${JSON.stringify(languages, null, 2)}

export const COUNTRY_LANGS: Record<string, CountryLangs> = ${JSON.stringify(countryLangs, null, 2)}
`

  writeFileSync(join(ROOT, 'src/data/languageData.ts'), body)
  const withOfficial = isos.filter((iso) => countryLangs[iso].official.length > 0).length
  const withSpoken = isos.filter((iso) => countryLangs[iso].spoken.length > 0).length
  console.log(
    `languages ${Object.keys(languages).length}; countries ${isos.length}; official ${withOfficial}; spoken ${withSpoken}; missing names skipped ${missingOfficial.length}`,
  )
}

await main()
