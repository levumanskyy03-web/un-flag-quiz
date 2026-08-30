import { type Region } from '../data/countries'
import { ALL_COUNTRIES } from '../data/extras'
import { flagTraits, type FlagColor, type FlagMotif } from '../data/flagTraits'
import {
  ATLANTIC,
  BLACK_SEA,
  BALTIC,
  CARIBBEAN,
  INDIAN,
  FEDERAL,
  LANG_AR,
  LANG_EN,
  LANG_ES,
  LANG_FR,
  LANG_PT,
  LEFT_TRAFFIC,
  MEDITERRANEAN,
  MONARCHY,
  NATO,
  PACIFIC,
  SOUTHERN_HEMISPHERE,
  type CivicLang,
  type WaterBody,
} from '../data/geoTraits'
import { foundedYear } from '../data/founded'
import { landNeighbors } from '../data/neighbors'
import { getPassport } from '../data/passports'
import { FACTS_MAX } from './factsRules'

export type PopulationBand = 'tiny' | 'small' | 'medium' | 'large' | 'huge'
export type FoundedEra = 'pre1800' | 'y1800' | 'y1900' | 'y1945' | 'y1970'
export type NeighborBand = 'n1' | 'n2' | 'n4' | 'n7'

export type FactKind =
  | 'region'
  | 'flagColor'
  | 'flagMotif'
  | 'currency'
  | 'island'
  | 'landlocked'
  | 'neighborBand'
  | 'borders'
  | 'founded'
  | 'foundedEra'
  | 'populationBand'
  | 'drivesLeft'
  | 'hemisphere'
  | 'language'
  | 'water'
  | 'monarchy'
  | 'federal'
  | 'nato'

export interface FactClue {
  id: string
  kind: FactKind
  uniqueness: number
  color?: FlagColor
  motif?: FlagMotif
  region?: Region
  neighborIso?: string
  neighborBand?: NeighborBand
  year?: number
  era?: FoundedEra
  populationBand?: PopulationBand
  currencyEn?: string
  currencyRu?: string
  language?: CivicLang
  water?: WaterBody
}

export const FACTS_UNIQUENESS_MIN = 2
export const FACTS_UNIQUENESS_MAX = 100
export const EARLY_FACT_COUNT = 4
export const EARLY_INTERSECTION_MIN = 3
export const EARLY_UNIQUENESS_MIN = 8

const LANDLOCKED = new Set([
  'ad', 'af', 'am', 'at', 'az', 'by', 'bt', 'bo', 'bw', 'bf', 'bi', 'cf', 'td', 'cz', 'sz', 'et',
  'hu', 'kz', 'kg', 'la', 'ls', 'li', 'lu', 'mw', 'ml', 'md', 'mn', 'np', 'ne', 'mk', 'py', 'rw',
  'sm', 'rs', 'sk', 'ss', 'ch', 'tj', 'tm', 'ug', 'uz', 'zm', 'zw',
])

let cached: { byIso: Map<string, FactClue[]>; byKey: Map<string, Set<string>> } | null = null

function store(): { byIso: Map<string, FactClue[]>; byKey: Map<string, Set<string>> } {
  if (cached) return cached
  cached = buildBank()
  return cached
}

