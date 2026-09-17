import { SITE_LANG_KEY, isLang, type Lang } from './lang'

export function persistLang(lang: Lang) {
  if (typeof localStorage === 'undefined' || typeof document === 'undefined') return
  const prev = localStorage.getItem(SITE_LANG_KEY)
  localStorage.setItem(SITE_LANG_KEY, lang)
  document.cookie = `${SITE_LANG_KEY}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`
  if (prev !== lang) window.dispatchEvent(new Event('storage'))
}

export function readStoredLang(): Lang | null {
  if (typeof localStorage === 'undefined') return null
  const stored = localStorage.getItem(SITE_LANG_KEY)
  return isLang(stored) ? stored : null
}
