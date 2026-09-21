export const COOKIE_NOTICE_KEY = 'un-flag-quiz-cookies'
export const COOKIE_CONSENT_VERSION = 4

export type CookieConsent = {
  v: number
  ads: boolean
}

const listeners = new Set<() => void>()

let snapshotRaw: string | undefined
let snapshotValue: CookieConsent | null = null

export function parseCookieConsent(value: string | undefined): CookieConsent | null {
  if (!value) return null
  const raw = decodeURIComponent(value)
  if (raw === `${COOKIE_CONSENT_VERSION}:ads`) return { v: COOKIE_CONSENT_VERSION, ads: true }
  if (raw === `${COOKIE_CONSENT_VERSION}:essential`) return { v: COOKIE_CONSENT_VERSION, ads: false }
  return null
}

export function cookieNoticeSeen(value: string | undefined) {
  return parseCookieConsent(value) != null
}

export function encodeCookieConsent(ads: boolean) {
  return ads ? `${COOKIE_CONSENT_VERSION}:ads` : `${COOKIE_CONSENT_VERSION}:essential`
}

function cookieHeaderValue() {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(/(?:^|; )un-flag-quiz-cookies=([^;]*)/)
  return match?.[1]
}

export function getCookieConsent(): CookieConsent | null {
  const raw = cookieHeaderValue()
  if (raw === snapshotRaw) return snapshotValue
  snapshotRaw = raw
  snapshotValue = parseCookieConsent(raw)
  return snapshotValue
}

export function adsCookiesAllowed() {
  return getCookieConsent()?.ads === true
}

export function writeCookieConsent(ads: boolean) {
  if (typeof document === 'undefined') return
  const encoded = encodeCookieConsent(ads)
  document.cookie = `${COOKIE_NOTICE_KEY}=${encoded}; Path=/; Max-Age=34560000; SameSite=Lax`
  snapshotRaw = encoded
  snapshotValue = { v: COOKIE_CONSENT_VERSION, ads }
  for (const listener of listeners) listener()
}

export function subscribeCookieConsent(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
