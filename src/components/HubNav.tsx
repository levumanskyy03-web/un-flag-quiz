import { STRINGS, type Lang } from '../i18n/strings'
import { FitGroup, FitText } from './FitText'
import { GeoIcon } from './GeoIcon'

export type HubTab = 'free' | 'levels' | 'learn' | 'map' | 'mistakes' | 'album'

interface HubNavProps {
  lang: Lang
  active: HubTab
  tabs?: HubTab[]
  onSelect: (tab: HubTab) => void
}

export const GEO_HUB_TABS: HubTab[] = ['levels', 'free', 'learn', 'map', 'mistakes', 'album']
export const WORLD_HUB_TABS: HubTab[] = ['levels', 'free', 'learn', 'mistakes', 'album']
export const MATH_HUB_TABS: HubTab[] = ['free', 'levels', 'learn', 'mistakes', 'album']
export const ASTRO_HUB_TABS: HubTab[] = MATH_HUB_TABS
export const THEME_HUB_TABS: HubTab[] = MATH_HUB_TABS
const ICONS: Record<HubTab, 'compass' | 'map' | 'meridians' | 'pin' | 'stamp' | 'hash'> = {
  free: 'compass',
  levels: 'map',
  learn: 'meridians',
  map: 'pin',
  mistakes: 'hash',
  album: 'stamp',
}

export function HubNav({ lang, active, tabs = GEO_HUB_TABS, onSelect }: HubNavProps) {
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
        <FitGroup wrap minPx={8}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`choice hub-choice ${active === tab ? 'is-active' : ''}`}
              aria-pressed={active === tab}
              onClick={() => onSelect(tab)}
            >
              <GeoIcon name={ICONS[tab]} size={15} />
              <FitText>{labels[tab]}</FitText>
            </button>
          ))}
        </FitGroup>
      </div>
    </nav>
  )
}
