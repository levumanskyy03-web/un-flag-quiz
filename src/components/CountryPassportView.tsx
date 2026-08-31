import { foundedYear } from '../data/founded'
import { landNeighbors } from '../data/neighbors'
import {
  formatPopulation,
  getPassport,
  passportCapital,
  passportCurrency,
} from '../data/passports'
import { STRINGS, regionLabel } from '../i18n/strings'
import {
  adjacentCountries,
  countryPath,
  neighborCountries,
} from '../lib/countryCatalog'
import type { Country } from '../data/countries'
import { Flag } from './Flag'
import { FitText } from './FitText'
import { RankingPlaces } from './RankingPlaces'
import { PassportLanguages } from './PassportLanguages'
import { PassportRotatingFact } from './PassportRotatingFact'

interface CountryPassportViewProps {
  country: Country
  kicker?: string
}

export function CountryPassportView({ country, kicker }: CountryPassportViewProps) {
  const t = STRINGS.ru
  const passport = getPassport(country.iso)
  if (!passport) return null

  const founded = foundedYear(country.iso)
  const neighbors = neighborCountries(country.iso, landNeighbors(country.iso))
  const adjacent = adjacentCountries(country.iso)

  return (
    <div className="country-passport">
      {kicker ? <p className="country-kicker">{kicker}</p> : null}
      <Flag iso={country.iso} name={country.nameRu} size="hero" />
      <h1 className="country-title">{country.nameRu}</h1>
      <p className="country-title-en">{country.nameEn}</p>
      <dl className="passport-fields">
        <div>
          <dt>{t.region}</dt>
          <dd>{regionLabel(country.region, 'ru')}</dd>
        </div>
        <div>
          <dt>{t.capital}</dt>
          <dd>
            {passportCapital(passport, 'ru')}
            <span className="country-en"> · {passportCapital(passport, 'en')}</span>
          </dd>
        </div>
        <div>
          <dt>{t.population}</dt>
          <dd>{formatPopulation(passport.population, 'ru')}</dd>
        </div>
        <div>
          <dt>{t.currency}</dt>
          <dd>
            {passportCurrency(passport, 'ru')}
            <span className="country-en"> · {passportCurrency(passport, 'en')}</span>
          </dd>
        </div>
        {founded !== undefined ? (
          <div>
            <dt>{t.founded}</dt>
            <dd>{founded}</dd>
          </div>
        ) : null}
        <PassportLanguages iso={country.iso} lang="ru" />
      </dl>
      <RankingPlaces iso={country.iso} lang="ru" linkToPages />
      <section className="passport-neighbors">
        <h2>{t.neighbors}</h2>
        {neighbors.length === 0 ? (
          <p className="passport-neighbors-empty">{t.noNeighbors}</p>
        ) : (
          <div className="passport-neighbors-list">
            {neighbors.map((neighbor) => (
              <a key={neighbor.iso} className="passport-neighbor" href={countryPath(neighbor.iso)}>
                <Flag iso={neighbor.iso} name={neighbor.nameRu} size="thumb" />
                <FitText>{neighbor.nameRu}</FitText>
              </a>
            ))}
          </div>
        )}
      </section>
      <PassportRotatingFact
        iso={country.iso}
        lang="ru"
        fallback={{ en: passport.factEn, ru: passport.factRu }}
      />
      <p className="country-actions">
        <a className="btn-primary country-play" href="/">
          Играть в викторину
        </a>
      </p>
      {adjacent ? (
        <nav className="country-adjacent">
          <a href={countryPath(adjacent.prev.iso)}>← {adjacent.prev.nameRu}</a>
          <a href="/countries">Все страны</a>
          <a href={countryPath(adjacent.next.iso)}>{adjacent.next.nameRu} →</a>
        </nav>
      ) : null}
    </div>
  )
}
