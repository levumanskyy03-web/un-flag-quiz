import { COUNTRY_CODES, formatCalling, formatCar, formatTld } from '../../data/countryCodes'
import { type Country, type QuizMode } from './core'

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
