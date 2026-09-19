import { footballCampaignLevels, footballLevelPlayerIds, footballLevelYears } from '../../data/footballLevels'
import { LEVEL_COUNT } from '../../data/levels'
import { quizLanguageId } from '../../data/languages'
import { govKindOf } from '../../data/governments'
import { canAskWater, countryForWater, isWaterMapMode, isWaterMode, waterCampaignLevels, watersFor } from '../../data/water'
import { rankingPlaceOf } from '../../data/rankings'
import {
  FOOTBALL_MODES,
  isFootballMode,
  isLeadersMode,
  isManagerFootballMode,
  isMathMode,
  isAstroMode,
  isLanguageMode,
  isNameToGov,
  isPlayerFootballMode,
  isRankingMode,
  isThemeMode,
  isThemeWorld,
  LEVEL_MODES,
  LEADERS_MODES,
  MATH_MODES,
  MATH_CAMPAIGN_MODES,
  ASTRO_CAMPAIGN_MODES,
  THEME_CAMPAIGN_MODES,
  type Country,
  type LearnFrom,
  type QuizMode,
  type QuizWorld,
  type RegionFilter,
} from './core'
import { extraFitsMode, getGeoLevelPool, getRegionPool } from './geo'
import { footballCountryForYear, footballLearnCountries } from './football'
import { leaderLearnCountries, leaderLevelChunks, leaderCampaignLevels } from './leaders'
import { mathCampaignLevels, mathLearnCountries, mathLevelChunks } from './math'
import { astroCampaignLevels, astroLearnCountries, astroLevelChunks } from './astro'
import { themeCampaignLevels, themeLearnCountries, themeLevelChunks } from './theme'

export * from './core'
export * from './geo'
export * from './football'
export * from './codes'
export * from './leaders'
export * from './math'
export * from './astro'
export * from './theme'

export function campaignLevelCount(mode: QuizMode): number {
  if (isFootballMode(mode)) return footballCampaignLevels(mode)
  if (isWaterMode(mode)) return waterCampaignLevels(mode)
  if (isLeadersMode(mode)) return leaderCampaignLevels(mode)
  if (isMathMode(mode)) return mathCampaignLevels(mode)
  if (isAstroMode(mode)) return astroCampaignLevels(mode)
  if (isThemeMode(mode)) return themeCampaignLevels(mode)
  return LEVEL_COUNT
}

export function campaignLevelNumbers(mode: QuizMode): number[] {
  return Array.from({ length: campaignLevelCount(mode) }, (_, index) => index + 1)
}

export function campaignModesForWorld(world: QuizWorld): QuizMode[] {
  if (world === 'football') return [...FOOTBALL_MODES]
  if (world === 'leaders') return [...LEADERS_MODES]
  if (world === 'math') return [...MATH_CAMPAIGN_MODES]
  if (world === 'astronomy') return [...ASTRO_CAMPAIGN_MODES]
  if (isThemeWorld(world)) return [...THEME_CAMPAIGN_MODES[world]]
  return [...LEVEL_MODES]
}

export function campaignMaxForWorld(world: QuizWorld): number {
  return campaignModesForWorld(world).reduce((sum, mode) => sum + campaignLevelCount(mode), 0)
}

export function getLevelPool(level: number, mode: QuizMode = 'flagToName'): Country[] {
  if (isFootballMode(mode)) {
    if (
      isPlayerFootballMode(mode) ||
      isManagerFootballMode(mode) ||
      mode === 'clubCrestToName' ||
      mode === 'stadiumToClub'
    ) {
      return footballLearnCountries(mode, undefined, footballLevelPlayerIds(mode, level))
    }
    const years = footballLevelYears(mode, level)
    return years.flatMap((year) => footballCountryForYear(mode, year)).filter(Boolean)
  }
  if (isLeadersMode(mode)) {
    return leaderLevelChunks(mode)[level - 1] ?? []
  }
  if (isMathMode(mode)) {
    return mathLevelChunks(mode)[level - 1] ?? []
  }
  if (isAstroMode(mode)) {
    return astroLevelChunks(mode)[level - 1] ?? []
  }
  if (isThemeMode(mode)) {
    return themeLevelChunks(mode)[level - 1] ?? []
  }
  return getGeoLevelPool(level, mode)
}

export function levelQuestionCount(level: number, mode: QuizMode): number {
  if (
    isPlayerFootballMode(mode) ||
    isManagerFootballMode(mode) ||
    mode === 'clubCrestToName' ||
    mode === 'stadiumToClub'
  ) {
    return footballLevelPlayerIds(mode, level).length
  }
  if (isFootballMode(mode)) return footballLevelYears(mode, level).length
  return getLevelPool(level, mode).length
}

export function getLearnPool(
  learnFrom: LearnFrom,
  region: RegionFilter,
  level: number,
  mode: QuizMode = 'flagToName',
  includeExtras = false,
): Country[] {
  if (isFootballMode(mode)) {
    if (isPlayerFootballMode(mode) || isManagerFootballMode(mode) || mode === 'clubCrestToName' || mode === 'stadiumToClub') {
      const ids = learnFrom === 'level' ? footballLevelPlayerIds(mode, level) : undefined
      return footballLearnCountries(mode, undefined, ids)
    }
    const years = learnFrom === 'level' ? footballLevelYears(mode, level) : undefined
    return footballLearnCountries(mode, years)
  }
  if (isLeadersMode(mode)) {
    return learnFrom === 'level' ? getLevelPool(level, mode) : leaderLearnCountries(mode)
  }
  if (isMathMode(mode)) {
    return learnFrom === 'level' ? getLevelPool(level, mode) : mathLearnCountries(mode)
  }
  if (isAstroMode(mode)) {
    return learnFrom === 'level' ? getLevelPool(level, mode) : astroLearnCountries(mode)
  }
  if (isThemeMode(mode)) {
    return learnFrom === 'level' ? getLevelPool(level, mode) : themeLearnCountries(mode)
  }
  const extras = learnFrom === 'level' ? false : includeExtras
  const pool = learnFrom === 'level' ? getLevelPool(level, mode) : getRegionPool(region, extras)
  if (isWaterMapMode(mode)) {
    const used = new Set<string>()
    const countries: Country[] = []
    for (const country of pool.filter((item) => canAskWater(item.iso, mode))) {
      const id = watersFor(country.iso, mode)[0]
      if (!id || used.has(id)) continue
      used.add(id)
      countries.push(countryForWater(id, mode) ?? country)
    }
    return countries
  }
  const filtered = isWaterMode(mode)
    ? pool.filter((country) => canAskWater(country.iso, mode))
    : isRankingMode(mode)
      ? pool.filter((country) => rankingPlaceOf(mode, country.iso) !== null)
      : isLanguageMode(mode)
        ? pool.filter((country) => quizLanguageId(country.iso))
        : isNameToGov(mode)
          ? pool.filter((country) => govKindOf(country.iso))
          : pool
  return filtered.filter((country) => extraFitsMode(country, mode))
}
