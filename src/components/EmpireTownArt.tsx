type Ink = { wall: string; roof: string; trim: string; glass: string; accent: string; glow: string }

const PALETTE: readonly Ink[] = [
  { wall: '#f6e7c8', roof: '#d4533c', trim: '#5c341c', glass: '#8ec8ea', accent: '#e2b04a', glow: '#fff4d2' },
  { wall: '#f3ecdc', roof: '#cfc6b4', trim: '#53483c', glass: '#b7d7ea', accent: '#c4a36a', glow: '#fff8ea' },
  { wall: '#edd6b0', roof: '#7c3b2c', trim: '#3a2618', glass: '#d5e4bf', accent: '#c47a3a', glow: '#ffe7c2' },
  { wall: '#f4e6cc', roof: '#8e342c', trim: '#4a2c24', glass: '#c9d9ef', accent: '#d4ae3a', glow: '#fff1c4' },
  { wall: '#e4ddd2', roof: '#4c555e', trim: '#262b31', glass: '#f0ddb0', accent: '#c47a3a', glow: '#ffe0a8' },
  { wall: '#efeae0', roof: '#3a4a5c', trim: '#1b242e', glass: '#ffe08a', accent: '#f0c14e', glow: '#fff3b0' },
  { wall: '#d7e6ee', roof: '#1c3a4e', trim: '#0d1b26', glass: '#7adfff', accent: '#3ec6ff', glow: '#d8f7ff' },
  { wall: '#e7eef8', roof: '#243056', trim: '#101628', glass: '#d4c2ff', accent: '#f0d48a', glow: '#fff6d0' },
]

function ink(era: number) {
  return PALETTE[Math.min(8, Math.max(1, era)) - 1]
}

function Hall({ p, h }: { p: Ink; h: number }) {
  const top = 78 - h
  return (
    <g>
      <rect x="28" y={top + 18} width="64" height={h + 16} rx="3" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <polygon points={`60,${top - 8} 96,${top + 22} 24,${top + 22}`} fill={p.roof} stroke={p.trim} strokeWidth="3" />
      <rect x="54" y={top + 28} width="12" height={h} fill={p.accent} stroke={p.trim} strokeWidth="2" />
      <circle cx="60" cy={top + 22} r="7" fill={p.glow} stroke={p.trim} strokeWidth="2" />
      <path d={`M60 ${top - 16} v10`} stroke={p.trim} strokeWidth="2" />
      <polygon points={`60,${top - 18} 72,${top - 12} 60,${top - 8}`} fill={p.accent} />
    </g>
  )
}

function Houses({ p }: { p: Ink }) {
  return (
    <g>
      {[18, 46, 74].map((x, i) => (
        <g key={x}>
          <polygon points={`${x + 14},48 ${x + 28},68 ${x},68`} fill={i === 1 ? p.accent : p.roof} stroke={p.trim} strokeWidth="2" />
          <rect x={x + 2} y="68" width="24" height="28" fill={p.wall} stroke={p.trim} strokeWidth="2" />
          <rect x={x + 9} y="78" width="8" height="10" fill={p.glass} stroke={p.trim} strokeWidth="1.5" />
        </g>
      ))}
    </g>
  )
}

function Field({ p, ripe }: { p: Ink; ripe: boolean }) {
  return (
    <g>
      <rect x="16" y="78" width="88" height="26" rx="4" fill="#6b4423" stroke={p.trim} strokeWidth="2" />
      {[26, 42, 58, 74, 90].map((x) => (
        <g key={x}>
          <path d={`M${x} 92 v-16`} stroke="#2f8a3a" strokeWidth="3" />
          {ripe ? <circle cx={x} cy="72" r="4" fill={p.accent} stroke={p.trim} strokeWidth="1.5" /> : null}
        </g>
      ))}
    </g>
  )
}

function Barn({ p }: { p: Ink }) {
  return (
    <g>
      <polygon points="18,70 60,40 102,70" fill={p.roof} stroke={p.trim} strokeWidth="3" />
      <rect x="26" y="68" width="68" height="34" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <rect x="48" y="78" width="24" height="24" rx="2" fill={p.accent} stroke={p.trim} strokeWidth="2" />
      <path d="M60 78 v24 M48 90 h24" stroke={p.trim} strokeWidth="2" />
    </g>
  )
}

