import { STRINGS, type Lang } from '../i18n/strings'
import { FitGroup, FitText } from './FitText'
import { GeoIcon } from './GeoIcon'

export type HubTab = 'free' | 'levels' | 'learn' | 'map' | 'mistakes' | 'album' | 'lists'

interface HubNavProps {
  lang: Lang
  active: HubTab
  tabs?: HubTab[]
  onSelect: (tab: HubTab) => void
}

export const GEO_HUB_TABS: HubTab[] = ['levels', 'free', 'learn', 'lists', 'mistakes', 'album']
export const WORLD_HUB_TABS: HubTab[] = ['levels', 'free', 'learn', 'lists', 'mistakes', 'album']
export const MATH_HUB_TABS: HubTab[] = ['free', 'levels', 'learn', 'lists', 'mistakes', 'album']
export const ASTRO_HUB_TABS: HubTab[] = MATH_HUB_TABS
export const THEME_HUB_TABS: HubTab[] = MATH_HUB_TABS
const ICONS: Record<HubTab, 'compass' | 'map' | 'meridians' | 'pin' | 'stamp' | 'hash' | 'deck'> = {
  free: 'compass',
  levels: 'map',
  learn: 'meridians',
  map: 'pin',
  mistakes: 'hash',
  album: 'stamp',
  lists: 'deck',
}

function hubShowsMap(tabs?: HubTab[]) {
  return !tabs || tabs === GEO_HUB_TABS || tabs.includes('map')
}

export function HubNav({ lang, active, tabs, onSelect }: HubNavProps) {
  const t = STRINGS[lang]
  const labels: Record<HubTab, string> = {
    free: t.freePlay,
    levels: t.levels,
    learn: t.learn,
    map: t.map,
    mistakes: t.mistakesTrain,
    album: t.album,
    lists: t.legalLists,
  }
  const showMap = hubShowsMap(tabs)
  const gridTabs = (tabs ?? GEO_HUB_TABS).filter((tab) => tab !== 'map')
  const columns = gridTabs.length <= 3 ? 3 : gridTabs.length <= 4 ? 4 : 3

  return (
    <nav className={`hub-nav${showMap ? ' has-map' : ''}`} aria-label={t.explore}>
      <div className={`choice-grid is-hub is-hub-${columns}`}>
        <FitGroup wrap minPx={8}>
          {gridTabs.map((tab) => (
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
      {showMap ? (
        <button
          type="button"
          className={`choice hub-map-aside ${active === 'map' ? 'is-active' : ''}`}
          aria-pressed={active === 'map'}
          onClick={() => onSelect('map')}
        >
          <GeoIcon name="pin" size={15} />
          <FitText>{labels.map}</FitText>
        </button>
      ) : null}
    </nav>
  )
}
