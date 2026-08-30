import { COUNTRIES, type Country, type Difficulty, type Region } from './countries'

function place(
  iso: string,
  nameEn: string,
  nameRu: string,
  region: Region,
  difficulty: Difficulty = 'hard',
): Country {
  return { iso, nameEn, nameRu, region, difficulty }
}

/** ISO 3166-1 (plus XK) that are not UN members. Palestine (`ps`) is excluded. */
export const EXTRA_COUNTRIES: Country[] = [
  place('aq', 'Antarctica', 'Антарктида', 'africa'),
  place('bv', 'Bouvet Island', 'Остров Буве', 'africa'),
  place('io', 'British Indian Ocean Territory', 'Британская территория в Индийском океане', 'africa'),
  place('tf', 'French Southern Territories', 'Французские Южные территории', 'africa'),
  place('hm', 'Heard Island and McDonald Islands', 'Остров Херд и острова Макдональд', 'africa'),
  place('yt', 'Mayotte', 'Майотта', 'africa'),
  place('re', 'Réunion', 'Реюньон', 'africa', 'easy'),
  place('sh', 'Saint Helena, Ascension and Tristan da Cunha', 'Остров Святой Елены, Вознесения и Тристан-да-Кунья', 'africa'),
  place('eh', 'Western Sahara', 'Западная Сахара', 'africa', 'easy'),
  place('ac', 'Ascension Island', 'Остров Вознесения', 'africa'),
  place('ta', 'Tristan da Cunha', 'Тристан-да-Кунья', 'africa'),
  place('dg', 'Diego Garcia', 'Диего-Гарсия', 'africa'),
  place('ea', 'Ceuta and Melilla', 'Сеута и Мелилья', 'africa'),
  place('ic', 'Canary Islands', 'Канарские острова', 'africa', 'easy'),

  place('ai', 'Anguilla', 'Ангилья', 'americas'),
  place('aw', 'Aruba', 'Аруба', 'americas', 'easy'),
  place('bm', 'Bermuda', 'Бермуды', 'americas', 'easy'),
  place('bq', 'Caribbean Netherlands', 'Карибские Нидерланды', 'americas'),
  place('vg', 'British Virgin Islands', 'Британские Виргинские Острова', 'americas'),
  place('ky', 'Cayman Islands', 'Каймановы Острова', 'americas', 'easy'),
  place('cw', 'Curaçao', 'Кюрасао', 'americas', 'easy'),
  place('fk', 'Falkland Islands', 'Фолклендские острова', 'americas'),
  place('gf', 'French Guiana', 'Французская Гвиана', 'americas'),
  place('gl', 'Greenland', 'Гренландия', 'americas', 'easy'),
  place('gp', 'Guadeloupe', 'Гваделупа', 'americas', 'easy'),
  place('mq', 'Martinique', 'Мартиника', 'americas', 'easy'),
  place('ms', 'Montserrat', 'Монтсеррат', 'americas'),
  place('pr', 'Puerto Rico', 'Пуэрто-Рико', 'americas', 'easy'),
  place('bl', 'Saint Barthélemy', 'Сен-Бартелеми', 'americas'),
  place('mf', 'Saint Martin', 'Сен-Мартен', 'americas'),
  place('pm', 'Saint Pierre and Miquelon', 'Сен-Пьер и Микелон', 'americas'),
  place('sx', 'Sint Maarten', 'Синт-Мартен', 'americas'),
  place('gs', 'South Georgia and the South Sandwich Islands', 'Южная Георгия и Южные Сандвичевы Острова', 'americas'),
  place('tc', 'Turks and Caicos Islands', 'Теркс и Кайкос', 'americas'),
  place('vi', 'U.S. Virgin Islands', 'Американские Виргинские Острова', 'americas', 'easy'),
  place('cp', 'Clipperton Island', 'Остров Клиппертон', 'americas'),

  place('cx', 'Christmas Island', 'Остров Рождества', 'asia'),
  place('cc', 'Cocos (Keeling) Islands', 'Кокосовые острова', 'asia'),
  place('hk', 'Hong Kong', 'Гонконг', 'asia', 'easy'),
  place('mo', 'Macau', 'Макао', 'asia', 'easy'),
  place('tw', 'Taiwan', 'Тайвань', 'asia', 'easy'),

  place('ax', 'Åland Islands', 'Аландские острова', 'europe'),
  place('fo', 'Faroe Islands', 'Фарерские острова', 'europe', 'easy'),
  place('gi', 'Gibraltar', 'Гибралтар', 'europe', 'easy'),
  place('gg', 'Guernsey', 'Гернси', 'europe', 'easy'),
  place('im', 'Isle of Man', 'Остров Мэн', 'europe', 'easy'),
  place('je', 'Jersey', 'Джерси', 'europe', 'easy'),
  place('xk', 'Kosovo', 'Косово', 'europe', 'easy'),
  place('sj', 'Svalbard and Jan Mayen', 'Шпицберген и Ян-Майен', 'europe'),
  place('va', 'Vatican City', 'Ватикан', 'europe', 'easy'),

  place('as', 'American Samoa', 'Американское Самоа', 'oceania', 'easy'),
  place('ck', 'Cook Islands', 'Острова Кука', 'oceania'),
  place('pf', 'French Polynesia', 'Французская Полинезия', 'oceania', 'easy'),
  place('gu', 'Guam', 'Гуам', 'oceania', 'easy'),
  place('nc', 'New Caledonia', 'Новая Каледония', 'oceania', 'easy'),
  place('nu', 'Niue', 'Ниуэ', 'oceania'),
  place('nf', 'Norfolk Island', 'Остров Норфолк', 'oceania'),
  place('mp', 'Northern Mariana Islands', 'Северные Марианские Острова', 'oceania'),
  place('pn', 'Pitcairn Islands', 'Острова Питкэрн', 'oceania'),
  place('tk', 'Tokelau', 'Токелау', 'oceania'),
  place('um', 'U.S. Minor Outlying Islands', 'Внешние малые острова США', 'oceania'),
  place('wf', 'Wallis and Futuna', 'Уоллис и Футуна', 'oceania'),
]

export const ALL_COUNTRIES: Country[] = [...COUNTRIES, ...EXTRA_COUNTRIES]
export const EXTRA_ISOS = new Set(EXTRA_COUNTRIES.map((country) => country.iso))

const BY_ISO = new Map(ALL_COUNTRIES.map((country) => [country.iso, country]))

export function isExtraIso(iso: string): boolean {
  return EXTRA_ISOS.has(iso)
}

export function findCountry(iso: string): Country | undefined {
  return BY_ISO.get(iso)
}

export function countriesForPool(includeExtras: boolean): Country[] {
  return includeExtras ? ALL_COUNTRIES : COUNTRIES
}