function Library({ p }: { p: Ink }) {
  return (
    <g>
      <path d="M28 58 h64 v44 h-64 z" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <path d="M36 58 v-16 h10 v16 M55 58 v-22 h10 v22 M74 58 v-16 h10 v16" fill={p.roof} stroke={p.trim} strokeWidth="2" />
      <path d="M24 58 h72" stroke={p.accent} strokeWidth="4" />
      <rect x="50" y="74" width="20" height="28" fill={p.glass} stroke={p.trim} strokeWidth="2" />
    </g>
  )
}

function Vault({ p }: { p: Ink }) {
  return (
    <g>
      <rect x="30" y="52" width="60" height="50" rx="4" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <path d="M30 64 h60" stroke={p.accent} strokeWidth="6" />
      <circle cx="60" cy="82" r="12" fill={p.glow} stroke={p.trim} strokeWidth="3" />
      <circle cx="60" cy="82" r="3" fill={p.trim} />
    </g>
  )
}

function Stadium({ p }: { p: Ink }) {
  return (
    <g>
      <ellipse cx="60" cy="86" rx="40" ry="16" fill="#3d8f45" stroke={p.trim} strokeWidth="3" />
      <path d="M22 78 q38 -36 76 0" fill="none" stroke={p.roof} strokeWidth="8" />
      <rect x="34" y="70" width="52" height="8" fill={p.wall} stroke={p.trim} strokeWidth="2" />
      <circle cx="60" cy="86" r="6" fill={p.glow} stroke={p.trim} strokeWidth="2" />
    </g>
  )
}

function Dome({ p, torch }: { p: Ink; torch?: boolean }) {
  return (
    <g>
      <rect x="28" y="72" width="64" height="30" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <path d="M32 72 a28 28 0 0 1 56 0" fill={p.roof} stroke={p.trim} strokeWidth="3" />
      {torch ? <polygon points="60,28 66,48 54,48" fill={p.accent} /> : <circle cx="60" cy="52" r="6" fill={p.glass} stroke={p.trim} strokeWidth="2" />}
      <path d="M40 72 v30 M60 72 v30 M80 72 v30" stroke={p.trim} strokeWidth="2" />
    </g>
  )
}

function Greenhouse({ p }: { p: Ink }) {
  return (
    <g>
      <path d="M22 90 L60 46 L98 90 Z" fill={p.glass} stroke={p.trim} strokeWidth="3" opacity="0.95" />
      <path d="M60 46 v44 M38 74 h44" stroke={p.trim} strokeWidth="2" />
      <rect x="48" y="78" width="24" height="14" fill={p.accent} />
      <circle cx="44" cy="84" r="5" fill="#3aaa55" />
      <circle cx="76" cy="80" r="6" fill="#2f8a44" />
    </g>
  )
}

function Academy({ p }: { p: Ink }) {
  return (
    <g>
      <polygon points="60,40 100,68 20,68" fill={p.roof} stroke={p.trim} strokeWidth="3" />
      <rect x="26" y="66" width="68" height="36" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <path d="M44 66 v36 M60 66 v36 M76 66 v36" stroke={p.trim} strokeWidth="2" />
      <circle cx="60" cy="56" r="6" fill={p.glow} stroke={p.trim} strokeWidth="2" />
    </g>
  )
}

function Server({ p }: { p: Ink }) {
  return (
    <g>
      <rect x="38" y="40" width="44" height="62" rx="4" fill={p.trim} />
      {[52, 66, 80].map((y) => (
        <g key={y}>
          <rect x="44" y={y} width="32" height="8" rx="1" fill={p.wall} />
          <circle cx="68" cy={y + 4} r="2" fill={p.glow} />
        </g>
      ))}
      <rect x="52" y="30" width="16" height="12" fill={p.accent} />
    </g>
  )
}

