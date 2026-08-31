import { ALL_COUNTRIES, findCountry } from '../data/extras'
import { type Country } from '../data/countries'
import type { FlagColor, FlagMotif } from '../data/flagTraits'
import { type Lang } from '../i18n/lang'
import { STRINGS, regionLabel } from '../i18n/strings'
import type { FactClue, FoundedEra, NeighborBand, PopulationBand } from './countryFacts'
import { playerFactLabel, type PlayerFactClue } from './playerFacts'
import { countryName } from './quiz'

export function isPlayerFactClue(clue: FactClue | PlayerFactClue): clue is PlayerFactClue {
  return clue.kind.startsWith('player')
}

export function anyFactLabel(clue: FactClue | PlayerFactClue, lang: Lang): string {
  return isPlayerFactClue(clue) ? playerFactLabel(clue, lang) : factLabel(clue, lang)
}

export function factLabel(clue: FactClue, lang: Lang): string {
  const t = STRINGS[lang]
  switch (clue.kind) {
    case 'region':
      return t.factRegionClue(clue.region ? regionLabel(clue.region, lang) : t.region)
    case 'flagColor':
      return t.factFlagColor(flagColorLabel(clue.color, lang))
    case 'flagMotif':
      return flagMotifLabel(clue.motif, lang)
    case 'currency':
      return t.factCurrency(lang === 'ru' ? clue.currencyRu ?? clue.currencyEn ?? '' : clue.currencyEn ?? '')
    case 'island':
      return t.factNoLandBorders
    case 'landlocked':
      return t.factLandlocked
    case 'neighborBand':
      return neighborBandLabel(clue.neighborBand, lang)
    case 'borders': {
      const neighbor = findCountry(clue.neighborIso ?? '')
      return t.factBorders(neighbor ? countryName(neighbor, lang) : clue.neighborIso ?? '')
    }
    case 'founded':
      return t.factFoundedYear(clue.year ?? 0)
    case 'foundedEra':
      return foundedEraLabel(clue.era, lang)
    case 'populationBand':
      return populationBandLabel(clue.populationBand, lang)
    case 'drivesLeft':
      return t.factDrivesLeft
    case 'hemisphere':
      return t.factSouthernHemisphere
    case 'language':
      return languageLabel(clue.language, lang)
    case 'nato':
      return t.factNato
    case 'monarchy':
      return t.factMonarchy
    case 'federal':
      return t.factFederal
    case 'water':
      return waterLabel(clue.water, lang)
  }
}

function populationBandLabel(band: PopulationBand | undefined, lang: Lang): string {
  const t = STRINGS[lang]
  if (band === 'tiny') return t.factPopTiny
  if (band === 'small') return t.factPopSmall
  if (band === 'medium') return t.factPopMedium
  if (band === 'large') return t.factPopLarge
  return t.factPopHuge
}

function foundedEraLabel(era: FoundedEra | undefined, lang: Lang): string {
  const t = STRINGS[lang]
  if (era === 'pre1800') return t.factFoundedPre1800
  if (era === 'y1800') return t.factFounded1800s
  if (era === 'y1900') return t.factFounded1900
  if (era === 'y1945') return t.factFounded1945
  return t.factFounded1970
}

function neighborBandLabel(band: NeighborBand | undefined, lang: Lang): string {
  const t = STRINGS[lang]
  if (band === 'n1') return t.factNeighbors1
  if (band === 'n2') return t.factNeighbors2to3
  if (band === 'n4') return t.factNeighbors4to6
  return t.factNeighbors7plus
}

function languageLabel(language: FactClue['language'], lang: Lang): string {
  const t = STRINGS[lang]
  if (language === 'fr') return t.factLangFr
  if (language === 'es') return t.factLangEs
  if (language === 'ar') return t.factLangAr
  if (language === 'pt') return t.factLangPt
  return t.factLangEn
}

function waterLabel(water: FactClue['water'], lang: Lang): string {
  const t = STRINGS[lang]
  if (water === 'pacific') return t.factWaterPacific
  if (water === 'indian') return t.factWaterIndian
  if (water === 'mediterranean') return t.factWaterMediterranean
  if (water === 'blackSea') return t.factWaterBlackSea
  if (water === 'baltic') return t.factWaterBaltic
  if (water === 'caribbean') return t.factWaterCaribbean
  return t.factWaterAtlantic
}

function flagColorLabel(color: FlagColor | undefined, lang: Lang): string {
  const t = STRINGS[lang]
  if (color === 'red') return t.flagColorRed
  if (color === 'blue') return t.flagColorBlue
  if (color === 'green') return t.flagColorGreen
  if (color === 'yellow') return t.flagColorYellow
  if (color === 'black') return t.flagColorBlack
  if (color === 'orange') return t.flagColorOrange
  return t.flagColorWhite
}

function flagMotifLabel(motif: FlagMotif | undefined, lang: Lang): string {
  const t = STRINGS[lang]
  if (motif === 'horizontal') return t.factFlagHorizontal
  if (motif === 'vertical') return t.factFlagVertical
  if (motif === 'diagonal') return t.factFlagDiagonal
  if (motif === 'canton') return t.factFlagCanton
  if (motif === 'nordic') return t.factFlagNordic
  if (motif === 'cross') return t.factFlagCross
  if (motif === 'saltire') return t.factFlagSaltire
  if (motif === 'triangle') return t.factFlagTriangle
  if (motif === 'star') return t.factFlagStar
  if (motif === 'crescent') return t.factFlagCrescent
  if (motif === 'disc') return t.factFlagDisc
  return t.factFlagUnionJack
}

export function searchCountries(query: string, lang: Lang, limit = 8): Country[] {
  const needle = query.trim().toLowerCase()
  if (needle.length === 0) return []
  const scored: Array<{ country: Country; score: number }> = []
  for (const country of ALL_COUNTRIES) {
    const names = [country.nameEn, country.nameRu, countryName(country, lang)]
    let score = 0
    for (const name of names) {
      const lower = name.toLowerCase()
      if (lower.startsWith(needle)) score = Math.max(score, 3)
      else if (lower.split(/[\s'-]+/).some((word) => word.startsWith(needle))) score = Math.max(score, 2)
      else if (initials(lower).startsWith(needle.replace(/\s+/g, ''))) score = Math.max(score, 1)
    }
    if (score > 0) scored.push({ country, score })
  }
  scored.sort((a, b) => b.score - a.score || countryName(a.country, lang).localeCompare(countryName(b.country, lang)))
  const seen = new Set<string>()
  const next: Country[] = []
  for (const row of scored) {
    if (seen.has(row.country.iso)) continue
    seen.add(row.country.iso)
    next.push(row.country)
    if (next.length >= limit) break
  }
  return next
}

function initials(name: string): string {
  return name
    .split(/[\s'-]+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
}
