'use client'

import { collectionById, collectionPath, collectionPlayHref, collectionsOf, isQuizWorldId } from '../data/collections'
import { isListId } from '../data/lists'
import { footballClubName } from '../data/footballClubs'
import { termById, leaderDisplayName } from '../data/leaders'
import { mathById, mathDisplayName } from '../data/math'
import { astroById, astroDisplayName } from '../data/astro'
import { themeById, themeDisplayName } from '../data/theme'
import { PAGE_COPY } from '../i18n/pages'
import { STRINGS } from '../i18n/strings'
import { collectionCopyOf } from '../i18n/collectionCopy'
import { useSiteLang } from '../i18n/siteLang'
import type { Lang } from '../i18n/lang'
import { countryByIso, countryPath } from '../lib/countryCatalog'
import { countryName, QUIZ_WORLDS, type QuizWorld } from '../lib/quiz'
import { Flag } from './Flag'
import { LegalShell } from './LegalShell'

function worldTitle(world: QuizWorld, t: (typeof STRINGS)[Lang]) {
  if (world === 'geo') return t.geography
  if (world === 'leaders') return t.leaders
  if (world === 'football') return t.football
  if (world === 'olympics') return t.olympics
  if (world === 'biology') return t.biology
  if (world === 'math') return t.math
  if (world === 'astronomy') return t.astronomy
  if (world === 'cs') return t.cs
  return t.food
}

function itemLabel(world: QuizWorld, id: string, lang: Lang) {
  if (world === 'geo') {
    const country = countryByIso(id)
    return country ? countryName(country, lang) : id
  }
  if (world === 'football') {
    if (/^\d{4}$/.test(id)) return id
    return footballClubName(id, lang)
  }
  if (world === 'leaders') {
    const term = termById(id)
    return term ? leaderDisplayName(term, lang) : id
  }
  if (world === 'math') {
    const item = mathById(id)
    return item ? mathDisplayName(item, lang) : id
  }
  if (world === 'astronomy') {
    const item = astroById(id)
    return item ? astroDisplayName(item, lang) : id
  }
  const item = themeById(id)
  return item ? themeDisplayName(item, lang) : id
}

export function ListsIndex() {
  const { lang } = useSiteLang()
  const copy = PAGE_COPY[lang]
  const t = STRINGS[lang]

  return (
    <>
      <h1>{copy.listsTitle}</h1>
      <p>{copy.listsLead}</p>
      {QUIZ_WORLDS.map((world) => {
        const lists = collectionsOf(world)
        if (lists.length === 0) return null
        return (
          <section key={world} className="lists-world">
            <h2>{worldTitle(world, t)}</h2>
            <ul className="lists-index">
              {lists.map((list) => (
                <li key={list.id}>
                  <a href={collectionPath(world, list.id)}>
                    <span>{collectionCopyOf(list.id, lang).title}</span>
                    <span className="lang-index-count">{list.ids.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
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

export function SiteCollection({ world, id }: { world: QuizWorld; id: string }) {
  const { lang } = useSiteLang()
  const copy = PAGE_COPY[lang]
  const t = STRINGS[lang]
  const item = collectionCopyOf(id, lang)
  const list = collectionById(world, id)
  const ids = list?.ids ?? []
  const note = isListId(id) ? copy.listsCopy[id].note : null

  return (
    <>
      <p className="lists-kicker">
        <a href="/lists">{copy.listsTitle}</a>
        {' · '}
        {worldTitle(world, t)}
      </p>
      <h1>{item.title}</h1>
      <p>{item.lead}</p>
      {note ? <p>{note}</p> : null}
      {world === 'geo' ? (
        <div className="country-index">
          {ids
            .map((iso) => countryByIso(iso))
            .filter((country): country is NonNullable<typeof country> => Boolean(country))
            .sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), lang))
            .map((country) => {
              const name = countryName(country, lang)
              return (
                <a key={country.iso} className="country-index-item" href={countryPath(country.iso)}>
                  <Flag iso={country.iso} name={name} size="thumb" />
                  <span className="country-index-name">{name}</span>
                </a>
              )
            })}
        </div>
      ) : (
        <ul className="collection-items">
          {ids.map((entry) => (
            <li key={entry}>{itemLabel(world, entry, lang)}</li>
          ))}
        </ul>
      )}
      <p>
        <a className="country-play" href={collectionPlayHref(world, id)}>
          {copy.playQuiz}
        </a>
      </p>
    </>
  )
}

export function SiteCollectionPageView({ world, id }: { world: QuizWorld; id: string }) {
  return (
    <LegalShell>
      <SiteCollection world={world} id={id} />
    </LegalShell>
  )
}

export { isQuizWorldId }
