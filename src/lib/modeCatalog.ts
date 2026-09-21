import {
  ASTRO_MODES,
  CLUB_FOOTBALL_MODES,
  CODES_MODES,
  EURO_FOOTBALL_MODES,
  LEADERS_MODES,
  MANAGER_FOOTBALL_MODES,
  MATH_MODES,
  OTHER_FOOTBALL_MODES,
  PLAYER_FOOTBALL_MODES,
  QUIZ_MODES,
  QUIZ_WORLDS,
  RANKING_MODES,
  WC_FOOTBALL_MODES,
  isThemeWorld,
  themeModesOfWorld,
  worldOfMode,
  type QuizMode,
  type QuizWorld,
} from './quiz'

export const WORLD_CATALOG_NO = Object.fromEntries(
  QUIZ_WORLDS.map((world, index) => [world, (index + 1) * 10]),
) as Record<QuizWorld, number>

function catalogModesOf(world: QuizWorld): readonly QuizMode[] {
  if (world === 'geo') return [...QUIZ_MODES, ...CODES_MODES, ...RANKING_MODES]
  if (world === 'leaders') return LEADERS_MODES
  if (world === 'football') {
    return [
      ...PLAYER_FOOTBALL_MODES,
      ...MANAGER_FOOTBALL_MODES,
      ...CLUB_FOOTBALL_MODES,
      ...WC_FOOTBALL_MODES,
      ...EURO_FOOTBALL_MODES,
      ...OTHER_FOOTBALL_MODES,
    ]
  }
  if (world === 'math') return MATH_MODES
  if (world === 'astronomy') return ASTRO_MODES
  if (isThemeWorld(world)) return themeModesOfWorld(world)
  return []
}

const MODE_CATALOG_NO = new Map<QuizMode, number>()

for (const world of QUIZ_WORLDS) {
  const base = WORLD_CATALOG_NO[world] * 10
  catalogModesOf(world).forEach((mode, index) => {
    MODE_CATALOG_NO.set(mode, base + index + 1)
  })
}

export function worldCatalogNo(world: QuizWorld): number {
  return WORLD_CATALOG_NO[world]
}

export function modeCatalogNo(mode: QuizMode): number {
  return MODE_CATALOG_NO.get(mode) ?? WORLD_CATALOG_NO[worldOfMode(mode)] * 10 + 1
}

export function modesCatalogNo(modes: readonly QuizMode[]): number | undefined {
  const mode = modes[0]
  return mode ? modeCatalogNo(mode) : undefined
}