function Stalls({ p }: { p: Ink }) {
  return (
    <g>
      <path d="M16 70 h28 l-4 32 h-20 z" fill={p.wall} stroke={p.trim} strokeWidth="2" />
      <path d="M46 64 h28 l-4 38 h-20 z" fill={p.accent} stroke={p.trim} strokeWidth="2" />
      <path d="M76 70 h28 l-4 32 h-20 z" fill={p.roof} stroke={p.trim} strokeWidth="2" />
      <path d="M18 70 q12 -16 24 0 M48 64 q12 -16 24 0 M78 70 q12 -16 24 0" fill="none" stroke={p.trim} strokeWidth="3" />
    </g>
  )
}

function Temple({ p }: { p: Ink }) {
  return (
    <g>
      <polygon points="60,34 104,62 16,62" fill={p.roof} stroke={p.trim} strokeWidth="3" />
      {[28, 44, 60, 76, 92].map((x) => (
        <rect key={x} x={x} y="62" width="8" height="38" fill={p.wall} stroke={p.trim} strokeWidth="2" />
      ))}
      <rect x="22" y="98" width="76" height="6" fill={p.accent} stroke={p.trim} strokeWidth="2" />
    </g>
  )
}

function Board({ p }: { p: Ink }) {
  return (
    <g>
      <rect x="46" y="78" width="6" height="26" fill={p.trim} />
      <rect x="68" y="78" width="6" height="26" fill={p.trim} />
      <rect x="28" y="42" width="64" height="40" rx="3" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <path d="M36 54 h48 M36 64 h36" stroke={p.accent} strokeWidth="3" />
    </g>
  )
}

function Monument({ p }: { p: Ink }) {
  return (
    <g>
      <polygon points="60,28 78,96 42,96" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <rect x="36" y="96" width="48" height="10" fill={p.accent} stroke={p.trim} strokeWidth="2" />
      <circle cx="60" cy="48" r="6" fill={p.glow} stroke={p.trim} strokeWidth="2" />
    </g>
  )
}

function Market({ p }: { p: Ink }) {
  return (
    <g>
      <rect x="22" y="78" width="76" height="22" rx="3" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <path d="M16 78 q22 -28 44 0 q22 -28 44 0" fill={p.roof} stroke={p.trim} strokeWidth="3" />
      <circle cx="40" cy="88" r="5" fill={p.accent} />
      <circle cx="60" cy="88" r="5" fill={p.glow} />
      <circle cx="80" cy="88" r="5" fill={p.glass} />
    </g>
  )
}

function Senate({ p }: { p: Ink }) {
  return (
    <g>
      <rect x="24" y="70" width="72" height="32" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <path d="M20 70 h80" stroke={p.accent} strokeWidth="5" />
      {[32, 48, 64, 80].map((x) => (
        <rect key={x} x={x} y="48" width="8" height="24" fill={p.roof} stroke={p.trim} strokeWidth="2" />
      ))}
    </g>
  )
}

function MapHouse({ p }: { p: Ink }) {
  return (
    <g>
      <rect x="26" y="58" width="68" height="44" rx="4" fill={p.wall} stroke={p.trim} strokeWidth="3" />
      <path d="M36 70 q12 8 8 18 q16 -4 22 6 q8 -16 18 -8" fill="none" stroke={p.accent} strokeWidth="3" />
      <circle cx="52" cy="82" r="3" fill={p.roof} />
    </g>
  )
}

function Scaffold() {
  return (
    <g opacity="0.9">
      <path d="M18 100 V46 M102 100 V46 M18 60 h84 M18 80 h84" stroke="#c9a36a" strokeWidth="3" />
      <polygon points="96,36 108,36 102,48" fill="#e2b04a" />
    </g>
  )
}

