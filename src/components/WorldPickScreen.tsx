import { STRINGS } from '../i18n/strings'
import { GeoIcon } from './GeoIcon'
import type { QuizSettings } from './HomeScreen'

export type World = 'geo' | 'football' | 'leaders'

interface WorldPickScreenProps {
  settings: QuizSettings
  onPick: (world: World) => void
}

export function WorldPickScreen({ settings, onPick }: WorldPickScreenProps) {
  const t = STRINGS[settings.lang]

  return (
    <div className="screen world-pick-screen">
      <header className="home-header">
        <h1>{t.worldsPick}</h1>
      </header>

      <div className="world-pick-grid">
        <button type="button" className="world-pick is-geo" onClick={() => onPick('geo')}>
          <span className="world-pick-art" aria-hidden="true">
            <span className="wp-book">
              <span className="wp-cover" />
              <span className="wp-page" />
            </span>
          </span>
          <span className="world-pick-copy">
            <GeoIcon name="globe" size={22} />
            {t.geography}
          </span>
        </button>
        <button type="button" className="world-pick is-football" onClick={() => onPick('football')}>
          <span className="world-pick-art" aria-hidden="true">
            <span className="wp-ticket">
              <span className="wp-led" />
              <span className="wp-pitch" />
            </span>
          </span>
          <span className="world-pick-copy">
            <GeoIcon name="ball" size={24} />
            {t.football}
          </span>
        </button>
        <button type="button" className="world-pick is-leaders" onClick={() => onPick('leaders')}>
          <span className="world-pick-art" aria-hidden="true">
            <span className="wp-decree">
              <GeoIcon name="laurel" size={40} />
            </span>
          </span>
          <span className="world-pick-copy">
            <GeoIcon name="laurel" size={22} />
            {t.leaders}
          </span>
        </button>
      </div>
    </div>
  )
}
