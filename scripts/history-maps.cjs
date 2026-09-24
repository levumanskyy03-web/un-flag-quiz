#!/usr/bin/env node
/**
 * Download historical-basemaps GeoJSON and emit simplified SVG-path maps.
 * Source: https://github.com/aourednik/historical-basemaps (CC BY).
 * The UI picks the nearest snapshot (honest: no day-by-day GIS). CShapes 2.0
 * yearly polygons are not shipped (file size); 1886–2019 still uses these slices.
 */
const fs = require('fs')
const path = require('path')
const { YEARS, OUT, ISO2, mapId, loadYear } = require('./history-lib.cjs')

const WIDTH = 1010
const HEIGHT = 666
/** Crop poles and add side ocean so the history maps are less square. */
const VIEWBOX = '-80 42 1170 500'
const EPSILON = 1.15


function project(lon, lat) {
  const x = ((Number(lon) + 180) / 360) * WIDTH
  const y = ((90 - Number(lat)) / 180) * HEIGHT
  return [x, y]
}

function distPointSeg(p, a, b) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1])
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))
}

function rdp(points, epsilon) {
  if (points.length < 3) return points
  let maxD = 0
  let idx = 0
  const end = points.length - 1
  for (let i = 1; i < end; i += 1) {
    const d = distPointSeg(points[i], points[0], points[end])
    if (d > maxD) {
      idx = i
      maxD = d
    }
  }
  if (maxD > epsilon) {
    const left = rdp(points.slice(0, idx + 1), epsilon)
    const right = rdp(points.slice(idx), epsilon)
    return left.slice(0, -1).concat(right)
  }
  return [points[0], points[end]]
}

function ringPath(ring) {
  const pts = []
  for (const coord of ring) {
    if (!Array.isArray(coord) || coord.length < 2) continue
    pts.push(project(coord[0], coord[1]))
  }
  if (pts.length < 4) return ''
  const simple = rdp(pts, EPSILON)
  if (simple.length < 3) return ''
  let d = `M${simple[0][0].toFixed(1)} ${simple[0][1].toFixed(1)}`
  for (let i = 1; i < simple.length; i += 1) {
    d += `L${simple[i][0].toFixed(1)} ${simple[i][1].toFixed(1)}`
  }
  return `${d}Z`
}

function geomPaths(geom) {
  if (!geom) return []
  if (geom.type === 'Polygon') return [geom.coordinates.map(ringPath).filter(Boolean).join('')]
  if (geom.type === 'MultiPolygon') {
    return geom.coordinates.map((poly) => poly.map(ringPath).filter(Boolean).join('')).filter(Boolean)
  }
  return []
}

function walkCoords(node, out) {
  if (!Array.isArray(node) || node.length === 0) return
  if (typeof node[0] === 'number') {
    out.push(node)
    return
  }
  for (const child of node) walkCoords(child, out)
}

function geomBBox(geom) {
  const coords = []
  walkCoords(geom && geom.coordinates, coords)
  if (coords.length === 0) return null
  let minLon = Infinity
  let minLat = Infinity
  let maxLon = -Infinity
  let maxLat = -Infinity
  let slon = 0
  let slat = 0
  for (const [lon, lat] of coords) {
    minLon = Math.min(minLon, lon)
    minLat = Math.min(minLat, lat)
    maxLon = Math.max(maxLon, lon)
    maxLat = Math.max(maxLat, lat)
    slon += lon
    slat += lat
  }
  return { minLon, minLat, maxLon, maxLat, lon: slon / coords.length, lat: slat / coords.length }
}

const AFRICA_BLANK_NAMES = new Set([
  '',
  'africa',
  'unknown',
  'none',
  'bantu peoples',
  'west african cereal farmers',
  'khoisan',
])

