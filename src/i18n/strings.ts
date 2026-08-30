import { REGIONS } from '../data/countries'
import {
  EASY_MIX_MODES,
  FOOTBALL_MODES,
  HARD_MIX_MODES,
  isAllRegions,
  isLeadersMode,
  leaderKindOf,
  leadersAskOf,
  parseRegions,
  QUIZ_MODES,
  RANKING_MODES,
  sameModes,
  type MixKind,
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
  worldsPick: string
  geography: string
  football: string
  wcWinners: string
  wcWinnerPrompt: (year: number) => string
  wcFinalists: string
  wcFinalistPrompt: (year: number) => string
  wcHosts: string
  wcHostPrompt: (year: number) => string
  wcTitleYears: string
  wcTitleYearPrompt: (name: string) => string
  euroWinners: string
  euroWinnerPrompt: (year: number) => string
  worldsBack: string
  footballRoundSize: string
  footballXpHint: (n: number) => string
  codes: string
  codesSubtitle: string
  tldToName: string
  nameToTld: string
  callingToName: string
  nameToCalling: string
  carToName: string
  nameToCar: string
  tldPrompt: string
  callingPrompt: string
  carPrompt: string
  nameToTldAsk: (name: string) => string
  nameToCallingAsk: (name: string) => string
  nameToCarAsk: (name: string) => string
  leaders: string
  leadersSubtitle: string
  present: string
  usYearsToName: string
  usNumberToName: string
  usPhotoToName: string
  popeYearsToName: string
  popeNumberToName: string
  popePhotoToName: string
  rusYearsToName: string
  rusNumberToName: string
  rusPhotoToName: string
  usPresidents: string
  popesLeaders: string
  askoldToUnion: string
  leaderTopic: string
  leaderAsk: string
  leaderAskYears: string
  leaderAskNumber: string
  leaderAskPhoto: string
  usYearsPrompt: (range: string) => string
  usNumberPrompt: (n: number) => string
  popeYearsPrompt: (range: string) => string
  popeNumberPrompt: (n: number) => string
  rusNumberPrompt: (n: number) => string
  askoldPrompt: (range: string) => string
  leaderPhotoPrompt: string
  album: string
  albumHint: string
  albumCount: (n: number, total: number) => string
  albumEmpty: string
  stampNew: string
  mistakesTrain: string
  mistakesHint: string
  mistakesEmpty: string
  mistakesClear: string
  noTimerHint: string
  footballLearnHint: string
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
  mapToSea: string
  mapToRiver: string
  seaToName: string
  riverToName: string
  rankGdp: string
  rankGdpPc: string
  rankArea: string
  rankGdpPpp: string
  rankGini: string
  rankMillionaires: string
  rankBillionaires: string
  rankHappiness: string
  rankPopulation: string
  rankHdi: string
  rankLife: string
  rankPress: string
  rankCpi: string
  rankPassport: string
  rankPeace: string
  rankCo2: string
  rankOlympics: string
  rankHeritage: string
  rankings: string
  rankingAsk: (title: string, place: number) => string
  rankingFootnote: (asOf: string, source: string, count: number) => string
  rankingPlace: (place: number, count: number) => string
  rankingHelp: string
  seaPrompt: string
  riverPrompt: string
  seaMapPrompt: string
  riverMapPrompt: string
  whoseNeighbors: string
  whichCountry: string
  mixAskCountry: string
  mixAskFlag: string
  mixAskCapital: string
  mixAskCurrency: string
  mixAskPopulation: string
  mixAskFounded: string
  mixAskMap: string
  mixAskSea: string
  mixAskRiver: string
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
  medium: string
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
  accountRegistered: (date: string) => string
  playerProfile: string
  playerProfileMissing: string
  authInvalid: string
  authNameTaken: string
  authNameBlocked: string
  authNameCooldown: string
  authBadCredentials: string
  authPasswordMismatch: string
  authPasswordSame: string
  authWrongPassword: string
  authOffline: string
  authTooMany: string
  legalAbout: string
  legalPrivacy: string
  legalContacts: string
  legalCountries: string
  legalToday: string
  settings: string
  settingsAccount: string
  settingsAbout: string
  settingsReport: string
  settingsAchievements: string
  settingsXp: string
  xpHowLead: string
  xpHowFreeTitle: string
  xpHowFree: string
  xpHowFootballTitle: string
  xpHowFootball: string
  xpHowLevelsTitle: string
  xpHowLevels: string
  xpHowRecord: string
  xpHowRank: string
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
  ratingsWorld: string
  ratingsPeriodAll: string
  ratingsPeriodDay: string
  ratingsPeriodWeek: string
  ratingsPeriodMonth: string
  ratingsXpHintWorld: string
  ratingsXpHintPeriod: string
  ratingsXpHintTopic: string
  ratingsPeriodEmpty: string
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

function ordinalEn(n: number) {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  const d = n % 10
  if (d === 1) return `${n}st`
  if (d === 2) return `${n}nd`
  if (d === 3) return `${n}rd`
  return `${n}th`
}

export const STRINGS: Record<Lang, Strings> = {
  ru: {
    title: 'Паспорт страны',
    subtitle: '193 страны. Без сокращений.',
    worldsPick: 'Выберите тему',
    geography: 'География',
    football: 'Футбол',
    wcWinners: 'Победители ЧМ',
    wcWinnerPrompt: (year) => `Кто выиграл ЧМ ${year}?`,
    wcFinalists: 'Финалисты ЧМ',
    wcFinalistPrompt: (year) => `Кто проиграл финал ЧМ ${year}?`,
    wcHosts: 'Хозяева ЧМ',
    wcHostPrompt: (year) => `Где прошёл ЧМ ${year}?`,
    wcTitleYears: 'Год титула',
    wcTitleYearPrompt: (name) => `В каком году ${name} выиграла ЧМ?`,
    euroWinners: 'Победители Евро',
    euroWinnerPrompt: (year) => `Кто выиграл Евро ${year}?`,
    worldsBack: 'К темам',
    footballRoundSize: 'Вопросов в матче',
    footballXpHint: (n) => `Верный ответ: +${n} опыта. Полный матч и идеал дают бонус.`,
    codes: 'Коды стран',
    codesSubtitle: 'Домен, телефон и автокод.',
    tldToName: 'Домен → страна',
    nameToTld: 'Страна → домен',
    callingToName: 'Телефон → страна',
    nameToCalling: 'Страна → телефон',
    carToName: 'Автокод → страна',
    nameToCar: 'Страна → автокод',
    tldPrompt: 'Какой стране принадлежит этот домен?',
    callingPrompt: 'Какой стране принадлежит этот телефонный код?',
    carPrompt: 'Какой стране принадлежит этот автокод?',
    nameToTldAsk: (name) => `Какой интернет-домен у страны ${name}?`,
    nameToCallingAsk: (name) => `Какой телефонный код у страны ${name}?`,
    nameToCarAsk: (name) => `Какой автомобильный код у страны ${name}?`,
    leaders: 'Лидеры стран',
    leadersSubtitle: 'Президенты США, папы римские и правители от Аскольда до Союза. Портреты — Wikimedia Commons, только свободные лицензии.',
    present: 'н. в.',
    usYearsToName: 'США · годы',
    usNumberToName: 'США · номер',
    usPhotoToName: 'США · фото',
    popeYearsToName: 'Папы · годы',
    popeNumberToName: 'Папы · номер',
    popePhotoToName: 'Папы · фото',
    rusYearsToName: 'От Аскольда · годы',
    rusNumberToName: 'От Аскольда · номер',
    rusPhotoToName: 'От Аскольда · фото',
    usPresidents: 'Президенты США',
    popesLeaders: 'Папы римские',
    askoldToUnion: 'От Аскольда до Союза',
    leaderTopic: 'Тема',
    leaderAsk: 'Вопрос',
    leaderAskYears: 'Годы',
    leaderAskNumber: 'Номер',
    leaderAskPhoto: 'Фото',
    usYearsPrompt: (range) => `Кто был президентом США в ${range}?`,
    usNumberPrompt: (n) => `Кто был ${n}-м президентом США?`,
    popeYearsPrompt: (range) => `Кто был папой римским в ${range}?`,
    popeNumberPrompt: (n) => `Кто был ${n}-м папой римским?`,
    rusNumberPrompt: (n) => `Кто был ${n}-м правителем?`,
    askoldPrompt: (range) => `Кто правил в ${range}?`,
    leaderPhotoPrompt: 'Кто на фото?',
    album: 'Марки',
    albumHint: 'Марка появляется, когда вы открываете паспорт или играете страну.',
    albumCount: (n, total) => `${n} из ${total}`,
    albumEmpty: 'Пока пусто. Откройте страну или сыграйте раунд.',
    stampNew: 'Новая марка',
    mistakesTrain: 'Ошибки',
    mistakesHint: 'Только страны, где вы ошиблись. Без таймера.',
    mistakesEmpty: 'Пока нет ошибок — так и держать.',
    mistakesClear: 'Очистить список',
    noTimerHint: 'Без таймера и жизней.',
    footballLearnHint: 'Карточки команд. Потом можно себя проверить.',
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
    mapToSea: 'Море → страна',
    mapToRiver: 'Река → страна',
    seaToName: 'Берег → страна',
    riverToName: 'Река/озеро → страна',
    rankGdp: 'ВВП',
    rankGdpPc: 'ВВП на душу',
    rankArea: 'Площадь',
    rankGdpPpp: 'ВВП по ППС',
    rankGini: 'Джини',
    rankMillionaires: 'Миллионеры',
    rankBillionaires: 'Миллиардеры',
    rankHappiness: 'Счастье',
    rankPopulation: 'Население',
    rankHdi: 'ИЧР',
    rankLife: 'Дожитие',
    rankPress: 'Свобода прессы',
    rankCpi: 'Коррупция',
    rankPassport: 'Паспорт',
    rankPeace: 'Мир',
    rankCo2: 'CO₂',
    rankOlympics: 'Олимпиада',
    rankHeritage: 'ЮНЕСКО',
    rankings: 'Рейтинги',
    rankingAsk: (title, place) => `Какая страна на ${place}-м месте: ${title}?`,
    rankingFootnote: (asOf, source, count) =>
      `Актуально на ${asOf}. Источник: ${source}. В рейтинге ${count} ${pluralRu(count, 'страна', 'страны', 'стран')}.`,
    rankingPlace: (place, count) => `${place}-е из ${count}`,
    rankingHelp: 'О рейтинге',
    seaPrompt: 'Какая страна выходит к этой воде?',
    riverPrompt: 'Какая страна связана с этой рекой или озером?',
    seaMapPrompt: 'Какое это море или океан?',
    riverMapPrompt: 'Какая это река или озеро?',
    whoseNeighbors: 'Чьи это сухопутные соседи?',
    whichCountry: 'Какая это страна?',
    mixAskCountry: 'Назовите страну',
    mixAskFlag: 'Выберите флаг',
    mixAskCapital: 'Назовите столицу',
    mixAskCurrency: 'Назовите валюту',
    mixAskPopulation: 'Назовите население',
    mixAskFounded: 'Назовите год основания',
    mixAskMap: 'Найдите страну на карте',
    mixAskSea: 'Назовите море или океан',
    mixAskRiver: 'Назовите реку или озеро',
    founded: 'Основание',
    region: 'Регион',
    allRegions: 'Все регионы',
    africa: 'Африка',
    americas: 'Америка',
    asia: 'Азия',
    europe: 'Европа',
    oceania: 'Океания',
    difficulty: 'Сложность',
    easy: 'Легкая',
    medium: 'Средняя',
    hard: 'Сложная',
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
    roundSize: 'Вопросы в блоке',
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
    passwordHint: 'Пароль — минимум 8 символов',
    passwordCurrent: 'Текущий пароль',
    passwordNew: 'Новый пароль',
    passwordChange: 'Сменить пароль',
    passwordChanged: 'Пароль обновлён',
    nameChangeHint: 'Ник можно сменить не чаще чем раз в месяц.',
    accountSignedIn: 'Вы вошли в аккаунт',
    accountNeeded: 'Войдите, чтобы попасть в таблицу лидеров',
    accountRegistered: (date) => `Регистрация: ${date}`,
    playerProfile: 'Профиль',
    playerProfileMissing: 'Игрок не найден',
    authInvalid: 'Проверьте имя и пароль',
    authNameTaken: 'Это имя уже занято',
    authNameBlocked: 'Это имя нельзя использовать',
    authNameCooldown: 'Имя можно менять раз в месяц',
    authBadCredentials: 'Неверное имя или пароль',
    authPasswordMismatch: 'Пароли не совпадают',
    authPasswordSame: 'Новый пароль должен отличаться от текущего',
    authWrongPassword: 'Неверный текущий пароль',
    authOffline: 'Аккаунты пока недоступны',
    authTooMany: 'Слишком много попыток. Подождите несколько минут.',
    settings: 'Настройки',
    settingsAccount: 'Аккаунт',
    settingsAbout: 'О нас',
    settingsReport: 'Сообщить о проблеме',
    settingsAchievements: 'Ачивки',
    settingsXp: 'Опыт',
    xpHowLead: 'Опыт копится за игру. Уровень аккаунта растёт от всей суммы.',
    xpHowFreeTitle: 'Свободная игра',
    xpHowFree:
      'Вольный режим даёт мало. География: 1 / 2 / 4 за верный ответ (легко / сложно / хардкор). Карта, население, основание, соседи, факты, моря и реки — на 1 больше. Коды стран: 1 за верный ответ. Лидеры: 1 / 2 / 4 (легко и средне / сложно / хардкор). Училка и тренажёр ошибок опыт не дают.',
    xpHowFootballTitle: 'Футбол',
    xpHowFootball:
      'Вольный матч: 1 за верный ответ, годы титула 2. Хозяева и Евро на «сложно» — 2, на хардкоре — 4. Полный матч: +1 за вопрос. Идеал: ещё +2 за вопрос.',
    xpHowLevelsTitle: 'Кампания',
    xpHowLevels:
      'Опыт только за пройденный уровень и только если результат лучше прошлого лучшего на этом уровне. Счёт: 10 × число вопросов × сложность × точность¹·⁵ × скорость × бонус режима. Скорость считается от 45% лимита на вопрос (от 0,7 до 1,4). Хардкор даёт множитель 3. Бонус ×1,1: население, год основания, имя→карта, карта→имя, соседи.',
    xpHowRecord: 'Мировой рекорд уровня: +100 опыта.',
    xpHowRank: 'Уровень аккаунта считается от всей суммы опыта.',
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
    guestHint: 'Чтобы попасть в рейтинг, войдите по имени и паролю.',
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
    ratingsWorld: 'Мир',
    ratingsPeriodAll: 'Всё время',
    ratingsPeriodDay: 'День',
    ratingsPeriodWeek: 'Неделя',
    ratingsPeriodMonth: 'Месяц',
    ratingsXpHintWorld: 'Общий рейтинг по опыту со всех тем',
    ratingsXpHintPeriod: 'Опыт, набранный за этот период',
    ratingsXpHintTopic: 'Опыт только в этой теме',
    ratingsPeriodEmpty: 'Пока пусто за этот период',
    worldRecord: 'Мировой рекорд',
    worldRecordBeat: 'Рекорд обновлён!',
    worldRecordBonus: (amount) => `+${amount} опыта за рекорд`,
    worldRecordEmpty: 'Пока нет рекорда',
    worldRecordLine: (name, time) => `${name} · ${time}`,
    worldRecordHint: 'Нажмите уровень — лучший результат среди всех игроков.',
    tapPassport: 'Нажмите страну — откроется паспорт',
    capital: 'Столица',
    population: 'Население',
    currency: 'Валюта',
    fact: 'Факт',
    neighbors: 'Сухопутные соседи',
    noNeighbors: 'Нет сухопутных соседей',
    close: 'Закрыть',
    credit: 'Создано Львом Уманским',
    legalAbout: 'О проекте',
    legalPrivacy: 'Политика',
    legalContacts: 'Контакты',
    legalCountries: 'Страны',
    legalToday: 'Страна дня',
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
    hardMixNote: 'Все режимы, кроме фактов: флаги, карта, соседи, моря и реки',
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
    worldsPick: 'Choose a topic',
    geography: 'Geography',
    football: 'Football',
    wcWinners: 'World Cup winners',
    wcWinnerPrompt: (year) => `Who won the ${year} World Cup?`,
    wcFinalists: 'World Cup finalists',
    wcFinalistPrompt: (year) => `Who lost the ${year} World Cup final?`,
    wcHosts: 'World Cup hosts',
    wcHostPrompt: (year) => `Who hosted the ${year} World Cup?`,
    wcTitleYears: 'Title year',
    wcTitleYearPrompt: (name) => `Which year did ${name} win the World Cup?`,
    euroWinners: 'Euro winners',
    euroWinnerPrompt: (year) => `Who won Euro ${year}?`,
    worldsBack: 'Topics',
    footballRoundSize: 'Questions in the match',
    footballXpHint: (n) => `Correct answer: +${n} XP. Finish and go perfect for a bonus.`,
    codes: 'Country codes',
    codesSubtitle: 'Domain, calling code, and car plate.',
    tldToName: 'Domain → country',
    nameToTld: 'Country → domain',
    callingToName: 'Calling code → country',
    nameToCalling: 'Country → calling code',
    carToName: 'Car code → country',
    nameToCar: 'Country → car code',
    tldPrompt: 'Which country owns this domain?',
    callingPrompt: 'Which country uses this calling code?',
    carPrompt: 'Which country uses this car code?',
    nameToTldAsk: (name) => `What is the domain for ${name}?`,
    nameToCallingAsk: (name) => `What is the calling code for ${name}?`,
    nameToCarAsk: (name) => `What is the car code for ${name}?`,
    leaders: 'Country leaders',
    leadersSubtitle: 'U.S. presidents, popes, and rulers from Askold to the Union. Portraits from Wikimedia Commons, free licenses only.',
    present: 'present',
    usYearsToName: 'USA · years',
    usNumberToName: 'USA · number',
    usPhotoToName: 'USA · photo',
    popeYearsToName: 'Popes · years',
    popeNumberToName: 'Popes · number',
    popePhotoToName: 'Popes · photo',
    rusYearsToName: 'Askold · years',
    rusNumberToName: 'Askold · number',
    rusPhotoToName: 'Askold · photo',
    usPresidents: 'U.S. presidents',
    popesLeaders: 'Popes',
    askoldToUnion: 'From Askold to the Union',
    leaderTopic: 'Topic',
    leaderAsk: 'Question',
    leaderAskYears: 'Years',
    leaderAskNumber: 'Number',
    leaderAskPhoto: 'Photo',
    usYearsPrompt: (range) => `Who was U.S. president in ${range}?`,
    usNumberPrompt: (n) => `Who was the ${ordinalEn(n)} U.S. president?`,
    popeYearsPrompt: (range) => `Who was pope in ${range}?`,
    popeNumberPrompt: (n) => `Who was the ${ordinalEn(n)} pope?`,
    rusNumberPrompt: (n) => `Who was the ${ordinalEn(n)} ruler?`,
    askoldPrompt: (range) => `Who ruled in ${range}?`,
    leaderPhotoPrompt: 'Who is this?',
    album: 'Stamps',
    albumHint: 'A stamp appears when you open a passport or play that country.',
    albumCount: (n, total) => `${n} of ${total}`,
    albumEmpty: 'Empty so far. Open a country or play a round.',
    stampNew: 'New stamp',
    mistakesTrain: 'Mistakes',
    mistakesHint: 'Only countries you missed. No timer.',
    mistakesEmpty: 'No mistakes yet — keep it that way.',
    mistakesClear: 'Clear list',
    noTimerHint: 'No timer and no lives.',
    footballLearnHint: 'Team cards. Then you can test yourself.',
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
    mapToSea: 'Sea → country',
    mapToRiver: 'River → country',
    seaToName: 'Coast → country',
    riverToName: 'River/lake → country',
    rankGdp: 'GDP',
    rankGdpPc: 'GDP per capita',
    rankArea: 'Area',
    rankGdpPpp: 'GDP (PPP)',
    rankGini: 'Gini',
    rankMillionaires: 'Millionaires',
    rankBillionaires: 'Billionaires',
    rankHappiness: 'Happiness',
    rankPopulation: 'Population',
    rankHdi: 'HDI',
    rankLife: 'Life expectancy',
    rankPress: 'Press freedom',
    rankCpi: 'Corruption',
    rankPassport: 'Passport',
    rankPeace: 'Peace',
    rankCo2: 'CO₂',
    rankOlympics: 'Olympics',
    rankHeritage: 'UNESCO',
    rankings: 'Rankings',
    rankingAsk: (title, place) => `Which country is #${place} for ${title}?`,
    rankingFootnote: (asOf, source, count) =>
      `As of ${asOf}. Source: ${source}. ${count} ${count === 1 ? 'country' : 'countries'} in this ranking.`,
    rankingPlace: (place, count) => `#${place} of ${count}`,
    rankingHelp: 'About this ranking',
    seaPrompt: 'Which country borders this water?',
    riverPrompt: 'Which country is tied to this river or lake?',
    seaMapPrompt: 'Which sea or ocean is this?',
    riverMapPrompt: 'Which river or lake is this?',
    whoseNeighbors: 'Whose land neighbors are these?',
    whichCountry: 'Which country is this?',
    mixAskCountry: 'Name the country',
    mixAskFlag: 'Pick the flag',
    mixAskCapital: 'Name the capital',
    mixAskCurrency: 'Name the currency',
    mixAskPopulation: 'Name the population',
    mixAskFounded: 'Name the founding year',
    mixAskMap: 'Find the country on the map',
    mixAskSea: 'Name the sea or ocean',
    mixAskRiver: 'Name the river or lake',
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
    medium: 'Medium',
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
    roundSize: 'Questions in the round',
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
    passwordHint: 'Password — at least 8 characters',
    passwordCurrent: 'Current password',
    passwordNew: 'New password',
    passwordChange: 'Change password',
    passwordChanged: 'Password updated',
    nameChangeHint: 'You can change your name once a month.',
    accountSignedIn: 'You are signed in',
    accountNeeded: 'Sign in to appear on the leaderboard',
    accountRegistered: (date) => `Registered: ${date}`,
    playerProfile: 'Profile',
    playerProfileMissing: 'Player not found',
    authInvalid: 'Check the name and password',
    authNameTaken: 'That name is taken',
    authNameBlocked: 'That name isn’t allowed',
    authNameCooldown: 'You can change your name once a month',
    authBadCredentials: 'Wrong name or password',
    authPasswordMismatch: 'Passwords do not match',
    authPasswordSame: 'New password must be different',
    authWrongPassword: 'Current password is wrong',
    authOffline: 'Accounts are unavailable right now',
    authTooMany: 'Too many attempts. Wait a few minutes.',
    settings: 'Settings',
    settingsAccount: 'Account',
    settingsAbout: 'About',
    settingsReport: 'Report a problem',
    settingsAchievements: 'Achievements',
    settingsXp: 'XP',
    xpHowLead: 'XP builds as you play. Account level follows the total.',
    xpHowFreeTitle: 'Free play',
    xpHowFree:
      'Free play pays little. Geography: 1 / 2 / 4 XP per correct answer (easy / hard / hardcore). Map, population, founded, neighbours, facts, seas and rivers add 1. Country codes: 1 per correct answer. Leaders: 1 / 2 / 4 (easy and medium / hard / hardcore). Learn and the mistakes trainer award no XP.',
    xpHowFootballTitle: 'Football',
    xpHowFootball:
      'Free match: 1 per correct answer, title years 2. Hosts and Euros on Hard are 2, Hardcore 4. Finish the round: +1 per question. Perfect finish: another +2 per question.',
    xpHowLevelsTitle: 'Campaign',
    xpHowLevels:
      'XP only on a cleared level, and only the gain over your previous best on that clear. Score: 10 × questions × difficulty × accuracy¹·⁵ × speed × mode bonus. Speed is judged against 45% of the per-question time limit (0.7–1.4). Hardcore uses a 3× pressure multiplier. ×1.1 bonus: population, founded, name→map, map→name, neighbours.',
    xpHowRecord: 'World record on a level: +100 XP.',
    xpHowRank: 'Account level is derived from total XP.',
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
    guestHint: 'Sign in with your name and password to appear on the leaderboard.',
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
    ratingsWorld: 'World',
    ratingsPeriodAll: 'All time',
    ratingsPeriodDay: 'Day',
    ratingsPeriodWeek: 'Week',
    ratingsPeriodMonth: 'Month',
    ratingsXpHintWorld: 'Global ranking by XP from every topic',
    ratingsXpHintPeriod: 'XP earned in this period',
    ratingsXpHintTopic: 'XP from this topic only',
    ratingsPeriodEmpty: 'Empty for this period',
    worldRecord: 'World record',
    worldRecordBeat: 'Record broken!',
    worldRecordBonus: (amount) => `+${amount} XP for the record`,
    worldRecordEmpty: 'No record yet',
    worldRecordLine: (name, time) => `${name} · ${time}`,
    worldRecordHint: 'Tap a level — the best result among all players.',
    tapPassport: 'Tap a country to open its passport',
    capital: 'Capital',
    population: 'Population',
    currency: 'Currency',
    fact: 'Fact',
    neighbors: 'Land neighbors',
    noNeighbors: 'No land neighbors',
    close: 'Close',
    credit: 'Created by Lev Umansky',
    legalAbout: 'About',
    legalPrivacy: 'Privacy',
    legalContacts: 'Contact',
    legalCountries: 'Countries',
    legalToday: 'Country of the day',
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
    hardMixNote: 'All modes except facts: flags, map, neighbours, seas and rivers',
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
  if (isLeadersMode(mode)) {
    const t = STRINGS[lang]
    const kind = leaderKindOf(mode)
    const topic = kind === 'pope' ? t.popesLeaders : kind === 'rus' ? t.askoldToUnion : t.usPresidents
    const ask = leadersAskOf(mode)
    const askLabel = ask === 'photo' ? t.leaderAskPhoto : ask === 'number' ? t.leaderAskNumber : t.leaderAskYears
    return `${topic} · ${askLabel}`
  }
  return STRINGS[lang][mode]
}

export function modesLabel(modes: readonly QuizMode[], lang: Lang): string {
  const t = STRINGS[lang]
  const selected = [...QUIZ_MODES, ...RANKING_MODES].filter((mode) => modes.includes(mode))
  if (sameModes(selected, EASY_MIX_MODES)) return t.easyMix
  if (sameModes(selected, HARD_MIX_MODES)) return t.hardMix
  if (selected.length > 0) return selected.map((mode) => modeLabel(mode, lang)).join(' · ')
  const football = FOOTBALL_MODES.filter((mode) => modes.includes(mode))
  if (football.length > 0) return football.map((mode) => modeLabel(mode, lang)).join(' · ')
  if (modes.length === 0) return modeLabel('flagToName', lang)
  return modes.map((mode) => modeLabel(mode, lang)).join(' · ')
}

export function mixLabel(mix: MixKind, lang: Lang): string {
  return mix === 'easy' ? STRINGS[lang].easyMix : STRINGS[lang].hardMix
}

export function mixAskHint(mode: QuizMode, lang: Lang): string {
  const t = STRINGS[lang]
  if (mode === 'nameToFlag') return t.mixAskFlag
  if (mode === 'nameToCapital') return t.mixAskCapital
  if (mode === 'nameToCurrency') return t.mixAskCurrency
  if (mode === 'nameToPopulation') return t.mixAskPopulation
  if (mode === 'nameToFounded') return t.mixAskFounded
  if (mode === 'nameToMap') return t.mixAskMap
  if (mode === 'mapToSea') return t.mixAskSea
  if (mode === 'mapToRiver') return t.mixAskRiver
  return t.mixAskCountry
}

function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}
