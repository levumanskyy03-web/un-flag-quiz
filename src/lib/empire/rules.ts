import {
  EMPIRE_BUILDINGS,
  EMPIRE_BUILD_MS_PER_LEVEL,
  EMPIRE_COIN_COST_BASE,
  EMPIRE_COIN_COST_GROWTH,
  EMPIRE_COINS_PER_LEVEL_HOUR,
  EMPIRE_DAILY_STREAK_GEMS,
  EMPIRE_DUEL_COINS,
  EMPIRE_DUEL_STREAK_GEM_EVERY,
  EMPIRE_ERA_COUNT,
  EMPIRE_ERA_GEMS,
  EMPIRE_ACHIEVEMENT_GEMS,
  EMPIRE_ALL_BUILDINGS,
  EMPIRE_ALBUM_COUNTRIES_MAX,
  EMPIRE_ALBUM_PER_COUNTRY,
  EMPIRE_ALBUM_PER_RARE,
  EMPIRE_ALBUM_PER_SET,
  EMPIRE_ALBUM_SETS_MAX,
  EMPIRE_PERKS,
  EMPIRE_SET_GEMS,
  EMPIRE_SKIP_MS_PER_GEM,
  type EmpirePerk,
  EMPIRE_HALL_COST_BASE,
  EMPIRE_HALL_COST_GROWTH,
  EMPIRE_HOUSING_BASE,
  EMPIRE_HOUSING_PER_LEVEL,
  EMPIRE_LEARN_COIN_CAP,
  EMPIRE_LIBRARY_FREE_PER_LEVELS,
  EMPIRE_LIBRARY_OFF_MAX,
  EMPIRE_LIBRARY_OFF_PER_LEVEL,
  EMPIRE_OFFLINE_BASE_HOURS,
  EMPIRE_OFFLINE_FACTOR,
  EMPIRE_OFFLINE_FULL_MS,
  EMPIRE_OFFLINE_MAX_HOURS,
  EMPIRE_PENDING_SPECIALISTS_MAX,
  EMPIRE_POWER_BASE,
  EMPIRE_POWER_FLOOR,
  EMPIRE_RESOURCE_BY_WORLD,
  EMPIRE_RESOURCES,
  EMPIRE_RES_COST_BASE,
  EMPIRE_RES_COST_GROWTH,
  EMPIRE_RES_PER_LEVEL_HOUR,
  EMPIRE_ROUND_COIN_CAP_BASE,
  EMPIRE_ROUND_COIN_CAP_PER_ERA,
  EMPIRE_SECOND_SLOT_HALL_LEVEL,
  EMPIRE_SELL_RATE_PER_LEVEL,
  EMPIRE_SPECIALIST_BONUS,
  EMPIRE_START_COINS,
  EMPIRE_START_RESOURCE,
  EMPIRE_STORAGE_BASE,
  EMPIRE_TIME_BONUS_MS,
  EMPIRE_TIME_BONUS_PER_LEVELS,
  EMPIRE_TREASURY_BASE,
  EMPIRE_XP_BOOST_COINS,
  EMPIRE_XP_BOOST_COINS_MS,
  EMPIRE_XP_BOOST_GEMS,
  EMPIRE_XP_BOOST_GEMS_MS,
  EMPIRE_XP_BOOST_MULT,
  empireEraRow,
  eraMult,
  isEmpireWorldBuilding,
  maxBuildingLevel,
  type EmpireBuilding,
  type EmpireEra,
  type EmpirePowerKind,
  type EmpireResource,
} from '../../data/empire'
import { QUIZ_WORLDS, isQuizWorld, type PlayPath, type QuizDifficulty, type QuizWorld, type RoundEnd } from '../quiz/core'
import { FRAME_COINS, FRAME_MIN_ERA, SHARE_COINS, isCardFrameId, isShareThemeId, type CardFrameId, type ShareThemeId } from '../../data/cosmetics'
import {
  LEGACY_ATLAS_COLLECTIONS_MIN,
  LEGACY_MISSIONS,
  isLegacyTitleId,
  legacyMission,
  type LegacyMissionId,
  type LegacyReward,
  type LegacyTitleId,
} from '../../data/empireLegacy'

export type EmpireBuildingState = { level: number; buildUntil: number | null }

export type EmpireState = {
  v: 1
  name: string
  era: EmpireEra
  coins: number
  gems: number
  res: Record<EmpireResource, number>
  carry: Record<EmpireResource | 'coins', number>
  buildings: Record<EmpireBuilding, EmpireBuildingState>
  specialists: Record<QuizWorld, number>
  pendingSpecialists: Record<QuizWorld, number>
  unlockedLists: string[]
  unlocks: string[]
  plus: { until: number; source: 'none' | 'grant' | 'store' }
  daily: { day: string; coinsFromRounds: number; hintsUsed: number; gemClaimed: boolean; streak: number; lastDailyDay: string; mistakesRuns: number }
  boosts: { xpUntil: number }
  cosmetics: { frames: CardFrameId[]; frame: CardFrameId | null; shares: ShareThemeId[]; share: ShareThemeId | null }
  duelStreak: number
  /** Сводка альбома марок по мирам (клиент считает по `loadWorldStampAlbums`, сервер клампует). */
  album: Partial<Record<QuizWorld, AlbumSummary>>
  /** Полные наборы, за которые уже выданы кристаллы: `${world}:${setId}`. */
  setBonusClaimed: string[]
  /** Достижения, за которые уже выданы кристаллы. */
  achievementsClaimed: string[]
  /** Временные перки за кристаллы (до какого времени). */
  perks: Record<EmpirePerk, number>
  /** Счётчики Наследия — только растут (docs §9.1). */
  lifetime: EmpireLifetime
  /** Наследие: сколько ступеней уже получено и какие финалы забраны. */
  legacy: { stage: Record<LegacyMissionId, number>; claimed: LegacyMissionId[] }
  /** Полученные титулы и активный. */
  titles: LegacyTitleId[]
  title: LegacyTitleId | null
  lastTickAt: number
  createdAt: number
  migratedAt: number | null
  /** Когда зачтена конверсия старых store (токены/Компания/Государство); null — ещё не было. */
  legacyAt: number | null
  score: number
}

export type AlbumSummary = { countries: number; sets: number; rare: number }

export type EmpireLifetime = {
  rounds: number
  perfectRounds: number
  hardcoreRounds: number
  /** Идеальные раунды на хардкоре — миссия «Безупречный». */
  flawlessRounds: number
  correctByWorld: Record<QuizWorld, number>
  dailyDays: number
  dailyBestStreak: number
  duelWins: number
  duelBestStreak: number
  coinsEarned: number
  gemsEarned: number
  buildsDone: number
  activeDays: number
  lastActiveDay: string
  lastDailyCounted: string
  /** `${world}/${id}` — коллекции, пройденные идеально на hard или выше. */
  listsCleared: string[]
}

