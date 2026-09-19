'use client'

import { MICROSTATE_ISOS, SITE_LISTS } from '../data/lists'
import { PAGE_COPY } from '../i18n/pages'
import { STRINGS } from '../i18n/strings'
import { useSiteLang } from '../i18n/siteLang'
import { countryByIso, countryPath } from '../lib/countryCatalog'
import { countryName } from '../lib/quiz'
import { Flag } from './Flag'
import { LegalShell } from './LegalShell'

export function ListsIndex() {
  const { lang } = useSiteLang()
  const copy = PAGE_COPY[lang]
  const t = STRINGS[lang]

  return (
    <>
      <h1>{copy.listsTitle}</h1>
      <p>{copy.listsLead}</p>
      <ul className="lists-index">
        {SITE_LISTS.map((list) => (
          <li key={list.id}>
            <a href={`/lists/${list.id}`}>
              <span>{copy.listsMicroTitle}</span>
              <span className="lang-index-count">{list.isos.length}</span>
            </a>
          </li>
        ))}
      </ul>
      <p>
        {copy.catalogToday} <a href="/today">{copy.catalogTodayLink}</a>.{' '}
        <a href="/countries">{t.legalCountries}</a>.
      </p>
    </>
  )
}

export function ListsPageView() {
  return (
    <LegalShell>
      <ListsIndex />
    </LegalShell>
  )
}

export function MicrostatesList() {
  const { lang } = useSiteLang()
  const copy = PAGE_COPY[lang]
  const countries = MICROSTATE_ISOS.map((iso) => countryByIso(iso)).filter(
    (country): country is NonNullable<typeof country> => Boolean(country),
  )

  return (
    <>
      <p className="lists-kicker">
        <a href="/lists">{copy.listsTitle}</a>
      </p>
      <h1>{copy.listsMicroTitle}</h1>
      <p>{copy.listsMicroLead}</p>
      <p>{copy.listsMicroNote}</p>
      <div className="country-index">
        {countries.map((country) => {
          const name = countryName(country, lang)
          return (
            <a key={country.iso} className="country-index-item" href={countryPath(country.iso)}>
              <Flag iso={country.iso} name={name} size="thumb" />
              <span className="country-index-name">{name}</span>
            </a>
          )
        })}
      </div>
      <p>
        <a className="country-play" href="/geo">
          {copy.playQuiz}
        </a>
      </p>
    </>
  )
}

export function MicrostatesPageView() {
  return (
    <LegalShell>
      <MicrostatesList />
    </LegalShell>
  )
}
