import { isMusicMuted, subscribeAudio } from './sfx'

/** Original Web Audio loop — no sampled recording, no third-party composition. */
const BPM = 78
const BEAT = 60 / BPM
const LOOP_BEATS = 32
const LOOP = LOOP_BEATS * BEAT

function midi(n: number) {
  return 440 * 2 ** ((n - 69) / 12)
}

type Note = { at: number; note: number; beats: number; gain: number }

/** G major lullaby: G – Em – C – D */
const MELODY: Note[] = [
  { at: 0, note: 71, beats: 1.5, gain: 0.072 },
  { at: 1.5, note: 74, beats: 0.5, gain: 0.05 },
  { at: 2, note: 76, beats: 1, gain: 0.07 },
  { at: 3, note: 74, beats: 0.5, gain: 0.052 },
  { at: 3.5, note: 76, beats: 0.5, gain: 0.058 },
  { at: 4, note: 74, beats: 1, gain: 0.058 },
  { at: 5, note: 71, beats: 1, gain: 0.052 },
  { at: 6, note: 69, beats: 1, gain: 0.062 },
  { at: 7, note: 67, beats: 0.5, gain: 0.048 },
  { at: 7.5, note: 69, beats: 0.5, gain: 0.054 },
  { at: 8, note: 67, beats: 1.5, gain: 0.064 },
  { at: 9.5, note: 69, beats: 0.5, gain: 0.046 },
  { at: 10, note: 71, beats: 1, gain: 0.068 },
  { at: 11, note: 69, beats: 0.5, gain: 0.05 },
  { at: 11.5, note: 71, beats: 0.5, gain: 0.056 },
  { at: 12, note: 74, beats: 1.5, gain: 0.06 },
  { at: 13.5, note: 71, beats: 0.5, gain: 0.048 },
  { at: 14, note: 69, beats: 1, gain: 0.058 },
  { at: 15, note: 71, beats: 0.5, gain: 0.05 },
  { at: 15.5, note: 69, beats: 0.5, gain: 0.052 },
  { at: 16, note: 76, beats: 1, gain: 0.066 },
  { at: 17, note: 74, beats: 1, gain: 0.056 },
  { at: 18, note: 71, beats: 1, gain: 0.052 },
  { at: 19, note: 69, beats: 1, gain: 0.048 },
  { at: 20, note: 67, beats: 1.5, gain: 0.06 },
  { at: 21.5, note: 69, beats: 0.5, gain: 0.044 },
  { at: 22, note: 71, beats: 1, gain: 0.064 },
  { at: 23, note: 74, beats: 0.5, gain: 0.052 },
  { at: 23.5, note: 71, beats: 0.5, gain: 0.056 },
  { at: 24, note: 69, beats: 1, gain: 0.054 },
  { at: 25, note: 71, beats: 1, gain: 0.056 },
  { at: 26, note: 74, beats: 1.5, gain: 0.062 },
  { at: 27.5, note: 76, beats: 0.5, gain: 0.05 },
  { at: 28, note: 74, beats: 1, gain: 0.055 },
  { at: 29, note: 71, beats: 1, gain: 0.05 },
  { at: 30, note: 67, beats: 1, gain: 0.068 },
  { at: 31, note: 69, beats: 0.5, gain: 0.05 },
  { at: 31.5, note: 67, beats: 0.5, gain: 0.058 },
]

const BASS: Note[] = [
  { at: 0, note: 43, beats: 4, gain: 0.038 },
  { at: 4, note: 50, beats: 4, gain: 0.032 },
  { at: 8, note: 40, beats: 4, gain: 0.038 },
  { at: 12, note: 47, beats: 4, gain: 0.03 },
  { at: 16, note: 48, beats: 4, gain: 0.036 },
  { at: 20, note: 52, beats: 4, gain: 0.03 },
  { at: 24, note: 38, beats: 4, gain: 0.036 },
  { at: 28, note: 45, beats: 2, gain: 0.03 },
  { at: 30, note: 43, beats: 2, gain: 0.034 },
]