export function emptyLifetime(): EmpireLifetime {
  return {
    rounds: 0,
    perfectRounds: 0,
    hardcoreRounds: 0,
    flawlessRounds: 0,
    correctByWorld: zeroByWorld(),
    dailyDays: 0,
    dailyBestStreak: 0,
    duelWins: 0,
    duelBestStreak: 0,
    coinsEarned: 0,
    gemsEarned: 0,
    buildsDone: 0,
    activeDays: 0,
    lastActiveDay: '',
    lastDailyCounted: '',
    listsCleared: [],
  }
}

function zeroByMission(): Record<LegacyMissionId, number> {
  return Object.fromEntries(LEGACY_MISSIONS.map((m) => [m.id, 0])) as Record<LegacyMissionId, number>
}

export type EmpireRoundReward = {
  specialists: number
  coins: number
  resource: number
  gems: number
  capped: boolean
}

function zeroByWorld(): Record<QuizWorld, number> {
  return Object.fromEntries(QUIZ_WORLDS.map((w) => [w, 0])) as Record<QuizWorld, number>
}

function zeroByResource(): Record<EmpireResource, number> {
  return Object.fromEntries(EMPIRE_RESOURCES.map((r) => [r, 0])) as Record<EmpireResource, number>
}

export function localDayStamp(now = Date.now()) {
  const date = new Date(now)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function emptyEmpire(now = Date.now()): EmpireState {
  const res = zeroByResource()
  for (const key of EMPIRE_RESOURCES) res[key] = EMPIRE_START_RESOURCE
  return {
    v: 1,
    name: '',
    era: 1,
    coins: EMPIRE_START_COINS,
    gems: 0,
    res,
    carry: { ...zeroByResource(), coins: 0 },
    buildings: Object.fromEntries(
      EMPIRE_ALL_BUILDINGS.map((b) => [b, { level: 0, buildUntil: null }]),
    ) as Record<EmpireBuilding, EmpireBuildingState>,
    specialists: zeroByWorld(),
    pendingSpecialists: zeroByWorld(),
    unlockedLists: [],
    unlocks: [],
    plus: { until: 0, source: 'none' },
    daily: { day: localDayStamp(now), coinsFromRounds: 0, hintsUsed: 0, gemClaimed: false, streak: 0, lastDailyDay: '', mistakesRuns: 0 },
    boosts: { xpUntil: 0 },
    cosmetics: { frames: [], frame: null, shares: [], share: null },
    duelStreak: 0,
    album: {},
    setBonusClaimed: [],
    achievementsClaimed: [],
    perks: { offline24: 0, slot2: 0 },
    lifetime: emptyLifetime(),
    legacy: { stage: zeroByMission(), claimed: [] },
    titles: [],
    title: null,
    lastTickAt: now,
    createdAt: now,
    migratedAt: null,
    legacyAt: null,
    score: 0,
  }
}

// ---------- Уровни и стоимость ----------

export function buildingLevel(state: EmpireState, building: EmpireBuilding) {
  return state.buildings[building]?.level ?? 0
}

export function hasLegacy(state: EmpireState, unlock: string) {
  return state.unlocks.includes(unlock)
}

/** Здания, доступные этому игроку (Пантеон — после финала «Полиглота знаний»). */
export function buildingsOf(state: EmpireState): readonly EmpireBuilding[] {
  return hasLegacy(state, 'legacy:pantheon') ? EMPIRE_ALL_BUILDINGS : EMPIRE_BUILDINGS
}

/** Макс. уровень здания с учётом Наследия (`legacy:maxLevel` — мировые здания +1). */
export function buildingMax(state: EmpireState, building: EmpireBuilding) {
  const base = maxBuildingLevel(state.era)
  return isEmpireWorldBuilding(building) && hasLegacy(state, 'legacy:maxLevel') ? base + 1 : base
}

export function coinCost(level: number) {
  return Math.round(EMPIRE_COIN_COST_BASE * EMPIRE_COIN_COST_GROWTH ** level)
}

export function resCost(level: number) {
  return Math.round(EMPIRE_RES_COST_BASE * EMPIRE_RES_COST_GROWTH ** level)
}

export function hallCost(level: number) {
  return Math.round(EMPIRE_HALL_COST_BASE * EMPIRE_HALL_COST_GROWTH ** level)
}

export type UpgradeCost = { coins: number; res: Partial<Record<EmpireResource, number>> }

export function upgradeCost(state: EmpireState, building: EmpireBuilding): UpgradeCost {
  const level = buildingLevel(state, building)
  if (building === 'hall' || building === 'pantheon') {
    const each = hallCost(level)
    return { coins: coinCost(level), res: Object.fromEntries(EMPIRE_RESOURCES.map((r) => [r, each])) }
  }
  if (isEmpireWorldBuilding(building)) {
    return { coins: coinCost(level), res: { [EMPIRE_RESOURCE_BY_WORLD[building]]: resCost(level) } }
  }
  return { coins: coinCost(level), res: {} }
}

export function canAfford(state: EmpireState, cost: UpgradeCost) {
  if (state.coins < cost.coins) return false
  for (const [key, need] of Object.entries(cost.res) as [EmpireResource, number][]) {
    if ((state.res[key] ?? 0) < need) return false
  }
  return true
}

export function buildMs(level: number, era: number, fast = false) {
  const ms = Math.max(0, era - 2) * level * EMPIRE_BUILD_MS_PER_LEVEL
  return fast ? Math.round(ms * 0.9) : ms
}

export function perkActive(state: EmpireState, perk: EmpirePerk, now = Date.now()) {
  return (state.perks[perk] ?? 0) > now
}

export function buildSlots(state: EmpireState, now = Date.now()) {
  const extra = state.unlocks.includes('slot2') || plusActive(state, now) || perkActive(state, 'slot2', now) ? 1 : 0
  return 1 + (buildingLevel(state, 'hall') >= EMPIRE_SECOND_SLOT_HALL_LEVEL ? 1 : extra)
}

export function activeBuilds(state: EmpireState, now = Date.now()) {
  return buildingsOf(state).filter((b) => {
    const until = state.buildings[b]?.buildUntil
    return until !== null && until !== undefined && until > now
  })
}

export function plusActive(state: EmpireState, now = Date.now()) {
  return state.plus.until > now
}

// ---------- Капы и бонусы общих зданий ----------

export function housingCap(state: EmpireState) {
  return EMPIRE_HOUSING_BASE + EMPIRE_HOUSING_PER_LEVEL * buildingLevel(state, 'housing')
}

export function specialistsTotal(state: EmpireState) {
  return QUIZ_WORLDS.reduce((sum, w) => sum + (state.specialists[w] ?? 0), 0)
}

export function storageCap(state: EmpireState) {
  return Math.floor(EMPIRE_STORAGE_BASE * (1 + buildingLevel(state, 'storage')) * eraMult(state.era))
}

export function treasuryCap(state: EmpireState) {
  return Math.floor(EMPIRE_TREASURY_BASE * (1 + buildingLevel(state, 'treasury')) * eraMult(state.era))
}

export function offlineHours(state: EmpireState, now = Date.now()) {
  if (state.unlocks.includes('offline24') || plusActive(state, now) || perkActive(state, 'offline24', now)) return EMPIRE_OFFLINE_MAX_HOURS
  return Math.min(EMPIRE_OFFLINE_MAX_HOURS, EMPIRE_OFFLINE_BASE_HOURS + 2 * buildingLevel(state, 'storage'))
}

export function sellRate(state: EmpireState) {
  return 1 + EMPIRE_SELL_RATE_PER_LEVEL * buildingLevel(state, 'treasury')
}

export function legacyResMult(state: EmpireState) {
  return 1 + (hasLegacy(state, 'legacy:res5') ? 0.05 : 0) + (hasLegacy(state, 'legacy:res10') ? 0.1 : 0)
}

export function libraryOff(state: EmpireState) {
  const base = Math.min(EMPIRE_LIBRARY_OFF_MAX, EMPIRE_LIBRARY_OFF_PER_LEVEL * buildingLevel(state, 'library'))
  return Math.min(0.9, base + (hasLegacy(state, 'legacy:library10') ? 0.1 : 0))
}

export function libraryFree(state: EmpireState) {
  return Math.floor(buildingLevel(state, 'library') / EMPIRE_LIBRARY_FREE_PER_LEVELS)
}

export function powerCoinCost(state: EmpireState, kind: EmpirePowerKind) {
  return Math.max(EMPIRE_POWER_FLOOR, Math.round(EMPIRE_POWER_BASE[kind] * (1 - libraryOff(state))))
}

export function timeBonusMs(state: EmpireState, world: QuizWorld) {
  return EMPIRE_TIME_BONUS_MS * Math.floor(buildingLevel(state, world) / EMPIRE_TIME_BONUS_PER_LEVELS)
}

/** Бесплатных зарядов подсказки осталось сегодня. */
export function freeHintsLeft(state: EmpireState) {
  return Math.max(0, libraryFree(state) - state.daily.hintsUsed)
}

/** Сколько стоит подсказка сейчас: 0, если есть заряд Библиотеки. */
export function powerPrice(state: EmpireState, kind: EmpirePowerKind) {
  if (kind === 'hint' && freeHintsLeft(state) > 0) return 0
  return powerCoinCost(state, kind)
}

export type PowerResult = { ok: true; state: EmpireState; paid: number } | { ok: false; reason: 'cost' }

/** Списывает подсказку: сначала заряд Библиотеки (только `hint`), потом монеты. */
export function buyPower(state: EmpireState, kind: EmpirePowerKind, now = Date.now()): PowerResult {
  const current = rollDay(tick(state, now), now)
  const price = powerPrice(current, kind)
  if (price === 0) {
    return {
      ok: true,
      paid: 0,
      state: { ...current, daily: { ...current.daily, hintsUsed: current.daily.hintsUsed + 1 } },
    }
  }
  if (current.coins < price) return { ok: false, reason: 'cost' }
  return { ok: true, paid: price, state: { ...current, coins: current.coins - price } }
}

export function xpMultiplier(state: EmpireState, now = Date.now()) {
  return state.boosts.xpUntil > now ? EMPIRE_XP_BOOST_MULT : 1
}

export type BoostPay = 'coins' | 'gems'

/** XP-буст ×1.5: за монеты на 15 минут или за кристалл на 2 часа. Продлевает активный. */
export function buyXpBoost(state: EmpireState, pay: BoostPay, now = Date.now()): EmpireState | null {
  const current = tick(state, now)
  const from = Math.max(now, current.boosts.xpUntil)
  if (pay === 'coins') {
    if (current.coins < EMPIRE_XP_BOOST_COINS) return null
    return { ...current, coins: current.coins - EMPIRE_XP_BOOST_COINS, boosts: { xpUntil: from + EMPIRE_XP_BOOST_COINS_MS } }
  }
  if (current.gems < EMPIRE_XP_BOOST_GEMS) return null
  return { ...current, gems: current.gems - EMPIRE_XP_BOOST_GEMS, boosts: { xpUntil: from + EMPIRE_XP_BOOST_GEMS_MS } }
}

// ---------- Дуэли ----------

export type DuelReward = { coins: number; gems: number; streak: number }

/** Дуэль даёт только монеты (и кристалл за каждую 5-ю победу подряд). Специалистов и ресурсов — нет. */
export function duelReward(state: EmpireState, youWon: boolean | null): DuelReward {
  const streak = youWon === true ? state.duelStreak + 1 : 0
  const coins = youWon === true ? EMPIRE_DUEL_COINS.win : youWon === null ? EMPIRE_DUEL_COINS.draw : EMPIRE_DUEL_COINS.loss
  const gems = youWon === true && streak % EMPIRE_DUEL_STREAK_GEM_EVERY === 0 ? 1 : 0
  return { coins, gems, streak }
}

export function applyDuelReward(state: EmpireState, youWon: boolean | null, now = Date.now()): { state: EmpireState; reward: DuelReward } {
  const lifetimeOf = (s: EmpireState, reward: DuelReward): EmpireLifetime => ({
    ...s.lifetime,
    duelWins: s.lifetime.duelWins + (youWon === true ? 1 : 0),
    duelBestStreak: Math.max(s.lifetime.duelBestStreak, reward.streak),
    coinsEarned: s.lifetime.coinsEarned + reward.coins,
    gemsEarned: s.lifetime.gemsEarned + reward.gems,
  })
  const current = rollDay(tick(state, now), now)
  const reward = duelReward(current, youWon)
  return {
    reward,
    state: withScore({
      ...current,
      coins: Math.min(treasuryCap(current), current.coins + reward.coins),
      gems: current.gems + reward.gems,
      duelStreak: reward.streak,
      lifetime: lifetimeOf(current, reward),
    }),
  }
}

// ---------- Производство ----------

function workerMult(specialists: number) {
  return 1 + EMPIRE_SPECIALIST_BONUS * specialists
}

/** Пассив альбома марок мира (docs §5): +0.2 % за страну/карточку, +5 % за полный набор, +1 % за эпик/легенду. */
export function albumMult(state: EmpireState, world: QuizWorld) {
  const a = state.album[world]
  if (!a) return 1
  return 1 + EMPIRE_ALBUM_PER_COUNTRY * a.countries + EMPIRE_ALBUM_PER_SET * a.sets + EMPIRE_ALBUM_PER_RARE * a.rare
}

/** Пантеон: все девять ресурсов по формуле мирового здания с S = Σ specialists / 9. */
export function pantheonResPerHour(state: EmpireState) {
  const level = buildingLevel(state, 'pantheon')
  if (level <= 0) return 0
  return EMPIRE_RES_PER_LEVEL_HOUR * level * workerMult(specialistsTotal(state) / QUIZ_WORLDS.length) * eraMult(state.era) * legacyResMult(state)
}

export function resPerHour(state: EmpireState, world: QuizWorld) {
  const level = buildingLevel(state, world)
  const own =
    level <= 0
      ? 0
      : EMPIRE_RES_PER_LEVEL_HOUR * level * workerMult(state.specialists[world] ?? 0) * eraMult(state.era) * albumMult(state, world) * legacyResMult(state)
  return own + pantheonResPerHour(state)
}

export function coinsPerHourOf(state: EmpireState, world: QuizWorld) {
  const level = buildingLevel(state, world)
  if (level <= 0) return 0
  return EMPIRE_COINS_PER_LEVEL_HOUR * level * workerMult(state.specialists[world] ?? 0) * eraMult(state.era)
}

export function coinsPerHour(state: EmpireState) {
  return QUIZ_WORLDS.reduce((sum, w) => sum + coinsPerHourOf(state, w), 0)
}

/** Применяет производство за прошедшее время. Чистая функция. */
export function tick(state: EmpireState, now = Date.now()): EmpireState {
  const elapsedRaw = Math.max(0, now - state.lastTickAt)
  if (elapsedRaw <= 0) return finishBuilds(state, now)
  const capMs = offlineHours(state, state.lastTickAt) * 3600_000
  const elapsed = Math.min(elapsedRaw, capMs)
  const full = Math.min(elapsed, EMPIRE_OFFLINE_FULL_MS)
  const slow = Math.max(0, elapsed - full)
  const effectiveHours = (full + slow * EMPIRE_OFFLINE_FACTOR) / 3600_000

  const res = { ...state.res }
  const carry = { ...state.carry }
  const sCap = storageCap(state)
  for (const world of QUIZ_WORLDS) {
    const key = EMPIRE_RESOURCE_BY_WORLD[world]
    const gain = resPerHour(state, world) * effectiveHours + (carry[key] ?? 0)
    const whole = Math.floor(gain)
    carry[key] = gain - whole
    res[key] = Math.min(sCap, (res[key] ?? 0) + whole)
  }
  const coinGain = coinsPerHour(state) * effectiveHours + (carry.coins ?? 0)
  const coinWhole = Math.floor(coinGain)
  carry.coins = coinGain - coinWhole
  const coins = Math.min(treasuryCap(state), state.coins + coinWhole)
  const lifetime = coins > state.coins ? { ...state.lifetime, coinsEarned: state.lifetime.coinsEarned + (coins - state.coins) } : state.lifetime

  return finishBuilds({ ...state, res, carry, coins, lifetime, lastTickAt: now }, now)
}

function finishBuilds(state: EmpireState, now: number): EmpireState {
  let done = 0
  const buildings = { ...state.buildings }
  for (const b of buildingsOf(state)) {
    const row = buildings[b]
    if (row && row.buildUntil !== null && row.buildUntil <= now) {
      buildings[b] = { level: row.level + 1, buildUntil: null }
      done += 1
    }
  }
  if (done === 0) return state
  return withScore({ ...state, buildings, lifetime: { ...state.lifetime, buildsDone: state.lifetime.buildsDone + done } })
}

// ---------- Действия ----------

export type BuildResult = { ok: true; state: EmpireState } | { ok: false; reason: 'max' | 'busy' | 'cost' }

export function build(state: EmpireState, building: EmpireBuilding, now = Date.now()): BuildResult {
  if (!buildingsOf(state).includes(building)) return { ok: false, reason: 'max' }
  const row = state.buildings[building] ?? { level: 0, buildUntil: null }
  if (row.buildUntil !== null) return { ok: false, reason: 'busy' }
  if (row.level >= buildingMax(state, building)) return { ok: false, reason: 'max' }
  if (activeBuilds(state, now).length >= buildSlots(state, now)) return { ok: false, reason: 'busy' }
  const cost = upgradeCost(state, building)
  if (!canAfford(state, cost)) return { ok: false, reason: 'cost' }
  const res = { ...state.res }
  for (const [key, need] of Object.entries(cost.res) as [EmpireResource, number][]) res[key] -= need
  const ms = buildMs(row.level + 1, state.era, hasLegacy(state, 'legacy:buildFast'))
  const buildings = {
    ...state.buildings,
    [building]: ms > 0 ? { level: row.level, buildUntil: now + ms } : { level: row.level + 1, buildUntil: null },
  }
  const lifetime = ms > 0 ? state.lifetime : { ...state.lifetime, buildsDone: state.lifetime.buildsDone + 1 }
  return { ok: true, state: withScore({ ...state, coins: state.coins - cost.coins, res, buildings, lifetime }) }
}

export function levelSum(state: EmpireState) {
  return EMPIRE_BUILDINGS.reduce((sum, b) => sum + buildingLevel(state, b), 0)
}

export type EraCheck = {
  next: EmpireEra | null
  hallOk: boolean
  sumOk: boolean
  resOk: boolean
  hallMin: number
  levelSumMin: number
  eachResourceMin: number
}

export function eraCheck(state: EmpireState): EraCheck {
  if (state.era >= EMPIRE_ERA_COUNT) {
    return { next: null, hallOk: true, sumOk: true, resOk: true, hallMin: 0, levelSumMin: 0, eachResourceMin: 0 }
  }
  const row = empireEraRow(state.era + 1)
  return {
    next: row.era,
    hallOk: buildingLevel(state, 'hall') >= row.hallMin,
    sumOk: levelSum(state) >= row.levelSumMin,
    resOk: EMPIRE_RESOURCES.every((r) => (state.res[r] ?? 0) >= row.eachResourceMin),
    hallMin: row.hallMin,
    levelSumMin: row.levelSumMin,
    eachResourceMin: row.eachResourceMin,
  }
}

export function advanceEra(state: EmpireState): EmpireState | null {
  const check = eraCheck(state)
  if (!check.next || !check.hallOk || !check.sumOk || !check.resOk) return null
  const res = { ...state.res }
  for (const r of EMPIRE_RESOURCES) res[r] -= check.eachResourceMin
  return withScore({ ...state, era: check.next, res, gems: state.gems + EMPIRE_ERA_GEMS, lifetime: { ...state.lifetime, gemsEarned: state.lifetime.gemsEarned + EMPIRE_ERA_GEMS } })
}

export function sellResource(state: EmpireState, key: EmpireResource, amount: number): EmpireState | null {
  const n = Math.floor(amount)
  if (n <= 0 || (state.res[key] ?? 0) < n) return null
  const coins = Math.min(treasuryCap(state), state.coins + Math.floor(n * sellRate(state)))
  return { ...state, res: { ...state.res, [key]: state.res[key] - n }, coins }
}

export function addSpecialists(state: EmpireState, world: QuizWorld, count: number): EmpireState {
  if (count <= 0) return state
  const free = Math.max(0, housingCap(state) - specialistsTotal(state))
  const housed = Math.min(free, count)
  const overflow = count - housed
  const pending = Math.min(
    EMPIRE_PENDING_SPECIALISTS_MAX,
    (state.pendingSpecialists[world] ?? 0) + overflow,
  )
  return {
    ...state,
    specialists: { ...state.specialists, [world]: (state.specialists[world] ?? 0) + housed },
    pendingSpecialists: { ...state.pendingSpecialists, [world]: pending },
  }
}

/** Заселяет отложенных специалистов, когда появилось место. */
export function settlePending(state: EmpireState): EmpireState {
  let next = state
  for (const world of QUIZ_WORLDS) {
    const waiting = next.pendingSpecialists[world] ?? 0
    if (waiting <= 0) continue
    const free = Math.max(0, housingCap(next) - specialistsTotal(next))
    if (free <= 0) break
    const move = Math.min(free, waiting)
    next = {
      ...next,
      specialists: { ...next.specialists, [world]: (next.specialists[world] ?? 0) + move },
      pendingSpecialists: { ...next.pendingSpecialists, [world]: waiting - move },
    }
  }
  return next
}

// ---------- Награда за раунд ----------

export type RoundContext = {
  world: QuizWorld
  path: PlayPath
  endedBy: RoundEnd
  correct: number
  total: number
  difficulty: QuizDifficulty
  hardcore?: boolean
  perfect: boolean
  deltaXp?: number
  worldRecord?: boolean
  /** Для `path === 'list'` — id коллекции (миссия «Атлас мира»). */
  listId?: string
}

export function perCorrect(difficulty: QuizDifficulty) {
  if (difficulty === 'hardcore') return 3
  if (difficulty === 'hard') return 2
  return 1
}

export function roundCoinCap(state: EmpireState) {
  return EMPIRE_ROUND_COIN_CAP_BASE + EMPIRE_ROUND_COIN_CAP_PER_ERA * state.era
}

export function roundReward(state: EmpireState, ctx: RoundContext): EmpireRoundReward {
  const complete = ctx.endedBy === 'complete'
  const base = perCorrect(ctx.difficulty) * ctx.correct
  const hardOrMore = ctx.difficulty === 'hard' || ctx.difficulty === 'hardcore' || Boolean(ctx.hardcore)
  let reward: EmpireRoundReward = { specialists: 0, coins: 0, resource: 0, gems: 0, capped: false }

  if (ctx.path === 'pool') {
    reward = complete
      ? { specialists: 1 + (ctx.hardcore ? 1 : 0), coins: base, resource: 2 * ctx.correct, gems: ctx.perfect && hardOrMore ? 1 : 0, capped: false }
      : { specialists: 0, coins: Math.floor(base / 2), resource: ctx.correct, gems: 0, capped: false }
  } else if (ctx.path === 'list') {
    reward = complete
      ? { specialists: 1, coins: Math.round(base * 1.25), resource: 3 * ctx.correct, gems: ctx.perfect ? 1 : 0, capped: false }
      : { specialists: 0, coins: Math.floor(base / 2), resource: ctx.correct, gems: 0, capped: false }
  } else if (ctx.path === 'daily') {
    reward = complete
      ? { specialists: 2, coins: Math.round(base * 1.5), resource: 4 * ctx.correct, gems: state.daily.gemClaimed ? 0 : 1, capped: false }
      : { specialists: 0, coins: Math.floor(base / 2), resource: ctx.correct, gems: 0, capped: false }
  } else if (ctx.path === 'levels') {
    reward = complete
      ? {
          specialists: 1 + (ctx.hardcore ? 1 : 0),
          coins: Math.ceil(Math.max(0, ctx.deltaXp ?? 0) / 20) + (ctx.worldRecord ? 25 : 0),
          resource: ctx.total,
          gems: ctx.worldRecord ? 1 : 0,
          capped: false,
        }
      : { specialists: 0, coins: 0, resource: Math.floor(ctx.correct / 2), gems: 0, capped: false }
  } else {
    reward = { specialists: 0, coins: Math.min(EMPIRE_LEARN_COIN_CAP, ctx.correct), resource: 0, gems: 0, capped: false }
  }

  const room = Math.max(0, roundCoinCap(state) - state.daily.coinsFromRounds)
  if (reward.coins > room) reward = { ...reward, coins: room, capped: true }
  return reward
}

export function applyRoundReward(state: EmpireState, ctx: RoundContext, now = Date.now()): { state: EmpireState; reward: EmpireRoundReward } {
  let next = rollDay(tick(state, now), now)
  const reward = roundReward(next, ctx)
  const key = EMPIRE_RESOURCE_BY_WORLD[ctx.world]
  let daily = {
    ...next.daily,
    coinsFromRounds: next.daily.coinsFromRounds + reward.coins,
    gemClaimed: next.daily.gemClaimed || (ctx.path === 'daily' && reward.gems > 0),
  }
  let streakGems = 0
  if (ctx.path === 'daily' && ctx.endedBy === 'complete' && daily.lastDailyDay !== daily.day) {
    const streak = daily.lastDailyDay === localDayStamp(now - 86_400_000) ? daily.streak + 1 : 1
    daily = { ...daily, streak, lastDailyDay: daily.day }
    for (const [days, gems] of EMPIRE_DAILY_STREAK_GEMS) if (streak === days) streakGems += gems
  }
  next = {
    ...next,
    coins: Math.min(treasuryCap(next), next.coins + reward.coins),
    gems: next.gems + reward.gems + streakGems,
    res: { ...next.res, [key]: Math.min(storageCap(next), (next.res[key] ?? 0) + reward.resource) },
    daily,
  }
  const counted = reward.coins > 0 || reward.specialists > 0 || reward.resource > 0
  const extraSpecialist = counted && ctx.endedBy === 'complete' && hasLegacy(next, 'legacy:specialist') ? 1 : 0
  next = addSpecialists(next, ctx.world, reward.specialists + extraSpecialist)
  next = { ...next, lifetime: lifetimeAfterRound(next, ctx, reward, streakGems, counted, now) }
  return { state: withScore(next), reward: streakGems > 0 ? { ...reward, gems: reward.gems + streakGems } : reward }
}

function lifetimeAfterRound(state: EmpireState, ctx: RoundContext, reward: EmpireRoundReward, streakGems: number, counted: boolean, now: number): EmpireLifetime {
  const lt = state.lifetime
  const complete = ctx.endedBy === 'complete'
  const hardcore = Boolean(ctx.hardcore) || ctx.difficulty === 'hardcore'
  const hardPlus = hardcore || ctx.difficulty === 'hard'
  const flawless = complete && ctx.perfect && hardcore
  const day = localDayStamp(now)
  const newDay = complete && lt.lastActiveDay !== day
  const listKey = ctx.path === 'list' && ctx.listId ? `${ctx.world}/${ctx.listId}` : null
  const listsCleared =
    listKey && complete && ctx.perfect && hardPlus && !lt.listsCleared.includes(listKey) ? [...lt.listsCleared, listKey] : lt.listsCleared
  // Дневной вызов сегодня засчитан впервые: `applyRoundReward` уже сдвинул `lastDailyDay` на сегодня.
  const dailyDone = ctx.path === 'daily' && complete && state.daily.lastDailyDay === state.daily.day && lt.lastDailyCounted !== state.daily.day
  return {
    ...lt,
    rounds: lt.rounds + (complete ? 1 : 0),
    perfectRounds: lt.perfectRounds + (complete && ctx.perfect ? 1 : 0),
    hardcoreRounds: lt.hardcoreRounds + (complete && hardcore ? 1 : 0),
    flawlessRounds: lt.flawlessRounds + (flawless ? 1 : 0),
    correctByWorld: counted ? { ...lt.correctByWorld, [ctx.world]: (lt.correctByWorld[ctx.world] ?? 0) + ctx.correct } : lt.correctByWorld,
    dailyDays: lt.dailyDays + (dailyDone ? 1 : 0),
    lastDailyCounted: dailyDone ? state.daily.day : lt.lastDailyCounted,
    dailyBestStreak: Math.max(lt.dailyBestStreak, state.daily.streak),
    coinsEarned: lt.coinsEarned + reward.coins,
    gemsEarned: lt.gemsEarned + reward.gems + streakGems,
    activeDays: lt.activeDays + (newDay ? 1 : 0),
    lastActiveDay: newDay ? day : lt.lastActiveDay,
    listsCleared,
  }
}

// ---------- Наследие (docs §9.1) ----------

export type LegacyProgress = {
  id: LegacyMissionId
  /** Текущее значение счётчика миссии. */
  value: number
  /** Сколько ступеней уже забрано. */
  stage: number
  /** Порог следующей незабранной ступени или финала; `null` — всё получено. */
  nextAt: number | null
  /** Порог финала (для `atlas` — число коллекций; для `builder` — макс. уровень 8-й эпохи). */
  finalAt: number
  finalReady: boolean
  finalClaimed: boolean
  /** Можно ли сейчас нажать «Забрать». */
  claimable: boolean
}

export type LegacyEnv = { collections: number }

const DEFAULT_LEGACY_ENV: LegacyEnv = { collections: LEGACY_ATLAS_COLLECTIONS_MIN }

function legacyValue(state: EmpireState, id: LegacyMissionId): number {
  const lt = state.lifetime
  switch (id) {
    case 'atlas':
      return lt.listsCleared.length
    case 'thousandDays':
      return lt.activeDays
    case 'flawless':
      return lt.flawlessRounds
    case 'polymath':
      return Math.min(...QUIZ_WORLDS.map((w) => lt.correctByWorld[w] ?? 0))
    case 'builder':
      return lt.buildsDone
  }
}

function legacyFinalReady(state: EmpireState, id: LegacyMissionId, env: LegacyEnv): { finalAt: number; ready: boolean } {
  const mission = legacyMission(id)
  if (id === 'atlas') {
    const finalAt = Math.max(LEGACY_ATLAS_COLLECTIONS_MIN, env.collections)
    return { finalAt, ready: state.lifetime.listsCleared.length >= finalAt }
  }
  if (id === 'builder') {
    const finalAt = maxBuildingLevel(EMPIRE_ERA_COUNT as EmpireEra)
    const ready = EMPIRE_ALL_BUILDINGS.every((b) => buildingLevel(state, b) >= finalAt)
    return { finalAt, ready }
  }
  const finalAt = mission.finalAt ?? Number.POSITIVE_INFINITY
  return { finalAt, ready: legacyValue(state, id) >= finalAt }
}

export function legacyProgress(state: EmpireState, id: LegacyMissionId, env: LegacyEnv = DEFAULT_LEGACY_ENV): LegacyProgress {
  const mission = legacyMission(id)
  const value = legacyValue(state, id)
  const stage = Math.min(mission.stages.length, state.legacy.stage[id] ?? 0)
  const finalClaimed = state.legacy.claimed.includes(id)
  const { finalAt, ready } = legacyFinalReady(state, id, env)
  const nextStage = mission.stages[stage]
  const nextAt = nextStage ? nextStage.at : finalClaimed ? null : finalAt
  const claimable = nextStage ? value >= nextStage.at : !finalClaimed && ready
  return { id, value, stage, nextAt, finalAt, finalReady: ready, finalClaimed, claimable }
}

export function legacyOverview(state: EmpireState, env: LegacyEnv = DEFAULT_LEGACY_ENV): LegacyProgress[] {
  return LEGACY_MISSIONS.map((m) => legacyProgress(state, m.id, env))
}

function grantLegacyReward(state: EmpireState, reward: LegacyReward): EmpireState {
  switch (reward.kind) {
    case 'gems':
      return { ...state, gems: state.gems + reward.gems, lifetime: { ...state.lifetime, gemsEarned: state.lifetime.gemsEarned + reward.gems } }
    case 'frame':
      return state.cosmetics.frames.includes(reward.frame)
        ? state
        : { ...state, cosmetics: { ...state.cosmetics, frames: [...state.cosmetics.frames, reward.frame] } }
    case 'share':
      return state.cosmetics.shares.includes(reward.share)
        ? state
        : { ...state, cosmetics: { ...state.cosmetics, shares: [...state.cosmetics.shares, reward.share] } }
    case 'unlock':
      return state.unlocks.includes(reward.unlock) ? state : { ...state, unlocks: [...state.unlocks, reward.unlock] }
  }
}

export type LegacyClaim =
  | { ok: true; state: EmpireState; rewards: LegacyReward[]; title: LegacyTitleId | null }
  | { ok: false; reason: 'locked' | 'done' }

/** Забрать следующую ступень (или финал) миссии. Одна ступень за вызов. */
export function claimLegacy(state: EmpireState, id: LegacyMissionId, env: LegacyEnv = DEFAULT_LEGACY_ENV, now = Date.now()): LegacyClaim {
  const current = tick(state, now)
  const progress = legacyProgress(current, id, env)
  if (progress.nextAt === null) return { ok: false, reason: 'done' }
  if (!progress.claimable) return { ok: false, reason: 'locked' }
  const mission = legacyMission(id)
  const stageRow = mission.stages[progress.stage]
  if (stageRow) {
    const next = grantLegacyReward(current, stageRow.reward)
    return {
      ok: true,
      state: withScore({ ...next, legacy: { ...next.legacy, stage: { ...next.legacy.stage, [id]: progress.stage + 1 } } }),
      rewards: [stageRow.reward],
      title: null,
    }
  }
  let next = current
  for (const reward of mission.finalRewards) next = grantLegacyReward(next, reward)
  const titles = next.titles.includes(mission.title) ? next.titles : [...next.titles, mission.title]
  return {
    ok: true,
    state: withScore({
      ...next,
      titles,
      title: next.title ?? mission.title,
      legacy: { ...next.legacy, claimed: [...next.legacy.claimed, id] },
    }),
    rewards: [...mission.finalRewards],
    title: mission.title,
  }
}

/** Выбрать активный титул (`null` — скрыть). Возвращает `null`, если титул не получен. */
export function setTitle(state: EmpireState, title: LegacyTitleId | null): EmpireState | null {
  if (title !== null && !state.titles.includes(title)) return null
  return { ...state, title }
}

export function rollDay(state: EmpireState, now = Date.now()): EmpireState {
  const day = localDayStamp(now)
  if (state.daily.day === day) return state
  return { ...state, daily: { ...state.daily, day, coinsFromRounds: 0, hintsUsed: 0, gemClaimed: false, mistakesRuns: 0 } }
}

// ---------- Счёт ----------

export function albumCountries(state: EmpireState) {
  return QUIZ_WORLDS.reduce((sum, w) => sum + (state.album[w]?.countries ?? 0), 0)
}

export function empireScore(state: EmpireState) {
  return levelSum(state) * state.era + albumCountries(state) + Math.floor(specialistsTotal(state) / 10)
}

export function withScore(state: EmpireState): EmpireState {
  return { ...state, score: empireScore(state) }
}

// ---------- Марки: сводка альбома и наборы ----------

function clampSummary(raw: unknown): AlbumSummary | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Partial<AlbumSummary>
  const n = (v: unknown, max: number) => Math.min(max, Math.max(0, Math.floor(Number(v) || 0)))
  const countries = n(r.countries, EMPIRE_ALBUM_COUNTRIES_MAX)
  return { countries, sets: n(r.sets, EMPIRE_ALBUM_SETS_MAX), rare: n(r.rare, countries) }
}

