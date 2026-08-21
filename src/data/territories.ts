import { COUNTRIES, type Region } from './countries'

export interface MapTerritory {
  iso: string
  parent: string
  region: Region
  fit: boolean
  nameEn: string
  nameRu: string
  statusEn: string
  statusRu: string
  claimEn?: string
  claimRu?: string
  marker?: { x: number; y: number }
}

export const TERRITORIES: MapTerritory[] = [
  { iso: 'ax', parent: 'fi', region: 'europe', fit: true, nameEn: 'Åland', nameRu: 'Аландские острова', statusEn: 'an autonomous region of Finland', statusRu: 'автономная территория Финляндии' },
  { iso: 'ai', parent: 'gb', region: 'americas', fit: true, nameEn: 'Anguilla', nameRu: 'Ангилья', statusEn: 'a British Overseas Territory', statusRu: 'заморская территория Великобритании' },
  { iso: 'aw', parent: 'nl', region: 'americas', fit: true, nameEn: 'Aruba', nameRu: 'Аруба', statusEn: 'a constituent country of the Netherlands', statusRu: 'самоуправляемое государство в составе Нидерландов' },
  { iso: 'as', parent: 'us', region: 'oceania', fit: true, nameEn: 'American Samoa', nameRu: 'Американское Самоа', statusEn: 'an unincorporated territory of the United States', statusRu: 'территория США' },
  { iso: 'bm', parent: 'gb', region: 'americas', fit: true, nameEn: 'Bermuda', nameRu: 'Бермуды', statusEn: 'a British Overseas Territory', statusRu: 'заморская территория Великобритании' },
  { iso: 'bq', parent: 'nl', region: 'americas', fit: true, nameEn: 'Caribbean Netherlands', nameRu: 'Карибские Нидерланды', statusEn: 'special municipalities of the Netherlands', statusRu: 'особые общины Нидерландов' },
  { iso: 'bv', parent: 'no', region: 'africa', fit: false, nameEn: 'Bouvet Island', nameRu: 'Остров Буве', statusEn: 'a dependent territory of Norway', statusRu: 'зависимая территория Норвегии' },
  { iso: 'vg', parent: 'gb', region: 'americas', fit: true, nameEn: 'British Virgin Islands', nameRu: 'Британские Виргинские Острова', statusEn: 'a British Overseas Territory', statusRu: 'заморская территория Великобритании' },
  { iso: 'io', parent: 'gb', region: 'africa', fit: false, nameEn: 'British Indian Ocean Territory', nameRu: 'Британская территория в Индийском океане', statusEn: 'administered by the United Kingdom', statusRu: 'под контролем Великобритании', claimEn: 'Mauritius claims the Chagos Archipelago.', claimRu: 'Есть претензия: Маврикий считает архипелаг Чагос своим.' },
  { iso: 'ky', parent: 'gb', region: 'americas', fit: true, nameEn: 'Cayman Islands', nameRu: 'Каймановы Острова', statusEn: 'a British Overseas Territory', statusRu: 'заморская территория Великобритании' },
  { iso: 'cx', parent: 'au', region: 'asia', fit: true, nameEn: 'Christmas Island', nameRu: 'Остров Рождества', statusEn: 'an external territory of Australia', statusRu: 'внешняя территория Австралии' },
  { iso: 'cc', parent: 'au', region: 'asia', fit: true, nameEn: 'Cocos (Keeling) Islands', nameRu: 'Кокосовые острова', statusEn: 'an external territory of Australia', statusRu: 'внешняя территория Австралии' },
  { iso: 'ck', parent: 'nz', region: 'oceania', fit: true, nameEn: 'Cook Islands', nameRu: 'Острова Кука', statusEn: 'a state in free association with New Zealand', statusRu: 'государство в свободной ассоциации с Новой Зеландией' },
  { iso: 'cw', parent: 'nl', region: 'americas', fit: true, nameEn: 'Curaçao', nameRu: 'Кюрасао', statusEn: 'a constituent country of the Netherlands', statusRu: 'самоуправляемое государство в составе Нидерландов' },
  { iso: 'fk', parent: 'gb', region: 'americas', fit: true, nameEn: 'Falkland Islands (Malvinas)', nameRu: 'Фолклендские (Мальвинские) острова', statusEn: 'administered by the United Kingdom', statusRu: 'под контролем Великобритании', claimEn: 'Argentina claims the islands and calls them the Malvinas.', claimRu: 'Есть претензия: Аргентина считает острова своими и называет их Мальвинскими.' },
  { iso: 'fo', parent: 'dk', region: 'europe', fit: true, nameEn: 'Faroe Islands', nameRu: 'Фарерские острова', statusEn: 'an autonomous territory of Denmark', statusRu: 'автономная территория Дании' },
  { iso: 'gf', parent: 'fr', region: 'americas', fit: true, nameEn: 'French Guiana', nameRu: 'Французская Гвиана', statusEn: 'an overseas region of France', statusRu: 'заморский регион Франции' },
  { iso: 'pf', parent: 'fr', region: 'oceania', fit: true, nameEn: 'French Polynesia', nameRu: 'Французская Полинезия', statusEn: 'an overseas collectivity of France', statusRu: 'заморская община Франции' },
  { iso: 'tf', parent: 'fr', region: 'africa', fit: false, nameEn: 'French Southern Territories', nameRu: 'Французские Южные территории', statusEn: 'an overseas territory of France', statusRu: 'заморская территория Франции' },
  { iso: 'gi', parent: 'gb', region: 'europe', fit: true, nameEn: 'Gibraltar', nameRu: 'Гибралтар', statusEn: 'administered by the United Kingdom', statusRu: 'под контролем Великобритании', claimEn: 'Spain claims Gibraltar.', claimRu: 'Есть претензия: Испания считает Гибралтар своей территорией.' },
  { iso: 'gl', parent: 'dk', region: 'americas', fit: true, nameEn: 'Greenland', nameRu: 'Гренландия', statusEn: 'an autonomous territory of Denmark', statusRu: 'автономная территория Дании' },
  { iso: 'gp', parent: 'fr', region: 'americas', fit: true, nameEn: 'Guadeloupe', nameRu: 'Гваделупа', statusEn: 'an overseas region of France', statusRu: 'заморский регион Франции' },
  { iso: 'gu', parent: 'us', region: 'oceania', fit: true, nameEn: 'Guam', nameRu: 'Гуам', statusEn: 'an unincorporated territory of the United States', statusRu: 'территория США' },
  { iso: 'gg', parent: 'gb', region: 'europe', fit: true, nameEn: 'Guernsey', nameRu: 'Гернси', statusEn: 'a Crown Dependency of the United Kingdom', statusRu: 'коронное владение Великобритании' },
  { iso: 'go', parent: 'fr', region: 'africa', fit: false, nameEn: 'Glorioso Islands', nameRu: 'Острова Глурьёз', statusEn: 'administered by France', statusRu: 'под контролем Франции', claimEn: 'Madagascar claims the islands.', claimRu: 'Есть претензия: Мадагаскар считает острова своими.' },
  { iso: 'hk', parent: 'cn', region: 'asia', fit: true, nameEn: 'Hong Kong', nameRu: 'Гонконг', statusEn: 'a special administrative region of China', statusRu: 'специальный административный район Китая' },
  { iso: 'hm', parent: 'au', region: 'africa', fit: false, nameEn: 'Heard Island and McDonald Islands', nameRu: 'Остров Херд и острова Макдональд', statusEn: 'an external territory of Australia', statusRu: 'внешняя территория Австралии' },
  { iso: 'im', parent: 'gb', region: 'europe', fit: true, nameEn: 'Isle of Man', nameRu: 'Остров Мэн', statusEn: 'a Crown Dependency of the United Kingdom', statusRu: 'коронное владение Великобритании' },
  { iso: 'je', parent: 'gb', region: 'europe', fit: true, nameEn: 'Jersey', nameRu: 'Джерси', statusEn: 'a Crown Dependency of the United Kingdom', statusRu: 'коронное владение Великобритании' },
  { iso: 'ju', parent: 'fr', region: 'africa', fit: false, nameEn: 'Juan de Nova Island', nameRu: 'Остров Жуан-ди-Нова', statusEn: 'administered by France', statusRu: 'под контролем Франции', claimEn: 'Madagascar claims the island.', claimRu: 'Есть претензия: Мадагаскар считает остров своим.' },
  { iso: 'mo', parent: 'cn', region: 'asia', fit: true, nameEn: 'Macau', nameRu: 'Макао', statusEn: 'a special administrative region of China', statusRu: 'специальный административный район Китая' },
  { iso: 'mq', parent: 'fr', region: 'americas', fit: true, nameEn: 'Martinique', nameRu: 'Мартиника', statusEn: 'an overseas region of France', statusRu: 'заморский регион Франции' },
  { iso: 'yt', parent: 'fr', region: 'africa', fit: true, nameEn: 'Mayotte', nameRu: 'Майотта', statusEn: 'administered by France', statusRu: 'под контролем Франции', claimEn: 'Comoros claims Mayotte.', claimRu: 'Есть претензия: Коморы считают Майотту своей.' },
  { iso: 'ms', parent: 'gb', region: 'americas', fit: true, nameEn: 'Montserrat', nameRu: 'Монтсеррат', statusEn: 'a British Overseas Territory', statusRu: 'заморская территория Великобритании' },
  { iso: 'nc', parent: 'fr', region: 'oceania', fit: true, nameEn: 'New Caledonia', nameRu: 'Новая Каледония', statusEn: 'a special collectivity of France', statusRu: 'особая община Франции' },
  { iso: 'nu', parent: 'nz', region: 'oceania', fit: true, nameEn: 'Niue', nameRu: 'Ниуэ', statusEn: 'a state in free association with New Zealand', statusRu: 'государство в свободной ассоциации с Новой Зеландией' },
  { iso: 'nf', parent: 'au', region: 'oceania', fit: true, nameEn: 'Norfolk Island', nameRu: 'Остров Норфолк', statusEn: 'an external territory of Australia', statusRu: 'внешняя территория Австралии' },
  { iso: 'mp', parent: 'us', region: 'oceania', fit: true, nameEn: 'Northern Mariana Islands', nameRu: 'Северные Марианские Острова', statusEn: 'a commonwealth of the United States', statusRu: 'содружество в составе США' },
  { iso: 'pn', parent: 'gb', region: 'oceania', fit: false, nameEn: 'Pitcairn Islands', nameRu: 'Острова Питкэрн', statusEn: 'a British Overseas Territory', statusRu: 'заморская территория Великобритании' },
  { iso: 'pr', parent: 'us', region: 'americas', fit: true, nameEn: 'Puerto Rico', nameRu: 'Пуэрто-Рико', statusEn: 'an unincorporated territory of the United States', statusRu: 'территория США' },
  { iso: 're', parent: 'fr', region: 'africa', fit: true, nameEn: 'Réunion', nameRu: 'Реюньон', statusEn: 'an overseas region of France', statusRu: 'заморский регион Франции' },
  { iso: 'bl', parent: 'fr', region: 'americas', fit: true, nameEn: 'Saint Barthélemy', nameRu: 'Сен-Бартелеми', statusEn: 'an overseas collectivity of France', statusRu: 'заморская община Франции' },
  { iso: 'sh', parent: 'gb', region: 'africa', fit: false, nameEn: 'Saint Helena', nameRu: 'Остров Святой Елены', statusEn: 'a British Overseas Territory', statusRu: 'заморская территория Великобритании' },
  { iso: 'mf', parent: 'fr', region: 'americas', fit: true, nameEn: 'Saint Martin', nameRu: 'Сен-Мартен', statusEn: 'an overseas collectivity of France', statusRu: 'заморская община Франции' },
  { iso: 'pm', parent: 'fr', region: 'americas', fit: true, nameEn: 'Saint Pierre and Miquelon', nameRu: 'Сен-Пьер и Микелон', statusEn: 'an overseas collectivity of France', statusRu: 'заморская община Франции' },
  { iso: 'sx', parent: 'nl', region: 'americas', fit: true, nameEn: 'Sint Maarten', nameRu: 'Синт-Мартен', statusEn: 'a constituent country of the Netherlands', statusRu: 'самоуправляемое государство в составе Нидерландов' },
  { iso: 'gs', parent: 'gb', region: 'americas', fit: false, nameEn: 'South Georgia and the South Sandwich Islands', nameRu: 'Южная Георгия и Южные Сандвичевы Острова', statusEn: 'administered by the United Kingdom', statusRu: 'под контролем Великобритании', claimEn: 'Argentina claims the islands.', claimRu: 'Есть претензия: Аргентина считает острова своими.' },
  { iso: 'sj', parent: 'no', region: 'europe', fit: false, nameEn: 'Svalbard', nameRu: 'Шпицберген', statusEn: 'a territory of Norway', statusRu: 'территория Норвегии' },
  { iso: 'tk', parent: 'nz', region: 'oceania', fit: true, nameEn: 'Tokelau', nameRu: 'Токелау', statusEn: 'a dependent territory of New Zealand', statusRu: 'зависимая территория Новой Зеландии' },
  { iso: 'tc', parent: 'gb', region: 'americas', fit: true, nameEn: 'Turks and Caicos Islands', nameRu: 'Теркс и Кайкос', statusEn: 'a British Overseas Territory', statusRu: 'заморская территория Великобритании' },
  { iso: 'vi', parent: 'us', region: 'americas', fit: true, nameEn: 'U.S. Virgin Islands', nameRu: 'Американские Виргинские Острова', statusEn: 'an unincorporated territory of the United States', statusRu: 'территория США' },
  { iso: 'um-dq', parent: 'us', region: 'oceania', fit: false, nameEn: 'Jarvis Island', nameRu: 'Остров Джарвис', statusEn: 'an unincorporated territory of the United States', statusRu: 'территория США' },
  { iso: 'um-fq', parent: 'us', region: 'oceania', fit: false, nameEn: 'Baker Island', nameRu: 'Остров Бейкер', statusEn: 'an unincorporated territory of the United States', statusRu: 'территория США' },
  { iso: 'um-hq', parent: 'us', region: 'oceania', fit: false, nameEn: 'Howland Island', nameRu: 'Остров Хауленд', statusEn: 'an unincorporated territory of the United States', statusRu: 'территория США' },
  { iso: 'um-jq', parent: 'us', region: 'oceania', fit: false, nameEn: 'Johnston Atoll', nameRu: 'Атолл Джонстон', statusEn: 'an unincorporated territory of the United States', statusRu: 'территория США' },
  { iso: 'um-mq', parent: 'us', region: 'oceania', fit: false, nameEn: 'Midway Islands', nameRu: 'Острова Мидуэй', statusEn: 'an unincorporated territory of the United States', statusRu: 'территория США' },
  { iso: 'um-wq', parent: 'us', region: 'oceania', fit: false, nameEn: 'Wake Island', nameRu: 'Остров Уэйк', statusEn: 'an unincorporated territory of the United States', statusRu: 'территория США' },
  { iso: 'wf', parent: 'fr', region: 'oceania', fit: true, nameEn: 'Wallis and Futuna', nameRu: 'Уоллис и Футуна', statusEn: 'an overseas collectivity of France', statusRu: 'заморская община Франции' },
  { iso: 'eh', parent: 'ma', region: 'africa', fit: true, nameEn: 'Western Sahara', nameRu: 'Западная Сахара', statusEn: 'mostly administered by Morocco', statusRu: 'большую часть территории контролирует Марокко', claimEn: 'The Sahrawi Arab Democratic Republic (Polisario Front) claims the territory.', claimRu: 'Есть претензия: САДР и фронт Полисарио считают территорию своей.' },
  {
    iso: 'xx-kurils',
    parent: 'ru',
    region: 'asia',
    fit: false,
    nameEn: 'Southern Kuril Islands (Northern Territories)',
    nameRu: 'Южные Курилы (Северные территории)',
    statusEn: 'administered by Russia',
    statusRu: 'под контролем России',
    claimEn: 'Japan claims the islands as the Northern Territories.',
    claimRu: 'Есть претензия: Япония считает острова своими Северными территориями.',
    marker: { x: 902, y: 298 },
  },
  {
    iso: 'xx-senkaku',
    parent: 'jp',
    region: 'asia',
    fit: false,
    nameEn: 'Senkaku Islands (Diaoyu)',
    nameRu: 'Сенкаку (Дяоюйдао)',
    statusEn: 'administered by Japan',
    statusRu: 'под контролем Японии',
    claimEn: 'China and Taiwan claim the islands (Diaoyu / Diaoyutai).',
    claimRu: 'Есть претензии: Китай и Тайвань считают острова своими (Дяоюйдао).',
    marker: { x: 828, y: 388 },
  },
  {
    iso: 'xx-dokdo',
    parent: 'kr',
    region: 'asia',
    fit: false,
    nameEn: 'Dokdo (Takeshima)',
    nameRu: 'Токто (Такэсима)',
    statusEn: 'administered by South Korea',
    statusRu: 'под контролем Южной Кореи',
    claimEn: 'Japan claims the islands (Takeshima).',
    claimRu: 'Есть претензия: Япония считает острова своими (Такэсима).',
    marker: { x: 852, y: 342 },
  },
]

