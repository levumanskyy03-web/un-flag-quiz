import { COUNTRIES, type Country } from './countries'
import { RANKING_ORDERS } from './rankingOrders'

export const RANKING_MODES = [
  'rankGdp',
  'rankGdpPc',
  'rankArea',
  'rankGdpPpp',
  'rankGini',
  'rankMillionaires',
  'rankBillionaires',
  'rankHappiness',
  'rankPopulation',
  'rankHdi',
  'rankLife',
  'rankPress',
  'rankCpi',
  'rankPassport',
  'rankPeace',
  'rankCo2',
  'rankOlympics',
  'rankHeritage',
] as const

export type RankingMode = (typeof RANKING_MODES)[number]

export interface RankingCite {
  asOf: string
  source: string
  url: string
  count: number
  note?: string
}

interface RankingMeta {
  asOf: { ru: string; en: string }
  source: { ru: string; en: string }
  url: string
  note?: { ru: string; en: string }
  about: { ru: string; en: string }
}

const META: Record<RankingMode, RankingMeta> = {
  rankGdp: {
    asOf: { ru: 'апрель 2026', en: 'April 2026' },
    source: {
      ru: 'МВФ, World Economic Outlook (апрель 2026), таблица Visual Capitalist',
      en: 'IMF World Economic Outlook (April 2026), Visual Capitalist table',
    },
    url: 'https://www.imf.org/en/Publications/WEO',
    about: {
      ru: 'Номинальный ВВП — стоимость всех товаров и услуг, произведённых в стране за год, в текущих долларах США. Первое место — крупнейшая экономика.',
      en: 'Nominal GDP is the value of all goods and services produced in a year, in current US dollars. Rank 1 is the largest economy.',
    },
  },
  rankGdpPc: {
    asOf: { ru: '2026, прогноз МВФ', en: '2026 IMF forecast' },
    source: {
      ru: 'МВФ, ВВП на душу населения в текущих долларах; таблица Wikipedia',
      en: 'IMF nominal GDP per capita, current USD; Wikipedia table',
    },
    url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita',
    about: {
      ru: 'ВВП на душу — тот же номинальный ВВП, делённый на население. Показывает, сколько продукции приходится на одного жителя, а не размер страны целиком.',
      en: 'GDP per capita is nominal GDP divided by population: output per resident, not the size of the whole economy.',
    },
  },
  rankArea: {
    asOf: { ru: '2026', en: '2026' },
    source: {
      ru: 'ООН / национальная статистика, общая площадь; Wikipedia, List of countries and dependencies by area',
      en: 'UN / national statistics, total area; Wikipedia list of countries by area',
    },
    url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area',
    about: {
      ru: 'Общая площадь страны: суша и внутренние воды. Первое место — самая большая территория.',
      en: 'Total country area, land and inland water. Rank 1 is the largest territory.',
    },
  },
  rankGdpPpp: {
    asOf: { ru: '2026, прогноз МВФ', en: '2026 IMF forecast' },
    source: {
      ru: 'МВФ, ВВП по ППС (международные доллары); Wikipedia',
      en: 'IMF GDP at PPP (current international dollars); Wikipedia',
    },
    url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(PPP)',
    about: {
      ru: 'ВВП по паритету покупательной способности (ППС) — размер экономики с поправкой на местные цены. Так сравнивают реальный объём производства, а не курс валюты.',
      en: 'GDP at purchasing-power parity adjusts the size of the economy for local prices, so you compare real output rather than exchange rates.',
    },
  },
  rankGini: {
    asOf: { ru: 'последний год по стране, таблица на 2026', en: 'latest year per country, table as of 2026' },
    source: {
      ru: 'Всемирный банк, коэффициент Джини (если нет — UNU-WIDER); Wikipedia, List of countries by income inequality',
      en: 'World Bank Gini (UNU-WIDER if WB missing); Wikipedia list of countries by income inequality',
    },
    url: 'https://en.wikipedia.org/wiki/List_of_countries_by_income_inequality',
    note: {
      ru: '1-е место — самая равная страна (наименьший Джини). Часть оценок Банка — по потреблению, не по доходу.',
      en: 'Rank 1 is the most equal country (lowest Gini). Some World Bank figures are consumption-based, not income.',
    },
    about: {
      ru: 'Коэффициент Джини измеряет неравенство доходов (иногда потребления): 0 — все равны, 100 — всё у одного человека. В этом рейтинге 1-е место — самая равная страна.',
      en: 'The Gini coefficient measures income (sometimes consumption) inequality: 0 is perfect equality, 100 is one person holding everything. Rank 1 is the most equal country.',
    },
  },
  rankMillionaires: {
    asOf: { ru: '2024–2025', en: '2024–2025' },
    source: {
      ru: 'UBS Global Wealth Report, число взрослых с состоянием от $1 млн; Wikipedia',
      en: 'UBS Global Wealth Report, adults with net worth of $1m+; Wikipedia',
    },
    url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_millionaires',
    about: {
      ru: 'Число взрослых с чистым состоянием от 1 миллиона долларов США. Это счёт миллионеров, не доля населения.',
      en: 'The number of adults with net worth of at least US$1 million. This is a headcount, not a share of the population.',
    },
  },
  rankBillionaires: {
    asOf: { ru: '2026', en: '2026' },
    source: {
      ru: 'Forbes, World’s Billionaires 2026; Wikipedia, List of countries by number of billionaires',
      en: 'Forbes World’s Billionaires 2026; Wikipedia list of countries by number of billionaires',
    },
    url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_billionaires',
    about: {
      ru: 'Число миллиардеров по списку Forbes. Считаются люди, не сумма их богатства.',
      en: 'The number of billionaires on the Forbes list. This counts people, not the sum of their wealth.',
    },
  },
  rankHappiness: {
    asOf: { ru: 'World Happiness Report 2026', en: 'World Happiness Report 2026' },
    source: {
      ru: 'World Happiness Report, оценка жизни; Wikipedia',
      en: 'World Happiness Report, life evaluation; Wikipedia',
    },
    url: 'https://en.wikipedia.org/wiki/World_Happiness_Report',
    note: {
      ru: '1-е место — самая высокая оценка счастья.',
      en: 'Rank 1 is the highest life-evaluation score.',
    },
    about: {
      ru: 'World Happiness Report: средняя оценка собственной жизни жителями (от 0 до 10). Первое место — самая высокая оценка.',
      en: 'The World Happiness Report score is how residents rate their own lives, from 0 to 10. Rank 1 is the highest score.',
    },
  },
  rankPopulation: {
    asOf: { ru: 'оценки в паспорте страны', en: 'figures used in the country passport' },
    source: {
      ru: 'Демографические данные приложения (оценки населения в паспорте)',
      en: 'In-app passport population estimates',
    },
    url: 'https://un-flag-quiz.vercel.app/countries',
    about: {
      ru: 'Численность населения — сколько людей живёт в стране. Здесь те же оценки, что в паспорте страны.',
      en: 'Population is how many people live in the country. These are the same estimates as in the country passport.',
    },
  },
  rankHdi: {
    asOf: { ru: 'Доклад о человеческом развитии, таблица на 2026', en: 'Human Development Report, table as of 2026' },
    source: {
      ru: 'ПРООН, индекс человеческого развития; Wikipedia',
      en: 'UNDP Human Development Index; Wikipedia',
    },
    url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index',
    note: {
      ru: '1-е место — самый высокий ИЧР.',
      en: 'Rank 1 is the highest HDI.',
    },
    about: {
      ru: 'Индекс человеческого развития (ИЧР) ПРООН сводит в одно число здоровье (срок жизни), образование и доход на человека. Чем выше — тем выше средний уровень развития.',
      en: 'The UN Human Development Index combines health (life expectancy), education, and income per person into one score. Higher means a higher average level of development.',
    },
  },
  rankLife: {
    asOf: { ru: 'ООН, 2023', en: 'UN, 2023' },
    source: {
      ru: 'ООН, ожидаемая продолжительность жизни при рождении; Wikipedia',
      en: 'UN life expectancy at birth; Wikipedia',
    },
    url: 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy',
    about: {
      ru: 'Ожидаемая продолжительность жизни при рождении: сколько лет в среднем проживёт новорождённый, если смертность останется как сейчас.',
      en: 'Life expectancy at birth is how many years a newborn is expected to live if today’s death rates stay the same.',
    },
  },
  rankPress: {
    asOf: { ru: '2026', en: '2026' },
    source: {
      ru: 'Репортёры без границ, World Press Freedom Index 2026; Wikipedia',
      en: 'Reporters Without Borders, World Press Freedom Index 2026; Wikipedia',
    },
    url: 'https://en.wikipedia.org/wiki/World_Press_Freedom_Index',
    note: {
      ru: '1-е место — наибольшая свобода прессы.',
      en: 'Rank 1 is the highest press freedom.',
    },
    about: {
      ru: 'Индекс свободы прессы «Репортёров без границ». Оценивает, насколько журналисты могут работать без цензуры, насилия и давления властей. Первое место — наибольшая свобода.',
      en: 'The World Press Freedom Index (Reporters Without Borders) scores how freely journalists can work without censorship, violence, or state pressure. Rank 1 is the most free.',
    },
  },
  rankCpi: {
    asOf: { ru: 'индекс 2025, таблица на 2026', en: '2025 index, table as of 2026' },
    source: {
      ru: 'Transparency International, Corruption Perceptions Index; Wikipedia',
      en: 'Transparency International Corruption Perceptions Index; Wikipedia',
    },
    url: 'https://en.wikipedia.org/wiki/Corruption_Perceptions_Index',
    note: {
      ru: '1-е место — наименьшее воспринимаемое взяточничество.',
      en: 'Rank 1 is the lowest perceived corruption.',
    },
    about: {
      ru: 'Индекс восприятия коррупции Transparency International. Эксперты и бизнес оценивают взяточничество во власти. В этом рейтинге 1-е место — наименьшее воспринимаемое взяточничество.',
      en: 'Transparency International’s Corruption Perceptions Index is how experts and business rate public-sector bribery. Rank 1 is the lowest perceived corruption.',
    },
  },
  rankPassport: {
    asOf: { ru: '2026', en: '2026' },
    source: {
      ru: 'Henley Passport Index, безвизовый доступ; Wikipedia',
      en: 'Henley Passport Index, visa-free access; Wikipedia',
    },
    url: 'https://en.wikipedia.org/wiki/Henley_Passport_Index',
    note: {
      ru: '1-е место — самый «сильный» паспорт (больше безвизовых направлений).',
      en: 'Rank 1 is the strongest passport (most visa-free destinations).',
    },
    about: {
      ru: 'Индекс паспортов Henley: сколько стран можно посетить без визы (или с визой по прибытии) с этим паспортом. Первое место — самый «сильный» паспорт.',
      en: 'The Henley Passport Index counts destinations you can enter visa-free or with visa on arrival. Rank 1 is the strongest passport.',
    },
  },
  rankPeace: {
    asOf: { ru: 'Global Peace Index, таблица на 2026', en: 'Global Peace Index, table as of 2026' },
    source: {
      ru: 'Institute for Economics & Peace, Global Peace Index; Wikipedia',
      en: 'Institute for Economics & Peace, Global Peace Index; Wikipedia',
    },
    url: 'https://en.wikipedia.org/wiki/Global_Peace_Index',
    note: {
      ru: '1-е место — самая мирная страна по индексу.',
      en: 'Rank 1 is the most peaceful country on the index.',
    },
    about: {
      ru: 'Global Peace Index: войны и конфликты, безопасность внутри страны, милитаризация. Первое место — самая мирная страна по этому индексу.',
      en: 'The Global Peace Index scores ongoing conflict, internal safety, and militarisation. Rank 1 is the most peaceful country on the index.',
    },
  },
  rankCo2: {
    asOf: { ru: '2023', en: '2023' },
    source: {
      ru: 'Выбросы CO₂ от ископаемого топлива; Wikipedia / EDGAR',
      en: 'Fossil CO₂ emissions; Wikipedia / EDGAR',
    },
    url: 'https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions',
    about: {
      ru: 'Годовые выбросы углекислого газа от сжигания ископаемого топлива на территории страны. Первое место — крупнейший эмитент, не «самый зелёный».',
      en: 'Annual carbon dioxide emissions from fossil fuels on that country’s territory. Rank 1 is the largest emitter, not the greenest.',
    },
  },
  rankOlympics: {
    asOf: { ru: 'все игры по 2026', en: 'all Games through 2026' },
    source: {
      ru: 'МОК, суммарно золотые медали летних и зимних игр; Wikipedia, All-time Olympic Games medal table',
      en: 'IOC combined gold medals, Summer and Winter; Wikipedia all-time Olympic medal table',
    },
    url: 'https://en.wikipedia.org/wiki/All-time_Olympic_Games_medal_table',
    about: {
      ru: 'Сумма золотых медалей Олимпийских игр — летних и зимних, за всю историю до 2026 года включительно. Первое место — больше всего золота.',
      en: 'Combined Olympic gold medals, Summer and Winter, across all Games through 2026. Rank 1 has the most gold.',
    },
  },
  rankHeritage: {
    asOf: { ru: 'июль 2026', en: 'July 2026' },
    source: {
      ru: 'ЮНЕСКО, страны с 15 и более объектами всемирного наследия; Wikipedia, World Heritage Site',
      en: 'UNESCO, countries with 15 or more World Heritage Sites; Wikipedia World Heritage Site',
    },
    url: 'https://en.wikipedia.org/wiki/World_Heritage_Site',
    note: {
      ru: 'В этот рейтинг входят только страны с 15+ объектами.',
      en: 'This ranking only includes countries with 15 or more sites.',
    },
    about: {
      ru: 'Число объектов всемирного наследия ЮНЕСКО. В рейтинг входят только страны, у которых таких объектов 15 или больше.',
      en: 'The number of UNESCO World Heritage Sites. This ranking only includes countries with 15 or more sites.',
    },
  },
}