/** Unlabeled African land (European “unknown” and ethnographic catch-alls). */
function isUnlabeledAfrica(box, name) {
  if (!box) return false
  const key = String(name || '').toLowerCase()
  if (!AFRICA_BLANK_NAMES.has(key) && key !== 'unknown') return false
  if (box.maxLat < -36 || box.minLat > 37) return false
  if (box.maxLon < -18 || box.minLon > 52) return false
  if (box.minLat > 34 && box.minLon > 19 && box.maxLon < 30) return false
  if (box.minLon > 35 && box.minLat > 12) return false
  return box.minLat < 34 && box.maxLat > -35
}

function isAfricaMainlandTarget(box, name) {
  if (!box) return false
  const key = String(name).toLowerCase()
  if (!key || key === 'africa' || key === 'unknown') return false
  if (key === 'guanches' || key === 'nejd' || key === 'yemen') return false
  if (key === 'sotho' && box.lat > -20) return false
  if (box.lon < -13 && box.lat > 26) return false
  if (box.lon > 43) return false
  return box.lon >= -18 && box.lon <= 42 && box.lat >= -35 && box.lat <= 37
}

function isMadagascarTarget(box, name) {
  if (!box) return false
  const key = String(name).toLowerCase()
  if (!key.includes('madagascar') && !key.includes('merina') && !key.includes('imerina')) return false
  return box.lon > 42 && box.lat < -11 && box.lat > -27
}

function africaTarget(id, name, box) {
  const span = Math.max(box.maxLon - box.minLon, box.maxLat - box.minLat, 1.5)
  const key = String(name).toLowerCase()
  let reach = Math.min(6, Math.max(1.6, Math.sqrt(span)))
  if (key.includes('zanzibar')) reach = Math.min(reach, 2.2)
  return {
    id,
    name,
    lon: box.lon,
    lat: box.lat,
    reach,
  }
}

function pointInRing(lon, lat, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = Number(ring[i][0])
    const yi = Number(ring[i][1])
    const xj = Number(ring[j][0])
    const yj = Number(ring[j][1])
    if (yi === yj) continue
    const hit = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    if (hit) inside = !inside
  }
  return inside
}

function pointInGeom(lon, lat, geom) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : []
  for (const poly of polys) {
    if (!poly || poly.length === 0) continue
    if (!pointInRing(lon, lat, poly[0])) continue
    let hole = false
    for (let i = 1; i < poly.length; i += 1) {
      if (pointInRing(lon, lat, poly[i])) hole = true
    }
    if (!hole) return true
  }
  return false
}

function keyPt(x, y) {
  return `${x.toFixed(4)},${y.toFixed(4)}`
}

function ringsFromCells(cells, originLon, originLat, step) {
  const forward = new Map()
  function addEdge(ax, ay, bx, by) {
    const a = keyPt(ax, ay)
    const b = keyPt(bx, by)
    const rev = `${b}->${a}`
    if (forward.has(rev)) {
      forward.delete(rev)
      return
    }
    forward.set(`${a}->${b}`, [
      [ax, ay],
      [bx, by],
    ])
  }
  for (const [i, j] of cells) {
    const x0 = originLon + i * step
    const y0 = originLat + j * step
    const x1 = x0 + step
    const y1 = y0 + step
    addEdge(x0, y0, x1, y0)
    addEdge(x1, y0, x1, y1)
    addEdge(x1, y1, x0, y1)
    addEdge(x0, y1, x0, y0)
  }
  const byStart = new Map()
  for (const [a, b] of [...forward.values()]) {
    const k = keyPt(a[0], a[1])
    if (!byStart.has(k)) byStart.set(k, [])
    byStart.get(k).push(b)
  }
  const rings = []
  while (byStart.size > 0) {
    const startKey = byStart.keys().next().value
    const start = startKey.split(',').map(Number)
    const ring = [[start[0], start[1]]]
    let cur = start
    for (let n = 0; n < 20000; n += 1) {
      const ck = keyPt(cur[0], cur[1])
      const nexts = byStart.get(ck)
      if (!nexts || nexts.length === 0) break
      const nxt = nexts.pop()
      if (nexts.length === 0) byStart.delete(ck)
      ring.push(nxt)
      if (keyPt(nxt[0], nxt[1]) === startKey) break
      cur = nxt
    }
    if (ring.length >= 4) {
      const simplified = []
      for (const pt of ring) {
        const prev = simplified[simplified.length - 2]
        const last = simplified[simplified.length - 1]
        if (last && last[0] === pt[0] && last[1] === pt[1]) continue
        if (prev && last && ((prev[0] === last[0] && last[0] === pt[0]) || (prev[1] === last[1] && last[1] === pt[1]))) {
          simplified[simplified.length - 1] = pt
        } else {
          simplified.push(pt)
        }
      }
      rings.push(simplified)
    }
  }
  return rings
}

