import { STRINGS, type Lang } from '../i18n/strings'
import { worldCatalogNo } from '../lib/modeCatalog'
import { QUIZ_WORLDS, type QuizWorld } from '../lib/quiz'
import { useRealm } from '../lib/stateStore'
import type { QuizSettings } from './HomeScreen'
import { GeoIcon } from './GeoIcon'
import { FitGroup, FitText } from './FitText'
import { SiteTour } from './SiteTour'
import { useSiteTourOpen } from '../lib/siteTour'

export type World = QuizWorld

interface WorldPickScreenProps {
  settings: QuizSettings
  onPick: (world: World) => void
  onMultiplayer: () => void
  onStudio: () => void
  onCompany: () => void
  onShop: () => void
  onState: () => void
}

const WORLD_ICON = {
  geo: 'globe',
  leaders: 'laurel',
  football: 'ball',
  olympics: 'torch',
  biology: 'leaf',
  math: 'sigma',
  astronomy: 'orbit',
  cs: 'code',
  food: 'bowl',
} as const

function worldTitle(world: QuizWorld, t: (typeof STRINGS)[Lang]) {
  if (world === 'geo') return t.geography
  if (world === 'leaders') return t.leaders
  if (world === 'football') return t.football
  if (world === 'olympics') return t.olympics
  if (world === 'biology') return t.biology
  if (world === 'math') return t.math
  if (world === 'astronomy') return t.astronomy
  if (world === 'cs') return t.cs
  return t.food
}

function WorldArt({ world }: { world: QuizWorld }) {
  if (world === 'geo') {
    return (
      <span className="wp-book">
        <span className="wp-cover" />
        <span className="wp-page" />
      </span>
    )
  }
  if (world === 'football') {
    return (
      <span className="wp-ticket">
        <span className="wp-pitch" />
      </span>
    )
  }
  return <GeoIcon name={WORLD_ICON[world]} size={30} />
}

export function WorldPickScreen({ settings, onPick, onMultiplayer, onStudio, onCompany, onShop, onState }: WorldPickScreenProps) {
  const t = STRINGS[settings.lang]
  const realm = useRealm()
  const stateLabel = realm.name || t.state
  const showTour = useSiteTourOpen()

  return (
    <div className="screen world-pick-screen">
      <FitGroup wrap minPx={8}>
        <div className="world-pick-grid" data-tour="worlds">
          {QUIZ_WORLDS.map((world) => (
            <button
              key={world}
              type="button"
              className={`world-pick is-${world}`}
              data-tour={world === 'geo' ? 'geo' : undefined}
              onClick={() => onPick(world)}
            >
              <span className="world-pick-no" aria-hidden="true">
                {worldCatalogNo(world)}
              </span>
              <span className="world-pick-art" aria-hidden="true">
                <WorldArt world={world} />
              </span>
              <span className="world-pick-copy">
                <FitText>{worldTitle(world, t)}</FitText>
              </span>
            </button>
          ))}
        </div>
      </FitGroup>

      <button type="button" className="world-pick is-state" data-tour="state" onClick={onState}>
        <span className="world-pick-art" aria-hidden="true">
          <GeoIcon name="map" size={28} />
        </span>
        <span className="world-pick-copy">
          <FitText>{stateLabel}</FitText>
        </span>
      </button>

      <nav className="world-pick-dock" aria-label={t.explore} data-tour="dock">
        <FitGroup wrap={false} minPx={7}>
          <button type="button" className="world-dock-tab" onClick={onCompany}>
            <GeoIcon name="hq" size={22} />
            <FitText>{t.company}</FitText>
          </button>
          <button type="button" className="world-dock-tab" onClick={onShop}>
            <GeoIcon name="pin" size={22} />
            <FitText>{t.shop}</FitText>
          </button>
          <button type="button" className="world-dock-tab" onClick={onStudio}>
            <GeoIcon name="stamp" size={22} />
            <FitText>{t.studio}</FitText>
          </button>
          <button type="button" className="world-dock-tab" onClick={onMultiplayer}>
            <GeoIcon name="trophy" size={22} />
            <FitText>{t.multiplayer}</FitText>
          </button>
        </FitGroup>
      </nav>
      {showTour ? <SiteTour lang={settings.lang} /> : null}
    </div>
  )
}
