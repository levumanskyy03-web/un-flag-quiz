import { COUNTRIES, type Country } from '../../data/countries'
import {
  MATH_ITEMS,
  mathById,
  mathCountry,
  mathItemFromCountry,
  mathItemsOf,
  mathPersonOf,
  pickL,
  type MathItem,
} from '../../data/math'
import {
  HARD_MATH_MIX_MODES,
  MATH_CAMPAIGN_LEVELS,
  MATH_LEVEL_QUESTIONS,
  MATH_VIRTUAL_POOL,
  isMathMode,
  mathHasCampaign,
  mathIsGenerated,
  type MathMode,
} from './mathModes'
import { generateMathLearnItems, generateMathLevelRound, generateMathQuestions } from './mathGen'
import {
  pickFirstFit,
  QUESTIONS_PER_ROUND,
  shuffle,
  type Question,
  type QuizDifficulty,
} from './core'

export function mathPoolItems(mode: MathMode, difficulty?: QuizDifficulty): MathItem[] {
  const tier = difficulty === 'hardcore' ? 'hard' : difficulty
  return mathItemsOf(mode, tier === 'easy' || tier === 'medium' || tier === 'hard' ? tier : undefined)
}

export function mathPoolSize(mode: MathMode, difficulty?: QuizDifficulty): number {
  if (mathIsGenerated(mode)) return MATH_VIRTUAL_POOL
  return mathPoolItems(mode, difficulty).length
}

export function mathMixPoolSize(
  mix: 'easy' | 'hard' | 'custom',
  difficulty: QuizDifficulty,
  custom: readonly string[] = [],
): number {
  const modes = mix === 'custom' ? custom.filter(isMathMode) : mix === 'easy' ? ['exprToValue', 'fractionDecimal', 'shapeToName', 'symbolToMeaning'] as MathMode[] : [...HARD_MATH_MIX_MODES]
  if (modes.some((mode) => mathIsGenerated(mode))) return MATH_VIRTUAL_POOL
  return modes.reduce((sum, mode) => sum + mathPoolSize(mode, difficulty), 0)
}

export const MATH_LEVEL_SIZE = MATH_LEVEL_QUESTIONS

export function mathLearnCountries(mode: MathMode): Country[] {
  if (mathIsGenerated(mode)) return generateMathLearnItems(mode).map(mathCountry)
  return mathItemsOf(mode).map(mathCountry)
}

export function mathLevelChunks(mode: MathMode): Country[][] {
  if (!mathHasCampaign(mode)) return []
  return Array.from({ length: MATH_CAMPAIGN_LEVELS }, (_, level) =>
    Array.from({ length: MATH_LEVEL_QUESTIONS }, (_, slot) => ({
      iso: `mgl-${mode}-${level + 1}-${slot}`,
      nameEn: mode,
      nameRu: mode,
      region: 'europe' as const,
      difficulty: 'easy' as const,
    })),
  )
}

export function mathCampaignLevels(mode: MathMode): number {
  return mathHasCampaign(mode) ? MATH_CAMPAIGN_LEVELS : 0
}

export function createMathRound(
  mode: MathMode,
  count = QUESTIONS_PER_ROUND,
  difficulty?: QuizDifficulty,
  isos?: string[],
): Question[] {
  if (isos?.length) {
    const items = isos.map((id) => mathById(id)).filter((item): item is MathItem => item != null && item.mode === mode)
    if (items.length > 0) return questionsFromItems(items, count, mode)
    if (mathIsGenerated(mode)) return generateMathQuestions(mode, count, difficulty)
    return []
  }
  if (mathIsGenerated(mode)) return generateMathQuestions(mode, count, difficulty)
  const full = mathItemsOf(mode)
  const pool = mathPoolItems(mode, difficulty)
  const distractors = pool.length >= 4 ? pool : full
  const picked: MathItem[] = []
  const usedKeys = new Set<string>()
  for (const item of shuffle(pool)) {
    if (picked.length >= count) break
    if (usedKeys.has(item.key)) continue
    usedKeys.add(item.key)
    picked.push(item)
  }
  return questionsFromItems(picked, count, mode, distractors)
}

export function createMathLevelRound(mode: MathMode, level: number): Question[] {
  if (!mathHasCampaign(mode)) return []
  return generateMathLevelRound(mode, level)
}