function EraCap({ era, p }: { era: number; p: Ink }) {
  if (era >= 7) {
    return <rect x="26" y="100" width="68" height="7" rx="2" fill={p.glass} stroke={p.trim} strokeWidth="2" />
  }
  if (era >= 6) {
    return (
      <g>
        <path d="M86 78 V28" stroke={p.trim} strokeWidth="3" />
        <path d="M86 36 h18" stroke={p.trim} strokeWidth="3" />
        <circle cx="104" cy="36" r="3.5" fill={p.glow} stroke={p.trim} strokeWidth="1.5" />
      </g>
    )
  }
  if (era >= 5) {
    return (
      <g>
        <rect x="84" y="36" width="10" height="28" fill={p.trim} />
        <rect x="82" y="32" width="14" height="6" fill="#3a4048" />
        <circle cx="89" cy="24" r="5" fill="rgba(230,230,230,0.85)" />
      </g>
    )
  }
  if (era >= 3) {
    return (
      <g>
        {[28, 42, 56, 70, 84].map((x) => (
          <rect key={x} x={x} y="30" width="8" height="12" fill={p.roof} stroke={p.trim} strokeWidth="2" />
        ))}
      </g>
    )
  }
  return <path d="M36 78 l14 -18 M64 78 l-14 -18" stroke={p.trim} strokeWidth="2.5" opacity="0.75" />
}

export function TownSprite({
  kind,
  era,
  tier,
  level,
  busy,
}: {
  kind: string
  era: number
  tier: number
  level: number
  busy: boolean
}) {
  const p = ink(era)
  const h = 16 + tier * 12
  const empty = level <= 0 && kind !== 'board' && kind !== 'legacy' && kind !== 'market' && kind !== 'farm'
  return (
    <svg className={`empire-sprite${busy ? ' is-busy' : ''}`} viewBox="0 0 120 130" aria-hidden="true">
      <ellipse cx="60" cy="116" rx="48" ry="11" fill="#c4a574" stroke={p.trim} strokeWidth="2" />
      <ellipse cx="60" cy="116" rx="36" ry="6" fill="rgba(36,24,12,0.18)" />
      {empty ? (
        <g>
          <rect x="34" y="88" width="52" height="16" fill="#c9a36a" stroke={p.trim} strokeWidth="2" />
          <path d="M46 88 v-18 M74 88 v-18 M46 76 h28" stroke={p.trim} strokeWidth="3" />
        </g>
      ) : kind === 'farm' ? (
        <Field p={p} ripe={level > 0} />
      ) : kind === 'hall' ? (
        <Hall p={p} h={h} />
      ) : kind === 'housing' ? (
        <Houses p={p} />
      ) : kind === 'storage' ? (
        <Barn p={p} />
      ) : kind === 'library' ? (
        <Library p={p} />
      ) : kind === 'treasury' ? (
        <Vault p={p} />
      ) : kind === 'football' ? (
        <Stadium p={p} />
      ) : kind === 'astronomy' || kind === 'olympics' ? (
        <Dome p={p} torch={kind === 'olympics'} />
      ) : kind === 'biology' ? (
        <Greenhouse p={p} />
      ) : kind === 'math' ? (
        <Academy p={p} />
      ) : kind === 'cs' ? (
        <Server p={p} />
      ) : kind === 'food' || kind === 'market' ? (
        kind === 'market' ? <Market p={p} /> : <Stalls p={p} />
      ) : kind === 'pantheon' ? (
        <Temple p={p} />
      ) : kind === 'board' ? (
        <Board p={p} />
      ) : kind === 'legacy' ? (
        <Monument p={p} />
      ) : kind === 'leaders' ? (
        <Senate p={p} />
      ) : (
        <MapHouse p={p} />
      )}
      {empty ? null : <EraCap era={era} p={p} />}
      {busy ? <Scaffold /> : null}
    </svg>
  )
}

export function TownHero({ moving }: { moving: boolean }) {
  return (
    <svg className="empire-hero-fig" viewBox="0 0 40 52" aria-hidden="true">
      <ellipse cx="20" cy="48" rx="12" ry="4" fill="rgba(20,40,20,0.35)" />
      <g className={moving ? 'empire-hero-bob' : undefined}>
        <path className="empire-hero-leg" d="M15 36 v11" stroke="#24180f" strokeWidth="3" strokeLinecap="round" />
        <path className="empire-hero-leg is-b" d="M25 36 v11" stroke="#24180f" strokeWidth="3" strokeLinecap="round" />
        <path d="M9 22 h22 l-2 16 H11 z" fill="#3aa0e0" stroke="#24180f" strokeWidth="2" />
        <path d="M14 24 h12 v6 H14 z" fill="#f0c14e" />
        <circle cx="20" cy="14" r="8" fill="#ffd7b5" stroke="#24180f" strokeWidth="2" />
        <path d="M12 12 q8 -12 16 1 v3 q-8 -8 -16 -1 z" fill="#5c341c" />
      </g>
    </svg>
  )
}

