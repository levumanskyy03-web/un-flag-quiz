import { STRINGS, type Lang } from '../i18n/strings'
import { FitText } from './FitText'
import { GeoIcon } from './GeoIcon'

export type HubTab = 'free' | 'levels' | 'learn' | 'map' | 'mistakes' | 'album'

interface HubNavProps {
  lang: Lang
  active: HubTab
  tabs?: HubTab[]
  onSelect: (tab: HubTab) => void
}

const GEO_TABS: HubTab[] = ['free', 'levels', 'learn', 'map', 'mistakes', 'album']
const ICONS: Record<HubTab, 'compass' | 'map' | 'meridians' | 'pin' | 'stamp' | 'hash'> = {
  free: 'compass',
  levels: 'map',
  learn: 'meridians',
  map: 'pin',
  mistakes: 'hash',
  album: 'stamp',
}

export function HubNav({ lang, active, tabs = GEO_TABS, onSelect }: HubNavProps) {
  const t = STRINGS[lang]
  const labels: Record<HubTab, string> = {
    free: t.freePlay,
    levels: t.levels,
    learn: t.learn,
    map: t.map,
    mistakes: t.mistakesTrain,
    album: t.album,
  }
  const columns = tabs.length <= 3 ? 3 : tabs.length <= 4 ? 4 : 3

  return (
    <nav className="hub-nav" aria-label={t.explore}>
      <div className={`choice-grid is-hub is-hub-${columns}`}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`choice hub-choice ${active === tab ? 'is-active' : ''}`}
            aria-pressed={active === tab}
            onClick={() => onSelect(tab)}
          >
            <GeoIcon name={ICONS[tab]} size={15} />
            <FitText minPx={8}>{labels[tab]}</FitText>
          </button>
        ))}
      </div>
    </nav>
  )
}
