'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { COUNTRIES, type Region } from '../data/countries'
import {
  HOLDOUT_BY_ISO,
  TERRITORY_BY_ISO,
  fitIsosForRegions,
  quizIsoFromMapId,
  visibleIsosForRegions,
} from '../data/territories'
import { isClickableIso, markersFor, type WorldMapData } from '../data/worldMap'
import { WATER_BODIES, WATER_VIEW, isosForWater } from '../data/water'
import { waterCutsLand, waterShapeCamera, waterShapePath } from '../data/waterShapes'
import { STRINGS, type Lang } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import {
  cameraForCountry,
  cameraFromPinch,
  clampCamera,
  insetCamera,
  placeCamera,
  pointerDistance,
  screenToSvg,
  REGION_START_ZOOM,
  viewBoxFromBoxes,
  WORLD,
  zoomCamera,
  type Box,
  type Camera,
} from '../lib/mapCamera'
import { isAllRegions, parseRegions, type RegionFilter } from '../lib/quiz'

const PAN_STEP = 0.28
const CLICK_SLOP = 14
const worldPromise = import('@svg-maps/world')

interface QuizMapProps {
  lang: Lang
  variant: 'find' | 'identify' | 'water'
  region: RegionFilter
  focusIso: string
  selectedIso: string | null
  revealed: boolean
  disabled?: boolean
  waterId?: string
  onPick?: (iso: string) => void
}

