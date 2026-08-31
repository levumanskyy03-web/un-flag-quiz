'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getPassport } from '../data/passports'
import { rankingAbout, rankingCite, rankingCountries, type RankingMode } from '../data/rankings'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { countryPath } from '../lib/countryCatalog'
import { countryName } from '../lib/quiz'
import { Flag } from './Flag'

interface RankingAboutDialogProps {
  mode: RankingMode
  lang: Lang
  highlightIso?: string
  linkToPages?: boolean
  ignoreEscape?: boolean
  onOpenCountry?: (iso: string) => void
  onClose: () => void
}

export function RankingAboutDialog({
  mode,
  lang,
  highlightIso,
  linkToPages = false,
  ignoreEscape = false,
  onOpenCountry,
  onClose,
}: RankingAboutDialogProps) {
  const t = STRINGS[lang]
  const cite = rankingCite(mode, lang)
  const countries = rankingCountries(mode)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    if (ignoreEscape) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopImmediatePropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [ignoreEscape, onClose])

  useEffect(() => {
    if (!highlightIso) return
    document.getElementById(`ranking-row-${highlightIso}`)?.scrollIntoView({ block: 'center' })
  }, [highlightIso, mode])

  function openCountry(iso: string) {
    if (!getPassport(iso) || !onOpenCountry) return
    onOpenCountry(iso)
  }

  if (!ready) return null

  return createPortal(
    <div className="passport-overlay ranking-about-overlay" onClick={onClose} role="presentation">
      <div
        className="passport-sheet ranking-about-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ranking-about-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="ranking-about-close" aria-label={t.close} onClick={onClose}>
          ×
        </button>
        <h2 id="ranking-about-title" className="passport-title">
          {modeLabel(mode, lang)}
        </h2>
        <p className="ranking-about-body">{rankingAbout(mode, lang)}</p>
        <a className="ranking-about-source" href={cite.url} target="_blank" rel="noreferrer">
          {t.rankingSource}: {cite.source}
        </a>
        <p className="ranking-about-cite">
          {t.rankingFootnote(cite.asOf, cite.source, cite.count)}
          {cite.note ? ` ${cite.note}` : ''}
        </p>
        <div className="ranking-about-table-wrap">
          <table className="ranking-about-table">
            <tbody>
              {countries.map((country, index) => {
                const name = countryName(country, lang)
                const place = index + 1
                const current = highlightIso === country.iso
                const hasPassport = Boolean(getPassport(country.iso))
                const href = linkToPages && hasPassport ? countryPath(country.iso) : undefined
                const inner = (
                  <>
                    <span className="ranking-about-num">{place}</span>
                    <Flag iso={country.iso} name={name} size="thumb" />
                    <span className="ranking-about-country">{name}</span>
                  </>
                )
                return (
                  <tr key={country.iso} id={`ranking-row-${country.iso}`} className={current ? 'is-current' : ''}>
                    <td>
                      {href ? (
                        <a className="ranking-about-row" href={href}>
                          {inner}
                        </a>
                      ) : hasPassport && onOpenCountry ? (
                        <button type="button" className="ranking-about-row" onClick={() => openCountry(country.iso)}>
                          {inner}
                        </button>
                      ) : (
                        <div className="ranking-about-row is-static">{inner}</div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    document.body,
  )
}
