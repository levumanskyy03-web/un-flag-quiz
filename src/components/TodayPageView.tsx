"use client";

import { CountryPassportView } from "./CountryPassportView";
import { LegalShell } from "./LegalShell";
import { PAGE_COPY } from "../i18n/pages";
import { useSiteLang } from "../i18n/siteLang";
import { countryOfTheDay, countryPath, utcDayLabel } from "../lib/countryCatalog";
import { countryName } from "../lib/quiz";

export function TodayPageView() {
  return (
    <LegalShell catalogBack>
      <TodayBody />
    </LegalShell>
  );
}

function TodayBody() {
  const { lang } = useSiteLang();
  const copy = PAGE_COPY[lang];
  const country = countryOfTheDay();
  const day = utcDayLabel();
  return (
    <>
      <CountryPassportView country={country} kicker={copy.todayKicker(day)} />
      <p>
        {copy.todayNext} <a href="/countries">{copy.todayCatalog}</a>, {copy.todayThisPage}{" "}
        <a href={countryPath(country.iso)}>{countryName(country, lang)}</a>.
      </p>
    </>
  );
}