type Ground = {
  sky: string
  sky2: string
  grass: string
  grass2: string
  hill: string
  path: string
  edge: string
  water: string
  tree: string
  trunk: string
  trim: string
}

function groundOf(era: number, night: boolean): Ground {
  if (night || era >= 7) {
    return {
      sky: '#071422',
      sky2: '#16324f',
      grass: '#143028',
      grass2: '#1c4636',
      hill: '#0e241c',
      path: '#2c3c46',
      edge: '#18242c',
      water: '#1d6a8a',
      tree: '#1a5c34',
      trunk: '#3a2a1c',
      trim: '#0d1b26',
    }
  }
  if (era >= 5) {
    return {
      sky: '#8aa4ae',
      sky2: '#d5ddd6',
      grass: '#3e4c36',
      grass2: '#526246',
      hill: '#2c3828',
      path: '#6e685c',
      edge: '#3a342c',
      water: '#3a7890',
      tree: '#2a5a30',
      trunk: '#3a2a18',
      trim: '#262b31',
    }
  }
  if (era >= 3) {
    return {
      sky: '#6eafdf',
      sky2: '#d7eeff',
      grass: '#4f7a34',
      grass2: '#67a044',
      hill: '#3d6230',
      path: '#8d7a62',
      edge: '#5c4630',
      water: '#3aa0d8',
      tree: '#2f7a34',
      trunk: '#5c341c',
      trim: '#3a2618',
    }
  }
  if (era === 2) {
    return {
      sky: '#7eb6e6',
      sky2: '#f3e2b0',
      grass: '#c4b06a',
      grass2: '#d4c48a',
      hill: '#a89048',
      path: '#e6c27a',
      edge: '#b8884a',
      water: '#3aa0d8',
      tree: '#6a8a32',
      trunk: '#6b4423',
      trim: '#53483c',
    }
  }
  return {
    sky: '#79b7ea',
    sky2: '#e7f6ff',
    grass: '#67b84d',
    grass2: '#86d064',
    hill: '#4f9a3c',
    path: '#e6c27a',
    edge: '#c89a4a',
    water: '#3aa0d8',
    tree: '#2f8a3a',
    trunk: '#6b4423',
    trim: '#5c341c',
  }
}

const ROADS: readonly { x: number; y: number; w: number; h: number }[] = [
  { x: 140, y: 202, w: 1680, h: 36 },
  { x: 140, y: 502, w: 1280, h: 36 },
  { x: 140, y: 742, w: 1280, h: 36 },
  { x: 140, y: 1022, w: 1680, h: 36 },
  { x: 140, y: 1262, w: 1680, h: 36 },
  { x: 502, y: 160, w: 36, h: 1200 },
  { x: 1102, y: 160, w: 36, h: 700 },
  { x: 1702, y: 160, w: 36, h: 1200 },
]

const STARS: readonly [number, number][] = [
  [80, 36],
  [220, 78],
  [410, 28],
  [640, 64],
  [880, 22],
  [1120, 70],
  [1380, 34],
  [1640, 58],
  [1880, 24],
  [2000, 86],
]

function Tree({ g, x, y, scale = 1 }: { g: Ground; x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-5" y="-6" width="10" height="28" rx="2" fill={g.trunk} />
      <circle cx="-12" cy="-16" r="16" fill={g.tree} stroke={g.trim} strokeWidth="3" />
      <circle cx="12" cy="-14" r="15" fill={g.tree} stroke={g.trim} strokeWidth="3" />
      <circle cx="0" cy="-28" r="16" fill={g.grass2} stroke={g.trim} strokeWidth="3" />
    </g>
  )
}