function ringArea(ring) {
  let area = 0
  for (let i = 0; i < ring.length - 1; i += 1) {
    area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
  }
  return area / 2
}

function ringCentroid(ring) {
  let lon = 0
  let lat = 0
  const n = Math.max(ring.length - 1, 1)
  for (let i = 0; i < n; i += 1) {
    lon += ring[i][0]
    lat += ring[i][1]
  }
  return [lon / n, lat / n]
}

function assemblePolygons(rings) {
  const items = rings
    .map((ring) => ({ ring, area: Math.abs(ringArea(ring)), centroid: ringCentroid(ring) }))
    .filter((item) => item.area > 1e-6)
    .sort((a, b) => b.area - a.area)
  const used = new Set()
  const polys = []
  for (let i = 0; i < items.length; i += 1) {
    if (used.has(i)) continue
    const holes = []
    for (let j = i + 1; j < items.length; j += 1) {
      if (used.has(j)) continue
      if (pointInRing(items[j].centroid[0], items[j].centroid[1], items[i].ring)) {
        holes.push(items[j].ring)
        used.add(j)
      }
    }
    used.add(i)
    polys.push([items[i].ring, ...holes])
  }
  return polys
}

function nearestAfricaTarget(lon, lat, targets) {
  let best = null
  let bestScore = Infinity
  for (const target of targets) {
    const dlon = (lon - target.lon) * Math.cos(((lat + target.lat) / 2) * (Math.PI / 180))
    const dlat = lat - target.lat
    const dist = Math.hypot(dlon, dlat)
    const score = dist / target.reach
    if (score < bestScore) {
      bestScore = score
      best = target
    }
  }
  return best
}

/** Paint unlabeled African interior onto nearby named polities instead of one giant “unknown”. */
function fillUnlabeledAfrica(geom, targets, madagascarTargets) {
  const box = geomBBox(geom)
  if (!box || (targets.length === 0 && madagascarTargets.length === 0)) return []
  const STEP = 0.55
  const minLon = Math.max(-18, Math.floor(box.minLon / STEP) * STEP)
  const maxLon = Math.min(52, Math.ceil(box.maxLon / STEP) * STEP)
  const minLat = Math.max(-35, Math.floor(box.minLat / STEP) * STEP)
  const maxLat = Math.min(34, Math.ceil(box.maxLat / STEP) * STEP)
  const nx = Math.round((maxLon - minLon) / STEP)
  const ny = Math.round((maxLat - minLat) / STEP)
  const cellsById = new Map()
  const meta = new Map()
  for (let i = 0; i < nx; i += 1) {
    for (let j = 0; j < ny; j += 1) {
      const cx = minLon + (i + 0.5) * STEP
      const cy = minLat + (j + 0.5) * STEP
      if (!pointInGeom(cx, cy, geom)) continue
      const onMadagascar = cx > 42.5 && cy < -11 && cy > -27
      const pool = onMadagascar && madagascarTargets.length > 0 ? madagascarTargets : targets
      const target = nearestAfricaTarget(cx, cy, pool)
      if (!target) continue
      if (!cellsById.has(target.id)) cellsById.set(target.id, [])
      cellsById.get(target.id).push([i, j])
      meta.set(target.id, target)
    }
  }
  const assigned = []
  for (const [id, cells] of cellsById) {
    const rings = ringsFromCells(cells, minLon, minLat, STEP)
    if (rings.length === 0) continue
    const polys = assemblePolygons(rings)
    if (polys.length === 0) continue
    const target = meta.get(id)
    assigned.push({ id, name: target.name, polys })
  }
  return assigned
}

