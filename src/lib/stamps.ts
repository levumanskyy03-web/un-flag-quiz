import { COUNTRIES } from '../data/countries'
import { astroById } from '../data/astro'
import { termById } from '../data/leaders'
import { mathById } from '../data/math'
import { themeById } from '../data/theme'
import {
  CODES_MODES,
  isCorrect,
  isRankingMode,
  mathIsGenerated,
  QUIZ_MODES,
  themeWorldOf,
  worldOfMode,
  type PlayPath,
  type QuizDifficulty,
  type QuizMode,
  type QuizWorld,
  type RoundAnswer,
  type RoundEnd,
} from './quiz'
import { useSyncExternalStore } from 'react'

export const STAMPS_KEY = 'un-flag-quiz-stamps'
export const WORLD_STAMPS_KEY = 'un-flag-quiz-world-stamps'
export const STAMP_TOTAL = COUNTRIES.length
export const STAMP_MAX = 5

const COUNTRY_ISOS = new Set(COUNTRIES.map((country) => country.iso))
const GEO_MODES = new Set<string>([...QUIZ_MODES, ...CODES_MODES])

export interface StampEntry {
  n: number
  modes: string[]
}

export type StampAlbum = Record<string, StampEntry>
export type WorldStampAlbums = Partial<Record<QuizWorld, StampAlbum>>

export interface StampAwardContext {
  path: PlayPath
  modeFallback: QuizMode
  difficulty: QuizDifficulty
  endedBy: RoundEnd
  hardcore?: boolean
}

export function isStampIso(iso: string): boolean {
  return COUNTRY_ISOS.has(iso)
}

function isStampMode(mode: QuizMode): boolean {
  return GEO_MODES.has(mode) || isRankingMode(mode)
}

function cloneAlbum(album: StampAlbum): StampAlbum {
  const next: StampAlbum = {}
  for (const [iso, entry] of Object.entries(album)) {
    next[iso] = { n: entry.n, modes: [...entry.modes] }
  }
  return next
}

function isCollectId(id: string): boolean {
  return id.length > 0 && id.length < 96
}

function parseAlbum(raw: unknown, allow: (id: string) => boolean): StampAlbum {
  if (Array.isArray(raw)) {
    const album: StampAlbum = {}
    for (const item of raw) {
      if (typeof item === 'string' && allow(item)) {
        album[item] = { n: 1, modes: [] }
      }
    }
    return album
  }
  if (!raw || typeof raw !== 'object') return {}
  const album: StampAlbum = {}
  for (const [iso, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!allow(iso) || !value || typeof value !== 'object') continue
    const record = value as { n?: unknown; modes?: unknown }
    const n = Math.min(STAMP_MAX, Math.max(0, Math.floor(Number(record.n))))
    if (n <= 0) continue
    const modes = Array.isArray(record.modes)
      ? record.modes.filter((mode): mode is string => typeof mode === 'string')
      : []
    album[iso] = { n, modes }
  }
  return album
}

type Listener = () => void
const listeners = new Set<Listener>()

function emitStamps() {
  for (const listener of listeners) listener()
}

function saveGeoAlbum(album: StampAlbum) {
  const raw = JSON.stringify(album)
  geoCache = album
  geoRaw = raw
  localStorage.setItem(STAMPS_KEY, raw)
  emitStamps()
}

function saveWorldMap(map: WorldStampAlbums) {
  const payload: WorldStampAlbums = { ...map }
  delete payload.geo
  const raw = JSON.stringify(payload)
  worldCache = payload
  worldRaw = raw
  localStorage.setItem(WORLD_STAMPS_KEY, raw)
  emitStamps()
}

