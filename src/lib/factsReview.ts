import { COUNTRIES } from '../data/countries'
import {
  clueSequence,
  factsFor,
  intersectionIsos,
  mulberry32,
  seedFrom,
  type FactClue,
} from './countryFacts'
import { factLabel } from './factText'
import { countryName } from './quiz'

export interface FactReviewRow {
  n: number
  id: string
  kind: FactClue['kind']
  uniqueness: number
  ru: string
  en: string
  stillMatching: number
}

export interface CountryFactsReview {
  iso: string
  nameRu: string
  nameEn: string
  region: string
  bank: FactReviewRow[]
  sequence: FactReviewRow[]
  after4: number
  after5: number
  flags: string[]
}

export interface FactsReview {
  countries: CountryFactsReview[]
  problems: string[]
  totals: {
    countries: number
    after4TooTight: number
    after4Unique: number
    uniqueFacts: number
    minBank: number
    minSequence: number
  }
}

function rowsFor(clues: FactClue[], running: boolean): FactReviewRow[] {
  const prefix: FactClue[] = []
  return clues.map((clue, index) => {
    if (running) prefix.push(clue)
    const still = running ? intersectionIsos(prefix).size : clue.uniqueness
    return {
      n: index + 1,
      id: clue.id,
      kind: clue.kind,
      uniqueness: clue.uniqueness,
      ru: factLabel(clue, 'ru'),
      en: factLabel(clue, 'en'),
      stillMatching: still,
    }
  })
}

export function buildFactsReview(): FactsReview {
  const countries: CountryFactsReview[] = []
  const problems: string[] = []
  let after4TooTight = 0
  let after4Unique = 0
  let uniqueFacts = 0
  let minBank = Infinity
  let minSequence = Infinity

  for (const country of COUNTRIES) {
    const bank = factsFor(country.iso).sort((a, b) => b.uniqueness - a.uniqueness || a.id.localeCompare(b.id))
    const sequence = clueSequence(country.iso, 10, mulberry32(seedFrom(country.iso)))
    const seqRows = rowsFor(sequence, true)
    const after4 = seqRows[3]?.stillMatching ?? 0
    const after5 = seqRows[4]?.stillMatching ?? 0
    const flags: string[] = []
    if (bank.some((clue) => clue.uniqueness < 2)) {
      uniqueFacts += 1
      flags.push('unique-fact')
    }
    if (after4 < 3) {
      after4TooTight += 1
      flags.push('after4-tight')
    }
    if (after4 <= 1) {
      after4Unique += 1
      flags.push('after4-unique')
    }
    if (sequence.length < 5) flags.push('short-sequence')
    if (sequence[4]?.kind !== 'region') flags.push('fact5-not-region')
    minBank = Math.min(minBank, bank.length)
    minSequence = Math.min(minSequence, sequence.length)
    if (flags.length > 0) {
      problems.push(`${country.iso} ${countryName(country, 'ru')}: ${flags.join(', ')} (after4=${after4})`)
    }
    countries.push({
      iso: country.iso,
      nameRu: countryName(country, 'ru'),
      nameEn: countryName(country, 'en'),
      region: country.region,
      bank: rowsFor(bank, false),
      sequence: seqRows,
      after4,
      after5,
      flags,
    })
  }

  countries.sort((a, b) => a.nameRu.localeCompare(b.nameRu, 'ru'))
  return {
    countries,
    problems,
    totals: {
      countries: countries.length,
      after4TooTight,
      after4Unique,
      uniqueFacts,
      minBank: Number.isFinite(minBank) ? minBank : 0,
      minSequence: Number.isFinite(minSequence) ? minSequence : 0,
    },
  }
}
