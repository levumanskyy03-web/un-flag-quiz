import type { Country, Region } from '../countries'
import { countriesForPool, findCountry } from '../extras'
import { FOUNDED } from '../founded'
import { getPassport } from '../passports'
import { pickRow } from '../../i18n/text11'
import type { Lang } from '../../i18n/lang'
import { POLITY_PASSPORTS, type PolityPassport } from './passports'
import { POLITIES } from './polities'
import type { Polity, PolityKind } from './types'

export { POLITIES } from './polities'
export { POLITY_PASSPORTS } from './passports'
export type { PolityPassport } from './passports'
export type { Polity, PolityKind } from './types'
export {
  HISTORY_SNAPSHOTS,
  HISTORY_YEAR_MIN,
  historyMapUrl,
  historyYearMax,
  nearestHistorySnapshot,
  useModernWorldMap,
} from './snapshots'

const BY_ID = new Map(POLITIES.map((item) => [item.id, item]))

const missingPassports = POLITIES.filter((item) => !POLITY_PASSPORTS[item.id]).map((item) => item.id)
if (missingPassports.length > 0) {
  throw new Error(`Missing history passport for: ${missingPassports.join(', ')}`)
}

/** Map-slice names that should open a catalogued polity or modern ISO. */
const MAP_ID_ALIASES: Record<string, string> = {
  'qing-empire': 'qing',
  'austria-hungary': 'ah',
  kr: 'kr-emp',
  'ottoman-sultanate': 'ott',
  yemen: 'ye-n',
  'western-sahara': 'sadr',
  'korea-republic-of': 'kr',
  'korea-democratic-people-s-republic-of': 'kp',
  'czech-republic': 'cz',
  'west-germany': 'de',
}

const MODERN_FALLBACK: Record<string, string> = {
  yemen: 'ye',
  kr: 'kr',
}

export function resolveHistoryId(id: string, year: number): string {
  const candidates = [id, MAP_ID_ALIASES[id], MODERN_FALLBACK[id]].filter(
    (value, index, all): value is string => Boolean(value) && all.indexOf(value) === index,
  )
  for (const candidate of candidates) {
    const polity = BY_ID.get(candidate)
    if (polity && polityExistsInYear(polity, year)) return candidate
  }
  for (const candidate of candidates) {
    if (!BY_ID.has(candidate)) return candidate
  }
  return id
}

export type MapIndependence =
  | { status: PolityKind; id: string; polity: Polity }
  | { status: 'modern'; id: string }
  | { status: 'not_independent'; id: string }

export function mapIndependence(
  id: string,
  year: number,
  opts?: { preferModern?: boolean },
): MapIndependence {
  if (opts?.preferModern && getPassport(id)) {
    return { status: 'modern', id }
  }
  const catalogued = BY_ID.get(id)
  if (catalogued) {
    return { status: catalogued.kind, id: catalogued.id, polity: catalogued }
  }
  const resolved = resolveHistoryId(id, year)
  const polity = BY_ID.get(resolved)
  if (polity && polityExistsInYear(polity, year)) {
    return { status: polity.kind, id: resolved, polity }
  }
  const country = findCountry(resolved) ?? findCountry(id)
  if (country && getPassport(country.iso) && modernInYear(country, year)) {
    return { status: 'modern', id: country.iso }
  }
  return { status: 'not_independent', id: resolved }
}

export function polityById(id: string): Polity | undefined {
  return BY_ID.get(id)
}

export function isHistoryId(id: string): boolean {
  return BY_ID.has(id)
}

export function polityName(id: string, lang: Lang): string | undefined {
  const polity = BY_ID.get(id)
  if (!polity) return undefined
  return pickRow(polity.names, lang, polity.names.en)
}

export function polityCapital(id: string, lang: Lang): string | undefined {
  const polity = BY_ID.get(id)
  if (!polity) return undefined
  return pickRow(polity.capital, lang, polity.capital.en)
}

export function polityFact(id: string, lang: Lang): string | undefined {
  const polity = BY_ID.get(id)
  if (!polity) return undefined
  return pickRow(polity.fact, lang, polity.fact.en)
}

export function polityPassport(id: string): PolityPassport | undefined {
  return POLITY_PASSPORTS[id]
}

export function polityCurrency(id: string, lang: Lang): string | undefined {
  const row = POLITY_PASSPORTS[id]
  if (!row) return undefined
  return pickRow(row.currency, lang, row.currency.en)
}

export function polityFlagUrl(id: string): string | undefined {
  const polity = BY_ID.get(id)
  if (!polity) return undefined
  if (polity.flagIso === 'su' || polity.flagIso === 'yu') return `/flags/${polity.flagIso}.svg`
  if (polity.flagFile) {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(polity.flagFile)}`
  }
  if (polity.flagIso && polity.flagIso.length === 2) return `https://flagcdn.com/${polity.flagIso}.svg`
  return undefined
}

export function asCountry(polity: Polity): Country {
  return {
    iso: polity.id,
    nameEn: polity.names.en,
    nameRu: polity.names.ru,
    region: polity.region,
    difficulty: polity.difficulty,
  }
}

export function polityExistsInYear(polity: Polity, year: number) {
  return polity.from <= year && (polity.to === null || polity.to >= year)
}

export function eraPolities(year: number): Polity[] {
  return POLITIES.filter((item) => polityExistsInYear(item, year))
}

function modernInYear(country: Country, year: number) {
  const founded = FOUNDED[country.iso]
  if (founded === undefined) return true
  return founded <= year
}

export type GeoPoolOptions = {
  includeExtras?: boolean
  includeEraStates?: boolean
  eraYear?: number
}

export function normalizePoolOptions(extrasOrOpts?: boolean | GeoPoolOptions): Required<GeoPoolOptions> {
  if (typeof extrasOrOpts === 'object' && extrasOrOpts) {
    return {
      includeExtras: Boolean(extrasOrOpts.includeExtras),
      includeEraStates: Boolean(extrasOrOpts.includeEraStates),
      eraYear: extrasOrOpts.eraYear ?? historyYearNow(),
    }
  }
  return {
    includeExtras: Boolean(extrasOrOpts),
    includeEraStates: false,
    eraYear: historyYearNow(),
  }
}

function historyYearNow() {
  return new Date().getFullYear()
}

export function countriesForEraPool(options: GeoPoolOptions = {}): Country[] {
  const { includeExtras, includeEraStates, eraYear } = normalizePoolOptions(options)
  const year = eraYear
  const base = countriesForPool(includeExtras).filter((country) =>
    includeEraStates ? modernInYear(country, year) : true,
  )
  if (!includeEraStates) return base
  const seen = new Set(base.map((country) => country.iso))
  const extra = eraPolities(year)
    .map(asCountry)
    .filter((country) => !seen.has(country.iso))
  return [...base, ...extra]
}

export function searchPolities(needle: string, lang: Lang, year: number, region: Region | 'all') {
  const q = needle.trim().toLowerCase()
  if (!q) return []
  return eraPolities(year)
    .filter((item) => region === 'all' || item.region === region)
    .flatMap((item) => {
      const label = polityName(item.id, lang) ?? item.names.en
      if (
        !label.toLowerCase().includes(q) &&
        !item.names.en.toLowerCase().includes(q) &&
        !item.names.ru.toLowerCase().includes(q)
      ) {
        return []
      }
      return [{ id: item.id, label }]
    })
}
