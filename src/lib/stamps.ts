import { COUNTRIES } from '../data/countries'

export const STAMPS_KEY = 'un-flag-quiz-stamps'
export const STAMP_TOTAL = COUNTRIES.length

const COUNTRY_ISOS = new Set(COUNTRIES.map((country) => country.iso))

export function isStampIso(iso: string): boolean {
  return COUNTRY_ISOS.has(iso)
}

export function loadStamps(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STAMPS_KEY)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return [...new Set(parsed.filter((item): item is string => typeof item === 'string' && isStampIso(item)))]
  } catch {
    return []
  }
}

export function collectStamp(iso: string): string[] {
  if (!isStampIso(iso)) return loadStamps()
  const current = loadStamps()
  if (current.includes(iso)) return current
  const next = [...current, iso]
  localStorage.setItem(STAMPS_KEY, JSON.stringify(next))
  return next
}

export function collectStamps(isos: readonly string[]): string[] {
  let next = loadStamps()
  let changed = false
  for (const iso of isos) {
    if (!isStampIso(iso) || next.includes(iso)) continue
    next = [...next, iso]
    changed = true
  }
  if (changed) localStorage.setItem(STAMPS_KEY, JSON.stringify(next))
  return next
}

export function hasStamp(stamps: readonly string[], iso: string): boolean {
  return stamps.includes(iso)
}
