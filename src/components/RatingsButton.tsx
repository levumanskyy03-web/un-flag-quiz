'use client'

import { useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import type { LevelClear } from '../lib/levelProgress'
import { GeoIcon } from './GeoIcon'
import { RatingsModal } from './RatingsModal'

interface RatingsButtonProps {
  lang: Lang
  levelClears: LevelClear[]
  xp: number
}

export function RatingsButton({ lang, levelClears, xp }: RatingsButtonProps) {
  const t = STRINGS[lang]
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="settings-chip ratings-chip" onClick={() => setOpen(true)} aria-label={t.ratings}>
        <GeoIcon name="trophy" size={18} />
      </button>
      {open ? (
        <RatingsModal lang={lang} levelClears={levelClears} xp={xp} onClose={() => setOpen(false)} />
      ) : null}
    </>
  )
}
