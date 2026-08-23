import { REGIONS } from '../data/countries'
import {
  EASY_MIX_MODES,
  HARD_MIX_MODES,
  isAllRegions,
  parseRegions,
  QUIZ_MODES,
  sameModes,
  type QuizDifficulty,
  type QuizMode,
  type RegionFilter,
} from '../lib/quiz'

export { REGIONS }

export type Lang = 'ru' | 'en'

type Strings = {
  title: string
  subtitle: string
  mode: string
  flagToName: string
  nameToFlag: string
  nameToCapital: string
  nameToCurrency: string
  nameToPopulation: string
  nameToFounded: string
  neighborsToName: string
  nameToMap: string
  mapToName: string
  whoseNeighbors: string
  whichCountry: string
  founded: string
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
  map: string
  explore: string
  mapHint: string
  mapSearch: string
  mapLoading: string
  mapCredit: string
  mapHoldoutHint: string
  mapRegion: string
  mapMove: string
  mapLeft: string
  mapRight: string
  mapUp: string
  mapDown: string
  territory: string
  dispute: string
  notInQuiz: string
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
  account: string
  signIn: string
  signUp: string
  signOut: string
  password: string
  passwordRepeat: string
  passwordHint: string
  accountSignedIn: string
  accountNeeded: string
  authInvalid: string
  authNameTaken: string
  authBadCredentials: string
  authPasswordMismatch: string
  authOffline: string
  settings: string
  settingsAccount: string
  settingsAbout: string
  settingsReport: string
  settingsAchievements: string
  avatars: string
  avatarChange: string
  avatarPickerHint: string
  avatarUpload: string
  avatarCropHint: string
  avatarCropApply: string
  avatarZoom: string
  achievementsUnlocked: (n: number, total: number) => string
  achievementTap: string
  profileName: string
  profileLanguage: string
  guestName: string
  guestHint: string
  saveProfile: string
  profileSaved: string
  modeStats: string
  modeStatsEmpty: string
  modeStatsRounds: (n: number) => string
  modeStatsCampaign: (cleared: number, total: number) => string
  aboutBody: string
  aboutModes: string
  reportHint: string
  reportSubject: string
  reportMessage: string
  reportSend: string
  reportSent: string
  reportDefaultTitle: string
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
  duel: string
  duelHint: string
  duelCreate: string
  duelJoin: string
  duelCode: string
  duelWaiting: string
  duelCopy: string
  duelCopied: string
  duelNotFound: string
  duelFull: string
  duelOffline: string
  duelPickModes: string
  duelPickModesHint: string
  easyMix: string
  hardMix: string
  easyMixNote: string
  hardMixNote: string
  duelVs: (name: string) => string
  duelWaitingOpponent: string
  duelOpponentDone: string
  duelOpponent: string
  duelWin: string
  duelLose: string
  duelDraw: string
  duelScore: (you: number, them: number, total: number) => string
  duelRematch: string
  duelRematchHint: string
  duelRematchWaiting: string
  duelRematchOffered: string
}

