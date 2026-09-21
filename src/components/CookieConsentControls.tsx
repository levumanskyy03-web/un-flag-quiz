'use client'

import { useSyncExternalStore } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import {
  getCookieConsent,
  subscribeCookieConsent,
  writeCookieConsent,
} from '../lib/cookieConsent'

function consentSnapshot() {
  return getCookieConsent()
}

export function useCookieConsent() {
  return useSyncExternalStore(subscribeCookieConsent, consentSnapshot, () => null)
}

export function CookieConsentControls({ lang }: { lang: Lang }) {
  const t = STRINGS[lang]
  const consent = useCookieConsent()
  const adsOn = consent?.ads === true
  const chosen = consent != null

  return (
    <div className="cookie-consent-controls">
      <p className="settings-sub">{t.legalCookies}</p>
      <div className="choice-grid">
        <button
          type="button"
          className={`choice ${chosen && !adsOn ? 'is-active' : ''}`}
          aria-pressed={chosen && !adsOn}
          onClick={() => writeCookieConsent(false)}
        >
          {t.cookieNoticeReject}
        </button>
        <button
          type="button"
          className={`choice ${adsOn ? 'is-active' : ''}`}
          aria-pressed={adsOn}
          onClick={() => writeCookieConsent(true)}
        >
          {t.cookieNoticeAll}
        </button>
      </div>
    </div>
  )
}
