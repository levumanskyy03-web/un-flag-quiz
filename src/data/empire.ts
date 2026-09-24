import { QUIZ_WORLDS, type QuizWorld } from '../lib/quiz/core'

/** Один ресурс на каждый мир викторин. Порядок совпадает с QUIZ_WORLDS. */
export const EMPIRE_RESOURCE_BY_WORLD = {
  geo: 'maps',
  leaders: 'seals',
  football: 'tickets',
  olympics: 'medals',
  biology: 'seeds',
  math: 'blueprints',
  astronomy: 'stardust',
  cs: 'chips',
  food: 'spices',
} as const satisfies Record<QuizWorld, string>

export type EmpireResource = (typeof EMPIRE_RESOURCE_BY_WORLD)[QuizWorld]

export const EMPIRE_RESOURCES = QUIZ_WORLDS.map((world) => EMPIRE_RESOURCE_BY_WORLD[world]) as readonly EmpireResource[]

export const EMPIRE_WORLD_BY_RESOURCE = Object.fromEntries(
  QUIZ_WORLDS.map((world) => [EMPIRE_RESOURCE_BY_WORLD[world], world]),
) as Record<EmpireResource, QuizWorld>

export const EMPIRE_COMMON_BUILDINGS = ['hall', 'housing', 'storage', 'treasury', 'library'] as const
export type EmpireCommonBuilding = (typeof EMPIRE_COMMON_BUILDINGS)[number]

/** Мировые здания называются по ключу мира. */
export type EmpireBuilding = QuizWorld | EmpireCommonBuilding | 'pantheon'

export const EMPIRE_BUILDINGS: readonly EmpireBuilding[] = [...QUIZ_WORLDS, ...EMPIRE_COMMON_BUILDINGS]
/** Все здания включая Пантеон (открывается финалом «Полиглота знаний»). */
export const EMPIRE_ALL_BUILDINGS: readonly EmpireBuilding[] = [...EMPIRE_BUILDINGS, 'pantheon']

export function isEmpireWorldBuilding(building: EmpireBuilding): building is QuizWorld {
  return (QUIZ_WORLDS as readonly string[]).includes(building)
}

export const EMPIRE_ERA_COUNT = 8
export type EmpireEra = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export const EMPIRE_ERA_KEYS = [
  'settlement',
  'antiquity',
  'medieval',
  'earlyModern',
  'industrial',
  'electric',
  'digital',
  'space',
] as const
export type EmpireEraKey = (typeof EMPIRE_ERA_KEYS)[number]

export type EmpireEraRow = {
  era: EmpireEra
  key: EmpireEraKey
  mult: number
  hallMin: number
  levelSumMin: number
  eachResourceMin: number
}

export const EMPIRE_ERAS: readonly EmpireEraRow[] = [
  { era: 1, key: 'settlement', mult: 1.0, hallMin: 0, levelSumMin: 0, eachResourceMin: 0 },
  { era: 2, key: 'antiquity', mult: 1.5, hallMin: 3, levelSumMin: 20, eachResourceMin: 60 },
  { era: 3, key: 'medieval', mult: 2.2, hallMin: 6, levelSumMin: 50, eachResourceMin: 200 },
  { era: 4, key: 'earlyModern', mult: 3.2, hallMin: 10, levelSumMin: 100, eachResourceMin: 600 },
  { era: 5, key: 'industrial', mult: 4.6, hallMin: 15, levelSumMin: 170, eachResourceMin: 1500 },
  { era: 6, key: 'electric', mult: 6.5, hallMin: 20, levelSumMin: 260, eachResourceMin: 3500 },
  { era: 7, key: 'digital', mult: 9.0, hallMin: 27, levelSumMin: 370, eachResourceMin: 8000 },
  { era: 8, key: 'space', mult: 12.5, hallMin: 35, levelSumMin: 500, eachResourceMin: 18000 },
]

export function empireEraRow(era: number): EmpireEraRow {
  return EMPIRE_ERAS[Math.min(EMPIRE_ERA_COUNT, Math.max(1, Math.floor(era))) - 1]
}

export function eraMult(era: number) {
  return empireEraRow(era).mult
}

/** Максимальный уровень любого здания в эпохе. */
export function maxBuildingLevel(era: number) {
  return 5 * Math.min(EMPIRE_ERA_COUNT, Math.max(1, era))
}

// Стоимость
export const EMPIRE_COIN_COST_BASE = 50
export const EMPIRE_COIN_COST_GROWTH = 1.18
export const EMPIRE_RES_COST_BASE = 10
export const EMPIRE_RES_COST_GROWTH = 1.15
export const EMPIRE_HALL_COST_BASE = 30
export const EMPIRE_HALL_COST_GROWTH = 1.22

