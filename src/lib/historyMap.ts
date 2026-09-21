import { historyMapUrl, nearestHistorySnapshot } from '../data/history/snapshots'

export interface HistoryMapFeature {
  id: string
  name: string
  d: string
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
