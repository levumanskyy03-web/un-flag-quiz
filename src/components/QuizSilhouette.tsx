'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { markersFor, type WorldMapData } from '../data/worldMap'
import { quizIsoFromMapId } from '../data/territories'
import { cameraToViewBox, viewBoxFromBoxes, type Box } from '../lib/mapCamera'

const worldPromise = import('@svg-maps/world')

type SilhouetteSize = 'hero' | 'option' | 'thumb'

interface QuizSilhouetteProps {
  iso: string
  size?: SilhouetteSize
  className?: string
}

export function QuizSilhouette({ iso, size = 'hero', className = '' }: QuizSilhouetteProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [world, setWorld] = useState<WorldMapData | null>(null)
  const [box, setBox] = useState<Box | null>(null)

  useEffect(() => {
    let live = true
    worldPromise.then((mod) => {
      if (live) setWorld(mod.default)
    })
    return () => {
      live = false
    }
  }, [])

  const paths = useMemo(() => {
    if (!world) return []
    return world.locations.filter((location) => quizIsoFromMapId(location.id) === iso)
  }, [iso, world])

  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg || paths.length === 0) {
      setBox(null)
      return
    }
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    svg.querySelectorAll<SVGGraphicsElement>('path').forEach((path) => {
      const next = path.getBBox()
      minX = Math.min(minX, next.x)
      minY = Math.min(minY, next.y)
      maxX = Math.max(maxX, next.x + next.width)
      maxY = Math.max(maxY, next.y + next.height)
    })
    if (!Number.isFinite(minX)) {
      setBox(null)
      return
    }
    setBox({ x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) })
  }, [iso, paths])

  const markerBox = useMemo(() => {
    if (!world || paths.length > 0) return null
    const marker = markersFor(world.locations).find((item) => quizIsoFromMapId(item.iso) === iso)
    if (!marker) return null
    return { x: marker.x - 6, y: marker.y - 6, width: 12, height: 12 }
  }, [iso, paths.length, world])

  const view = box
    ? cameraToViewBox(viewBoxFromBoxes([box]))
    : markerBox
      ? cameraToViewBox(viewBoxFromBoxes([markerBox]))
      : '0 0 100 100'

  return (
    <svg
      ref={svgRef}
      className={`quiz-silhouette is-${size}${className ? ` ${className}` : ''}`}
      viewBox={view}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {paths.map((location) => (
        <path key={location.id} d={location.path} />
      ))}
      {paths.length === 0 && markerBox ? (
        <circle cx={markerBox.x + 6} cy={markerBox.y + 6} r="5" />
      ) : null}
    </svg>
  )
}
