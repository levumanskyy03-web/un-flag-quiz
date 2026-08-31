import { useEffect } from 'react'
import { type Country } from '../data/countries'
import { findCountry } from '../data/extras'
import { foundedYear } from '../data/founded'
import { landNeighbors } from '../data/neighbors'
import {
  formatPopulation,
  getPassport,
  passportCapital,
  passportCurrency,
} from '../data/passports'
import { STRINGS, localeTag, regionLabel, type Lang } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import { Flag } from './Flag'
import { FitText } from './FitText'
import { RankingPlaces } from './RankingPlaces'
import { PassportLanguages } from './PassportLanguages'
import { PassportRotatingFact } from './PassportRotatingFact'

interface PassportModalProps {
  country: Country
  lang: Lang
  territoryNote?: string
  disputeNote?: string
  stacked?: boolean
  onClose: () => void
  onOpenCountry: (iso: string) => void
}

export function PassportModal({
  country,
  lang,
  territoryNote,
  disputeNote,
  stacked = false,
  onClose,
  onOpenCountry,
}: PassportModalProps) {
  const t = STRINGS[lang]
  const passport = getPassport(country.iso)
  const name = countryName(country, lang)
  const founded = foundedYear(country.iso)
  const neighbors = landNeighbors(country.iso)
    .map((iso) => findCountry(iso))
    .filter((item): item is Country => item !== undefined)
    .sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), localeTag(lang)))

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
    <div
      className={`passport-overlay${stacked ? ' is-stacked' : ''}`}
      onClick={(event) => {
        event.stopPropagation()
        onClose()
      }}
      role="presentation"
    >
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
            <div>
              <dt>{t.founded}</dt>
              <dd>{founded}</dd>
            </div>
          ) : null}
          <PassportLanguages iso={country.iso} lang={lang} />
        </dl>
        <RankingPlaces iso={country.iso} lang={lang} onOpenCountry={onOpenCountry} />
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
                      <FitText>{neighborName}</FitText>
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        )}
        <PassportRotatingFact
          iso={country.iso}
          lang={lang}
          fallback={{ en: passport.factEn, ru: passport.factRu }}
        />
      </div>
    </div>
  )
}
