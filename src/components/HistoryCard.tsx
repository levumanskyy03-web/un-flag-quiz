import { useEffect, type ReactNode } from 'react'
import {
  asCountry,
  isHistoryId,
  polityById,
  polityCapital,
  polityCurrency,
  polityFact,
  polityFlagUrl,
  polityName,
  polityPassport,
  suzerainId,
} from '../data/history'
import type { DependentKind } from '../data/history/types'
import { findCountry } from '../data/extras'
import { formatPopulation } from '../data/passports'
import { languageName } from '../data/languages'
import { STRINGS, governmentLabel, regionLabel, type Lang } from '../i18n/strings'
import { commonsThumb, wikipediaUrl, type HistoryCards } from '../lib/historyCards'
import type { HistoryMapFeature } from '../lib/historyMap'
import { historyEntityName, placeName } from '../lib/historyNames'
import { countryName } from '../lib/quiz'
import { Flag } from './Flag'
import { FitText } from './FitText'

interface HistoryCardProps {
  id: string
  lang: Lang
  year?: number
  mapName?: string
  /** Raw id the map was clicked with (auto cards are keyed by it). */
  mapId?: string
  feature?: HistoryMapFeature
  cards?: HistoryCards | null
  onClose: () => void
  onOpen: (id: string) => void
}

function dependentKindLabel(kind: DependentKind | undefined, t: (typeof STRINGS)[Lang]) {
  if (kind === 'colony') return t.historyColony
  if (kind === 'protectorate') return t.historyProtectorate
  if (kind === 'viceroyalty') return t.historyViceroyalty
  if (kind === 'vassal') return t.historyVassal
  if (kind === 'company') return t.historyCompanyRule
  if (kind === 'personal_union') return t.historyPersonalUnion
  return t.historyDependent
}

function yearSpan(from: number | undefined, to: number | undefined) {
  if (from === undefined && to === undefined) return undefined
  if (from !== undefined && to !== undefined && from === to) return String(from)
  return `${from ?? '…'}–${to ?? '…'}`
}

function formatArea(km2: number, lang: Lang) {
  return `${new Intl.NumberFormat(lang).format(km2)} km²`
}

/** Flag thumb for any id a card links to; plain text when we have no flag source. */
function LinkFlag({ id, label, cards }: { id: string; label: string; cards?: HistoryCards | null }) {
  const file = cards?.meta[id]?.f ?? cards?.meta[id]?.e
  if (findCountry(id) || polityFlagUrl(id)) return <Flag iso={id} name={label} size="thumb" />
  if (file) {
    return (
      <span className="flag flag-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={commonsThumb(file, 80)} alt={label} className="flag-img" />
      </span>
    )
  }
  return null
}