export type AlbumReport = Partial<Record<QuizWorld, AlbumSummary>>

/**
 * Принимает сводку альбома с клиента и список полных наборов; за каждый новый набор — кристаллы.
 * Возвращает то же состояние, если ничего не изменилось.
 */
export function reportAlbum(state: EmpireState, report: unknown, completeSets: unknown): { state: EmpireState; gems: number } {
  const album: EmpireState['album'] = { ...state.album }
  let changed = false
  if (report && typeof report === 'object') {
    for (const [k, v] of Object.entries(report as Record<string, unknown>)) {
      if (!isQuizWorld(k)) continue
      const summary = clampSummary(v)
      if (!summary) continue
      const prev = album[k]
      if (!prev || prev.countries !== summary.countries || prev.sets !== summary.sets || prev.rare !== summary.rare) {
        album[k] = summary
        changed = true
      }
    }
  }
  const claimed = [...state.setBonusClaimed]
  let gems = 0
  if (Array.isArray(completeSets)) {
    for (const key of completeSets) {
      if (typeof key !== 'string' || key.length > 40) continue
      const world = key.split(':')[0]
      if (!isQuizWorld(world) || claimed.includes(key)) continue
      // Не больше наборов, чем заявлено в сводке этого мира.
      const already = claimed.filter((c) => c.startsWith(`${world}:`)).length
      if (already >= (album[world]?.sets ?? 0)) continue
      claimed.push(key)
      gems += EMPIRE_SET_GEMS
    }
  }
  if (!changed && gems === 0) return { state, gems: 0 }
  return { state: withScore({ ...state, album, setBonusClaimed: claimed, gems: state.gems + gems }), gems }
}

