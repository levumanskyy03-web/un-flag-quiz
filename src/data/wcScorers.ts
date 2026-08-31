import { combinedTeamId, footballTeamCountry, uniqueIds, WORLD_CUP_WINNERS } from './worldCup'

export interface WcScorer {
  year: number
  countryIds: string[]
  nameEn: string
  nameRu: string
  goals: number
}

export const WC_SCORERS: WcScorer[] = [
  { year: 1930, countryIds: ['ar'], nameEn: 'Guillermo Stábile', nameRu: 'Гильермо Стабиле', goals: 8 },
  { year: 1934, countryIds: ['tch'], nameEn: 'Oldřich Nejedlý', nameRu: 'Олдржих Неедлы', goals: 5 },
  { year: 1938, countryIds: ['br'], nameEn: 'Leônidas', nameRu: 'Леонидас', goals: 7 },
  { year: 1950, countryIds: ['br'], nameEn: 'Ademir', nameRu: 'Адемир', goals: 8 },
  { year: 1954, countryIds: ['hu'], nameEn: 'Sándor Kocsis', nameRu: 'Шандор Кочиш', goals: 11 },
  { year: 1958, countryIds: ['fr'], nameEn: 'Just Fontaine', nameRu: 'Жюст Фонтен', goals: 13 },
  {
    year: 1962,
    countryIds: ['br', 'cl', 'hu', 'su', 'yu'],
    nameEn: 'Garrincha, Vavá, Sánchez, Albert, Ivanov, Jerković',
    nameRu: 'Гарринча, Вава, Санчес, Альберт, Иванов, Еркович',
    goals: 4,
  },
  { year: 1966, countryIds: ['pt'], nameEn: 'Eusébio', nameRu: 'Эйсебио', goals: 9 },
  { year: 1970, countryIds: ['de'], nameEn: 'Gerd Müller', nameRu: 'Герд Мюллер', goals: 10 },
  { year: 1974, countryIds: ['pl'], nameEn: 'Grzegorz Lato', nameRu: 'Гжегож Лято', goals: 7 },
  { year: 1978, countryIds: ['ar'], nameEn: 'Mario Kempes', nameRu: 'Марио Кемпес', goals: 6 },
  { year: 1982, countryIds: ['it'], nameEn: 'Paolo Rossi', nameRu: 'Паоло Росси', goals: 6 },
  { year: 1986, countryIds: ['eng'], nameEn: 'Gary Lineker', nameRu: 'Гари Линекер', goals: 6 },
  { year: 1990, countryIds: ['it'], nameEn: 'Salvatore Schillaci', nameRu: 'Сальваторе Скиллачи', goals: 6 },
  { year: 1994, countryIds: ['bg', 'ru'], nameEn: 'Hristo Stoichkov, Oleg Salenko', nameRu: 'Христо Стоичков, Олег Саленко', goals: 6 },
  { year: 1998, countryIds: ['hr'], nameEn: 'Davor Šuker', nameRu: 'Давор Шукер', goals: 6 },
  { year: 2002, countryIds: ['br'], nameEn: 'Ronaldo', nameRu: 'Роналдо', goals: 8 },
  { year: 2006, countryIds: ['de'], nameEn: 'Miroslav Klose', nameRu: 'Мирослав Клозе', goals: 5 },
  { year: 2010, countryIds: ['de'], nameEn: 'Thomas Müller', nameRu: 'Томас Мюллер', goals: 5 },
  { year: 2014, countryIds: ['co'], nameEn: 'James Rodríguez', nameRu: 'Хамес Родригес', goals: 6 },
  { year: 2018, countryIds: ['eng'], nameEn: 'Harry Kane', nameRu: 'Гарри Кейн', goals: 6 },
  { year: 2022, countryIds: ['fr'], nameEn: 'Kylian Mbappé', nameRu: 'Киллиан Мбаппе', goals: 8 },
]

export const WC_SCORER_EASY_FROM = 1998

export function wcScorerAnswerId(item: WcScorer): string {
  return item.countryIds.length === 1 ? item.countryIds[0] : combinedTeamId(item.countryIds)
}

export function wcScorerCountries() {
  const ids = new Set<string>()
  for (const item of WC_SCORERS) {
    ids.add(wcScorerAnswerId(item))
    for (const id of item.countryIds) ids.add(id)
  }
  return [...ids].map(footballTeamCountry)
}

export function wcScorerRelatedIds(year: number): string[] {
  const index = WC_SCORERS.findIndex((item) => item.year === year)
  if (index < 0) return []
  const current = WC_SCORERS[index]
  const answerId = wcScorerAnswerId(current)
  const prev = WC_SCORERS[index - 1]
  const next = WC_SCORERS[index + 1]
  const champion = WORLD_CUP_WINNERS.find((cup) => cup.year === year)?.winnerId
  return uniqueIds(
    [prev ? wcScorerAnswerId(prev) : undefined, next ? wcScorerAnswerId(next) : undefined, champion],
    answerId,
  )
}

export function scorerName(item: WcScorer, lang: string): string {
  return lang === 'ru' ? item.nameRu : item.nameEn
}
