import type { Difficulty, Region } from '../data/countries'
import type { QuizMode, RegionFilter } from '../lib/quiz'

export type Lang = 'ru' | 'en'

export const REGIONS: Region[] = ['africa', 'americas', 'asia', 'europe', 'oceania']

type Strings = {
  title: string
  subtitle: string
  mode: string
  flagToName: string
  nameToFlag: string
  region: string
  allRegions: string
  africa: string
  americas: string
  asia: string
  europe: string
  oceania: string
  difficulty: string
  easy: string
  hard: string
  start: string
  poolCount: (n: number) => string
  questionOf: (i: number, total: number) => string
  next: string
  seeResults: string
  results: string
  score: (correct: number, total: number) => string
  perfect: string
  great: string
  good: string
  keepGoing: string
  mistakes: string
  yourAnswer: string
  correctAnswer: string
  playAgain: string
  noMistakes: string
  back: string
  timedOut: string
  totalTime: (clock: string) => string
}

export const STRINGS: Record<Lang, Strings> = {
  ru: {
    title: 'Флаги ООН',
    subtitle: 'Викторина по флагам стран — членов ООН',
    mode: 'Режим',
    flagToName: 'Флаг → страна',
    nameToFlag: 'Страна → флаг',
    region: 'Регион',
    allRegions: 'Все регионы',
    africa: 'Африка',
    americas: 'Америка',
    asia: 'Азия',
    europe: 'Европа',
    oceania: 'Океания',
    difficulty: 'Сложность',
    easy: 'Проще',
    hard: 'Сложнее',
    start: 'Начать',
    poolCount: (n) => `${n} ${pluralRu(n, 'страна', 'страны', 'стран')} в пуле`,
    questionOf: (i, total) => `Вопрос ${i} из ${total}`,
    next: 'Далее',
    seeResults: 'К итогам',
    results: 'Итоги',
    score: (correct, total) => `${correct} из ${total}`,
    perfect: 'Идеально!',
    great: 'Отлично!',
    good: 'Хорошо!',
    keepGoing: 'Есть куда расти',
    mistakes: 'Ошибки',
    yourAnswer: 'Ваш ответ',
    correctAnswer: 'Правильно',
    playAgain: 'Ещё раз',
    noMistakes: 'Без ошибок — так держать',
    back: 'Назад',
    timedOut: 'Время вышло',
    totalTime: (clock) => `Время: ${clock}`,
  },
  en: {
    title: 'UN Flags',
    subtitle: 'A quiz of United Nations member flags',
    mode: 'Mode',
    flagToName: 'Flag → country',
    nameToFlag: 'Country → flag',
    region: 'Region',
    allRegions: 'All regions',
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    difficulty: 'Difficulty',
    easy: 'Easier',
    hard: 'Harder',
    start: 'Start',
    poolCount: (n) => `${n} ${n === 1 ? 'country' : 'countries'} in the pool`,
    questionOf: (i, total) => `Question ${i} of ${total}`,
    next: 'Next',
    seeResults: 'See results',
    results: 'Results',
    score: (correct, total) => `${correct} of ${total}`,
    perfect: 'Perfect!',
    great: 'Great job!',
    good: 'Nice work!',
    keepGoing: 'Keep practicing',
    mistakes: 'Mistakes',
    yourAnswer: 'Your answer',
    correctAnswer: 'Correct',
    playAgain: 'Play again',
    noMistakes: 'No mistakes — well done',
    back: 'Back',
    timedOut: 'Time is up',
    totalTime: (clock) => `Time: ${clock}`,
  },
}

export function regionLabel(region: RegionFilter, lang: Lang): string {
  const t = STRINGS[lang]
  if (region === 'all') return t.allRegions
  return t[region]
}

export function difficultyLabel(difficulty: Difficulty, lang: Lang): string {
  return STRINGS[lang][difficulty]
}

export function modeLabel(mode: QuizMode, lang: Lang): string {
  return STRINGS[lang][mode]
}

function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}
