import { REGIONS } from '../data/countries'
import { isAllRegions, parseRegions, type QuizDifficulty, type QuizMode, type RegionFilter } from '../lib/quiz'

export { REGIONS }

export type Lang = 'ru' | 'en'

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
  hardcore: string
  hardcoreHint: string
  levels: string
  learn: string
  learnHint: string
  learnLevelHint: string
  checkYourself: string
  backToCards: string
  countriesCount: (n: number) => string
  levelLabel: (n: number) => string
  livesLeft: (n: number) => string
  roundSize: string
  start: string
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
  nextLevel: string
  backToMenu: string
  noMistakes: string
  back: string
  timedOut: string
  totalTime: (clock: string) => string
  lives: string
  finalLevel: string
  finalLevelHint: string
  roundEndedTime: string
  roundEndedLives: string
  roundEndedHardcore: string
  avgTime: (seconds: string) => string
  slowestCountry: (name: string, seconds: string) => string
  history: string
  clearHistory: string
  savedOnDevice: string
  bests: string
  clearBests: string
  newBest: string
  bestOfSetup: (score: string, clock: string) => string
  playerName: string
  playerNameHint: string
  playerNameShort: string
  leaderboard: string
  leaderboardEmpty: string
  leaderboardOffline: string
  leaderboardProgress: (cleared: number, total: number) => string
  tapPassport: string
  capital: string
  population: string
  currency: string
  fact: string
  neighbors: string
  noNeighbors: string
  close: string
  credit: string
}

export const STRINGS: Record<Lang, Strings> = {
  ru: {
    title: 'Паспорт страны',
    subtitle: '193 страны. Без сокращений.',
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
    hardcore: 'Хардкор',
    hardcoreHint: 'Без права на ошибку',
    levels: 'Уровни',
    learn: 'Обучение',
    learnHint: 'Карточки без таймера. Потом можно проверить себя.',
    learnLevelHint: 'Нажмите уровень, чтобы открыть карточки',
    checkYourself: 'Проверить',
    backToCards: 'К карточкам',
    countriesCount: (n) => `${n} ${pluralRu(n, 'страна', 'страны', 'стран')}`,
    levelLabel: (n) => `Уровень ${n}`,
    livesLeft: (n) => `${n} ${pluralRu(n, 'жизнь', 'жизни', 'жизней')}`,
    roundSize: 'Стран в блоке',
    start: 'Начать',
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
    nextLevel: 'Следующий уровень',
    backToMenu: 'Вернуться в меню',
    noMistakes: 'Без ошибок — так держать',
    back: 'Назад',
    timedOut: 'Время вышло',
    totalTime: (clock) => `Время: ${clock}`,
    lives: 'Жизни',
    finalLevel: 'Уровень 20',
    finalLevelHint: 'Все 193 страны',
    roundEndedTime: 'Время вышло — раунд окончен',
    roundEndedLives: 'Три ошибки — раунд окончен',
    roundEndedHardcore: 'Одна ошибка — раунд окончен',
    avgTime: (seconds) => `Среднее на страну: ${seconds} с`,
    slowestCountry: (name, seconds) => `Дольше всего: ${name} · ${seconds} с`,
    history: 'Недавние раунды',
    clearHistory: 'Очистить',
    savedOnDevice: 'Сохранено на этом устройстве',
    bests: 'Лучшие результаты',
    clearBests: 'Сбросить рекорды',
    newBest: 'Новый рекорд этой настройки',
    bestOfSetup: (score, clock) => `Рекорд этой настройки: ${score} · ${clock}`,
    playerName: 'Имя в таблице',
    playerNameHint: 'Как вас записать',
    playerNameShort: 'Минимум два символа',
    leaderboard: 'Лидеры',
    leaderboardEmpty: 'Пока пусто — пройдите уровень с именем',
    leaderboardOffline: 'Общая таблица пока недоступна',
    leaderboardProgress: (cleared, total) => `${cleared}/${total}`,
    tapPassport: 'Нажмите страну — откроется паспорт',
    capital: 'Столица',
    population: 'Население',
    currency: 'Валюта',
    fact: 'Факт',
    neighbors: 'Сухопутные соседи',
    noNeighbors: 'Нет сухопутных соседей',
    close: 'Закрыть',
    credit: 'Создано Львом Уманским',
  },
  en: {
    title: 'Country Passport',
    subtitle: '193 countries. No shortcuts.',
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
    hardcore: 'Hardcore',
    hardcoreHint: 'No mistakes allowed',
    levels: 'Levels',
    learn: 'Learn',
    learnHint: 'Cards without a timer. Then test yourself.',
    learnLevelHint: 'Tap a level to open its cards',
    checkYourself: 'Test yourself',
    backToCards: 'Back to cards',
    countriesCount: (n) => `${n} ${n === 1 ? 'country' : 'countries'}`,
    levelLabel: (n) => `Level ${n}`,
    livesLeft: (n) => `${n} ${n === 1 ? 'life' : 'lives'}`,
    roundSize: 'Flags in the round',
    start: 'Start',
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
    nextLevel: 'Next level',
    backToMenu: 'Back to menu',
    noMistakes: 'No mistakes — well done',
    back: 'Back',
    timedOut: 'Time is up',
    totalTime: (clock) => `Time: ${clock}`,
    lives: 'Lives',
    finalLevel: 'Level 20',
    finalLevelHint: 'All 193 countries',
    roundEndedTime: 'Time is up — round over',
    roundEndedLives: 'Three mistakes — round over',
    roundEndedHardcore: 'One mistake — round over',
    avgTime: (seconds) => `Average per flag: ${seconds}s`,
    slowestCountry: (name, seconds) => `Slowest: ${name} · ${seconds}s`,
    history: 'Recent rounds',
    clearHistory: 'Clear',
    savedOnDevice: 'Saved on this device',
    bests: 'Best scores',
    clearBests: 'Reset records',
    newBest: 'New best for this setup',
    bestOfSetup: (score, clock) => `Best for this setup: ${score} · ${clock}`,
    playerName: 'Leaderboard name',
    playerNameHint: 'How you appear',
    playerNameShort: 'At least two characters',
    leaderboard: 'Leaders',
    leaderboardEmpty: 'Empty for now — clear a level with a name',
    leaderboardOffline: 'The shared board is unavailable',
    leaderboardProgress: (cleared, total) => `${cleared}/${total}`,
    tapPassport: 'Tap a country to open its passport',
    capital: 'Capital',
    population: 'Population',
    currency: 'Currency',
    fact: 'Fact',
    neighbors: 'Land neighbors',
    noNeighbors: 'No land neighbors',
    close: 'Close',
    credit: 'Created by Lev Umansky',
  },
}

export function regionLabel(region: RegionFilter, lang: Lang): string {
  const t = STRINGS[lang]
  if (isAllRegions(region)) return t.allRegions
  return parseRegions(region)
    .map((item) => t[item])
    .join(' · ')
}

export function difficultyLabel(difficulty: QuizDifficulty, lang: Lang): string {
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