// Производство
export const EMPIRE_RES_PER_LEVEL_HOUR = 6
export const EMPIRE_COINS_PER_LEVEL_HOUR = 4
export const EMPIRE_SPECIALIST_BONUS = 0.2

// Капы
export const EMPIRE_HOUSING_BASE = 9
export const EMPIRE_HOUSING_PER_LEVEL = 6
export const EMPIRE_STORAGE_BASE = 200
export const EMPIRE_TREASURY_BASE = 1000
export const EMPIRE_OFFLINE_BASE_HOURS = 8
export const EMPIRE_OFFLINE_MAX_HOURS = 24
export const EMPIRE_OFFLINE_FULL_MS = 30 * 60 * 1000
export const EMPIRE_OFFLINE_FACTOR = 0.6
export const EMPIRE_PENDING_SPECIALISTS_MAX = 10

// Стройка
export const EMPIRE_BUILD_MS_PER_LEVEL = 30_000
export const EMPIRE_SECOND_SLOT_HALL_LEVEL = 15

// Библиотека, Сокровищница
export const EMPIRE_LIBRARY_OFF_PER_LEVEL = 0.05
export const EMPIRE_LIBRARY_OFF_MAX = 0.4
export const EMPIRE_LIBRARY_FREE_PER_LEVELS = 5
export const EMPIRE_SELL_RATE_PER_LEVEL = 0.1
export const EMPIRE_TIME_BONUS_MS = 1500
export const EMPIRE_TIME_BONUS_PER_LEVELS = 10

// Стартовый пакет
export const EMPIRE_START_COINS = 100
export const EMPIRE_START_RESOURCE = 10
export const EMPIRE_ERA_GEMS = 5

// Подсказки в викторине
export const EMPIRE_POWER_BASE = { hint: 12, skip: 18, life: 25 } as const
export const EMPIRE_POWER_FLOOR = 6
export type EmpirePowerKind = keyof typeof EMPIRE_POWER_BASE

// Серия ежедневных заданий: [дней подряд, кристаллов]
export const EMPIRE_DAILY_STREAK_GEMS: ReadonlyArray<readonly [number, number]> = [[7, 3], [30, 10]]

// Дуэли
export const EMPIRE_DUEL_COINS = { win: 20, draw: 8, loss: 4 } as const
export const EMPIRE_DUEL_STREAK_GEM_EVERY = 5

// XP-буст
export const EMPIRE_XP_BOOST_MULT = 1.5
export const EMPIRE_XP_BOOST_COINS = 60
export const EMPIRE_XP_BOOST_COINS_MS = 15 * 60 * 1000
export const EMPIRE_XP_BOOST_GEMS = 1
export const EMPIRE_XP_BOOST_GEMS_MS = 2 * 60 * 60 * 1000

// Награда за раунд
export const EMPIRE_ROUND_COIN_CAP_BASE = 300
export const EMPIRE_ROUND_COIN_CAP_PER_ERA = 100
export const EMPIRE_LEARN_COIN_CAP = 20

// Гость
export const EMPIRE_TRIAL_BUILDINGS = 3
export const EMPIRE_TRIAL_ACTIVE_MS = 30 * 60 * 1000
export const EMPIRE_TRIAL_LEVEL_MAX = 5
export const EMPIRE_TRIAL_COINS_MAX = 600

// ---------- Марки (docs/economy.md §5) и кристаллы (§9) ----------

/** Множители альбома к `resPerHour` мира. */
export const EMPIRE_ALBUM_PER_COUNTRY = 0.002
export const EMPIRE_ALBUM_PER_SET = 0.05
export const EMPIRE_ALBUM_PER_RARE = 0.01
/** Разовые кристаллы за полный набор марок. */
export const EMPIRE_SET_GEMS = 3
/** Капы клиентской сводки альбома (сервер не хранит альбом, только сводку). */
export const EMPIRE_ALBUM_COUNTRIES_MAX = 600
export const EMPIRE_ALBUM_SETS_MAX = 12
/** Пропуск стройки: кристаллов за каждые 30 минут остатка, минимум 1. */
export const EMPIRE_SKIP_MS_PER_GEM = 30 * 60 * 1000
/** Временные перки за кристаллы: цена и срок. */
export const EMPIRE_PERKS = {
  offline24: { gems: 3, ms: 7 * 24 * 3600_000 },
  slot2: { gems: 4, ms: 7 * 24 * 3600_000 },
} as const
export type EmpirePerk = keyof typeof EMPIRE_PERKS
/** Кристаллы за достижения по tier (`data/achievements.ts`). */
export const EMPIRE_ACHIEVEMENT_GEMS: Partial<Record<number, number>> = { 3: 2, 5: 5, 6: 10 }
