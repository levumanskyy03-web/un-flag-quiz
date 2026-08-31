import { type Country } from '../data/countries'
import { foundedYear } from '../data/founded'
import { neighborKey } from '../data/neighbors'
import {
  PASSPORTS,
  formatPopulation,
  passportCapital,
  passportCurrency,
} from '../data/passports'
import { languageName, quizLanguageId } from '../data/languages'
import type { Lang } from '../i18n/strings'
import { currencyChoiceLabel } from './currencyFakes'
import { foundedChoiceLabel } from './foundedFakes'
import { populationChoiceLabel } from './populationFakes'
import { isRankingMode } from '../data/rankings'
import { codeAnswerKey, codePromptLabel, countryName, isCodeOptionMode, isLeadersMode, isPlayerFootballMode, type Question, type QuizMode } from './quiz'
import { isWaterMode, waterAnswerKey } from '../data/water'

export function answerKey(country: Country, mode: QuizMode): string {
  if (
    mode === 'flagToName' ||
    mode === 'nameToFlag' ||
    mode === 'nameToMap' ||
    mode === 'mapToName' ||
    mode === 'factsToName' ||
    mode === 'wcWinners' ||
    mode === 'wcFinalists' ||
    mode === 'wcHosts' ||
    mode === 'euroWinners' ||
    mode === 'euroFinalists' ||
    mode === 'euroHosts' ||
    mode === 'wcScorers' ||
    mode === 'uclWinners' ||
    mode === 'copaWinners' ||
    mode === 'afconWinners' ||
    mode === 'tldToName' ||
    mode === 'callingToName' ||
    mode === 'carToName'
  ) {
    return country.iso
  }
  if (isRankingMode(mode)) return country.iso
  if (isLeadersMode(mode) || isPlayerFootballMode(mode)) return country.iso
  if (isWaterMode(mode)) return waterAnswerKey(country.iso, mode)
  if (mode === 'nameToTld' || mode === 'nameToCalling' || mode === 'nameToCar') {
    return codeAnswerKey(country, mode)
  }
  if (mode === 'neighborsToName') return `neighbors:${neighborKey(country.iso)}`
  if (mode === 'nameToFounded') return `founded:${foundedYear(country.iso) ?? country.iso}`
  const passport = PASSPORTS[country.iso]
  if (!passport) return country.iso
  if (mode === 'nameToCapital') return `capital:${passport.capitalEn}`
  if (mode === 'nameToCurrency') return `currency:${passport.currencyEn}`
  if (mode === 'nameToLanguage') return `lang:${quizLanguageId(country.iso) ?? country.iso}`
  return `population:${passport.population}`
}

export function optionLabel(country: Country, mode: QuizMode, lang: Lang, question?: Question): string {
  if (
    mode === 'flagToName' ||
    mode === 'nameToFlag' ||
    mode === 'neighborsToName' ||
    mode === 'nameToMap' ||
    mode === 'mapToName' ||
    mode === 'factsToName' ||
    mode === 'seaToName' ||
    mode === 'riverToName' ||
    mode === 'wcWinners' ||
    mode === 'wcFinalists' ||
    mode === 'wcHosts' ||
    mode === 'euroWinners' ||
    mode === 'euroFinalists' ||
    mode === 'euroHosts' ||
    mode === 'wcScorers' ||
    mode === 'uclWinners' ||
    mode === 'copaWinners' ||
    mode === 'afconWinners' ||
    mode === 'tldToName' ||
    mode === 'callingToName' ||
    mode === 'carToName'
  ) {
    return countryName(country, lang)
  }
  if (isRankingMode(mode)) return countryName(country, lang)
  if (isLeadersMode(mode) || isPlayerFootballMode(mode)) return countryName(country, lang)
  if (isCodeOptionMode(mode)) return codePromptLabel(country, mode)
  if (mode === 'nameToFounded') {
    if (!question) return String(foundedYear(country.iso) ?? '')
    return foundedChoiceLabel(
      country,
      lang,
      question.country,
      question.options.map((option) => option.iso),
      question.priorBan?.years,
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
      question.priorBan?.currencies,
    )
  }
  if (mode === 'nameToPopulation') {
    if (!question) return formatPopulation(passport.population, lang)
    return populationChoiceLabel(
      country,
      lang,
      question.country,
      question.options.map((option) => option.iso),
      question.priorBan?.populations,
    )
  }
  if (mode === 'nameToLanguage') {
    const id = quizLanguageId(country.iso)
    return id ? languageName(id, lang) : countryName(country, lang)
  }
  return formatPopulation(passport.population, lang)
}
