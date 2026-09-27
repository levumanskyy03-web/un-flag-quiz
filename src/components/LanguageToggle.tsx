'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { LANGS, LANG_NATIVE, type Lang } from '../i18n/lang'
import { STRINGS } from '../i18n/strings'

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

  return (
    <div className="lang-toggle lang-select-wrap" ref={root}>
      <button
        type="button"
        className="lang-select"
        aria-label={t.profileLanguage}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        {LANG_NATIVE[lang]}
      </button>
      <span className="lang-select-mark" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 4.25 6 7.75l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
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
