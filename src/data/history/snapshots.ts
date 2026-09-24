export const HISTORY_YEAR_MIN = 1500

/** Wider than the 1010×666 modern map: crop polar empty space, less square. */
export const HISTORY_MAP_VIEWBOX = '-80 42 1170 500'

export const HISTORY_SNAPSHOTS = [
  1500, 1530, 1600, 1650, 1700, 1715, 1783, 1800, 1815, 1878, 1880, 1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994,
  2000, 2010,
] as const

export type HistorySnapshotYear = (typeof HISTORY_SNAPSHOTS)[number]

export function historyYearMax(at = new Date()) {
  return at.getFullYear()
}

export function nearestHistorySnapshot(year: number): HistorySnapshotYear {
  const clamped = Math.min(HISTORY_SNAPSHOTS[HISTORY_SNAPSHOTS.length - 1], Math.max(HISTORY_SNAPSHOTS[0], year))
  let best: HistorySnapshotYear = HISTORY_SNAPSHOTS[0]
  let bestDist = Math.abs(clamped - best)
  for (const snapshot of HISTORY_SNAPSHOTS) {
    const dist = Math.abs(clamped - snapshot)
    if (dist < bestDist || (dist === bestDist && snapshot <= clamped)) {
      best = snapshot
      bestDist = dist
    }
  }
  return best
}

export function historyMapUrl(year: number) {
  return `/maps/history/${nearestHistorySnapshot(year)}.json`
}

export function useModernWorldMap(year: number, at = new Date()) {
  return year >= historyYearMax(at)
}
