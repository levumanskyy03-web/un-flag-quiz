'use client'

import { useEffect, useId, useState } from 'react'
import { LANGS, LANG_NATIVE, type Lang } from '../i18n/lang'
import { persistLang, readLangCookie, readStoredLang } from '../i18n/persistLang'

const PROMPT_LANGS: Lang[] = ['en', ...LANGS.filter((code) => code !== 'en')]

export function LangPrompt({ ask }: { ask: boolean }) {
  const titleId = useId()
  const [open, setOpen] = useState(ask)

  useEffect(() => {
    const stored = readStoredLang() ?? readLangCookie()
    if (!stored) return
    persistLang(stored)
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      persistLang('en')
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  function remember(next: Lang) {
    persistLang(next)
    setOpen(false)
  }

  return (
    <div className="passport-overlay lang-prompt" lang="en" dir="ltr" onClick={() => remember('en')}>
      <div
        className="passport-sheet lang-prompt-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId}>Choose your language</h2>
        <p className="setting-hint">Saved on this device. You can change it later in Settings.</p>
        <div className="choice-grid lang-prompt-grid">
          {PROMPT_LANGS.map((code) => (
            <button key={code} type="button" className="choice" onClick={() => remember(code)}>
              {LANG_NATIVE[code]}
            </button>
          ))}
        </div>
        <button type="button" className="btn-secondary" onClick={() => remember('en')}>
          Continue in English
        </button>
      </div>
    </div>
  )
}
