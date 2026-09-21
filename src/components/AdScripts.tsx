'use client'

import { adsCookiesAllowed } from '../lib/cookieConsent'
import { useCookieConsent } from './CookieConsentControls'

export function AdScripts() {
  useCookieConsent()
  if (!adsCookiesAllowed()) return null
  return <AdNetwork />
}

function AdNetwork() {
  return null
}
