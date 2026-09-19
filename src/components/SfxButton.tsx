'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import {
  isMusicMuted,
  isSfxMuted,
  playSfx,
  setAllAudioMuted,
  setMusicMuted,
  setSfxMuted,
  subscribeAudio,
} from '../lib/sfx'
import { GeoIcon } from './GeoIcon'

interface SfxButtonProps {
  lang: Lang
}

export function SfxButton({ lang }: SfxButtonProps) {
  const t = STRINGS[lang]
  const menuId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const holdOpenUntil = useRef(0)
  const [open, setOpen] = useState(false)
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

  useEffect(() => {
    if (!open) return
    function onDoc(event: PointerEvent) {
      if (Date.now() < holdOpenUntil.current) return
      const node = event.target
      if (node instanceof Node && wrapRef.current?.contains(node)) return
      setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const allOff = sfxOff && musicOff
  const label = allOff ? t.audioAllOff : sfxOff || musicOff ? t.sounds : t.soundsOn

  function openMenu(muteAll: boolean) {
    holdOpenUntil.current = Date.now() + 500
    if (muteAll) setAllAudioMuted(true)
    setOpen(true)
    queueMicrotask(() => setOpen(true))
  }

  return (
    <div className={`sfx-menu-wrap${open ? ' is-open' : ''}`} ref={wrapRef}>
      <button
        type="button"
        className={`settings-chip ratings-chip sfx-chip${allOff ? ' is-muted' : sfxOff || musicOff ? ' is-partial' : ''}`}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          openMenu(!isSfxMuted() && !isMusicMuted())
        }}
        onClick={(event) => {
          event.preventDefault()
          openMenu(!isSfxMuted() && !isMusicMuted())
        }}
        aria-label={`${t.sounds}: ${label}`}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
      >
        <GeoIcon name={allOff ? 'speakerOff' : 'speaker'} size={18} />
      </button>
      {open ? (
        <div id={menuId} className="sfx-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            className={!allOff && !sfxOff && !musicOff ? 'is-active' : ''}
            onClick={() => {
              setAllAudioMuted(false)
              playSfx('correct')
            }}
          >
            {t.audioAll}
          </button>
          <button
            type="button"
            role="menuitem"
            className={allOff ? 'is-active' : ''}
            onClick={() => setAllAudioMuted(true)}
          >
            {t.audioAllOff}
          </button>
          <button
            type="button"
            role="menuitem"
            className={!sfxOff ? 'is-active' : ''}
            onClick={() => {
              const next = !sfxOff
              setSfxMuted(next)
              if (!next) playSfx('correct')
            }}
          >
            {t.sounds}: {sfxOff ? t.soundsOff : t.soundsOn}
          </button>
          <button
            type="button"
            role="menuitem"
            className={!musicOff ? 'is-active' : ''}
            onClick={() => setMusicMuted(!musicOff)}
          >
            {t.music}: {musicOff ? t.soundsOff : t.soundsOn}
          </button>
        </div>
      ) : null}
    </div>
  )
}
