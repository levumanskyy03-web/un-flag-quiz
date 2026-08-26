import { type Country } from '../data/countries'
import { foundedYear } from '../data/founded'
import { neighborKey } from '../data/neighbors'
import {
  PASSPORTS,
  formatPopulation,
  passportCapital,
  passportCurrency,
} from '../data/passports'
import type { Lang } from '../i18n/strings'
import { currencyChoiceLabel } from './currencyFakes'
import { foundedChoiceLabel } from './foundedFakes'
import { populationChoiceLabel } from './populationFakes'
import { countryName, type Question, type QuizMode } from './quiz'

export function answerKey(country: Country, mode: QuizMode): string {
  if (
    mode === 'flagToName' ||
    mode === 'nameToFlag' ||
    mode === 'nameToMap' ||
    mode === 'mapToName' ||
    mode === 'factsToName'
  ) {
    return country.iso
  }
  if (mode === 'neighborsToName') return `neighbors:${neighborKey(country.iso)}`
  if (mode === 'nameToFounded') return `founded:${foundedYear(country.iso) ?? country.iso}`
  const passport = PASSPORTS[country.iso]
  if (!passport) return country.iso
  if (mode === 'nameToCapital') return `capital:${passport.capitalEn}`
  if (mode === 'nameToCurrency') return `currency:${passport.currencyEn}`
  return `population:${passport.population}`
}

export function optionLabel(country: Country, mode: QuizMode, lang: Lang, question?: Question): string {
  if (
    mode === 'flagToName' ||
    mode === 'nameToFlag' ||
    mode === 'neighborsToName' ||
    mode === 'nameToMap' ||
    mode === 'mapToName' ||
    mode === 'factsToName'
  ) {
    return countryName(country, lang)
  }
  if (mode === 'nameToFounded') {
    if (!question) return String(foundedYear(country.iso) ?? '')
    return foundedChoiceLabel(
      country,
      lang,
      question.country,
      question.options.map((option) => option.iso),
    )
  }
  const passport = PASSPORTS[country.iso]
  if (!passport) return countryName(country, lang)
  if (mode === 'nameToCapital') return passportCapital(passport, lang)
  if (mode === 'nameToCurrency') {
    if (!question) return passportCurrency(passport, lang)
    return currencyChoiceLabel(
      country,
      lang,
      question.country,
      question.options.map((option) => option.iso),
    )
  }
  if (mode === 'nameToPopulation') {
    if (!question) return formatPopulation(passport.population, lang)
    return populationChoiceLabel(
      country,
      lang,
      question.country,
      question.options.map((option) => option.iso),
    )
  }
  return formatPopulation(passport.population, lang)
}
