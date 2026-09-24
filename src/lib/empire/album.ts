import { COUNTRIES, REGIONS, type Region } from '../../data/countries'
import { stampCatalog, type StampGroupId } from '../stampCatalog'
import { type StampAlbum, type WorldStampAlbums } from '../stamps'
import { QUIZ_WORLDS, type QuizWorld } from '../quiz/core'
import type { AlbumReport, AlbumSummary } from './rules'

/**
 * Прочтение альбома марок поверх `stamps.ts` (docs/economy.md §5): редкость карточки,
 * наборы и сводка для Империи. Клиентский модуль — тянет каталоги марок.
 */

export type StampRarity = 'common' | 'rare' | 'epic' | 'legendary'
export const STAMP_RARITIES: readonly StampRarity[] = ['common', 'rare', 'epic', 'legendary']

function hash32(input: string) {
  // FNV-1a
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Детерминированная редкость: 70 % обычные, 22 % редкие, 7 % эпические, 1 % легендарные. */
export function stampRarity(world: QuizWorld, id: string): StampRarity {
  const roll = hash32(`${world}:${id}`) % 100
  if (roll < 70) return 'common'
  if (roll < 92) return 'rare'
  if (roll < 99) return 'epic'
  return 'legendary'
}

export type StampSet = { id: string; ids: readonly string[] }

const SETS: Partial<Record<QuizWorld, StampSet[]>> = {}

/** Наборы мира: регионы для гео, группы каталога для остальных. */
export function stampSets(world: QuizWorld): StampSet[] {
  const cached = SETS[world]
  if (cached) return cached
  let next: StampSet[]
  if (world === 'geo') {
    next = REGIONS.map((region: Region) => ({
      id: region,
      ids: COUNTRIES.filter((c) => c.region === region).map((c) => c.iso),
    }))
  } else {
    const byGroup = new Map<StampGroupId, string[]>()
    for (const card of stampCatalog(world)) {
      const list = byGroup.get(card.group) ?? []
      list.push(card.id)
      byGroup.set(card.group, list)
    }
    next = [...byGroup.entries()].filter(([, ids]) => ids.length >= 3).map(([id, ids]) => ({ id, ids }))
  }
  SETS[world] = next
  return next
}

export function setComplete(album: StampAlbum, set: StampSet) {
  return set.ids.every((id) => (album[id]?.n ?? 0) > 0)
}

export function completedSets(world: QuizWorld, album: StampAlbum): StampSet[] {
  return stampSets(world).filter((set) => setComplete(album, set))
}

export function albumSummary(world: QuizWorld, album: StampAlbum): AlbumSummary {
  let countries = 0
  let rare = 0
  for (const [id, entry] of Object.entries(album)) {
    if ((entry?.n ?? 0) <= 0) continue
    countries += 1
    const r = stampRarity(world, id)
    if (r === 'epic' || r === 'legendary') rare += 1
  }
  return { countries, sets: completedSets(world, album).length, rare }
}

/** Сводка по всем мирам плюс ключи полных наборов `${world}:${setId}`. */
export function albumReport(albums: WorldStampAlbums): { report: AlbumReport; sets: string[] } {
  const report: AlbumReport = {}
  const sets: string[] = []
  for (const world of QUIZ_WORLDS) {
    const album = albums[world]
    if (!album || Object.keys(album).length === 0) continue
    report[world] = albumSummary(world, album)
    for (const set of completedSets(world, album)) sets.push(`${world}:${set.id}`)
  }
  return { report, sets }
}
