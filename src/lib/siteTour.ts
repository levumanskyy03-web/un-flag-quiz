import { useSyncExternalStore } from 'react'

export const SITE_TOUR_KEY = 'un-flag-quiz-tour'

type Listener = () => void
const listeners = new Set<Listener>()
let forceOpen = false

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

export function siteTourShouldShow() {
  return forceOpen || !siteTourSeen()
}

export function useSiteTourOpen() {
  return useSyncExternalStore(subscribeSiteTour, siteTourShouldShow, () => false)
}
