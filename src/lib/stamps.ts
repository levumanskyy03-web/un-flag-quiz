import { COUNTRIES } from '../data/countries'
import {
  isCorrect,
  isRankingMode,
  QUIZ_MODES,
  type PlayPath,
  type QuizDifficulty,
  type QuizMode,
  type RoundAnswer,
  type RoundEnd,
} from './quiz'

export const STAMPS_KEY = 'un-flag-quiz-stamps'
export const STAMP_TOTAL = COUNTRIES.length
export const STAMP_MAX = 5

const COUNTRY_ISOS = new Set(COUNTRIES.map((country) => country.iso))
const GEO_MODES = new Set<string>(QUIZ_MODES)

export interface StampEntry {
  n: number
  modes: string[]
}

export type StampAlbum = Record<string, StampEntry>

export interface StampAwardContext {
  path: PlayPath
  modeFallback: QuizMode
  difficulty: QuizDifficulty
  endedBy: RoundEnd
}

export function isStampIso(iso: string): boolean {
  return COUNTRY_ISOS.has(iso)
}

function isStampMode(mode: QuizMode): boolean {
  return GEO_MODES.has(mode) || isRankingMode(mode)
}

function cloneAlbum(album: StampAlbum): StampAlbum {
  const next: StampAlbum = {}
  for (const [iso, entry] of Object.entries(album)) {
    next[iso] = { n: entry.n, modes: [...entry.modes] }
  }
  return next
}

function parseAlbum(raw: unknown): StampAlbum {
  if (Array.isArray(raw)) {
    const album: StampAlbum = {}
    for (const item of raw) {
      if (typeof item === 'string' && isStampIso(item)) {
        album[item] = { n: 1, modes: [] }
      }
    }
    return album
  }
  if (!raw || typeof raw !== 'object') return {}
  const album: StampAlbum = {}
  for (const [iso, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!isStampIso(iso) || !value || typeof value !== 'object') continue
    const record = value as { n?: unknown; modes?: unknown }
    const n = Math.min(STAMP_MAX, Math.max(0, Math.floor(Number(record.n))))
    if (n <= 0) continue
    const modes = Array.isArray(record.modes)
      ? record.modes.filter((mode): mode is string => typeof mode === 'string')
      : []
    album[iso] = { n, modes }
  }
  return album
}

function saveAlbum(album: StampAlbum) {
  localStorage.setItem(STAMPS_KEY, JSON.stringify(album))
}

export function loadStamps(): StampAlbum {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STAMPS_KEY)
    if (raw === null) return {}
    const parsed: unknown = JSON.parse(raw)
    const album = parseAlbum(parsed)
    if (Array.isArray(parsed)) saveAlbum(album)
    return album
  } catch {
    return {}
  }
}

export function stampCopies(album: StampAlbum, iso: string): number {
  return album[iso]?.n ?? 0
}

export function hasStamp(album: StampAlbum, iso: string): boolean {
  return stampCopies(album, iso) > 0
}

export function stampCopyCount(album: StampAlbum): number {
  return Object.values(album).reduce((sum, entry) => sum + entry.n, 0)
}

export function stampCountryCount(album: StampAlbum): number {
  return Object.values(album).filter((entry) => entry.n > 0).length
}

function canEarnNext(
  next: number,
  mode: QuizMode,
  modes: readonly string[],
  difficulty: QuizDifficulty,
  perfect: boolean,
  completed: boolean,
): boolean {
  if (next === 1) return true
  if (next === 2) return !modes.includes(mode)
  if (next === 3) return difficulty === 'hard' || difficulty === 'hardcore'
  if (next === 4) return perfect
  if (next === 5) return difficulty === 'hardcore' && completed
  return false
}

export function awardRoundStamps(answers: readonly RoundAnswer[], ctx: StampAwardContext): StampAlbum {
  const album = loadStamps()
  if (ctx.path !== 'pool' && ctx.path !== 'levels') return album

  const completed = ctx.endedBy === 'complete'
  const perfect = completed && answers.length > 0 && answers.every(isCorrect)
  const awarded = new Set<string>()
  let changed = false

  for (const answer of answers) {
    if (!isCorrect(answer)) continue
    const iso = answer.question.country.iso
    if (!isStampIso(iso) || awarded.has(iso)) continue
    const mode = answer.question.mode ?? ctx.modeFallback
    if (!isStampMode(mode)) continue

    const entry = album[iso] ?? { n: 0, modes: [] }
    if (entry.n >= STAMP_MAX) continue
    const next = entry.n + 1
    if (!canEarnNext(next, mode, entry.modes, ctx.difficulty, perfect, completed)) continue

    awarded.add(iso)
    album[iso] = {
      n: next,
      modes: entry.modes.includes(mode) ? entry.modes : [...entry.modes, mode],
    }
    changed = true
  }

  if (changed) saveAlbum(album)
  return cloneAlbum(album)
}