export function subscribeStamps(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const EMPTY_ALBUM: StampAlbum = {}
let geoCache: StampAlbum = EMPTY_ALBUM
let geoRaw: string | null = null
let worldCache: WorldStampAlbums = {}
let worldRaw: string | null = null

export function useStamps() {
  return useSyncExternalStore(subscribeStamps, loadStamps, () => EMPTY_ALBUM)
}

export function useWorldStamps(world: QuizWorld) {
  return useSyncExternalStore(
    subscribeStamps,
    () => loadWorldStamps(world),
    () => EMPTY_ALBUM,
  )
}

export function loadStamps(): StampAlbum {
  if (typeof window === 'undefined') return EMPTY_ALBUM
  try {
    const raw = localStorage.getItem(STAMPS_KEY)
    if (raw === geoRaw) return geoCache
    geoRaw = raw
    if (raw === null) {
      geoCache = EMPTY_ALBUM
      return geoCache
    }
    const parsed: unknown = JSON.parse(raw)
    const album = parseAlbum(parsed, isStampIso)
    if (Array.isArray(parsed)) {
      geoCache = album
      saveGeoAlbum(album)
      return album
    }
    geoCache = album
    return album
  } catch {
    geoCache = EMPTY_ALBUM
    return geoCache
  }
}

function loadWorldMap(): WorldStampAlbums {
  if (typeof window === 'undefined') return worldCache
  try {
    const raw = localStorage.getItem(WORLD_STAMPS_KEY)
    if (raw === worldRaw) return worldCache
    worldRaw = raw
    if (raw === null) {
      worldCache = {}
      return worldCache
    }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      worldCache = {}
      return worldCache
    }
    const map: WorldStampAlbums = {}
    for (const [world, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (world === 'geo') continue
      map[world as QuizWorld] = parseAlbum(value, isCollectId)
    }
    worldCache = map
    return worldCache
  } catch {
    worldCache = {}
    return worldCache
  }
}

export function loadWorldStamps(world: QuizWorld): StampAlbum {
  if (world === 'geo') return loadStamps()
  return loadWorldMap()[world] ?? EMPTY_ALBUM
}

export function loadWorldStampAlbums(): WorldStampAlbums {
  return { geo: loadStamps(), ...loadWorldMap() }
}

export function stampCopies(album: StampAlbum, iso: string): number {
  return album[iso]?.n ?? 0
}

export function hasStamp(album: StampAlbum, iso: string): boolean {
  return stampCopies(album, iso) > 0
}

export function stampCopyCount(album: StampAlbum): number {
  return Object.values(album).reduce((sum, entry) => sum + entry.n, 0)
}

export function stampCountryCount(album: StampAlbum): number {
  return Object.values(album).filter((entry) => entry.n > 0).length
}

function canEarnNext(
  next: number,
  mode: QuizMode,
  modes: readonly string[],
  difficulty: QuizDifficulty,
  perfect: boolean,
  completed: boolean,
  hardcore: boolean,
): boolean {
  if (next === 1) return true
  if (next === 2) return !modes.includes(mode)
  if (next === 3) return difficulty === 'hard' || difficulty === 'hardcore'
  if (next === 4) return perfect
  if (next === 5) return (hardcore || difficulty === 'hardcore') && completed
  return false
}

function stampKey(answer: RoundAnswer, modeFallback: QuizMode): { world: QuizWorld; id: string } | null {
  const mode = answer.question.mode ?? modeFallback
  const world = worldOfMode(mode)
  const iso = answer.question.country.iso
  if (world === 'geo') {
    if (!isStampIso(iso) || !isStampMode(mode)) return null
    return { world, id: iso }
  }
  if (world === 'leaders') {
    const term = termById(iso)
    if (!term) return null
    return { world, id: term.personId }
  }
  if (world === 'football') {
    if (!isCollectId(iso)) return null
    return { world, id: iso }
  }
  if (world === 'math') {
    if (mathIsGenerated(mode) || iso.startsWith('mg-') || iso.startsWith('mgl-')) {
      return { world, id: `mode:${mode}` }
    }
    const item = mathById(iso)
    if (!item) return null
    return { world, id: item.personId ? `person:${item.personId}` : item.id }
  }
  if (world === 'astronomy') {
    const item = astroById(iso)
    if (!item) return null
    if (item.personId) return { world, id: `person:${item.personId}` }
    if (item.key.startsWith('mo:')) return { world, id: item.key }
    if (item.body) return { world, id: `body:${item.body}` }
    return { world, id: item.id }
  }
  const item = themeById(iso)
  if (!item || themeWorldOf(item.mode) !== world) return null
  return { world, id: item.id }
}

function applyAward(
  album: StampAlbum,
  id: string,
  mode: QuizMode,
  difficulty: QuizDifficulty,
  perfect: boolean,
  completed: boolean,
  hardcore: boolean,
): boolean {
  const entry = album[id] ?? { n: 0, modes: [] }
  if (entry.n >= STAMP_MAX) return false
  const next = entry.n + 1
  if (!canEarnNext(next, mode, entry.modes, difficulty, perfect, completed, hardcore)) return false
  album[id] = {
    n: next,
    modes: entry.modes.includes(mode) ? entry.modes : [...entry.modes, mode],
  }
  return true
}

export function awardRoundStamps(answers: readonly RoundAnswer[], ctx: StampAwardContext): StampAlbum {
  const geo = loadStamps()
  if (ctx.path !== 'pool' && ctx.path !== 'levels') return geo

  const completed = ctx.endedBy === 'complete'
  const perfect = completed && answers.length > 0 && answers.every(isCorrect)
  const awarded = new Set<string>()
  const worlds = loadWorldMap()
  let geoChanged = false
  const worldChanged = new Set<QuizWorld>()

  for (const answer of answers) {
    if (!isCorrect(answer)) continue
    const key = stampKey(answer, ctx.modeFallback)
    if (!key) continue
    const token = `${key.world}:${key.id}`
    if (awarded.has(token)) continue
    const mode = answer.question.mode ?? ctx.modeFallback
    const album = key.world === 'geo' ? geo : (worlds[key.world] ?? (worlds[key.world] = {}))
    if (
      !applyAward(album, key.id, mode, ctx.difficulty, perfect, completed, Boolean(ctx.hardcore))
    ) {
      continue
    }
    awarded.add(token)
    if (key.world === 'geo') geoChanged = true
    else worldChanged.add(key.world)
  }

  if (geoChanged) saveGeoAlbum(geo)
  if (worldChanged.size > 0) saveWorldMap(worlds)
  return cloneAlbum(geo)
}

export function takeStampCopy(iso: string): boolean {
  if (!isStampIso(iso)) return false
  const album = loadStamps()
  const entry = album[iso]
  if (!entry || entry.n < 2) return false
  const n = entry.n - 1
  if (n <= 0) delete album[iso]
  else album[iso] = { ...entry, n }
  saveGeoAlbum(album)
  return true
}

export function returnStampCopy(iso: string) {
  if (!isStampIso(iso)) return
  const album = loadStamps()
  const entry = album[iso] ?? { n: 0, modes: [] }
  album[iso] = { ...entry, n: Math.min(STAMP_MAX, entry.n + 1) }
  saveGeoAlbum(album)
}
