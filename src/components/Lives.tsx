interface LivesProps {
  filled: number
  total: number
  gold?: boolean
  label?: string
  size?: 'md' | 'sm'
}

export function Lives({ filled, total, gold = false, label, size = 'md' }: LivesProps) {
  return (
    <span className={`lives lives-${size}${gold ? ' is-gold' : ''}`} aria-label={label}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`life ${i < filled ? 'is-on' : 'is-off'}`} aria-hidden="true">
          ♥
        </span>
      ))}
    </span>
  )
}
