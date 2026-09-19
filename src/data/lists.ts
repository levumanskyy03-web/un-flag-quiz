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

export type ListId = 'microstates'

export const SITE_LISTS: { id: ListId; isos: readonly string[] }[] = [
  { id: 'microstates', isos: MICROSTATE_ISOS },
]
