import type { CardFrameId, ShareThemeId } from './cosmetics'

/**
 * Наследие — пять очень долгих миссий (docs/economy.md §9.1).
 * Прогресс считается из `EmpireState.lifetime`; ступени и финал забираются кнопкой.
 */

export const LEGACY_MISSION_IDS = ['atlas', 'thousandDays', 'flawless', 'polymath', 'builder'] as const
export type LegacyMissionId = (typeof LEGACY_MISSION_IDS)[number]

export function isLegacyMissionId(value: unknown): value is LegacyMissionId {
  return typeof value === 'string' && (LEGACY_MISSION_IDS as readonly string[]).includes(value)
}

export const LEGACY_TITLE_IDS = ['cartographer', 'keeper', 'flawless', 'polymath', 'architect'] as const
export type LegacyTitleId = (typeof LEGACY_TITLE_IDS)[number]

export function isLegacyTitleId(value: unknown): value is LegacyTitleId {
  return typeof value === 'string' && (LEGACY_TITLE_IDS as readonly string[]).includes(value)
}

/** Постоянные бонусы Наследия хранятся в `EmpireState.unlocks` как `legacy:*`. */
export type LegacyUnlock =
  | 'legacy:res5' // +5 % resPerHour всех зданий
  | 'legacy:res10' // +10 % resPerHour навсегда (финал «Атласа»)
  | 'legacy:library10' // скидка Библиотеки +10 п. п.
  | 'legacy:specialist' // +1 специалист за каждый зачётный раунд
  | 'legacy:maxLevel' // мировые здания +1 к макс. уровню
  | 'legacy:buildFast' // таймеры стройки −10 %
  | 'legacy:pantheon' // десятое здание
  | 'legacy:flawlessAnim' // анимированная рамка
  | 'legacy:goldFlag' // золотая кайма флага
  | 'legacy:night' // ночной режим сцены
  | 'offline24'
  | 'slot2'

export type LegacyReward =
  | { kind: 'gems'; gems: number }
  | { kind: 'frame'; frame: CardFrameId }
  | { kind: 'share'; share: ShareThemeId }
  | { kind: 'unlock'; unlock: LegacyUnlock }

export type LegacyStage = { at: number; reward: LegacyReward }

export type LegacyMission = {
  id: LegacyMissionId
  stages: readonly LegacyStage[]
  /** Финальный порог; `null` — считается динамически (`atlas`: число коллекций; `builder`: все здания на максимуме). */
  finalAt: number | null
  title: LegacyTitleId
  finalRewards: readonly LegacyReward[]
}

export const LEGACY_MISSIONS: readonly LegacyMission[] = [
  {
    id: 'atlas',
    stages: [
      { at: 10, reward: { kind: 'gems', gems: 5 } },
      { at: 25, reward: { kind: 'frame', frame: 'atlas' } },
      { at: 50, reward: { kind: 'unlock', unlock: 'legacy:res5' } },
    ],
    finalAt: null,
    title: 'cartographer',
    finalRewards: [{ kind: 'unlock', unlock: 'legacy:res10' }],
  },
  {
    id: 'thousandDays',
    stages: [
      { at: 30, reward: { kind: 'gems', gems: 3 } },
      { at: 100, reward: { kind: 'share', share: 'veteran' } },
      { at: 365, reward: { kind: 'unlock', unlock: 'offline24' } },
      { at: 730, reward: { kind: 'unlock', unlock: 'slot2' } },
    ],
    finalAt: 1000,
    title: 'keeper',
    finalRewards: [{ kind: 'unlock', unlock: 'legacy:goldFlag' }],
  },
  {
    id: 'flawless',
    stages: [
      { at: 50, reward: { kind: 'gems', gems: 5 } },
      { at: 250, reward: { kind: 'frame', frame: 'flawless' } },
      { at: 1000, reward: { kind: 'unlock', unlock: 'legacy:library10' } },
    ],
    finalAt: 5000,
    title: 'flawless',
    finalRewards: [{ kind: 'unlock', unlock: 'legacy:flawlessAnim' }],
  },
  {
    id: 'polymath',
    stages: [
      { at: 500, reward: { kind: 'gems', gems: 3 } },
      { at: 2000, reward: { kind: 'unlock', unlock: 'legacy:specialist' } },
      { at: 5000, reward: { kind: 'unlock', unlock: 'legacy:maxLevel' } },
    ],
    finalAt: 10_000,
    title: 'polymath',
    finalRewards: [{ kind: 'unlock', unlock: 'legacy:pantheon' }],
  },
  {
    id: 'builder',
    stages: [
      { at: 100, reward: { kind: 'gems', gems: 3 } },
      { at: 500, reward: { kind: 'unlock', unlock: 'legacy:buildFast' } },
      { at: 1500, reward: { kind: 'unlock', unlock: 'slot2' } },
    ],
    finalAt: null,
    title: 'architect',
    finalRewards: [{ kind: 'unlock', unlock: 'legacy:night' }],
  },
]

export function legacyMission(id: LegacyMissionId): LegacyMission {
  return LEGACY_MISSIONS.find((m) => m.id === id) ?? LEGACY_MISSIONS[0]
}

/** Число коллекций для финала «Атласа» — передаётся снаружи (клиент знает `COLLECTIONS`; сервер — константу-кап). */
export const LEGACY_ATLAS_COLLECTIONS_MIN = 60
