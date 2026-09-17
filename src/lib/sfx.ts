export type SfxName = 'correct' | 'wrong' | 'success' | 'fail' | 'record'

const MUTE_KEY = 'un-flag-quiz-sfx-mute'
const MUSIC_MUTE_KEY = 'un-flag-quiz-music-mute'
const AUDIO_EVENT = 'un-flag-quiz-audio'

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

function flag(key: string): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(key) === '1'
}

function writeFlag(key: string, muted: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, muted ? '1' : '0')
}

function emitAudio() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(AUDIO_EVENT))
}

export function isSfxMuted(): boolean {
  return flag(MUTE_KEY)
}

export function isMusicMuted(): boolean {
  return flag(MUSIC_MUTE_KEY)
}

export function isAllAudioMuted(): boolean {
  return isSfxMuted() && isMusicMuted()
}

export function setSfxMuted(muted: boolean) {
  writeFlag(MUTE_KEY, muted)
  emitAudio()
}

export function setMusicMuted(muted: boolean) {
  writeFlag(MUSIC_MUTE_KEY, muted)
  emitAudio()
}

export function setAllAudioMuted(muted: boolean) {
  writeFlag(MUTE_KEY, muted)
  writeFlag(MUSIC_MUTE_KEY, muted)
  emitAudio()
}

export function subscribeAudio(onChange: () => void) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => onChange()
  window.addEventListener(AUDIO_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(AUDIO_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

export function subscribeSfxMute(onChange: (muted: boolean) => void) {
  return subscribeAudio(() => onChange(isSfxMuted()))
}

export function playSfx(name: SfxName) {
  if (typeof window === 'undefined' || isSfxMuted()) return
  const audio = new Audio(FILES[name])
  audio.volume = VOLUME[name]
  void audio.play().catch(() => {})
}
