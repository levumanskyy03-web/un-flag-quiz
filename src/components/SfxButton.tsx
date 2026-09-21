'use client'

import { useEffect, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { isMusicMuted, isSfxMuted, playSfx, setMusicMuted, setSfxMuted, subscribeAudio } from '../lib/sfx'
import { GeoIcon } from './GeoIcon'

interface SfxButtonProps {
  lang: Lang
}

export function SfxButton({ lang }: SfxButtonProps) {
  const t = STRINGS[lang]
  const [sfxOff, setSfxOff] = useState(false)
  const [musicOff, setMusicOff] = useState(false)

  useEffect(() => {
    const sync = () => {
      setSfxOff(isSfxMuted())
      setMusicOff(isMusicMuted())
    }
    sync()
    return subscribeAudio(sync)
  }, [])

  return (
    <div className="sfx-pair">
      <button
        type="button"
        className={`settings-chip ratings-chip sfx-chip${sfxOff ? ' is-muted' : ''}`}
        onClick={() => {
          const next = !sfxOff
          setSfxMuted(next)
          if (!next) playSfx('correct')
        }}
        aria-label={`${t.sounds}: ${sfxOff ? t.soundsOff : t.soundsOn}`}
        aria-pressed={!sfxOff}
      >
        <GeoIcon name={sfxOff ? 'speakerOff' : 'speaker'} size={18} />
      </button>
      <button
        type="button"
        className={`settings-chip ratings-chip sfx-chip${musicOff ? ' is-muted' : ''}`}
        onClick={() => setMusicMuted(!musicOff)}
        aria-label={`${t.music}: ${musicOff ? t.soundsOff : t.soundsOn}`}
        aria-pressed={!musicOff}
      >
        <GeoIcon name={musicOff ? 'notesOff' : 'notes'} size={18} />
      </button>
    </div>
  )
}
