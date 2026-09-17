"use client";

import { useEffect } from "react";
import { CountryPassportView } from "./CountryPassportView";
import { LegalShell } from "./LegalShell";
import { PAGE_COPY } from "../i18n/pages";
import { STRINGS } from "../i18n/strings";
import { useSiteLang } from "../i18n/siteLang";
import { countryOfTheDay, countryPath, utcDayLabel } from "../lib/countryCatalog";
import { trackFunnel } from "../lib/funnel";
import { siteUrl } from "../lib/site";
import { countryName } from "../lib/quiz";
import { ShareButton } from "./ShareButton";

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
  const t = STRINGS[lang];
  const country = countryOfTheDay();
  const day = utcDayLabel();
  const name = countryName(country, lang);
  const url = siteUrl("/today");
  useEffect(() => {
    const key = `pq-today-${utcDayLabel()}`;
    try {
      if (localStorage.getItem(key) === "1") return;
      localStorage.setItem(key, "1");
    } catch {
      /* still count this visit */
    }
    trackFunnel("today", { iso: country.iso });
  }, [country.iso]);
  return (
    <>
      <CountryPassportView country={country} kicker={copy.todayKicker(day)} />
      <p className="country-actions">
        <ShareButton lang={lang} className="btn-secondary country-share" url={url} text={t.shareToday(name, url)} />
      </p>
      <p>
        {copy.todayNext} <a href="/countries">{copy.todayCatalog}</a>, {copy.todayThisPage}{" "}
        <a href={countryPath(country.iso)}>{name}</a>.
      </p>
    </>
  );
}