export function createMathMixedRound(
  modes: readonly MathMode[],
  count = QUESTIONS_PER_ROUND,
  difficulty?: QuizDifficulty,
): Question[] {
  const cycle = modes.filter(isMathMode)
  if (cycle.length === 0 || count <= 0) return []
  const questions: Question[] = []
  const usedIds = new Set<string>()
  const avoidKeys: string[] = []
  for (let i = 0; i < count * 12 && questions.length < count; i += 1) {
    const mode = cycle[i % cycle.length]
    if (mathIsGenerated(mode)) {
      const generated = generateMathQuestions(mode, 1, difficulty, `${mode}:mix:${i}:${Date.now()}`)
      const next = generated[0]
      if (!next || usedIds.has(next.country.iso)) continue
      usedIds.add(next.country.iso)
      questions.push(next)
      continue
    }
    const pool = mathPoolItems(mode, difficulty).filter((item) => !usedIds.has(item.id))
    const item = shuffle(pool)[0]
    if (!item) continue
    usedIds.add(item.id)
    questions.push({
      country: mathCountry(item),
      mode,
      options: pickMathOptions(item, mathItemsOf(mode), avoidKeys),
    })
    avoidKeys.push(item.key)
  }
  return questions
}

function questionsFromItems(
  picked: MathItem[],
  count: number,
  mode: MathMode,
  distractorPool?: MathItem[],
): Question[] {
  const pool = distractorPool ?? mathItemsOf(mode)
  const questions: Question[] = []
  const avoidKeys: string[] = []
  for (const item of picked.slice(0, count)) {
    questions.push({
      country: mathCountry(item),
      mode,
      options: pickMathOptions(item, pool, avoidKeys),
    })
    avoidKeys.push(item.key)
  }
  return questions
}

function pickMathOptions(item: MathItem, pool: MathItem[], avoidKeys: readonly string[] = []): Country[] {
  const distractors = pickFirstFit(3, avoidKeys, (banned) => {
    const seen = new Set<string>([item.key])
    const picks: MathItem[] = []
    for (const candidate of shuffle(pool)) {
      if (candidate.id === item.id || seen.has(candidate.key) || banned.has(candidate.key)) continue
      if (item.mode === 'mathPersonToPlace' && candidate.key.split(':')[0] !== item.key.split(':')[0]) continue
      picks.push(candidate)
      seen.add(candidate.key)
      if (picks.length === 3) break
    }
    return picks.map(mathCountry)
  })
  return shuffle([mathCountry(item), ...distractors])
}

export function mathOptionLabel(item: MathItem, lang: import('../../i18n/lang').Lang): string {
  if (item.mode === 'mathPersonToPlace' && item.key.startsWith('c:') && item.iso) {
    const country = COUNTRIES.find((entry) => entry.iso === item.iso)
    if (country) {
      if (lang === 'ru') return country.nameRu
      if (lang === 'en') return country.nameEn
      try {
        const name = new Intl.DisplayNames([lang], { type: 'region' }).of(country.iso.toUpperCase())
        if (name) return name
      } catch {
        /* fall back */
      }
      return country.nameEn
    }
  }
  if (item.mode === 'exprToValue' || item.mode === 'percentToValue' || item.mode === 'powerToValue' || item.mode === 'orderOfOps' || item.mode === 'constantToValue') {
    return pickL(item.answer, lang)
  }
  if (item.mode === 'valueToExpr') return pickL(item.answer, lang)
  if (item.mode === 'nameToShape') return pickL(item.prompt, lang)
  return pickL(item.answer, lang)
}

export function mathPromptText(item: MathItem, lang: import('../../i18n/lang').Lang): string {
  if (item.mode === 'valueToExpr') return pickL(item.prompt, lang)
  if (item.mode === 'mathFactsToName' && item.facts?.length) {
    return item.facts.map((fact) => pickL(fact, lang)).join('\n')
  }
  if (item.mode === 'nameToShape') return pickL(item.prompt, lang)
  return pickL(item.prompt, lang)
}

export function mathLearnLine(item: MathItem, lang: import('../../i18n/lang').Lang): { prompt: string; answer: string } {
  return { prompt: mathPromptText(item, lang), answer: mathOptionLabel(item, lang) }
}

export { mathById, mathPersonOf, MATH_ITEMS, mathItemFromCountry }
