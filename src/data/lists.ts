import { COUNTRIES } from './countries'
import { MONARCHY } from './geoTraits'
import { LAND_NEIGHBORS } from './neighbors'

/** UN members with land area under 1 000 km² (CIA World Factbook / UN statistical geoscheme). */
export const MICROSTATE_ISOS = [
  'nr',
  'tv',
  'mc',
  'sm',
  'li',
  'mh',
  'kn',
  'mv',
  'mt',
  'gd',
  'vc',
  'bb',
  'ag',
  'sc',
  'pw',
  'ad',
  'lc',
  'fm',
  'sg',
  'to',
  'dm',
  'bh',
  'ki',
  'st',
] as const

/** No standing army among UN members (police / treaties / coast guard instead). */
export const NO_ARMY_ISOS = [
  'ad',
  'cr',
  'dm',
  'fm',
  'gd',
  'is',
  'ki',
  'lc',
  'li',
  'mh',
  'nr',
  'pa',
  'pw',
  'sb',
  'tv',
  'vc',
  'ws',
] as const

/** No ocean coastline. Caspian states count as landlocked. */
export const LANDLOCKED_ISOS = [
  'ad',
  'af',
  'am',
  'at',
  'az',
  'bf',
  'bi',
  'bo',
  'bt',
  'bw',
  'by',
  'cf',
  'ch',
  'cz',
  'et',
  'hu',
  'kg',
  'kz',
  'la',
  'li',
  'ls',
  'lu',
  'md',
  'mk',
  'ml',
  'mn',
  'mw',
  'ne',
  'np',
  'py',
  'rs',
  'rw',
  'sk',
  'sm',
  'ss',
  'sz',
  'td',
  'tj',
  'tm',
  'ug',
  'uz',
  'zm',
  'zw',
] as const

/** Landlocked countries whose every neighbour is also landlocked. */
export const DOUBLE_LANDLOCKED_ISOS = ['li', 'uz'] as const

/** Equator crosses land (not only territorial water). */
export const EQUATOR_ISOS = [
  'br',
  'cd',
  'cg',
  'co',
  'ec',
  'ga',
  'id',
  'ke',
  'ki',
  'so',
  'st',
  'ug',
] as const

/** Distinct official and administrative capitals (South Africa has three). */
export const TWO_CAPITALS_ISOS = ['bj', 'bo', 'ci', 'lk', 'my', 'nl', 'sz', 'tz', 'za'] as const

export const SECURITY_COUNCIL_ISOS = ['cn', 'fr', 'gb', 'ru', 'us'] as const

function unIsos(pred: (iso: string) => boolean): string[] {
  return COUNTRIES.filter((country) => pred(country.iso)).map((country) => country.iso)
}

export const ISLAND_ISOS = unIsos((iso) => (LAND_NEIGHBORS[iso] ?? []).length === 0)
export const ONE_NEIGHBOR_ISOS = unIsos((iso) => (LAND_NEIGHBORS[iso] ?? []).length === 1)
export const MONARCHY_ISOS = unIsos((iso) => MONARCHY.has(iso))

export const LIST_IDS = [
  'microstates',
  'no-army',
  'landlocked',
  'islands',
  'double-landlocked',
  'equator',
  'two-capitals',
  'one-neighbor',
  'monarchies',
  'security-council',
] as const

export type ListId = (typeof LIST_IDS)[number]

export const SITE_LISTS: { id: ListId; isos: readonly string[] }[] = [
  { id: 'microstates', isos: MICROSTATE_ISOS },
  { id: 'no-army', isos: NO_ARMY_ISOS },
  { id: 'landlocked', isos: LANDLOCKED_ISOS },
  { id: 'islands', isos: ISLAND_ISOS },
  { id: 'double-landlocked', isos: DOUBLE_LANDLOCKED_ISOS },
  { id: 'equator', isos: EQUATOR_ISOS },
  { id: 'two-capitals', isos: TWO_CAPITALS_ISOS },
  { id: 'one-neighbor', isos: ONE_NEIGHBOR_ISOS },
  { id: 'monarchies', isos: MONARCHY_ISOS },
  { id: 'security-council', isos: SECURITY_COUNCIL_ISOS },
]

export function isListId(value: string): value is ListId {
  return (LIST_IDS as readonly string[]).includes(value)
}

export function listById(id: string) {
  return SITE_LISTS.find((list) => list.id === id)
}
