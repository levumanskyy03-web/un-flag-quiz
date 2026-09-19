export const ARITH_MATH_MODES = [
  'exprToValue',
  'valueToExpr',
  'fractionDecimal',
  'percentToValue',
  'powerToValue',
  'orderOfOps',
] as const

export const GEOM_MATH_MODES = [
  'shapeToName',
  'nameToShape',
  'angleToKind',
  'formulaToQuantity',
  'unitsConvert',
] as const

export const SYMBOL_MATH_MODES = [
  'symbolToMeaning',
  'constantToValue',
  'siPrefixToFactor',
] as const

export const PEOPLE_MATH_MODES = [
  'mathPhotoToName',
  'mathFactsToName',
  'mathPersonToPlace',
  'theoremToAuthor',
] as const

export const MATH_MODES = [
  ...ARITH_MATH_MODES,
  ...GEOM_MATH_MODES,
  ...SYMBOL_MATH_MODES,
  ...PEOPLE_MATH_MODES,
] as const

export type MathMode = (typeof MATH_MODES)[number]
export const MATH_TOPICS = ['arithmetic', 'geometry', 'symbols', 'people'] as const
export type MathTopic = (typeof MATH_TOPICS)[number]

export function isMathMode(value: unknown): value is MathMode {
  return typeof value === 'string' && (MATH_MODES as readonly string[]).includes(value)
}

export function mathModesOf(topic: MathTopic): readonly MathMode[] {
  if (topic === 'arithmetic') return ARITH_MATH_MODES
  if (topic === 'geometry') return GEOM_MATH_MODES
  if (topic === 'symbols') return SYMBOL_MATH_MODES
  return PEOPLE_MATH_MODES
}

export function mathTopicOf(mode: MathMode): MathTopic {
  if ((ARITH_MATH_MODES as readonly string[]).includes(mode)) return 'arithmetic'
  if ((GEOM_MATH_MODES as readonly string[]).includes(mode)) return 'geometry'
  if ((SYMBOL_MATH_MODES as readonly string[]).includes(mode)) return 'symbols'
  return 'people'
}

export const EASY_MATH_MIX_MODES: MathMode[] = [
  'exprToValue',
  'fractionDecimal',
  'shapeToName',
  'symbolToMeaning',
]
export const HARD_MATH_MIX_MODES: MathMode[] = MATH_MODES.filter((mode) => mode !== 'mathFactsToName')
export const MATCH_MATH_MODES: MathMode[] = ['exprToValue', 'mathPhotoToName']
export const MATH_MATCH_MIX: MathMode[] = ['exprToValue', 'percentToValue', 'shapeToName']

export const MATH_CAMPAIGN_MODES: MathMode[] = [...ARITH_MATH_MODES]
export const MATH_CAMPAIGN_LEVELS = 20
export const MATH_LEVEL_QUESTIONS = 8
export const MATH_VIRTUAL_POOL = 10_000

export function mathHasCampaign(mode: string): boolean {
  return (MATH_CAMPAIGN_MODES as readonly string[]).includes(mode)
}

export function mathIsGenerated(mode: string): boolean {
  return (
    mathHasCampaign(mode) ||
    mode === 'angleToKind' ||
    mode === 'unitsConvert' ||
    mode === 'powerToValue'
  )
}