function Bush({ g, x, y }: { g: Ground; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx="16" ry="10" fill={g.tree} stroke={g.trim} strokeWidth="2" />
      <ellipse cx="12" cy="2" rx="10" ry="8" fill={g.grass2} stroke={g.trim} strokeWidth="2" />
    </g>
  )
}

function Lamp({ g, x, y, lit }: { g: Ground; x: number; y: number; lit: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-3" y="-28" width="6" height="32" rx="1" fill={g.trunk} />
      <rect x="-8" y="-36" width="16" height="10" rx="2" fill={lit ? '#ffe08a' : '#f0c14e'} stroke={g.trim} strokeWidth="2" />
      {lit ? <circle cx="0" cy="-31" r="12" fill="rgba(255,224,138,0.35)" /> : null}
    </g>
  )
}

function Well({ g, x, y }: { g: Ground; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="4" rx="18" ry="8" fill={g.edge} />
      <ellipse cx="0" cy="0" rx="16" ry="8" fill={g.water} stroke={g.trim} strokeWidth="3" />
      <path d="M-14 -2 v-16 h28 v16" fill="none" stroke={g.trunk} strokeWidth="3" />
      <path d="M-16 -18 h32" stroke={g.trim} strokeWidth="3" />
    </g>
  )
}

function Flower({ g, x, y, gold }: { g: Ground; x: number; y: number; gold?: boolean }) {
  const petal = gold ? '#e2b04a' : '#e05a3c'
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 8 v-16" stroke={g.tree} strokeWidth="2" />
      <circle cx="0" cy="-10" r="5" fill={petal} stroke={g.trim} strokeWidth="1.5" />
      <circle cx="10" cy="-4" r="4" fill={gold ? '#e05a3c' : '#e2b04a'} />
    </g>
  )
}

function Cart({ g, x, y }: { g: Ground; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-16" y="-12" width="32" height="14" rx="2" fill="#c47a3a" stroke={g.trim} strokeWidth="2" />
      <circle cx="-8" cy="6" r="5" fill={g.trim} />
      <circle cx="10" cy="6" r="5" fill={g.trim} />
    </g>
  )
}

function Flag({ g, x, y }: { g: Ground; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-2" y="-36" width="4" height="40" fill={g.trim} />
      <path d="M2 -36 h18 l-4 7 h-14 z" fill="#d4533c" stroke={g.trim} strokeWidth="1.5" />
    </g>
  )
}

function Bench({ g, x, y }: { g: Ground; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-16" y="-6" width="32" height="6" rx="2" fill="#8d6a43" stroke={g.trim} strokeWidth="2" />
      <path d="M-12 0 v8 M12 0 v8" stroke={g.trim} strokeWidth="3" />
    </g>
  )
}

function Columns({ g, x, y }: { g: Ground; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points="-4,0 52,0 46,8 -10,8" fill="#f6e7c8" stroke={g.trim} strokeWidth="2" />
      {[2, 16, 30].map((cx) => (
        <rect key={cx} x={cx} y="8" width="7" height="26" fill="#f3ecdc" stroke={g.trim} strokeWidth="2" />
      ))}
      <rect x="-8" y="34" width="56" height="6" fill="#e2b04a" stroke={g.trim} strokeWidth="2" />
    </g>
  )
}

function Stack({ g, x, y }: { g: Ground; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-8" y="-48" width="16" height="52" fill="#4c555e" stroke={g.trim} strokeWidth="2" />
      <rect x="-11" y="-54" width="22" height="8" fill="#3a4048" />
      <circle cx="4" cy="-66" r="7" fill="rgba(220,224,226,0.75)" />
      <circle cx="14" cy="-78" r="5" fill="rgba(220,224,226,0.45)" />
    </g>
  )
}

