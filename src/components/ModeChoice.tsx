import type { QuizMode } from '../lib/quiz'
import { modeCatalogNo } from '../lib/modeCatalog'
import { ChoiceLabel } from './FitText'

interface ModeChoiceProps {
  label: string
  active: boolean
  onClick: () => void
  percent?: number | null
  mode?: QuizMode
  no?: number
}

export function CatalogNo({ n }: { n?: number }) {
  if (n == null) return null
  return (
    <span className="mode-no" aria-hidden="true">
      {n}
    </span>
  )
}

export function ModeChoice({ label, active, onClick, percent, mode, no }: ModeChoiceProps) {
  const show = percent != null && percent > 0
  const catalog = no ?? (mode ? modeCatalogNo(mode) : undefined)
  const aria = [catalog, label, show ? `${percent}%` : null].filter(Boolean).join(' ')
  return (
    <button
      type="button"
      className={`choice${active ? ' is-active' : ''}${show ? ' has-campaign-pct' : ''}${
        catalog != null ? ' has-mode-no' : ''
      }${percent === 100 ? ' is-campaign-complete' : ''}`}
      aria-pressed={active}
      aria-label={aria}
      onClick={onClick}
    >
      <CatalogNo n={catalog} />
      <ChoiceLabel>{label}</ChoiceLabel>
      {show ? (
        <span className="campaign-pct" aria-hidden="true">
          {percent}%
        </span>
      ) : null}
    </button>
  )
}