const BY_ISO = new Map(COUNTRIES.map((country) => [country.iso, country]))

export function isRankingMode(value: unknown): value is RankingMode {
  return typeof value === 'string' && (RANKING_MODES as readonly string[]).includes(value)
}

export function rankingOrder(mode: RankingMode): readonly string[] {
  return RANKING_ORDERS[mode] ?? []
}

export function rankingCount(mode: RankingMode): number {
  return (RANKING_ORDERS[mode] ?? []).length
}

export function rankingPlaceOf(mode: RankingMode, iso: string): number | null {
  const index = (RANKING_ORDERS[mode] ?? []).indexOf(iso)
  return index === -1 ? null : index + 1
}

export function rankingCountry(mode: RankingMode, iso: string): Country | undefined {
  if (!(RANKING_ORDERS[mode] ?? []).includes(iso)) return undefined
  return BY_ISO.get(iso)
}

export function rankingCountries(mode: RankingMode): Country[] {
  return (RANKING_ORDERS[mode] ?? []).flatMap((iso) => {
    const country = BY_ISO.get(iso)
    return country ? [country] : []
  })
}

export function rankingEasyCount(mode: RankingMode): number {
  const total = rankingCount(mode)
  return Math.min(total, Math.max(8, Math.ceil(total * 0.28)))
}

