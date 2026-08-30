'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { HOLDOUT_BY_ISO, quizIsoFromMapId } from '../data/territories'
import { isClickableIso, markersFor, type WorldMapData } from '../data/worldMap'
import { countryPath } from '../lib/countryCatalog'
import { placeCamera, viewBoxFromBoxes, WORLD, type Camera } from '../lib/mapCamera'

const worldPromise = import('@svg-maps/world')

interface LanguageRangeMapProps {
  isos: string[]
  label: string
}

export function LanguageRangeMap({ isos, label }: LanguageRangeMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [world, setWorld] = useState<WorldMapData | null>(null)
  const [boxes, setBoxes] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({})
  const [camera, setCamera] = useState<Camera>(WORLD)
  const highlighted = useMemo(() => new Set(isos), [isos])

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

  const markers = useMemo(() => (world ? markersFor(world.locations) : []), [world])

  useEffect(() => {
    const selected = isos.flatMap((iso) => {
      const box = boxes[iso]
      if (box && Math.max(box.width, box.height) >= 2) return [box]
      const marker = markers.find((item) => quizIsoFromMapId(item.iso) === iso)
      return marker ? [{ x: marker.x - 6, y: marker.y - 6, width: 12, height: 12 }] : []
    })
    setCamera(placeCamera(selected.length > 0 ? viewBoxFromBoxes(selected) : WORLD))
  }, [boxes, isos, markers])

  return (
    <div className="quiz-map-frame lang-range-map">
      {world ? (
        <svg
          ref={svgRef}
          className="world-map"
          viewBox={`${camera.x} ${camera.y} ${camera.w} ${camera.h}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={label}
        >
          {world.locations.map((location) => {
            const quizIso = quizIsoFromMapId(location.id)
            const active = quizIso !== null && highlighted.has(quizIso)
            const clickable = Boolean(quizIso) && isClickableIso(location.id) && !HOLDOUT_BY_ISO.has(location.id)
            return (
              <path
                key={location.id}
                data-iso={location.id}
                d={location.path}
                className={`map-country${clickable ? '' : ' is-other'}${active ? ' is-lang-range' : ''}`}
                onClick={() => {
                  if (active && quizIso) window.location.assign(countryPath(quizIso))
                }}
              />
            )
          })}
          {markers.map((marker) => {
            const quizIso = quizIsoFromMapId(marker.iso)
            if (!quizIso || HOLDOUT_BY_ISO.has(marker.iso) || !highlighted.has(quizIso)) return null
            return (
              <circle
                key={`pin-${marker.iso}`}
                className="map-pin is-lang-range"
                cx={marker.x}
                cy={marker.y}
                r={4.4}
                onClick={() => window.location.assign(countryPath(quizIso))}
              />
            )
          })}
        </svg>
      ) : (
        <p className="learn-copy">{label}</p>
      )}
    </div>
  )
}
