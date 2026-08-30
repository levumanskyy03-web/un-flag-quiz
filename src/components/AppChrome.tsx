import type { RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import type { QuizSettings } from './HomeScreen'
import { LanguageToggle } from './LanguageToggle'
import { PlayerHud } from './PlayerHud'

interface AppChromeProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  xp?: number
  xpReady?: boolean
  onChange: (settings: QuizSettings) => void
  onClearBests?: () => void
}

export function AppChrome({
  settings,
  history,
  bests,
  levelClears,
  xp = 0,
  xpReady = false,
  onChange,
  onClearBests,
}: AppChromeProps) {
  return (
    <div className="home-top">
      <PlayerHud
        lang={settings.lang}
        history={history}
        bests={bests}
        levelClears={levelClears}
        xp={xp}
        xpReady={xpReady}
        onLangChange={(lang) => onChange({ ...settings, lang })}
        onClearBests={onClearBests}
      />
      <LanguageToggle
        lang={settings.lang}
        onChange={(lang) => onChange({ ...settings, lang })}
      />
    </div>
  )
}
