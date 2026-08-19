export const LEVEL_ISOS: string[][] = [
  ['us', 'cn', 'jp', 'gb', 'fr', 'de', 'it', 'ru', 'br', 'es'],
  ['ca', 'in', 'au', 'mx', 'tr', 'kr', 'ua', 'ch', 'se', 'gr'],
  ['ar', 'za', 'eg', 'sa', 'il', 'pl', 'pt', 'be', 'no', 'nl'],
  ['th', 'vn', 'pk', 'ir', 'cu', 'cl', 'ng', 'dk', 'cz', 'at'],
  ['id', 'co', 'iq', 'kp', 'ma', 'ke', 'jm', 'fi', 'ie', 'hu'],
  ['pe', 've', 'dz', 'tn', 'et', 'bd', 'ph', 'my', 'sg', 'np'],
  ['ae', 'qa', 'nz', 'hr', 'rs', 'by', 'kz', 'af', 'lb', 'gh'],
  ['ec', 'ly', 'ao', 'cd', 'cm', 'tz', 'ug', 'zw', 'mg', 'bo'],
  ['uy', 'pa', 'cr', 'do', 'jo', 'kw', 'az', 'am', 'ge', 'lk'],
  ['uz', 'mn', 'mm', 'kh', 'sy', 'ye', 'ro', 'is', 'bg', 'sk'],
  ['mz', 'na', 'rw', 'so', 'sd', 'kg', 'bt', 'cy', 'py', 'tt'],
  ['sn', 'ci', 'ml', 'gn', 'ne', 'tg', 'zm', 'mw', 'bw', 'ga'],
  ['la', 'om', 'bh', 'bn', 'tm', 'tj', 'ee', 'lt', 'lv', 'si'],
  ['al', 'ba', 'md', 'me', 'mk', 'mt', 'ht', 'gt', 'hn', 'ni'],
  ['sv', 'bz', 'gy', 'sr', 'bb', 'bs', 'fj', 'pg', 'ws', 'to'],
  ['lu', 'mc', 'ad', 'cg', 'bj', 'bf', 'bi', 'mr', 'er', 'gd'],
  ['dj', 'gm', 'lr', 'sl', 'ls', 'sz', 'cf', 'gq', 'ss', 'dm'],
  ['cv', 'km', 'sc', 'mu', 'st', 'mv', 'tl', 'sb', 'vu', 'ki'],
  ['td', 'nr', 'tv', 'pw', 'mh', 'fm', 'kn', 'lc', 'vc', 'ag', 'li', 'sm', 'gw'],
]

export const LEVEL_COUNT = LEVEL_ISOS.length
export const LEVEL_NUMBERS = LEVEL_ISOS.map((_, index) => index + 1)

export function isLevelNumber(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= LEVEL_COUNT
}
