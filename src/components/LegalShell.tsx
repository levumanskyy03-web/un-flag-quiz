"use client";

import type { ReactNode } from "react";
import { STRINGS } from "../i18n/strings";
import { LanguageToggle } from "./LanguageToggle";
import { WorldsBackLink } from "./WorldsBack";
import { SiteLangProvider, useSiteLang } from "../i18n/siteLang";

interface LegalShellProps {
  title?: string;
  children: ReactNode;
  catalogBack?: boolean;
}

function LegalShellInner({ title, children, catalogBack = false }: LegalShellProps) {
  const { lang, setLang } = useSiteLang();
  const t = STRINGS[lang];
  return (
    <div className="app legal-app">
      <nav className="legal-nav">
        <div className="legal-nav-back">
          <WorldsBackLink lang={lang} />
          {catalogBack ? (
            <a className="btn-ghost worlds-back" href="/countries">
              {t.back}
            </a>
          ) : null}
        </div>
        <div className="legal-nav-links">
          <LanguageToggle lang={lang} onChange={setLang} />
          <a href="/countries">{t.legalCountries}</a>
          <a href="/languages">{t.legalLanguages}</a>
          <a href="/today">{t.legalToday}</a>
        </div>
      </nav>
      <article className="legal-article">
        {title ? <h1>{title}</h1> : null}
        {children}
      </article>
      <footer className="legal-footer">
        <nav className="legal-links">
          <a href="/about">{t.legalAbout}</a>
          <a href="/privacy">{t.legalPrivacy}</a>
          <a href="/contacts">{t.legalContacts}</a>
        </nav>
        <p className="credit">{t.credit}</p>
      </footer>
    </div>
  );
}

export function LegalShell(props: LegalShellProps) {
  return (
    <SiteLangProvider>
      <LegalShellInner {...props} />
    </SiteLangProvider>
  );
}
