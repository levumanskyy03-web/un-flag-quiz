"use client";

import { languageName, languagePath, languagesIndex } from "../data/languages";
import { PAGE_COPY } from "../i18n/pages";
import { useSiteLang } from "../i18n/siteLang";
import { LegalShell } from "./LegalShell";

export function LanguagesIndex() {
  const { lang } = useSiteLang();
  const copy = PAGE_COPY[lang];
  const items = languagesIndex(lang);

  return (
    <>
      <h1>{copy.languagesTitle}</h1>
      <p>{copy.languagesLead}</p>
      <ul className="lang-index">
        {items.map((item) => (
          <li key={item.id}>
            <a href={languagePath(item.id)}>
              <span>{languageName(item.id, lang)}</span>
              <span className="lang-index-count">{item.countries.length}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export function LanguagesPageView() {
  return (
    <LegalShell>
      <LanguagesIndex />
    </LegalShell>
  );
}