export function TownScenery({ era, night = false }: { era: number; night?: boolean }) {
  const g = groundOf(era, night)
  const dark = night || era >= 7
  const cobble = era >= 3
  const lit = era >= 5 || dark
  return (
    <svg className="empire-scenery" viewBox="0 0 2100 1520" aria-hidden="true">
      <rect width="2100" height="1520" fill={g.grass} />
      <rect width="2100" height="240" fill={g.sky} />
      <rect y="120" width="2100" height="120" fill={g.sky2} opacity="0.85" />
      <path d="M0 210 C 180 140 320 230 560 170 C 820 100 980 220 1280 160 C 1560 110 1780 200 2100 140 L2100 260 L0 260 Z" fill={g.hill} />
      <path d="M0 250 C 240 210 420 280 700 240 C 980 200 1200 290 1500 230 C 1760 190 1940 250 2100 220 L2100 320 L0 320 Z" fill={g.grass} />
      <ellipse cx="280" cy="420" rx="120" ry="36" fill={g.grass2} opacity="0.55" />
      <ellipse cx="980" cy="900" rx="160" ry="40" fill={g.grass2} opacity="0.4" />
      <ellipse cx="1680" cy="640" rx="140" ry="34" fill={g.hill} opacity="0.35" />
      <ellipse cx="400" cy="1200" rx="150" ry="36" fill={g.grass2} opacity="0.45" />
      <path d="M0 500 C 220 450 340 620 560 560 C 820 490 980 660 1240 580 C 1520 500 1740 620 2100 540 L2100 660 C 1760 740 1500 620 1220 700 C 920 790 700 620 460 700 C 240 770 80 620 0 680 Z" fill={g.water} opacity="0.9" />
      <path d="M80 560 q90 24 40 48" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
      {ROADS.map((road) => (
        <g key={`${road.x}-${road.y}`}>
          <rect x={road.x} y={road.y} width={road.w} height={road.h} rx="18" fill={g.path} stroke={g.edge} strokeWidth="4" />
          {cobble ? (
            <line
              x1={road.w > road.h ? road.x + 16 : road.x + road.w / 2}
              y1={road.w > road.h ? road.y + road.h / 2 : road.y + 16}
              x2={road.w > road.h ? road.x + road.w - 16 : road.x + road.w / 2}
              y2={road.w > road.h ? road.y + road.h / 2 : road.y + road.h - 16}
              stroke={g.edge}
              strokeWidth="2"
              strokeDasharray="8 14"
              opacity="0.55"
            />
          ) : null}
        </g>
      ))}
      {dark
        ? STARS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={y % 3 === 0 ? 2.2 : 1.4} fill="#fff6d0" />)
        : null}
      {era < 3 && !dark ? (
        <>
          <Columns g={g} x={340} y={108} />
          <Columns g={g} x={700} y={112} />
        </>
      ) : null}
      {era >= 5 ? (
        <>
          <Stack g={g} x={1860} y={300} />
          <Stack g={g} x={160} y={680} />
          <path d="M370 184 H1570" fill="none" stroke={g.trim} strokeWidth="2" opacity="0.7" />
          <path d="M520 150 V184 M1120 150 V184" stroke={g.trim} strokeWidth="2" opacity="0.7" />
        </>
      ) : null}
      <Tree g={g} x={90} y={120} />
      <Tree g={g} x={1960} y={140} scale={1.1} />
      <Tree g={g} x={80} y={900} />
      <Tree g={g} x={1980} y={980} scale={0.9} />
      <Tree g={g} x={1880} y={420} />
      <Tree g={g} x={120} y={1420} scale={1.05} />
      <Bush g={g} x={240} y={360} />
      <Bush g={g} x={900} y={980} />
      <Bush g={g} x={1500} y={460} />
      <Lamp g={g} x={370} y={220} lit={lit} />
      <Lamp g={g} x={970} y={220} lit={lit} />
      <Lamp g={g} x={1570} y={520} lit={lit} />
      <Well g={g} x={1570} y={760} />
      <Flower g={g} x={360} y={400} />
      <Flower g={g} x={680} y={900} gold />
      <Flower g={g} x={980} y={1180} />
      <Cart g={g} x={1570} y={1280} />
      <Flag g={g} x={90} y={220} />
      <Bench g={g} x={1570} y={1040} />
    </svg>
  )
}
