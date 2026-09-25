import { RANKING_MODES } from '../data/rankings'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import {
  CLUB_FOOTBALL_MODES,
  CODES_MODES,
  EURO_FOOTBALL_MODES,
  MANAGER_FOOTBALL_MODES,
  PLAYER_FOOTBALL_MODES,
  WC_FOOTBALL_MODES,
  isDrivingMode,
  isFootballMode,
  isLeadersMode,
  isMathMode,
  isAstroMode,
  isThemeMode,
  mathModesOf,
  mathTopicOf,
  astroModesOf,
  astroTopicOf,
  themeModesOfTopic,
  themeTopicOf,
  themeTopicsOf,
  EASY_THEME_MIX,
  HARD_THEME_MIX,
  THEME_DEFAULT_MODE,
  type MixKind,
  type QuizDifficulty,
  type QuizMode,
  type ThemeTopic,
  type ThemeWorld,
  EASY_FOOTBALL_MIX_MODES,
  EASY_MATH_MIX_MODES,
  EASY_ASTRO_MIX_MODES,
  EASY_MIX_MODES,
  HARD_FOOTBALL_MIX_MODES,
  HARD_MATH_MIX_MODES,
  HARD_ASTRO_MIX_MODES,
  HARD_MIX_MODES,
} from './quiz'

interface FamilySettings {
  mix: MixKind | null
  mixModes?: QuizMode[]
  mode: QuizMode
  difficulty: QuizDifficulty
}

export const COPA_FOOTBALL_MODES = ['copaWinners', 'copaFinalists', 'copaHosts'] as const
export const AFCON_FOOTBALL_MODES = ['afconWinners', 'afconFinalists', 'afconHosts'] as const
export const OTHER_CUP_FOOTBALL_MODES = ['asianCupWinners', 'goldCupWinners', 'nationsLeagueWinners'] as const

export const GEO_FAMILIES = [
  'mix',
  'flags',
  'nameToCapital',
  'nameToCurrency',
  'nameToPopulation',
  'nameToFounded',
  'neighborsToName',
  'map',
  'silhouette',
  'factsToName',
  'water',
  'nameToLanguage',
  'driving',
  'nameToGov',
  'codes',
  'rankings',
] as const

export const GEO_PLAY_FAMILIES = GEO_FAMILIES.filter((id) => id !== 'mix' && id !== 'rankings')

export type GeoFamilyId = (typeof GEO_FAMILIES)[number]

export const FOOTBALL_FAMILIES = [
  'mix',
  'players',
  'managers',
  'clubs',
  'wc',
  'euro',
  'copa',
  'afcon',
  'otherCups',
] as const

export const FOOTBALL_PLAY_FAMILIES = FOOTBALL_FAMILIES.filter((id) => id !== 'mix')

export type FootballFamilyId = (typeof FOOTBALL_FAMILIES)[number]

export const MATH_FAMILIES = ['mix', 'arithmetic', 'geometry', 'symbols', 'people'] as const
export const MATH_PLAY_FAMILIES = MATH_FAMILIES.filter((id) => id !== 'mix')
export type MathFamilyId = (typeof MATH_FAMILIES)[number]

export const ASTRO_FAMILIES = ['mix', 'planets', 'moons', 'sky', 'exploration', 'people'] as const
export const ASTRO_PLAY_FAMILIES = ASTRO_FAMILIES.filter((id) => id !== 'mix')
export type AstroFamilyId = (typeof ASTRO_FAMILIES)[number]

export function modesOfGeoFamily(id: GeoFamilyId): QuizMode[] {
  if (id === 'mix') return []
  if (id === 'flags') return ['flagToName', 'nameToFlag']
  if (id === 'map') return ['nameToMap', 'mapToName']
  if (id === 'silhouette') return ['silhouetteToName', 'nameToSilhouette']
  if (id === 'nameToLanguage') return ['nameToLanguage', 'languageToName']
  if (id === 'driving') return ['nameToDriving', 'drivingToName']
  if (id === 'water') return ['mapToSea', 'seaToName', 'mapToRiver', 'riverToName']
  if (id === 'codes') return [...CODES_MODES]
  if (id === 'rankings') return [...RANKING_MODES]
  return [id]
}

