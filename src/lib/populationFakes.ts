import { type Country } from '../data/countries'
import { PASSPORTS, formatPopulation } from '../data/passports'
import type { Lang } from '../i18n/strings'

const SMALL_POPULATION = 10_000_000
const SMALL_GAP = 0.33
const LARGE_GAP = 0.25

const LOW_FACTORS = [0.75, 0.67, 0.6, 0.5, 0.45, 0.4, 0.33, 0.25]
const HIGH_FACTORS = [1.25, 1.33, 1.5, 1.67, 1.8, 2, 2.5, 3]

export function populationGap(population: number): number {
  return population < SMALL_POPULATION ? SMALL_GAP : LARGE_GAP
}

export function populationChoiceLabel(
  option: Country,
  lang: Lang,
  prompt: Country,
  optionIsos: readonly string[],
  banned: readonly number[] = [],
): string {
  const passport = PASSPORTS[prompt.iso]
  if (!passport) return ''
  if (option.iso === prompt.iso) return formatPopulation(passport.population, lang)
  const fake = fakesFor(prompt, optionIsos, banned).get(option.iso)
  if (fake == null) {
    const other = PASSPORTS[option.iso]
    return other ? formatPopulation(other.population, lang) : ''
  }
  return formatPopulation(fake, lang)
}

function fakesFor(
  prompt: Country,
  optionIsos: readonly string[],
  banned: readonly number[] = [],
): Map<string, number> {
  const result = new Map<string, number>()
  const passport = PASSPORTS[prompt.iso]
  if (!passport) return result
  const distractors = optionIsos.filter((iso) => iso !== prompt.iso).sort()
  const values = pickPopulations(passport.population, `${prompt.iso}:${distractors.join(',')}`, banned)
  distractors.forEach((iso, index) => {
    const value = values[index]
    if (value != null) result.set(iso, value)
  })
  return result
}

function pickPopulations(correct: number, seed: string, banned: readonly number[] = []): number[] {
  const gap = populationGap(correct)
  const lows = candidates(correct, gap, 'low')
  const highs = candidates(correct, gap, 'high')
  const twoHigh = hash(seed) % 2 === 0
  const picked: number[] = []
  const usedLabels = new Set([
    formatPopulation(correct, 'en'),
    ...banned.map((value) => formatPopulation(value, 'en')),
  ])

  const take = (pool: number[], n: number) => {
    for (const value of seededShuffle(pool, `${seed}:${picked.length}`)) {
      if (picked.length >= n) return
      const label = formatPopulation(value, 'en')
      if (usedLabels.has(label)) continue
      usedLabels.add(label)
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
  const { shown, unit } = displayParts(correct)
  const step = stepFor(shown)
  const values: number[] = []
  const seen = new Set<string>()
  const factors = side === 'low' ? LOW_FACTORS : HIGH_FACTORS
  for (const factor of factors) {
    if (side === 'low' && factor > 1 - gap + 1e-9) continue
    if (side === 'high' && factor < 1 + gap - 1e-9) continue
    const aligned = alignShown(shown * factor, step, side)
    if (aligned <= 0) continue
    if (!shownFarEnough(shown, aligned, gap)) continue
    if (side === 'low' && aligned >= shown) continue
    if (side === 'high' && aligned <= shown) continue
    const population = snapToDisplay(aligned * unit)
    const label = formatPopulation(population, 'en')
    if (seen.has(label) || label === formatPopulation(correct, 'en')) continue
    if (!farEnough(correct, population, gap)) continue
    seen.add(label)
    values.push(population)
  }
  return values
}

function shownFarEnough(correctShown: number, fakeShown: number, gap: number): boolean {
  return Math.abs(fakeShown - correctShown) / correctShown >= gap - 1e-9
}

function farEnough(correct: number, fake: number, gap: number): boolean {
  const a = displayParts(correct).shown * displayParts(correct).unit
  const b = displayParts(fake).shown * displayParts(fake).unit
  return Math.abs(b - a) / a >= gap - 1e-9
}

function displayParts(population: number): { shown: number; unit: number } {
  if (population >= 1_000_000_000) return { shown: fromShown(population / 1_000_000_000), unit: 1_000_000_000 }
  if (population >= 1_000_000) return { shown: fromShown(population / 1_000_000), unit: 1_000_000 }
  if (population >= 1_000) return { shown: fromShown(population / 1_000), unit: 1_000 }
  return { shown: Math.max(1, Math.round(population)), unit: 1 }
}

function stepFor(shown: number): number {
  if (shown >= 100) return 5
  if (shown >= 10) return 1
  return 0.1
}

function alignShown(value: number, step: number, side: 'low' | 'high'): number {
  const aligned =
    side === 'low' ? Math.floor(value / step + 1e-9) * step : Math.ceil(value / step - 1e-9) * step
  return Number(aligned.toFixed(step < 1 ? 1 : 0))
}

function snapToDisplay(population: number): number {
  if (population >= 1_000_000_000) return fromShown(population / 1_000_000_000) * 1_000_000_000
  if (population >= 1_000_000) return fromShown(population / 1_000_000) * 1_000_000
  if (population >= 1_000) return fromShown(population / 1_000) * 1_000
  return Math.max(1, Math.round(population))
}

function fromShown(value: number): number {
  return value >= 10 ? Math.round(value) : Math.round(value * 10) / 10
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
