import { foundedYear } from '../data/founded'
import { countryFacts } from '../data/facts'
import { landNeighbors } from '../data/neighbors'
import {
  formatPopulation,
  getPassport,
  passportCapital,
  passportCurrency,
  passportFact,
} from '../data/passports'
import { STRINGS, regionLabel } from '../i18n/strings'
import {
  adjacentCountries,
  countryPath,
  neighborCountries,
} from '../lib/countryCatalog'
import type { Country } from '../data/countries'
import { Flag } from './Flag'

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
  const mainFact = passportFact(passport, 'ru')
  const extras = countryFacts(country.iso)
    .map((fact) => fact.ru)
    .filter((text) => text !== mainFact)
    .slice(0, 4)
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
      </dl>
      <section className="passport-neighbors">
        <h2>{t.neighbors}</h2>
        {neighbors.length === 0 ? (
          <p className="passport-neighbors-empty">{t.noNeighbors}</p>
        ) : (
          <div className="passport-neighbors-list">
            {neighbors.map((neighbor) => (
              <a key={neighbor.iso} className="passport-neighbor" href={countryPath(neighbor.iso)}>
                <Flag iso={neighbor.iso} name={neighbor.nameRu} size="thumb" />
                <span>{neighbor.nameRu}</span>
              </a>
            ))}
          </div>
        )}
      </section>
      <p className="passport-fact">
        <span className="passport-fact-label">{t.fact}</span>
        {passportFact(passport, 'ru')}
      </p>
      {extras.length > 0 ? (
        <ul className="country-facts">
          {extras.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      ) : null}
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