// ---------- Кристаллы: пропуск стройки, перки, достижения ----------

export function skipBuildCost(state: EmpireState, building: EmpireBuilding, now = Date.now()) {
  const until = state.buildings[building]?.buildUntil
  if (until === null || until === undefined || until <= now) return 0
  return Math.max(1, Math.ceil((until - now) / EMPIRE_SKIP_MS_PER_GEM))
}

export type SkipResult = { ok: true; state: EmpireState; paid: number } | { ok: false; reason: 'idle' | 'cost' }

/** Достроить немедленно за кристаллы. */
export function skipBuild(state: EmpireState, building: EmpireBuilding, now = Date.now()): SkipResult {
  const current = tick(state, now)
  const cost = skipBuildCost(current, building, now)
  if (cost === 0) return { ok: false, reason: 'idle' }
  if (current.gems < cost) return { ok: false, reason: 'cost' }
  const row = current.buildings[building]
  const buildings = { ...current.buildings, [building]: { level: row.level + 1, buildUntil: null } }
  const lifetime = { ...current.lifetime, buildsDone: current.lifetime.buildsDone + 1 }
  return { ok: true, state: withScore({ ...current, gems: current.gems - cost, buildings, lifetime }), paid: cost }
}

/** Перк на 7 дней за кристаллы; повторная покупка продлевает от текущего конца. */
export function buyPerk(state: EmpireState, perk: EmpirePerk, now = Date.now()): EmpireState | null {
  const row = EMPIRE_PERKS[perk]
  if (!row || state.gems < row.gems) return null
  const from = Math.max(now, state.perks[perk] ?? 0)
  return { ...state, gems: state.gems - row.gems, perks: { ...state.perks, [perk]: from + row.ms } }
}

