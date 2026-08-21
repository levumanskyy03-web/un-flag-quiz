import { type Country } from '../data/countries'
import { neighborKey } from '../data/neighbors'
import {
  PASSPORTS,
  formatPopulation,
  passportCapital,
  passportCurrency,
} from '../data/passports'
import type { Lang } from '../i18n/strings'
import { countryName, type QuizMode } from './quiz'

export function answerKey(country: Country, mode: QuizMode): string {
  if (mode === 'flagToName' || mode === 'nameToFlag' || mode === 'neighborsToName') {
    if (mode === 'neighborsToName') return `neighbors:${neighborKey(country.iso)}`
    return country.iso
  }
  const passport = PASSPORTS[country.iso]
  if (!passport) return country.iso
  if (mode === 'nameToCapital') return `capital:${passport.capitalEn}`
  if (mode === 'nameToCurrency') return `currency:${passport.currencyEn}`
  return `population:${passport.population}`
}

export function optionLabel(country: Country, mode: QuizMode, lang: Lang): string {
  if (mode === 'flagToName' || mode === 'nameToFlag' || mode === 'neighborsToName') {
    return countryName(country, lang)
  }
  const passport = PASSPORTS[country.iso]
  if (!passport) return countryName(country, lang)
  if (mode === 'nameToCapital') return passportCapital(passport, lang)
  if (mode === 'nameToCurrency') return passportCurrency(passport, lang)
  return formatPopulation(passport.population, lang)
}
