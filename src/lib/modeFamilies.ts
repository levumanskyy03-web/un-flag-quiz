import { RANKING_MODES } from '../data/rankings'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import {
  CLUB_FOOTBALL_MODES,
  CODES_MODES,
  EURO_FOOTBALL_MODES,
  MANAGER_FOOTBALL_MODES,
  PLAYER_FOOTBALL_MODES,
  WC_FOOTBALL_MODES,
  isFootballMode,
  isLeadersMode,
  type MixKind,
  type QuizDifficulty,
  type QuizMode,
  EASY_FOOTBALL_MIX_MODES,
  EASY_MIX_MODES,
  HARD_FOOTBALL_MIX_MODES,
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
  'factsToName',
  'water',
  'nameToLanguage',
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

export function modesOfGeoFamily(id: GeoFamilyId): QuizMode[] {
  if (id === 'mix') return []
  if (id === 'flags') return ['flagToName', 'nameToFlag']
  if (id === 'map') return ['nameToMap', 'mapToName']
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
  if (mode === 'mapToSea' || mode === 'seaToName' || mode === 'mapToRiver' || mode === 'riverToName') return 'water'
  if ((CODES_MODES as readonly string[]).includes(mode)) return 'codes'
  if ((RANKING_MODES as readonly string[]).includes(mode)) return 'rankings'
  if ((GEO_FAMILIES as readonly string[]).includes(mode)) return mode as GeoFamilyId
  return 'flags'
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
  if (mode === 'nameToLanguage') return pool
  if (isLeadersMode(mode) || mode === 'playerPhotoToName' || mode === 'managerPhotoToName') return pool
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

export function geoFamilyLabel(id: GeoFamilyId, lang: Lang): string {
  const t = STRINGS[lang]
  if (id === 'mix') return t.familyMix
  if (id === 'flags') return t.familyFlags
  if (id === 'map') return t.familyMap
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
