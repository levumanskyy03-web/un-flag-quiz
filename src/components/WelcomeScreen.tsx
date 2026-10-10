'use client'

import { useEffect, useId, useSyncExternalStore } from 'react'
import { langDir, localeTag, type Lang } from '../i18n/lang'
import { readLangCookie, readStoredLang } from '../i18n/persistLang'
import { STRINGS } from '../i18n/strings'
import { markWelcomeSeen, useWelcomeOpen } from '../lib/siteTour'

function readLang(): Lang {
  return readStoredLang() ?? readLangCookie() ?? 'en'
}

function subscribeLang(onChange: () => void) {
  window.addEventListener('storage', onChange)
  return () => window.removeEventListener('storage', onChange)
}

export function WelcomeScreen() {
  const open = useWelcomeOpen()
  const lang = useSyncExternalStore(subscribeLang, readLang, () => 'en' as Lang)
  const titleId = useId()
  const t = STRINGS[lang]

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Escape') markWelcomeSeen()
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

  return (
    <div className="passport-overlay lang-prompt welcome-prompt" lang={localeTag(lang)} dir={langDir(lang)}>
      <div className="passport-sheet lang-prompt-sheet welcome-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <p className="welcome-kicker">{t.title}</p>
        <h2 id={titleId}>{t.welcomeTitle}</h2>
        <p className="welcome-body">{t.welcomeBody}</p>
        <button type="button" className="btn-primary" onClick={() => markWelcomeSeen()}>
          {t.welcomeContinue}
        </button>
      </div>
    </div>
  )
}
