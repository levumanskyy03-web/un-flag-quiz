import {
  ASTRO_ITEMS,
  astroById,
  astroCountry,
  astroDisplayName,
  astroItemFromCountry,
  astroItemsOf,
  astroLevelIsos,
  astroPersonOf,
  astroPromptOf,
  type AstroItem,
} from '../../data/astro'
import {
  ASTRO_CAMPAIGN_LEVELS,
  ASTRO_LEVEL_QUESTIONS,
  EASY_ASTRO_MIX_MODES,
  HARD_ASTRO_MIX_MODES,
  astroHasCampaign,
  isAstroMode,
  type AstroMode,
} from './astroModes'
import {
  pickFirstFit,
  QUESTIONS_PER_ROUND,
  shuffle,
  type Question,
  type QuizDifficulty,
} from './core'
import type { Country } from '../../data/countries'

export function astroPoolItems(mode: AstroMode, difficulty?: QuizDifficulty): AstroItem[] {
  const tier = difficulty === 'hardcore' ? 'hard' : difficulty
  return astroItemsOf(mode, tier === 'easy' || tier === 'medium' || tier === 'hard' ? tier : undefined)
}

export function astroPoolSize(mode: AstroMode, difficulty?: QuizDifficulty): number {
  return astroPoolItems(mode, difficulty).length
}

export function astroMixPoolSize(
  mix: 'easy' | 'hard' | 'custom',
  difficulty: QuizDifficulty,
  custom: readonly string[] = [],
): number {
  const modes =
    mix === 'custom'
      ? custom.filter(isAstroMode)
      : mix === 'easy'
        ? [...EASY_ASTRO_MIX_MODES]
        : [...HARD_ASTRO_MIX_MODES]
  return modes.reduce((sum, mode) => sum + astroPoolSize(mode, difficulty), 0)
}

export const ASTRO_LEVEL_SIZE = ASTRO_LEVEL_QUESTIONS

export function astroLearnCountries(mode: AstroMode): Country[] {
  return astroItemsOf(mode).map(astroCountry)
}

export function astroLevelChunks(mode: AstroMode): Country[][] {
  if (!astroHasCampaign(mode)) return []
  return Array.from({ length: ASTRO_CAMPAIGN_LEVELS }, (_, level) =>
    astroLevelIsos(mode, level + 1).map((id) => {
      const item = astroById(id)
      return item ? astroCountry(item) : { iso: id, nameEn: mode, nameRu: mode, region: 'europe' as const, difficulty: 'easy' as const }
    }),
  )
}

export function astroCampaignLevels(mode: AstroMode): number {
  return astroHasCampaign(mode) ? ASTRO_CAMPAIGN_LEVELS : 0
}

export function createAstroRound(
  mode: AstroMode,
  count = QUESTIONS_PER_ROUND,
  difficulty?: QuizDifficulty,
  isos?: string[],
): Question[] {
  if (isos?.length) {
    const items = isos
      .map((id) => astroById(id))
      .filter((item): item is AstroItem => item !== undefined && item.mode === mode)
    if (items.length > 0) return questionsFromItems(items, count, mode)
    return []
  }
  const full = astroItemsOf(mode)
  const pool = astroPoolItems(mode, difficulty)
  const distractors = pool.length >= 4 ? pool : full
  const picked: AstroItem[] = []
  const usedKeys = new Set<string>()
  for (const item of shuffle(pool)) {
    if (picked.length >= count) break
    if (usedKeys.has(item.key)) continue
    usedKeys.add(item.key)
    picked.push(item)
  }
  return questionsFromItems(picked, count, mode, distractors)
}

export function createAstroLevelRound(mode: AstroMode, level: number): Question[] {
  if (!astroHasCampaign(mode)) return []
  return createAstroRound(mode, ASTRO_LEVEL_QUESTIONS, undefined, astroLevelIsos(mode, level))
}

export function createAstroMixedRound(
  modes: readonly AstroMode[],
  count = QUESTIONS_PER_ROUND,
  difficulty?: QuizDifficulty,
): Question[] {
  const cycle = modes.filter(isAstroMode)
  if (cycle.length === 0 || count <= 0) return []
  const questions: Question[] = []
  const usedIds = new Set<string>()
  const avoidKeys: string[] = []
  for (let i = 0; i < count * 12 && questions.length < count; i += 1) {
    const mode = cycle[i % cycle.length]
    const pool = astroPoolItems(mode, difficulty).filter((item) => !usedIds.has(item.id))
    const item = shuffle(pool)[0]
    if (!item) continue
    usedIds.add(item.id)
    questions.push({
      country: astroCountry(item),
      mode,
      options: pickAstroOptions(item, astroItemsOf(mode), avoidKeys),
    })
    avoidKeys.push(item.key)
  }
  return questions
}

function questionsFromItems(
  picked: AstroItem[],
  count: number,
  mode: AstroMode,
  distractorPool?: AstroItem[],
): Question[] {
  const pool = distractorPool ?? astroItemsOf(mode)
  const questions: Question[] = []
  const avoidKeys: string[] = []
  for (const item of picked.slice(0, count)) {
    questions.push({
      country: astroCountry(item),
      mode,
      options: pickAstroOptions(item, pool, avoidKeys),
    })
    avoidKeys.push(item.key)
  }
  return questions
}

function pickAstroOptions(item: AstroItem, pool: AstroItem[], avoidKeys: readonly string[] = []): Country[] {
  const distractors = pickFirstFit(3, avoidKeys, (banned) => {
    const seen = new Set<string>([item.key])
    const picks: AstroItem[] = []
    for (const candidate of shuffle(pool)) {
      if (candidate.id === item.id || seen.has(candidate.key) || banned.has(candidate.key)) continue
      picks.push(candidate)
      seen.add(candidate.key)
      if (picks.length === 3) break
    }
    return picks.map(astroCountry)
  })
  return shuffle([astroCountry(item), ...distractors])
}

export function astroOptionLabel(item: AstroItem, lang: import('../../i18n/lang').Lang): string {
  return astroDisplayName(item, lang)
}

export function astroPromptText(item: AstroItem, lang: import('../../i18n/lang').Lang): string {
  return astroPromptOf(item, lang)
}

export function astroLearnLine(item: AstroItem, lang: import('../../i18n/lang').Lang): { prompt: string; answer: string } {
  return { prompt: astroPromptText(item, lang), answer: astroOptionLabel(item, lang) }
}

export { astroById, astroPersonOf, ASTRO_ITEMS, astroItemFromCountry }