function buildBank(): { byIso: Map<string, FactClue[]>; byKey: Map<string, Set<string>> } {
  const byIso = new Map<string, FactClue[]>()
  const uniq = new Map<string, Set<string>>()

  function add(iso: string, clue: Omit<FactClue, 'uniqueness'>, key: string) {
    const list = byIso.get(iso) ?? []
    list.push({ ...clue, uniqueness: 0 })
    byIso.set(iso, list)
    const set = uniq.get(key) ?? new Set()
    set.add(iso)
    uniq.set(key, set)
  }

  for (const country of ALL_COUNTRIES) {
    const iso = country.iso
    const passport = getPassport(iso)
    const neighbors = landNeighbors(iso)
    const traits = flagTraits(iso)

    add(iso, { id: `region:${country.region}`, kind: 'region', region: country.region }, `region:${country.region}`)

    for (const color of traits.colors) {
      add(iso, { id: `flagColor:${color}`, kind: 'flagColor', color }, `flagColor:${color}`)
    }
    for (const motif of traits.motifs) {
      add(iso, { id: `flagMotif:${motif}`, kind: 'flagMotif', motif }, `flagMotif:${motif}`)
    }

    if (passport) {
      add(
        iso,
        {
          id: `currency:${normalize(passport.currencyEn)}`,
          kind: 'currency',
          currencyEn: passport.currencyEn,
          currencyRu: passport.currencyRu,
        },
        `currency:${normalize(passport.currencyEn)}`,
      )
      add(
        iso,
        {
          id: `populationBand:${populationBand(passport.population)}`,
          kind: 'populationBand',
          populationBand: populationBand(passport.population),
        },
        `populationBand:${populationBand(passport.population)}`,
      )
    }

    if (neighbors.length === 0) {
      add(iso, { id: 'island', kind: 'island' }, 'island')
    } else {
      const band = neighborBand(neighbors.length)
      add(iso, { id: `neighborBand:${band}`, kind: 'neighborBand', neighborBand: band }, `neighborBand:${band}`)
      for (const neighborIso of neighbors) {
        add(iso, { id: `borders:${neighborIso}`, kind: 'borders', neighborIso }, `borders:${neighborIso}`)
      }
    }

    if (LANDLOCKED.has(iso)) {
      add(iso, { id: 'landlocked', kind: 'landlocked' }, 'landlocked')
    }

    if (LEFT_TRAFFIC.has(iso)) {
      add(iso, { id: 'drivesLeft', kind: 'drivesLeft' }, 'drivesLeft')
    }
    if (MONARCHY.has(iso)) {
      add(iso, { id: 'monarchy', kind: 'monarchy' }, 'monarchy')
    }
    if (FEDERAL.has(iso)) {
      add(iso, { id: 'federal', kind: 'federal' }, 'federal')
    }
    if (NATO.has(iso)) {
      add(iso, { id: 'nato', kind: 'nato' }, 'nato')
    }
    if (SOUTHERN_HEMISPHERE.has(iso)) {
      add(iso, { id: 'hemisphere:south', kind: 'hemisphere' }, 'hemisphere:south')
    }

    const language = civicLanguage(iso)
    if (language) {
      add(iso, { id: `language:${language}`, kind: 'language', language }, `language:${language}`)
    }
    for (const water of watersOf(iso)) {
      add(iso, { id: `water:${water}`, kind: 'water', water }, `water:${water}`)
    }

    const year = foundedYear(iso)
    if (year) {
      add(iso, { id: `founded:${year}`, kind: 'founded', year }, `founded:${year}`)
      const era = foundedEra(year)
      add(iso, { id: `foundedEra:${era}`, kind: 'foundedEra', era }, `foundedEra:${era}`)
    }
  }

  for (const [iso, clues] of byIso) {
    const kept: FactClue[] = []
    for (const clue of clues) {
      const key = uniquenessKey(clue)
      clue.uniqueness = uniq.get(key)?.size ?? 1
      if (clue.uniqueness >= FACTS_UNIQUENESS_MIN && clue.uniqueness <= FACTS_UNIQUENESS_MAX) kept.push(clue)
    }
    byIso.set(iso, kept)
  }

  const byKey = new Map<string, Set<string>>()
  for (const [key, isos] of uniq) {
    if (isos.size >= FACTS_UNIQUENESS_MIN && isos.size <= FACTS_UNIQUENESS_MAX) byKey.set(key, isos)
  }
  return { byIso, byKey }
}

export function uniquenessKey(clue: FactClue): string {
  if (clue.kind === 'currency') return `currency:${normalize(clue.currencyEn ?? '')}`
  if (clue.kind === 'populationBand') return `populationBand:${clue.populationBand}`
  if (clue.kind === 'founded') return `founded:${clue.year}`
  if (clue.kind === 'foundedEra') return `foundedEra:${clue.era}`
  if (clue.kind === 'region') return `region:${clue.region}`
  if (clue.kind === 'flagColor') return `flagColor:${clue.color}`
  if (clue.kind === 'flagMotif') return `flagMotif:${clue.motif}`
  if (clue.kind === 'borders') return `borders:${clue.neighborIso}`
  if (clue.kind === 'neighborBand') return `neighborBand:${clue.neighborBand}`
  if (clue.kind === 'language') return `language:${clue.language}`
  if (clue.kind === 'water') return `water:${clue.water}`
  if (clue.kind === 'hemisphere') return 'hemisphere:south'
  return clue.kind
}

