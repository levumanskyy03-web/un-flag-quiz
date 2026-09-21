'use client'

import { useEffect, useMemo, useState } from 'react'
import { markersFor, type WorldMapData } from '../data/worldMap'
import { quizIsoFromMapId } from '../data/territories'
import { isHistoryId, useModernWorldMap } from '../data/history'
import { loadHistoryMap } from '../lib/historyMap'
import { cameraToViewBox, viewBoxFromBoxes, type Box } from '../lib/mapCamera'
import { layoutSilhouette } from '../lib/silhouetteLayout'

const worldPromise = import('@svg-maps/world')

type SilhouetteSize = 'hero' | 'option' | 'thumb'

interface QuizSilhouetteProps {
  iso: string
  size?: SilhouetteSize
  className?: string
  eraYear?: number
}

function silhouetteViewBox(box: Box, size: SilhouetteSize) {
  const long = Math.max(box.width, box.height)
  if (long >= 24) return cameraToViewBox(viewBoxFromBoxes([box]))

  const aspect = size === 'hero' ? 1.75 : size === 'option' ? 1.55 : 1.5
  let width = Math.max(0.75, box.width * 1.28)
  let height = Math.max(0.75, box.height * 1.28)
  if (width / height > aspect) height = width / aspect
  else width = height * aspect

  return cameraToViewBox({
    x: box.x + box.width / 2 - width / 2,
    y: box.y + box.height / 2 - height / 2,
    w: width,
    h: height,
  })
}

export function QuizSilhouette({ iso, size = 'hero', className = '', eraYear }: QuizSilhouetteProps) {
  const [world, setWorld] = useState<WorldMapData | null>(null)
  const [historyShape, setHistoryShape] = useState<{ key: string; path: string | null } | null>(null)
  const modernWorldMap = useModernWorldMap(eraYear ?? Number.POSITIVE_INFINITY)
  const historyMode = Boolean(eraYear && isHistoryId(iso) && !modernWorldMap)
  const historyKey = `${eraYear ?? ''}:${iso}`
  const historyPath = historyShape?.key === historyKey ? historyShape.path : null

  useEffect(() => {
    let live = true
    if (historyMode && eraYear) {
      loadHistoryMap(eraYear).then((data) => {
        if (!live) return
        setHistoryShape({
          key: `${eraYear}:${iso}`,
          path: data.features.find((item) => item.id === iso)?.d ?? null,
        })
      })
      return () => {
        live = false
      }
    }
    worldPromise.then((mod) => {
      if (live) setWorld(mod.default)
    })
    return () => {
      live = false
    }
  }, [eraYear, historyMode, iso])

  const layout = useMemo(() => {
    if (historyPath) return layoutSilhouette([{ id: iso, path: historyPath }], iso)
    if (!world) return null
    return layoutSilhouette(
      world.locations.filter((location) => quizIsoFromMapId(location.id) === iso),
      iso,
    )
  }, [historyPath, iso, world])

  const markerBox = useMemo(() => {
    if (!world || layout?.groups.some((group) => group.paths.length > 0)) return null
    const marker = markersFor(world.locations).find((item) => quizIsoFromMapId(item.iso) === iso)
    if (!marker) return null
    return { x: marker.x - 6, y: marker.y - 6, width: 12, height: 12 }
  }, [iso, layout, world])

  const view = layout
    ? silhouetteViewBox(layout.box, size)
    : markerBox
      ? cameraToViewBox(viewBoxFromBoxes([markerBox]))
      : '0 0 100 100'

  return (
    <svg
      className={`quiz-silhouette is-${size}${className ? ` ${className}` : ''}`}
      viewBox={view}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {layout?.groups.map((group, index) => (
        <g key={index} transform={group.dx || group.dy ? `translate(${group.dx} ${group.dy})` : undefined}>
          {group.paths.map((path, pathIndex) => (
            <path key={pathIndex} d={path} />
          ))}
        </g>
      ))}
      {!layout && markerBox ? <circle cx={markerBox.x + 6} cy={markerBox.y + 6} r="5" /> : null}
    </svg>
  )
}
