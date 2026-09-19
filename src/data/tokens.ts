import type { AchievementTier } from './achievements'
import type { QuizDifficulty } from '../lib/quiz'

export const TOKEN_DAY_CAP = 250
export const TOKEN_CAMPAIGN_XP_DIV = 20
export const TOKEN_WORLD_RECORD = 25
export const TOKEN_XP_BOOST = 1.5
export const TOKEN_KNOWLEDGE_BOOST_MS = 5 * 60 * 1000
export const TOKEN_XP_BOOST_MS = 15 * 60 * 1000

export const TOKEN_COST = {
  hint: 12,
  skip: 18,
  life: 25,
  boostKnowledge: 40,
  boostXp: 50,
} as const

export const CARD_FRAME_IDS = ['laurel', 'gold', 'night', 'orbit'] as const
export type CardFrameId = (typeof CARD_FRAME_IDS)[number]

export const SHARE_THEME_IDS = ['ink', 'gold', 'night'] as const
export type ShareThemeId = (typeof SHARE_THEME_IDS)[number]

export type ShopItemId =
  | `frame-${CardFrameId}`
  | `share-${ShareThemeId}`
  | 'boost-knowledge'
  | 'boost-xp'
  | 'hq-skin'

export type ShopItemKind = 'frame' | 'share' | 'boost' | 'hqSkin'

export type ShopItem = {
  id: ShopItemId
  kind: ShopItemKind
  cost: number
  frame?: CardFrameId
  share?: ShareThemeId
  requiresStages?: number
}

export const SHOP_ITEMS: readonly ShopItem[] = [
  { id: 'frame-laurel', kind: 'frame', cost: 80, frame: 'laurel' },
  { id: 'frame-gold', kind: 'frame', cost: 120, frame: 'gold' },
  { id: 'frame-night', kind: 'frame', cost: 160, frame: 'night' },
  { id: 'frame-orbit', kind: 'frame', cost: 200, frame: 'orbit' },
  { id: 'share-ink', kind: 'share', cost: 60, share: 'ink' },
  { id: 'share-gold', kind: 'share', cost: 90, share: 'gold' },
  { id: 'share-night', kind: 'share', cost: 120, share: 'night' },
  { id: 'boost-knowledge', kind: 'boost', cost: TOKEN_COST.boostKnowledge },
  { id: 'boost-xp', kind: 'boost', cost: TOKEN_COST.boostXp },
  { id: 'hq-skin', kind: 'hqSkin', cost: 300, requiresStages: 80 },
]

export function isCardFrameId(value: unknown): value is CardFrameId {
  return typeof value === 'string' && (CARD_FRAME_IDS as readonly string[]).includes(value)
}

export function isShareThemeId(value: unknown): value is ShareThemeId {
  return typeof value === 'string' && (SHARE_THEME_IDS as readonly string[]).includes(value)
}

export function isShopItemId(value: unknown): value is ShopItemId {
  return typeof value === 'string' && SHOP_ITEMS.some((item) => item.id === value)
}

export function shopItem(id: ShopItemId): ShopItem | undefined {
  return SHOP_ITEMS.find((item) => item.id === id)
}

export function tokensPerCorrect(difficulty: QuizDifficulty): number {
  if (difficulty === 'hardcore') return 3
  if (difficulty === 'hard') return 2
  return 1
}

export function tokensForAchievementTier(tier: AchievementTier): number {
  if (tier >= 5) return 50
  if (tier >= 3) return 30
  return 15
}

export function tokensForDuel(youWon: boolean | null): number {
  if (youWon === true) return 20
  if (youWon === false) return 4
  return 8
}

export function tokensForCampaign(deltaXp: number, worldRecord: boolean): number {
  const fromXp = deltaXp > 0 ? Math.ceil(deltaXp / TOKEN_CAMPAIGN_XP_DIV) : 0
  return fromXp + (worldRecord ? TOKEN_WORLD_RECORD : 0)
}
