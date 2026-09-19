export const THEME_WORLDS = ['biology', 'olympics', 'cs', 'food', 'music', 'melody'] as const
export type ThemeWorld = (typeof THEME_WORLDS)[number]

export const BIO_CELL_MODES = ['organelleToRole', 'roleToOrganelle'] as const
export const BIO_BODY_MODES = ['organToSystem', 'photoStepToName'] as const
export const BIO_LIFE_MODES = ['kingdomToExample'] as const
export const BIO_MODES = [...BIO_CELL_MODES, ...BIO_BODY_MODES, ...BIO_LIFE_MODES] as const

export const OLY_HOST_MODES = ['olyYearToHost', 'olyHostToYear', 'olyHostCount'] as const
export const OLY_SPORT_MODES = ['sportToCategory'] as const
export const OLY_NOC_MODES = ['nocToName'] as const
export const OLY_MODES = [...OLY_HOST_MODES, ...OLY_SPORT_MODES, ...OLY_NOC_MODES] as const

export const CS_CODE_MODES = ['csTermToMeaning', 'meaningToCsTerm'] as const
export const CS_BIN_MODES = ['decToBinary', 'binaryToDec'] as const
export const CS_PEOPLE_MODES = ['csPhotoToName'] as const
export const CS_MODES = [...CS_CODE_MODES, ...CS_BIN_MODES, ...CS_PEOPLE_MODES] as const

export const FOOD_DISH_MODES = ['dishToCuisine', 'cuisineToDish'] as const
export const FOOD_ORIGIN_MODES = ['foodToOrigin'] as const
export const FOOD_MODES = [...FOOD_DISH_MODES, ...FOOD_ORIGIN_MODES] as const

export const MUSIC_INSTR_MODES = ['instrumentToFamily'] as const
export const MUSIC_PEOPLE_MODES = ['musicPhotoToName'] as const
export const MUSIC_MODES = [...MUSIC_INSTR_MODES, ...MUSIC_PEOPLE_MODES] as const

export const MELODY_WORK_MODES = ['composerToWork', 'workToComposer'] as const
export const MELODY_MODES = [...MELODY_WORK_MODES] as const

export const THEME_MODES = [...BIO_MODES, ...OLY_MODES, ...CS_MODES, ...FOOD_MODES, ...MUSIC_MODES, ...MELODY_MODES] as const
export type ThemeMode = (typeof THEME_MODES)[number]

export const THEME_TOPICS = [
  'cell',
  'body',
  'life',
  'hosts',
  'sports',
  'noc',
  'code',
  'binary',
  'hackers',
  'dishes',
  'origin',
  'instruments',
  'people',
  'works',
] as const
export type ThemeTopic = (typeof THEME_TOPICS)[number]

export function isThemeWorld(value: unknown): value is ThemeWorld {
  return typeof value === 'string' && (THEME_WORLDS as readonly string[]).includes(value)
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (THEME_MODES as readonly string[]).includes(value)
}

export function themeWorldOf(mode: ThemeMode): ThemeWorld {
  if ((BIO_MODES as readonly string[]).includes(mode)) return 'biology'
  if ((OLY_MODES as readonly string[]).includes(mode)) return 'olympics'
  if ((CS_MODES as readonly string[]).includes(mode)) return 'cs'
  if ((MUSIC_MODES as readonly string[]).includes(mode)) return 'music'
  if ((MELODY_MODES as readonly string[]).includes(mode)) return 'melody'
  return 'food'
}

export function themeModesOfWorld(world: ThemeWorld): readonly ThemeMode[] {
  if (world === 'biology') return BIO_MODES
  if (world === 'olympics') return OLY_MODES
  if (world === 'cs') return CS_MODES
  if (world === 'music') return MUSIC_MODES
  if (world === 'melody') return MELODY_MODES
  return FOOD_MODES
}

export function themeTopicsOf(world: ThemeWorld): readonly ThemeTopic[] {
  if (world === 'biology') return ['cell', 'body', 'life']
  if (world === 'olympics') return ['hosts', 'sports', 'noc']
  if (world === 'cs') return ['code', 'binary', 'hackers']
  if (world === 'music') return ['instruments', 'people']
  if (world === 'melody') return ['works']
  return ['dishes', 'origin']
}

