import { STRINGS, type Lang } from '../i18n/strings'
import { GeoIcon } from './GeoIcon'

export type HubTab = 'free' | 'levels' | 'learn' | 'map'

interface HubNavProps {
  lang: Lang
  active: HubTab
  onSelect: (tab: HubTab) => void
}

const TABS: HubTab[] = ['free', 'levels', 'learn', 'map']
const ICONS = {
  free: 'compass',
  levels: 'map',
  learn: 'meridians',
  map: 'pin',
} as const

export function HubNav({ lang, active, onSelect }: HubNavProps) {
  const t = STRINGS[lang]
  const labels: Record<HubTab, string> = {
    free: t.freePlay,
    levels: t.levels,
    learn: t.learn,
    map: t.map,
  }

  return (
    <nav className="hub-nav" aria-label={t.explore}>
      <div className="choice-grid is-hub">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`choice hub-choice ${active === tab ? 'is-active' : ''}`}
            aria-pressed={active === tab}
            onClick={() => onSelect(tab)}
          >
            <GeoIcon name={ICONS[tab]} size={15} />
            {labels[tab]}
          </button>
        ))}
      </div>
    </nav>
  )
}
