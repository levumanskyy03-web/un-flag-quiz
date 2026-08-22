export const WORLD = { x: 0, y: 0, w: 1010, h: 666 }
export const WORLD_VIEWBOX = `${WORLD.x} ${WORLD.y} ${WORLD.w} ${WORLD.h}`
export const ZOOM_MAX = 8
export const REGION_START_ZOOM = 1.3

export type Camera = { x: number; y: number; w: number; h: number }
export type Box = { x: number; y: number; width: number; height: number }

export function parseViewBox(value: string): Camera {
  const [x, y, w, h] = value.split(/[\s,]+/).map(Number)
  return { x, y, w, h }
}

export function zoomCamera(
  camera: Camera,
  factor: number,
  origin: { x: number; y: number },
  bounds: Camera = WORLD,
  zoomMax = ZOOM_MAX,
): Camera {
  const nextFactor = Math.min(8, Math.max(0.12, factor))
  const w = camera.w * nextFactor
  const h = camera.h * nextFactor
  const t = camera.w <= 0 ? 0.5 : (origin.x - camera.x) / camera.w
  const u = camera.h <= 0 ? 0.5 : (origin.y - camera.y) / camera.h
  return clampCamera(
    {
      x: origin.x - t * w,
      y: origin.y - u * h,
      w,
      h,
    },
    bounds,
    zoomMax,
  )
}

export function insetCamera(camera: Camera, zoom: number, bounds: Camera = WORLD): Camera {
  return zoomCamera(
    camera,
    1 / Math.max(1, zoom),
    { x: camera.x + camera.w / 2, y: camera.y + camera.h / 2 },
    bounds,
  )
}

export function clampCamera(camera: Camera, bounds: Camera = WORLD, zoomMax = ZOOM_MAX): Camera {
  const minW = bounds.w / zoomMax
  const minH = bounds.h / zoomMax
  const w = Math.min(bounds.w, Math.max(minW, camera.w))
  const h = Math.min(bounds.h, Math.max(minH, camera.h))
  if (w >= bounds.w - 0.5 || h >= bounds.h - 0.5) return { ...bounds }
  return {
    x: Math.min(bounds.x + bounds.w - w, Math.max(bounds.x, camera.x)),
    y: Math.min(bounds.y + bounds.h - h, Math.max(bounds.y, camera.y)),
    w,
    h,
  }
}

export function screenToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
  const ctm = svg.getScreenCTM()
  if (!ctm) return null
  return new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
}

export function pointerDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function cameraFromPinch(
  svg: SVGSVGElement,
  cam: Camera,
  worldX: number,
  worldY: number,
  clientX: number,
  clientY: number,
  factor: number,
  bounds: Camera = WORLD,
) {
  const w = cam.w * factor
  const h = cam.h * factor
  const rect = svg.getBoundingClientRect()
  const scale = Math.min(rect.width / w, rect.height / h)
  if (scale <= 0) return clampCamera({ ...cam, w, h }, bounds)
  const drawW = w * scale
  const drawH = h * scale
  const originX = rect.left + (rect.width - drawW) / 2
  const originY = rect.top + (rect.height - drawH) / 2
  return clampCamera(
    {
      x: worldX - (clientX - originX) / scale,
      y: worldY - (clientY - originY) / scale,
      w,
      h,
    },
    bounds,
  )
}

export function viewBoxFromBoxes(boxes: Box[]): Camera {
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
  if (!Number.isFinite(minX)) return { ...WORLD }
  const width = Math.max(24, maxX - minX)
  const height = Math.max(24, maxY - minY)
  const padX = width * 0.08
  const padY = height * 0.08
  return {
    x: minX - padX,
    y: minY - padY,
    w: width + padX * 2,
    h: height + padY * 2,
  }
}

export function placeCamera(camera: Camera, bounds: Camera = WORLD): Camera {
  const w = Math.min(Math.max(1, camera.w), bounds.w)
  const h = Math.min(Math.max(1, camera.h), bounds.h)
  return {
    x: Math.min(bounds.x + bounds.w - w, Math.max(bounds.x, camera.x)),
    y: Math.min(bounds.y + bounds.h - h, Math.max(bounds.y, camera.y)),
    w,
    h,
  }
}

export function cameraToViewBox(camera: Camera): string {
  return `${camera.x} ${camera.y} ${camera.w} ${camera.h}`
}

export function cameraForCountry(box: Box): Camera {
  const long = Math.max(box.width, box.height, 1)
  const padFactor = long < 12 ? 3.4 : long < 40 ? 1.5 : 0.62
  const span = Math.max(long * (1 + padFactor), 32)
  return {
    x: box.x + box.width / 2 - span / 2,
    y: box.y + box.height / 2 - span / 2,
    w: span,
    h: span,
  }
}
