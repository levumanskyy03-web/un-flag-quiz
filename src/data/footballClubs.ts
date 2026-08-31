export interface FootballClub {
  id: string
  nation: string
  nameEn: string
  nameRu: string
}

export const FOOTBALL_CLUBS: Record<string, FootballClub> = {
  real: { id: 'real', nation: 'es', nameEn: 'Real Madrid', nameRu: 'Реал Мадрид' },
  benfica: { id: 'benfica', nation: 'pt', nameEn: 'Benfica', nameRu: 'Бенфика' },
  milan: { id: 'milan', nation: 'it', nameEn: 'Milan', nameRu: 'Милан' },
  inter: { id: 'inter', nation: 'it', nameEn: 'Inter', nameRu: 'Интер' },
  celtic: { id: 'celtic', nation: 'sct', nameEn: 'Celtic', nameRu: 'Селтик' },
  manutd: { id: 'manutd', nation: 'eng', nameEn: 'Manchester United', nameRu: 'Манчестер Юнайтед' },
  feyenoord: { id: 'feyenoord', nation: 'nl', nameEn: 'Feyenoord', nameRu: 'Фейеноорд' },
  ajax: { id: 'ajax', nation: 'nl', nameEn: 'Ajax', nameRu: 'Аякс' },
  bayern: { id: 'bayern', nation: 'de', nameEn: 'Bayern Munich', nameRu: 'Бавария' },
  liverpool: { id: 'liverpool', nation: 'eng', nameEn: 'Liverpool', nameRu: 'Ливерпуль' },
  forest: { id: 'forest', nation: 'eng', nameEn: 'Nottingham Forest', nameRu: 'Ноттингем Форест' },
  villa: { id: 'villa', nation: 'eng', nameEn: 'Aston Villa', nameRu: 'Астон Вилла' },
  hamburg: { id: 'hamburg', nation: 'de', nameEn: 'Hamburger SV', nameRu: 'Гамбург' },
  juve: { id: 'juve', nation: 'it', nameEn: 'Juventus', nameRu: 'Ювентус' },
  steaua: { id: 'steaua', nation: 'ro', nameEn: 'Steaua Bucharest', nameRu: 'Стяуа' },
  porto: { id: 'porto', nation: 'pt', nameEn: 'Porto', nameRu: 'Порту' },
  psv: { id: 'psv', nation: 'nl', nameEn: 'PSV', nameRu: 'ПСВ' },
  redstar: { id: 'redstar', nation: 'yu', nameEn: 'Red Star Belgrade', nameRu: 'Црвена Звезда' },
  barca: { id: 'barca', nation: 'es', nameEn: 'Barcelona', nameRu: 'Барселона' },
  marseille: { id: 'marseille', nation: 'fr', nameEn: 'Marseille', nameRu: 'Марсель' },
  dortmund: { id: 'dortmund', nation: 'de', nameEn: 'Borussia Dortmund', nameRu: 'Боруссия Дортмунд' },
  chelsea: { id: 'chelsea', nation: 'eng', nameEn: 'Chelsea', nameRu: 'Челси' },
  mancity: { id: 'mancity', nation: 'eng', nameEn: 'Manchester City', nameRu: 'Манчестер Сити' },
  psg: { id: 'psg', nation: 'fr', nameEn: 'Paris Saint-Germain', nameRu: 'ПСЖ' },
}

export function footballClub(id: string): FootballClub | undefined {
  return FOOTBALL_CLUBS[id]
}

export function clubNation(id: string): string | undefined {
  return FOOTBALL_CLUBS[id]?.nation
}
