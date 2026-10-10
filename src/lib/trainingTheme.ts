const KEY = 'un-flag-quiz-hide-training'
const EVENT = 'un-flag-quiz-hide-training'

export function isTrainingHidden() {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(KEY) === '1'
}

export function setTrainingHidden(hidden: boolean) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(KEY, hidden ? '1' : '0')
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT))
}

export function subscribeTrainingHidden(onChange: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT, onChange)
  return () => window.removeEventListener(EVENT, onChange)
}
