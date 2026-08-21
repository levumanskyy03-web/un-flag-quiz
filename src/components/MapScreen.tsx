import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { COUNTRIES, REGIONS, type Region } from '../data/countries'
import {
  disputeNote,
  fitIsosForRegion,
  resolveMapLocation,
  TERRITORIES,
  TERRITORY_BY_ISO,
  territoryName,
  territoryNote,
} from '../data/territories'
import { isClickableIso, markersFor, type WorldMapData } from '../data/worldMap'
import { STRINGS, regionLabel } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import type { QuizSettings } from './HomeScreen'
import { LanguageToggle } from './LanguageToggle'
import { PassportModal } from './PassportModal'

const COUNTRY_BY_ISO = new Map(COUNTRIES.map((country) => [country.iso, country]))

interface MapScreenProps {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  onBack: () => void
}

const ZOOM_MAX = 8
const PAN_STEP = 0.28
const WORLD = { x: 0, y: 0, w: 1010, h: 666 }
const WORLD_VIEWBOX = `${WORLD.x} ${WORLD.y} ${WORLD.w} ${WORLD.h}`
type MapRegion = Region | 'all'
type Camera = { x: number; y: number; w: number; h: number }

function parseViewBox(value: string): Camera {
  const [x, y, w, h] = value.split(/[\s,]+/).map(Number)
  return { x, y, w, h }
}

function clampCamera(camera: Camera): Camera {
  const minW = WORLD.w / ZOOM_MAX
  const minH = WORLD.h / ZOOM_MAX
  const w = Math.max(minW, camera.w)
  const h = Math.max(minH, camera.h)
  if (w >= WORLD.w || h >= WORLD.h) return { ...WORLD }
  return {
    x: Math.min(WORLD.x + WORLD.w - w, Math.max(WORLD.x, camera.x)),
    y: Math.min(WORLD.y + WORLD.h - h, Math.max(WORLD.y, camera.y)),
    w,
    h,
  }
}

function isoFromTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null
  return target.closest('[data-iso]')?.getAttribute('data-iso') ?? null
}

function locationLabel(id: string, lang: QuizSettings['lang']) {
  const resolved = resolveMapLocation(id)
  if (!resolved) return ''
  if (resolved.territory) {
    return `${territoryName(resolved.territory, lang)} · ${countryName(resolved.country, lang)}`
  }
  return countryName(resolved.country, lang)
}

function viewBoxFromBoxes(boxes: Array<{ x: number; y: number; width: number; height: number }>) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const box of boxes) {
    if (box.width <= 0 && box.height <= 0) continue
    minX = Math.min(minX, box.x)
    minY = Math.min(minY, box.y)
    maxX = Math.max(maxX, box.x + box.width)
    maxY = Math.max(maxY, box.y + box.height)
  }
  if (!Number.isFinite(minX)) return WORLD_VIEWBOX
  const width = Math.max(24, maxX - minX)
  const height = Math.max(24, maxY - minY)
  const padX = width * 0.08
  const padY = height * 0.08
  return `${minX - padX} ${minY - padY} ${width + padX * 2} ${height + padY * 2}`
}

export function MapScreen({ settings, onChange, onBack }: MapScreenProps) {
  const t = STRINGS[settings.lang]
  const svgRef = useRef<SVGSVGElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; moved: boolean; iso: string | null } | null>(null)
  const [world, setWorld] = useState<WorldMapData | null>(null)
  const [boxes, setBoxes] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [camera, setCamera] = useState<Camera>(WORLD)
  const [panning, setPanning] = useState(false)
  const [mapRegion, setMapRegion] = useState<MapRegion>('all')
  const [regionOpen, setRegionOpen] = useState(false)

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
      zoomBy(event.deltaY < 0 ? 1 : -1)
    }
    frame.addEventListener('wheel', onWheel, { passive: false })
    return () => frame.removeEventListener('wheel', onWheel)
  }, [world])

  const markers = useMemo(() => (world ? markersFor(world.locations) : []), [world])
  const baseViewBox = useMemo(() => {
    if (!world || mapRegion === 'all') return world?.viewBox ?? WORLD_VIEWBOX
    const fit = fitIsosForRegion(mapRegion)
    const selected = [...fit].map((iso) => boxes[iso]).filter(Boolean)
    return selected.length > 0 ? viewBoxFromBoxes(selected) : world.viewBox
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
    return [...countries, ...territories]
      .sort((a, b) => a.label.localeCompare(b.label, settings.lang))
      .slice(0, 8)
  }, [needle, settings.lang])

  function zoomBy(direction: 1 | -1) {
    const factor = direction > 0 ? 1 / 1.35 : 1.35
    setCamera((current) => {
      const cx = current.x + current.w / 2
      const cy = current.y + current.h / 2
      return clampCamera({
        x: cx - (current.w * factor) / 2,
        y: cy - (current.h * factor) / 2,
        w: current.w * factor,
        h: current.h * factor,
      })
    })
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
    if (event.button !== 0) return
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      moved: false,
      iso: isoFromTarget(event.target),
    }
  }

  function onFramePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    const svg = svgRef.current
    if (!drag || !svg) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!drag.moved && Math.hypot(dx, dy) < 8) return
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    if (!drag.moved) {
      event.currentTarget.setPointerCapture(event.pointerId)
      drag.moved = true
      setPanning(true)
    }
    const inv = ctm.inverse()
    const from = new DOMPoint(drag.x, drag.y).matrixTransform(inv)
    const to = new DOMPoint(event.clientX, event.clientY).matrixTransform(inv)
    drag.x = event.clientX
    drag.y = event.clientY
    panBy(from.x - to.x, from.y - to.y)
  }

  function onFramePointerUp() {
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
      <header className="quiz-header">
        <button type="button" className="btn-ghost" onClick={onBack}>
          {t.back}
        </button>
        <h1 className="levels-title">{t.map}</h1>
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
                const isOpen = location.id === openId
                const isHover = location.id === hoverId
                return (
                  <path
                    key={location.id}
                    data-iso={location.id}
                    d={location.path}
                    className={`map-country${clickable ? '' : ' is-other'}${isOpen ? ' is-open' : ''}${isHover ? ' is-hover' : ''}`}
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

      {resolvedOpen && (
        <PassportModal
          country={resolvedOpen.country}
          lang={settings.lang}
          territoryNote={resolvedOpen.territory ? territoryNote(resolvedOpen.territory, settings.lang) : undefined}
          disputeNote={resolvedOpen.territory ? disputeNote(resolvedOpen.territory, settings.lang) : undefined}
          onClose={() => setOpenId(null)}
          onOpenCountry={(iso) => setOpenId(iso)}
        />
      )}

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
