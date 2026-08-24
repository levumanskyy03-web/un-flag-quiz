import { useEffect, useState } from 'react'
import { COUNTRIES, type Country } from '../data/countries'
import { foundedYear } from '../data/founded'
import { landNeighbors } from '../data/neighbors'
import { factText, pickFactIndex } from '../data/facts'
import {
  formatPopulation,
  getPassport,
  passportCapital,
  passportCurrency,
} from '../data/passports'
import { STRINGS, localeTag, regionLabel, type Lang } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import { Flag } from './Flag'

interface PassportModalProps {
  country: Country
  lang: Lang
  territoryNote?: string
  disputeNote?: string
  onClose: () => void
  onOpenCountry: (iso: string) => void
}

export function PassportModal({ country, lang, territoryNote, disputeNote, onClose, onOpenCountry }: PassportModalProps) {
  const t = STRINGS[lang]
  const passport = getPassport(country.iso)
  const name = countryName(country, lang)
  const founded = foundedYear(country.iso)
  const neighbors = landNeighbors(country.iso)
    .map((iso) => COUNTRIES.find((item) => item.iso === iso))
    .filter((item): item is Country => item !== undefined)
    .sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), localeTag(lang)))
  const [factKey, setFactKey] = useState(country.iso)
  const [factIndex, setFactIndex] = useState(() => pickFactIndex(country.iso))
  if (factKey !== country.iso) {
    setFactKey(country.iso)
    setFactIndex(pickFactIndex(country.iso))
  }

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

  if (!passport) return null

  return (
    <div className="passport-overlay" onClick={onClose} role="presentation">
      <div
        className="passport-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="passport-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn-ghost passport-close" onClick={onClose}>
          {t.close}
        </button>
        <Flag iso={country.iso} name={name} size="hero" />
        <h2 id="passport-title" className="passport-title">
          {name}
        </h2>
        {territoryNote ? (
          <p className="passport-territory">
            <span className="passport-fact-label">{t.territory}</span>
            {territoryNote}
          </p>
        ) : null}
        {disputeNote ? (
          <p className="passport-dispute">
            <span className="passport-fact-label">{t.dispute}</span>
            {disputeNote}
          </p>
        ) : null}
        <dl className="passport-fields">
          <div>
            <dt>{t.region}</dt>
            <dd>{regionLabel(country.region, lang)}</dd>
          </div>
          <div>
            <dt>{t.capital}</dt>
            <dd>{passportCapital(passport, lang)}</dd>
          </div>
          <div>
            <dt>{t.population}</dt>
            <dd>{formatPopulation(passport.population, lang)}</dd>
          </div>
          <div>
            <dt>{t.currency}</dt>
            <dd>{passportCurrency(passport, lang)}</dd>
          </div>
          {founded !== undefined ? (
            <div className="passport-founded">
              <dt>{t.founded}</dt>
              <dd>{founded}</dd>
            </div>
          ) : null}
        </dl>
        {territoryNote ? null : (
          <section className="passport-neighbors">
            <h3>{t.neighbors}</h3>
            {neighbors.length === 0 ? (
              <p className="passport-neighbors-empty">{t.noNeighbors}</p>
            ) : (
              <div className="passport-neighbors-list">
                {neighbors.map((neighbor) => {
                  const neighborName = countryName(neighbor, lang)
                  return (
                    <button
                      key={neighbor.iso}
                      type="button"
                      className="passport-neighbor"
                      onClick={() => onOpenCountry(neighbor.iso)}
                    >
                      <Flag iso={neighbor.iso} name={neighborName} size="thumb" />
                      <span>{neighborName}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        )}
        <p className="passport-fact">
          <span className="passport-fact-label">{t.fact}</span>
          {factText(country.iso, factIndex, lang, { en: passport.factEn, ru: passport.factRu })}
        </p>
      </div>
    </div>
  )
}