export function HistoryCard({ id, lang, year, mapName, mapId, feature, cards, onClose, onOpen }: HistoryCardProps) {
  const t = STRINGS[lang]
  const polity = polityById(id)
  const passport = polityPassport(id)
  const autoId = feature?.id ?? mapId ?? id
  const meta = polity ? undefined : cards?.meta[autoId]
  const text = polity ? undefined : cards?.text[autoId]
  const mapYear = year ?? polity?.from ?? new Date().getFullYear()
  const name = polity
    ? (polityName(id, lang) ?? mapName ?? id)
    : historyEntityName(autoId, lang, mapYear, cards ?? null, mapName)
  const country = findCountry(id) ?? (polity ? asCountry(polity) : undefined)
  const flagSrc = polityFlagUrl(id)
  const autoFlag = meta?.f ?? meta?.e
  const langs = passport?.langs ?? []

  const parentId = polity ? suzerainId(polity, mapYear) : feature?.p
  const parentLabel = parentId ? historyEntityName(parentId, lang, mapYear, cards ?? null) : undefined

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  const successorIds = polity?.successors ?? meta?.suc ?? []
  const predecessorIds = meta?.pre ?? []

  const start = polity
    ? passport?.founded && passport.founded < polity.from
      ? passport.founded
      : polity.from
    : meta?.i
  const years = polity ? yearSpan(start, polity.to ?? undefined) : feature?.m ? undefined : yearSpan(meta?.i, meta?.d)
  const onMap = !polity && meta?.y ? yearSpan(meta.y[0], meta.y[1]) : undefined

  const status = polity
    ? polity.kind === 'de_facto'
      ? t.historyDeFacto
      : polity.kind === 'independent'
        ? t.historyIndependent
        : dependentKindLabel(polity.dependentKind, t)
    : feature?.k === 'd' || parentId
      ? t.historyDependent
      : feature?.k === 'x' || meta?.k === 'x'
        ? t.historyPeople
        : feature
          ? t.historyIndependent
          : t.historyNotIndependent

  const fields: { label: string; value: ReactNode }[] = []
  if (polity) fields.push({ label: t.region, value: regionLabel(polity.region, lang) })
  if (years) fields.push({ label: t.historyYears, value: years })
  if (onMap && onMap !== years) fields.push({ label: t.historyMapYears, value: onMap })
  const capital = polity ? polityCapital(id, lang) : feature?.m ? undefined : text?.c
  if (capital) fields.push({ label: t.capital, value: capital })
  if (polity && passport?.population !== undefined && passport.populationYear !== undefined) {
    fields.push({
      label: t.population,
      value: `${formatPopulation(passport.population, lang)} (${passport.populationYear})`,
    })
  } else if (!polity && !feature?.m && meta?.p !== undefined) {
    fields.push({
      label: t.population,
      value: meta.py !== undefined ? `${formatPopulation(meta.p, lang)} (${meta.py})` : formatPopulation(meta.p, lang),
    })
  }
  if (feature?.a) fields.push({ label: t.historyArea, value: `≈ ${formatArea(feature.a, lang)}` })
  const currency = polity ? polityCurrency(id, lang) : feature?.m ? undefined : text?.m
  if (currency) fields.push({ label: t.currency, value: currency })
  if (polity && passport?.gov) fields.push({ label: t.government, value: governmentLabel(passport.gov, lang) })
  else if (!polity && !feature?.m && text?.g) fields.push({ label: t.government, value: text.g })
  if (langs.length > 0) {
    fields.push({ label: t.nationalLanguage, value: langs.map((code: string) => languageName(code, lang)).join(', ') })
  } else if (!polity && !feature?.m && text?.l) {
    fields.push({ label: t.nationalLanguage, value: text.l })
  }
  if (!polity && !feature?.m && text?.r) fields.push({ label: t.historyReligion, value: text.r })

  const fact = polity ? polityFact(id, lang) : feature?.m ? undefined : text?.s
  const wiki = !polity && !feature?.m ? text?.w : undefined

  function linkList(title: string, ids: string[]) {
    const items = ids
      .filter((item, index) => item !== autoId && ids.indexOf(item) === index)
      .map((item) => {
        const hist = isHistoryId(item) ? polityById(item) : undefined
        const modern = findCountry(item)
        const label = modern
          ? countryName(modern, lang)
          : hist
            ? countryName(asCountry(hist), lang)
            : historyEntityName(item, lang, mapYear, cards ?? null)
        return { id: item, label }
      })
    if (items.length === 0) return null
    return (
      <section className="passport-neighbors">
        <h3>{title}</h3>
        <div className="passport-neighbors-list">
          {items.map((item) => (
            <button key={item.id} type="button" className="passport-neighbor" onClick={() => onOpen(item.id)}>
              <LinkFlag id={item.id} label={item.label} cards={cards} />
              <FitText>{item.label}</FitText>
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="passport-overlay" onClick={onClose} role="presentation">
      <div
        className="passport-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn-ghost passport-close" onClick={onClose}>
          {t.close}
        </button>
        {flagSrc ? (
          <Flag iso={country?.iso ?? id} name={name} size="hero" />
        ) : autoFlag ? (
          <span className="flag flag-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={commonsThumb(autoFlag, 480)} alt={name} className="flag-img" />
          </span>
        ) : null}
        <h2 id="history-title" className="passport-title">
          {name}
        </h2>
        <p className="passport-territory">
          <span className="passport-fact-label">{t.historyStatus}</span>
          {status}
        </p>
        {fields.length > 0 ? (
          <dl className="passport-fields">
            {fields.map((field) => (
              <div key={field.label}>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {parentId && parentLabel ? (
          <section className="passport-neighbors">
            <h3>{t.historySuzerain}</h3>
            <div className="passport-neighbors-list">
              <button type="button" className="passport-neighbor" onClick={() => onOpen(parentId)}>
                <LinkFlag id={parentId} label={parentLabel} cards={cards} />
                <FitText>{parentLabel}</FitText>
              </button>
            </div>
          </section>
        ) : null}
        {feature?.m ? (
          <section className="passport-neighbors">
            <h3>{t.historyModernPlace}</h3>
            <div className="passport-neighbors-list">
              <button type="button" className="passport-neighbor" onClick={() => onOpen(feature.m!)}>
                <Flag iso={feature.m} name={placeName(feature.m, lang)} size="thumb" />
                <FitText>{placeName(feature.m, lang)}</FitText>
              </button>
            </div>
          </section>
        ) : null}
        {linkList(t.historyPredecessors, predecessorIds)}
        {linkList(t.historySuccessors, successorIds)}
        {fact ? <p className="learn-copy">{fact}</p> : null}
        {wiki ? (
          <a className="history-card-link" href={wikipediaUrl(lang, wiki)} target="_blank" rel="noreferrer">
            {t.historyWiki}
          </a>
        ) : null}
      </div>
    </div>
  )
}