export function isRankingEasy(iso: string, mode: RankingMode): boolean {
  const place = rankingPlaceOf(mode, iso)
  return place !== null && place <= rankingEasyCount(mode)
}

export function rankingCite(mode: RankingMode, lang: string): RankingCite {
  const meta = META[mode]
  const ru = lang === 'ru'
  return {
    asOf: ru ? meta.asOf.ru : meta.asOf.en,
    source: ru ? meta.source.ru : meta.source.en,
    url: meta.url,
    count: rankingCount(mode),
    note: meta.note ? (ru ? meta.note.ru : meta.note.en) : undefined,
  }
}

export function rankingAbout(mode: RankingMode, lang: string): string {
  const about = META[mode].about
  return lang === 'ru' ? about.ru : about.en
}

export function rankingPlacesFor(iso: string): Array<{ mode: RankingMode; place: number }> {
  const rows: Array<{ mode: RankingMode; place: number }> = []
  for (const mode of RANKING_MODES) {
    const place = rankingPlaceOf(mode, iso)
    if (place !== null) rows.push({ mode, place })
  }
  return rows
}

export function nearbyRankingCountries(mode: RankingMode, iso: string, pool: Country[], n: number): Country[] {
  const order = RANKING_ORDERS[mode] ?? []
  const index = order.indexOf(iso)
  if (index === -1) return []
  const byIso = new Map(pool.map((country) => [country.iso, country]))
  const picked: Country[] = []
  const used = new Set([iso])
  for (let radius = 1; radius < order.length && picked.length < n; radius++) {
    for (const next of [index - radius, index + radius]) {
      if (next < 0 || next >= order.length) continue
      const country = byIso.get(order[next])
      if (!country || used.has(country.iso)) continue
      used.add(country.iso)
      picked.push(country)
      if (picked.length >= n) break
    }
  }
  return picked
}
