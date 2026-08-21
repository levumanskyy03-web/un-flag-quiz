import { isQuizMode, isRegionFilter, type QuizDifficulty, type QuizMode, type RegionFilter, type RoundEnd } from './quiz'

export const HISTORY_KEY = 'un-flag-quiz-history'
export const BESTS_KEY = 'un-flag-quiz-bests'
export const HISTORY_LIMIT = 30

export interface RoundRecord {
  id: string
  at: number
  correct: number
  total: number
  roundMs: number
  mode: QuizMode
  region: RegionFilter
  difficulty: QuizDifficulty
  roundSize: number
  endedBy: RoundEnd
}

export type ConfigKey = Pick<RoundRecord, 'mode' | 'region' | 'difficulty' | 'roundSize'>

export function configKey(record: ConfigKey): string {
  return `${record.mode}|${record.region}|${record.difficulty}|${record.roundSize}`
}

export function loadHistory(): RoundRecord[] {
  return readRecordList(HISTORY_KEY) ?? []
}

export function loadBests(): RoundRecord[] {
  const stored = readRecordList(BESTS_KEY)
  if (stored !== null) return sortBests(uniqueBests(stored))
  const seeded = sortBests(uniqueBests(loadHistory()))
  writeRecordList(BESTS_KEY, seeded)
  return seeded
}

export function saveRound(input: Omit<RoundRecord, 'id'>): {
  history: RoundRecord[]
  bests: RoundRecord[]
  isNewBest: boolean
} {
  const record: RoundRecord = { ...input, id: crypto.randomUUID() }
  const previousBests = loadBests()
  const history = [record, ...loadHistory()].slice(0, HISTORY_LIMIT)
  writeRecordList(HISTORY_KEY, history)

  const current = findBest(previousBests, record)
  const isNewBest = !current || isBetter(record, current)
  const nextBests = isNewBest
    ? sortBests(
        uniqueBests([
          ...previousBests.filter((best) => configKey(best) !== configKey(record)),
          record,
        ]),
      )
    : previousBests
  if (isNewBest) writeRecordList(BESTS_KEY, nextBests)

  return { history, bests: nextBests, isNewBest }
}

export function clearHistory(): RoundRecord[] {
  localStorage.removeItem(HISTORY_KEY)
  return []
}

export function clearBests(): RoundRecord[] {
  writeRecordList(BESTS_KEY, [])
  return []
}

export function findBest(bests: RoundRecord[], config: ConfigKey): RoundRecord | undefined {
  return bests.find((best) => configKey(best) === configKey(config))
}

export function isBetter(candidate: RoundRecord, current: RoundRecord): boolean {
  const nextPercent = scorePercent(candidate)
  const currentPercent = scorePercent(current)
  if (nextPercent !== currentPercent) return nextPercent > currentPercent
  if (candidate.correct !== current.correct) return candidate.correct > current.correct
  if (candidate.total !== current.total) return candidate.total > current.total
  const nextComplete = candidate.endedBy === 'complete'
  const currentComplete = current.endedBy === 'complete'
  if (nextComplete !== currentComplete) return nextComplete
  return candidate.roundMs < current.roundMs
}

function scorePercent(record: RoundRecord): number {
  return record.total === 0 ? 0 : record.correct / record.total
}

function uniqueBests(records: RoundRecord[]): RoundRecord[] {
  const map = new Map<string, RoundRecord>()
  for (const record of records) {
    const key = configKey(record)
    const current = map.get(key)
    if (!current || isBetter(record, current)) map.set(key, record)
  }
  return [...map.values()]
}

function sortBests(records: RoundRecord[]): RoundRecord[] {
  return [...records].sort((a, b) => {
    if (isBetter(a, b)) return -1
    if (isBetter(b, a)) return 1
    return b.at - a.at
  })
}

function readRecordList(key: string): RoundRecord[] | null {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isRoundRecord)
  } catch {
    return []
  }
}

function writeRecordList(key: string, records: RoundRecord[]): void {
  localStorage.setItem(key, JSON.stringify(records))
}

function isRoundRecord(value: unknown): value is RoundRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.at === 'number' &&
    typeof record.correct === 'number' &&
    typeof record.total === 'number' &&
    typeof record.roundMs === 'number' &&
    isQuizMode(record.mode) &&
    isRegionFilter(record.region) &&
    (record.difficulty === 'easy' || record.difficulty === 'hard' || record.difficulty === 'hardcore') &&
    typeof record.roundSize === 'number' &&
    (record.endedBy === 'complete' ||
      record.endedBy === 'timeout' ||
      record.endedBy === 'lives')
  )
}
