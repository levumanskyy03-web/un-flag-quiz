"use client";

import { Flag } from "./Flag";
import { LanguageRangeMap } from "./LanguageRangeMap";
import { LegalShell } from "./LegalShell";
import {
  countriesSpeaking,
  formatSpokenPct,
  languageById,
  languageName,
  officialLanguageIds,
  spokenShare,
} from "../data/languages";
import { PAGE_COPY } from "../i18n/pages";
import { useSiteLang } from "../i18n/siteLang";
import { countryPath } from "../lib/countryCatalog";
import { countryName } from "../lib/quiz";

export function LanguageDetail({ id }: { id: string }) {
  const { lang } = useSiteLang();
  const copy = PAGE_COPY[lang];
  const info = languageById(id);
  const countries = countriesSpeaking(id);
  if (!info || countries.length === 0) return null;
  const name = languageName(id, lang);

  return (
    <div className="language-page">
      <p className="country-kicker">
        <a href="/languages">{copy.languagesTitle}</a>
      </p>
      <h1 className="country-title">{name}</h1>
      {lang !== "en" ? <p className="country-title-en">{info.nameEn}</p> : null}
      <LanguageRangeMap isos={countries.map((country) => country.iso)} label={copy.languageRange(name)} />
      <section className="language-countries">
        <h2>{copy.languageCountries}</h2>
        <ul className="lang-card-list is-countries">
          {countries.map((country) => {
            const national = officialLanguageIds(country.iso).includes(id);
            const pct = spokenShare(country.iso, id);
            const label = countryName(country, lang);
            return (
              <li key={country.iso}>
                <a className={`lang-card${national ? " is-national" : ""}`} href={countryPath(country.iso)}>
                  <Flag iso={country.iso} name={label} size="thumb" />
                  <span className="lang-card-name">{label}</span>
                  <span className="lang-card-pct">{formatSpokenPct(pct, lang)}</span>
                  {national ? <span className="lang-card-mark">{copy.nationalShort}</span> : null}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export function LanguagePageView({ id }: { id: string }) {
  return (
    <LegalShell>
      <LanguageDetail id={id} />
    </LegalShell>
  );
}
