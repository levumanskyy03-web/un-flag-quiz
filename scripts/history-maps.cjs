#!/usr/bin/env node
/**
 * Download historical-basemaps GeoJSON and emit simplified SVG-path maps.
 * Source: https://github.com/aourednik/historical-basemaps (CC BY).
 * The UI picks the nearest snapshot (honest: no day-by-day GIS). CShapes 2.0
 * yearly polygons are not shipped (file size); 1886–2019 still uses these slices.
 */
const fs = require('fs')
const path = require('path')
const https = require('https')

const YEARS = [1800, 1815, 1878, 1880, 1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994, 2000, 2010]
const WIDTH = 1010
const HEIGHT = 666
const EPSILON = 1.15
const RAW = 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson'
const CACHE = path.join(__dirname, '../.cache/history-geojson')
const OUT = path.join(__dirname, '../public/maps/history')

const ALIASES = {
  'soviet union': 'su',
  ussr: 'su',
  'u.s.s.r.': 'su',
  'union of soviet socialist republics': 'su',
  yugoslavia: 'yu',
  'socialist federal republic of yugoslavia': 'yu',
  czechoslovakia: 'cs',
  'austria-hungary': 'ah',
  'austro-hungarian empire': 'ah',
  'austrian empire': 'aus-emp',
  austria: 'at',
  'ottoman empire': 'ott',
  ottoman: 'ott',
  turkey: 'tr',
  'qing dynasty': 'qing',
  'qing empire': 'qing',
  qing: 'qing',
  china: 'cn',
  'austria hungary': 'ah',
  'holy roman empire': 'hre',
  prussia: 'pruss',
  'kingdom of prussia': 'pruss',
  'two sicilies': '2sic',
  'kingdom of the two sicilies': '2sic',
  'papal states': 'papal',
  'papal state': 'papal',
  sardinia: 'sard',
  'kingdom of sardinia': 'sard',
  'piedmont-sardinia': 'sard',
  'gran colombia': 'grco',
  'great colombia': 'grco',
  'united provinces of central america': 'upca',
  'federal republic of central america': 'upca',
  'central america': 'upca',
  texas: 'tx-rep',
  'republic of texas': 'tx-rep',
  hawaii: 'hi-k',
  'kingdom of hawaii': 'hi-k',
  'east germany': 'dd',
  'german democratic republic': 'dd',
  gdr: 'dd',
  'south vietnam': 'rvn',
  'republic of vietnam': 'rvn',
  'south yemen': 'ye-s',
  'people\'s democratic republic of yemen': 'ye-s',
  'north yemen': 'ye-n',
  'yemen arab republic': 'ye-n',
  'united arab republic': 'uar',
  rhodesia: 'rhodesia',
  persia: 'persia',
  iran: 'ir',
  siam: 'siam',
  thailand: 'th',
  tibet: 'tibet',
  'orange free state': 'ofs',
  transvaal: 'zar',
  'south african republic': 'zar',
  somaliland: 'so-sl',
  abkhazia: 'ge-ab',
  'south ossetia': 'ge-os',
  transnistria: 'md-pmr',
  'northern cyprus': 'cy-nc',
  artsakh: 'nk',
  'nagorno-karabakh': 'nk',
  france: 'fr',
  spain: 'es',
  portugal: 'pt',
  'united kingdom': 'gb',
  'united kingdom of great britain and ireland': 'gb',
  'great britain': 'gb',
  'united states': 'us',
  'united states of america': 'us',
  russia: 'ru',
  'russian empire': 'ru-emp',
  'russian federation': 'ru',
  germany: 'de',
  'german empire': 'ge-emp',
  'kingdom of italy': 'it',
  italy: 'it',
  'empire of japan': 'jp',
  japan: 'jp',
  netherlands: 'nl',
  belgium: 'be',
  switzerland: 'ch',
  sweden: 'se',
  norway: 'no',
  denmark: 'dk',
  greece: 'gr',
  serbia: 'rs',
  romania: 'ro',
  bulgaria: 'bg',
  albania: 'al',
  montenegro: 'me',
  poland: 'pl',
  finland: 'fi',
  iceland: 'is',
  ireland: 'ie',
  mexico: 'mx',
  brazil: 'br',
  argentina: 'ar',
  chile: 'cl',
  peru: 'pe',
  colombia: 'co',
  venezuela: 've',
  ecuador: 'ec',
  bolivia: 'bo',
  paraguay: 'py',
  uruguay: 'uy',
  'costa rica': 'cr',
  guatemala: 'gt',
  honduras: 'hn',
  nicaragua: 'ni',
  'el salvador': 'sv',
  panama: 'pa',
  cuba: 'cu',
  haiti: 'ht',
  'dominican republic': 'do',
  canada: 'ca',
  australia: 'au',
  'new zealand': 'nz',
  egypt: 'eg',
  morocco: 'ma',
  ethiopia: 'et',
  abyssinia: 'et',
  liberia: 'lr',
  'south africa': 'za',
  afghanistan: 'af',
  nepal: 'np',
  bhutan: 'bt',
  mongolia: 'mn',
  korea: 'kr-emp',
  'korean empire': 'kr-emp',
  siam: 'siam',
  'rattanakosin kingdom': 'siam',
  thailand: 'th',
  persia: 'persia',
  iran: 'ir',
  'manchu empire': 'qing',
}

