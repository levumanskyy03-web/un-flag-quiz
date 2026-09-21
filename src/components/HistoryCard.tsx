import { useEffect } from 'react'
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
} from '../data/history'
import { findCountry } from '../data/extras'
import { formatPopulation } from '../data/passports'
import { languageName } from '../data/languages'
import { STRINGS, governmentLabel, regionLabel, type Lang } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import { Flag } from './Flag'
import { FitText } from './FitText'

interface HistoryCardProps {
  id: string
  lang: Lang
  mapName?: string
  onClose: () => void
  onOpen: (id: string) => void
}

export function HistoryCard({ id, lang, mapName, onClose, onOpen }: HistoryCardProps) {
  const t = STRINGS[lang]
  const polity = polityById(id)
  const passport = polityPassport(id)
  const name = polityName(id, lang) ?? mapName ?? id
  const country = findCountry(id) ?? (polity ? asCountry(polity) : undefined)
  const showFlag = Boolean(polityFlagUrl(id))
  const langs = passport?.langs ?? []

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

  const successors = (polity?.successors ?? [])
    .map((iso) => {
      const next = findCountry(iso) ?? (isHistoryId(iso) && polityById(iso) ? asCountry(polityById(iso)!) : undefined)
      return next
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const years = polity
    ? `${passport?.founded && passport.founded < polity.from ? passport.founded : polity.from}–${polity.to ?? '…'}`
    : '—'

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
        {showFlag && country ? <Flag iso={country.iso} name={name} size="hero" /> : null}
        <h2 id="history-title" className="passport-title">
          {name}
        </h2>
        <p className="passport-territory">
          <span className="passport-fact-label">{t.historyStatus}</span>
          {polity?.kind === 'de_facto'
            ? t.historyDeFacto
            : polity?.kind === 'independent'
              ? t.historyIndependent
              : t.historyNotIndependent}
        </p>
        <dl className="passport-fields">
          {polity ? (
            <div>
              <dt>{t.region}</dt>
              <dd>{regionLabel(polity.region, lang)}</dd>
            </div>
          ) : null}
          <div>
            <dt>{t.historyYears}</dt>
            <dd>{years}</dd>
          </div>
          {polity ? (
            <div>
              <dt>{t.capital}</dt>
              <dd>{polityCapital(id, lang)}</dd>
            </div>
          ) : null}
          {passport ? (
            <div>
              <dt>{t.population}</dt>
              <dd>
                {formatPopulation(passport.population, lang)} ({passport.populationYear})
              </dd>
            </div>
          ) : null}
          {passport ? (
            <div>
              <dt>{t.currency}</dt>
              <dd>{polityCurrency(id, lang)}</dd>
            </div>
          ) : null}
          {passport ? (
            <div>
              <dt>{t.government}</dt>
              <dd>{governmentLabel(passport.gov, lang)}</dd>
            </div>
          ) : null}
          {langs.length > 0 ? (
            <div>
              <dt>{t.nationalLanguage}</dt>
              <dd>{langs.map((code) => languageName(code, lang)).join(', ')}</dd>
            </div>
          ) : null}
        </dl>
        {successors.length > 0 ? (
          <section className="passport-neighbors">
            <h3>{t.historySuccessors}</h3>
            <div className="passport-neighbors-list">
              {successors.map((item) => {
                const label = countryName(item, lang)
                return (
                  <button key={item.iso} type="button" className="passport-neighbor" onClick={() => onOpen(item.iso)}>
                    <Flag iso={item.iso} name={label} size="thumb" />
                    <FitText>{label}</FitText>
                  </button>
                )
              })}
            </div>
          </section>
        ) : null}
        {polityFact(id, lang) ? <p className="learn-copy">{polityFact(id, lang)}</p> : null}
      </div>
    </div>
  )
}
