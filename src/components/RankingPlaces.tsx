'use client'

import { useState } from 'react'
import {
  RANKING_MODES,
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
  const rows = RANKING_MODES.flatMap((mode) => {
    const place = rankingPlaceOf(mode, iso)
    return place === null ? [] : [{ mode, place }]
  })
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
      {cite && open ? (
        <p className="ranking-footnote">
          <strong>{modeLabel(open, lang)}. </strong>
          {t.rankingFootnote(cite.asOf, cite.source, cite.count)}
          {cite.note ? ` ${cite.note}` : ''}
        </p>
      ) : null}
    </section>
  )
}
