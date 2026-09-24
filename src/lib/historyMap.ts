import { historyMapUrl, nearestHistorySnapshot } from '../data/history/snapshots'

export interface HistoryMapFeature {
  id: string
  name: string
  d: string
  /** 'd' dependent territory, 'x' people without a state, 'u' unmapped; absent = state. */
  k?: 'd' | 'x' | 'u'
  /** Palette slot; dependents share their suzerain's. */
  c?: number
  /** Suzerain map id for dependents and detached territories. */
  p?: string
  /** Modern ISO where a detached territory lies. */
  m?: string
  /** Area on this snapshot, km². */
  a?: number
  /** Label anchor: x, y and free radius in SVG units. */
  l?: [number, number, number]
}

export interface HistoryMapData {
  year: number
  viewBox: string
  features: HistoryMapFeature[]
}

const cache = new Map<number, Promise<HistoryMapData>>()

export function loadHistoryMap(year: number): Promise<HistoryMapData> {
  const snapshot = nearestHistorySnapshot(year)
  const hit = cache.get(snapshot)
  if (hit) return hit
  const next = fetch(historyMapUrl(snapshot)).then(async (response) => {
    if (!response.ok) throw new Error(`history map ${snapshot}`)
    return (await response.json()) as HistoryMapData
  })
  cache.set(snapshot, next)
  return next
}
