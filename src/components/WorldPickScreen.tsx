import { STRINGS } from '../i18n/strings'
import type { RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import { AppChrome } from './AppChrome'
import { GeoIcon } from './GeoIcon'
import type { QuizSettings } from './HomeScreen'

export type World = 'geo' | 'football' | 'codes' | 'leaders'

interface WorldPickScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  xp?: number
  xpReady?: boolean
  onChange: (settings: QuizSettings) => void
  onPick: (world: World) => void
  onClearBests?: () => void
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
  onClearBests,
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
          onClearBests={onClearBests}
        />
        <h1>{t.worldsPick}</h1>
      </header>

      <div className="choice-grid world-pick-grid">
        <button type="button" className="choice is-wide world-pick" onClick={() => onPick('geo')}>
          <GeoIcon name="globe" size={22} />
          {t.geography}
        </button>
        <button type="button" className="choice is-wide world-pick" onClick={() => onPick('football')}>
          <GeoIcon name="ball" size={24} />
          {t.football}
        </button>
        <button type="button" className="choice is-wide world-pick" onClick={() => onPick('codes')}>
          <GeoIcon name="hash" size={22} />
          {t.codes}
        </button>
        <button type="button" className="choice is-wide world-pick" onClick={() => onPick('leaders')}>
          <GeoIcon name="crown" size={22} />
          {t.leaders}
        </button>
      </div>
    </div>
  )
}
