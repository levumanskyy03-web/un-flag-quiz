import { type Country } from '../data/countries'
import { foundedYear } from '../data/founded'
import type { Lang } from '../i18n/strings'

const NOW_YEAR = 2026

export function foundedGap(year: number): number {
  return 10 + Math.floor(Math.abs(year - 2000) / 100) * 5
}

export function foundedChoiceLabel(
  option: Country,
  _lang: Lang,
  prompt: Country,
  optionIsos: readonly string[],
  banned: readonly number[] = [],
): string {
  const correct = foundedYear(prompt.iso)
  if (correct == null) return ''
  if (option.iso === prompt.iso) return String(correct)
  const fake = fakesFor(prompt, optionIsos, banned).get(option.iso)
  if (fake == null) {
    const year = foundedYear(option.iso)
    return year == null ? '' : String(year)
  }
  return String(fake)
}

function fakesFor(
  prompt: Country,
  optionIsos: readonly string[],
  banned: readonly number[] = [],
): Map<string, number> {
  const result = new Map<string, number>()
  const correct = foundedYear(prompt.iso)
  if (correct == null) return result
  const distractors = optionIsos.filter((iso) => iso !== prompt.iso).sort()
  const values = pickYears(correct, `${prompt.iso}:${distractors.join(',')}`, banned)
  distractors.forEach((iso, index) => {
    const value = values[index]
    if (value != null) result.set(iso, value)
  })
  return result
}

function pickYears(correct: number, seed: string, banned: readonly number[] = []): number[] {
  const gap = foundedGap(correct)
  const lows = candidates(correct, gap, 'low')
  const highs = candidates(correct, gap, 'high')
  const twoHigh = hash(seed) % 2 === 0
  const picked: number[] = []
  const used = new Set([correct, ...banned])

  const take = (pool: number[], n: number) => {
    for (const value of seededShuffle(pool, `${seed}:${picked.length}`)) {
      if (picked.length >= n) return
      if (used.has(value)) continue
      used.add(value)
      picked.push(value)
    }
  }

  if (twoHigh) {
    take(highs, Math.min(2, highs.length))
    take(lows, 3)
    take(highs, 3)
  } else {
    take(lows, Math.min(2, lows.length))
    take(highs, 3)
    take(lows, 3)
  }

  return picked.slice(0, 3)
}

function candidates(correct: number, gap: number, side: 'low' | 'high'): number[] {
  const offsets = [gap, gap + 5, gap + 10, gap + 15, gap + 20, gap + 30, gap + 50, gap + 75, gap + 100, 150, 200, 300]
  const years: number[] = []
  const seen = new Set<number>()
  for (const offset of offsets) {
    if (offset < gap) continue
    const year = side === 'low' ? correct - offset : correct + offset
    if (year < 100 || year > NOW_YEAR) continue
    if (Math.abs(year - correct) < gap) continue
    if (seen.has(year)) continue
    seen.add(year)
    years.push(year)
  }
  return years
}

function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  const next = [...items]
  let h = hash(seed)
  for (let i = next.length - 1; i > 0; i -= 1) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0
    const j = h % (i + 1)
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}
