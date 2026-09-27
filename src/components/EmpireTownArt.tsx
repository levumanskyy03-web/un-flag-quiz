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
      <ellipse cx="60" cy="114" rx="42" ry="8" fill="rgba(36,24,12,0.28)" />
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
      {busy ? <Scaffold /> : null}
    </svg>
  )
}

export function TownScenery({ era }: { era: number }) {
  const night = era >= 7
  return (
    <svg className="empire-scenery" viewBox="0 0 2100 1520" aria-hidden="true">
      <path d="M0 520 C 220 460 340 640 560 580 C 820 510 980 680 1240 600 C 1520 520 1740 640 2100 560 L2100 680 C 1760 760 1500 640 1220 720 C 920 810 700 640 460 720 C 240 790 80 640 0 700 Z" fill={night ? '#1d6a8a' : '#3aa0d8'} opacity="0.85" />
      <path d="M80 580 q90 24 40 48" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="4" />
      <ellipse cx="220" cy="140" rx="80" ry="24" fill="rgba(255,255,255,0.18)" />
      <ellipse cx="1680" cy="180" rx="110" ry="28" fill="rgba(255,255,255,0.14)" />
      <ellipse cx="1100" cy="1380" rx="100" ry="24" fill="rgba(40,90,30,0.18)" />
    </svg>
  )
}
