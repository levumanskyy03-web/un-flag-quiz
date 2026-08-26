'use client'

import { useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import type { RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import { GeoIcon } from './GeoIcon'
import { RatingsModal } from './RatingsModal'

interface RatingsButtonProps {
  lang: Lang
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  xp: number
}

export function RatingsButton({ lang, history, bests, levelClears, xp }: RatingsButtonProps) {
  const t = STRINGS[lang]
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="settings-chip ratings-chip" onClick={() => setOpen(true)} aria-label={t.ratings}>
        <GeoIcon name="trophy" size={18} />
      </button>
      {open ? (
        <RatingsModal
          lang={lang}
          history={history}
          bests={bests}
          levelClears={levelClears}
          xp={xp}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
