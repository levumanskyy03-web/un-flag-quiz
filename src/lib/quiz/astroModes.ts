export const PLANET_ASTRO_MODES = ['planetToOrder', 'orderToPlanet', 'planetToKind'] as const
export const MOON_ASTRO_MODES = ['moonToPlanet', 'planetToMoon'] as const
export const SKY_ASTRO_MODES = ['starToClass', 'constelToName'] as const
export const PEOPLE_ASTRO_MODES = ['astroPhotoToName', 'astroFactsToName'] as const

export const ASTRO_MODES = [
  ...PLANET_ASTRO_MODES,
  ...MOON_ASTRO_MODES,
  ...SKY_ASTRO_MODES,
  ...PEOPLE_ASTRO_MODES,
] as const

export type AstroMode = (typeof ASTRO_MODES)[number]
export const ASTRO_TOPICS = ['planets', 'moons', 'sky', 'people'] as const
export type AstroTopic = (typeof ASTRO_TOPICS)[number]

export function isAstroMode(value: unknown): value is AstroMode {
  return typeof value === 'string' && (ASTRO_MODES as readonly string[]).includes(value)
}

export function astroModesOf(topic: AstroTopic): readonly AstroMode[] {
  if (topic === 'planets') return PLANET_ASTRO_MODES
  if (topic === 'moons') return MOON_ASTRO_MODES
  if (topic === 'sky') return SKY_ASTRO_MODES
  return PEOPLE_ASTRO_MODES
}

export function astroTopicOf(mode: AstroMode): AstroTopic {
  if ((PLANET_ASTRO_MODES as readonly string[]).includes(mode)) return 'planets'
  if ((MOON_ASTRO_MODES as readonly string[]).includes(mode)) return 'moons'
  if ((SKY_ASTRO_MODES as readonly string[]).includes(mode)) return 'sky'
  return 'people'
}

export const EASY_ASTRO_MIX_MODES: AstroMode[] = ['planetToOrder', 'moonToPlanet', 'constelToName']
export const HARD_ASTRO_MIX_MODES: AstroMode[] = ASTRO_MODES.filter((mode) => mode !== 'astroFactsToName')
export const MATCH_ASTRO_MODES: AstroMode[] = ['planetToOrder', 'astroPhotoToName']
export const ASTRO_MATCH_MIX: AstroMode[] = ['planetToOrder', 'moonToPlanet', 'constelToName']

export const ASTRO_CAMPAIGN_MODES: AstroMode[] = [...PLANET_ASTRO_MODES, 'moonToPlanet']
export const ASTRO_CAMPAIGN_LEVELS = 12
export const ASTRO_LEVEL_QUESTIONS = 8

export function astroHasCampaign(mode: string): boolean {
  return (ASTRO_CAMPAIGN_MODES as readonly string[]).includes(mode)
}
