import { REGIONS } from '../data/countries'
import { type GovKind } from '../data/governments'
import {
  CLUB_FOOTBALL_MATCH_MIX,
  CODES_MODES,
  EASY_FOOTBALL_MIX_MODES,
  EASY_MIX_MODES,
  FLAGS_MIX_MODES,
  FOOTBALL_MODES,
  HARD_FOOTBALL_MIX_MODES,
  HARD_MIX_MODES,
  MAP_MIX_MODES,
  PLAYER_FOOTBALL_MATCH_MIX,
  PHOTO_LEADERS_MATCH_MIX,
  US_LEADERS_MATCH_MIX,
  WC_FOOTBALL_MATCH_MIX,
  isAllRegions,
  isFootballMode,
  isLeadersMode,
  isMathMode,
  isAstroMode,
  isThemeMode,
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
import { MATH_MODE_COPY } from './mathCopy'
import { ASTRO_MODE_COPY } from './astroCopy'
import { THEME_MODE_COPY, THEME_PROMPT_KEY } from './themeCopy'
import { PACK_MODE_COPY } from './packCopy'
import { EMPIRE_COPY } from './empireCopy'
import { ALBUM_COPY } from './albumCopy'
import { TOUR_COPY } from './tourCopy'
import { intellectRankOf } from './intellectRank'
import { isRtl, rtlModeArrows, type Lang } from './lang'

export { REGIONS }
export { LANGS, LANG_NATIVE, LANG_SHORT, isLang, isRtl, langDir, localeTag, rtlModeArrows, type Lang } from './lang'

export type Strings = {
  title: string
  subtitle: string
  worldsPick: string
  geography: string
  football: string
  math: string
  mathSubtitle: string
  mathFamilyArithmetic: string
  mathFamilyGeometry: string
  mathFamilySymbols: string
  mathFamilyPeople: string
  mathEasyMixNote: string
  mathHardMixNote: string
  exprToValue: string
  valueToExpr: string
  fractionDecimal: string
  percentToValue: string
  powerToValue: string
  orderOfOps: string
  shapeToName: string
  nameToShape: string
  angleToKind: string
  formulaToQuantity: string
  unitsConvert: string
  symbolToMeaning: string
  constantToValue: string
  siPrefixToFactor: string
  mathPhotoToName: string
  mathFactsToName: string
  mathPersonToPlace: string
  theoremToAuthor: string
  mathExprPrompt: string
  mathValuePrompt: string
  mathFractionPrompt: string
  mathPercentPrompt: string
  mathPowerPrompt: string
  mathOrderPrompt: string
  mathShapePrompt: string
  mathNameToShapePrompt: string
  mathAnglePrompt: string
  mathFormulaPrompt: string
  mathUnitsPrompt: string
  mathSymbolPrompt: string
  mathConstantPrompt: string
  mathSiPrompt: string
  mathPhotoPrompt: string
  mathFactsPrompt: string
  mathPersonPlacePrompt: string
  mathTheoremPrompt: string
  astronomy: string
  astroSubtitle: string
  astroFamilyPlanets: string
  astroFamilyMoons: string
  astroFamilySky: string
  astroFamilyExploration: string
  astroFamilyPeople: string
  astroEasyMixNote: string
  astroHardMixNote: string
  planetToOrder: string
  orderToPlanet: string
  planetToKind: string
  moonToPlanet: string
  planetToMoon: string
  planetFactsToName: string
  moonFactsToName: string
  starToClass: string
  constelToName: string
  deepSkyFactsToName: string
  missionToTarget: string
  missionFactsToName: string
  telescopeFactsToName: string
  astroPhotoToName: string
  astroFactsToName: string
  astroPlanetPrompt: string
  astroOrderPrompt: string
  astroKindPrompt: string
  astroMoonPrompt: string
  astroPlanetMoonPrompt: string
  astroStarPrompt: string
  astroConstelPrompt: string
  astroPlanetFactsPrompt: string
  astroMoonFactsPrompt: string
  astroDeepSkyPrompt: string
  astroMissionTargetPrompt: string
  astroMissionFactsPrompt: string
  astroTelescopeFactsPrompt: string
  astroPhotoPrompt: string
  astroFactsPrompt: string
  biology: string
  bioSubtitle: string
  bioFamilyCell: string
  bioFamilyBody: string
  bioFamilyLife: string
  bioEasyMixNote: string
  bioHardMixNote: string
  organelleToRole: string
  roleToOrganelle: string
  organToSystem: string
  systemToOrgan: string
  photoStepToName: string
  nameToProcess: string
  kingdomToExample: string
  exampleToKingdom: string
  animalToClass: string
  classToAnimal: string
  bioOrganellePrompt: string
  bioRolePrompt: string
  bioOrganPrompt: string
  bioSystemPrompt: string
  bioPhotoPrompt: string
  bioNameProcessPrompt: string
  bioKingdomPrompt: string
  bioExamplePrompt: string
  bioAnimalPrompt: string
  bioClassPrompt: string
  olympics: string
  olySubtitle: string
  olyFamilyHosts: string
  olyFamilySports: string
  olyFamilyNoc: string
  olyFamilyStars: string
  olyEasyMixNote: string
  olyHardMixNote: string
  olyYearToHost: string
  olyHostToYear: string
  olyHostCount: string
  hostToCountry: string
  olyYearToCountry: string
  winterYearToHost: string
  sportToCategory: string
  categoryToSport: string
  sportToDebut: string
  eventToSport: string
  equipmentToSport: string
  sportToEquipment: string
  athleteToSport: string
  debutToSport: string
  sportToFederation: string
  federationToSport: string
  venueToSport: string
  sportToVenue: string
  countryToOlySport: string
  seasonToSport: string
  nocToName: string
  nameToNoc: string
  countryToGolds: string
  athleteToNoc: string
  olyPhotoToName: string
  olyYearPrompt: string
  olyHostPrompt: string
  olyCountPrompt: string
  olyHostCountryPrompt: string
  olyYearCountryPrompt: string
  olyWinterPrompt: string
  olySportPrompt: string
  olyCategoryPrompt: string
  olyDebutPrompt: string
  olyEventPrompt: string
  olyEquipmentPrompt: string
  olySportEquipPrompt: string
  olyAthleteSportPrompt: string
  olyDebutSportPrompt: string
  olyFederationPrompt: string
  olyFedSportPrompt: string
  olyVenuePrompt: string
  olySportVenuePrompt: string
  olyCountrySportPrompt: string
  olySeasonPrompt: string
  olyNocPrompt: string
  olyNameNocPrompt: string
  olyGoldsPrompt: string
  olyAthletePrompt: string
  olyPhotoPrompt: string
  cs: string
  csSubtitle: string
  csFamilyCode: string
  csFamilyLangs: string
  csFamilyStructs: string
  csFamilyBinary: string
  csFamilyPeople: string
  csEasyMixNote: string
  csHardMixNote: string
  csTermToMeaning: string
  meaningToCsTerm: string
  codeToLang: string
  structToUse: string
  useToStruct: string
  decToBinary: string
  binaryToDec: string
  csPhotoToName: string
  personToWork: string
  workToPerson: string
  csTermPrompt: string
  csMeaningPrompt: string
  csCodePrompt: string
  csStructPrompt: string
  csUsePrompt: string
  csDecPrompt: string
  csBinPrompt: string
  csPhotoPrompt: string
  csPersonPrompt: string
  csWorkPrompt: string
  food: string
  foodSubtitle: string
  foodFamilyDishes: string
  foodFamilyOrigin: string
  foodFamilyPlates: string
  foodEasyMixNote: string
  foodHardMixNote: string
  dishToCuisine: string
  cuisineToDish: string
  foodToOrigin: string
  dishToIngredients: string
  foodPhotoToDish: string
  foodPhotoToCuisine: string
  foodDishPrompt: string
  foodCuisinePrompt: string
  foodOriginPrompt: string
  foodDishIngredientsPrompt: string
  foodPhotoPrompt: string
  foodPhotoCuisinePrompt: string
  transport: string
  transportSubtitle: string
  transFamilyVehicles: string
  transFamilyPeople: string
  transEasyMixNote: string
  transHardMixNote: string
  vehicleToKind: string
  kindToVehicle: string
  inventorToVehicle: string
  transVehiclePrompt: string
  transKindPrompt: string
  transInventorPrompt: string
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
  euroFinalists: string
  euroFinalistPrompt: (year: number) => string
  euroHosts: string
  euroHostPrompt: (year: number) => string
  euroTitleYears: string
  euroTitleYearPrompt: (name: string) => string
  wcScorers: string
  wcScorerPrompt: (year: number) => string
  uclWinners: string
  uclWinnerPrompt: (year: number) => string
  copaWinners: string
  copaWinnerPrompt: (year: number) => string
  afconWinners: string
  afconWinnerPrompt: (year: number) => string
  copaFinalists: string
  copaFinalistPrompt: (year: number) => string
  copaHosts: string
  copaHostPrompt: (year: number) => string
  afconFinalists: string
  afconFinalistPrompt: (year: number) => string
  afconHosts: string
  afconHostPrompt: (year: number) => string
  asianCupWinners: string
  asianCupWinnerPrompt: (year: number) => string
  goldCupWinners: string
  goldCupWinnerPrompt: (year: number) => string
  nationsLeagueWinners: string
  nationsLeagueWinnerPrompt: (year: number) => string
  uclFinalists: string
  uclFinalistPrompt: (year: number) => string
  uclTitleYears: string
  uclTitleYearPrompt: (name: string) => string
  europaWinners: string
  europaWinnerPrompt: (year: number) => string
  libertadoresWinners: string
  libertadoresWinnerPrompt: (year: number) => string
  leagueWinners: string
  leagueWinnerPrompt: (league: string, year: number) => string
  leaguePl: string
  leagueLaliga: string
  leagueSeriea: string
  leagueBundesliga: string
  leagueLigue1: string
  clubCrestToName: string
  clubCrestPrompt: string
  stadiumToClub: string
  stadiumPrompt: (name: string) => string
  playerToNation: string
  playerToNationPrompt: string
  playerToClub: string
  playerToClubPrompt: string
  playerClubToName: string
  playerClubPrompt: string
  playerClubNote: string
  playerShirtToName: string
  playerShirtPrompt: (n: number) => string
  ballonDorWinners: string
  ballonDorPrompt: (year: number) => string
  goldenBallWinners: string
  goldenBallPrompt: (event: string, year: number) => string
  goldenBallWc: string
  goldenBallEuro: string
  managerPhotoToName: string
  playerCardBorn: string
  playerCardLived: string
  playerCardNation: string
  playerCardBornIn: string
  playerCardClubs: string
  playerClubBadgeNow: string
  playerClubBadgeLast: string
  playerCardClubCountries: string
  playerCardTrophies: string
  playerCardHonours: string
  playerCardFacts: string
  playerCardHeight: string
  playerCardFoot: string
  playerCardNumber: string
  playerCardCaps: string
  playerFootLeft: string
  playerFootRight: string
  playerFootBoth: string
  playerEraActive: string
  playerEraLegend: string
  greatClubsTitle: string
  clubCardFounded: string
  clubCardYear: string
  clubCardSquad: string
  clubCardSquadEmpty: string
  clubCardPlayer: string
  clubCardAbout: string
  clubCardUniquePlayers: string
  clubCardDataPeriod: string
  clubCardAllClubsPlayers: string
  clubCardStatsNote: string
  playerLearnAll: string
  footballGroupWc: string
  footballGroupEuro: string
  footballGroupOther: string
  footballGroupClubs: string
  footballGroupPlayers: string
  footballGroupManagers: string
  footballTopicCups: string
  playerPhotoToName: string
  playerFactsToName: string
  playerFactsHint: string
  factGuessPlayer: string
  playerPositionGk: string
  playerPositionDf: string
  playerPositionMf: string
  playerPositionFw: string
  playerFactNation: (name: string) => string
  playerFactPosition: (pos: string) => string
  playerFactClub: (name: string) => string
  playerFactWcWinner: string
  playerFactEuroWinner: string
  playerFactCopaWinner: string
  playerFactAfconWinner: string
  playerFactUclWinner: string
  playerFactBallonDor: string
  playerFactBallonDorYear: (year: number) => string
  playerFactBallonDorCount: (n: number) => string
  playerFactWcCount: (n: number) => string
  playerFactBornDecade: (decade: number) => string
  playerFactWcFinalGoal: string
  playerFactWcCaptain: string
  playerFactGoldenBoot: string
  playerFactBothClasico: string
  playerFactLeftFoot: string
  playerFactNumber10: string
  duelFactsSeriesPlayers: string
  worldsBack: string
  footballRoundSize: string
  footballXpHint: (n: number) => string
  codes: string
  codesSubtitle: string
  familyMix: string
  familyFlags: string
  familyMap: string
  familyWater: string
  modeSetup: string
  rankingSetup: string
  mixPickModes: string
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
  ukYearsToName: string
  ukPhotoToName: string
  usPresidents: string
  popesLeaders: string
  askoldToUnion: string
  ukMonarchs: string
  leaderTopic: string
  leaderAsk: string
  leaderAskYears: string
  leaderAskNumber: string
  leaderAskPhoto: string
  leaderHideNames: string
  leaderHiddenName: string
  leaderEraUsEarly: string
  leaderEraUs1800s: string
  leaderEraUsModern: string
  leaderEraPopeEarly: string
  leaderEraPopeMedieval: string
  leaderEraPopeModern: string
  leaderEraRusKiev: string
  leaderEraRusMoscow: string
  leaderEraRusEmpire: string
  leaderEraRusSoviet: string
  leaderEraUkMedieval: string
  leaderEraUkTudor: string
  leaderEraUkModern: string
  leaderLearnName: string
  leaderFeat: string
  leaderNoteDeJure: string
  leaderNoteParallel: string
  leaderNoteDisputed: string
  leaderNoteAbdicated: string
  leaderNoteVpDeath: string
  leaderNoteVpResign: string
  usYearsPrompt: (range: string) => string
  usNumberPrompt: (n: number) => string
  popeYearsPrompt: (range: string) => string
  popeNumberPrompt: (n: number) => string
  rusNumberPrompt: (n: number) => string
  askoldPrompt: (range: string) => string
  ukYearsPrompt: (range: string) => string
  leaderPhotoPrompt: string
  album: string
  albumHint: string
  albumCount: (copies: number, countries: number, countryTotal: number) => string
  albumEmpty: string
  albumHintWorld: string
  albumCountWorld: (copies: number, items: number, total: number) => string
  albumLootTitle: string
  albumLoot1: string
  albumLoot2: string
  albumLoot3: string
  albumLoot4: string
  albumLoot5: string
  albumLootNote: string
  albumLootNoteWorld: string
  stampNew: string
  mistakesTrain: string
  mistakesHint: string
  mistakesEmpty: string
  mistakesClear: string
  noTimerHint: string
  footballLearnHint: string
  footballRosterCount: (n: number) => string
  footballRosterSplit: (active: number, legends: number) => string
  footballTableYear: string
  footballTableWinner: string
  footballTableRunnerUp: string
  footballTableMatch: string
  footballTableScore: string
  footballTableHost: string
  footballTableVenue: string
  footballTablePlayer: string
  footballTableGoals: string
  footballTableCountry: string
  footballAet: string
  footballPens: string
  footballReplay: string
  footballGolden: string
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
  silhouetteToName: string
  nameToSilhouette: string
  factsToName: string
  mapToSea: string
  mapToRiver: string
  seaToName: string
  riverToName: string
  nameToLanguage: string
  nameToLanguagePrompt: string
  languageToName: string
  languageToNamePrompt: string
  nameToDriving: string
  nameToDrivingPrompt: string
  drivingToName: string
  drivingToNamePrompt: string
  drivingLeft: string
  drivingRight: string
  familySilhouette: string
  familyDriving: string
  silhouettePrompt: string
  nameToGov: string
  nameToGovPrompt: string
  govPresidential: string
  govSemiPresidential: string
  govParliamentary: string
  govConstMonarchy: string
  govAbsMonarchy: string
  govOneParty: string
  govTheocracy: string
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
  rankingSource: string
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
  mixAskGov: string
  mixAskMap: string
  mixAskSilhouette: string
  mixAskDriving: string
  mixAskLanguage: string
  mixAskSea: string
  mixAskRiver: string
  founded: string
  nationalLanguage: string
  noNationalLanguage: string
  andOthers: string
  spokenLanguages: string
  nationalMark: string
  spokenRule: string
  languageCountries: string
  languageRange: string
  languagesIndex: string
  region: string
  allRegions: string
  africa: string
  americas: string
  asia: string
  europe: string
  oceania: string
  includeExtras: string
  includeExtrasHint: string
  includeEraStates: string
  includeEraStatesHint: string
  mapYear: string
  mapSnapshot: (year: number) => string
  mapHistoryCredit: string
  historyYears: string
  historyStatus: string
  historyIndependent: string
  historyDeFacto: string
  historyDependent: string
  historySuzerain: string
  historyColony: string
  historyProtectorate: string
  historyViceroyalty: string
  historyVassal: string
  historyCompanyRule: string
  historyPersonalUnion: string
  historySuccessors: string
  historyNotIndependent: string
  historyPeople: string
  historyArea: string
  historyMapYears: string
  historyReligion: string
  historyPredecessors: string
  historyWiki: string
  historyModernPlace: string
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
  roundStreak: (n: number) => string
  longestStreak: (n: number) => string
  rankMaster: string
  rankExplorer: string
  rankLearner: string
  rankRookie: string
  answerKey: (n: number) => string
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
  deleteAccount: string
  deleteAccountHint: string
  deleteAccountConfirm: string
  exportData: string
  exportDataDone: string
  signOutAll: string
  signOutAllHint: string
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
  legalTerms: string
  legalCookies: string
  cookieNotice: string
  cookieNoticeEssential: string
  cookieNoticeReject: string
  cookieNoticeAll: string
  legalCountries: string
  legalToday: string
  legalLanguages: string
  legalLists: string
  collectionsHint: string
  collectionsChallenges: string
  themeChallenge: string
  dailyChallenge: string
  dailyPlay: string
  dailyDone: (score: number, total: number) => string
  dailyStreak: (n: number) => string
  collectionItems: (n: number) => string
  collectionOpen: string
  share: string
  shareCopied: string
  shareBetter: string
  shareTap: string
  shareResult: (score: string, theme: string, url: string) => string
  shareToday: (name: string, url: string) => string
  settings: string
  settingsAccount: string
  settingsAbout: string
  tourSkip: string
  tourNext: string
  tourBack: string
  tourDone: string
  tourReplay: string
  tourStepWorldsTitle: string
  tourStepWorldsBody: string
  tourStepGeoTitle: string
  tourStepGeoBody: string
  tourStepEmpireTitle: string
  tourStepEmpireBody: string
  tourStepDockTitle: string
  tourStepDockBody: string
  sounds: string
  soundsOn: string
  soundsOff: string
  music: string
  audioAll: string
  audioAllOff: string
  accountCountry: string
  countrySearch: string
  settingsReport: string
  settingsAchievements: string
  settingsXp: string
  settingsResults: string
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
  duelAnonName: string
  guestHint: string
  saveProfile: string
  profileSaved: string
  xpTotal: (amount: string) => string
  xpGained: (amount: string) => string
  accountLevel: (n: number) => string
  accountLevelNext: (amount: string) => string
  intellectRank: (n: number) => string
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
  ratingsDuel: string
  ratingsDuelHint: string
  ratingsDuelEmpty: string
  ratingsDuelRecord: (wins: number, losses: number, draws: number) => string
  worldRecord: string
  worldRecordBeat: string
  worldRecordBonus: (amount: string) => string
  worldRecordEmpty: string
  worldRecordLine: (name: string, time: string) => string
  worldRecordHint: string
  tapPassport: string
  capital: string
  tld: string
  callingCode: string
  carCode: string
  population: string
  currency: string
  government: string
  fact: string
  neighbors: string
  noNeighbors: string
  close: string
  credit: string
  duel: string
  duelHint: string
  duelPlay: string
  multiplayer: string
  multiplayerPlay: string
  multiplayerWaiting: string
  multiplayerHint: string
  profile: string
  profileHint: string
  playWithFriend: string
  empire: string
  empireHint: string
  empireIntro: string
  empireEraOf: (n: number) => string
  empireEra_settlement: string
  empireEra_antiquity: string
  empireEra_medieval: string
  empireEra_earlyModern: string
  empireEra_industrial: string
  empireEra_electric: string
  empireEra_digital: string
  empireEra_space: string
  empireRes_maps: string
  empireRes_seals: string
  empireRes_tickets: string
  empireRes_medals: string
  empireRes_seeds: string
  empireRes_blueprints: string
  empireRes_stardust: string
  empireRes_chips: string
  empireRes_spices: string
  empireCoins: string
  empireGems: string
  empireSpecialists: string
  empireBuilding_hall: string
  empireBuilding_housing: string
  empireBuilding_storage: string
  empireBuilding_treasury: string
  empireBuilding_library: string
  empireBuildingDesc_hall: string
  empireBuildingDesc_housing: string
  empireBuildingDesc_storage: string
  empireBuildingDesc_treasury: string
  empireBuildingDesc_library: string
  empireWorldBuildingHint: (world: string) => string
  empireBuild: string
  empireUpgrade: string
  empireBuilding: string
  empireLevel: (n: number) => string
  empirePerHour: (n: string) => string
  empireMaxLevel: string
  empireBusy: string
  empireNoFunds: string
  empireAdvanceEra: string
  empireEraMax: string
  empireEraNeedHall: (n: number) => string
  empireEraNeedSum: (n: number) => string
  empireEraNeedRes: (n: number) => string
  empireHousing: string
  empirePending: (n: number) => string
  empireOffline: (h: number) => string
  empireSlots: (a: number, b: number) => string
  empireTabCountry: string
  empireTabTreasury: string
  empireTabWorld: string
  empireSellHint: string
  empireSellTen: (n: number) => string
  empireNameHint: string
  empireRename: string
  empireHowToEarn: string
  empireComingSoon: string
  empireBack: string
  empireBoard: string
  empireScore: string
  empireYourRank: (n: number) => string
  empireBoardEmpty: string
  empireSyncLocal: string
  empireSyncServer: string
  empireSyncOffline: string
  empireRewardTitle: string
  empireRewardSpecialists: (n: number) => string
  empireRewardCoins: (n: number) => string
  empireRewardResource: (n: number, name: string) => string
  empireRewardGem: (n: number) => string
  empireRewardCapped: string
  quizPowerFree: string
  empireDuelStreak: (n: number) => string
  quizPowerCoins: (n: number) => string
  gateLocked: string
  gatePlusSoon: string
  gateOr: string
  gateNeedEra: (n: number) => string
  gateNeedBuilding: (name: string, n: number) => string
  gateUnlockCoins: (n: number) => string
  gateUnlockGems: (n: number) => string
  gateUnlockResource: (n: number, name: string) => string
  gateToEmpire: string
  gateNoFunds: string
  gateDifficulty: string
  gateLevels: string
  gateLevelHardcore: string
  gateLearn: (n: number) => string
  gateMistakes: string
  gateList: string
  gateDuelRoom: string
  gateStudio: string
  gateStudioWhy: string
  gateBoard: (n: number) => string
  empirePlusActive: string
  empireCosmetics: string
  empireFrames: string
  empireShares: string
  empireBoosts: string
  empireOwned: string
  empireEquip: string
  empireEquipped: string
  empireUnequip: string
  empireBuyFor: (n: number) => string
  empireFrame_laurel: string
  empireFrame_gold: string
  empireFrame_night: string
  empireFrame_orbit: string
  empireShare_ink: string
  empireShare_gold: string
  empireShare_night: string
  empireBoostXp: string
  empireBoostBuyCoins: (min: number, n: number) => string
  empireBoostBuyGems: (h: number, n: number) => string
  empireBoostActive: (min: number) => string
  empireWallet: (coins: number, gems: number) => string
  empireSkipBuild: (n: number) => string
  empirePerks: string
  empirePerk_offline24: string
  empirePerk_slot2: string
  empirePerkBuy: (days: number, gems: number) => string
  empirePerkLeft: (days: number) => string
  empireAlbumBonus: (pct: string) => string
  empireAlbumHint: string
  empireSetGems: (n: number) => string
  stampRarity_common: string
  stampRarity_rare: string
  stampRarity_epic: string
  stampRarity_legendary: string
  empireLegacy: string
  empireLegacyIntro: string
  empireLegacyGuest: string
  empireLegacy_atlas: string
  empireLegacy_thousandDays: string
  empireLegacy_flawless: string
  empireLegacy_polymath: string
  empireLegacy_builder: string
  empireLegacyDesc_atlas: string
  empireLegacyDesc_thousandDays: string
  empireLegacyDesc_flawless: string
  empireLegacyDesc_polymath: string
  empireLegacyDesc_builder: string
  empireLegacyStage: (n: number, total: number) => string
  empireLegacyNext: (at: string) => string
  empireLegacyFinal: string
  empireLegacyClaim: string
  empireLegacyDone: string
  empireLegacyEta: (days: number) => string
  empireLegacyValue: (value: string, at: string) => string
  empireLegacyRewardGems: (n: number) => string
  empireLegacyReward_frame: string
  empireLegacyReward_share: string
  empireLegacyReward_title: string
  empireLegacyUnlock_res5: string
  empireLegacyUnlock_res10: string
  empireLegacyUnlock_library10: string
  empireLegacyUnlock_specialist: string
  empireLegacyUnlock_maxLevel: string
  empireLegacyUnlock_buildFast: string
  empireLegacyUnlock_pantheon: string
  empireLegacyUnlock_flawlessAnim: string
  empireLegacyUnlock_goldFlag: string
  empireLegacyUnlock_night: string
  empireLegacyUnlock_offline24: string
  empireLegacyUnlock_slot2: string
  empireTitles: string
  empireTitleNone: string
  empireTitleActive: string
  empireTitle_cartographer: string
  empireTitle_keeper: string
  empireTitle_flawless: string
  empireTitle_polymath: string
  empireTitle_architect: string
  empireBuilding_pantheon: string
  empireFrame_atlas: string
  empireFrame_flawless: string
  empireShare_veteran: string
  quizHint: string
  quizSkip: string
  quizExtraLife: string
  studio: string
  studioUnavailable: string
  studioSubtitle: string
  studioNew: string
  studioEmpty: string
  studioUpload: string
  studioPaste: string
  studioPasteHint: string
  studioPdfSkip: string
  studioPdfScan: (taken: number, total: number) => string
  studioGuideTitle: string
  studioGuideHow: string
  studioGuideNeed: string
  studioGuideLimits: (files: number, mb: number, photos: number, textK: number, cards: number) => string
  studioDrop: string
  studioPhotos: string
  studioAddPhotos: string
  studioAddPhotosHint: string
  studioHelp: string
  studioQuota: string
  studioOverLimit: string
  studioAnalyzing: string
  studioAnalyze: string
  studioAnalyzeFail: string
  studioAnalyzeNoKey: string
  studioSummary: string
  studioFormats: string
  studioFormatsHint: string
  studioToneGreen: string
  studioToneYellow: string
  studioToneGray: string
  studioContinue: string
  studioDraft: string
  studioAccept: string
  studioPlay: string
  studioFix: string
  studioDelete: string
  studioLoaded: (photos: number, files: number) => string
  studioLoadedEmpty: string
  studioLoadedFiles: string
  studioRemoveUpload: string
  studioIncludeWeb: string
  studioNoPlay: string
  packFamilyTerms: string
  packFamilyPortraits: string
  packFamilySilhouettes: string
  packFamilyDiagrams: string
  packFamilyField: string
  packFamilyDates: string
  packFamilyNumbers: string
  packFamilyOrder: string
  packFamilyQty: string
  packFamilyFormula: string
  packFamilyKind: string
  packFamilyLinks: string
  packFamilyPairs: string
  packFamilyPlace: string
  packFamilyGroups: string
  packFamilyClues: string
  termToDef: string
  defToTerm: string
  photoToName: string
  nameToPhoto: string
  silToName: string
  nameToSil: string
  diagramToName: string
  nameToDiagram: string
  nameToField: string
  fieldToName: string
  dateToName: string
  nameToDate: string
  numToName: string
  nameToNum: string
  orderToName: string
  nameToOrder: string
  nameToQty: string
  qtyToName: string
  exprToSense: string
  senseToExpr: string
  nameToKind: string
  kindToName: string
  relToName: string
  nameToRel: string
  pairFwd: string
  pairRev: string
  nameToPlace: string
  placeToName: string
  setMember: string
  cluesToName: string
  packEasyMix: string
  packHardMix: string
  packCustomMix: string
  packChapters: string
  packAllChapters: string
  fixTitle: string
  fixSwap: string
  fixBadFact: string
  fixWording: string
  fixImage: string
  fixOptions: string
  fixNotInSource: string
  fixWrongFormat: string
  fixDuplicate: string
  fixOther: string
  fixApply: string
  fixNeedAi: string
  fixAiHint: string
  fixAiGo: string
  fixHide: string
  fixDrop: string
  fixOptionsGroup: string
  fixOptionsPack: string
  studioNCards: (n: number) => string
  studioFound: (kind: string, n: number) => string
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
  customMix: string
  easyMixNote: string
  hardMixNote: string
  customMixNote: string
  footballEasyMixNote: string
  footballHardMixNote: string
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
  duelRating: (rating: number, delta: number) => string
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

function withRtlModeArrows(lang: Lang, pack: Strings): Strings {
  if (!isRtl(lang)) return pack
  const next = { ...pack }
  for (const [key, value] of Object.entries(next)) {
    if (typeof value === 'string') {
      ;(next as Record<string, unknown>)[key] = rtlModeArrows(value, lang)
    }
  }
  return next
}

export const STRINGS: Record<Lang, Strings> = {
  ru: {
    title: 'Паспорт страны',
    subtitle: '193 страны. Без сокращений.',
    worldsPick: 'Выберите тему',
    geography: 'География',
    football: 'Футбол',
    ...MATH_MODE_COPY.ru,
    ...ASTRO_MODE_COPY.ru,
    ...PACK_MODE_COPY.ru,
    ...EMPIRE_COPY.ru,
    ...ALBUM_COPY.ru,
    ...TOUR_COPY.ru,
    ...THEME_MODE_COPY.ru,
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
    euroFinalists: 'Финалисты Евро',
    euroFinalistPrompt: (year) => `Кто проиграл финал Евро ${year}?`,
    euroHosts: 'Хозяева Евро',
    euroHostPrompt: (year) => `Где прошёл Евро ${year}?`,
    euroTitleYears: 'Год титула Евро',
    euroTitleYearPrompt: (name) => `В каком году ${name} выиграла Евро?`,
    wcScorers: 'Бомбардиры ЧМ',
    wcScorerPrompt: (year) => `Лучший бомбардир ЧМ ${year} — из какой страны?`,
    uclWinners: 'Победители ЛЧ',
    uclWinnerPrompt: (year) => `Кто выиграл Кубок чемпионов ${year}?`,
    copaWinners: 'Копа Америка',
    copaWinnerPrompt: (year) => `Кто выиграл Копа Америка ${year}?`,
    afconWinners: 'Кубок Африки',
    afconWinnerPrompt: (year) => `Кто выиграл Кубок Африки ${year}?`,
    copaFinalists: 'Финалисты Копа Америка',
    copaFinalistPrompt: (year) => `Кто проиграл финал Копа Америка ${year}?`,
    copaHosts: 'Хозяева Копа Америка',
    copaHostPrompt: (year) => `Где прошла Копа Америка ${year}?`,
    afconFinalists: 'Финалисты Кубка Африки',
    afconFinalistPrompt: (year) => `Кто проиграл финал Кубка Африки ${year}?`,
    afconHosts: 'Хозяева Кубка Африки',
    afconHostPrompt: (year) => `Где прошёл Кубок Африки ${year}?`,
    asianCupWinners: 'Кубок Азии',
    asianCupWinnerPrompt: (year) => `Кто выиграл Кубок Азии ${year}?`,
    goldCupWinners: 'Золотой кубок КОНКАКАФ',
    goldCupWinnerPrompt: (year) => `Кто выиграл Золотой кубок ${year}?`,
    nationsLeagueWinners: 'Лига наций',
    nationsLeagueWinnerPrompt: (year) => `Кто выиграл Лигу наций ${year}?`,
    uclFinalists: 'Финалисты ЛЧ',
    uclFinalistPrompt: (year) => `Кто проиграл финал Кубка чемпионов ${year}?`,
    uclTitleYears: 'Год титула ЛЧ',
    uclTitleYearPrompt: (name) => `В каком году ${name} выиграл Кубок чемпионов / ЛЧ?`,
    europaWinners: 'Лига Европы',
    europaWinnerPrompt: (year) => `Кто выиграл Кубок УЕФА / Лигу Европы ${year}?`,
    libertadoresWinners: 'Кубок Либертадорес',
    libertadoresWinnerPrompt: (year) => `Кто выиграл Кубок Либертадорес ${year}?`,
    leagueWinners: 'Чемпионы лиг',
    leagueWinnerPrompt: (league, year) => `Кто выиграл ${league} в сезоне, закончившемся в ${year}?`,
    leaguePl: 'АПЛ',
    leagueLaliga: 'Ла Лигу',
    leagueSeriea: 'Серию А',
    leagueBundesliga: 'Бундеслигу',
    leagueLigue1: 'Лигу 1',
    clubCrestToName: 'Эмблема клуба',
    clubCrestPrompt: 'Какой это клуб?',
    stadiumToClub: 'Стадион → клуб',
    stadiumPrompt: (name) => `Какой клуб играет на стадионе ${name}?`,
    playerToNation: 'Футболист → страна',
    playerToNationPrompt: 'За какую страну играет этот футболист?',
    playerToClub: 'Футболист → клуб',
    playerToClubPrompt: 'Какой у него клуб?',
    playerClubToName: 'Клуб → футболист',
    playerClubPrompt: 'Кто из этих игроков в этом клубе?',
    playerClubNote: 'Текущий клуб — или последний, если карьера окончена.',
    playerShirtToName: 'Номер и флаг',
    playerShirtPrompt: (n) => `Кто играл под номером ${n} в этой сборной?`,
    ballonDorWinners: 'Золотой мяч',
    ballonDorPrompt: (year) => `Кто получил «Золотой мяч» в ${year} году?`,
    goldenBallWinners: 'Лучший игрок турнира',
    goldenBallPrompt: (event, year) => `Кто был лучшим игроком ${event} ${year}?`,
    goldenBallWc: 'ЧМ',
    goldenBallEuro: 'Евро',
    managerPhotoToName: 'Тренер по фото',
    playerCardBorn: 'Рождение',
    playerCardLived: 'Годы жизни',
    playerCardNation: 'Сборная',
    playerCardBornIn: 'Страна рождения',
    playerCardClubs: 'Клубы',
    playerClubBadgeNow: 'Сейчас',
    playerClubBadgeLast: 'Последний',
    playerCardClubCountries: 'Страны клубов',
    playerCardTrophies: 'Кубки',
    playerCardHonours: 'Личные награды',
    playerCardFacts: 'Интересные факты',
    playerCardHeight: 'Рост',
    playerCardFoot: 'Рабочая нога',
    playerCardNumber: 'Номер',
    playerCardCaps: 'Сборная (матчи / голы)',
    playerFootLeft: 'левая',
    playerFootRight: 'правая',
    playerFootBoth: 'обе',
    playerEraActive: 'Играет',
    playerEraLegend: 'Легенда',
    greatClubsTitle: '50 клубов',
    clubCardFounded: 'Основан',
    clubCardYear: 'Год',
    clubCardSquad: 'Состав',
    clubCardSquadEmpty: 'За этот год состава нет',
    clubCardPlayer: 'Карточка игрока',
    clubCardAbout: 'Данные охватывают всю доступную историю клуба. Выберите год, чтобы увидеть состав; выделенные имена открывают карточки игроков.',
    clubCardUniquePlayers: 'Игроков за всё время',
    clubCardDataPeriod: 'Период данных',
    clubCardAllClubsPlayers: 'Уникальных игроков в 50 клубах',
    clubCardStatsNote: 'Уникальность определяется по ID игрока, статье Wikipedia или нормализованному имени. Игрок, выступавший за несколько клубов, учитывается один раз.',
    playerLearnAll: 'Все',
    footballGroupWc: 'Чемпионат мира',
    footballGroupEuro: 'Евро',
    footballGroupOther: 'Другие',
    footballGroupClubs: 'Клубы',
    footballGroupPlayers: 'Футболисты',
    footballGroupManagers: 'Тренеры',
    footballTopicCups: 'Турниры',
    playerPhotoToName: 'Футболист по фото',
    playerFactsToName: 'Футболист по фактам',
    playerFactsHint:
      'Не входит в уровни и сложный микс. Первые 5 фактов — 10 секунд, дальше — 15. 10 фактов, 3 ошибки — попытка проиграна.',
    factGuessPlayer: 'Имя футболиста',
    playerPositionGk: 'вратарь',
    playerPositionDf: 'защитник',
    playerPositionMf: 'полузащитник',
    playerPositionFw: 'нападающий',
    playerFactNation: (name) => `Играл за сборную: ${name}.`,
    playerFactPosition: (pos) => `Амплуа — ${pos}.`,
    playerFactClub: (name) => `Клуб (сейчас или последний): ${name}.`,
    playerFactWcWinner: 'Выигрывал чемпионат мира.',
    playerFactEuroWinner: 'Выигрывал чемпионат Европы.',
    playerFactCopaWinner: 'Выигрывал Копа Америка.',
    playerFactAfconWinner: 'Выигрывал Кубок Африки.',
    playerFactUclWinner: 'Выигрывал Кубок европейских чемпионов / Лигу чемпионов.',
    playerFactBallonDor: 'Получал «Золотой мяч».',
    playerFactBallonDorYear: (year) => `«Золотой мяч» ${year} года.`,
    playerFactBallonDorCount: (n) =>
      n >= 3 ? 'Три и более «Золотых мяча».' : n === 2 ? 'Два «Золотых мяча».' : 'Один «Золотой мяч».',
    playerFactWcCount: (n) =>
      n === 0
        ? 'Не играл на чемпионате мира.'
        : n === 1
          ? 'Играл на одном чемпионате мира.'
          : n === 2
            ? 'Играл на двух чемпионатах мира.'
            : 'Играл на трёх и более чемпионатах мира.',
    playerFactBornDecade: (decade) => `Родился в ${decade}-х.`,
    playerFactWcFinalGoal: 'Забивал в финале чемпионата мира.',
    playerFactWcCaptain: 'Был капитаном сборной на чемпионате мира.',
    playerFactGoldenBoot: 'Брал «Золотую бутсу» чемпионата мира.',
    playerFactBothClasico: 'Играл и за «Барселону», и за «Реал Мадрид».',
    playerFactLeftFoot: 'Левая нога — рабочая.',
    playerFactNumber10: 'Классическая десятка.',
    worldsBack: 'К темам',
    footballRoundSize: 'Вопросов в матче',
    footballXpHint: (n) => `Верный ответ: +${n} опыта. Полный матч и идеал дают бонус.`,
    codes: 'Коды стран',
    codesSubtitle: 'Домен, телефон и автокод.',
    familyMix: 'Микс',
    familyFlags: 'Флаги',
    familyMap: 'Карта',
    familyWater: 'Моря и реки',
    modeSetup: 'Настройка раунда',
    rankingSetup: 'Справочник, не раунд. Выберите рейтинг, чтобы открыть таблицу.',
    mixPickModes: 'Отметьте любые режимы для своего микса',
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
    leadersSubtitle: 'Президенты США, папы римские, правители от Аскольда до Союза и короли Англии. Портреты — Wikimedia Commons, только свободные лицензии. Метки у спорных случаев можно нажать — откроется разъяснение.',
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
    ukYearsToName: 'Короли Англии · годы',
    ukPhotoToName: 'Короли Англии · фото',
    usPresidents: 'Президенты США',
    popesLeaders: 'Папы римские',
    askoldToUnion: 'От Аскольда до Союза',
    ukMonarchs: 'Короли Англии',
    leaderTopic: 'Тема',
    leaderAsk: 'Вопрос',
    leaderAskYears: 'Годы',
    leaderAskNumber: 'Номер',
    leaderAskPhoto: 'Фото',
    leaderHideNames: 'Скрыть имена',
    leaderHiddenName: '???',
    leaderEraUsEarly: 'Основание',
    leaderEraUs1800s: 'XIX век',
    leaderEraUsModern: 'XX–XXI',
    leaderEraPopeEarly: 'Ранние',
    leaderEraPopeMedieval: 'Средневековье',
    leaderEraPopeModern: 'Новое время',
    leaderEraRusKiev: 'Киев',
    leaderEraRusMoscow: 'Москва',
    leaderEraRusEmpire: 'Империя',
    leaderEraRusSoviet: 'СССР',
    leaderEraUkMedieval: 'Средние века',
    leaderEraUkTudor: 'Тюдоры и Стюарты',
    leaderEraUkModern: 'Ганноверы+',
    leaderLearnName: 'Имя',
    leaderFeat: 'Чем запомнился',
    leaderNoteDeJure: 'де-юре · фактически не руководил',
    leaderNoteParallel: 'параллельное правление',
    leaderNoteDisputed: 'спорный',
    leaderNoteAbdicated: 'отречение',
    leaderNoteVpDeath: 'вице-президент · вступил после смерти',
    leaderNoteVpResign: 'вице-президент · вступил после отставки (импичмент)',
    usYearsPrompt: (range) => `Кто был президентом США в ${range}?`,
    usNumberPrompt: (n) => `Кто был ${n}-м президентом США?`,
    popeYearsPrompt: (range) => `Кто был папой римским в ${range}?`,
    popeNumberPrompt: (n) => `Кто был ${n}-м папой римским?`,
    rusNumberPrompt: (n) => `Кто был ${n}-м правителем?`,
    askoldPrompt: (range) => `Кто правил в ${range}?`,
    ukYearsPrompt: (range) => `Кто был королём Англии в ${range}?`,
    leaderPhotoPrompt: 'Кто на фото?',
    album: 'Марки',
    albumHint: 'До 5 марок на страну. Первая — верный ответ в зачётном раунде. Дальше: другой режим, сложно или хардкор, идеальный раунд, хардкор до конца.',
    albumCount: (copies, countries, total) => `${copies} марок · ${countries} из ${total} стран`,
    albumEmpty: 'Пока пусто. Ответьте верно в свободной игре или кампании.',
    albumHintWorld: 'До 5 копий на карточку. Первая — верный ответ в зачётном раунде. Дальше: другой режим, сложно или хардкор, идеальный раунд, хардкор до конца.',
    albumCountWorld: (copies, items, total) => `${copies} копий · ${items} из ${total}`,
    stampNew: 'Новая марка',
    mistakesTrain: 'Ошибки',
    mistakesHint: 'Только страны, где вы ошиблись. Без таймера.',
    mistakesEmpty: 'Пока нет ошибок — так и держать.',
    mistakesClear: 'Очистить список',
    noTimerHint: 'Без таймера и жизней.',
    footballLearnHint: 'Карточки футболистов. Потом можно себя проверить.',
    footballRosterCount: (n) => `${n} ${pluralRu(n, 'футболист', 'футболиста', 'футболистов')}`,
    footballRosterSplit: (active, legends) =>
      `${active} ${pluralRu(active, 'действующий', 'действующих', 'действующих')} · ${legends} ${pluralRu(legends, 'легенда', 'легенды', 'легенд')}`,
    footballTableYear: 'Год',
    footballTableWinner: 'Чемпион',
    footballTableRunnerUp: 'Финалист',
    footballTableMatch: 'Финал',
    footballTableScore: 'Счёт',
    footballTableHost: 'Хозяева',
    footballTableVenue: 'Где',
    footballTablePlayer: 'Игрок',
    footballTableGoals: 'Голы',
    footballTableCountry: 'Страна',
    footballAet: 'д.в.',
    footballPens: 'пен.',
    footballReplay: 'переигровка',
    footballGolden: 'золот. гол',
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
    silhouetteToName: 'Силуэт → страна',
    nameToSilhouette: 'Страна → силуэт',
    factsToName: 'Факты → страна',
    mapToSea: 'Море → карта',
    mapToRiver: 'Река → карта',
    seaToName: 'Берег → страна',
    riverToName: 'Водоем → страна',
    nameToLanguage: 'Страна → язык',
    nameToLanguagePrompt: 'Какой язык у этой страны?',
    languageToName: 'Язык → страна',
    languageToNamePrompt: 'Какая это страна по языку?',
    nameToDriving: 'Страна → сторона движения',
    nameToDrivingPrompt: 'По какой стороне здесь ездят?',
    drivingToName: 'Сторона движения → страна',
    drivingToNamePrompt: 'Какая страна ездит по этой стороне?',
    drivingLeft: 'Левая',
    drivingRight: 'Правая',
    familySilhouette: 'Силуэт',
    familyDriving: 'Сторона движения',
    silhouettePrompt: 'Какая это страна?',
    nameToGov: 'Страна → гос. устройство',
    nameToGovPrompt: 'Какое государственное устройство у этой страны?',
    govPresidential: 'Президентская республика',
    govSemiPresidential: 'Полупрезидентская республика',
    govParliamentary: 'Парламентская республика',
    govConstMonarchy: 'Конституционная монархия',
    govAbsMonarchy: 'Абсолютная монархия',
    govOneParty: 'Однопартийная республика',
    govTheocracy: 'Теократия',
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
    rankingSource: 'Источник',
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
    mixAskGov: 'Назовите гос. устройство',
    mixAskMap: 'Найдите страну на карте',
    mixAskSilhouette: 'Назовите страну по силуэту',
    mixAskDriving: 'Назовите сторону движения',
    mixAskLanguage: 'Назовите страну по языку',
    mixAskSea: 'Назовите море или океан',
    mixAskRiver: 'Назовите реку или озеро',
    founded: 'Основание',
    nationalLanguage: 'Язык',
    noNationalLanguage: 'Нет национального языка',
    andOthers: 'и другие',
    spokenLanguages: 'На каких языках говорят',
    nationalMark: 'нац.',
    spokenRule: 'От 1 % населения и не меньше 5 000 говорящих. Не больше 20 языков.',
    languageCountries: 'Страны, где этим языком говорят не меньше 1 %',
    languageRange: 'Ареал',
    languagesIndex: 'Языки',
    region: 'Регион',
    allRegions: 'Все регионы',
    africa: 'Африка',
    americas: 'Америка',
    asia: 'Азия',
    europe: 'Европа',
    oceania: 'Океания',
    includeExtras: 'Все государства и территории',
    includeExtrasHint: 'Включая зависимые и не члены ООН.',
    includeEraStates: 'Все государства выбранной эпохи',
    includeEraStatesHint: 'Независимые и де-факто государства года на карте.',
    mapYear: 'Год',
    mapSnapshot: (year) => `Границы: срез ${year}`,
    mapHistoryCredit: 'Исторические границы: historical-basemaps · CC BY',
    historyYears: 'Годы',
    historyStatus: 'Статус',
    historyIndependent: 'Независимое государство',
    historyDeFacto: 'Де-факто независимое',
    historyDependent: 'Зависимая территория',
    historySuzerain: 'Зависима от',
    historyColony: 'Колония',
    historyProtectorate: 'Протекторат',
    historyViceroyalty: 'Вице-королевство',
    historyVassal: 'Вассал',
    historyCompanyRule: 'Территория компании',
    historyPersonalUnion: 'Личная уния / часть монархии',
    historySuccessors: 'Преемники',
    historyNotIndependent: 'Не независимое государство',
    historyPeople: 'Народ / земли без государства',
    historyArea: 'Площадь (по карте)',
    historyMapYears: 'На карте',
    historyReligion: 'Религия',
    historyPredecessors: 'Предшественники',
    historyWiki: 'Читать в Википедии',
    historyModernPlace: 'Сейчас это',
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
    roundStreak: (n) => `Серия ${n}`,
    longestStreak: (n) => `Лучшая серия: ${n}`,
    rankMaster: 'Мастер',
    rankExplorer: 'Знаток',
    rankLearner: 'Исследователь',
    rankRookie: 'Новичок',
    answerKey: (n) => `Клавиша ${n}`,
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
    deleteAccount: 'Удалить аккаунт',
    deleteAccountHint:
      'Аккаунт, рейтинг и дуэльный эло на сервере будут удалены. Прогресс на этом устройстве останется в браузере.',
    deleteAccountConfirm: 'Введите пароль, чтобы подтвердить.',
    exportData: 'Скачать мои данные',
    exportDataDone: 'Файл сохранён',
    signOutAll: 'Выйти везде',
    signOutAllHint: 'Снимет вход на этом и других устройствах.',
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
    sounds: 'Звуки',
    soundsOn: 'Вкл',
    soundsOff: 'Выкл',
    music: 'Мелодия',
    audioAll: 'Всё включено',
    audioAllOff: 'Выключить всё',
    accountCountry: 'Страна',
    countrySearch: 'Найти страну',
    settingsReport: 'Сообщить о проблеме',
    settingsAchievements: 'Ачивки',
    settingsXp: 'Опыт',
    settingsResults: 'Результаты',
    xpHowLead: 'Опыт копится за игру. Уровень аккаунта растёт от всей суммы.',
    xpHowFreeTitle: 'Свободная игра',
    xpHowFree:
      'Вольный режим даёт мало. География: 1 / 2 / 4 за верный ответ (легко / сложно / хардкор). Карта, население, основание, соседи, факты, моря и реки — на 1 больше. Лидеры: 1 / 2 / 4 (легко и средне / сложно / хардкор). Училка и тренажёр ошибок опыт не дают.',
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
    duelAnonName: 'Игрок',
    guestHint: 'Чтобы попасть в рейтинг, войдите по имени и паролю.',
    saveProfile: 'Сохранить',
    profileSaved: 'Сохранено',
    xpTotal: (amount) => `${amount} опыта`,
    xpGained: (amount) => `+${amount} опыта`,
    accountLevel: (n) => `Уровень ${n}`,
    accountLevelNext: (amount) => `до следующего: ${amount}`,
    intellectRank: (n) => intellectRankOf(n, 'ru'),
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
    ratingsDuel: 'Мультиплеер',
    ratingsDuelHint: 'Рейтинг онлайн-матчей. Стартовые 1000, после каждой законченной игры.',
    ratingsDuelEmpty: 'Пока пусто — сыграйте онлайн',
    ratingsDuelRecord: (wins, losses, draws) => `${wins}–${losses}–${draws}`,
    worldRecord: 'Мировой рекорд',
    worldRecordBeat: 'Рекорд обновлён!',
    worldRecordBonus: (amount) => `+${amount} опыта за рекорд`,
    worldRecordEmpty: 'Пока нет рекорда',
    worldRecordLine: (name, time) => `${name} · ${time}`,
    worldRecordHint: 'Нажмите уровень — лучший результат среди всех игроков.',
    tapPassport: 'Нажмите страну — откроется паспорт',
    capital: 'Столица',
    tld: 'Домен',
    callingCode: 'Телефон',
    carCode: 'Автокод',
    population: 'Население',
    currency: 'Валюта',
    government: 'Гос. устройство',
    fact: 'Факт',
    neighbors: 'Сухопутные соседи',
    noNeighbors: 'Нет сухопутных соседей',
    close: 'Закрыть',
    credit: 'Создано Львом Уманским',
    legalAbout: 'О проекте',
    legalPrivacy: 'Политика',
    legalContacts: 'Контакты',
    legalTerms: 'Условия',
    legalCookies: 'Cookie',
    cookieNotice:
      'Нужные файлы cookie — язык страницы и вход. Рекламные ставятся только если разрешите. Сеть рекламы пока не подключена: скрипты не грузятся, пока нет согласия.',
    cookieNoticeEssential: 'Только нужные',
    cookieNoticeReject: 'Отклонить все',
    cookieNoticeAll: 'Принять все',
    legalCountries: 'Страны',
    legalToday: 'Страна дня',
    legalLanguages: 'Языки',
    legalLists: 'Подборки',
    collectionsHint: 'Челлендж дня, челлендж темы и короткие наборы — можно сразу играть.',
    collectionsChallenges: 'Челленджи',
    themeChallenge: 'Челлендж темы',
    dailyChallenge: 'Челлендж дня',
    dailyPlay: 'Играть',
    dailyDone: (score, total) => `Сегодня ${score}/${total}`,
    dailyStreak: (n) => (n === 1 ? '1 день подряд' : `${n} дней подряд`),
    collectionItems: (n) => (n === 1 ? '1 карточка' : `${n} карточек`),
    collectionOpen: 'Открыть страницу',
    share: 'Поделиться',
    shareCopied: 'Ссылка скопирована',
    shareBetter: 'Сможешь лучше?',
    shareTap: 'Нажми, чтобы отправить',
    shareResult: (score, theme, url) => `${score} · ${theme}\nСможешь лучше?\n${url}`,
    shareToday: (name, url) => `Страна дня — ${name}. ${url}`,
    duel: 'Дуэль',
    duelHint: 'Один на один с другом: создайте комнату или введите код.',
    duelPlay: 'Играть',
    multiplayer: 'Мультиплеер',
    multiplayerPlay: 'Играть онлайн',
    multiplayerWaiting: 'Ищем соперника',
    multiplayerHint: 'Онлайн-миксы: одна очередь на несколько режимов.',
    profile: 'Профиль',
    profileHint: 'Настройки аккаунта и игра с другом.',
    playWithFriend: 'Играть с другом',
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
    customMix: 'Свой микс',
    easyMixNote: 'Флаг → страна · Страна → флаг · Страна → столица',
    hardMixNote: 'Все режимы, кроме фактов: флаги, карта, соседи, моря и реки, коды стран',
    customMixNote: 'Любые режимы, кроме фактов',
    footballEasyMixNote: 'Победители ЧМ · Победители Евро · Хозяева ЧМ · Победители ЛЧ',
    footballHardMixNote: 'Все футбольные режимы, кроме фактов про игроков',
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
    duelRating: (rating, delta) =>
      delta === 0 ? String(rating) : `${rating} (${delta > 0 ? '+' : ''}${delta})`,
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
    duelFactsSeriesPlayers: 'Игроков за дуэль',
  },
  en: {
    title: 'Country Passport',
    subtitle: '193 countries. No shortcuts.',
    worldsPick: 'Choose a topic',
    geography: 'Geography',
    football: 'Football',
    ...MATH_MODE_COPY.en,
    ...ASTRO_MODE_COPY.en,
    ...PACK_MODE_COPY.en,
    ...EMPIRE_COPY.en,
    ...ALBUM_COPY.en,
    ...TOUR_COPY.en,
    ...THEME_MODE_COPY.en,
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
    euroFinalists: 'Euro finalists',
    euroFinalistPrompt: (year) => `Who lost the Euro ${year} final?`,
    euroHosts: 'Euro hosts',
    euroHostPrompt: (year) => `Who hosted Euro ${year}?`,
    euroTitleYears: 'Euro title year',
    euroTitleYearPrompt: (name) => `Which year did ${name} win the Euro?`,
    wcScorers: 'World Cup scorers',
    wcScorerPrompt: (year) => `Which country had the top scorer at the ${year} World Cup?`,
    uclWinners: 'Champions League',
    uclWinnerPrompt: (year) => `Who won the ${year} European Cup / Champions League?`,
    copaWinners: 'Copa América',
    copaWinnerPrompt: (year) => `Who won Copa América ${year}?`,
    afconWinners: 'AFCON',
    afconWinnerPrompt: (year) => `Who won AFCON ${year}?`,
    copaFinalists: 'Copa América finalists',
    copaFinalistPrompt: (year) => `Who lost the ${year} Copa América final?`,
    copaHosts: 'Copa América hosts',
    copaHostPrompt: (year) => `Who hosted Copa América ${year}?`,
    afconFinalists: 'AFCON finalists',
    afconFinalistPrompt: (year) => `Who lost the ${year} AFCON final?`,
    afconHosts: 'AFCON hosts',
    afconHostPrompt: (year) => `Who hosted AFCON ${year}?`,
    asianCupWinners: 'AFC Asian Cup',
    asianCupWinnerPrompt: (year) => `Who won the ${year} AFC Asian Cup?`,
    goldCupWinners: 'Gold Cup',
    goldCupWinnerPrompt: (year) => `Who won the ${year} Gold Cup?`,
    nationsLeagueWinners: 'Nations League',
    nationsLeagueWinnerPrompt: (year) => `Who won the ${year} Nations League?`,
    uclFinalists: 'UCL finalists',
    uclFinalistPrompt: (year) => `Who lost the ${year} European Cup / Champions League final?`,
    uclTitleYears: 'UCL title year',
    uclTitleYearPrompt: (name) => `Which year did ${name} win the European Cup / Champions League?`,
    europaWinners: 'Europa League',
    europaWinnerPrompt: (year) => `Who won the ${year} UEFA Cup / Europa League?`,
    libertadoresWinners: 'Copa Libertadores',
    libertadoresWinnerPrompt: (year) => `Who won the ${year} Copa Libertadores?`,
    leagueWinners: 'League champions',
    leagueWinnerPrompt: (league, year) => `Who won ${league} in the season ending ${year}?`,
    leaguePl: 'the Premier League',
    leagueLaliga: 'La Liga',
    leagueSeriea: 'Serie A',
    leagueBundesliga: 'the Bundesliga',
    leagueLigue1: 'Ligue 1',
    clubCrestToName: 'Club crest',
    clubCrestPrompt: 'Which club is this?',
    stadiumToClub: 'Stadium to club',
    stadiumPrompt: (name) => `Which club plays at ${name}?`,
    playerToNation: 'Player to country',
    playerToNationPrompt: 'Which country does this player represent?',
    playerToClub: 'Player to club',
    playerToClubPrompt: 'Which club is he at?',
    playerClubToName: 'Club to player',
    playerClubPrompt: 'Which of these players is at this club?',
    playerClubNote: 'Current club, or last club if retired.',
    playerShirtToName: 'Number and flag',
    playerShirtPrompt: (n) => `Who wore number ${n} for this national team?`,
    ballonDorWinners: 'Ballon d’Or',
    ballonDorPrompt: (year) => `Who won the Ballon d’Or in ${year}?`,
    goldenBallWinners: 'Player of the tournament',
    goldenBallPrompt: (event, year) => `Who was player of the tournament at ${event} ${year}?`,
    goldenBallWc: 'the World Cup',
    goldenBallEuro: 'the Euro',
    managerPhotoToName: 'Manager by photo',
    playerCardBorn: 'Born',
    playerCardLived: 'Lived',
    playerCardNation: 'National team',
    playerCardBornIn: 'Born in',
    playerCardClubs: 'Clubs',
    playerClubBadgeNow: 'Current',
    playerClubBadgeLast: 'Last',
    playerCardClubCountries: 'Club countries',
    playerCardTrophies: 'Trophies',
    playerCardHonours: 'Individual honours',
    playerCardFacts: 'Notes',
    playerCardHeight: 'Height',
    playerCardFoot: 'Preferred foot',
    playerCardNumber: 'Number',
    playerCardCaps: 'Caps / goals',
    playerFootLeft: 'left',
    playerFootRight: 'right',
    playerFootBoth: 'both',
    playerEraActive: 'Active',
    playerEraLegend: 'Legend',
    greatClubsTitle: '50 clubs',
    clubCardFounded: 'Founded',
    clubCardYear: 'Year',
    clubCardSquad: 'Squad',
    clubCardSquadEmpty: 'No squad for this year',
    clubCardPlayer: 'Player card',
    clubCardAbout: 'The data covers the club’s full available history. Choose a year to view its squad; highlighted names open player cards.',
    clubCardUniquePlayers: 'All-time players',
    clubCardDataPeriod: 'Data period',
    clubCardAllClubsPlayers: 'Unique players across 50 clubs',
    clubCardStatsNote: 'Players are matched by player ID, Wikipedia article, or normalized name. A player who represented several clubs is counted once.',
    playerLearnAll: 'All',
    footballGroupWc: 'World Cup',
    footballGroupEuro: 'Euro',
    footballGroupOther: 'Other',
    footballGroupClubs: 'Clubs',
    footballGroupPlayers: 'Players',
    footballGroupManagers: 'Managers',
    footballTopicCups: 'Tournaments',
    playerPhotoToName: 'Footballer by photo',
    playerFactsToName: 'Footballer by facts',
    playerFactsHint:
      'Not in the campaign or hard mix. First 5 facts are 10 seconds, then 15. 10 facts, 3 wrong guesses fail the attempt.',
    factGuessPlayer: 'Player name',
    playerPositionGk: 'goalkeeper',
    playerPositionDf: 'defender',
    playerPositionMf: 'midfielder',
    playerPositionFw: 'forward',
    playerFactNation: (name) => `Played for ${name}.`,
    playerFactPosition: (pos) => `Position: ${pos}.`,
    playerFactClub: (name) => `Club (current or last): ${name}.`,
    playerFactWcWinner: 'Won the World Cup.',
    playerFactEuroWinner: 'Won the European Championship.',
    playerFactCopaWinner: 'Won Copa América.',
    playerFactAfconWinner: 'Won the Africa Cup of Nations.',
    playerFactUclWinner: 'Won the European Cup / Champions League.',
    playerFactBallonDor: 'Won the Ballon d’Or.',
    playerFactBallonDorYear: (year) => `Ballon d’Or in ${year}.`,
    playerFactBallonDorCount: (n) =>
      n >= 3 ? 'Three or more Ballons d’Or.' : n === 2 ? 'Two Ballons d’Or.' : 'One Ballon d’Or.',
    playerFactWcCount: (n) =>
      n === 0
        ? 'Never played at a World Cup.'
        : n === 1
          ? 'Played at one World Cup.'
          : n === 2
            ? 'Played at two World Cups.'
            : 'Played at three or more World Cups.',
    playerFactBornDecade: (decade) => `Born in the ${decade}s.`,
    playerFactWcFinalGoal: 'Scored in a World Cup final.',
    playerFactWcCaptain: 'Captained a side at the World Cup.',
    playerFactGoldenBoot: 'Won the World Cup Golden Boot.',
    playerFactBothClasico: 'Played for both Barcelona and Real Madrid.',
    playerFactLeftFoot: 'Naturally left-footed.',
    playerFactNumber10: 'A classic number 10.',
    worldsBack: 'Topics',
    footballRoundSize: 'Questions in the match',
    footballXpHint: (n) => `Correct answer: +${n} XP. Finish and go perfect for a bonus.`,
    codes: 'Country codes',
    codesSubtitle: 'Domain, calling code, and car plate.',
    familyMix: 'Mix',
    familyFlags: 'Flags',
    familyMap: 'Map',
    familyWater: 'Seas and rivers',
    modeSetup: 'Round setup',
    rankingSetup: 'A reference list, not a round. Pick a ranking to open the table.',
    mixPickModes: 'Pick any modes for your mix',
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
    leadersSubtitle: 'U.S. presidents, popes, rulers from Askold to the Union, and kings of England. Portraits from Wikimedia Commons, free licenses only. Tap a label on a disputed case for the explanation.',
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
    ukYearsToName: 'Kings of England · years',
    ukPhotoToName: 'Kings of England · photo',
    usPresidents: 'U.S. presidents',
    popesLeaders: 'Popes',
    askoldToUnion: 'From Askold to the Union',
    ukMonarchs: 'Kings of England',
    leaderTopic: 'Topic',
    leaderAsk: 'Question',
    leaderAskYears: 'Years',
    leaderAskNumber: 'Number',
    leaderAskPhoto: 'Photo',
    leaderHideNames: 'Hide names',
    leaderHiddenName: '???',
    leaderEraUsEarly: 'Founding',
    leaderEraUs1800s: '19th century',
    leaderEraUsModern: '20th–21st',
    leaderEraPopeEarly: 'Early',
    leaderEraPopeMedieval: 'Medieval',
    leaderEraPopeModern: 'Modern',
    leaderEraRusKiev: 'Kiev',
    leaderEraRusMoscow: 'Moscow',
    leaderEraRusEmpire: 'Empire',
    leaderEraRusSoviet: 'USSR',
    leaderEraUkMedieval: 'Medieval',
    leaderEraUkTudor: 'Tudors & Stuarts',
    leaderEraUkModern: 'Hanover+',
    leaderLearnName: 'Name',
    leaderFeat: 'What stands out',
    leaderNoteDeJure: 'de jure · did not actually rule',
    leaderNoteParallel: 'parallel rule',
    leaderNoteDisputed: 'disputed',
    leaderNoteAbdicated: 'abdicated',
    leaderNoteVpDeath: 'vice president · took office after death',
    leaderNoteVpResign: 'vice president · took office after resignation (impeachment)',
    usYearsPrompt: (range) => `Who was U.S. president in ${range}?`,
    usNumberPrompt: (n) => `Who was the ${ordinalEn(n)} U.S. president?`,
    popeYearsPrompt: (range) => `Who was pope in ${range}?`,
    popeNumberPrompt: (n) => `Who was the ${ordinalEn(n)} pope?`,
    rusNumberPrompt: (n) => `Who was the ${ordinalEn(n)} ruler?`,
    askoldPrompt: (range) => `Who ruled in ${range}?`,
    ukYearsPrompt: (range) => `Who was king of England in ${range}?`,
    leaderPhotoPrompt: 'Who is this?',
    album: 'Stamps',
    albumHint: 'Up to 5 stamps per country. The first is a correct answer in scored play. Then: a new mode, Hard or Hardcore, a perfect round, and a finished Hardcore round.',
    albumCount: (copies, countries, total) => `${copies} stamps · ${countries} of ${total} countries`,
    albumEmpty: 'Empty so far. Answer correctly in free play or the campaign.',
    albumHintWorld: 'Up to 5 copies per card. The first is a correct answer in scored play. Then: a new mode, Hard or Hardcore, a perfect round, and a finished Hardcore round.',
    albumCountWorld: (copies, items, total) => `${copies} copies · ${items} of ${total}`,
    stampNew: 'New stamp',
    mistakesTrain: 'Mistakes',
    mistakesHint: 'Only countries you missed. No timer.',
    mistakesEmpty: 'No mistakes yet — keep it that way.',
    mistakesClear: 'Clear list',
    noTimerHint: 'No timer and no lives.',
    footballLearnHint: 'Player cards. Then you can test yourself.',
    footballRosterCount: (n) => `${n} ${n === 1 ? 'footballer' : 'footballers'}`,
    footballRosterSplit: (active, legends) =>
      `${active} active · ${legends} ${legends === 1 ? 'legend' : 'legends'}`,
    footballTableYear: 'Year',
    footballTableWinner: 'Winner',
    footballTableRunnerUp: 'Runner-up',
    footballTableMatch: 'Final',
    footballTableScore: 'Score',
    footballTableHost: 'Host',
    footballTableVenue: 'Where',
    footballTablePlayer: 'Player',
    footballTableGoals: 'Goals',
    footballTableCountry: 'Country',
    footballAet: 'a.e.t.',
    footballPens: 'pens',
    footballReplay: 'replay',
    footballGolden: 'golden goal',
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
    silhouetteToName: 'Silhouette → country',
    nameToSilhouette: 'Country → silhouette',
    factsToName: 'Facts → country',
    mapToSea: 'Sea → map',
    mapToRiver: 'River → map',
    seaToName: 'Coast → country',
    riverToName: 'River/lake → country',
    nameToLanguage: 'Country → language',
    nameToLanguagePrompt: 'What is this country’s language?',
    languageToName: 'Language → country',
    languageToNamePrompt: 'Which country is this language from?',
    nameToDriving: 'Country → driving side',
    nameToDrivingPrompt: 'Which side do they drive on?',
    drivingToName: 'Driving side → country',
    drivingToNamePrompt: 'Which country drives on this side?',
    drivingLeft: 'Left',
    drivingRight: 'Right',
    familySilhouette: 'Silhouette',
    familyDriving: 'Driving side',
    silhouettePrompt: 'Which country is this?',
    nameToGov: 'Country → government',
    nameToGovPrompt: 'What is this country’s form of government?',
    govPresidential: 'Presidential republic',
    govSemiPresidential: 'Semi-presidential republic',
    govParliamentary: 'Parliamentary republic',
    govConstMonarchy: 'Constitutional monarchy',
    govAbsMonarchy: 'Absolute monarchy',
    govOneParty: 'One-party republic',
    govTheocracy: 'Theocracy',
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
    rankingSource: 'Source',
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
    mixAskGov: 'Name the form of government',
    mixAskMap: 'Find the country on the map',
    mixAskSilhouette: 'Name the country from the silhouette',
    mixAskDriving: 'Name the driving side',
    mixAskLanguage: 'Name the country from the language',
    mixAskSea: 'Name the sea or ocean',
    mixAskRiver: 'Name the river or lake',
    founded: 'Founded',
    nationalLanguage: 'Language',
    noNationalLanguage: 'No national language',
    andOthers: 'and others',
    spokenLanguages: 'Languages spoken',
    nationalMark: 'nat.',
    spokenRule: 'From 1% of the population and at least 5,000 speakers. At most 20 languages.',
    languageCountries: 'Countries where at least 1% speak this language',
    languageRange: 'Range',
    languagesIndex: 'Languages',
    region: 'Region',
    allRegions: 'All regions',
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    includeExtras: 'All states and territories',
    includeExtrasHint: 'Including dependencies and non-UN members.',
    includeEraStates: 'All states of the selected era',
    includeEraStatesHint: 'Independent and de facto states of the map year.',
    mapYear: 'Year',
    mapSnapshot: (year) => `Borders: ${year} snapshot`,
    mapHistoryCredit: 'Historical borders: historical-basemaps · CC BY',
    historyYears: 'Years',
    historyStatus: 'Status',
    historyIndependent: 'Independent state',
    historyDeFacto: 'De facto independent',
    historyDependent: 'Dependent territory',
    historySuzerain: 'Dependent on',
    historyColony: 'Colony',
    historyProtectorate: 'Protectorate',
    historyViceroyalty: 'Viceroyalty',
    historyVassal: 'Vassal',
    historyCompanyRule: 'Company territory',
    historyPersonalUnion: 'Personal union / part of a monarchy',
    historySuccessors: 'Successors',
    historyNotIndependent: 'Not an independent state',
    historyPeople: 'People / land without a state',
    historyArea: 'Area (on the map)',
    historyMapYears: 'On the map',
    historyReligion: 'Religion',
    historyPredecessors: 'Predecessors',
    historyWiki: 'Read on Wikipedia',
    historyModernPlace: 'Today this is',
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
    roundStreak: (n) => `Streak ${n}`,
    longestStreak: (n) => `Longest streak: ${n}`,
    rankMaster: 'Master',
    rankExplorer: 'Expert',
    rankLearner: 'Explorer',
    rankRookie: 'Rookie',
    answerKey: (n) => `Key ${n}`,
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
    deleteAccount: 'Delete account',
    deleteAccountHint:
      'Your server account, leaderboards and duel rating will be removed. Progress on this device stays in the browser.',
    deleteAccountConfirm: 'Enter your password to confirm.',
    exportData: 'Download my data',
    exportDataDone: 'File saved',
    signOutAll: 'Sign out everywhere',
    signOutAllHint: 'Ends the session on this device and any others.',
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
    sounds: 'Sounds',
    soundsOn: 'On',
    soundsOff: 'Off',
    music: 'Music',
    audioAll: 'All on',
    audioAllOff: 'Mute all',
    accountCountry: 'Country',
    countrySearch: 'Find a country',
    settingsReport: 'Report a problem',
    settingsAchievements: 'Achievements',
    settingsXp: 'XP',
    settingsResults: 'Results',
    xpHowLead: 'XP builds as you play. Account level follows the total.',
    xpHowFreeTitle: 'Free play',
    xpHowFree:
      'Free play pays little. Geography: 1 / 2 / 4 XP per correct answer (easy / hard / hardcore). Map, population, founded, neighbours, facts, seas and rivers add 1. Leaders: 1 / 2 / 4 (easy and medium / hard / hardcore). Learn and the mistakes trainer award no XP.',
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
    duelAnonName: 'Player',
    guestHint: 'Sign in with your name and password to appear on the leaderboard.',
    saveProfile: 'Save',
    profileSaved: 'Saved',
    xpTotal: (amount) => `${amount} XP`,
    xpGained: (amount) => `+${amount} XP`,
    accountLevel: (n) => `Level ${n}`,
    accountLevelNext: (amount) => `to next: ${amount}`,
    intellectRank: (n) => intellectRankOf(n, 'en'),
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
    ratingsDuel: 'Multiplayer',
    ratingsDuelHint: 'Rating from online matches. Everyone starts at 1000; it updates after each finished game.',
    ratingsDuelEmpty: 'Empty for now — play online',
    ratingsDuelRecord: (wins, losses, draws) => `${wins}–${losses}–${draws}`,
    worldRecord: 'World record',
    worldRecordBeat: 'Record broken!',
    worldRecordBonus: (amount) => `+${amount} XP for the record`,
    worldRecordEmpty: 'No record yet',
    worldRecordLine: (name, time) => `${name} · ${time}`,
    worldRecordHint: 'Tap a level — the best result among all players.',
    tapPassport: 'Tap a country to open its passport',
    capital: 'Capital',
    tld: 'Domain',
    callingCode: 'Calling code',
    carCode: 'Car plate',
    population: 'Population',
    currency: 'Currency',
    government: 'Government',
    fact: 'Fact',
    neighbors: 'Land neighbors',
    noNeighbors: 'No land neighbors',
    close: 'Close',
    credit: 'Created by Lev Umansky',
    legalAbout: 'About',
    legalPrivacy: 'Privacy',
    legalContacts: 'Contact',
    legalTerms: 'Terms',
    legalCookies: 'Cookies',
    cookieNotice:
      'Necessary cookie files are page language and sign-in. Ad cookies are set only if you allow them. No ad network is connected yet: those scripts stay off until you consent.',
    cookieNoticeEssential: 'Necessary only',
    cookieNoticeReject: 'Reject all',
    cookieNoticeAll: 'Accept all',
    legalCountries: 'Countries',
    legalToday: 'Country of the day',
    legalLanguages: 'Languages',
    legalLists: 'Lists',
    collectionsHint: 'The daily challenge, a theme challenge, and short sets — play them right away.',
    collectionsChallenges: 'Challenges',
    themeChallenge: 'Theme challenge',
    dailyChallenge: 'Challenge of the day',
    dailyPlay: 'Play',
    dailyDone: (score, total) => `Today ${score}/${total}`,
    dailyStreak: (n) => (n === 1 ? '1-day streak' : `${n}-day streak`),
    collectionItems: (n) => (n === 1 ? '1 card' : `${n} cards`),
    collectionOpen: 'Open page',
    share: 'Share',
    shareCopied: 'Link copied',
    shareBetter: 'Can you do better?',
    shareTap: 'Tap to send',
    shareResult: (score, theme, url) => `${score} · ${theme}\nCan you do better?\n${url}`,
    shareToday: (name, url) => `Country of the day: ${name}. ${url}`,
    duel: 'Duel',
    duelHint: 'One on one with a friend: create a room or enter a code.',
    duelPlay: 'Play',
    multiplayer: 'Multiplayer',
    multiplayerPlay: 'Play online',
    multiplayerWaiting: 'Looking for an opponent',
    multiplayerHint: 'Online mixes: one queue across several modes.',
    profile: 'Profile',
    profileHint: 'Account settings and a game with a friend.',
    playWithFriend: 'Play with a friend',
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
    customMix: 'Custom mix',
    easyMixNote: 'Flag → country · Country → flag · Country → capital',
    hardMixNote: 'All modes except facts: flags, map, neighbours, seas and rivers, country codes',
    customMixNote: 'Any modes except facts',
    footballEasyMixNote: 'World Cup winners · Euro winners · World Cup hosts · Champions League',
    footballHardMixNote: 'All football modes except player facts',
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
    duelRating: (rating, delta) =>
      delta === 0 ? String(rating) : `${rating} (${delta > 0 ? '+' : ''}${delta})`,
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
    duelFactsSeriesPlayers: 'Players per duel',
  },
  ...EXTRA_STRINGS,
}

for (const lang of Object.keys(STRINGS) as Lang[]) {
  STRINGS[lang] = withRtlModeArrows(lang, STRINGS[lang])
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
    const topic =
      kind === 'pope'
        ? t.popesLeaders
        : kind === 'rus'
          ? t.askoldToUnion
          : kind === 'uk'
            ? t.ukMonarchs
            : t.usPresidents
    const ask = leadersAskOf(mode)
    const askLabel = ask === 'photo' ? t.leaderAskPhoto : ask === 'number' ? t.leaderAskNumber : t.leaderAskYears
    return `${topic} · ${askLabel}`
  }
  return rtlModeArrows(STRINGS[lang][mode], lang)
}

export function astroQuestionPrompt(mode: QuizMode, lang: Lang): string | null {
  if (!isAstroMode(mode)) return null
  const t = STRINGS[lang]
  switch (mode) {
    case 'planetToOrder':
      return t.astroPlanetPrompt
    case 'orderToPlanet':
      return t.astroOrderPrompt
    case 'planetToKind':
      return t.astroKindPrompt
    case 'planetFactsToName':
      return t.astroPlanetFactsPrompt
    case 'moonToPlanet':
      return t.astroMoonPrompt
    case 'planetToMoon':
      return t.astroPlanetMoonPrompt
    case 'moonFactsToName':
      return t.astroMoonFactsPrompt
    case 'starToClass':
      return t.astroStarPrompt
    case 'constelToName':
      return t.astroConstelPrompt
    case 'deepSkyFactsToName':
      return t.astroDeepSkyPrompt
    case 'missionToTarget':
      return t.astroMissionTargetPrompt
    case 'missionFactsToName':
      return t.astroMissionFactsPrompt
    case 'telescopeFactsToName':
      return t.astroTelescopeFactsPrompt
    case 'astroPhotoToName':
      return t.astroPhotoPrompt
    case 'astroFactsToName':
      return t.astroFactsPrompt
    default:
      return null
  }
}

export function themeQuestionPrompt(mode: QuizMode, lang: Lang): string | null {
  if (!isThemeMode(mode)) return null
  const value = STRINGS[lang][THEME_PROMPT_KEY[mode]]
  return typeof value === 'string' ? value : null
}

export function mathQuestionPrompt(mode: QuizMode, lang: Lang): string | null {
  if (!isMathMode(mode)) return null
  const t = STRINGS[lang]
  switch (mode) {
    case 'exprToValue':
      return t.mathExprPrompt
    case 'valueToExpr':
      return t.mathValuePrompt
    case 'fractionDecimal':
      return t.mathFractionPrompt
    case 'percentToValue':
      return t.mathPercentPrompt
    case 'powerToValue':
      return t.mathPowerPrompt
    case 'orderOfOps':
      return t.mathOrderPrompt
    case 'shapeToName':
      return t.mathShapePrompt
    case 'nameToShape':
      return t.mathNameToShapePrompt
    case 'angleToKind':
      return t.mathAnglePrompt
    case 'formulaToQuantity':
      return t.mathFormulaPrompt
    case 'unitsConvert':
      return t.mathUnitsPrompt
    case 'symbolToMeaning':
      return t.mathSymbolPrompt
    case 'constantToValue':
      return t.mathConstantPrompt
    case 'siPrefixToFactor':
      return t.mathSiPrompt
    case 'mathPhotoToName':
      return t.mathPhotoPrompt
    case 'mathFactsToName':
      return t.mathFactsPrompt
    case 'mathPersonToPlace':
      return t.mathPersonPlacePrompt
    case 'theoremToAuthor':
      return t.mathTheoremPrompt
    default:
      return null
  }
}

export function footballQuestionPrompt(
  mode: QuizMode,
  year: number,
  name: string,
  lang: Lang,
  extra?: { league?: 'pl' | 'laliga' | 'seriea' | 'bundesliga' | 'ligue1'; stadiumName?: string; goldenEvent?: 'wc' | 'euro' },
): string | null {
  const t = STRINGS[lang]
  const leagueName =
    extra?.league === 'pl'
      ? t.leaguePl
      : extra?.league === 'laliga'
        ? t.leagueLaliga
        : extra?.league === 'seriea'
          ? t.leagueSeriea
          : extra?.league === 'bundesliga'
            ? t.leagueBundesliga
            : extra?.league === 'ligue1'
              ? t.leagueLigue1
              : t.leaguePl
  const golden = extra?.goldenEvent === 'euro' ? t.goldenBallEuro : t.goldenBallWc
  switch (mode) {
    case 'wcWinners':
      return t.wcWinnerPrompt(year)
    case 'wcFinalists':
      return t.wcFinalistPrompt(year)
    case 'wcHosts':
      return t.wcHostPrompt(year)
    case 'wcTitleYears':
      return t.wcTitleYearPrompt(name)
    case 'wcScorers':
      return t.wcScorerPrompt(year)
    case 'euroWinners':
      return t.euroWinnerPrompt(year)
    case 'euroFinalists':
      return t.euroFinalistPrompt(year)
    case 'euroHosts':
      return t.euroHostPrompt(year)
    case 'euroTitleYears':
      return t.euroTitleYearPrompt(name)
    case 'uclWinners':
      return t.uclWinnerPrompt(year)
    case 'uclFinalists':
      return t.uclFinalistPrompt(year)
    case 'uclTitleYears':
      return t.uclTitleYearPrompt(name)
    case 'copaWinners':
      return t.copaWinnerPrompt(year)
    case 'copaFinalists':
      return t.copaFinalistPrompt(year)
    case 'copaHosts':
      return t.copaHostPrompt(year)
    case 'afconWinners':
      return t.afconWinnerPrompt(year)
    case 'afconFinalists':
      return t.afconFinalistPrompt(year)
    case 'afconHosts':
      return t.afconHostPrompt(year)
    case 'asianCupWinners':
      return t.asianCupWinnerPrompt(year)
    case 'goldCupWinners':
      return t.goldCupWinnerPrompt(year)
    case 'nationsLeagueWinners':
      return t.nationsLeagueWinnerPrompt(year)
    case 'europaWinners':
      return t.europaWinnerPrompt(year)
    case 'libertadoresWinners':
      return t.libertadoresWinnerPrompt(year)
    case 'leagueWinners':
      return t.leagueWinnerPrompt(leagueName, year)
    case 'clubCrestToName':
      return t.clubCrestPrompt
    case 'stadiumToClub':
      return t.stadiumPrompt(extra?.stadiumName ?? name)
    case 'playerToNation':
      return t.playerToNationPrompt
    case 'playerToClub':
      return t.playerToClubPrompt
    case 'playerClubToName':
      return t.playerClubPrompt
    case 'playerShirtToName':
      return t.playerShirtPrompt(Number(name) || 0)
    case 'ballonDorWinners':
      return t.ballonDorPrompt(year)
    case 'goldenBallWinners':
      return t.goldenBallPrompt(golden, year)
    case 'managerPhotoToName':
      return t.leaderPhotoPrompt
    default:
      return null
  }
}

export function modesLabel(modes: readonly QuizMode[], lang: Lang): string {
  const t = STRINGS[lang]
  const selected = [...QUIZ_MODES, ...RANKING_MODES].filter((mode) => modes.includes(mode))
  if (sameModes(selected, EASY_MIX_MODES)) return t.easyMix
  if (sameModes(selected, HARD_MIX_MODES)) return t.hardMix
  if (sameModes(selected, FLAGS_MIX_MODES)) return t.familyFlags
  if (sameModes(selected, MAP_MIX_MODES)) return t.familyMap
  const codes = CODES_MODES.filter((mode) => modes.includes(mode))
  if (sameModes(codes, CODES_MODES) && selected.length === 0) return t.codes
  if (selected.length > 0) return selected.map((mode) => modeLabel(mode, lang)).join(' · ')
  const football = FOOTBALL_MODES.filter((mode) => modes.includes(mode))
  if (sameModes(football, EASY_FOOTBALL_MIX_MODES)) return t.easyMix
  if (sameModes(football, HARD_FOOTBALL_MIX_MODES)) return t.hardMix
  if (sameModes(football, WC_FOOTBALL_MATCH_MIX)) return t.footballGroupWc
  if (sameModes(football, PLAYER_FOOTBALL_MATCH_MIX)) return t.footballGroupPlayers
  if (sameModes(football, CLUB_FOOTBALL_MATCH_MIX)) return t.footballGroupClubs
  if (football.length > 0) return football.map((mode) => modeLabel(mode, lang)).join(' · ')
  const leaders = modes.filter(isLeadersMode)
  if (sameModes(leaders, US_LEADERS_MATCH_MIX)) return t.usPresidents
  if (sameModes(leaders, PHOTO_LEADERS_MATCH_MIX)) return `${t.leaders} · ${t.leaderAskPhoto}`
  if (leaders.length > 0) return leaders.map((mode) => modeLabel(mode, lang)).join(' · ')
  if (modes.length === 0) return modeLabel('flagToName', lang)
  return modes.map((mode) => modeLabel(mode, lang)).join(' · ')
}

export function mixLabel(mix: MixKind, lang: Lang): string {
  if (mix === 'easy') return STRINGS[lang].easyMix
  if (mix === 'hard') return STRINGS[lang].hardMix
  return STRINGS[lang].customMix
}

export function mixAskHint(mode: QuizMode, lang: Lang): string {
  const t = STRINGS[lang]
  if (isFootballMode(mode)) return ''
  if (isMathMode(mode)) return mathQuestionPrompt(mode, lang) ?? ''
  if (isAstroMode(mode)) return astroQuestionPrompt(mode, lang) ?? ''
  if (isThemeMode(mode)) return themeQuestionPrompt(mode, lang) ?? ''
  if (mode === 'nameToFlag') return t.mixAskFlag
  if (mode === 'nameToCapital') return t.mixAskCapital
  if (mode === 'nameToCurrency') return t.mixAskCurrency
  if (mode === 'nameToPopulation') return t.mixAskPopulation
  if (mode === 'nameToFounded') return t.mixAskFounded
  if (mode === 'nameToGov') return t.mixAskGov
  if (mode === 'nameToMap') return t.mixAskMap
  if (mode === 'silhouetteToName' || mode === 'nameToSilhouette') return t.mixAskSilhouette
  if (mode === 'nameToDriving' || mode === 'drivingToName') return t.mixAskDriving
  if (mode === 'languageToName') return t.mixAskLanguage
  if (mode === 'mapToSea') return t.mixAskSea
  if (mode === 'mapToRiver') return t.mixAskRiver
  return t.mixAskCountry
}

export function drivingLabel(side: 'left' | 'right', lang: Lang): string {
  return side === 'left' ? STRINGS[lang].drivingLeft : STRINGS[lang].drivingRight
}

export function governmentLabel(kind: GovKind, lang: Lang): string {
  const t = STRINGS[lang]
  switch (kind) {
    case 'presidential':
      return t.govPresidential
    case 'semiPresidential':
      return t.govSemiPresidential
    case 'parliamentary':
      return t.govParliamentary
    case 'constMonarchy':
      return t.govConstMonarchy
    case 'absMonarchy':
      return t.govAbsMonarchy
    case 'oneParty':
      return t.govOneParty
    case 'theocracy':
      return t.govTheocracy
  }
}

function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}