function polygonsOf(geom) {
  if (!geom) return []
  if (geom.type === 'Polygon') return [geom]
  if (geom.type === 'MultiPolygon') {
    return (geom.coordinates || []).map((coordinates) => ({ type: 'Polygon', coordinates }))
  }
  return []
}


const PALETTE_SIZE = 8
/** Detached parts farther than this (degrees) from the core become their own territory. */
const EXCLAVE_GAP = 7
const EARTH_R = 6371.0088
const CARDS_INDEX = path.join(OUT, 'cards', 'index.json')

function readCardKinds() {
  if (!fs.existsSync(CARDS_INDEX)) return {}
  return JSON.parse(fs.readFileSync(CARDS_INDEX, 'utf8'))
}

function ringAreaKm2(ring) {
  let sum = 0
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [lon1, lat1] = ring[i]
    const [lon2, lat2] = ring[i + 1]
    sum +=
      ((lon2 - lon1) * Math.PI) / 180 *
      (2 + Math.sin((lat1 * Math.PI) / 180) + Math.sin((lat2 * Math.PI) / 180))
  }
  return Math.abs((sum * EARTH_R * EARTH_R) / 2)
}

function polyAreaKm2(poly) {
  if (!poly || poly.length === 0) return 0
  let area = ringAreaKm2(poly[0])
  for (let i = 1; i < poly.length; i += 1) area -= ringAreaKm2(poly[i])
  return Math.max(0, area)
}

function polyBox(poly) {
  let minLon = Infinity
  let minLat = Infinity
  let maxLon = -Infinity
  let maxLat = -Infinity
  for (const [lon, lat] of poly[0] || []) {
    minLon = Math.min(minLon, lon)
    minLat = Math.min(minLat, lat)
    maxLon = Math.max(maxLon, lon)
    maxLat = Math.max(maxLat, lat)
  }
  return { minLon, minLat, maxLon, maxLat, lon: (minLon + maxLon) / 2, lat: (minLat + maxLat) / 2 }
}

/** Gap between two boxes in degrees, wrapping at the antimeridian. */
function boxGap(a, b) {
  const lonGap = (x, y) => Math.max(0, Math.max(x.minLon, y.minLon) - Math.min(x.maxLon, y.maxLon))
  const shifted = { ...b, minLon: b.minLon + 360, maxLon: b.maxLon + 360 }
  const back = { ...b, minLon: b.minLon - 360, maxLon: b.maxLon - 360 }
  const dLon = Math.min(lonGap(a, b), lonGap(a, shifted), lonGap(a, back))
  const dLat = Math.max(0, Math.max(a.minLat, b.minLat) - Math.min(a.maxLat, b.maxLat))
  return Math.hypot(dLon, dLat)
}

function polysPath(polys) {
  return polys.map((poly) => poly.map(ringPath).filter(Boolean).join('')).filter(Boolean).join('')
}

function distToSegment(px, py, ax, ay, bx, by) {
  return distPointSeg([px, py], [ax, ay], [bx, by])
}

