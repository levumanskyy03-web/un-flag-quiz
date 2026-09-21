import type { Box } from './mapCamera'

const CLUSTER_GAP = 18
const TINY_FILLED = 6
const MIN_INSET_SPAN = 5
const MAX_INSET_RATIO = 1.2
const BLOAT_RATIO = 0.25

type Rect = { minX: number; minY: number; maxX: number; maxY: number }

export interface SilhouetteGroup {
  paths: string[]
  dx: number
  dy: number
}

export interface SilhouetteLayout {
  groups: SilhouetteGroup[]
  box: Box
}

interface Piece extends Rect {
  d: string
  id: string
  w: number
  h: number
  area: number
  cx: number
  cy: number
}

interface Cluster extends Rect {
  pieces: Piece[]
  w: number
  h: number
  filled: number
  ownFilled: number
  cx: number
  cy: number
}

const ARG_COUNT: Record<string, number> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
}

function tokenize(d: string): Array<string | number> {
  const tokens: Array<string | number> = []
  const re = /([a-zA-Z])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(d))) {
    if (match[1]) tokens.push(match[1])
    else tokens.push(Number(match[2]))
  }
  return tokens
}

function fmt(value: number) {
  const next = Math.abs(value) < 1e-6 ? 0 : value
  return String(Number(next.toFixed(3)))
}

function pathFromCommands(commands: Array<Array<string | number>>) {
  return commands
    .map((command) => {
      const [code, ...args] = command
      if (args.length === 0) return String(code)
      return `${code}${args.map((arg) => fmt(Number(arg))).join(',')}`
    })
    .join('')
}

function splitSubpaths(id: string, d: string): Piece[] {
  const tokens = tokenize(d)
  const pieces: Array<{ commands: Array<Array<string | number>> } & Rect> = []
  let i = 0
  let cmd = 'M'
  let cx = 0
  let cy = 0
  let startX = 0
  let startY = 0
  let current: (typeof pieces)[number] | null = null

  const start = (x: number, y: number) => {
    current = { commands: [['M', x, y]], minX: x, minY: y, maxX: x, maxY: y }
    pieces.push(current)
    startX = x
    startY = y
    cx = x
    cy = y
  }

  const addCommand = (command: Array<string | number>) => {
    current?.commands.push(command)
  }

  const touch = (x: number, y: number) => {
    if (!current) return
    current.minX = Math.min(current.minX, x)
    current.minY = Math.min(current.minY, y)
    current.maxX = Math.max(current.maxX, x)
    current.maxY = Math.max(current.maxY, y)
    cx = x
    cy = y
  }

  while (i < tokens.length) {
    const token = tokens[i]
    if (typeof token === 'string') {
      cmd = token
      i += 1
    }
    const kind = cmd.toUpperCase()
    const rel = cmd === cmd.toLowerCase()
    const arity = ARG_COUNT[kind]
    if (arity == null) break
    if (kind === 'Z') {
      addCommand(['Z'])
      cx = startX
      cy = startY
      continue
    }
    const args = tokens.slice(i, i + arity).map(Number)
    i += arity
    if (args.length < arity || args.some((value) => !Number.isFinite(value))) break
    if (kind === 'M') {
      const x = rel ? cx + args[0] : args[0]
      const y = rel ? cy + args[1] : args[1]
      start(x, y)
      cmd = rel ? 'l' : 'L'
      continue
    }
    if (!current) start(cx, cy)
    if (kind === 'L' || kind === 'T') {
      const x = rel ? cx + args[0] : args[0]
      const y = rel ? cy + args[1] : args[1]
      addCommand([kind, x, y])
      touch(x, y)
    } else if (kind === 'H') {
      const x = rel ? cx + args[0] : args[0]
      addCommand(['H', x])
      touch(x, cy)
    } else if (kind === 'V') {
      const y = rel ? cy + args[0] : args[0]
      addCommand(['V', y])
      touch(cx, y)
    } else if (kind === 'C') {
      const pts = [0, 1, 2].flatMap((k) => [
        rel ? cx + args[k * 2] : args[k * 2],
        rel ? cy + args[k * 2 + 1] : args[k * 2 + 1],
      ])
      addCommand(['C', ...pts])
      touch(pts[4], pts[5])
    } else if (kind === 'S' || kind === 'Q') {
      const pts = [0, 1].flatMap((k) => [
        rel ? cx + args[k * 2] : args[k * 2],
        rel ? cy + args[k * 2 + 1] : args[k * 2 + 1],
      ])
      addCommand([kind, ...pts])
      touch(pts[2], pts[3])
    } else if (kind === 'A') {
      const x = rel ? cx + args[5] : args[5]
      const y = rel ? cy + args[6] : args[6]
      addCommand(['A', args[0], args[1], args[2], args[3], args[4], x, y])
      touch(x, y)
    }
  }

  return pieces.map((piece) => {
    const w = piece.maxX - piece.minX
    const h = piece.maxY - piece.minY
    return {
      id,
      d: pathFromCommands(piece.commands),
      minX: piece.minX,
      minY: piece.minY,
      maxX: piece.maxX,
      maxY: piece.maxY,
      w,
      h,
      area: w * h,
      cx: (piece.minX + piece.maxX) / 2,
      cy: (piece.minY + piece.maxY) / 2,
    }
  })
}

