import { COLLECTIONS, type Collection } from '../data/collections'
import { QUESTIONS_PER_ROUND, shuffleSeeded } from './quiz/core'

export const DAILY_KEY = 'un-flag-quiz-daily'
export const DAILY_MIN_IDS = 8

export type DailyRecord = {
  day: string
  world: string
  id: string
  correct: number
  total: number
  streak: number
}

export function utcDayStamp(at = new Date()) {
  const y = at.getUTCFullYear()
  const m = String(at.getUTCMonth() + 1).padStart(2, '0')
  const d = String(at.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function utcDayIndex(at = new Date()) {
  return Math.floor(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()) / 86_400_000)
}

export function dailyEligible(): Collection[] {
  return COLLECTIONS.filter((item) => item.ids.length >= DAILY_MIN_IDS)
}

export function dailyCollection(at = new Date()): Collection {
  const list = dailyEligible()
  return list[Math.abs(utcDayIndex(at)) % list.length]
}

export function dailyCollectionOf(world: Collection['world'], at = new Date()): Collection | undefined {
  const list = dailyEligible().filter((item) => item.world === world)
  if (list.length === 0) return undefined
  return list[Math.abs(utcDayIndex(at) + 17) % list.length]
}

function hashId(value: string) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function dailyPickIds(collection: Collection, at = new Date()) {
  const seed = (utcDayIndex(at) * 10007 + hashId(`${collection.world}:${collection.id}`)) >>> 0
  return shuffleSeeded([...collection.ids], seed).slice(0, Math.min(QUESTIONS_PER_ROUND, collection.ids.length))
}

function yesterdayStamp(day: string) {
  const [y, m, d] = day.split('-').map(Number)
  const at = new Date(Date.UTC(y, m - 1, d - 1))
  return utcDayStamp(at)
}

let snapshotRaw: string | null = null
let snapshotRecord: DailyRecord | null = null

export function dailyRecordRaw(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(DAILY_KEY)
  } catch {
    return null
  }
}

export function loadDailyRecord(): DailyRecord | null {
  const raw = dailyRecordRaw()
  if (raw === snapshotRaw) return snapshotRecord
  snapshotRaw = raw
  if (!raw) {
    snapshotRecord = null
    return null
  }
  try {
    const parsed = JSON.parse(raw) as DailyRecord
    snapshotRecord = parsed && typeof parsed.day === 'string' ? parsed : null
  } catch {
    snapshotRecord = null
  }
  return snapshotRecord
}

export function saveDailyComplete(input: { world: string; id: string; correct: number; total: number }) {
  if (typeof window === 'undefined') return
  const day = utcDayStamp()
  const prev = loadDailyRecord()
  if (prev?.day === day) return
  const streak = prev && prev.day === yesterdayStamp(day) ? prev.streak + 1 : 1
  const next: DailyRecord = { day, world: input.world, id: input.id, correct: input.correct, total: input.total, streak }
  try {
    const raw = JSON.stringify(next)
    localStorage.setItem(DAILY_KEY, raw)
    snapshotRaw = raw
    snapshotRecord = next
    window.dispatchEvent(new Event('storage'))
  } catch {
    /* ignore */
  }
}

export function todayDailyDone() {
  return loadDailyRecord()?.day === utcDayStamp()
}
