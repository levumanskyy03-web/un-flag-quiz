import { COUNTRIES } from './countries'

/**
 * Largest religious group in each UN member.
 * "No religion" only when it is the largest group in a recent census or Pew estimate.
 * Eastern and Oriental Orthodox share one bucket. Japan and Vietnam use folk religion
 * (Shinto / Vietnamese folk) because that is the practiced tradition, even where
 * surveys say "none". Lebanon and Nigeria have no majority; the label is the largest
 * single community.
 */
export const RELIGION_IDS = [
  'catholic',
  'protestant',
  'orthodox',
  'sunni',
  'shia',
  'ibadi',
  'buddhist',
  'hindu',
  'jewish',
  'folk',
  'unaffiliated',
] as const

export type ReligionId = (typeof RELIGION_IDS)[number]

const GROUPS: Record<ReligionId, readonly string[]> = {
  catholic: [
    'ad', 'ao', 'ar', 'at', 'be', 'bi', 'bj', 'bo', 'br', 'bz', 'cd', 'cg', 'cl', 'cm', 'co', 'cr',
    'cu', 'cv', 'dm', 'do', 'ec', 'es', 'ga', 'gd', 'gq', 'gt', 'hn', 'hr', 'ht', 'hu', 'ie', 'it',
    'lc', 'li', 'lt', 'lu', 'mc', 'mt', 'mx', 'mz', 'ni', 'pa', 'pe', 'ph', 'pl', 'pt', 'pw', 'py', 'rw',
    'sc', 'si', 'sk', 'sm', 'st', 'sv', 'tg', 'tl', 'tz', 've', 'fm', 'ki',
  ],
  protestant: [
    'ag', 'bb', 'bs', 'bw', 'cf', 'dk', 'fi', 'fj', 'gb', 'gh', 'gy', 'is', 'jm', 'ke', 'kn', 'lr',
    'ls', 'lv', 'mg', 'mh', 'mw', 'na', 'no', 'nr', 'pg', 'sb', 'se', 'sr', 'ss', 'sz', 'to', 'tt',
    'tv', 'ug', 'us', 'vc', 'vu', 'ws', 'za', 'zm', 'zw',
  ],
  orthodox: [
    'am', 'bg', 'by', 'cy', 'er', 'et', 'ge', 'gr', 'md', 'me', 'mk', 'ro', 'rs', 'ru', 'ua',
  ],
  sunni: [
    'ae', 'af', 'al', 'ba', 'bd', 'bf', 'bn', 'ci', 'dj', 'dz', 'eg', 'gm', 'gn', 'gw', 'id', 'jo',
    'kg', 'km', 'kw', 'kz', 'lb', 'ly', 'ma', 'ml', 'mr', 'mv', 'my', 'ne', 'ng', 'pk', 'qa', 'sa',
    'sd', 'sl', 'sn', 'so', 'sy', 'td', 'tj', 'tm', 'tn', 'tr', 'uz', 'ye',
  ],
  shia: ['az', 'bh', 'iq', 'ir'],
  ibadi: ['om'],
  buddhist: ['bt', 'kh', 'la', 'lk', 'mm', 'mn', 'sg', 'th'],
  hindu: ['in', 'mu', 'np'],
  jewish: ['il'],
  folk: ['jp', 'vn'],
  unaffiliated: ['au', 'ca', 'ch', 'cn', 'cz', 'de', 'ee', 'fr', 'kp', 'kr', 'nl', 'nz', 'uy'],
}

const BY_ISO: Record<string, ReligionId> = {}
for (const id of RELIGION_IDS) {
  for (const iso of GROUPS[id]) {
    if (BY_ISO[iso]) throw new Error(`religion duplicate: ${iso}`)
    BY_ISO[iso] = id
  }
}

const missing = COUNTRIES.filter((country) => !BY_ISO[country.iso]).map((country) => country.iso)
if (missing.length > 0) throw new Error(`religion missing: ${missing.join(',')}`)

export function religionOf(iso: string): ReligionId | null {
  return BY_ISO[iso] ?? null
}

export function isosOfReligion(id: ReligionId): string[] {
  return COUNTRIES.filter((country) => BY_ISO[country.iso] === id).map((country) => country.iso)
}
