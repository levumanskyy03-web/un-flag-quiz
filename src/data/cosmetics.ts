/** Косметика Империи (бывший Shop): рамки аватара и темы карточки результата. Цены — монеты. */

export const CARD_FRAME_IDS = ['laurel', 'gold', 'night', 'orbit', 'atlas', 'flawless'] as const
/** Рамки, которые продаются за монеты; `atlas`/`flawless` — только из Наследия. */
export const SHOP_FRAME_IDS = ['laurel', 'gold', 'night', 'orbit'] as const satisfies readonly CardFrameId[]
export type CardFrameId = (typeof CARD_FRAME_IDS)[number]

export const SHARE_THEME_IDS = ['ink', 'gold', 'night', 'veteran'] as const
export const SHOP_SHARE_IDS = ['ink', 'gold', 'night'] as const satisfies readonly ShareThemeId[]
export type ShareThemeId = (typeof SHARE_THEME_IDS)[number]

export const FRAME_COINS: Partial<Record<CardFrameId, number>> = { laurel: 200, gold: 400, night: 800, orbit: 1500 }
export const SHARE_COINS: Partial<Record<ShareThemeId, number>> = { ink: 150, gold: 300, night: 600 }

/** Минимальная эпоха для рамки; отсутствие — без ограничения. */
export const FRAME_MIN_ERA: Partial<Record<CardFrameId, number>> = { orbit: 4 }

export function isCardFrameId(value: unknown): value is CardFrameId {
  return typeof value === 'string' && (CARD_FRAME_IDS as readonly string[]).includes(value)
}

export function isShareThemeId(value: unknown): value is ShareThemeId {
  return typeof value === 'string' && (SHARE_THEME_IDS as readonly string[]).includes(value)
}