/** Кристаллы за новые достижения. `tierOf` отдаёт tier по id или null для неизвестных. */
export function claimAchievements(
  state: EmpireState,
  ids: readonly string[],
  tierOf: (id: string) => number | null,
): { state: EmpireState; gems: number; claimed: string[] } {
  const done = [...state.achievementsClaimed]
  const claimed: string[] = []
  let gems = 0
  for (const id of ids) {
    if (typeof id !== 'string' || done.includes(id)) continue
    const tier = tierOf(id)
    if (tier === null) continue
    done.push(id)
    claimed.push(id)
    gems += EMPIRE_ACHIEVEMENT_GEMS[tier] ?? 0
  }
  if (claimed.length === 0) return { state, gems: 0, claimed }
  return { state: { ...state, gems: state.gems + gems, achievementsClaimed: done }, gems, claimed }
}

// ---------- Косметика ----------

function parseCosmetics(raw: unknown): EmpireState['cosmetics'] {
  const c = raw && typeof raw === 'object' ? (raw as Partial<EmpireState['cosmetics']>) : {}
  const frames = Array.isArray(c.frames) ? c.frames.filter(isCardFrameId) : []
  const shares = Array.isArray(c.shares) ? c.shares.filter(isShareThemeId) : []
  return {
    frames,
    frame: isCardFrameId(c.frame) && frames.includes(c.frame) ? c.frame : null,
    shares,
    share: isShareThemeId(c.share) && shares.includes(c.share) ? c.share : null,
  }
}