export function QuizMap({
  lang,
  variant,
  region,
  focusIso,
  selectedIso,
  revealed,
  disabled = false,
  waterId,
  onPick,
}: QuizMapProps) {
  const t = STRINGS[lang]
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
  const [camera, setCamera] = useState<Camera>(WORLD)
  const [panning, setPanning] = useState(false)
  const [hoverId, setHoverId] = useState<string | null>(null)
  cameraRef.current = camera

  const canPan = variant === 'find'
  const waterMode = variant === 'water'
  const scoped = !waterMode && !isAllRegions(region)
  const regions = scoped ? parseRegions(region) : []
  const regionIsos = useMemo(
    () => (scoped ? visibleIsosForRegions(regions as Region[]) : new Set<string>()),
    [scoped, region],
  )
  const fitIsos = useMemo(
    () => (scoped ? fitIsosForRegions(regions as Region[]) : new Set<string>()),
    [scoped, region],
  )

  useEffect(() => {
    let live = true
    worldPromise.then((mod) => {
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

  const bounds = useMemo<Camera>(() => {
    if (!scoped) return WORLD
    const selected = [...regionIsos].map((iso) => boxes[iso]).filter(Boolean)
    return selected.length > 0 ? viewBoxFromBoxes(selected) : WORLD
  }, [boxes, regionIsos, scoped])
  const startBounds = useMemo<Camera>(() => {
    if (!scoped) return WORLD
    const selected = [...fitIsos].map((iso) => boxes[iso]).filter(Boolean)
    return selected.length > 0 ? viewBoxFromBoxes(selected) : bounds
  }, [bounds, boxes, fitIsos, scoped])
  const boundsRef = useRef(bounds)
  boundsRef.current = bounds

  const mapLocations = useMemo(() => {
    if (!world) return []
    return [...world.locations].sort((a, b) => {
      const askA = quizIsoFromMapId(a.id) === focusIso ? 1 : 0
      const askB = quizIsoFromMapId(b.id) === focusIso ? 1 : 0
      return askA - askB
    })
  }, [focusIso, world])
  const markers = useMemo(() => (world ? markersFor(world.locations) : []), [world])

  const focusBox = useMemo(() => {
    const direct = boxes[focusIso]
    if (direct && Math.max(direct.width, direct.height) >= 2) return direct
    const marker = markers.find((item) => quizIsoFromMapId(item.iso) === focusIso)
    if (marker) return { x: marker.x - 4, y: marker.y - 4, width: 8, height: 8 }
    return direct
  }, [boxes, focusIso, markers])

  const coastalIsos = useMemo(() => (waterId ? new Set(isosForWater(waterId)) : new Set<string>()), [waterId])
  const waterKind = waterId ? WATER_BODIES[waterId]?.kind : undefined

  useEffect(() => {
    if (variant === 'water') {
      const shapeCam = waterId ? waterShapeCamera(waterId) : undefined
      if (shapeCam) {
        setCamera(placeCamera(shapeCam))
        return
      }
      const override = waterId ? WATER_VIEW[waterId] : undefined
      if (override) {
        setCamera(placeCamera(override))
        return
      }
      const selected = [...coastalIsos].map((iso) => boxes[iso]).filter(Boolean)
      if (selected.length > 0) setCamera(placeCamera(viewBoxFromBoxes(selected)))
      return
    }
    if (variant === 'identify') {
      if (focusBox) setCamera(placeCamera(cameraForCountry(focusBox)))
      return
    }
    if (revealed) {
      const picked =
        selectedIso && selectedIso !== focusIso
          ? boxes[selectedIso]
          : undefined
      if (picked && focusBox) {
        setCamera(clampCamera(viewBoxFromBoxes([picked, focusBox]), bounds))
        return
      }
      const focus = picked ?? focusBox ?? boxes[focusIso]
      if (focus) setCamera(clampCamera(cameraForCountry(focus), bounds))
      return
    }
    setCamera(insetCamera(startBounds, REGION_START_ZOOM, bounds))
  }, [bounds, boxes, coastalIsos, focusBox, focusIso, revealed, selectedIso, startBounds, variant, waterId])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !canPan) return
    function onWheel(event: WheelEvent) {
      event.preventDefault()
      const pixels =
        event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * 320 : event.deltaY
      const clamped = Math.min(72, Math.max(-72, pixels))
      const factor = Math.exp(clamped * (event.ctrlKey || event.metaKey ? 0.012 : 0.0034))
      zoomAt(event.clientX, event.clientY, factor)
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
  }, [canPan, world])

  function zoomAt(clientX: number, clientY: number, factor: number) {
    const svg = svgRef.current
    const cam = cameraRef.current
    const origin = svg ? screenToSvg(svg, clientX, clientY) : null
    const pivot = origin ?? { x: cam.x + cam.w / 2, y: cam.y + cam.h / 2 }
    setCamera(zoomCamera(cam, factor, pivot, boundsRef.current))
  }


  function zoomBy(direction: 1 | -1) {
    const svg = svgRef.current
    const rect = svg?.getBoundingClientRect()
    const factor = direction > 0 ? 1 / 1.28 : 1.28
    if (rect) {
      zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor)
      return
    }
    const cam = cameraRef.current
    setCamera(
      zoomCamera(cam, factor, { x: cam.x + cam.w / 2, y: cam.y + cam.h / 2 }, boundsRef.current),
    )
  }

  function panBy(dx: number, dy: number) {
    setCamera((current) => clampCamera({ ...current, x: current.x + dx, y: current.y + dy }, bounds))
  }

  function isoFromElement(target: EventTarget | null) {
    if (!(target instanceof Element)) return null
    return target.closest('[data-iso]')?.getAttribute('data-iso') ?? null
  }

  function isoAtPoint(clientX: number, clientY: number) {
    if (typeof document === 'undefined' || !document.elementsFromPoint) {
      return isoFromElement(document.elementFromPoint(clientX, clientY))
    }
    for (const node of document.elementsFromPoint(clientX, clientY)) {
      const iso = isoFromElement(node)
      if (iso) return iso
    }
    return null
  }

  function pickIso(id: string | null) {
    if (revealed || disabled || !id) return
    const iso = quizIsoFromMapId(id)
    if (!iso) return
    if (scoped && !countryInRegion(iso, regions as Region[])) return
    onPick?.(iso)
  }

  function onFramePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!canPan) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const points = [...pointersRef.current.values()]
    if (points.length >= 2) {
      event.currentTarget.setPointerCapture(event.pointerId)
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
      iso: isoFromElement(event.target) ?? isoAtPoint(event.clientX, event.clientY),
    }
  }

  function onFramePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!canPan) return
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
          bounds,
        ),
      )
      return
    }
    const drag = dragRef.current
    const svg = svgRef.current
    if (!drag || drag.id !== event.pointerId || !svg) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!drag.moved && Math.hypot(dx, dy) < CLICK_SLOP) return
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
    if (!canPan) return
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
    if (!drag || drag.moved) return
    pickIso(drag.iso ?? isoAtPoint(event.clientX, event.clientY) ?? isoFromElement(event.target))
  }

  const canZoomIn = camera.w > bounds.w / 8 + 1
  const canZoomOut = camera.w < bounds.w - 1 || camera.h < bounds.h - 1
  const selectedName =
    revealed && selectedIso
      ? COUNTRIES.find((country) => country.iso === selectedIso)
      : null
  const waterLine = waterMode && waterKind === 'river'
  const waterUnderLand = Boolean(waterMode && !waterLine && waterCutsLand(waterId ?? ''))
  const waterOverLand = Boolean(waterMode && !waterLine && waterId && !waterCutsLand(waterId))
  const waterBoxes = [...coastalIsos].map((iso) => boxes[iso]).filter(Boolean)
  const overlay = (waterLine || waterUnderLand || waterOverLand) && (
    <WaterOverlay waterId={waterId} kind={waterKind} boxes={waterBoxes} revealed={revealed} />
  )

  return (
    <div
      ref={frameRef}
      className={`map-frame quiz-map-frame${variant === 'identify' ? ' is-round' : variant === 'water' ? ' is-water' : ' is-find'}${panning ? ' is-panning' : ''}${canPan ? '' : ' is-locked'}`}
      onPointerDown={onFramePointerDown}
      onPointerMove={onFramePointerMove}
      onPointerUp={onFramePointerUp}
      onPointerCancel={onFramePointerUp}
    >
      {canPan ? (
        <>
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
        </>
      ) : null}
      {world ? (
        <svg
          ref={svgRef}
          className="world-map"
          viewBox={`${camera.x} ${camera.y} ${camera.w} ${camera.h}`}
          preserveAspectRatio="xMidYMid meet"
          role="group"
          aria-label={variant === 'find' ? t.nameToMap : variant === 'water' ? t.whichCountry : t.mapToName}
        >
          {waterUnderLand ? overlay : null}
          {mapLocations.map((location) => {
            const quizIso = quizIsoFromMapId(location.id)
            const inScope = !scoped || regionIsos.has(location.id)
            const clickable = Boolean(quizIso) && inScope && isClickableIso(location.id) && !HOLDOUT_BY_ISO.has(location.id)
            const isCoast = waterMode && quizIso !== null && coastalIsos.has(quizIso)
            const isAsk = !waterMode && variant === 'identify' && !revealed && quizIso === focusIso
            const isCorrect = !waterMode && revealed && quizIso === focusIso
            const isWrong = !waterMode && revealed && selectedIso !== null && selectedIso !== focusIso && quizIso === selectedIso
            const isHover = canPan && location.id === hoverId
            return (
              <path
                key={location.id}
                data-iso={location.id}
                d={location.path}
                className={`map-country${clickable ? '' : ' is-other'}${isCoast ? ' is-water-coast' : ''}${isAsk ? ' is-quiz-ask' : ''}${isCorrect ? ' is-quiz-correct' : ''}${isWrong ? ' is-quiz-wrong' : ''}${isHover ? ' is-hover' : ''}`}
                onMouseEnter={() => {
                  if (clickable) setHoverId(location.id)
                }}
                onMouseLeave={() => setHoverId((current) => (current === location.id ? null : current))}
              />
            )
          })}
          {waterOverLand || waterLine ? overlay : null}
          {waterMode ? null : markers.map((marker) => {
            const quizIso = quizIsoFromMapId(marker.iso)
            const inScope = !scoped || regionIsos.has(marker.iso)
            if (!quizIso || !inScope || HOLDOUT_BY_ISO.has(marker.iso)) return null
            const isAsk = variant === 'identify' && !revealed && quizIso === focusIso
            const isCorrect = revealed && quizIso === focusIso
            const isWrong = revealed && selectedIso !== null && selectedIso !== focusIso && quizIso === selectedIso
            const isHover = canPan && marker.iso === hoverId
            const disputed = Boolean(TERRITORY_BY_ISO.get(marker.iso)?.claimRu)
            return (
              <circle
                key={`pin-${marker.iso}`}
                data-iso={marker.iso}
                className={`map-pin${disputed ? ' is-dispute' : ''}${isAsk ? ' is-quiz-ask' : ''}${isCorrect ? ' is-quiz-correct' : ''}${isWrong ? ' is-quiz-wrong' : ''}${isHover ? ' is-hover' : ''}`}
                cx={marker.x}
                cy={marker.y}
                r={isAsk || isCorrect || isWrong ? (disputed ? 5.2 : 4.8) : disputed ? 3.8 : 3.2}
                onMouseEnter={() => setHoverId(marker.iso)}
                onMouseLeave={() => setHoverId((current) => (current === marker.iso ? null : current))}
              />
            )
          })}
        </svg>
      ) : (
        <p className="learn-copy">{t.mapLoading}</p>
      )}
      {variant === 'find' && revealed ? (
        <p className="quiz-map-caption">
          {selectedName ? countryName(selectedName, lang) : t.timedOut}
        </p>
      ) : null}
    </div>
  )
}

function countryInRegion(iso: string, regions: readonly Region[]) {
  const country = COUNTRIES.find((item) => item.iso === iso)
  return Boolean(country && regions.includes(country.region))
}

function WaterOverlay({
  waterId,
  kind,
  boxes,
  revealed,
}: {
  waterId?: string
  kind?: string
  boxes: Box[]
  revealed: boolean
}) {
  const line = kind === 'river'
  const cls = `map-water${line ? ' is-line' : ''}${revealed ? ' is-revealed' : ''}`
  if (line && boxes.length > 0) {
    const points = [...boxes]
      .map((box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 }))
      .sort((a, b) => a.x - b.x || a.y - b.y)
      .map((point) => `${point.x},${point.y}`)
      .join(' ')
    return <polyline className={cls} points={points} fill="none" />
  }
  const shape = waterId ? waterShapePath(waterId) : ''
  const fallback =
    !shape && boxes.length > 0
      ? (() => {
          const view = viewBoxFromBoxes(boxes)
          return `M ${view.x} ${view.y} h ${view.w} v ${view.h} h ${-view.w} Z`
        })()
      : ''
  const d = shape || fallback
  if (!d) return null
  return <path className={cls} d={d} />
}