const CHORDS: { at: number; beats: number; tones: number[] }[] = [
  { at: 0, beats: 8, tones: [55, 59, 62, 67] },
  { at: 8, beats: 8, tones: [52, 55, 59, 64] },
  { at: 16, beats: 8, tones: [48, 52, 55, 60] },
  { at: 24, beats: 8, tones: [50, 54, 57, 62] },
]

let ctx: AudioContext | null = null
let master: GainNode | null = null
let timer = 0
let nextLoop = 0
let started = false
let listening = false

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  return ctx
}

function ensureGraph(audio: AudioContext) {
  if (master) return
  master = audio.createGain()
  master.gain.value = 0.48
  master.connect(audio.destination)
}

function pluck(when: number, freq: number, dur: number, gain: number) {
  if (!ctx || !master) return
  const mix = ctx.createGain()
  mix.connect(master)
  const partials: [number, number][] = [
    [1, 1],
    [2, 0.18],
    [3, 0.06],
  ]
  for (const [mult, amp] of partials) {
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq * mult
    env.gain.setValueAtTime(0.0001, when)
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain * amp), when + 0.01)
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain * amp * 0.28), when + Math.min(0.22, dur * 0.28))
    env.gain.exponentialRampToValueAtTime(0.0001, when + dur)
    osc.connect(env)
    env.connect(mix)
    osc.start(when)
    osc.stop(when + dur + 0.04)
  }
}

function scheduleArp(origin: number) {
  const step = 0.5
  for (const chord of CHORDS) {
    const pattern = [0, 2, 1, 2, 3, 2, 1, 2]
    const count = Math.floor(chord.beats / step)
    for (let i = 0; i < count; i += 1) {
      const tone = chord.tones[pattern[i % pattern.length]]
      const at = origin + (chord.at + i * step) * BEAT
      pluck(at, midi(tone), 0.72, 0.016)
    }
  }
}

function scheduleLoop(origin: number) {
  scheduleArp(origin)
  for (const note of BASS) {
    pluck(origin + note.at * BEAT, midi(note.note), note.beats * BEAT * 0.95, note.gain)
  }
  for (const note of MELODY) {
    const when = origin + note.at * BEAT
    const dur = note.beats * BEAT * 0.98
    pluck(when, midi(note.note), dur, note.gain)
  }
}

function tick() {
  if (!ctx || !master || isMusicMuted() || ctx.state !== 'running') return
  while (nextLoop < ctx.currentTime + LOOP + 0.4) {
    scheduleLoop(nextLoop)
    nextLoop += LOOP
  }
}

function wantPlay() {
  return typeof document !== 'undefined' && !document.hidden && !isMusicMuted()
}

async function run() {
  started = true
  const audio = context()
  if (!audio) return
  ensureGraph(audio)
  if (wantPlay()) {
    if (audio.state === 'suspended') await audio.resume().catch(() => {})
    if (nextLoop < audio.currentTime + 0.05) nextLoop = audio.currentTime + 0.08
    tick()
    if (!timer) timer = window.setInterval(tick, 500)
  } else {
    if (timer) {
      window.clearInterval(timer)
      timer = 0
    }
    if (audio.state === 'running') await audio.suspend().catch(() => {})
  }
}

function armUnlock() {
  if (listening || typeof window === 'undefined') return
  listening = true
  const unlock = () => {
    started = true
    void run()
  }
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
}

export function startBgm() {
  if (typeof window === 'undefined') return () => {}
  armUnlock()
  const onVis = () => {
    if (started) void run()
  }
  document.addEventListener('visibilitychange', onVis)
  const unsub = subscribeAudio(() => {
    if (started || !isMusicMuted()) void run()
    if (!isMusicMuted()) armUnlock()
  })
  if (started) void run()
  return () => {
    unsub()
    document.removeEventListener('visibilitychange', onVis)
    if (timer) {
      window.clearInterval(timer)
      timer = 0
    }
    if (ctx && ctx.state === 'running') void ctx.suspend().catch(() => {})
  }
}