export const STRINGS: Record<Lang, Strings> = {
  ru: {
    title: 'Паспорт страны',
    subtitle: '193 страны. Без сокращений.',
    mode: 'Режим',
    flagToName: 'Флаг → страна',
    nameToFlag: 'Страна → флаг',
    nameToCapital: 'Страна → столица',
    nameToCurrency: 'Страна → валюта',
    nameToPopulation: 'Страна → население',
    nameToFounded: 'Страна → год основания',
    neighborsToName: 'Соседи → страна',
    nameToMap: 'Страна → карта',
    mapToName: 'Карта → страна',
    whoseNeighbors: 'Чьи это сухопутные соседи?',
    whichCountry: 'Какая это страна?',
    founded: 'Основание',
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
    map: 'Карта',
    explore: 'Разделы',
    mapHint: 'Нажмите страну — откроется паспорт',
    mapSearch: 'Найти страну',
    mapLoading: 'Загрузка карты…',
    mapCredit: 'Карта: MapSVG · CC BY 4.0',
    mapHoldoutHint: 'Золотистым отмечены территории вне викторины — не из 193 стран ООН.',
    mapRegion: 'Регион карты',
    mapMove: 'Движение по карте',
    mapLeft: 'Влево',
    mapRight: 'Вправо',
    mapUp: 'Вверх',
    mapDown: 'Вниз',
    territory: 'Территория',
    dispute: 'Спор',
    notInQuiz: 'Не в викторине',
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
    account: 'Аккаунт',
    signIn: 'Войти',
    signUp: 'Регистрация',
    signOut: 'Выйти',
    password: 'Пароль',
    passwordRepeat: 'Повторите пароль',
    passwordHint: 'Пароль — минимум 6 символов',
    accountSignedIn: 'Таблица лидеров пишет этот аккаунт',
    accountNeeded: 'Войдите, чтобы попасть в таблицу лидеров',
    authInvalid: 'Проверьте имя и пароль',
    authNameTaken: 'Это имя уже занято',
    authBadCredentials: 'Неверное имя или пароль',
    authPasswordMismatch: 'Пароли не совпадают',
    authOffline: 'Аккаунты пока недоступны',
    settings: 'Настройки',
    settingsAccount: 'Аккаунт',
    settingsAbout: 'О нас',
    settingsReport: 'Сообщить о проблеме',
    settingsAchievements: 'Ачивки',
    avatars: 'Аватар',
    avatarChange: 'Сменить',
    avatarPickerHint: 'Выберите значок или загрузите своё фото — его можно подвинуть под круг.',
    avatarUpload: 'Загрузить фото',
    avatarCropHint: 'Перетащите фото и подгоните масштаб, чтобы лицо попало в круг.',
    avatarCropApply: 'Обрезать',
    avatarZoom: 'Масштаб',
    achievementsUnlocked: (n, total) => `${n} из ${total}`,
    achievementTap: 'Нажмите ачивку — подпись снизу.',
    profileName: 'Имя',
    profileLanguage: 'Язык',
    guestName: 'Гость',
    guestHint: 'Имя и аватар хранятся на этом устройстве. Войдите, чтобы синхронизировать аккаунт.',
    saveProfile: 'Сохранить',
    profileSaved: 'Сохранено',
    modeStats: 'Успехи по режимам',
    modeStatsEmpty: 'Пока нет игр',
    modeStatsRounds: (n) => {
      const n10 = n % 10
      const n100 = n % 100
      if (n10 === 1 && n100 !== 11) return `${n} раунд`
      if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return `${n} раунда`
      return `${n} раундов`
    },
    modeStatsCampaign: (cleared, total) => `кампания ${cleared}/${total}`,
    aboutBody:
      'Паспорт страны — викторина по 193 государствам ООН: флаги, столицы, валюты, население, год основания, соседи и карты. Играйте соло, проходите кампанию или вызывайте друга на дуэль.',
    aboutModes: 'На каждой карточке страны — короткий факт. Открыли паспорт снова — увидите другой.',
    reportHint: 'Опишите, что сломалось или чего не хватает. Письмо откроется в почте на levumanskyy03@gmail.com.',
    reportSubject: 'Тема',
    reportMessage: 'Что случилось',
    reportSend: 'Написать письмо',
    reportSent: 'Почта открыта — отправьте письмо, если всё выглядит верно.',
    reportDefaultTitle: 'Проблема в Паспорте страны',
    leaderboard: 'Лидеры',
    leaderboardEmpty: 'Пока пусто — войдите и пройдите уровень',
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
    duel: 'Дуэль',
    duelHint: 'Один на один: создайте комнату или введите код.',
    duelCreate: 'Создать комнату',
    duelJoin: 'Войти',
    duelCode: 'Код комнаты',
    duelWaiting: 'Ждём соперника',
    duelCopy: 'Скопировать код',
    duelCopied: 'Скопировано',
    duelNotFound: 'Комната не найдена',
    duelFull: 'В этой комнате уже играют',
    duelOffline: 'Комнаты сейчас недоступны',
    duelPickModes: 'Режим дуэли',
    duelPickModesHint: 'Можно выбрать несколько — вопросы будут чередоваться',
    easyMix: 'Простой микс',
    hardMix: 'Сложный микс',
    easyMixNote: 'Флаг → страна · Страна → флаг · Страна → столица',
    hardMixNote: 'Микс из всех режимов',
    duelVs: (name) => `против ${name}`,
    duelWaitingOpponent: 'соперник ещё отвечает',
    duelOpponentDone: 'соперник ответил',
    duelOpponent: 'Соперник',
    duelWin: 'Победа',
    duelLose: 'Поражение',
    duelDraw: 'Ничья',
    duelScore: (you, them, total) => `${you} — ${them} из ${total}`,
    duelRematch: 'Реванш',
    duelRematchHint: 'Если оба нажмут — сыграете ещё раз в этой комнате.',
    duelRematchWaiting: 'Ждём, пока соперник примет реванш.',
    duelRematchOffered: 'Соперник предлагает реванш.',
  },
  en: {
    title: 'Country Passport',
    subtitle: '193 countries. No shortcuts.',
    mode: 'Mode',
    flagToName: 'Flag → country',
    nameToFlag: 'Country → flag',
    nameToCapital: 'Country → capital',
    nameToCurrency: 'Country → currency',
    nameToPopulation: 'Country → population',
    nameToFounded: 'Country → founding year',
    neighborsToName: 'Neighbors → country',
    nameToMap: 'Country → map',
    mapToName: 'Map → country',
    whoseNeighbors: 'Whose land neighbors are these?',
    whichCountry: 'Which country is this?',
    founded: 'Founded',
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
    map: 'Map',
    explore: 'Explore',
    mapHint: 'Tap a country to open its passport',
    mapSearch: 'Find a country',
    mapLoading: 'Loading the map…',
    mapCredit: 'Map: MapSVG · CC BY 4.0',
    mapHoldoutHint: 'Gold-tinted areas are outside the quiz — not among the 193 UN members.',
    mapRegion: 'Map region',
    mapMove: 'Move around the map',
    mapLeft: 'Left',
    mapRight: 'Right',
    mapUp: 'Up',
    mapDown: 'Down',
    territory: 'Territory',
    dispute: 'Dispute',
    notInQuiz: 'Not in the quiz',
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
    account: 'Account',
    signIn: 'Sign in',
    signUp: 'Register',
    signOut: 'Sign out',
    password: 'Password',
    passwordRepeat: 'Repeat password',
    passwordHint: 'Password — at least 6 characters',
    accountSignedIn: 'The leaderboard uses this account',
    accountNeeded: 'Sign in to appear on the leaderboard',
    authInvalid: 'Check the name and password',
    authNameTaken: 'That name is taken',
    authBadCredentials: 'Wrong name or password',
    authPasswordMismatch: 'Passwords do not match',
    authOffline: 'Accounts are unavailable right now',
    settings: 'Settings',
    settingsAccount: 'Account',
    settingsAbout: 'About',
    settingsReport: 'Report a problem',
    settingsAchievements: 'Achievements',
    avatars: 'Avatar',
    avatarChange: 'Change',
    avatarPickerHint: 'Pick an icon or upload a photo — you can drag it into the circle.',
    avatarUpload: 'Upload photo',
    avatarCropHint: 'Drag the photo and zoom so the face sits in the circle.',
    avatarCropApply: 'Crop',
    avatarZoom: 'Zoom',
    achievementsUnlocked: (n, total) => `${n} of ${total}`,
    achievementTap: 'Tap an achievement to read it.',
    profileName: 'Name',
    profileLanguage: 'Language',
    guestName: 'Guest',
    guestHint: 'Name and avatar stay on this device. Sign in to sync an account.',
    saveProfile: 'Save',
    profileSaved: 'Saved',
    modeStats: 'Progress by mode',
    modeStatsEmpty: 'No games yet',
    modeStatsRounds: (n) => (n === 1 ? '1 round' : `${n} rounds`),
    modeStatsCampaign: (cleared, total) => `campaign ${cleared}/${total}`,
    aboutBody:
      'Country Passport is a quiz of all 193 UN members: flags, capitals, currencies, population, founding years, neighbors and maps. Play solo, run the campaign, or duel a friend.',
    aboutModes: 'Each country card has a short fact. Open the passport again and you will see a different one.',
    reportHint: 'Describe what broke or what is missing. This opens an email to levumanskyy03@gmail.com.',
    reportSubject: 'Subject',
    reportMessage: 'What happened',
    reportSend: 'Write email',
    reportSent: 'Mail opened — send the message if it looks right.',
    reportDefaultTitle: 'Issue in Country Passport',
    leaderboard: 'Leaders',
    leaderboardEmpty: 'Empty for now — sign in and clear a level',
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
    duel: 'Duel',
    duelHint: 'One on one: create a room or enter a code.',
    duelCreate: 'Create room',
    duelJoin: 'Join',
    duelCode: 'Room code',
    duelWaiting: 'Waiting for opponent',
    duelCopy: 'Copy code',
    duelCopied: 'Copied',
    duelNotFound: 'Room not found',
    duelFull: 'This room is already full',
    duelOffline: 'Rooms are unavailable right now',
    duelPickModes: 'Duel mode',
    duelPickModesHint: 'Pick several — questions will alternate between them',
    easyMix: 'Easy mix',
    hardMix: 'Hard mix',
    easyMixNote: 'Flag → country · Country → flag · Country → capital',
    hardMixNote: 'Mix of all modes',
    duelVs: (name) => `vs ${name}`,
    duelWaitingOpponent: 'opponent is still answering',
    duelOpponentDone: 'opponent answered',
    duelOpponent: 'Opponent',
    duelWin: 'You win',
    duelLose: 'You lose',
    duelDraw: 'Draw',
    duelScore: (you, them, total) => `${you} — ${them} of ${total}`,
    duelRematch: 'Rematch',
    duelRematchHint: 'If both accept, the same room starts another round.',
    duelRematchWaiting: 'Waiting for your opponent to accept the rematch.',
    duelRematchOffered: 'Your opponent wants a rematch.',
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

export function modesLabel(modes: readonly QuizMode[], lang: Lang): string {
  const t = STRINGS[lang]
  const selected = QUIZ_MODES.filter((mode) => modes.includes(mode))
  if (sameModes(selected, EASY_MIX_MODES)) return t.easyMix
  if (sameModes(selected, HARD_MIX_MODES)) return t.hardMix
  if (selected.length === 0) return modeLabel('flagToName', lang)
  return selected.map((mode) => modeLabel(mode, lang)).join(' · ')
}

function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}
