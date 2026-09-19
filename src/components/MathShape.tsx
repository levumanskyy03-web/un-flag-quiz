import type { MathShapeId } from '../data/math'

export function MathShape({ id, size = 88 }: { id: MathShapeId; size?: number }) {
  const stroke = 'currentColor'
  return (
    <svg className="math-shape" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {id === 'triangle' ? <path d="M32 10 54 52H10Z" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" /> : null}
      {id === 'square' ? <rect x="14" y="14" width="36" height="36" stroke={stroke} strokeWidth="2.4" /> : null}
      {id === 'rectangle' ? <rect x="8" y="18" width="48" height="28" stroke={stroke} strokeWidth="2.4" /> : null}
      {id === 'rhombus' ? <path d="M32 8 56 32 32 56 8 32Z" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" /> : null}
      {id === 'parallelogram' ? <path d="M18 16h32L46 48H14Z" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" /> : null}
      {id === 'trapezoid' ? <path d="M18 16h28L54 48H10Z" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" /> : null}
      {id === 'pentagon' ? <path d="M32 8 54 24 46 52H18L10 24Z" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" /> : null}
      {id === 'hexagon' ? <path d="M32 8 52 20v24L32 56 12 44V20Z" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" /> : null}
      {id === 'octagon' ? <path d="M22 8h20l14 14v20L42 56H22L8 42V22Z" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" /> : null}
      {id === 'circle' ? <circle cx="32" cy="32" r="20" stroke={stroke} strokeWidth="2.4" /> : null}
      {id === 'ellipse' ? <ellipse cx="32" cy="32" rx="24" ry="16" stroke={stroke} strokeWidth="2.4" /> : null}
      {id === 'cube' ? (
        <>
          <path d="M16 24h28v28H16Z" stroke={stroke} strokeWidth="2.2" />
          <path d="M16 24 28 12h28L44 24M44 24v28L56 40V12" stroke={stroke} strokeWidth="2.2" />
        </>
      ) : null}
      {id === 'sphere' ? (
        <>
          <circle cx="32" cy="32" r="20" stroke={stroke} strokeWidth="2.4" />
          <ellipse cx="32" cy="32" rx="20" ry="8" stroke={stroke} strokeWidth="1.6" />
        </>
      ) : null}
      {id === 'cylinder' ? (
        <>
          <ellipse cx="32" cy="16" rx="16" ry="7" stroke={stroke} strokeWidth="2.2" />
          <path d="M16 16v32c0 4 7 7 16 7s16-3 16-7V16" stroke={stroke} strokeWidth="2.2" />
          <ellipse cx="32" cy="48" rx="16" ry="7" stroke={stroke} strokeWidth="2.2" />
        </>
      ) : null}
      {id === 'cone' ? (
        <>
          <path d="M32 8 52 48H12Z" stroke={stroke} strokeWidth="2.2" />
          <ellipse cx="32" cy="48" rx="20" ry="7" stroke={stroke} strokeWidth="2.2" />
        </>
      ) : null}
      {id === 'pyramid' ? (
        <>
          <path d="M32 8 54 48 32 40 10 48Z" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M32 8v32" stroke={stroke} strokeWidth="2.2" />
        </>
      ) : null}
    </svg>
  )
}
