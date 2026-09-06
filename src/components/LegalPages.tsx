"use client";

import { PAGE_COPY } from "../i18n/pages";
import { useSiteLang } from "../i18n/siteLang";
import { LegalShell } from "./LegalShell";

export function AboutView() {
  const { lang } = useSiteLang();
  const copy = PAGE_COPY[lang];
  return (
    <>
      <h1>{copy.aboutTitle}</h1>
      {copy.about.map((paragraph) => (
        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
      ))}
    </>
  );
}

export function AboutPageView() {
  return (
    <LegalShell>
      <AboutView />
    </LegalShell>
  );
}

export function PrivacyView() {
  const { lang } = useSiteLang();
  const copy = PAGE_COPY[lang];
  return (
    <>
      <h1>{copy.privacyTitle}</h1>
      <p>{copy.privacyLead}</p>
      <h2>{copy.privacyStoredTitle}</h2>
      <ul>
        {copy.privacyStored.map((item) => (
          <li key={item.slice(0, 24)}>{item}</li>
        ))}
      </ul>
      <h2>{copy.privacyCookiesTitle}</h2>
      {copy.privacyCookies.map((item) => (
        <p key={item.slice(0, 32)}>{item}</p>
      ))}
      <h2>{copy.privacyBrowserTitle}</h2>
      <p>{copy.privacyBrowser}</p>
      <h2>{copy.privacyWhyTitle}</h2>
      <p>{copy.privacyWhy}</p>
      <h2>{copy.privacyDeleteTitle}</h2>
      <p>{copy.privacyDelete}</p>
    </>
  );
}

export function PrivacyPageView() {
  return (
    <LegalShell>
      <PrivacyView />
    </LegalShell>
  );
}

export function ContactsView() {
  const { lang } = useSiteLang();
  const copy = PAGE_COPY[lang];
  return (
    <>
      <h1>{copy.contactsTitle}</h1>
      <p>{copy.contactsLead}</p>
      <p>
        <a href="mailto:levumanskyy03@gmail.com">levumanskyy03@gmail.com</a>
      </p>
      <p>{copy.contactsAuthor}</p>
    </>
  );
}

export function ContactsPageView() {
  return (
    <LegalShell>
      <ContactsView />
    </LegalShell>
  );
}