export type CosmeticId = { kind: 'frame'; id: CardFrameId } | { kind: 'share'; id: ShareThemeId }

/** Цена в монетах; `null` — не продаётся (только из Наследия). */
export function cosmeticPrice(item: CosmeticId): number | null {
  return (item.kind === 'frame' ? FRAME_COINS[item.id] : SHARE_COINS[item.id]) ?? null
}

export function cosmeticOwned(state: EmpireState, item: CosmeticId) {
  return item.kind === 'frame' ? state.cosmetics.frames.includes(item.id) : state.cosmetics.shares.includes(item.id)
}

export type CosmeticResult = { ok: true; state: EmpireState } | { ok: false; reason: 'owned' | 'era' | 'cost' | 'legacy' }

/** Покупка рамки/темы за монеты; `orbit` — с эпохи 4. Купленное сразу надевается. */
export function buyCosmetic(state: EmpireState, item: CosmeticId, now = Date.now()): CosmeticResult {
  const current = tick(state, now)
  if (cosmeticOwned(current, item)) return { ok: false, reason: 'owned' }
  if (item.kind === 'frame' && current.era < (FRAME_MIN_ERA[item.id] ?? 1)) return { ok: false, reason: 'era' }
  const price = cosmeticPrice(item)
  if (price === null) return { ok: false, reason: 'legacy' }
  if (current.coins < price) return { ok: false, reason: 'cost' }
  const cosmetics =
    item.kind === 'frame'
      ? { ...current.cosmetics, frames: [...current.cosmetics.frames, item.id], frame: item.id }
      : { ...current.cosmetics, shares: [...current.cosmetics.shares, item.id], share: item.id }
  return { ok: true, state: { ...current, coins: current.coins - price, cosmetics } }
}

