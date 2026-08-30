'use client'

import { useEffect, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { isSfxMuted, playSfx, setSfxMuted, subscribeSfxMute } from '../lib/sfx'
import { GeoIcon } from './GeoIcon'

interface SfxButtonProps {
  lang: Lang
}

export function SfxButton({ lang }: SfxButtonProps) {
  const t = STRINGS[lang]
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    setMuted(isSfxMuted())
    return subscribeSfxMute(setMuted)
  }, [])

  return (
    <button
      type="button"
      className={`settings-chip ratings-chip sfx-chip${muted ? ' is-muted' : ''}`}
      onClick={() => {
        const next = !muted
        setSfxMuted(next)
        setMuted(next)
        if (!next) playSfx('correct')
      }}
      aria-label={`${t.sounds}: ${muted ? t.soundsOff : t.soundsOn}`}
      aria-pressed={!muted}
    >
      <GeoIcon name={muted ? 'speakerOff' : 'speaker'} size={18} />
    </button>
  )
}
