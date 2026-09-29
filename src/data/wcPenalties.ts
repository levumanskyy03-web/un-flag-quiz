import type { Country } from '../lib/quiz/core'
import type { Lang } from '../i18n/lang'

export type WcPenaltyStage = 'r16' | 'quarter' | 'semi' | 'final'

export interface WcPenalty {
  id: string
  year: number
  stage: WcPenaltyStage
  winnerId: string
  loserId: string
  takerId: string
  nameEn: string
  nameRu: string
}

/** Knockout shoot-outs, 1982–2022. The taker is the kick that ended the series, or the winner's last goal if it ended on a miss. */
export const WC_PENALTIES: readonly WcPenalty[] = [
  { id: '1982-sf-de-fr', year: 1982, stage: 'semi', winnerId: 'de', loserId: 'fr', takerId: 'pen-hrubesch', nameEn: 'Horst Hrubesch', nameRu: 'Хорст Хрубеш' },
  { id: '1986-qf-fr-br', year: 1986, stage: 'quarter', winnerId: 'fr', loserId: 'br', takerId: 'pen-fernandez', nameEn: 'Luis Fernández', nameRu: 'Луис Фернандес' },
  { id: '1986-qf-de-mx', year: 1986, stage: 'quarter', winnerId: 'de', loserId: 'mx', takerId: 'pen-littbarski', nameEn: 'Pierre Littbarski', nameRu: 'Пьер Литтбарски' },
  { id: '1986-qf-be-es', year: 1986, stage: 'quarter', winnerId: 'be', loserId: 'es', takerId: 'pen-vanderelst', nameEn: 'Leo Van der Elst', nameRu: 'Лео Ван дер Эльст' },
  { id: '1990-r16-ie-ro', year: 1990, stage: 'r16', winnerId: 'ie', loserId: 'ro', takerId: 'pen-oleary', nameEn: "David O'Leary", nameRu: "Дэвид О'Лири" },
  { id: '1990-qf-ar-yu', year: 1990, stage: 'quarter', winnerId: 'ar', loserId: 'yu', takerId: 'pen-dezotti', nameEn: 'Gustavo Dezotti', nameRu: 'Густаво Десотти' },
  { id: '1990-sf-ar-it', year: 1990, stage: 'semi', winnerId: 'ar', loserId: 'it', takerId: 'pen-maradona', nameEn: 'Diego Maradona', nameRu: 'Диего Марадона' },
  { id: '1990-sf-de-eng', year: 1990, stage: 'semi', winnerId: 'de', loserId: 'eng', takerId: 'pen-thon', nameEn: 'Olaf Thon', nameRu: 'Олаф Тон' },
  { id: '1994-r16-bg-mx', year: 1994, stage: 'r16', winnerId: 'bg', loserId: 'mx', takerId: 'pen-letchkov', nameEn: 'Yordan Letchkov', nameRu: 'Йордан Лечков' },
  { id: '1994-qf-se-ro', year: 1994, stage: 'quarter', winnerId: 'se', loserId: 'ro', takerId: 'pen-larsson', nameEn: 'Henrik Larsson', nameRu: 'Хенрик Ларссон' },
  { id: '1994-f-br-it', year: 1994, stage: 'final', winnerId: 'br', loserId: 'it', takerId: 'pen-dunga', nameEn: 'Dunga', nameRu: 'Дунга' },
  { id: '1998-r16-ar-eng', year: 1998, stage: 'r16', winnerId: 'ar', loserId: 'eng', takerId: 'pen-ayala', nameEn: 'Roberto Ayala', nameRu: 'Роберто Айяла' },
  { id: '1998-qf-fr-it', year: 1998, stage: 'quarter', winnerId: 'fr', loserId: 'it', takerId: 'pen-blanc', nameEn: 'Laurent Blanc', nameRu: 'Лоран Блан' },
  { id: '1998-sf-br-nl', year: 1998, stage: 'semi', winnerId: 'br', loserId: 'nl', takerId: 'pen-dunga', nameEn: 'Dunga', nameRu: 'Дунга' },
  { id: '2002-r16-es-ie', year: 2002, stage: 'r16', winnerId: 'es', loserId: 'ie', takerId: 'pen-mendieta', nameEn: 'Gaizka Mendieta', nameRu: 'Гаиска Мендьета' },
  { id: '2002-qf-kr-es', year: 2002, stage: 'quarter', winnerId: 'kr', loserId: 'es', takerId: 'pen-hong', nameEn: 'Hong Myung-bo', nameRu: 'Хон Мён Бо' },
  { id: '2006-r16-ua-ch', year: 2006, stage: 'r16', winnerId: 'ua', loserId: 'ch', takerId: 'pen-husyev', nameEn: 'Andriy Husyev', nameRu: 'Андрей Гусев' },
  { id: '2006-qf-de-ar', year: 2006, stage: 'quarter', winnerId: 'de', loserId: 'ar', takerId: 'pen-borowski', nameEn: 'Tim Borowski', nameRu: 'Тим Боровски' },
  { id: '2006-qf-pt-eng', year: 2006, stage: 'quarter', winnerId: 'pt', loserId: 'eng', takerId: 'pen-ronaldo', nameEn: 'Cristiano Ronaldo', nameRu: 'Криштиану Роналду' },
  { id: '2006-f-it-fr', year: 2006, stage: 'final', winnerId: 'it', loserId: 'fr', takerId: 'pen-grosso', nameEn: 'Fabio Grosso', nameRu: 'Фабио Гроссо' },
  { id: '2010-r16-py-jp', year: 2010, stage: 'r16', winnerId: 'py', loserId: 'jp', takerId: 'pen-cardozo', nameEn: 'Óscar Cardozo', nameRu: 'Оскар Кардосо' },
  { id: '2010-qf-uy-gh', year: 2010, stage: 'quarter', winnerId: 'uy', loserId: 'gh', takerId: 'pen-abreu', nameEn: 'Sebastián Abreu', nameRu: 'Себастьян Абреу' },
  { id: '2014-r16-br-cl', year: 2014, stage: 'r16', winnerId: 'br', loserId: 'cl', takerId: 'pen-neymar', nameEn: 'Neymar', nameRu: 'Неймар' },
  { id: '2014-r16-cr-gr', year: 2014, stage: 'r16', winnerId: 'cr', loserId: 'gr', takerId: 'pen-umana', nameEn: 'Michael Umaña', nameRu: 'Майкл Уманья' },
  { id: '2014-qf-nl-cr', year: 2014, stage: 'quarter', winnerId: 'nl', loserId: 'cr', takerId: 'pen-kuyt', nameEn: 'Dirk Kuyt', nameRu: 'Дирк Кёйт' },
  { id: '2014-sf-ar-nl', year: 2014, stage: 'semi', winnerId: 'ar', loserId: 'nl', takerId: 'pen-rodriguez', nameEn: 'Maxi Rodríguez', nameRu: 'Макси Родригес' },
  { id: '2018-r16-ru-es', year: 2018, stage: 'r16', winnerId: 'ru', loserId: 'es', takerId: 'pen-cheryshev', nameEn: 'Denis Cheryshev', nameRu: 'Денис Черышев' },
  { id: '2018-r16-hr-dk', year: 2018, stage: 'r16', winnerId: 'hr', loserId: 'dk', takerId: 'pen-rakitic', nameEn: 'Ivan Rakitić', nameRu: 'Иван Ракитич' },
  { id: '2018-r16-eng-co', year: 2018, stage: 'r16', winnerId: 'eng', loserId: 'co', takerId: 'pen-dier', nameEn: 'Eric Dier', nameRu: 'Эрик Дайер' },
  { id: '2018-qf-hr-ru', year: 2018, stage: 'quarter', winnerId: 'hr', loserId: 'ru', takerId: 'pen-rakitic', nameEn: 'Ivan Rakitić', nameRu: 'Иван Ракитич' },
  { id: '2022-r16-hr-jp', year: 2022, stage: 'r16', winnerId: 'hr', loserId: 'jp', takerId: 'pen-pasalic', nameEn: 'Mario Pašalić', nameRu: 'Марио Пашалич' },
  { id: '2022-r16-ma-es', year: 2022, stage: 'r16', winnerId: 'ma', loserId: 'es', takerId: 'pen-hakimi', nameEn: 'Achraf Hakimi', nameRu: 'Ашраф Хакими' },
  { id: '2022-qf-hr-br', year: 2022, stage: 'quarter', winnerId: 'hr', loserId: 'br', takerId: 'pen-orsic', nameEn: 'Mislav Oršić', nameRu: 'Мислав Оршич' },
  { id: '2022-qf-ar-nl', year: 2022, stage: 'quarter', winnerId: 'ar', loserId: 'nl', takerId: 'pen-martinez', nameEn: 'Lautaro Martínez', nameRu: 'Лаутаро Мартинес' },
  { id: '2022-f-ar-fr', year: 2022, stage: 'final', winnerId: 'ar', loserId: 'fr', takerId: 'pen-montiel', nameEn: 'Gonzalo Montiel', nameRu: 'Гонсало Монтиель' },
]

const byId = new Map(WC_PENALTIES.map((item) => [item.id, item]))
const byTaker = new Map<string, WcPenalty>()
for (const item of WC_PENALTIES) {
  if (!byTaker.has(item.takerId)) byTaker.set(item.takerId, item)
}

export function penaltyById(id: string): WcPenalty | undefined {
  return byId.get(id)
}

export function penaltyTakerName(id: string, lang: Lang): string | null {
  const item = byTaker.get(id)
  if (!item) return null
  return lang === 'ru' ? item.nameRu : item.nameEn
}

export function penaltyTakerCountry(id: string): Country | undefined {
  const item = byTaker.get(id)
  return item ? penaltyCountry(item) : undefined
}

export function penaltyCountry(item: WcPenalty): Country {
  return {
    iso: item.takerId,
    nameEn: item.nameEn,
    nameRu: item.nameRu,
    region: 'europe',
    difficulty: 'easy',
  }
}

export function penaltyYears(): number[] {
  return [...new Set(WC_PENALTIES.map((item) => item.year))]
}