export function modesOfFootballFamily(id: FootballFamilyId): QuizMode[] {
  if (id === 'mix') return []
  if (id === 'players') return [...PLAYER_FOOTBALL_MODES]
  if (id === 'managers') return [...MANAGER_FOOTBALL_MODES]
  if (id === 'clubs') return [...CLUB_FOOTBALL_MODES]
  if (id === 'wc') return [...WC_FOOTBALL_MODES]
  if (id === 'euro') return [...EURO_FOOTBALL_MODES]
  if (id === 'copa') return [...COPA_FOOTBALL_MODES]
  if (id === 'afcon') return [...AFCON_FOOTBALL_MODES]
  return [...OTHER_CUP_FOOTBALL_MODES]
}

export function geoFamilyOf(mode: QuizMode, mix: MixKind | null): GeoFamilyId {
  if (mix) return 'mix'
  if (mode === 'flagToName' || mode === 'nameToFlag') return 'flags'
  if (mode === 'nameToMap' || mode === 'mapToName') return 'map'
  if (mode === 'silhouetteToName' || mode === 'nameToSilhouette') return 'silhouette'
  if (mode === 'nameToLanguage' || mode === 'languageToName') return 'nameToLanguage'
  if (mode === 'nameToDriving' || mode === 'drivingToName') return 'driving'
  if (mode === 'mapToSea' || mode === 'seaToName' || mode === 'mapToRiver' || mode === 'riverToName') return 'water'
  if ((CODES_MODES as readonly string[]).includes(mode)) return 'codes'
  if ((RANKING_MODES as readonly string[]).includes(mode)) return 'rankings'
  if ((GEO_FAMILIES as readonly string[]).includes(mode)) return mode as GeoFamilyId
  return 'flags'
}

export function modesOfMathFamily(id: MathFamilyId): QuizMode[] {
  if (id === 'mix') return []
  return [...mathModesOf(id)]
}

export function mathFamilyOf(mode: QuizMode, mix: MixKind | null): MathFamilyId | null {
  if (mix) return isMathMode(mode) ? 'mix' : null
  if (!isMathMode(mode)) return null
  return mathTopicOf(mode)
}

export function modesOfAstroFamily(id: AstroFamilyId): QuizMode[] {
  if (id === 'mix') return []
  return [...astroModesOf(id)]
}

export function astroFamilyOf(mode: QuizMode, mix: MixKind | null): AstroFamilyId | null {
  if (mix) return isAstroMode(mode) ? 'mix' : null
  if (!isAstroMode(mode)) return null
  return astroTopicOf(mode)
}

export type ThemeFamilyId = ThemeTopic | 'mix'

export function modesOfThemeFamily(id: ThemeFamilyId): QuizMode[] {
  if (id === 'mix') return []
  return [...themeModesOfTopic(id)]
}

export function themeFamilyOf(world: ThemeWorld, mode: QuizMode, mix: MixKind | null): ThemeFamilyId | null {
  if (mix) return isThemeMode(mode) ? 'mix' : null
  if (!isThemeMode(mode)) return null
  const topic = themeTopicOf(mode)
  return themeTopicsOf(world).includes(topic) ? topic : themeTopicsOf(world)[0] ?? 'mix'
}

export function settingsForThemeFamily(
  world: ThemeWorld,
  settings: FamilySettings,
  id: ThemeFamilyId,
): FamilySettings & { path: 'pool' } {
  if (id === 'mix') {
    const mix = settings.mix ?? 'easy'
    return {
      path: 'pool',
      mix,
      mixModes:
        settings.mixModes && settings.mixModes.length > 0
          ? settings.mixModes
          : mix === 'hard'
            ? [...HARD_THEME_MIX[world]]
            : [...EASY_THEME_MIX[world]],
      mode: THEME_DEFAULT_MODE[world],
      difficulty: settings.difficulty,
    }
  }
  const mode = pickModeInFamily(modesOfThemeFamily(id), settings.mode, THEME_DEFAULT_MODE[world])
  return { path: 'pool', mix: null, mode, difficulty: difficultyForMode(mode, settings.difficulty) }
}

