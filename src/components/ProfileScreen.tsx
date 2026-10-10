import { useEffect, useState } from 'react'
import { STRINGS } from '../i18n/strings'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'
import { SettingsModal } from './SettingsModal'
import type { RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import type { Account } from '../lib/account'

interface ProfileScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  onWorlds: () => void
  onLangChange: (settings: QuizSettings) => void
  onClearBests?: () => void
  onAuth?: (account: Account | null) => void
}

export function ProfileScreen({
  settings,
  history,
  bests,
  levelClears,
  onWorlds,
  onLangChange,
  onClearBests,
  onAuth,
}: ProfileScreenProps) {
  const t = STRINGS[settings.lang]
  const [settingsReady, setSettingsReady] = useState(false)
  useEffect(() => {
    setSettingsReady(true)
  }, [])

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1>{t.profile}</h1>
      </header>

      {settingsReady ? (
        <SettingsModal
          embedded
          lang={settings.lang}
          history={history}
          bests={bests}
          levelClears={levelClears}
          onLangChange={(lang) => onLangChange({ ...settings, lang })}
          onClearBests={onClearBests}
          onAuth={onAuth}
          onClose={() => {}}
        />
      ) : (
        <section className="card settings-card" aria-hidden="true" />
      )}
    </div>
  )
}
