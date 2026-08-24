import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { COUNTRIES, REGIONS, type Region } from '../data/countries'
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
import { LanguageToggle } from './LanguageToggle'
import { PassportModal } from './PassportModal'

const COUNTRY_BY_ISO = new Map(COUNTRIES.map((country) => [country.iso, country]))

interface MapScreenProps {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  onHub: (tab: HubTab) => void
}

const PAN_STEP = 0.28
type MapRegion = Region | 'all'

function isoFromTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null
  return target.closest('[data-iso]')?.getAttribute('data-iso') ?? null
}

function locationLabel(id: string, lang: QuizSettings['lang']) {
  const resolved = resolveMapLocation(id)
  if (!resolved) return ''
  if (resolved.holdout) return holdoutName(resolved.holdout, lang)
  if (resolved.territory && resolved.country) {
    return `${territoryName(resolved.territory, lang)} · ${countryName(resolved.country, lang)}`
  }
  return resolved.country ? countryName(resolved.country, lang) : ''
}

export function MapScreen({ settings, onChange, onHub }: MapScreenProps) {
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
  const [boxes, setBoxes] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [camera, setCamera] = useState<Camera>(WORLD)
  const [panning, setPanning] = useState(false)
  const [mapRegion, setMapRegion] = useState<MapRegion>('all')
  const [regionOpen, setRegionOpen] = useState(false)
  cameraRef.current = camera

  useEffect(() => {
    let live = true
    import('@svg-maps/world').then((mod) => {
      if (live) setWorld(mod.default)
    })
    return () => {
      live = false
    }
  }, [])

  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg || !world) return
    const next: Record<string, { x: number; y: number; width: number; height: number }> = {}
    svg.querySelectorAll<SVGGraphicsElement>('path[data-iso]').forEach((path) => {
      const iso = path.dataset.iso
      if (!iso) return
      const box = path.getBBox()
      next[iso] = { x: box.x, y: box.y, width: box.width, height: box.height }
    })
    setBoxes(next)
  }, [world])

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
      setCamera(zoomCamera(cam, factor, pivot))
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
  }, [world])

  const markers = useMemo(() => (world ? markersFor(world.locations) : []), [world])
  const baseViewBox = useMemo(() => {
    if (!world || mapRegion === 'all') return world?.viewBox ?? WORLD_VIEWBOX
    const fit = fitIsosForRegion(mapRegion)
    const selected = [...fit].map((iso) => boxes[iso]).filter(Boolean)
    if (selected.length === 0) return world.viewBox
    return cameraToViewBox(insetCamera(viewBoxFromBoxes(selected), REGION_START_ZOOM))
  }, [world, mapRegion, boxes])

  useEffect(() => {
    setCamera(clampCamera(parseViewBox(baseViewBox)))
  }, [baseViewBox])

  const resolvedOpen = openId ? resolveMapLocation(openId) : null
  const activeId = openId ?? hoverId
  const needle = query.trim().toLowerCase()
  const suggestions = useMemo(() => {
    if (needle.length === 0) return []
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
  }, [needle, settings.lang])

  function zoomBy(direction: 1 | -1) {
    const factor = direction > 0 ? 1 / 1.28 : 1.28
    setCamera((current) =>
      zoomCamera(current, factor, { x: current.x + current.w / 2, y: current.y + current.h / 2 }),
    )
  }

  function panBy(dx: number, dy: number) {
    setCamera((current) => clampCamera({ ...current, x: current.x + dx, y: current.y + dy }))
  }

  function pickRegion(region: MapRegion) {
    setMapRegion(region)
    setRegionOpen(false)
  }

  function openLocation(id: string) {
    if (!resolveMapLocation(id)) return
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
      iso: isoFromTarget(event.target),
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

  const canZoomIn = camera.w > WORLD.w / ZOOM_MAX + 1
  const canZoomOut = camera.w < WORLD.w - 1 || camera.h < WORLD.h - 1
  const regions: MapRegion[] = ['all', ...REGIONS]

  return (
    <div className="screen map-screen">
      <header className="quiz-header is-hub">
        <HubNav lang={settings.lang} active="map" onSelect={onHub} />
        <LanguageToggle
          lang={settings.lang}
          onChange={(lang) => onChange({ ...settings, lang })}
        />
      </header>

      <p className="learn-copy">{t.mapHint}</p>

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
          {world ? (
            <svg
              ref={svgRef}
              className="world-map"
              viewBox={`${camera.x} ${camera.y} ${camera.w} ${camera.h}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={t.map}
            >
              {world.locations.map((location) => {
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
                    onMouseEnter={() => {
                      if (clickable) setHoverId(location.id)
                    }}
                    onMouseLeave={() => setHoverId((current) => (current === location.id ? null : current))}
                  >
                    {clickable ? <title>{locationLabel(location.id, settings.lang)}</title> : null}
                  </path>
                )
              })}
              {markers.map((marker) => {
                const isOpen = marker.iso === openId
                const isHover = marker.iso === hoverId
                const disputed = Boolean(TERRITORY_BY_ISO.get(marker.iso)?.claimRu)
                return (
                  <circle
                    key={`pin-${marker.iso}`}
                    data-iso={marker.iso}
                    className={`map-pin${disputed ? ' is-dispute' : ''}${isOpen ? ' is-open' : ''}${isHover ? ' is-hover' : ''}`}
                    cx={marker.x}
                    cy={marker.y}
                    r={disputed ? 3.8 : 3.2}
                    onMouseEnter={() => setHoverId(marker.iso)}
                    onMouseLeave={() => setHoverId((current) => (current === marker.iso ? null : current))}
                  >
                    <title>{locationLabel(marker.iso, settings.lang)}</title>
                  </circle>
                )
              })}
            </svg>
          ) : (
            <p className="learn-copy">{t.mapLoading}</p>
          )}
        </div>
        <p className="map-active-name">{activeId ? locationLabel(activeId, settings.lang) : '\u00a0'}</p>
      </section>

      <p className="map-source">{t.mapCredit}</p>
      <p className="map-source">{t.mapHoldoutHint}</p>

      {resolvedOpen?.country ? (
        <PassportModal
          key={resolvedOpen.country.iso}
          country={resolvedOpen.country}
          lang={settings.lang}
          territoryNote={resolvedOpen.territory ? territoryNote(resolvedOpen.territory, settings.lang) : undefined}
          disputeNote={resolvedOpen.territory ? disputeNote(resolvedOpen.territory, settings.lang) : undefined}
          onClose={() => setOpenId(null)}
          onOpenCountry={(iso) => setOpenId(iso)}
        />
      ) : null}
      {resolvedOpen?.holdout ? (
        <HoldoutModal
          holdout={resolvedOpen.holdout}
          lang={settings.lang}
          onClose={() => setOpenId(null)}
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