/** Надеть купленное или снять (`id: null`). */
export function equipCosmetic(state: EmpireState, kind: CosmeticId['kind'], id: string | null): EmpireState | null {
  if (kind === 'frame') {
    if (id !== null && !(isCardFrameId(id) && state.cosmetics.frames.includes(id))) return null
    return { ...state, cosmetics: { ...state.cosmetics, frame: id as CardFrameId | null } }
  }
  if (id !== null && !(isShareThemeId(id) && state.cosmetics.shares.includes(id))) return null
  return { ...state, cosmetics: { ...state.cosmetics, share: id as ShareThemeId | null } }
}

// ---------- Разбор сохранения ----------

function parseAlbum(raw: unknown): EmpireState['album'] {
  const out: EmpireState['album'] = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!isQuizWorld(k)) continue
    const s = clampSummary(v)
    if (s) out[k] = s
  }
  return out
}

function parseLifetime(raw: unknown): EmpireLifetime {
  const out = emptyLifetime()
  if (!raw || typeof raw !== 'object') return out
  const row = raw as Record<string, unknown>
  const n = (v: unknown) => (Number.isFinite(Number(v)) ? Math.max(0, Math.floor(Number(v))) : 0)
  for (const key of ['rounds', 'perfectRounds', 'hardcoreRounds', 'flawlessRounds', 'dailyDays', 'dailyBestStreak', 'duelWins', 'duelBestStreak', 'coinsEarned', 'gemsEarned', 'buildsDone', 'activeDays'] as const) {
    out[key] = n(row[key])
  }
  if (row.correctByWorld && typeof row.correctByWorld === 'object') {
    for (const [k, v] of Object.entries(row.correctByWorld as Record<string, unknown>)) if (isQuizWorld(k)) out.correctByWorld[k] = n(v)
  }
  out.lastActiveDay = typeof row.lastActiveDay === 'string' ? row.lastActiveDay : ''
  out.lastDailyCounted = typeof row.lastDailyCounted === 'string' ? row.lastDailyCounted : ''
  out.listsCleared = Array.isArray(row.listsCleared) ? row.listsCleared.filter((s): s is string => typeof s === 'string') : []
  return out
}

