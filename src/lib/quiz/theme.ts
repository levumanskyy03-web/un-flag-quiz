import {
  THEME_ITEMS,
  themeById,
  themeCountry,
  themeDisplayName,
  themeItemFromCountry,
  themeItemsOf,
  themeLevelIsos,
  themePromptOf,
  type ThemeItem,
} from '../../data/theme'
import {
  EASY_THEME_MIX,
  HARD_THEME_MIX,
  THEME_CAMPAIGN_LEVELS,
  THEME_CAMPAIGN_MODES,
  THEME_DEFAULT_MODE,
  THEME_LEVEL_QUESTIONS,
  isThemeMode,
  themeHasCampaign,
  themeWorldOf,
  type ThemeMode,
  type ThemeWorld,
} from './themeModes'
import { pickFirstFit, QUESTIONS_PER_ROUND, shuffle, type Question, type QuizDifficulty } from './core'
import type { Country } from '../../data/countries'

export function themePoolItems(mode: ThemeMode, difficulty?: QuizDifficulty): ThemeItem[] {
  const tier = difficulty === 'hardcore' ? 'hard' : difficulty
  return themeItemsOf(mode, tier === 'easy' || tier === 'medium' || tier === 'hard' ? tier : undefined)
}

export function themePoolSize(mode: ThemeMode, difficulty?: QuizDifficulty): number {
  return themePoolItems(mode, difficulty).length
}

export function themeMixPoolSize(
  world: ThemeWorld,
  mix: 'easy' | 'hard' | 'custom',
  difficulty: QuizDifficulty,
  custom: readonly string[] = [],
): number {
  const modes =
    mix === 'custom'
      ? custom.filter(isThemeMode).filter((mode) => themeWorldOf(mode) === world)
      : mix === 'easy'
        ? EASY_THEME_MIX[world]
        : HARD_THEME_MIX[world]
  return modes.reduce((sum, mode) => sum + themePoolSize(mode, difficulty), 0)
}

export function themeLearnCountries(mode: ThemeMode): Country[] {
  return themeItemsOf(mode).map(themeCountry)
}

export function themeLevelChunks(mode: ThemeMode): Country[][] {
  if (!themeHasCampaign(mode)) return []
  return Array.from({ length: THEME_CAMPAIGN_LEVELS }, (_, level) =>
    themeLevelIsos(mode, level + 1).map((id) => {
      const item = themeById(id)
      return item
        ? themeCountry(item)
        : { iso: id, nameEn: mode, nameRu: mode, region: 'europe' as const, difficulty: 'easy' as const }
    }),
  )
}

export function themeCampaignLevels(mode: ThemeMode): number {
  return themeHasCampaign(mode) ? THEME_CAMPAIGN_LEVELS : 0
}

export function createThemeRound(
  mode: ThemeMode,
  count = QUESTIONS_PER_ROUND,
  difficulty?: QuizDifficulty,
  isos?: string[],
): Question[] {
  if (isos?.length) {
    const items = isos
      .map((id) => themeById(id))
      .filter((item): item is ThemeItem => item !== undefined && item.mode === mode)
    if (items.length > 0) return questionsFromItems(items, count, mode)
    return []
  }
  const full = themeItemsOf(mode)
  const pool = themePoolItems(mode, difficulty)
  const distractors = pool.length >= 4 ? pool : full
  const picked: ThemeItem[] = []
  const usedKeys = new Set<string>()
  for (const item of shuffle(pool)) {
    if (picked.length >= count) break
    if (usedKeys.has(item.key)) continue
    usedKeys.add(item.key)
    picked.push(item)
  }
  return questionsFromItems(picked, count, mode, distractors)
}

export function createThemeLevelRound(mode: ThemeMode, level: number): Question[] {
  if (!themeHasCampaign(mode)) return []
  return createThemeRound(mode, THEME_LEVEL_QUESTIONS, undefined, themeLevelIsos(mode, level))
}

export function createThemeMixedRound(
  modes: readonly ThemeMode[],
  count = QUESTIONS_PER_ROUND,
  difficulty?: QuizDifficulty,
): Question[] {
  const cycle = modes.filter(isThemeMode)
  if (cycle.length === 0 || count <= 0) return []
  const questions: Question[] = []
  const usedIds = new Set<string>()
  const avoidKeys: string[] = []
  for (let i = 0; i < count * 12 && questions.length < count; i += 1) {
    const mode = cycle[i % cycle.length]
    const pool = themePoolItems(mode, difficulty).filter((item) => !usedIds.has(item.id))
    const item = shuffle(pool)[0]
    if (!item) continue
    usedIds.add(item.id)
    questions.push({
      country: themeCountry(item),
      mode,
      options: pickThemeOptions(item, themeItemsOf(mode), avoidKeys),
    })
    avoidKeys.push(item.key)
  }
  return questions
}

function questionsFromItems(picked: ThemeItem[], count: number, mode: ThemeMode, distractorPool?: ThemeItem[]): Question[] {
  const pool = distractorPool ?? themeItemsOf(mode)
  const questions: Question[] = []
  const avoidKeys: string[] = []
  for (const item of picked.slice(0, count)) {
    questions.push({
      country: themeCountry(item),
      mode,
      options: pickThemeOptions(item, pool, avoidKeys),
    })
    avoidKeys.push(item.key)
  }
  return questions
}

function pickThemeOptions(item: ThemeItem, pool: ThemeItem[], avoidKeys: readonly string[] = []): Country[] {
  const distractors = pickFirstFit(3, avoidKeys, (banned) => {
    const seen = new Set<string>([item.key])
    const picks: ThemeItem[] = []
    for (const candidate of shuffle(pool)) {
      if (candidate.id === item.id || seen.has(candidate.key) || banned.has(candidate.key)) continue
      picks.push(candidate)
      seen.add(candidate.key)
      if (picks.length === 3) break
    }
    return picks.map(themeCountry)
  })
  return shuffle([themeCountry(item), ...distractors])
}

export function themeOptionLabel(item: ThemeItem, lang: import('../../i18n/lang').Lang): string {
  return themeDisplayName(item, lang)
}

export function themePromptText(item: ThemeItem, lang: import('../../i18n/lang').Lang): string {
  return themePromptOf(item, lang)
}

export function themeLearnLine(item: ThemeItem, lang: import('../../i18n/lang').Lang): { prompt: string; answer: string } {
  return { prompt: themePromptText(item, lang), answer: themeOptionLabel(item, lang) }
}

export function defaultThemeMode(world: ThemeWorld, mode: string): ThemeMode {
  return isThemeMode(mode) && themeWorldOf(mode) === world ? mode : THEME_DEFAULT_MODE[world]
}

export function campaignModesForTheme(world: ThemeWorld): ThemeMode[] {
  return [...THEME_CAMPAIGN_MODES[world]]
}

export { themeById, THEME_ITEMS, themeItemFromCountry }