/** Interior point far from the edges of the largest polygon (for a label), in SVG units. */
function labelAnchor(polys) {
  let best = null
  let bestArea = 0
  for (const poly of polys) {
    const area = polyAreaKm2(poly)
    if (area > bestArea) {
      bestArea = area
      best = poly
    }
  }
  if (!best) return undefined
  const rings = best.map((ring) => ring.map(([lon, lat]) => project(lon, lat)))
  const outer = rings[0]
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const [x, y] of outer) {
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  }
  const inside = (x, y) => pointInRing(x, y, outer) && !rings.slice(1).some((ring) => pointInRing(x, y, ring))
  const edgeDist = (x, y) => {
    let d = Infinity
    for (const ring of rings) {
      for (let i = 0; i < ring.length - 1; i += 1) {
        d = Math.min(d, distToSegment(x, y, ring[i][0], ring[i][1], ring[i + 1][0], ring[i + 1][1]))
      }
    }
    return d
  }
  let top = { x: (minX + maxX) / 2, y: (minY + maxY) / 2, r: 0 }
  const search = (x0, y0, x1, y1, steps) => {
    for (let i = 0; i <= steps; i += 1) {
      for (let j = 0; j <= steps; j += 1) {
        const x = x0 + ((x1 - x0) * i) / steps
        const y = y0 + ((y1 - y0) * j) / steps
        if (!inside(x, y)) continue
        const r = edgeDist(x, y)
        if (r > top.r) top = { x, y, r }
      }
    }
  }
  search(minX, minY, maxX, maxY, 18)
  const cell = Math.max(maxX - minX, maxY - minY) / 18
  search(top.x - cell, top.y - cell, top.x + cell, top.y + cell, 8)
  if (top.r <= 0) return undefined
  return [Number(top.x.toFixed(1)), Number(top.y.toFixed(1)), Number(top.r.toFixed(2))]
}

const TERRITORY_ISO =
  'gl pr gf nc pf re fk bm fo aw cw gp mq yt hk mo gi as gu mp vi vg ky tc ai ms sh pm wf ck nu pn sj sx mf bl'.split(' ')

let modernLookup = null
async function modernCountries() {
  if (modernLookup) return modernLookup
  const names = new Intl.DisplayNames(['en'], { type: 'region' })
  const byName = new Map()
  const codes = new Set([...ISO2, ...TERRITORY_ISO])
  for (const iso of codes) {
    try {
      byName.set(names.of(iso.toUpperCase()).toLowerCase(), iso)
    } catch {}
  }
  const geo = await loadYear(2010)
  modernLookup = []
  for (const feature of geo.features || []) {
    const props = feature.properties || {}
    let iso = mapId(props)
    if (!codes.has(iso)) iso = byName.get(String(props.NAME || '').toLowerCase())
    if (!iso || !codes.has(iso)) continue
    for (const poly of polygonsOf(feature.geometry)) {
      modernLookup.push({ iso, poly: poly.coordinates, box: polyBox(poly.coordinates) })
    }
  }
  return modernLookup
}

/** Modern ISO containing (or nearest to) a polygon, for naming detached territories. */
async function modernIsoOf(poly) {
  const list = await modernCountries()
  const box = polyBox(poly)
  const lon = box.lon
  const lat = box.lat
  let near = null
  let nearGap = Infinity
  for (const item of list) {
    if (lon >= item.box.minLon && lon <= item.box.maxLon && lat >= item.box.minLat && lat <= item.box.maxLat) {
      if (pointInGeom(lon, lat, { type: 'Polygon', coordinates: item.poly })) return item.iso
    }
    const gap = boxGap(box, item.box)
    if (gap < nearGap) {
      nearGap = gap
      near = item.iso
    }
  }
  return nearGap < 2.5 ? near : undefined
}

