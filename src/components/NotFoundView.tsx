"use client";

import { PAGE_COPY } from "../i18n/pages";
import { useSiteLang } from "../i18n/siteLang";
import { LegalShell } from "./LegalShell";

export function NotFoundPageView() {
  const { lang } = useSiteLang();
  const copy = PAGE_COPY[lang];
  return (
    <LegalShell>
      <h1>{copy.notFoundTitle}</h1>
      <p>{copy.notFoundLead}</p>
      <p>
        <a href="/">{copy.notFoundHome}</a>
      </p>
    </LegalShell>
  );
}
