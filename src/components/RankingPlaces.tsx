'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  RANKING_MODES,
  rankingAbout,
  rankingCite,
  rankingCount,
  rankingPlaceOf,
  type RankingMode,
} from '../data/rankings'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'

interface RankingPlacesProps {
  iso: string
  lang: Lang
}

export function RankingPlaces({ iso, lang }: RankingPlacesProps) {
  const t = STRINGS[lang]
  const [open, setOpen] = useState<RankingMode | null>(null)
  const [canPortal, setCanPortal] = useState(false)
  const rows = RANKING_MODES.flatMap((mode) => {
    const place = rankingPlaceOf(mode, iso)
    return place === null ? [] : [{ mode, place }]
  })

  useEffect(() => {
    setCanPortal(true)
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopImmediatePropagation()
      setOpen(null)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  if (rows.length === 0) return null
  const cite = open ? rankingCite(open, lang) : null

  return (
    <section className="passport-rankings">
      <h3>{t.rankings}</h3>
      <div className="passport-ranking-grid">
        {rows.map((row) => (
          <div key={row.mode} className={`passport-ranking-tile${open === row.mode ? ' is-open' : ''}`}>
            <p className="passport-ranking-label">{modeLabel(row.mode, lang)}</p>
            <p className="passport-ranking-place">{t.rankingPlace(row.place, rankingCount(row.mode))}</p>
            <button
              type="button"
              className="passport-ranking-help"
              aria-label={t.rankingHelp}
              aria-expanded={open === row.mode}
              onClick={() => setOpen((prev) => (prev === row.mode ? null : row.mode))}
            >
              ?
            </button>
          </div>
        ))}
      </div>
      {canPortal && open && cite
        ? createPortal(
            <div className="passport-overlay ranking-about-overlay" onClick={() => setOpen(null)} role="presentation">
              <div
                className="passport-sheet ranking-about-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ranking-about-title"
                onClick={(event) => event.stopPropagation()}
              >
                <button type="button" className="ranking-about-close" aria-label={t.close} onClick={() => setOpen(null)}>
                  ×
                </button>
                <h2 id="ranking-about-title" className="passport-title">
                  {modeLabel(open, lang)}
                </h2>
                <p className="ranking-about-body">{rankingAbout(open, lang)}</p>
                <p className="ranking-about-cite">
                  {t.rankingFootnote(cite.asOf, cite.source, cite.count)}
                  {cite.note ? ` ${cite.note}` : ''}
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}