export function themeModesOfTopic(topic: ThemeTopic): readonly ThemeMode[] {
  if (topic === 'cell') return BIO_CELL_MODES
  if (topic === 'body') return BIO_BODY_MODES
  if (topic === 'life') return BIO_LIFE_MODES
  if (topic === 'hosts') return OLY_HOST_MODES
  if (topic === 'sports') return OLY_SPORT_MODES
  if (topic === 'noc') return OLY_NOC_MODES
  if (topic === 'code') return CS_CODE_MODES
  if (topic === 'binary') return CS_BIN_MODES
  if (topic === 'hackers') return CS_PEOPLE_MODES
  if (topic === 'dishes') return FOOD_DISH_MODES
  if (topic === 'instruments') return MUSIC_INSTR_MODES
  if (topic === 'people') return MUSIC_PEOPLE_MODES
  if (topic === 'works') return MELODY_WORK_MODES
  return FOOD_ORIGIN_MODES
}

export function themeTopicOf(mode: ThemeMode): ThemeTopic {
  for (const topic of THEME_TOPICS) {
    if ((themeModesOfTopic(topic) as readonly string[]).includes(mode)) return topic
  }
  return 'cell'
}

export const EASY_THEME_MIX: Record<ThemeWorld, ThemeMode[]> = {
  biology: ['organelleToRole', 'organToSystem', 'kingdomToExample'],
  olympics: ['olyYearToHost', 'sportToCategory', 'nocToName'],
  cs: ['csTermToMeaning', 'decToBinary'],
  food: ['dishToCuisine', 'foodToOrigin'],
  music: ['instrumentToFamily'],
  melody: ['composerToWork', 'workToComposer'],
}

export const HARD_THEME_MIX: Record<ThemeWorld, ThemeMode[]> = {
  biology: [...BIO_MODES],
  olympics: [...OLY_MODES],
  cs: CS_MODES.filter((mode) => mode !== 'csPhotoToName'),
  food: [...FOOD_MODES],
  music: [...MUSIC_INSTR_MODES],
  melody: [...MELODY_MODES],
}

export const MATCH_THEME_MODES: Record<ThemeWorld, ThemeMode[]> = {
  biology: ['organelleToRole'],
  olympics: ['olyYearToHost', 'nocToName'],
  cs: ['csTermToMeaning', 'csPhotoToName'],
  food: ['dishToCuisine'],
  music: ['instrumentToFamily'],
  melody: ['composerToWork'],
}

export const THEME_MATCH_MIX: Record<ThemeWorld, ThemeMode[]> = EASY_THEME_MIX

export const THEME_CAMPAIGN_MODES: Record<ThemeWorld, ThemeMode[]> = {
  biology: ['organelleToRole', 'organToSystem'],
  olympics: ['olyYearToHost', 'nocToName'],
  cs: ['csTermToMeaning', 'decToBinary'],
  food: ['dishToCuisine', 'foodToOrigin'],
  music: ['instrumentToFamily'],
  melody: ['composerToWork'],
}

export const THEME_DEFAULT_MODE: Record<ThemeWorld, ThemeMode> = {
  biology: 'organelleToRole',
  olympics: 'olyYearToHost',
  cs: 'csTermToMeaning',
  food: 'dishToCuisine',
  music: 'instrumentToFamily',
  melody: 'composerToWork',
}

export const THEME_CAMPAIGN_LEVELS = 12
export const THEME_LEVEL_QUESTIONS = 8

export function themeHasCampaign(mode: string): boolean {
  if (!isThemeMode(mode)) return false
  return THEME_CAMPAIGN_MODES[themeWorldOf(mode)].includes(mode)
}

export function themeFactsMode(mode: string): boolean {
  return mode === 'csPhotoToName' || mode === 'musicPhotoToName'
}

export const THEME_PHOTO_MODES = ['csPhotoToName', 'musicPhotoToName'] as const