export function isosMatching(clue: FactClue): Set<string> {
  return new Set(store().byKey.get(uniquenessKey(clue)) ?? [])
}

export function intersectionIsos(clues: FactClue[]): Set<string> {
  if (clues.length === 0) return new Set(ALL_COUNTRIES.map((country) => country.iso))
  let set = isosMatching(clues[0])
  for (let i = 1; i < clues.length; i += 1) {
    const next = isosMatching(clues[i])
    set = new Set([...set].filter((iso) => next.has(iso)))
  }
  return set
}

function populationBand(n: number): PopulationBand {
  if (n < 1_000_000) return 'tiny'
  if (n < 10_000_000) return 'small'
  if (n < 50_000_000) return 'medium'
  if (n < 100_000_000) return 'large'
  return 'huge'
}

function foundedEra(year: number): FoundedEra {
  if (year < 1800) return 'pre1800'
  if (year < 1900) return 'y1800'
  if (year < 1945) return 'y1900'
  if (year < 1970) return 'y1945'
  return 'y1970'
}

function neighborBand(n: number): NeighborBand {
  if (n === 1) return 'n1'
  if (n <= 3) return 'n2'
  if (n <= 6) return 'n4'
  return 'n7'
}

function civicLanguage(iso: string): CivicLang | null {
  if (LANG_ES.has(iso)) return 'es'
  if (LANG_PT.has(iso)) return 'pt'
  if (LANG_AR.has(iso)) return 'ar'
  if (LANG_FR.has(iso)) return 'fr'
  if (LANG_EN.has(iso)) return 'en'
  return null
}