export function themeFamilyLabel(world: ThemeWorld, id: ThemeFamilyId, lang: Lang): string {
  const t = STRINGS[lang]
  if (id === 'mix') return t.familyMix
  if (id === 'cell') return t.bioFamilyCell
  if (id === 'body') return t.bioFamilyBody
  if (id === 'life') return t.bioFamilyLife
  if (id === 'hosts') return t.olyFamilyHosts
  if (id === 'sports') return t.olyFamilySports
  if (id === 'noc') return t.olyFamilyNoc
  if (id === 'stars') return t.olyFamilyStars
  if (id === 'code') return t.csFamilyCode
  if (id === 'langs') return t.csFamilyLangs
  if (id === 'structs') return t.csFamilyStructs
  if (id === 'binary') return t.csFamilyBinary
  if (id === 'hackers') return t.csFamilyPeople
  if (id === 'dishes') return t.foodFamilyDishes
  if (id === 'plates') return t.foodFamilyPlates
  return t.foodFamilyOrigin
}

export function footballFamilyOf(mode: QuizMode, mix: MixKind | null): FootballFamilyId | null {
  if (mix) return isFootballMode(mode) ? 'mix' : null
  if (!isFootballMode(mode)) return null
  if ((PLAYER_FOOTBALL_MODES as readonly string[]).includes(mode)) return 'players'
  if ((MANAGER_FOOTBALL_MODES as readonly string[]).includes(mode)) return 'managers'
  if ((CLUB_FOOTBALL_MODES as readonly string[]).includes(mode)) return 'clubs'
  if ((WC_FOOTBALL_MODES as readonly string[]).includes(mode)) return 'wc'
  if ((EURO_FOOTBALL_MODES as readonly string[]).includes(mode)) return 'euro'
  if ((COPA_FOOTBALL_MODES as readonly string[]).includes(mode)) return 'copa'
  if ((AFCON_FOOTBALL_MODES as readonly string[]).includes(mode)) return 'afcon'
  if ((OTHER_CUP_FOOTBALL_MODES as readonly string[]).includes(mode)) return 'otherCups'
  return 'wc'
}

export function pickModeInFamily(modes: readonly QuizMode[], current: QuizMode, fallback: QuizMode): QuizMode {
  return modes.includes(current) ? current : (modes[0] ?? fallback)
}

export function difficultyForMode(mode: QuizMode, difficulty: QuizDifficulty): QuizDifficulty {
  const pool = difficulty === 'hardcore' ? 'hard' : difficulty
  if (mode === 'factsToName' || mode === 'playerFactsToName') return pool
  if (mode === 'nameToLanguage' || mode === 'languageToName') return pool
  if (isDrivingMode(mode)) return pool
  if (isLeadersMode(mode) || isMathMode(mode) || isAstroMode(mode) || isThemeMode(mode) || mode === 'playerPhotoToName' || mode === 'managerPhotoToName') return pool
  return pool === 'medium' ? 'hard' : pool
}

export function settingsForGeoFamily(settings: FamilySettings, id: GeoFamilyId): FamilySettings & { path: 'pool' } {
  if (id === 'mix') {
    const mix = settings.mix ?? 'easy'
    return {
      path: 'pool',
      mix,
      mixModes:
        settings.mixModes && settings.mixModes.length > 0
          ? settings.mixModes
          : mix === 'hard'
            ? [...HARD_MIX_MODES]
            : [...EASY_MIX_MODES],
      mode: 'flagToName',
      difficulty: settings.difficulty,
    }
  }
  const mode = pickModeInFamily(modesOfGeoFamily(id), settings.mode, 'flagToName')
  return { path: 'pool', mix: null, mode, difficulty: difficultyForMode(mode, settings.difficulty) }
}

