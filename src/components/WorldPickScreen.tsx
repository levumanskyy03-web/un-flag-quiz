import { STRINGS } from '../i18n/strings'
import type { RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import { AppChrome } from './AppChrome'
import { GeoIcon } from './GeoIcon'
import type { QuizSettings } from './HomeScreen'

export type World = 'geo' | 'football'

interface WorldPickScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  xp?: number
  xpReady?: boolean
  onChange: (settings: QuizSettings) => void
  onPick: (world: World) => void
}

export function WorldPickScreen({
  settings,
  history,
  bests,
  levelClears,
  xp = 0,
  xpReady = false,
  onChange,
  onPick,
}: WorldPickScreenProps) {
  const t = STRINGS[settings.lang]

  return (
    <div className="screen world-pick-screen">
      <header className="home-header">
        <AppChrome
          settings={settings}
          history={history}
          bests={bests}
          levelClears={levelClears}
          xp={xp}
          xpReady={xpReady}
          onChange={onChange}
        />
        <h1>{t.worldsPick}</h1>
      </header>

      <div className="choice-grid world-pick-grid">
        <button type="button" className="choice is-wide world-pick" onClick={() => onPick('geo')}>
          <GeoIcon name="globe" size={22} />
          {t.geography}
        </button>
        <button type="button" className="choice is-wide world-pick" onClick={() => onPick('football')}>
          <span className="world-pick-ball" aria-hidden="true" />
          {t.football}
        </button>
      </div>
    </div>
  )
}