function watersOf(iso: string): WaterBody[] {
  const water: WaterBody[] = []
  if (MEDITERRANEAN.has(iso)) water.push('mediterranean')
  if (BLACK_SEA.has(iso)) water.push('blackSea')
  if (BALTIC.has(iso)) water.push('baltic')
  if (CARIBBEAN.has(iso)) water.push('caribbean')
  if (PACIFIC.has(iso)) water.push('pacific')
  if (INDIAN.has(iso)) water.push('indian')
  if (ATLANTIC.has(iso)) water.push('atlantic')
  return water
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function factsFor(iso: string): FactClue[] {
  return [...(store().byIso.get(iso) ?? [])]
}

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function seedFrom(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function clueSequence(iso: string, count = FACTS_MAX, rng: () => number = Math.random): FactClue[] {
  const all = factsFor(iso)
  const region = all.find((clue) => clue.kind === 'region')
  const size = Math.max(1, count)
  const early = pickEarlyFacts(iso, all, rng)
  const used = new Set(early.map((clue) => clue.id))
  const slots: Array<FactClue | null> = Array.from({ length: size }, () => null)

  for (let i = 0; i < Math.min(EARLY_FACT_COUNT, size); i += 1) {
    if (early[i]) slots[i] = early[i]
  }
  if (size >= 5 && region) {
    slots[4] = region
    used.add(region.id)
  }

  const rest = all
    .filter((clue) => !used.has(clue.id) && clue.kind !== 'region')
    .map((clue) => ({ clue, jitter: rng() }))
    .sort((a, b) => a.clue.uniqueness - b.clue.uniqueness || a.jitter - b.jitter)
    .map((row) => row.clue)
  let restIndex = 0
  for (let i = 0; i < size; i += 1) {
    if (slots[i]) continue
    if (i < EARLY_FACT_COUNT) {
      const filler = nextThatKeeps(
        iso,
        early,
        rest,
        used,
        i === 3 ? FACTS_UNIQUENESS_MIN : EARLY_INTERSECTION_MIN,
        rng,
      )
      if (filler) {
        slots[i] = filler
        used.add(filler.id)
        early.push(filler)
      }
      continue
    }
    while (restIndex < rest.length && used.has(rest[restIndex].id)) restIndex += 1
    if (restIndex >= rest.length) break
    const next = rest[restIndex]
    slots[i] = next
    used.add(next.id)
    restIndex += 1
  }

  return slots.filter((clue): clue is FactClue => clue !== null)
}

function pickEarlyFacts(iso: string, all: FactClue[], rng: () => number): FactClue[] {
  const pool = sortByUniquenessDesc(
    all.filter((clue) => isEarlyKind(clue.kind) && clue.uniqueness >= EARLY_UNIQUENESS_MIN),
    rng,
  )
  const four =
    pickCombo(iso, pool, 4, EARLY_INTERSECTION_MIN, rng) ?? pickCombo(iso, pool, 4, FACTS_UNIQUENESS_MIN, rng)
  if (four) return sortByUniquenessDesc(four, rng)
  const fallback = sortByUniquenessDesc(
    all.filter((clue) => isEarlyKind(clue.kind)),
    rng,
  )
  const fourLoose =
    pickCombo(iso, fallback, 4, EARLY_INTERSECTION_MIN, rng) ??
    pickCombo(iso, fallback, 4, FACTS_UNIQUENESS_MIN, rng)
  if (fourLoose) return sortByUniquenessDesc(fourLoose, rng)
  const three =
    pickCombo(iso, fallback, 3, EARLY_INTERSECTION_MIN, rng) ??
    pickCombo(iso, fallback, 3, FACTS_UNIQUENESS_MIN, rng)
  if (three) return sortByUniquenessDesc(three, rng)
  const two = pickCombo(iso, fallback, 2, FACTS_UNIQUENESS_MIN, rng)
  if (two) return sortByUniquenessDesc(two, rng)
  return pool.slice(0, 1).filter((clue) => isosMatching(clue).has(iso))
}

function pickCombo(
  iso: string,
  pool: FactClue[],
  k: number,
  minIntersect: number,
  rng: () => number,
): FactClue[] | null {
  const found: FactClue[][] = []
  const acc: FactClue[] = []
  const walk = (start: number) => {
    if (acc.length === k) {
      if (new Set(acc.map(factFamily)).size !== acc.length) return
      const inter = intersectionIsos(acc)
      if (!inter.has(iso) || inter.size < minIntersect) return
      found.push([...acc])
      return
    }
    for (let i = start; i < pool.length; i += 1) {
      acc.push(pool[i])
      walk(i + 1)
      acc.pop()
    }
  }
  walk(0)
  if (found.length === 0) return null
  return found[Math.floor(rng() * found.length)] ?? found[0]
}

function nextThatKeeps(
  iso: string,
  picked: FactClue[],
  rest: FactClue[],
  used: Set<string>,
  minIntersect: number,
  rng: () => number,
): FactClue | null {
  const families = new Set(picked.map(factFamily))
  const options: FactClue[] = []
  for (const clue of rest) {
    if (used.has(clue.id) || !isEarlyKind(clue.kind) || families.has(factFamily(clue))) continue
    const inter = intersectionIsos([...picked, clue])
    if (inter.has(iso) && inter.size >= minIntersect) options.push(clue)
  }
  if (options.length === 0) return null
  return options[Math.floor(rng() * options.length)] ?? options[0]
}

function isEarlyKind(kind: FactKind): boolean {
  return kind !== 'region' && kind !== 'borders' && kind !== 'founded'
}

function factFamily(clue: FactClue): string {
  if (clue.kind === 'flagColor') return 'flagColor'
  if (clue.kind === 'flagMotif') return 'flagMotif'
  if (clue.kind === 'founded' || clue.kind === 'foundedEra') return 'founded'
  if (clue.kind === 'neighborBand') return 'neighbors'
  if (clue.kind === 'populationBand') return 'population'
  if (clue.kind === 'island' || clue.kind === 'landlocked') return 'access'
  if (clue.kind === 'language') return 'language'
  if (clue.kind === 'water') return 'water'
  return clue.kind
}

function sortByUniquenessDesc(clues: FactClue[], rng: () => number): FactClue[] {
  return clues
    .map((clue) => ({ clue, jitter: rng() }))
    .sort((a, b) => b.clue.uniqueness - a.clue.uniqueness || a.jitter - b.jitter)
    .map((row) => row.clue)
}