function gap(a: Rect, b: Rect) {
  return Math.hypot(
    Math.max(0, a.minX - b.maxX, b.minX - a.maxX),
    Math.max(0, a.minY - b.maxY, b.minY - a.maxY),
  )
}

function union(boxes: Rect[]): Rect {
  return {
    minX: Math.min(...boxes.map((box) => box.minX)),
    minY: Math.min(...boxes.map((box) => box.minY)),
    maxX: Math.max(...boxes.map((box) => box.maxX)),
    maxY: Math.max(...boxes.map((box) => box.maxY)),
  }
}

function withSize(box: Rect): Cluster {
  const w = box.maxX - box.minX
  const h = box.maxY - box.minY
  return {
    pieces: [],
    ...box,
    w,
    h,
    filled: 0,
    ownFilled: 0,
    cx: (box.minX + box.maxX) / 2,
    cy: (box.minY + box.maxY) / 2,
  }
}

function overlaps(a: Rect, b: Rect, pad = 2) {
  return !(a.maxX + pad <= b.minX || b.maxX + pad <= a.minX || a.maxY + pad <= b.minY || b.maxY + pad <= a.minY)
}

function clusterPieces(pieces: Piece[]): Cluster[] {
  const parent = pieces.map((_, index) => index)
  const find = (index: number): number => (parent[index] === index ? index : (parent[index] = find(parent[index])))
  for (let i = 0; i < pieces.length; i += 1) {
    for (let j = i + 1; j < pieces.length; j += 1) {
      if (gap(pieces[i], pieces[j]) > CLUSTER_GAP) continue
      const a = find(i)
      const b = find(j)
      if (a !== b) parent[a] = b
    }
  }
  const groups = new Map<number, Piece[]>()
  pieces.forEach((piece, index) => {
    const root = find(index)
    const list = groups.get(root)
    if (list) list.push(piece)
    else groups.set(root, [piece])
  })
  return [...groups.values()].map((list) => {
    const box = withSize(union(list))
    return {
      ...box,
      pieces: list,
      filled: list.reduce((sum, piece) => sum + piece.area, 0),
      ownFilled: 0,
    }
  })
}