/** Split far-flung polygons of a state into `${id}~${iso}` territories. */
async function splitExclaves(item) {
  if (item.polys.length < 2) return [item]
  const boxes = item.polys.map(polyBox)
  const areas = item.polys.map(polyAreaKm2)
  const temperate = areas.map((area, i) => (boxes[i].lat < 62 ? area : 0))
  const pool = Math.max(...temperate) > 0 ? temperate : areas
  const core = pool.indexOf(Math.max(...pool))
  const inCore = new Set([core])
  let grew = true
  while (grew) {
    grew = false
    for (let i = 0; i < item.polys.length; i += 1) {
      if (inCore.has(i)) continue
      for (const j of inCore) {
        if (boxGap(boxes[i], boxes[j]) < EXCLAVE_GAP) {
          inCore.add(i)
          grew = true
          break
        }
      }
    }
  }
  if (inCore.size === item.polys.length) return [item]
  const coreIsos = new Set()
  for (const i of inCore) {
    if (areas[i] > 2000 || i === core) {
      const iso = await modernIsoOf(item.polys[i])
      if (iso) coreIsos.add(iso)
    }
  }
  const pieces = new Map()
  const keep = []
  for (let i = 0; i < item.polys.length; i += 1) {
    if (inCore.has(i)) {
      keep.push(item.polys[i])
      continue
    }
    const iso = await modernIsoOf(item.polys[i])
    if (!iso || coreIsos.has(iso)) {
      keep.push(item.polys[i])
      continue
    }
    if (!pieces.has(iso)) pieces.set(iso, [])
    pieces.get(iso).push(item.polys[i])
  }
  const out = [{ ...item, polys: keep }]
  for (const [iso, polys] of pieces) {
    if (polys.reduce((sum, poly) => sum + polyAreaKm2(poly), 0) < 150) {
      keep.push(...polys)
      continue
    }
    out.push({ id: `${item.id}~${iso}`, name: item.name, polys, parent: item.id, piece: iso })
  }
  return out
}

function vertexKeys(polys) {
  const keys = new Set()
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [lon, lat] of ring) keys.add(`${Math.round(lon * 50)},${Math.round(lat * 50)}`)
    }
  }
  return keys
}

/** Greedy map colouring so neighbouring states differ; dependents inherit their suzerain's hue. */
function colour(items) {
  const owners = new Map()
  const neighbours = new Map(items.map((item) => [item.id, new Set()]))
  for (const item of items) {
    for (const key of vertexKeys(item.polys)) {
      const prev = owners.get(key)
      if (prev === undefined) {
        owners.set(key, [item.id])
        continue
      }
      for (const other of prev) {
        if (other === item.id) continue
        neighbours.get(item.id).add(other)
        neighbours.get(other).add(item.id)
      }
      if (!prev.includes(item.id)) prev.push(item.id)
    }
  }
  const byId = new Map(items.map((item) => [item.id, item]))
  const colours = new Map()
  const used = new Array(PALETTE_SIZE).fill(0)
  const states = items
    .filter((item) => item.kind === 's' && item.id !== 'unknown')
    .sort((a, b) => neighbours.get(b.id).size - neighbours.get(a.id).size || a.id.localeCompare(b.id))
  for (const item of states) {
    const taken = new Set()
    for (const n of neighbours.get(item.id)) {
      const other = byId.get(n)
      const c = colours.get(n) ?? (other && other.parent ? colours.get(other.parent) : undefined)
      if (c !== undefined) taken.add(c)
    }
    let pick = -1
    for (let c = 0; c < PALETTE_SIZE; c += 1) {
      if (taken.has(c)) continue
      if (pick < 0 || used[c] < used[pick]) pick = c
    }
    if (pick < 0) pick = neighbours.get(item.id).size % PALETTE_SIZE
    colours.set(item.id, pick)
    used[pick] += 1
  }
  for (const item of items) {
    if (item.kind !== 'd') continue
    const c = item.parent ? colours.get(item.parent) : undefined
    if (c !== undefined) colours.set(item.id, c)
    else {
      let pick = 0
      for (let k = 1; k < PALETTE_SIZE; k += 1) if (used[k] < used[pick]) pick = k
      colours.set(item.id, pick)
      used[pick] += 1
    }
  }
  return colours
}

