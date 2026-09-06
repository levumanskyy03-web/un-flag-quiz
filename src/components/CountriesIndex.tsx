"use client";

import { Flag } from "./Flag";
import { PAGE_COPY } from "../i18n/pages";
import { regionLabel } from "../i18n/strings";
import { useSiteLang } from "../i18n/siteLang";
import { catalogByRegion, countryPath } from "../lib/countryCatalog";
import { COUNTRIES } from "../data/countries";
import { countryName } from "../lib/quiz";
import { LegalShell } from "./LegalShell";

export function CountriesIndex() {
  const { lang } = useSiteLang();
  const copy = PAGE_COPY[lang];
  const groups = catalogByRegion();

  return (
    <>
      <h1>{copy.catalogTitle}</h1>
      <p>{copy.catalogLead(COUNTRIES.length)}</p>
      <p>
        {copy.catalogToday} <a href="/today">{copy.catalogTodayLink}</a>.
      </p>
      {groups.map(({ region, countries }) => (
        <section key={region} className="country-region">
          <h2>{regionLabel(region, lang)}</h2>
          <div className="country-index">
            {countries.map((country) => {
              const name = countryName(country, lang);
              return (
                <a key={country.iso} className="country-index-item" href={countryPath(country.iso)}>
                  <Flag iso={country.iso} name={name} size="thumb" />
                  <span className="country-index-name">{name}</span>
                </a>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

export function CountriesPageView() {
  return (
    <LegalShell>
      <CountriesIndex />
    </LegalShell>
  );
}
