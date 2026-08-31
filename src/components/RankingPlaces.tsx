'use client'

import { useState } from 'react'
import { RANKING_MODES, rankingCount, rankingPlaceOf, type RankingMode } from '../data/rankings'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { RankingAboutDialog } from './RankingAboutDialog'

interface RankingPlacesProps {
  iso: string
  lang: Lang
  linkToPages?: boolean
  onOpenCountry?: (iso: string) => void
}

export function RankingPlaces({ iso, lang, linkToPages = false, onOpenCountry }: RankingPlacesProps) {
  const t = STRINGS[lang]
  const [open, setOpen] = useState<RankingMode | null>(null)
  const rows = RANKING_MODES.flatMap((mode) => {
    const place = rankingPlaceOf(mode, iso)
    return place === null ? [] : [{ mode, place }]
  })

  if (rows.length === 0) return null

  return (
    <section className="passport-rankings">
      <h3>{t.rankings}</h3>
      <div className="passport-ranking-grid">
        {rows.map((row) => (
          <button
            key={row.mode}
            type="button"
            className={`passport-ranking-tile${open === row.mode ? ' is-open' : ''}`}
            aria-label={`${modeLabel(row.mode, lang)}. ${t.rankingHelp}`}
            aria-expanded={open === row.mode}
            onClick={() => setOpen(row.mode)}
          >
            <p className="passport-ranking-label">{modeLabel(row.mode, lang)}</p>
            <p className="passport-ranking-place">{t.rankingPlace(row.place, rankingCount(row.mode))}</p>
            <span className="passport-ranking-help" aria-hidden="true">
              ?
            </span>
          </button>
        ))}
      </div>
      {open ? (
        <RankingAboutDialog
          mode={open}
          lang={lang}
          highlightIso={iso}
          linkToPages={linkToPages}
          onOpenCountry={
            onOpenCountry
              ? (nextIso) => {
                  setOpen(null)
                  onOpenCountry(nextIso)
                }
              : undefined
          }
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
  )
}
