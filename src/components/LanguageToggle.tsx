'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { LANGS, LANG_NATIVE, type Lang } from '../i18n/lang'
import { STRINGS } from '../i18n/strings'
import { GeoIcon } from './GeoIcon'

interface LanguageToggleProps {
  lang: Lang
  onChange: (lang: Lang) => void
}

export function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  const t = STRINGS[lang]
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const label = `${t.profileLanguage}: ${LANG_NATIVE[lang]}`

  return (
    <div className="lang-toggle lang-select-wrap" ref={root}>
      <button
        type="button"
        className="lang-select"
        aria-label={label}
        title={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <GeoIcon name="globe" size={18} />
      </button>
      {open ? (
        <ul id={listId} className="lang-menu" role="listbox" aria-label={t.profileLanguage}>
          {LANGS.map((code) => (
            <li key={code} role="none">
              <button
                type="button"
                role="option"
                aria-selected={code === lang}
                className={code === lang ? 'is-active' : undefined}
                lang={code}
                onClick={() => {
                  onChange(code)
                  setOpen(false)
                }}
              >
                {LANG_NATIVE[code]}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