function parseLegacy(raw: unknown): EmpireState['legacy'] {
  const stage = zeroByMission()
  const claimed: LegacyMissionId[] = []
  if (raw && typeof raw === 'object') {
    const row = raw as Record<string, unknown>
    if (row.stage && typeof row.stage === 'object') {
      for (const m of LEGACY_MISSIONS) {
        const v = Number((row.stage as Record<string, unknown>)[m.id])
        stage[m.id] = Number.isFinite(v) ? Math.min(m.stages.length, Math.max(0, Math.floor(v))) : 0
      }
    }
    if (Array.isArray(row.claimed)) for (const c of row.claimed) if (LEGACY_MISSIONS.some((m) => m.id === c)) claimed.push(c as LegacyMissionId)
  }
  return { stage, claimed }
}

export function parseEmpire(raw: unknown, now = Date.now()): EmpireState | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Partial<EmpireState>
  const base = emptyEmpire(now)
  const num = (v: unknown, fallback = 0) => (Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : fallback)
  const era = Math.min(EMPIRE_ERA_COUNT, Math.max(1, Math.floor(num(row.era, 1)))) as EmpireEra

  const res = { ...base.res }
  if (row.res && typeof row.res === 'object') {
    for (const key of EMPIRE_RESOURCES) res[key] = Math.floor(num((row.res as Record<string, unknown>)[key], res[key]))
  }
  const carry = { ...base.carry }
  if (row.carry && typeof row.carry === 'object') {
    for (const key of [...EMPIRE_RESOURCES, 'coins'] as const) carry[key] = num((row.carry as Record<string, unknown>)[key])
  }
  const buildings = { ...base.buildings }
  if (row.buildings && typeof row.buildings === 'object') {
    for (const b of EMPIRE_ALL_BUILDINGS) {
      const cell = (row.buildings as Record<string, unknown>)[b]
      if (!cell || typeof cell !== 'object') continue
      const c = cell as Partial<EmpireBuildingState>
      const until = Number(c.buildUntil)
      buildings[b] = { level: Math.floor(num(c.level)), buildUntil: Number.isFinite(until) && until > 0 ? until : null }
    }
  }
  const byWorld = (src: unknown) => {
    const out = zeroByWorld()
    if (src && typeof src === 'object') {
      for (const [k, v] of Object.entries(src as Record<string, unknown>)) if (isQuizWorld(k)) out[k] = Math.floor(num(v))
    }
    return out
  }
  const strings = (src: unknown) => (Array.isArray(src) ? src.filter((s): s is string => typeof s === 'string') : [])
  const daily = row.daily && typeof row.daily === 'object' ? (row.daily as Partial<EmpireState['daily']>) : {}
  const plus = row.plus && typeof row.plus === 'object' ? (row.plus as Partial<EmpireState['plus']>) : {}

  return withScore({
    v: 1,
    name: typeof row.name === 'string' ? row.name.slice(0, 24) : '',
    era,
    coins: Math.floor(num(row.coins, base.coins)),
    gems: Math.floor(num(row.gems)),
    res,
    carry,
    buildings,
    specialists: byWorld(row.specialists),
    pendingSpecialists: byWorld(row.pendingSpecialists),
    unlockedLists: strings(row.unlockedLists),
    unlocks: strings(row.unlocks),
    plus: {
      until: num(plus.until),
      source: plus.source === 'grant' || plus.source === 'store' ? plus.source : 'none',
    },
    daily: {
      day: typeof daily.day === 'string' ? daily.day : base.daily.day,
      coinsFromRounds: Math.floor(num(daily.coinsFromRounds)),
      hintsUsed: Math.floor(num(daily.hintsUsed)),
      gemClaimed: Boolean(daily.gemClaimed),
      streak: Math.floor(num(daily.streak)),
      lastDailyDay: typeof daily.lastDailyDay === 'string' ? daily.lastDailyDay : '',
      mistakesRuns: Math.floor(num(daily.mistakesRuns)),
    },
    boosts: { xpUntil: num((row.boosts as Partial<EmpireState['boosts']> | undefined)?.xpUntil) },
    cosmetics: parseCosmetics(row.cosmetics),
    duelStreak: Math.floor(num(row.duelStreak)),
    album: parseAlbum(row.album),
    setBonusClaimed: strings(row.setBonusClaimed),
    achievementsClaimed: strings(row.achievementsClaimed),
    perks: {
      offline24: num((row.perks as Partial<EmpireState['perks']> | undefined)?.offline24),
      slot2: num((row.perks as Partial<EmpireState['perks']> | undefined)?.slot2),
    },
    lifetime: parseLifetime(row.lifetime),
    legacy: parseLegacy(row.legacy),
    titles: strings(row.titles).filter(isLegacyTitleId),
    title: isLegacyTitleId(row.title) ? row.title : null,
    lastTickAt: num(row.lastTickAt, now) || now,
    createdAt: num(row.createdAt, now) || now,
    migratedAt: row.migratedAt === null || row.migratedAt === undefined ? null : num(row.migratedAt) || null,
    legacyAt: row.legacyAt === null || row.legacyAt === undefined ? null : num(row.legacyAt) || null,
    score: 0,
  })
}
