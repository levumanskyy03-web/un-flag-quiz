import { COUNTRIES } from './countries'
import { EXTRA_COUNTRIES } from './extras'
import { HOLDOUT_BY_ISO, TERRITORIES, TERRITORY_BY_ISO } from './territories'

export interface WorldLocation {
  id: string
  name: string
  path: string
}

export interface WorldMapData {
  viewBox: string
  locations: WorldLocation[]
}

export interface WorldMarker {
  iso: string
  x: number
  y: number
}

const CLICKABLE_ISOS = new Set([
  ...COUNTRIES.map((country) => country.iso),
  ...EXTRA_COUNTRIES.map((country) => country.iso),
  ...TERRITORY_BY_ISO.keys(),
  ...HOLDOUT_BY_ISO.keys(),
])
const MARKER_PATH_MAX = 360

export function isClickableIso(iso: string) {
  return CLICKABLE_ISOS.has(iso)
}

export function markersFor(locations: WorldLocation[]): WorldMarker[] {
  const markers: WorldMarker[] = []
  const seen = new Set<string>()
  for (const location of locations) {
    if (!CLICKABLE_ISOS.has(location.id) || location.path.length >= MARKER_PATH_MAX) continue
    const match = location.path.match(/m\s+(-?[\d.]+),(-?[\d.]+)/i)
    if (!match) continue
    markers.push({ iso: location.id, x: Number(match[1]), y: Number(match[2]) })
    seen.add(location.id)
  }
  for (const territory of TERRITORIES) {
    if (!territory.marker || seen.has(territory.iso)) continue
    markers.push({ iso: territory.iso, x: territory.marker.x, y: territory.marker.y })
  }
  return markers
}