function placeInset(cluster: Cluster, home: Rect, occupied: Rect[]): Rect {
  const pad = Math.max(4, 0.04 * Math.min(home.maxX - home.minX, home.maxY - home.minY))
  const homeW = home.maxX - home.minX
  const homeH = home.maxY - home.minY
  const vx = cluster.cx - (home.minX + home.maxX) / 2
  const vy = cluster.cy - (home.minY + home.maxY) / 2
  const sides: Array<['w' | 'e' | 'n' | 's', number]> = [
    ['w', -vx],
    ['e', vx],
    ['n', -vy],
    ['s', vy],
  ]
  sides.sort((a, b) => b[1] - a[1])

  for (const [side] of sides) {
    for (let step = 0; step <= 12; step += 1) {
      const t = step === 0 ? 0.5 : ((step % 2 === 1 ? 1 : -1) * Math.ceil(step / 2)) / 12
      let minX: number
      let minY: number
      if (side === 'w') {
        minX = home.minX - pad - cluster.w
        minY = home.minY + t * (homeH - cluster.h)
      } else if (side === 'e') {
        minX = home.maxX + pad
        minY = home.minY + t * (homeH - cluster.h)
      } else if (side === 'n') {
        minX = home.minX + t * (homeW - cluster.w)
        minY = home.minY - pad - cluster.h
      } else {
        minX = home.minX + t * (homeW - cluster.w)
        minY = home.maxY + pad
      }
      const box = { minX, minY, maxX: minX + cluster.w, maxY: minY + cluster.h }
      if (occupied.every((item) => !overlaps(item, box, pad * 0.5))) return box
    }
  }
  return {
    minX: home.maxX + pad,
    minY: home.maxY + pad,
    maxX: home.maxX + pad + cluster.w,
    maxY: home.maxY + pad + cluster.h,
  }
}

function toBox(rect: Rect): Box {
  return {
    x: rect.minX,
    y: rect.minY,
    width: Math.max(1, rect.maxX - rect.minX),
    height: Math.max(1, rect.maxY - rect.minY),
  }
}

export function layoutSilhouette(locations: Array<{ id: string; path: string }>, iso: string): SilhouetteLayout | null {
  const pieces = locations.flatMap((location) => splitSubpaths(location.id, location.path))
  if (pieces.length === 0) return null

  const clusters = clusterPieces(pieces).map((cluster) => ({
    ...cluster,
    ownFilled: cluster.pieces.filter((piece) => piece.id === iso).reduce((sum, piece) => sum + piece.area, 0),
  }))
  const owned = clusters.filter((cluster) => cluster.ownFilled > 0)
  const ranked = owned.length > 0 ? owned : clusters
  const home = ranked.reduce((best, cluster) => {
    const score = owned.length > 0 ? cluster.ownFilled : cluster.filled
    const bestScore = owned.length > 0 ? best.ownFilled : best.filled
    return score > bestScore ? cluster : best
  })
  if (!home) return null

  const homeArea = Math.max(1, home.w * home.h)
  const geographic: Cluster[] = [home]
  const insets: Cluster[] = []

  for (const cluster of clusters) {
    if (cluster === home) continue
    if (cluster.filled < TINY_FILLED || Math.max(cluster.w, cluster.h) < MIN_INSET_SPAN) continue
    if (cluster.filled > home.filled * MAX_INSET_RATIO) continue
    const merged = withSize(union([home, cluster]))
    if ((merged.w * merged.h - homeArea) / homeArea < BLOAT_RATIO) geographic.push(cluster)
    else insets.push(cluster)
  }

  insets.sort((a, b) => b.filled - a.filled)
  const occupied: Rect[] = geographic.map((cluster) => ({
    minX: cluster.minX,
    minY: cluster.minY,
    maxX: cluster.maxX,
    maxY: cluster.maxY,
  }))
  const groups: SilhouetteGroup[] = [
    {
      paths: geographic.flatMap((cluster) => cluster.pieces.map((piece) => piece.d)),
      dx: 0,
      dy: 0,
    },
  ]

  for (const cluster of insets) {
    const placed = placeInset(cluster, home, occupied)
    occupied.push(placed)
    groups.push({
      paths: cluster.pieces.map((piece) => piece.d),
      dx: placed.minX - cluster.minX,
      dy: placed.minY - cluster.minY,
    })
  }

  return { groups, box: toBox(union(occupied)) }
}
