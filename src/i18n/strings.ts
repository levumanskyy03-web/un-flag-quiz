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
import { EXTRA_STRINGS } from './extra'
import { type Lang } from './lang'

export { REGIONS }
export { LANGS, LANG_NATIVE, LANG_SHORT, isLang, isRtl, langDir, localeTag, type Lang } from './lang'

export type Strings = {
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
  factsToName: string
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
  freePlay: string
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
  passwordCurrent: string
  passwordNew: string
  passwordChange: string
  passwordChanged: string
  nameChangeHint: string
  accountSignedIn: string
  accountNeeded: string
  authInvalid: string
  authNameTaken: string
  authNameBlocked: string
  authNameCooldown: string
  authBadCredentials: string
  authPasswordMismatch: string
  authPasswordSame: string
  authWrongPassword: string
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
  xpTotal: (amount: string) => string
  xpGained: (amount: string) => string
  accountLevel: (n: number) => string
  accountLevelNext: (amount: string) => string
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
  ratings: string
  ratingsXp: string
  ratingsLevels: string
  ratingsAll: string
  ratingsXpHint: string
  ratingsLevelsHint: string
  ratingsHardcoreHint: string
  ratingsRecordHint: string
  worldRecord: string
  worldRecordBeat: string
  worldRecordBonus: (amount: string) => string
  worldRecordEmpty: string
  worldRecordLine: (name: string, time: string) => string
  worldRecordHint: string
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
  factsHint: string
  factOf: (i: number, total: number) => string
  factUniqueness: (n: number) => string
  factGuess: string
  factWrong: string
  factWrongs: (used: number, limit: number) => string
  factFailed: string
  factGuessedAt: (n: number) => string
  factNext: string
  factCapital: (name: string) => string
  factCurrency: (name: string) => string
  factRegionClue: (region: string) => string
  factNoLandBorders: string
  factLandlocked: string
  factNeighborCount: (n: number) => string
  factBorders: (name: string) => string
  factFoundedYear: (year: number) => string
  factPopulationExact: (n: string) => string
  factFlagColor: (color: string) => string
  factFlagHorizontal: string
  factFlagVertical: string
  factFlagDiagonal: string
  factFlagCanton: string
  factFlagNordic: string
  factFlagCross: string
  factFlagSaltire: string
  factFlagTriangle: string
  factFlagStar: string
  factFlagCrescent: string
  factFlagDisc: string
  factFlagUnionJack: string
  factPopTiny: string
  factPopSmall: string
  factPopMedium: string
  factPopLarge: string
  factPopHuge: string
  factFoundedPre1800: string
  factFounded1800s: string
  factFounded1900: string
  factFounded1945: string
  factFounded1970: string
  factNeighbors1: string
  factNeighbors2to3: string
  factNeighbors4to6: string
  factNeighbors7plus: string
  factDrivesLeft: string
  factSouthernHemisphere: string
  factLangEn: string
  factLangFr: string
  factLangEs: string
  factLangAr: string
  factLangPt: string
  factWaterPacific: string
  factWaterAtlantic: string
  factWaterIndian: string
  factWaterMediterranean: string
  factWaterBlackSea: string
  factWaterBaltic: string
  factWaterCaribbean: string
  factMonarchy: string
  factFederal: string
  factNato: string
  flagColorRed: string
  flagColorBlue: string
  flagColorGreen: string
  flagColorYellow: string
  flagColorBlack: string
  flagColorWhite: string
  flagColorOrange: string
  duelFactsRegion: string
  duelFactsRules: string
  duelFactsUntilCorrect: string
  duelFactsUntilCorrectHint: string
  duelFactsThreeWrong: string
  duelFactsUnlimited: string
  duelFactsMaxFive: string
  duelFactsHardcore: string
  duelFactsHardcoreHint: string
  duelFactsSeries: string
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
    factsToName: 'Факты → страна',
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
    freePlay: 'Вольное',
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
    passwordCurrent: 'Текущий пароль',
    passwordNew: 'Новый пароль',
    passwordChange: 'Сменить пароль',
    passwordChanged: 'Пароль обновлён',
    nameChangeHint: 'Ник можно сменить не чаще чем раз в месяц.',
    accountSignedIn: 'Таблица лидеров пишет этот аккаунт',
    accountNeeded: 'Войдите, чтобы попасть в таблицу лидеров',
    authInvalid: 'Проверьте имя и пароль',
    authNameTaken: 'Это имя уже занято',
    authNameBlocked: 'Это имя нельзя использовать',
    authNameCooldown: 'Имя можно менять раз в месяц',
    authBadCredentials: 'Неверное имя или пароль',
    authPasswordMismatch: 'Пароли не совпадают',
    authPasswordSame: 'Новый пароль должен отличаться от текущего',
    authWrongPassword: 'Неверный текущий пароль',
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
    xpTotal: (amount) => `${amount} опыта`,
    xpGained: (amount) => `+${amount} опыта`,
    accountLevel: (n) => `Уровень ${n}`,
    accountLevelNext: (amount) => `до следующего: ${amount}`,
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
    ratings: 'Рейтинг',
    ratingsXp: 'Опыт',
    ratingsLevels: 'Уровни',
    ratingsAll: 'Все',
    ratingsXpHint: 'По очкам опыта и уровню аккаунта',
    ratingsLevelsHint: 'По числу пройденных уровней. Ошибки и время не считаются.',
    ratingsHardcoreHint: 'Только прохождения в хардкоре',
    ratingsRecordHint: 'На каждом уровне — только лучший результат',
    worldRecord: 'Мировой рекорд',
    worldRecordBeat: 'Рекорд обновлён!',
    worldRecordBonus: (amount) => `+${amount} опыта за рекорд`,
    worldRecordEmpty: 'Пока нет рекорда',
    worldRecordLine: (name, time) => `${name} · ${time}`,
    worldRecordHint: 'Под номером уровня — лучший результат среди всех игроков.',
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
    factsHint: 'Не входит в уровни. Первые 5 фактов — 10 секунд, дальше — 15. 10 фактов, 3 ошибки — попытка проиграна.',
    factOf: (i, total) => `Факт ${i} из ${total}`,
    factUniqueness: (n) => `уникальность ${n}`,
    factGuess: 'Название страны',
    factWrong: 'Неверно',
    factWrongs: (used, limit) => `Ошибки: ${used} из ${limit}`,
    factFailed: 'Страна не отгадана',
    factGuessedAt: (n) => `Ответ на факте ${n}`,
    factNext: 'Дальше',
    factCapital: (name) => `Столица — ${name}.`,
    factCurrency: (name) => `Валюта — ${name}.`,
    factRegionClue: (region) => `Эта страна находится в регионе: ${region}.`,
    factNoLandBorders: 'У этой страны нет сухопутных границ с другими членами ООН.',
    factLandlocked: 'Эта страна не имеет выхода к морю.',
    factNeighborCount: (n) => `Число сухопутных соседей — ${n}.`,
    factBorders: (name) => `Эта страна имеет сухопутную границу с: ${name}.`,
    factFoundedYear: (year) => `Год основания или независимости — ${year}.`,
    factPopulationExact: (n) => `Население — ${n} человек.`,
    factFlagColor: (color) => `На флаге есть цвет: ${color}.`,
    factFlagHorizontal: 'Флаг состоит из горизонтальных полос.',
    factFlagVertical: 'Флаг состоит из вертикальных полос.',
    factFlagDiagonal: 'На флаге есть диагональная полоса.',
    factFlagCanton: 'У флага есть кантон в верхнем углу у древка.',
    factFlagNordic: 'На флаге скандинавский крест.',
    factFlagCross: 'На флаге есть прямой крест.',
    factFlagSaltire: 'На флаге есть косой крест.',
    factFlagTriangle: 'На флаге есть треугольник у древка.',
    factFlagStar: 'На флаге есть звезда.',
    factFlagCrescent: 'На флаге есть полумесяц.',
    factFlagDisc: 'На флаге есть круг или диск.',
    factFlagUnionJack: 'На флаге есть британский Union Jack.',
    factPopTiny: 'Население меньше миллиона человек.',
    factPopSmall: 'Население от 1 до 10 миллионов человек.',
    factPopMedium: 'Население от 10 до 50 миллионов человек.',
    factPopLarge: 'Население от 50 до 100 миллионов человек.',
    factPopHuge: 'Население больше 100 миллионов человек.',
    factFoundedPre1800: 'Страна основана или получила независимость до 1800 года.',
    factFounded1800s: 'Страна основана или получила независимость в XIX веке.',
    factFounded1900: 'Страна основана или получила независимость в 1900–1944 годах.',
    factFounded1945: 'Страна основана или получила независимость в 1945–1969 годах.',
    factFounded1970: 'Страна основана или получила независимость в 1970 году или позже.',
    factNeighbors1: 'Ровно один сухопутный сосед.',
    factNeighbors2to3: 'Два или три сухопутных соседа.',
    factNeighbors4to6: 'От четырёх до шести сухопутных соседей.',
    factNeighbors7plus: 'Больше шести сухопутных соседей.',
    factDrivesLeft: 'В этой стране левостороннее движение.',
    factSouthernHemisphere: 'Столица этой страны находится в Южном полушарии.',
    factLangEn: 'Один из официальных языков — английский.',
    factLangFr: 'Один из официальных языков — французский.',
    factLangEs: 'Один из официальных языков — испанский.',
    factLangAr: 'Один из официальных языков — арабский.',
    factLangPt: 'Один из официальных языков — португальский.',
    factWaterPacific: 'Эта страна имеет выход к Тихому океану.',
    factWaterAtlantic: 'Эта страна имеет выход к Атлантическому океану.',
    factWaterIndian: 'Эта страна имеет выход к Индийскому океану.',
    factWaterMediterranean: 'Эта страна имеет выход к Средиземному морю.',
    factWaterBlackSea: 'Эта страна имеет выход к Чёрному морю.',
    factWaterBaltic: 'Эта страна имеет выход к Балтийскому морю.',
    factWaterCaribbean: 'Эта страна имеет выход к Карибскому морю.',
    factMonarchy: 'Эта страна — монархия.',
    factFederal: 'Это федеративное государство.',
    factNato: 'Эта страна входит в НАТО.',
    flagColorRed: 'красный',
    flagColorBlue: 'синий',
    flagColorGreen: 'зелёный',
    flagColorYellow: 'жёлтый',
    flagColorBlack: 'чёрный',
    flagColorWhite: 'белый',
    flagColorOrange: 'оранжевый',
    duelFactsRegion: 'Регион дуэли',
    duelFactsRules: 'Условие игры',
    duelFactsUntilCorrect: 'До правильного ответа',
    duelFactsUntilCorrectHint: 'Лимит 10 фактов и ошибки не действуют',
    duelFactsThreeWrong: 'До 3 неверных вводов',
    duelFactsUnlimited: 'До последнего факта, без ограничений',
    duelFactsMaxFive: 'Не более 5 фактов',
    duelFactsHardcore: 'Хардкор',
    duelFactsHardcoreHint: '7 фактов, без ошибок. Первые 5 — 10 секунд, дальше — 15. «Дальше» листает факт у обоих.',
    duelFactsSeries: 'Стран за дуэль',
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
    factsToName: 'Facts → country',
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
    freePlay: 'Free play',
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
    passwordCurrent: 'Current password',
    passwordNew: 'New password',
    passwordChange: 'Change password',
    passwordChanged: 'Password updated',
    nameChangeHint: 'You can change your name once a month.',
    accountSignedIn: 'The leaderboard uses this account',
    accountNeeded: 'Sign in to appear on the leaderboard',
    authInvalid: 'Check the name and password',
    authNameTaken: 'That name is taken',
    authNameBlocked: 'That name isn’t allowed',
    authNameCooldown: 'You can change your name once a month',
    authBadCredentials: 'Wrong name or password',
    authPasswordMismatch: 'Passwords do not match',
    authPasswordSame: 'New password must be different',
    authWrongPassword: 'Current password is wrong',
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
    xpTotal: (amount) => `${amount} XP`,
    xpGained: (amount) => `+${amount} XP`,
    accountLevel: (n) => `Level ${n}`,
    accountLevelNext: (amount) => `to next: ${amount}`,
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
    ratings: 'Ratings',
    ratingsXp: 'XP',
    ratingsLevels: 'Levels',
    ratingsAll: 'All',
    ratingsXpHint: 'By experience points and account level',
    ratingsLevelsHint: 'By levels cleared. Mistakes and time do not count.',
    ratingsHardcoreHint: 'Hardcore clears only',
    ratingsRecordHint: 'Only the best result on each level',
    worldRecord: 'World record',
    worldRecordBeat: 'Record broken!',
    worldRecordBonus: (amount) => `+${amount} XP for the record`,
    worldRecordEmpty: 'No record yet',
    worldRecordLine: (name, time) => `${name} · ${time}`,
    worldRecordHint: 'Under each level — the best result among all players.',
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
    factsHint: 'Not in the campaign. First 5 facts are 10 seconds, then 15. 10 facts, 3 wrong guesses fail the attempt.',
    factOf: (i, total) => `Fact ${i} of ${total}`,
    factUniqueness: (n) => `uniqueness ${n}`,
    factGuess: 'Country name',
    factWrong: 'Wrong',
    factWrongs: (used, limit) => `Wrong: ${used} of ${limit}`,
    factFailed: 'Country not guessed',
    factGuessedAt: (n) => `Guessed on fact ${n}`,
    factNext: 'Next',
    factCapital: (name) => `The capital is ${name}.`,
    factCurrency: (name) => `The currency is the ${name}.`,
    factRegionClue: (region) => `This country is in ${region}.`,
    factNoLandBorders: 'This country has no land borders with other UN member states.',
    factLandlocked: 'This country is landlocked.',
    factNeighborCount: (n) => `This country has ${n} land neighbors.`,
    factBorders: (name) => `This country shares a land border with ${name}.`,
    factFoundedYear: (year) => `This country was founded or became independent in ${year}.`,
    factPopulationExact: (n) => `The population is ${n}.`,
    factFlagColor: (color) => `The flag contains the color ${color}.`,
    factFlagHorizontal: 'The flag is made of horizontal stripes.',
    factFlagVertical: 'The flag is made of vertical stripes.',
    factFlagDiagonal: 'The flag has a diagonal stripe.',
    factFlagCanton: 'The flag has a canton in the upper hoist corner.',
    factFlagNordic: 'The flag has a Nordic cross.',
    factFlagCross: 'The flag has a straight cross.',
    factFlagSaltire: 'The flag has a saltire (diagonal cross).',
    factFlagTriangle: 'The flag has a triangle at the hoist.',
    factFlagStar: 'The flag has a star.',
    factFlagCrescent: 'The flag has a crescent.',
    factFlagDisc: 'The flag has a disc or circle.',
    factFlagUnionJack: 'The flag includes the British Union Jack.',
    factPopTiny: 'The population is under one million.',
    factPopSmall: 'The population is between 1 and 10 million.',
    factPopMedium: 'The population is between 10 and 50 million.',
    factPopLarge: 'The population is between 50 and 100 million.',
    factPopHuge: 'The population is over 100 million.',
    factFoundedPre1800: 'This country was founded or became independent before 1800.',
    factFounded1800s: 'This country was founded or became independent in the 19th century.',
    factFounded1900: 'This country was founded or became independent in 1900–1944.',
    factFounded1945: 'This country was founded or became independent in 1945–1969.',
    factFounded1970: 'This country was founded or became independent in 1970 or later.',
    factNeighbors1: 'This country has exactly one land neighbor.',
    factNeighbors2to3: 'This country has two or three land neighbors.',
    factNeighbors4to6: 'This country has four to six land neighbors.',
    factNeighbors7plus: 'This country has more than six land neighbors.',
    factDrivesLeft: 'This country drives on the left.',
    factSouthernHemisphere: 'This country’s capital is in the Southern Hemisphere.',
    factLangEn: 'English is an official language.',
    factLangFr: 'French is an official language.',
    factLangEs: 'Spanish is an official language.',
    factLangAr: 'Arabic is an official language.',
    factLangPt: 'Portuguese is an official language.',
    factWaterPacific: 'This country has a Pacific coast.',
    factWaterAtlantic: 'This country has an Atlantic coast.',
    factWaterIndian: 'This country has an Indian Ocean coast.',
    factWaterMediterranean: 'This country has a Mediterranean coast.',
    factWaterBlackSea: 'This country has a Black Sea coast.',
    factWaterBaltic: 'This country has a Baltic Sea coast.',
    factWaterCaribbean: 'This country has a Caribbean coast.',
    factMonarchy: 'This country is a monarchy.',
    factFederal: 'This country is a federation.',
    factNato: 'This country is a NATO member.',
    flagColorRed: 'red',
    flagColorBlue: 'blue',
    flagColorGreen: 'green',
    flagColorYellow: 'yellow',
    flagColorBlack: 'black',
    flagColorWhite: 'white',
    flagColorOrange: 'orange',
    duelFactsRegion: 'Duel region',
    duelFactsRules: 'Win condition',
    duelFactsUntilCorrect: 'Until a correct answer',
    duelFactsUntilCorrectHint: 'The 10-fact cap and wrong-guess limit are off',
    duelFactsThreeWrong: 'Until 3 wrong guesses',
    duelFactsUnlimited: 'Until the last fact, no limits',
    duelFactsMaxFive: 'At most 5 facts',
    duelFactsHardcore: 'Hardcore',
    duelFactsHardcoreHint: '7 facts, no mistakes. First 5 are 10 seconds, then 15. Next advances the fact for both players.',
    duelFactsSeries: 'Countries per duel',
  },
  ...EXTRA_STRINGS,
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