const ISO2 = new Set(
  'ad ae af ag al am ao ar at au az ba bb bd be bf bg bh bi bj bn bo br bs bt bw by bz ca cd cf cg ch ci cl cm cn co cr cu cv cy cz de dj dk dm do dz ec ee eg er es et fi fj fm fr ga gb gd ge gh gm gn gq gr gt gw gy hn hr ht hu id ie il in iq ir is it jm jo jp ke kg kh ki km kn kp kr kw kz la lb lc li lk lr ls lt lu lv ly ma mc md me mg mh mk ml mm mn mr mt mu mv mw mx my mz na ne ng ni nl no np nr nz om pa pe pg ph pk pl pt pw py qa ro rs ru rw sa sb sc sd se sg si sk sl sm sn so sr ss st sv sy sz td tg th tj tl tm tn to tr tt tv tz ua ug us uy uz vc ve vn vu ws ye za zm zw tw xk va ps eh'.split(
    ' ',
  ),
)

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchBuffer(res.headers.location).then(resolve, reject)
          return
        }
        if (res.statusCode !== 200) {
          reject(new Error(`${url} -> ${res.statusCode}`))
          return
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks)))
      })
      .on('error', reject)
  })
}

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

function slug(name) {
  return String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

function mapId(props) {
  const raw =
    props.NAME ||
    props.NAMEEN ||
    props.NAME_EN ||
    props.name ||
    props.ADMIN ||
    props.CNTRY_NAME ||
    props.SOVEREIGNT ||
    ''
  const key = String(raw).trim().toLowerCase()
  if (ALIASES[key]) return ALIASES[key]
  const iso = String(props.ISO_A2 || props.iso_a2 || props.WB_A2 || '').toLowerCase()
  if (ISO2.has(iso)) return iso
  if (key && ALIASES[key.replace(/^the /, '')]) return ALIASES[key.replace(/^the /, '')]
  const s = slug(raw)
  return s || 'unknown'
}

async function buildYear(year) {
  fs.mkdirSync(CACHE, { recursive: true })
  const cacheFile = path.join(CACHE, `world_${year}.geojson`)
  if (!fs.existsSync(cacheFile)) {
    process.stdout.write(`download ${year}… `)
    const buf = await fetchBuffer(`${RAW}/world_${year}.geojson`)
    fs.writeFileSync(cacheFile, buf)
    process.stdout.write(`${(buf.length / 1e6).toFixed(1)}MB\n`)
  } else {
    console.log(`cached ${year}`)
  }
  const geo = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
  const byId = new Map()
  for (const feature of geo.features || []) {
    const id = mapId(feature.properties || {})
    const name = String(
      feature.properties?.NAME || feature.properties?.NAMEEN || feature.properties?.name || id,
    )
    const parts = geomPaths(feature.geometry)
    if (parts.length === 0) continue
    const prev = byId.get(id)
    if (prev) prev.d += parts.join('')
    else byId.set(id, { id, name, d: parts.join('') })
  }
  const features = [...byId.values()].filter((item) => item.d.length > 8)
  const out = { year, viewBox: `0 0 ${WIDTH} ${HEIGHT}`, features }
  fs.mkdirSync(OUT, { recursive: true })
  const dest = path.join(OUT, `${year}.json`)
  fs.writeFileSync(dest, JSON.stringify(out))
  console.log(`  -> ${year}.json ${(fs.statSync(dest).size / 1024).toFixed(0)}KB ${features.length} features`)
}

async function main() {
  for (const year of YEARS) {
    await buildYear(year)
  }
  fs.writeFileSync(path.join(OUT, 'years.json'), JSON.stringify(YEARS))
  console.log('done')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
