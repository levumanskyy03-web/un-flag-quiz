'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { isLang } from '../i18n/lang'
import { readStoredLang } from '../i18n/persistLang'
import { STRINGS, type Lang } from '../i18n/strings'
import { getCookieConsent, subscribeCookieConsent, writeCookieConsent } from '../lib/cookieConsent'

export function CookieNotice({ lang: initialLang, dismissed }: { lang: Lang; dismissed: boolean }) {
  const titleId = useId()
  const pathname = usePathname()
  const [open, setOpen] = useState(!dismissed)
  const [lang, setLang] = useState(initialLang)
  const [pressed, setPressed] = useState<'reject' | 'accept' | null>(null)

  useEffect(() => {
    const sync = () => {
      const stored = readStoredLang()
      if (stored) setLang(stored)
    }
    sync()
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  useEffect(() => {
    const hideIfChosen = () => {
      if (getCookieConsent()) setOpen(false)
    }
    hideIfChosen()
    return subscribeCookieConsent(hideIfChosen)
  }, [])

  if (!open || pathname === '/cookies') return null

  const t = STRINGS[isLang(lang) ? lang : initialLang]

  function choose(kind: 'reject' | 'accept') {
    if (pressed) return
    setPressed(kind)
    window.setTimeout(() => {
      writeCookieConsent(kind === 'accept')
    }, 220)
  }

  return (
    <div className="cookie-notice" role="dialog" aria-labelledby={titleId}>
      <p id={titleId}>
        {t.cookieNotice}{' '}
        <a href="/cookies">{t.legalCookies}</a>
      </p>
      <div className="cookie-notice-actions">
        <button
          type="button"
          className={`cookie-notice-btn cookie-notice-btn-reject${pressed === 'reject' ? ' is-pressed' : ''}`}
          aria-pressed={pressed === 'reject'}
          disabled={pressed != null}
          onClick={() => choose('reject')}
        >
          {t.cookieNoticeReject}
        </button>
        <button
          type="button"
          className={`cookie-notice-btn cookie-notice-btn-accept${pressed === 'accept' ? ' is-pressed' : ''}`}
          aria-pressed={pressed === 'accept'}
          disabled={pressed != null}
          onClick={() => choose('accept')}
        >
          {t.cookieNoticeAll}
        </button>
      </div>
    </div>
  )
}
