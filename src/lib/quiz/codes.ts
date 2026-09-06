import { COUNTRY_CODES, formatCalling, formatCar, formatTld } from '../../data/countryCodes'
import { countriesForPool } from '../../data/extras'
import {
  pickDistractors,
  QUESTIONS_PER_ROUND,
  shuffle,
  type CodesMode,
  type Country,
  type Question,
  type QuizMode,
} from './core'

export function createCodesRound(
  mode: CodesMode,
  count = QUESTIONS_PER_ROUND,
  includeExtras = false,
): Question[] {
  const pool = countriesForPool(includeExtras).filter((country) => COUNTRY_CODES[country.iso])
  const targets = shuffle(pool).slice(0, Math.min(count, pool.length))
  const questions: Question[] = []
  const avoidKeys: string[] = []
  for (const country of targets) {
    questions.push({
      country,
      mode,
      options: shuffle([
        country,
        ...pickDistractors(country, pool, 3, (item) => codeAnswerKey(item, mode), avoidKeys),
      ]),
    })
    avoidKeys.push(codeAnswerKey(country, mode))
  }
  return questions
}

export function codeAnswerKey(country: Country, mode: QuizMode): string {
  const codes = COUNTRY_CODES[country.iso]
  if (!codes) return country.iso
  if (mode === 'tldToName' || mode === 'nameToTld') return `tld:${codes.tld}`
  if (mode === 'callingToName' || mode === 'nameToCalling') return `call:${codes.calling}`
  if (mode === 'carToName' || mode === 'nameToCar') return `car:${codes.car}`
  return country.iso
}

export function codePromptLabel(country: Country, mode: QuizMode): string {
  if (mode === 'tldToName' || mode === 'nameToTld') return formatTld(country.iso)
  if (mode === 'callingToName' || mode === 'nameToCalling') return formatCalling(country.iso)
  if (mode === 'carToName' || mode === 'nameToCar') return formatCar(country.iso)
  return country.iso
}