export function settingsForFootballFamily(settings: FamilySettings, id: FootballFamilyId): FamilySettings & { path: 'pool' } {
  if (id === 'mix') {
    const mix = settings.mix ?? 'easy'
    return {
      path: 'pool',
      mix,
      mixModes:
        settings.mixModes && settings.mixModes.length > 0
          ? settings.mixModes
          : mix === 'hard'
            ? [...HARD_FOOTBALL_MIX_MODES]
            : [...EASY_FOOTBALL_MIX_MODES],
      mode: 'wcWinners',
      difficulty: settings.difficulty,
    }
  }
  const mode = pickModeInFamily(modesOfFootballFamily(id), settings.mode, 'wcWinners')
  return { path: 'pool', mix: null, mode, difficulty: difficultyForMode(mode, settings.difficulty) }
}

export function settingsForMathFamily(settings: FamilySettings, id: MathFamilyId): FamilySettings & { path: 'pool' } {
  if (id === 'mix') {
    const mix = settings.mix ?? 'easy'
    return {
      path: 'pool',
      mix,
      mixModes:
        settings.mixModes && settings.mixModes.length > 0
          ? settings.mixModes
          : mix === 'hard'
            ? [...HARD_MATH_MIX_MODES]
            : [...EASY_MATH_MIX_MODES],
      mode: 'exprToValue',
      difficulty: settings.difficulty,
    }
  }
  const mode = pickModeInFamily(modesOfMathFamily(id), settings.mode, 'exprToValue')
  return { path: 'pool', mix: null, mode, difficulty: difficultyForMode(mode, settings.difficulty) }
}

export function settingsForAstroFamily(settings: FamilySettings, id: AstroFamilyId): FamilySettings & { path: 'pool' } {
  if (id === 'mix') {
    const mix = settings.mix ?? 'easy'
    return {
      path: 'pool',
      mix,
      mixModes:
        settings.mixModes && settings.mixModes.length > 0
          ? settings.mixModes
          : mix === 'hard'
            ? [...HARD_ASTRO_MIX_MODES]
            : [...EASY_ASTRO_MIX_MODES],
      mode: 'planetToOrder',
      difficulty: settings.difficulty,
    }
  }
  const mode = pickModeInFamily(modesOfAstroFamily(id), settings.mode, 'planetToOrder')
  return { path: 'pool', mix: null, mode, difficulty: difficultyForMode(mode, settings.difficulty) }
}

export function geoFamilyLabel(id: GeoFamilyId, lang: Lang): string {
  const t = STRINGS[lang]
  if (id === 'mix') return t.familyMix
  if (id === 'flags') return t.familyFlags
  if (id === 'map') return t.familyMap
  if (id === 'silhouette') return t.familySilhouette
  if (id === 'driving') return t.familyDriving
  if (id === 'water') return t.familyWater
  if (id === 'codes') return t.codes
  if (id === 'rankings') return t.rankings
  return modeLabel(id, lang)
}

export function footballFamilyLabel(id: FootballFamilyId, lang: Lang): string {
  const t = STRINGS[lang]
  if (id === 'mix') return t.familyMix
  if (id === 'players') return t.footballGroupPlayers
  if (id === 'managers') return t.footballGroupManagers
  if (id === 'clubs') return t.footballGroupClubs
  if (id === 'wc') return t.footballGroupWc
  if (id === 'euro') return t.footballGroupEuro
  if (id === 'copa') return t.copaWinners
  if (id === 'afcon') return t.afconWinners
  return t.footballGroupOther
}

export function mathFamilyLabel(id: MathFamilyId, lang: Lang): string {
  const t = STRINGS[lang]
  if (id === 'mix') return t.familyMix
  if (id === 'arithmetic') return t.mathFamilyArithmetic
  if (id === 'geometry') return t.mathFamilyGeometry
  if (id === 'symbols') return t.mathFamilySymbols
  return t.mathFamilyPeople
}

export function astroFamilyLabel(id: AstroFamilyId, lang: Lang): string {
  const t = STRINGS[lang]
  if (id === 'mix') return t.familyMix
  if (id === 'planets') return t.astroFamilyPlanets
  if (id === 'moons') return t.astroFamilyMoons
  if (id === 'sky') return t.astroFamilySky
  if (id === 'exploration') return t.astroFamilyExploration
  return t.astroFamilyPeople
}
