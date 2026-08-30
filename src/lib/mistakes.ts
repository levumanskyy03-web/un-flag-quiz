import { ALL_COUNTRIES } from '../data/extras'
import { type Country } from '../data/countries'
import { isCodesMode, isFootballMode, isLeadersMode, isQuizMode, type QuizMode } from './quiz'

export const MISTAKES_KEY = 'un-flag-quiz-mistakes'

export interface MistakeEntry {
  iso: string
  mode: QuizMode
  at: number
  year?: number
}

export function loadMistakes(): MistakeEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(MISTAKES_KEY)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isMistakeEntry)
  } catch {
    return []
  }
}

export function recordMistake(entry: Omit<MistakeEntry, 'at'> & { at?: number }): MistakeEntry[] {
  const nextEntry: MistakeEntry = { ...entry, at: entry.at ?? Date.now() }
  const current = loadMistakes().filter((item) => mistakeKey(item) !== mistakeKey(nextEntry))
  const next = [nextEntry, ...current].slice(0, 200)
  writeMistakes(next)
  return next
}

export function recordMistakes(entries: Array<Omit<MistakeEntry, 'at'>>): MistakeEntry[] {
  let next = loadMistakes()
  const at = Date.now()
  for (const entry of entries) {
    const item: MistakeEntry = { ...entry, at }
    next = [item, ...next.filter((existing) => mistakeKey(existing) !== mistakeKey(item))]
  }
  next = next.slice(0, 200)
  writeMistakes(next)
  return next
}

export function clearMistake(entry: Pick<MistakeEntry, 'iso' | 'mode' | 'year'>): MistakeEntry[] {
  const next = loadMistakes().filter((item) => mistakeKey(item) !== mistakeKey(entry))
  writeMistakes(next)
  return next
}

export function clearCorrected(entries: Array<Pick<MistakeEntry, 'iso' | 'mode' | 'year'>>): MistakeEntry[] {
  const keys = new Set(entries.map(mistakeKey))
  const next = loadMistakes().filter((item) => !keys.has(mistakeKey(item)))
  writeMistakes(next)
  return next
}

export function clearMistakes(keep?: (entry: MistakeEntry) => boolean): MistakeEntry[] {
  if (!keep) {
    localStorage.removeItem(MISTAKES_KEY)
    return []
  }
  const next = loadMistakes().filter(keep)
  writeMistakes(next)
  return next
}

export function geoMistakeCountries(mistakes: MistakeEntry[]): Country[] {
  const isos = new Set(
    mistakes
      .filter((item) => !isFootballMode(item.mode) && !isCodesMode(item.mode) && !isLeadersMode(item.mode))
      .map((item) => item.iso),
  )
  return ALL_COUNTRIES.filter((country) => isos.has(country.iso))
}

export function footballMistakes(mistakes: MistakeEntry[], mode: QuizMode): MistakeEntry[] {
  return mistakes.filter((item) => item.mode === mode)
}

export function mistakeKey(entry: Pick<MistakeEntry, 'iso' | 'mode' | 'year'>): string {
  return `${entry.mode}:${entry.iso}:${entry.year ?? ''}`
}

function writeMistakes(entries: MistakeEntry[]): void {
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(entries))
}

export const TRAINER_STATS_KEY = 'un-flag-quiz-trainer-stats'

export interface TrainerStats {
  completes: number
  perfects: number
}

export function loadTrainerStats(): TrainerStats {
  if (typeof window === 'undefined') return { completes: 0, perfects: 0 }
  try {
    const raw = localStorage.getItem(TRAINER_STATS_KEY)
    if (raw === null) return { completes: 0, perfects: 0 }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { completes: 0, perfects: 0 }
    const record = parsed as Record<string, unknown>
    return {
      completes: Number.isFinite(record.completes) ? Math.max(0, Math.floor(Number(record.completes))) : 0,
      perfects: Number.isFinite(record.perfects) ? Math.max(0, Math.floor(Number(record.perfects))) : 0,
    }
  } catch {
    return { completes: 0, perfects: 0 }
  }
}

export function bumpTrainerComplete(perfect: boolean): TrainerStats {
  const current = loadTrainerStats()
  const next: TrainerStats = {
    completes: current.completes + 1,
    perfects: current.perfects + (perfect ? 1 : 0),
  }
  localStorage.setItem(TRAINER_STATS_KEY, JSON.stringify(next))
  return next
}

function isMistakeEntry(value: unknown): value is MistakeEntry {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.iso === 'string' &&
    isQuizMode(record.mode) &&
    typeof record.at === 'number' &&
    (record.year === undefined || typeof record.year === 'number')
  )
}