async function buildYear(year, cards) {
  const geo = await loadYear(year)
  const byId = new Map()
  const unlabeledAfrica = []
  const africaTargets = []
  const madagascarTargets = []
  function add(id, name, polys, parent) {
    if (polys.length === 0) return
    const prev = byId.get(id)
    if (prev) {
      prev.polys.push(...polys)
      if (!prev.parent && parent) prev.parent = parent
    } else {
      byId.set(id, { id, name, polys: [...polys], parent })
    }
  }
  for (const feature of geo.features || []) {
    const props = feature.properties || {}
    const id = mapId(props)
    const name = String(props.NAME || props.NAMEEN || props.name || id)
    const box = geomBBox(feature.geometry)
    const subject = props.SUBJECTO ? String(props.SUBJECTO).trim() : ''
    const parentId = subject && subject !== name ? mapId({ NAME: subject }) : undefined
    const parent = parentId && parentId !== id && parentId !== 'unknown' ? parentId : undefined
    const blankAfrica = AFRICA_BLANK_NAMES.has(String(name).toLowerCase()) || id === 'unknown' || id === 'africa'
    if (blankAfrica) {
      for (const poly of polygonsOf(feature.geometry)) {
        if (isUnlabeledAfrica(geomBBox(poly), name)) {
          unlabeledAfrica.push(poly)
          continue
        }
        add(id === 'unknown' ? 'unknown' : id, id === 'unknown' ? 'unknown' : name, [poly.coordinates])
      }
      continue
    }
    add(id, name, polygonsOf(feature.geometry).map((poly) => poly.coordinates), parent)
    if (id !== 'unknown' && isAfricaMainlandTarget(box, name)) {
      africaTargets.push(africaTarget(id, name, box))
    } else if (id !== 'unknown' && isMadagascarTarget(box, name)) {
      madagascarTargets.push(africaTarget(id, name, box))
    }
  }
  for (const geom of unlabeledAfrica) {
    for (const piece of fillUnlabeledAfrica(geom, africaTargets, madagascarTargets)) add(piece.id, piece.name, piece.polys)
  }
  const items = []
  for (const item of byId.values()) {
    const meta = cards[item.id]
    item.kind = item.id === 'unknown' ? 'u' : item.parent ? 'd' : meta && meta.k === 'x' ? 'x' : 's'
    if (item.kind === 's' || item.kind === 'd') {
      for (const part of await splitExclaves(item)) {
        if (part.piece) part.kind = 'd'
        else part.kind = item.kind
        items.push(part)
      }
    } else {
      items.push(item)
    }
  }
  const colours = colour(items)
  const features = []
  for (const item of items) {
    const d = polysPath(item.polys)
    if (d.length <= 8) continue
    const out = { id: item.id, name: item.name, d }
    if (item.kind !== 's') out.k = item.kind
    if (colours.has(item.id)) out.c = colours.get(item.id)
    if (item.parent) out.p = item.parent
    if (item.piece) out.m = item.piece
    if (item.id !== 'unknown') {
      const area = item.polys.reduce((sum, poly) => sum + polyAreaKm2(poly), 0)
      if (area >= 1) out.a = Math.round(area)
      const anchor = labelAnchor(item.polys)
      if (anchor) out.l = anchor
    }
    features.push(out)
  }
  const result = { year, viewBox: VIEWBOX, features }
  fs.mkdirSync(OUT, { recursive: true })
  const dest = path.join(OUT, `${year}.json`)
  fs.writeFileSync(dest, JSON.stringify(result))
  const pieces = features.filter((f) => f.m).length
  console.log(`  -> ${year}.json ${(fs.statSync(dest).size / 1024).toFixed(0)}KB ${features.length} features, ${pieces} detached`)
  return features
}

async function main() {
  const cards = readCardKinds()
  const seen = new Map()
  for (const year of YEARS) {
    const features = await buildYear(year, cards)
    for (const feature of features) {
      if (feature.id === 'unknown') continue
      const span = seen.get(feature.id)
      if (span) span[1] = year
      else seen.set(feature.id, [year, year])
    }
  }
  fs.writeFileSync(path.join(OUT, 'years.json'), JSON.stringify(YEARS))
  if (fs.existsSync(CARDS_INDEX)) {
    for (const [id, span] of seen) {
      if (!cards[id]) cards[id] = {}
      cards[id].y = span
    }
    fs.writeFileSync(CARDS_INDEX, JSON.stringify(cards))
  }
  console.log('done')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
