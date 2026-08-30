import { placeCamera, type Camera } from '../lib/mapCamera'

type Ring = Array<[number, number]>

interface WaterShape {
  rings: Ring[]
  cutLand: boolean
}

/** Fitted to @svg-maps/world (Miller-like Y, linear longitude). */
function millerY(lat: number) {
  const rad = (lat * Math.PI) / 180
  return 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * rad))
}

function lonLatToMap(lon: number, lat: number) {
  return {
    x: 2.833389453873 * lon + 474.14968388364383,
    y: -174.30803885829633 * millerY(lat) + 466.43441213802595,
  }
}

function box(west: number, east: number, south: number, north: number): Ring {
  return [
    [west, south],
    [east, south],
    [east, north],
    [west, north],
  ]
}

function ringPath(ring: Ring): string {
  const points = ring.map(([lon, lat]) => lonLatToMap(lon, lat))
  const first = points[0]
  if (!first) return ''
  return `M ${first.x} ${first.y} ${points
    .slice(1)
    .map((point) => `L ${point.x} ${point.y}`)
    .join(' ')} Z`
}

const SHAPES: Record<string, WaterShape> = {
  atlantic: {
    cutLand: true,
    rings: [[
      [-8, 63], [-5, 48], [-6, 43], [-9, 36], [-10, 28], [-17, 16], [5, 4], [12, -6], [14, -18],
      [19, -35], [18, -55], [-10, -58], [-40, -52], [-55, -40], [-48, -25], [-35, -8], [-42, 2],
      [-52, 8], [-60, 12], [-80, 26], [-76, 35], [-68, 44], [-55, 60], [-42, 64], [-24, 64], [-8, 63],
    ]],
  },
  pacific: {
    cutLand: true,
    rings: [[
      [-78, 58], [-80, 32], [-88, 12], [-82, -5], [-76, -18], [-72, -40], [-76, -52], [-110, -48],
      [-150, -40], [-170, -20], [-168, 10], [-160, 40], [-140, 58], [-110, 60], [-78, 58],
    ]],
  },
  indian: {
    cutLand: true,
    rings: [[
      [20, -35], [32, -28], [40, -16], [44, -2], [52, 12], [60, 22], [73, 8], [80, 5], [95, 6],
      [98, -6], [105, -12], [128, -12], [128, -32], [115, -38], [90, -38], [70, -32], [40, -35], [20, -35],
    ]],
  },
  arctic: {
    cutLand: true,
    rings: [[
      [-20, 68], [10, 70], [40, 70], [70, 72], [100, 72], [140, 70], [170, 68], [180, 72],
      [180, 90], [-20, 90], [-20, 68],
    ]],
  },
  southern: {
    cutLand: true,
    rings: [[
      [-60, -48], [20, -48], [80, -50], [140, -50], [180, -52], [180, -68], [-60, -68], [-60, -48],
    ]],
  },
  mediterranean: {
    cutLand: true,
    rings: [[
      [-7.2, 35.2], [-6.2, 44.2], [3.2, 44.0], [7.2, 44.8], [10.2, 45.2], [11.2, 42.8],
      [13.2, 42.0], [16.4, 41.6], [18.8, 41.2], [20.4, 40.6], [23.2, 37.6], [27.4, 37.4],
      [31.2, 37.4], [35.0, 37.6], [37.0, 37.2], [36.6, 32.4], [34.2, 30.4], [31.4, 30.2],
      [24.5, 30.8], [19.4, 31.6], [11.8, 32.0], [9.6, 32.4], [4.6, 35.6], [0.4, 35.4],
      [-2.6, 34.6], [-6.0, 35.0], [-7.2, 35.2],
    ]],
  },
  caribbean: {
    cutLand: true,
    rings: [[
      [-89.2, 22.4], [-85.6, 22.8], [-81.4, 25.2], [-78.4, 28.4], [-73.4, 24.2],
      [-67.4, 23.0], [-63.2, 19.2], [-60.2, 17.2], [-60.2, 10.8], [-64.2, 8.8],
      [-73.0, 8.6], [-78.2, 7.6], [-84.2, 7.4], [-88.4, 11.2], [-89.4, 16.4], [-89.2, 22.4],
    ]],
  },
  gulf_mexico: {
    cutLand: true,
    rings: [[
      [-97.5, 18], [-94, 18.2], [-90, 19], [-86, 21.5], [-83.5, 22], [-81, 25], [-82.5, 28],
      [-84, 30], [-89, 30.4], [-94, 29.7], [-97, 28], [-97.8, 26], [-97.5, 21], [-97.5, 18],
    ]],
  },
  north_sea: {
    cutLand: true,
    rings: [[
      [-2.4, 50.6], [1.8, 50.8], [4.2, 51.2], [8.4, 53.2], [9.6, 57.2], [8.8, 59.2],
      [4.4, 61.6], [-1.6, 61.6], [-3.4, 58.2], [-3.8, 54.6], [-2.6, 51.8], [-2.4, 50.6],
    ]],
  },
  baltic: {
    cutLand: true,
    rings: [[
      [9.6, 54.0], [12.2, 53.8], [15.2, 53.6], [19.4, 53.8], [21.8, 54.4], [23.2, 56.2],
      [24.6, 58.0], [26.8, 59.2], [30.6, 59.4], [30.8, 60.8], [28.2, 61.2], [25.8, 65.6],
      [22.0, 66.4], [17.0, 65.8], [16.2, 63.2], [17.0, 60.4], [17.6, 58.6], [12.8, 56.0],
      [10.0, 56.4], [9.6, 54.0],
    ]],
  },
  black_sea: {
    cutLand: true,
    rings: [[
      [27.5, 41.2], [32, 41.3], [35, 42], [39, 41.3], [41.5, 41.6], [41.8, 43], [40, 44.4],
      [36, 45.3], [33.5, 46.2], [31.5, 46.5], [29.8, 46.3], [28.5, 44.5], [28, 41.8], [27.5, 41.2],
    ]],
  },
  azov: {
    cutLand: true,
    rings: [[
      [34.8, 45.2], [36.6, 45.2], [39.2, 47.1], [38.2, 47.3], [35.4, 46.7], [34.8, 45.8], [34.8, 45.2],
    ]],
  },
  red_sea: {
    cutLand: true,
    rings: [[
      [31.6, 30.4], [34.8, 28.8], [37.2, 24.4], [40.2, 20.2], [43.8, 13.2], [43.8, 11.6],
      [38.4, 14.8], [36.2, 20.4], [34.2, 24.8], [32.0, 28.2], [31.6, 30.4],
    ]],
  },
  persian_gulf: {
    cutLand: true,
    rings: [[
      [47.2, 30.4], [49.8, 31.0], [51.4, 29.0], [54.4, 27.4], [56.8, 26.8], [56.8, 24.8],
      [53.6, 23.8], [51.0, 24.0], [48.6, 27.0], [47.4, 29.4], [47.2, 30.4],
    ]],
  },
  oman_gulf: {
    cutLand: true,
    rings: [[
      [56.3, 26.4], [59.8, 25.4], [61.5, 24.8], [60.5, 23.5], [57.2, 24.8], [56.2, 25.5], [56.3, 26.4],
    ]],
  },
  aden: {
    cutLand: true,
    rings: [[
      [43.3, 12.7], [46, 14], [51, 15.3], [51.4, 11.8], [46, 11.5], [43.5, 12.1], [43.3, 12.7],
    ]],
  },
  south_china: {
    cutLand: true,
    rings: [[
      [105, 3], [109, 12], [112, 18], [116, 22], [120, 22], [121, 16], [120, 10], [118, 6],
      [112, 3], [108, 1], [105, 3],
    ]],
  },
  east_china: {
    cutLand: true,
    rings: [[
      [120, 23], [122, 25], [126, 32], [123, 33.5], [120, 32], [119, 26], [120, 23],
    ]],
  },
  yellow_sea: {
    cutLand: true,
    rings: [[
      [119.5, 32.5], [122, 32], [126.4, 34], [126, 38], [124, 39.5], [120, 38.5], [119.2, 35], [119.5, 32.5],
    ]],
  },
  japan_sea: {
    cutLand: true,
    rings: [[
      [127.5, 34.5], [131, 35], [136, 35.8], [139, 38], [141, 43], [140, 46], [135, 43],
      [130, 42], [128, 38], [127.5, 34.5],
    ]],
  },
  caspian: {
    cutLand: true,
    rings: [[
      [47, 37], [51, 37.2], [54.2, 37.5], [54, 42], [53, 45], [51.8, 47.1], [49.5, 46.8],
      [46.8, 42.5], [47.2, 39], [47, 37],
    ]],
  },
  adriatic: {
    cutLand: true,
    rings: [[
      [12.2, 45.4], [13.8, 45.5], [16.5, 43.5], [19.5, 41.6], [19.2, 40.2], [16, 41.8],
      [13.5, 43.5], [12.3, 44.8], [12.2, 45.4],
    ]],
  },
  aegean: {
    cutLand: true,
    rings: [[
      [22.9, 40.6], [26.5, 40.8], [27.3, 38.2], [28.2, 36.6], [26.4, 35.8], [24, 36.4],
      [23.2, 37.8], [22.9, 40.6],
    ]],
  },
  ionian: {
    cutLand: true,
    rings: [[
      [15.5, 40.2], [18.5, 40.4], [21, 39.7], [21.2, 36.5], [18, 36.5], [15.6, 38], [15.5, 40.2],
    ]],
  },
  tyrrhenian: {
    cutLand: true,
    rings: [[
      [9.5, 42.8], [13.5, 42.2], [15.8, 40], [15.5, 38], [12.5, 38], [8.8, 40.8], [9.5, 42.8],
    ]],
  },
  english_channel: {
    cutLand: true,
    rings: [[
      [-5.7, 48.5], [-1.2, 49.7], [1.5, 51.1], [1.8, 50.7], [-1.8, 48.6], [-5.1, 48.3], [-5.7, 48.5],
    ]],
  },
  irish: {
    cutLand: true,
    rings: [[
      [-6.5, 52], [-3.2, 54.8], [-2.8, 54.2], [-5.2, 51.5], [-6.5, 52],
    ]],
  },
  biscay: {
    cutLand: true,
    rings: [[
      [-9.5, 43.5], [-1.5, 46.2], [-1.2, 43.3], [-8, 43.2], [-9.5, 43.5],
    ]],
  },
  norwegian: {
    cutLand: true,
    rings: [[
      [-1, 61], [8, 62], [15, 68], [25, 71], [20, 74], [5, 72], [-5, 65], [-1, 61],
    ]],
  },
  barents: {
    cutLand: true,
    rings: [[
      [20, 70], [40, 70], [55, 71], [58, 76], [40, 78], [20, 75], [20, 70],
    ]],
  },
  greenland_sea: {
    cutLand: true,
    rings: [[
      [-20, 70], [-5, 72], [5, 75], [-10, 80], [-22, 75], [-20, 70],
    ]],
  },
  hudson: {
    cutLand: true,
    rings: [[
      [-95, 51], [-78, 51], [-77, 56], [-80, 64], [-90, 64], [-96, 58], [-95, 51],
    ]],
  },
  guinea_gulf: {
    cutLand: true,
    rings: [[
      [-8, 4.5], [3, 6.2], [8.5, 4.8], [10, 2], [8, 0], [-3, 0], [-8, 3], [-8, 4.5],
    ]],
  },
  arabian: {
    cutLand: true,
    rings: [[
      [51, 15], [58, 25], [66, 25.4], [73, 20], [73, 8], [60, 10], [52, 12], [51, 15],
    ]],
  },
  bengal: {
    cutLand: true,
    rings: [[
      [80, 6], [85, 16], [92, 22], [94, 16], [97, 10], [92, 6], [80, 6],
    ]],
  },
  andaman: {
    cutLand: true,
    rings: [[
      [92, 6], [98, 13], [98, 6], [96, 5], [92, 6],
    ]],
  },
  mozambique: {
    cutLand: true,
    rings: [[
      [32, -12], [40, -11], [44, -17], [43, -26], [35, -26], [32, -18], [32, -12],
    ]],
  },
  coral: {
    cutLand: true,
    rings: [[
      [142, -10], [155, -12], [165, -20], [155, -24], [145, -22], [142, -16], [142, -10],
    ]],
  },
  tasman: {
    cutLand: true,
    rings: [[
      [148, -32], [160, -32], [172, -40], [168, -48], [150, -43], [148, -32],
    ]],
  },
  timor: {
    cutLand: true,
    rings: [[
      [123, -9], [132, -9], [131, -14], [124, -14], [123, -9],
    ]],
  },
  arafura: {
    cutLand: true,
    rings: [[
      [131, -5], [141, -8], [141, -12], [132, -12], [131, -5],
    ]],
  },
  celebes: {
    cutLand: true,
    rings: [[
      [118, 1], [125, 5], [126, 1], [122, -2], [118, 1],
    ]],
  },
  philippine: {
    cutLand: true,
    rings: [[
      [122, 5], [130, 12], [140, 20], [145, 28], [140, 30], [128, 18], [122, 10], [122, 5],
    ]],
  },
  bering: {
    cutLand: true,
    rings: [[
      [163, 52], [180, 58], [180, 66], [170, 66], [160, 60], [163, 52],
    ]],
  },
  banda: {
    cutLand: true,
    rings: [[
      [124, -3], [132, -3], [132, -7.5], [124, -7.5], [124, -3],
    ]],
  },
  baikal: {
    cutLand: false,
    rings: [[
      [103.7, 51.5], [106.2, 51.45], [108.7, 52.5], [109.9, 53.7], [109.6, 55.5],
      [108.2, 55.85], [106.5, 54.5], [104.4, 53.2], [103.7, 51.5],
    ]],
  },
  victoria: {
    cutLand: true,
    rings: [[
      [31.7, -1.1], [32.6, 0.4], [33.9, 0.5], [34.85, -0.3], [34.8, -2.2],
      [33.6, -3.05], [32.4, -2.6], [31.65, -1.8], [31.7, -1.1],
    ]],
  },
  superior: {
    cutLand: true,
    rings: [[
      [-92.2, 46.7], [-89.5, 46.45], [-84.75, 46.5], [-84.4, 47.95],
      [-85.6, 48.95], [-89.2, 48.8], [-92.1, 48.1], [-92.2, 46.7],
    ]],
  },
  michigan: {
    cutLand: true,
    rings: [[
      [-87.75, 41.65], [-86.1, 41.75], [-85.0, 42.1], [-84.8, 43.7],
      [-85.0, 45.85], [-86.8, 46.05], [-87.8, 44.8], [-87.75, 41.65],
    ]],
  },
  tanganyika: {
    cutLand: true,
    rings: [[
      [29.15, -3.35], [30.55, -3.4], [31.2, -5.9], [31.1, -8.7],
      [29.6, -8.8], [29.05, -6.4], [29.15, -3.35],
    ]],
  },
  malawi: {
    cutLand: true,
    rings: [[
      [34.25, -9.4], [35.2, -9.5], [35.25, -12.3], [34.8, -14.4],
      [34.0, -14.3], [34.05, -11.6], [34.25, -9.4],
    ]],
  },
  titicaca: { cutLand: true, rings: [box(-70.15, -68.55, -16.75, -15.2)] },
  dead_sea: { cutLand: false, rings: [box(35.32, 35.6, 31.13, 31.8)] },
  geneva: { cutLand: true, rings: [box(6.15, 7.12, 46.2, 46.55)] },
  chad: { cutLand: false, rings: [box(13.05, 15.25, 12.55, 14.25)] },
  sevan: { cutLand: false, rings: [box(44.8, 45.7, 40.2, 40.65)] },
  van: { cutLand: false, rings: [box(42.2, 43.6, 38.3, 39.1)] },
  issyk: { cutLand: false, rings: [box(76.2, 78.4, 42.1, 42.75)] },
  balkhash: { cutLand: false, rings: [box(73.4, 79.3, 44.8, 46.8)] },
  aral: { cutLand: false, rings: [box(58.2, 61.7, 43.4, 46.8)] },
  tonle: { cutLand: false, rings: [box(103.7, 104.8, 12.4, 13.3)] },
  inle: { cutLand: false, rings: [box(96.88, 96.97, 20.4, 20.7)] },
  toba: { cutLand: false, rings: [box(98.5, 99.1, 2.3, 2.9)] },
  biwa: { cutLand: false, rings: [box(135.85, 136.3, 34.97, 35.5)] },
  constance: { cutLand: true, rings: [box(9.0, 9.8, 47.48, 47.82)] },
  garda: { cutLand: false, rings: [box(10.5, 10.9, 45.44, 45.9)] },
  balaton: { cutLand: false, rings: [box(17.2, 18.2, 46.62, 47.05)] },
  ohrid: { cutLand: true, rings: [box(20.63, 20.8, 40.9, 41.2)] },
  prespa: { cutLand: true, rings: [box(20.9, 21.15, 40.75, 40.95)] },
  como: { cutLand: false, rings: [box(9.16, 9.32, 45.82, 46.17)] },
  loch_ness: { cutLand: false, rings: [box(-4.55, -4.3, 57.12, 57.42)] },
  vanern: { cutLand: false, rings: [box(12.3, 14.0, 58.7, 59.4)] },
  saimaa: { cutLand: false, rings: [box(27.2, 30.0, 61.0, 62.3)] },
  ladoga: { cutLand: false, rings: [box(29.8, 32.8, 60.1, 61.8)] },
  onega: { cutLand: false, rings: [box(34.4, 36.6, 61.2, 62.9)] },
  nicaragua: { cutLand: true, rings: [box(-85.7, -84.7, 11.0, 12.0)] },
  maracaibo: { cutLand: true, rings: [box(-71.9, -71.0, 9.0, 10.9)] },
  poopo: { cutLand: false, rings: [box(-67.2, -66.7, -19.0, -18.5)] },
  kivu: { cutLand: true, rings: [box(28.8, 29.4, -2.5, -1.5)] },
  albert: { cutLand: true, rings: [box(30.4, 31.4, 1.0, 2.3)] },
  turkana: { cutLand: false, rings: [box(35.8, 36.7, 2.4, 4.7)] },
  tana_lake: { cutLand: false, rings: [box(37.0, 37.6, 11.6, 12.3)] },
  kariba: { cutLand: true, rings: [box(27.0, 29.0, -18.1, -16.4)] },
  volta_lake: { cutLand: false, rings: [box(-0.7, 0.7, 6.2, 7.9)] },
  nasser: { cutLand: false, rings: [box(31.3, 33.2, 21.0, 23.9)] },
  tuz: { cutLand: false, rings: [box(33.2, 33.7, 38.6, 39.1)] },
}

export function waterCutsLand(id: string): boolean {
  return SHAPES[id]?.cutLand ?? true
}

export function waterShapePath(id: string): string {
  const shape = SHAPES[id]
  if (!shape) return ''
  return shape.rings.map(ringPath).join(' ')
}

export function waterShapeCamera(id: string): Camera | undefined {
  const shape = SHAPES[id]
  if (!shape) return undefined
  const points = shape.rings.flat().map(([lon, lat]) => lonLatToMap(lon, lat))
  if (points.length === 0) return undefined
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const point of points) {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  }
  const width = Math.max(28, maxX - minX)
  const height = Math.max(28, maxY - minY)
  const pad = Math.max(width, height) * 0.18
  return placeCamera({
    x: minX - pad,
    y: minY - pad,
    w: width + pad * 2,
    h: height + pad * 2,
  })
}
