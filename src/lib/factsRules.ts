import type { RegionFilter } from './quiz'

export const FACTS_MAX = 10
export const FACTS_WRONG_LIMIT = 3
export const FACTS_EARLY_COUNT = 5
export const FACTS_EARLY_TIME_MS = 10_000
export const FACTS_LATE_TIME_MS = 15_000
export const FACTS_CLUE_TIME_MS = FACTS_LATE_TIME_MS
export const FACTS_HARDCORE_TIME_MS = FACTS_EARLY_TIME_MS
export const FACTS_HARDCORE_MAX = 7
export const FACTS_SERIES = [1, 3, 5] as const
export type FactsSeries = (typeof FACTS_SERIES)[number]

export const FACTS_ENDS = ['correct', 'threeWrong', 'unlimited', 'maxFive'] as const
export type FactsEnd = (typeof FACTS_ENDS)[number]

export interface FactsDuelConfig {
  end: FactsEnd
  hardcore: boolean
  series: FactsSeries
  region?: RegionFilter
}

export function isFactsEnd(value: unknown): value is FactsEnd {
  return typeof value === 'string' && (FACTS_ENDS as readonly string[]).includes(value)
}

export function isFactsSeries(value: unknown): value is FactsSeries {
  return typeof value === 'number' && (FACTS_SERIES as readonly number[]).includes(value)
}

export function isFactsDuelConfig(value: unknown): value is FactsDuelConfig {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return isFactsEnd(record.end) && typeof record.hardcore === 'boolean' && isFactsSeries(record.series)
}

export function parseFactsDuelConfig(record: Record<string, unknown>): FactsDuelConfig | null {
  const nested = record.facts
  if (nested && typeof nested === 'object') {
    const body = nested as Record<string, unknown>
    if (isFactsEnd(body.end) && isFactsSeries(Number(body.series))) {
      return {
        end: body.end,
        hardcore: Boolean(body.hardcore),
        series: Number(body.series) as FactsSeries,
        region: typeof body.region === 'string' ? (body.region as FactsDuelConfig['region']) : undefined,
      }
    }
  }
  const end = record.factsEnd
  const series = typeof record.factsSeries === 'number' ? record.factsSeries : Number(record.factsSeries)
  if (!isFactsEnd(end) || !isFactsSeries(series)) return null
  return { end, hardcore: Boolean(record.factsHardcore), series }
}

export function factsMaxFor(config?: FactsDuelConfig | null): number {
  if (!config) return FACTS_MAX
  if (config.hardcore) return FACTS_HARDCORE_MAX
  if (config.end === 'maxFive') return 5
  if (config.end === 'correct' || config.end === 'unlimited') return 20
  return FACTS_MAX
}

export function factsWrongLimit(config?: FactsDuelConfig | null): number {
  if (!config) return FACTS_WRONG_LIMIT
  if (config.hardcore) return 1
  if (config.end === 'correct' || config.end === 'unlimited') return Number.POSITIVE_INFINITY
  return FACTS_WRONG_LIMIT
}

export function factsClueTimeMs(_config?: FactsDuelConfig | null, factIndex = 0): number {
  return factIndex < FACTS_EARLY_COUNT ? FACTS_EARLY_TIME_MS : FACTS_LATE_TIME_MS
}
