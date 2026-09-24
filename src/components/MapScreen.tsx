import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { COUNTRIES, REGIONS, type Region } from '../data/countries'
import {
  eraPolities,
  HISTORY_MAP_VIEWBOX,
  HISTORY_YEAR_MIN,
  historyYearMax,
  mapIndependence,
  nearestHistorySnapshot,
  polityById,
  resolveHistoryId,
  searchPolities,
  useModernWorldMap,
} from '../data/history'
import { loadHistoryMap, type HistoryMapData, type HistoryMapFeature } from '../lib/historyMap'
import { useHistoryCards } from '../lib/historyCards'
import { historyEntityName, historyMapLabel } from '../lib/historyNames'
import {
  HOLDOUTS,
  HOLDOUT_BY_ISO,
  disputeNote,
  fitIsosForRegion,
  holdoutName,
  resolveMapLocation,
  TERRITORIES,
  TERRITORY_BY_ISO,
  territoryName,
  territoryNote,
} from '../data/territories'
import { isClickableIso, markersFor, type WorldMapData } from '../data/worldMap'
import { findCountry } from '../data/extras'
import { getPassport } from '../data/passports'
import { STRINGS, regionLabel } from '../i18n/strings'
import {
  cameraFromPinch,
  cameraToViewBox,
  clampCamera,
  insetCamera,
  parseViewBox,
  pointerDistance,
  REGION_START_ZOOM,
  screenToSvg,
  viewBoxFromBoxes,
  WORLD,
  WORLD_VIEWBOX,
  ZOOM_MAX,
  zoomCamera,
  type Camera,
} from '../lib/mapCamera'
import { countryName } from '../lib/quiz'
import type { QuizSettings } from './HomeScreen'
import { HubNav, type HubTab } from './HubNav'
import { HoldoutModal } from './HoldoutModal'
import { HistoryCard } from './HistoryCard'
import { PassportModal } from './PassportModal'
import { WorldsBack } from './WorldsBack'

const COUNTRY_BY_ISO = new Map(COUNTRIES.map((country) => [country.iso, country]))

interface MapScreenProps {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
}

const PAN_STEP = 0.28
type MapRegion = Region | 'all'

function isoFromTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null
  return target.closest('[data-iso]')?.getAttribute('data-iso') ?? null
}

function clickableIsoFromTarget(target: EventTarget | null, allowAll = false) {
  const iso = isoFromTarget(target)
  if (!iso || iso === 'unknown') return null
  if (allowAll) return iso
  return isClickableIso(iso) ? iso : null
}

function historyFeatureClass(feature: HistoryMapFeature) {
  if (feature.k === 'u' || feature.id === 'unknown') return ' is-unknown'
  if (feature.k === 'x') return ' is-people'
  const hue = feature.c !== undefined ? ` hc-${feature.c}` : ''
  return feature.k === 'd' ? `${hue} is-dep` : hue
}

const LABEL_MIN_PX = 7.5
const LABEL_MAX_PX = 15

function locationLabel(id: string, lang: QuizSettings['lang'], year: number, mapName?: string) {
  const historyId = resolveHistoryId(id, year)
  const hist = polityById(historyId)
  if (hist) {
    return countryName(
      { iso: hist.id, nameEn: hist.names.en, nameRu: hist.names.ru, region: hist.region, difficulty: hist.difficulty },
      lang,
    )
  }
  const resolved = resolveMapLocation(historyId)
  if (!resolved) return mapName ?? ''
  if (resolved.holdout) return holdoutName(resolved.holdout, lang)
  if (resolved.territory && resolved.country) {
    return `${territoryName(resolved.territory, lang)} · ${countryName(resolved.country, lang)}`
  }
  return resolved.country ? countryName(resolved.country, lang) : mapName ?? ''
}

