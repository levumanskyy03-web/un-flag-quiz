import { type Country } from '../data/countries'
import { foundedYear } from '../data/founded'
import { polityById, polityCapital } from '../data/history'
import { neighborKey } from '../data/neighbors'
import {
  PASSPORTS,
  formatPopulation,
  passportCapital,
  passportCurrency,
} from '../data/passports'
import { languageName, quizLanguageId } from '../data/languages'
import { govKindOf } from '../data/governments'
import { drivingSide } from '../data/driving'
import { drivingLabel, governmentLabel, type Lang } from '../i18n/strings'
import { currencyChoiceLabel } from './currencyFakes'
import { foundedChoiceLabel } from './foundedFakes'
import { populationChoiceLabel } from './populationFakes'
import { isRankingMode } from '../data/rankings'
import {
  codeAnswerKey,
  codePromptLabel,
  countryName,
  isCodesMode,
  isCodeOptionMode,
  isFootballMode,
  isLeadersMode,
  isMathMode,
  isAstroMode,
  isThemeMode,
  isPlayerFootballMode,
  astroItemFromCountry,
  astroOptionLabel,
  themeItemFromCountry,
  themeOptionLabel,
  mathItemFromCountry,
  mathOptionLabel,
  type Question,
  type QuizMode,
} from './quiz'
import { isWaterMode, waterAnswerKey } from '../data/water'

function foundingYearOf(iso: string) {
  return foundedYear(iso) ?? polityById(iso)?.from
}

export function answerKey(country: Country, mode: QuizMode): string {
  if (isAstroMode(mode) || isThemeMode(mode) || isFootballMode(mode) || isRankingMode(mode) || isLeadersMode(mode) || isMathMode(mode) || isPlayerFootballMode(mode)) {
    return country.iso
  }
  if (isWaterMode(mode)) return waterAnswerKey(country.iso, mode)
  if (isCodesMode(mode)) return codeAnswerKey(country, mode)
  if (mode === 'neighborsToName') return `neighbors:${neighborKey(country.iso)}`
  if (mode === 'nameToFounded') return `founded:${foundingYearOf(country.iso) ?? country.iso}`
  if (mode === 'nameToCapital') {
    const historical = polityById(country.iso)
    if (historical?.capital?.en) return `capital:${historical.capital.en}`
  }
  if (mode === 'nameToGov') return `gov:${govKindOf(country.iso) ?? country.iso}`
  if (mode === 'nameToDriving') return `drive:${drivingSide(country.iso)}`
  if (mode === 'languageToName' || mode === 'drivingToName' || mode === 'silhouetteToName' || mode === 'nameToSilhouette') {
    return country.iso
  }
  const passport = PASSPORTS[country.iso]
  if (!passport) return country.iso
  if (mode === 'nameToCapital') return `capital:${passport.capitalEn}`
  if (mode === 'nameToCurrency') return `currency:${passport.currencyEn}`
  if (mode === 'nameToLanguage') return `lang:${quizLanguageId(country.iso) ?? country.iso}`
  return `population:${passport.population}`
}

export function optionLabel(country: Country, mode: QuizMode, lang: Lang, question?: Question): string {
  if (isMathMode(mode)) {
    const item = mathItemFromCountry(country, mode)
    return mathOptionLabel(item, lang)
  }
  if (isAstroMode(mode)) {
    const item = astroItemFromCountry(country, mode)
    return astroOptionLabel(item, lang)
  }
  if (isThemeMode(mode)) {
    const item = themeItemFromCountry(country, mode)
    return themeOptionLabel(item, lang)
  }
  if (isFootballMode(mode) || isRankingMode(mode) || isLeadersMode(mode) || isPlayerFootballMode(mode)) {
    return countryName(country, lang)
  }
  if (isCodeOptionMode(mode)) return codePromptLabel(country, mode)
  if (mode === 'nameToFounded') {
    if (!question) return String(foundingYearOf(country.iso) ?? '')
    return foundedChoiceLabel(
      country,
      lang,
      question.country,
      question.options.map((option) => option.iso),
      question.priorBan?.years,
    )
  }
  if (mode === 'nameToCapital') {
    const historical = polityCapital(country.iso, lang)
    if (historical) return historical
  }
  if (mode === 'nameToGov') {
    const kind = govKindOf(country.iso)
    return kind ? governmentLabel(kind, lang) : countryName(country, lang)
  }
  if (mode === 'nameToDriving') return drivingLabel(drivingSide(country.iso), lang)
  const passport = PASSPORTS[country.iso]
  if (!passport) return countryName(country, lang)
  if (mode === 'nameToCapital') return passportCapital(passport, lang, country.iso)
  if (mode === 'nameToCurrency') {
    if (!question) return passportCurrency(passport, lang, country.iso)
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
  return countryName(country, lang)
}
