"use client";

import { foundedYear } from "../data/founded";
import { landNeighbors } from "../data/neighbors";
import {
  formatPopulation,
  getPassport,
  passportCapital,
  passportCurrency,
} from "../data/passports";
import { PAGE_COPY } from "../i18n/pages";
import { STRINGS, regionLabel } from "../i18n/strings";
import { useSiteLang } from "../i18n/siteLang";
import { adjacentCountries, countryPath, neighborCountries } from "../lib/countryCatalog";
import { countryName } from "../lib/quiz";
import type { Country } from "../data/countries";
import { Flag } from "./Flag";
import { FitText } from "./FitText";
import { RankingPlaces } from "./RankingPlaces";
import { PassportLanguages } from "./PassportLanguages";
import { PassportRotatingFact } from "./PassportRotatingFact";

interface CountryPassportViewProps {
  country: Country;
  kicker?: string;
}

export function CountryPassportView({ country, kicker }: CountryPassportViewProps) {
  const { lang } = useSiteLang();
  const t = STRINGS[lang];
  const copy = PAGE_COPY[lang];
  const passport = getPassport(country.iso);
  if (!passport) return null;

  const name = countryName(country, lang);
  const founded = foundedYear(country.iso);
  const neighbors = neighborCountries(country.iso, landNeighbors(country.iso));
  const adjacent = adjacentCountries(country.iso);

  return (
    <div className="country-passport">
      {kicker ? <p className="country-kicker">{kicker}</p> : null}
      <Flag iso={country.iso} name={name} size="hero" />
      <h1 className="country-title">{name}</h1>
      {lang !== "en" ? <p className="country-title-en">{country.nameEn}</p> : null}
      <dl className="passport-fields">
        <div>
          <dt>{t.region}</dt>
          <dd>{regionLabel(country.region, lang)}</dd>
        </div>
        <div>
          <dt>{t.capital}</dt>
          <dd>{passportCapital(passport, lang, country.iso)}</dd>
        </div>
        <div>
          <dt>{t.population}</dt>
          <dd>{formatPopulation(passport.population, lang)}</dd>
        </div>
        <div>
          <dt>{t.currency}</dt>
          <dd>{passportCurrency(passport, lang, country.iso)}</dd>
        </div>
        {founded !== undefined ? (
          <div>
            <dt>{t.founded}</dt>
            <dd>{founded}</dd>
          </div>
        ) : null}
        <PassportLanguages iso={country.iso} lang={lang} />
      </dl>
      <RankingPlaces iso={country.iso} lang={lang} linkToPages />
      <section className="passport-neighbors">
        <h2>{t.neighbors}</h2>
        {neighbors.length === 0 ? (
          <p className="passport-neighbors-empty">{t.noNeighbors}</p>
        ) : (
          <div className="passport-neighbors-list">
            {neighbors.map((neighbor) => {
              const neighborName = countryName(neighbor, lang);
              return (
                <a key={neighbor.iso} className="passport-neighbor" href={countryPath(neighbor.iso)}>
                  <Flag iso={neighbor.iso} name={neighborName} size="thumb" />
                  <FitText>{neighborName}</FitText>
                </a>
              );
            })}
          </div>
        )}
      </section>
      <PassportRotatingFact
        iso={country.iso}
        lang={lang}
        fallback={{ en: passport.factEn, ru: passport.factRu }}
      />
      <p className="country-actions">
        <a className="btn-primary country-play" href="/">
          {copy.playQuiz}
        </a>
      </p>
      {adjacent ? (
        <nav className="country-adjacent">
          <a href={countryPath(adjacent.prev.iso)}>← {countryName(adjacent.prev, lang)}</a>
          <a href="/countries">{copy.allCountries}</a>
          <a href={countryPath(adjacent.next.iso)}>{countryName(adjacent.next, lang)} →</a>
        </nav>
      ) : null}
    </div>
  );
}
