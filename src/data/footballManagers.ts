export interface FootballManager {
  id: string
  en: string
  ru: string
  wiki: string
  nation: string
  wcWins: number[]
}

export const FOOTBALL_MANAGERS: FootballManager[] = [
  { id: 'pozzo', en: 'Vittorio Pozzo', ru: 'Витторио Поццо', wiki: 'Vittorio Pozzo', nation: 'it', wcWins: [1934, 1938] },
  { id: 'herberger', en: 'Sepp Herberger', ru: 'Зепп Хербергер', wiki: 'Sepp Herberger', nation: 'de', wcWins: [1954] },
  { id: 'feola', en: 'Vicente Feola', ru: 'Висенте Феола', wiki: 'Vicente Feola', nation: 'br', wcWins: [1958] },
  { id: 'moreira', en: 'Aymoré Moreira', ru: 'Айморе Морейра', wiki: 'Aymoré Moreira', nation: 'br', wcWins: [1962] },
  { id: 'ramsey', en: 'Alf Ramsey', ru: 'Альф Рамсей', wiki: 'Alf Ramsey', nation: 'eng', wcWins: [1966] },
  { id: 'zagallo', en: 'Mário Zagallo', ru: 'Марио Загалло', wiki: 'Mário Zagallo', nation: 'br', wcWins: [1970] },
  { id: 'schoen', en: 'Helmut Schön', ru: 'Хельмут Шён', wiki: 'Helmut Schön', nation: 'de', wcWins: [1974] },
  { id: 'menotti', en: 'César Luis Menotti', ru: 'Сесар Луис Менотти', wiki: 'César Luis Menotti', nation: 'ar', wcWins: [1978] },
  { id: 'bearzot', en: 'Enzo Bearzot', ru: 'Энцо Беарцот', wiki: 'Enzo Bearzot', nation: 'it', wcWins: [1982] },
  { id: 'bilardo', en: 'Carlos Bilardo', ru: 'Карлос Билардо', wiki: 'Carlos Salvador Bilardo', nation: 'ar', wcWins: [1986] },
  { id: 'beckenbauer-mgr', en: 'Franz Beckenbauer', ru: 'Франц Беккенбауэр', wiki: 'Franz Beckenbauer', nation: 'de', wcWins: [1990] },
  { id: 'parreira', en: 'Carlos Alberto Parreira', ru: 'Карлос Альберто Паррейра', wiki: 'Carlos Alberto Parreira', nation: 'br', wcWins: [1994] },
  { id: 'jacquet', en: 'Aimé Jacquet', ru: 'Эме Жаке', wiki: 'Aimé Jacquet', nation: 'fr', wcWins: [1998] },
  { id: 'scolari', en: 'Luiz Felipe Scolari', ru: 'Луиc Фелипе Сколари', wiki: 'Luiz Felipe Scolari', nation: 'br', wcWins: [2002] },
  { id: 'lippi', en: 'Marcello Lippi', ru: 'Марчелло Липпи', wiki: 'Marcello Lippi', nation: 'it', wcWins: [2006] },
  { id: 'delbosque', en: 'Vicente del Bosque', ru: 'Висенте дель Боске', wiki: 'Vicente del Bosque', nation: 'es', wcWins: [2010] },
  { id: 'loew', en: 'Joachim Löw', ru: 'Йоахим Лёв', wiki: 'Joachim Löw', nation: 'de', wcWins: [2014] },
  { id: 'deschamps', en: 'Didier Deschamps', ru: 'Дидье Дешам', wiki: 'Didier Deschamps', nation: 'fr', wcWins: [2018] },
  { id: 'scaloni', en: 'Lionel Scaloni', ru: 'Лионель Скалони', wiki: 'Lionel Scaloni', nation: 'ar', wcWins: [2022] },
]
