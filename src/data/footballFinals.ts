export interface FootballFinal {
  year: number
  score: string
  aet?: boolean
  pens?: string
  replay?: string
  golden?: boolean
  cityEn: string
  cityRu: string
}

export const WORLD_CUP_FINALS: FootballFinal[] = [
  { year: 1930, score: '4–2', cityEn: 'Montevideo', cityRu: 'Монтевидео' },
  { year: 1934, score: '2–1', aet: true, cityEn: 'Rome', cityRu: 'Рим' },
  { year: 1938, score: '4–2', cityEn: 'Paris', cityRu: 'Париж' },
  { year: 1950, score: '2–1', cityEn: 'Rio de Janeiro', cityRu: 'Рио-де-Жанейро' },
  { year: 1954, score: '3–2', cityEn: 'Bern', cityRu: 'Берн' },
  { year: 1958, score: '5–2', cityEn: 'Stockholm', cityRu: 'Стокгольм' },
  { year: 1962, score: '3–1', cityEn: 'Santiago', cityRu: 'Сантьяго' },
  { year: 1966, score: '4–2', aet: true, cityEn: 'London', cityRu: 'Лондон' },
  { year: 1970, score: '4–1', cityEn: 'Mexico City', cityRu: 'Мехико' },
  { year: 1974, score: '2–1', cityEn: 'Munich', cityRu: 'Мюнхен' },
  { year: 1978, score: '3–1', aet: true, cityEn: 'Buenos Aires', cityRu: 'Буэнос-Айрес' },
  { year: 1982, score: '3–1', cityEn: 'Madrid', cityRu: 'Мадрид' },
  { year: 1986, score: '3–2', cityEn: 'Mexico City', cityRu: 'Мехико' },
  { year: 1990, score: '1–0', cityEn: 'Rome', cityRu: 'Рим' },
  { year: 1994, score: '0–0', aet: true, pens: '3–2', cityEn: 'Pasadena', cityRu: 'Пасадина' },
  { year: 1998, score: '3–0', cityEn: 'Saint-Denis', cityRu: 'Сен-Дени' },
  { year: 2002, score: '2–0', cityEn: 'Yokohama', cityRu: 'Иокогама' },
  { year: 2006, score: '1–1', aet: true, pens: '5–3', cityEn: 'Berlin', cityRu: 'Берлин' },
  { year: 2010, score: '1–0', aet: true, cityEn: 'Johannesburg', cityRu: 'Йоханнесбург' },
  { year: 2014, score: '1–0', aet: true, cityEn: 'Rio de Janeiro', cityRu: 'Рио-де-Жанейро' },
  { year: 2018, score: '4–2', cityEn: 'Moscow', cityRu: 'Москва' },
  { year: 2022, score: '3–3', aet: true, pens: '4–2', cityEn: 'Lusail', cityRu: 'Лусаил' },
]

export const EURO_FINALS: FootballFinal[] = [
  { year: 1960, score: '2–1', aet: true, cityEn: 'Paris', cityRu: 'Париж' },
  { year: 1964, score: '2–1', cityEn: 'Madrid', cityRu: 'Мадрид' },
  { year: 1968, score: '2–0', replay: '1–1', cityEn: 'Rome', cityRu: 'Рим' },
  { year: 1972, score: '3–0', cityEn: 'Brussels', cityRu: 'Брюссель' },
  { year: 1976, score: '2–2', aet: true, pens: '5–3', cityEn: 'Belgrade', cityRu: 'Белград' },
  { year: 1980, score: '2–1', cityEn: 'Rome', cityRu: 'Рим' },
  { year: 1984, score: '2–0', cityEn: 'Paris', cityRu: 'Париж' },
  { year: 1988, score: '2–0', cityEn: 'Munich', cityRu: 'Мюнхен' },
  { year: 1992, score: '2–0', cityEn: 'Gothenburg', cityRu: 'Гётеборг' },
  { year: 1996, score: '2–1', aet: true, golden: true, cityEn: 'London', cityRu: 'Лондон' },
  { year: 2000, score: '2–1', aet: true, golden: true, cityEn: 'Rotterdam', cityRu: 'Роттердам' },
  { year: 2004, score: '1–0', cityEn: 'Lisbon', cityRu: 'Лиссабон' },
  { year: 2008, score: '1–0', cityEn: 'Vienna', cityRu: 'Вена' },
  { year: 2012, score: '4–0', cityEn: 'Kyiv', cityRu: 'Киев' },
  { year: 2016, score: '1–0', aet: true, cityEn: 'Saint-Denis', cityRu: 'Сен-Дени' },
  { year: 2020, score: '1–1', aet: true, pens: '3–2', cityEn: 'London', cityRu: 'Лондон' },
  { year: 2024, score: '2–1', cityEn: 'Berlin', cityRu: 'Берлин' },
]

const WC_FINAL_BY_YEAR = new Map(WORLD_CUP_FINALS.map((item) => [item.year, item]))
const EURO_FINAL_BY_YEAR = new Map(EURO_FINALS.map((item) => [item.year, item]))

export function worldCupFinal(year: number): FootballFinal | undefined {
  return WC_FINAL_BY_YEAR.get(year)
}

export function euroFinal(year: number): FootballFinal | undefined {
  return EURO_FINAL_BY_YEAR.get(year)
}

export function formatFinalScore(
  final: FootballFinal,
  labels: { aet: string; pens: string; replay: string; golden: string },
): string {
  if (final.replay) return `${final.replay}, ${final.score} (${labels.replay})`
  if (final.pens) return `${final.score} (${final.pens} ${labels.pens})`
  if (final.golden) return `${final.score} (${labels.golden})`
  if (final.aet) return `${final.score} (${labels.aet})`
  return final.score
}

export function finalCity(final: FootballFinal, lang: string): string {
  return lang === 'ru' ? final.cityRu : final.cityEn
}