export function MapScreen({ settings, onChange, onHub, onWorlds }: MapScreenProps) {
  const t = STRINGS[settings.lang]
  const svgRef = useRef<SVGSVGElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: number; x: number; y: number; moved: boolean; iso: string | null } | null>(null)
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const pinchRef = useRef<{
    startDist: number
    startCam: Camera
    px: number
    py: number
  } | null>(null)
  const cameraRef = useRef<Camera>(WORLD)
  const [world, setWorld] = useState<WorldMapData | null>(null)
  const [historyMap, setHistoryMap] = useState<HistoryMapData | null>(null)
  const eraYear = settings.eraYear ?? historyYearMax()
  const modern = useModernWorldMap(eraYear)
  const [boxes, setBoxes] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const [openAsModern, setOpenAsModern] = useState(false)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [camera, setCamera] = useState<Camera>(WORLD)
  const [panning, setPanning] = useState(false)
  const [mapRegion, setMapRegion] = useState<MapRegion>('all')
  const [regionOpen, setRegionOpen] = useState(false)
  cameraRef.current = camera
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 })
  const cards = useHistoryCards(settings.lang, !modern)
  const mapBounds = useMemo<Camera>(() => {
    if (historyMap) return parseViewBox(historyMap.viewBox || HISTORY_MAP_VIEWBOX)
    return WORLD
  }, [historyMap])

  useEffect(() => {
    let live = true
    if (modern) {
      setHistoryMap(null)
      import('@svg-maps/world').then((mod) => {
        if (live) setWorld(mod.default)
      })
      return () => {
        live = false
      }
    }
    setWorld(null)
    loadHistoryMap(eraYear).then((data) => {
      if (live) setHistoryMap(data)
    })
    return () => {
      live = false
    }
  }, [eraYear, modern])

  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg || (!world && !historyMap)) return
    const next: Record<string, { x: number; y: number; width: number; height: number }> = {}
    svg.querySelectorAll<SVGGraphicsElement>('path[data-iso]').forEach((path) => {
      const iso = path.dataset.iso
      if (!iso) return
      const box = path.getBBox()
      next[iso] = { x: box.x, y: box.y, width: box.width, height: box.height }
    })
    setBoxes(next)
  }, [world, historyMap])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setFrameSize((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }))
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  const historyLabels = useMemo(() => {
    if (!historyMap) return []
    return historyMap.features.flatMap((feature) => {
      if (!feature.l || feature.id === 'unknown') return []
      const text = historyMapLabel(feature, settings.lang, eraYear, cards)
      return text ? [{ id: feature.id, text, l: feature.l, people: feature.k === 'x' }] : []
    })
  }, [historyMap, settings.lang, eraYear, cards])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && regionOpen) {
        setRegionOpen(false)
        return
      }
      if (regionOpen || openId) return
      if (event.target instanceof HTMLInputElement) return
      const stepX = camera.w * PAN_STEP
      const stepY = camera.h * PAN_STEP
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        panBy(-stepX, 0)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        panBy(stepX, 0)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        panBy(0, -stepY)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        panBy(0, stepY)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [camera, regionOpen, openId])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    function onWheel(event: WheelEvent) {
      event.preventDefault()
      const pixels =
        event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * 320 : event.deltaY
      const clamped = Math.min(72, Math.max(-72, pixels))
      const factor = Math.exp(clamped * (event.ctrlKey || event.metaKey ? 0.012 : 0.0034))
      const svg = svgRef.current
      const cam = cameraRef.current
      const origin = svg ? screenToSvg(svg, event.clientX, event.clientY) : null
      const pivot = origin ?? { x: cam.x + cam.w / 2, y: cam.y + cam.h / 2 }
      setCamera(zoomCamera(cam, factor, pivot, mapBounds))
    }
    function onTouchMove(event: TouchEvent) {
      if (event.touches.length >= 1) event.preventDefault()
    }
    frame.addEventListener('wheel', onWheel, { passive: false })
    frame.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      frame.removeEventListener('wheel', onWheel)
      frame.removeEventListener('touchmove', onTouchMove)
    }
  }, [world, historyMap, mapBounds])

  const markers = useMemo(() => {
    if (world && modern) return markersFor(world.locations)
    if (!historyMap) return []
    const have = new Set(historyMap.features.map((item) => resolveHistoryId(item.id, eraYear)))
    return eraPolities(eraYear).flatMap((item) => {
      if (!item.marker || have.has(item.id)) return []
      if (mapRegion !== 'all' && item.region !== mapRegion) return []
      return [{ iso: item.id, x: item.marker.x, y: item.marker.y }]
    })
  }, [world, modern, historyMap, eraYear, mapRegion])
  const baseViewBox = useMemo(() => {
    if (historyMap) return historyMap.viewBox ?? HISTORY_MAP_VIEWBOX
    if (!world || mapRegion === 'all') return world?.viewBox ?? WORLD_VIEWBOX
    const fit = fitIsosForRegion(mapRegion)
    const selected = [...fit].map((iso) => boxes[iso]).filter(Boolean)
    if (selected.length === 0) return world.viewBox
    return cameraToViewBox(insetCamera(viewBoxFromBoxes(selected), REGION_START_ZOOM))
  }, [world, mapRegion, boxes, historyMap])

  useEffect(() => {
    setCamera(clampCamera(parseViewBox(baseViewBox), mapBounds))
  }, [baseViewBox, mapBounds])

  const historyIndependence = openId && !modern ? mapIndependence(openId, eraYear, { preferModern: openAsModern }) : null
  const historyCardId = historyIndependence && historyIndependence.status !== 'modern' ? historyIndependence.id : openId
  const historyFeature = openId && historyMap ? historyMap.features.find((item) => item.id === openId) : undefined
  const resolvedOpen = openId ? resolveMapLocation(historyIndependence?.id ?? openId) : null
  const passportIso = modern
    ? openId
    : historyIndependence?.status === 'modern'
      ? historyIndependence.id
      : undefined
  const passportCountry = passportIso
    ? findCountry(passportIso) ?? COUNTRY_BY_ISO.get(passportIso)
    : undefined
  const showPassport = Boolean(passportCountry && getPassport(passportCountry.iso))
  const showHistory = Boolean(!modern && openId && historyIndependence && historyIndependence.status !== 'modern')
  const activeId = openId ?? hoverId
  const needle = query.trim().toLowerCase()
  const suggestions = useMemo(() => {
    if (needle.length === 0) return []
    if (!modern) {
      const fromCatalog = searchPolities(needle, settings.lang, eraYear, mapRegion)
      const fromMap = (historyMap?.features ?? [])
        .filter((item) => item.name.toLowerCase().includes(needle) || item.id.includes(needle))
        .map((item) => ({ id: item.id, label: historyEntityName(item.id, settings.lang, eraYear, cards, item.name) }))
      const merged = [...fromCatalog, ...fromMap]
      const seen = new Set<string>()
      return merged.filter((item) => {
        if (seen.has(item.id)) return false
        seen.add(item.id)
        return true
      }).slice(0, 8)
    }
    const countries = COUNTRIES.filter((country) => {
      return (
        country.nameRu.toLowerCase().includes(needle) || country.nameEn.toLowerCase().includes(needle)
      )
    }).map((country) => ({ id: country.iso, label: countryName(country, settings.lang) }))
    const territories = TERRITORIES.flatMap((territory) => {
      const parent = COUNTRY_BY_ISO.get(territory.parent)
      if (
        !parent ||
        (!territory.nameRu.toLowerCase().includes(needle) && !territory.nameEn.toLowerCase().includes(needle))
      ) {
        return []
      }
      return [
        {
          id: territory.iso,
          label: `${territoryName(territory, settings.lang)} · ${countryName(parent, settings.lang)}`,
        },
      ]
    })
    const holdouts = HOLDOUTS.flatMap((holdout) => {
      if (
        !holdout.nameRu.toLowerCase().includes(needle) &&
        !holdout.nameEn.toLowerCase().includes(needle)
      ) {
        return []
      }
      return [{ id: holdout.iso, label: `${holdoutName(holdout, settings.lang)} · ${STRINGS[settings.lang].notInQuiz}` }]
    })
    return [...countries, ...territories, ...holdouts]
      .sort((a, b) => a.label.localeCompare(b.label, settings.lang))
      .slice(0, 8)
  }, [needle, settings.lang, modern, eraYear, mapRegion, historyMap, cards])

  function zoomBy(direction: 1 | -1) {
    const factor = direction > 0 ? 1 / 1.28 : 1.28
    setCamera((current) =>
      zoomCamera(current, factor, { x: current.x + current.w / 2, y: current.y + current.h / 2 }, mapBounds),
    )
  }

  function panBy(dx: number, dy: number) {
    setCamera((current) => clampCamera({ ...current, x: current.x + dx, y: current.y + dy }, mapBounds))
  }

  function pickRegion(region: MapRegion) {
    setMapRegion(region)
    setRegionOpen(false)
  }

  function openLocation(id: string, asModern = false) {
    setOpenAsModern(asModern)
    setOpenId(id)
    setQuery('')
  }

  function onFramePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const points = [...pointersRef.current.values()]
    if (points.length >= 2) {
      const svg = svgRef.current
      const [first, second] = points
      const midX = (first.x + second.x) / 2
      const midY = (first.y + second.y) / 2
      const svgPoint = svg ? screenToSvg(svg, midX, midY) : null
      const cam = cameraRef.current
      dragRef.current = null
      setPanning(true)
      if (svgPoint) {
        pinchRef.current = {
          startDist: Math.max(1, pointerDistance(first, second)),
          startCam: cam,
          px: svgPoint.x,
          py: svgPoint.y,
        }
      }
      return
    }
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
      iso: clickableIsoFromTarget(event.target, !modern),
    }
  }

  function onFramePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId)) return
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const pinch = pinchRef.current
    if (pinch && pointersRef.current.size >= 2) {
      const svg = svgRef.current
      const [first, second] = [...pointersRef.current.values()]
      const distance = pointerDistance(first, second)
      if (!svg || distance < 8) return
      setCamera(
        cameraFromPinch(
          svg,
          pinch.startCam,
          pinch.px,
          pinch.py,
          (first.x + second.x) / 2,
          (first.y + second.y) / 2,
          pinch.startDist / distance,
          mapBounds,
        ),
      )
      return
    }
    const drag = dragRef.current
    const svg = svgRef.current
    if (!drag || drag.id !== event.pointerId || !svg) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!drag.moved && Math.hypot(dx, dy) < 8) return
    const from = screenToSvg(svg, drag.x, drag.y)
    const to = screenToSvg(svg, event.clientX, event.clientY)
    if (!from || !to) return
    if (!drag.moved) {
      event.currentTarget.setPointerCapture(event.pointerId)
      drag.moved = true
      setPanning(true)
    }
    drag.x = event.clientX
    drag.y = event.clientY
    panBy(from.x - to.x, from.y - to.y)
  }

  function onFramePointerUp(event: PointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(event.pointerId)
    if (pinchRef.current) {
      if (pointersRef.current.size < 2) {
        pinchRef.current = null
        const leftover = [...pointersRef.current.entries()][0]
        if (leftover) {
          dragRef.current = {
            id: leftover[0],
            x: leftover[1].x,
            y: leftover[1].y,
            moved: true,
            iso: null,
          }
        } else {
          dragRef.current = null
          setPanning(false)
        }
      }
      return
    }
    const drag = dragRef.current
    dragRef.current = null
    setPanning(false)
    if (drag && !drag.moved && drag.iso) openLocation(drag.iso)
  }

  function onMapHover(event: { target: EventTarget | null }) {
    const iso = clickableIsoFromTarget(event.target, !modern)
    setHoverId((current) => (current === iso ? current : iso))
  }

  function onMapUnhover(event: { currentTarget: SVGSVGElement; relatedTarget: EventTarget | null }) {
    const related = event.relatedTarget
    if (related instanceof Node && event.currentTarget.contains(related)) {
      const iso = clickableIsoFromTarget(related, !modern)
      setHoverId((current) => (current === iso ? current : iso))
      return
    }
    setHoverId((current) => (current === null ? current : null))
  }

  const canZoomIn = camera.w > mapBounds.w / ZOOM_MAX + 1
  const canZoomOut = camera.w < mapBounds.w - 1 || camera.h < mapBounds.h - 1
  const regions: MapRegion[] = ['all', ...REGIONS]

  return (
    <div className="screen map-screen">
      <WorldsBack lang={settings.lang} onClick={onWorlds} />
      <header className="quiz-header is-hub">
        <HubNav lang={settings.lang} active="map" onSelect={onHub} />
      </header>

      <div className="map-toolbar">
        <label className="map-search">
          <span className="sr-only">{t.mapSearch}</span>
          <input
            type="search"
            value={query}
            placeholder={t.mapSearch}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="map-search-list">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => openLocation(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </label>
        <label className="map-year">
          <span>{t.mapYear}</span>
          <input
            type="range"
            min={HISTORY_YEAR_MIN}
            max={historyYearMax()}
            value={eraYear}
            onChange={(event) => onChange({ ...settings, eraYear: Number(event.target.value) })}
          />
          <strong>{eraYear}</strong>
        </label>
        <button type="button" className="choice map-region-btn" onClick={() => setRegionOpen(true)}>
          {regionLabel(mapRegion, settings.lang)}
        </button>
      </div>

      <section className="card map-card">
        <div
          ref={frameRef}
          className={`map-frame${panning ? ' is-panning' : ''}`}
          onPointerDown={onFramePointerDown}
          onPointerMove={onFramePointerMove}
          onPointerUp={onFramePointerUp}
          onPointerCancel={onFramePointerUp}
        >
          <div className="map-zoom" onPointerDown={(event) => event.stopPropagation()}>
            <button type="button" className="btn-ghost" onClick={() => zoomBy(-1)} disabled={!canZoomOut} aria-label="−">
              −
            </button>
            <button type="button" className="btn-ghost" onClick={() => zoomBy(1)} disabled={!canZoomIn} aria-label="+">
              +
            </button>
          </div>
          <div className="map-pan" role="group" aria-label={t.mapMove} onPointerDown={(event) => event.stopPropagation()}>
            <button type="button" className="btn-ghost map-pan-up" onClick={() => panBy(0, -camera.h * PAN_STEP)} aria-label={t.mapUp}>
              ↑
            </button>
            <button type="button" className="btn-ghost map-pan-left" onClick={() => panBy(-camera.w * PAN_STEP, 0)} aria-label={t.mapLeft}>
              ←
            </button>
            <button type="button" className="btn-ghost map-pan-right" onClick={() => panBy(camera.w * PAN_STEP, 0)} aria-label={t.mapRight}>
              →
            </button>
            <button type="button" className="btn-ghost map-pan-down" onClick={() => panBy(0, camera.h * PAN_STEP)} aria-label={t.mapDown}>
              ↓
            </button>
          </div>
          {world || historyMap ? (
            <svg
              ref={svgRef}
              className={`world-map${historyMap ? ' is-history' : ''}`}
              viewBox={`${camera.x} ${camera.y} ${camera.w} ${camera.h}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={t.map}
              onMouseOver={onMapHover}
              onMouseOut={onMapUnhover}
            >
              {historyMap ? (
                <defs>
                  <pattern
                    id="hist-hatch"
                    patternUnits="userSpaceOnUse"
                    width={2.4}
                    height={2.4}
                    patternTransform="rotate(45)"
                  >
                    <line x1={0} y1={0} x2={0} y2={2.4} stroke="rgba(255,250,240,0.75)" strokeWidth={0.9} />
                  </pattern>
                </defs>
              ) : null}
              {historyMap
                ? historyMap.features.map((feature) => {
                    const isOpen = feature.id === openId
                    const isHover = feature.id === hoverId
                    return (
                      <path
                        key={feature.id}
                        data-iso={feature.id}
                        d={feature.d}
                        className={`map-country${historyFeatureClass(feature)}${isOpen ? ' is-open' : ''}${isHover ? ' is-hover' : ''}`}
                      />
                    )
                  })
                : world?.locations.map((location) => {
                const clickable = isClickableIso(location.id)
                const holdout = HOLDOUT_BY_ISO.has(location.id)
                const isOpen = location.id === openId
                const isHover = location.id === hoverId
                return (
                  <path
                    key={location.id}
                    data-iso={location.id}
                    d={location.path}
                    className={`map-country${clickable ? '' : ' is-other'}${holdout ? ' is-holdout' : ''}${isOpen ? ' is-open' : ''}${isHover ? ' is-hover' : ''}`}
                  />
                )
              })}
              {historyMap
                ? historyMap.features.map((feature) =>
                    feature.k === 'd' && feature.id !== openId ? (
                      <path key={`hatch-${feature.id}`} className="map-hatch" d={feature.d} />
                    ) : null,
                  )
                : null}
              {historyMap && frameSize.w > 0
                ? historyLabels.map((label) => {
                    const scale = Math.min(frameSize.w / camera.w, frameSize.h / camera.h)
                    const room = label.l[2] * scale
                    let px = Math.min(LABEL_MAX_PX, room * 0.6)
                    const width = label.text.length * 0.56
                    if (width * px > room * 4) px = (room * 4) / width
                    if (px < LABEL_MIN_PX) return null
                    const size = px / scale
                    return (
                      <text
                        key={`label-${label.id}`}
                        className={`map-label${label.people ? ' is-people' : ''}`}
                        x={label.l[0]}
                        y={label.l[1]}
                        fontSize={size}
                        strokeWidth={size * 0.3}
                      >
                        {label.text}
                      </text>
                    )
                  })
                : null}
              {markers.map((marker) => {
                const isOpen = marker.iso === openId
                const isHover = marker.iso === hoverId
                const disputed = Boolean(TERRITORY_BY_ISO.get(marker.iso)?.claimRu)
                return (
                  <g key={`pin-${marker.iso}`}>
                    <circle className="map-pin-hit" data-iso={marker.iso} cx={marker.x} cy={marker.y} r={10} />
                    <circle
                      className={`map-pin${disputed ? ' is-dispute' : ''}${isOpen ? ' is-open' : ''}${isHover ? ' is-hover' : ''}`}
                      cx={marker.x}
                      cy={marker.y}
                      r={disputed ? 3.8 : 3.2}
                    />
                  </g>
                )
              })}
            </svg>
          ) : (
            <p className="learn-copy">{t.mapLoading}</p>
          )}
        </div>
        <p className="map-active-name">
          {activeId
            ? historyMap
              ? historyEntityName(
                  activeId,
                  settings.lang,
                  eraYear,
                  cards,
                  historyMap.features.find((item) => item.id === activeId)?.name,
                )
              : locationLabel(activeId, settings.lang, eraYear)
            : '\u00a0'}
        </p>
        {!modern ? (
          <ul className="map-legend">
            <li>
              <span className="map-legend-swatch is-state" aria-hidden="true" />
              {t.historyIndependent}
            </li>
            <li>
              <span className="map-legend-swatch is-dep" aria-hidden="true" />
              {t.historyDependent}
            </li>
            <li>
              <span className="map-legend-swatch is-people" aria-hidden="true" />
              {t.historyPeople}
            </li>
          </ul>
        ) : null}
        {!modern ? <p className="map-snapshot">{t.mapSnapshot(nearestHistorySnapshot(eraYear))}</p> : null}
      </section>

      <p className="map-source">{modern ? t.mapCredit : t.mapHistoryCredit}</p>
      {modern ? <p className="map-source">{t.mapHoldoutHint}</p> : null}

      {showPassport && passportCountry ? (
        <PassportModal
          key={passportCountry.iso}
          country={passportCountry}
          lang={settings.lang}
          territoryNote={resolvedOpen?.territory ? territoryNote(resolvedOpen.territory, settings.lang) : undefined}
          disputeNote={resolvedOpen?.territory ? disputeNote(resolvedOpen.territory, settings.lang) : undefined}
          onClose={() => {
            setOpenAsModern(false)
            setOpenId(null)
          }}
          onOpenCountry={(iso) => openLocation(iso, true)}
        />
      ) : null}
      {showHistory && historyCardId ? (
        <HistoryCard
          key={historyCardId}
          id={historyCardId}
          lang={settings.lang}
          year={eraYear}
          mapName={historyFeature?.name}
          mapId={openId ?? undefined}
          feature={historyFeature}
          cards={cards}
          onClose={() => {
            setOpenAsModern(false)
            setOpenId(null)
          }}
          onOpen={(id) => openLocation(id, !polityById(id))}
        />
      ) : null}
      {resolvedOpen?.holdout && !showPassport && !showHistory ? (
        <HoldoutModal
          holdout={resolvedOpen.holdout}
          lang={settings.lang}
          onClose={() => {
            setOpenAsModern(false)
            setOpenId(null)
          }}
        />
      ) : null}

      {regionOpen && (
        <div
          className="passport-overlay"
          onClick={() => setRegionOpen(false)}
          role="presentation"
        >
          <div
            className="card map-region-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="map-region-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="btn-ghost passport-close" onClick={() => setRegionOpen(false)}>
              {t.close}
            </button>
            <h2 id="map-region-title">{t.mapRegion}</h2>
            <div className="choice-grid">
              {regions.map((region) => (
                <button
                  key={region}
                  type="button"
                  className={`choice${mapRegion === region ? ' is-active' : ''}`}
                  aria-pressed={mapRegion === region}
                  onClick={() => pickRegion(region)}
                >
                  {regionLabel(region, settings.lang)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