export const TERRITORY_BY_ISO = new Map(TERRITORIES.map((item) => [item.iso, item]))

const COUNTRY_BY_ISO = new Map(COUNTRIES.map((country) => [country.iso, country]))

export function territoryName(territory: MapTerritory, lang: 'ru' | 'en') {
  return lang === 'ru' ? territory.nameRu : territory.nameEn
}

export function territoryNote(territory: MapTerritory, lang: 'ru' | 'en') {
  return lang === 'ru'
    ? `${territory.nameRu} — ${territory.statusRu}`
    : `${territory.nameEn} is ${territory.statusEn}`
}

export function disputeNote(territory: MapTerritory, lang: 'ru' | 'en') {
  const claim = lang === 'ru' ? territory.claimRu : territory.claimEn
  return claim || undefined
}

export function fitIsosForRegion(region: Region | 'all') {
  const isos = new Set<string>()
  if (region === 'all') return isos
  for (const country of COUNTRIES) {
    if (country.region === region && country.iso !== 'ru') isos.add(country.iso)
  }
  for (const territory of TERRITORIES) {
    if (territory.fit && territory.region === region) isos.add(territory.iso)
  }
  return isos
}

export function resolveMapLocation(id: string) {
  const country = COUNTRY_BY_ISO.get(id)
  if (country) return { country, territory: undefined }
  const territory = TERRITORY_BY_ISO.get(id)
  if (!territory) return null
  const parent = COUNTRY_BY_ISO.get(territory.parent)
  if (!parent) return null
  return { country: parent, territory }
}
