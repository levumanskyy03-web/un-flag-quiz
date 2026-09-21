'use client'

import type { ListId } from '../data/lists'
import { SITE_LISTS, listById } from '../data/lists'
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
              <span>{copy.listsCopy[list.id].title}</span>
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

export function SiteList({ id }: { id: ListId }) {
  const { lang } = useSiteLang()
  const copy = PAGE_COPY[lang]
  const item = copy.listsCopy[id]
  const list = listById(id)
  const countries = (list?.isos ?? [])
    .map((iso) => countryByIso(iso))
    .filter((country): country is NonNullable<typeof country> => Boolean(country))
    .sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), lang))

  return (
    <>
      <p className="lists-kicker">
        <a href="/lists">{copy.listsTitle}</a>
      </p>
      <h1>{item.title}</h1>
      <p>{item.lead}</p>
      <p>{item.note}</p>
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

export function SiteListPageView({ id }: { id: ListId }) {
  return (
    <LegalShell>
      <SiteList id={id} />
    </LegalShell>
  )
}
