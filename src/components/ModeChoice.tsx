import { ChoiceLabel } from './FitText'

interface ModeChoiceProps {
  label: string
  active: boolean
  onClick: () => void
  percent?: number | null
}

export function ModeChoice({ label, active, onClick, percent }: ModeChoiceProps) {
  const show = percent != null && percent > 0
  return (
    <button
      type="button"
      className={`choice${active ? ' is-active' : ''}${show ? ' has-campaign-pct' : ''}${
        percent === 100 ? ' is-campaign-complete' : ''
      }`}
      aria-pressed={active}
      aria-label={show ? `${label} ${percent}%` : undefined}
      onClick={onClick}
    >
      <ChoiceLabel>{label}</ChoiceLabel>
      {show ? (
        <span className="campaign-pct" aria-hidden="true">
          {percent}%
        </span>
      ) : null}
    </button>
  )
}
