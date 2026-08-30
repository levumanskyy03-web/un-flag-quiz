export type SfxName = 'correct' | 'wrong' | 'success' | 'fail' | 'record'

const MUTE_KEY = 'un-flag-quiz-sfx-mute'

const FILES: Record<SfxName, string> = {
  correct: '/sounds/correct.wav',
  wrong: '/sounds/wrong.wav',
  success: '/sounds/success.wav',
  fail: '/sounds/fail.wav',
  record: '/sounds/record.wav',
}

const VOLUME: Record<SfxName, number> = {
  correct: 0.42,
  wrong: 0.38,
  success: 0.48,
  fail: 0.44,
  record: 0.55,
}

export function isSfxMuted(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(MUTE_KEY) === '1'
}

const MUTE_EVENT = 'un-flag-quiz-sfx-mute'

export function setSfxMuted(muted: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  window.dispatchEvent(new Event(MUTE_EVENT))
}

export function subscribeSfxMute(onChange: (muted: boolean) => void) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => onChange(isSfxMuted())
  window.addEventListener(MUTE_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(MUTE_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

export function playSfx(name: SfxName) {
  if (typeof window === 'undefined' || isSfxMuted()) return
  const audio = new Audio(FILES[name])
  audio.volume = VOLUME[name]
  void audio.play().catch(() => {})
}
