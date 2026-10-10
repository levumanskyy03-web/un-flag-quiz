import { useSyncExternalStore } from 'react'
import { readLangCookie, readStoredLang } from '../i18n/persistLang'

export const SITE_TOUR_KEY = 'un-flag-quiz-tour'
export const WELCOME_KEY = 'un-flag-quiz-welcome'

type Listener = () => void
const listeners = new Set<Listener>()
let forceOpen = false
let langPromptOpen = false

function langChosen() {
  return Boolean(readStoredLang() ?? readLangCookie())
}

function emit() {
  for (const listener of listeners) listener()
}

export function subscribeSiteTour(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function siteTourSeen() {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(SITE_TOUR_KEY) === 'seen'
  } catch {
    return true
  }
}

export function markSiteTourSeen() {
  forceOpen = false
  try {
    window.localStorage.setItem(SITE_TOUR_KEY, 'seen')
  } catch {
    /* quota */
  }
  emit()
}

export function requestSiteTour() {
  forceOpen = true
  try {
    window.localStorage.removeItem(SITE_TOUR_KEY)
  } catch {
    /* quota */
  }
  emit()
}

export function setLangPromptOpen(open: boolean) {
  if (langPromptOpen === open) return
  langPromptOpen = open
  emit()
}

function welcomeStoredSeen() {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(WELCOME_KEY) === 'seen'
  } catch {
    return true
  }
}

export function markWelcomeSeen() {
  try {
    window.localStorage.setItem(WELCOME_KEY, 'seen')
  } catch {
    /* quota */
  }
  emit()
}

/** Once, after a language is stored and before the spotlight guide. Replay of the guide skips this. */
export function welcomeShouldShow() {
  if (typeof window === 'undefined') return false
  if (langPromptOpen || forceOpen || !langChosen()) return false
  return !welcomeStoredSeen()
}

export function siteTourShouldShow() {
  if (typeof window === 'undefined') return false
  if (langPromptOpen || welcomeShouldShow()) return false
  if (!forceOpen && !langChosen()) return false
  return forceOpen || !siteTourSeen()
}

export function useWelcomeOpen() {
  return useSyncExternalStore(subscribeSiteTour, welcomeShouldShow, () => false)
}

export function useSiteTourOpen() {
  return useSyncExternalStore(subscribeSiteTour, siteTourShouldShow, () => false)
}
