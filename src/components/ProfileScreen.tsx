import { useEffect, useState } from 'react'
import { STRINGS } from '../i18n/strings'
import { FitText } from './FitText'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'
import {
  initialMatchModes,
  matchQueueNote,
  matchQueueTitle,
  matchQueues,
  type MatchQueue,
} from '../lib/duelMatch'
import { sameModes, type QuizMode } from '../lib/quiz'
import { modesCatalogNo } from '../lib/modeCatalog'
import { CatalogNo } from './ModeChoice'
import { EmpireLock } from './EmpireLock'
import { useEmpire } from '../lib/empireStore'
import { access } from '../lib/empire/gates'
import { SettingsModal } from './SettingsModal'
import type { RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import type { Account } from '../lib/account'

interface ProfileScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  error?: string | null
  onWorlds: () => void
  onLangChange: (settings: QuizSettings) => void
  onClearBests?: () => void
  onAuth?: (account: Account | null) => void
  onCreate: (modes: QuizMode[]) => void
  onJoin: (code: string) => void
}

export function ProfileScreen({
  settings,
  history,
  bests,
  levelClears,
  error,
  onWorlds,
  onLangChange,
  onClearBests,
  onAuth,
  onCreate,
  onJoin,
}: ProfileScreenProps) {
  const t = STRINGS[settings.lang]
  const queues = matchQueues()
  const [selected, setSelected] = useState<QuizMode[]>(() => initialMatchModes())
  const [joinCode, setJoinCode] = useState('')
  const [settingsReady, setSettingsReady] = useState(false)
  useEffect(() => {
    setSettingsReady(true)
  }, [])
  const roomLocked = access(useEmpire(), { kind: 'duelRoom' }) === 'locked'

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1>{t.profile}</h1>
        <p className="subtitle">{t.profileHint}</p>
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

      <section className="card settings-card">
        <h2>{t.playWithFriend}</h2>
        <p className="setting-hint">{t.duelHint}</p>
        <div className="choice-grid">
          {queues.mixes.map((queue) => (
            <MatchQueueButton
              key={queue.id}
              queue={queue}
              lang={settings.lang}
              active={sameModes(selected, queue.modes)}
              onPick={() => setSelected([...queue.modes])}
            />
          ))}
        </div>
        {roomLocked ? (
          <EmpireLock lang={settings.lang} feature={{ kind: 'duelRoom' }} title={t.gateDuelRoom} compact />
        ) : (
          <button type="button" className="btn-secondary" onClick={() => onCreate(selected)}>
            {t.duelCreate}
          </button>
        )}
        <form
          className="duel-join"
          onSubmit={(event) => {
            event.preventDefault()
            onJoin(joinCode)
          }}
        >
          <input
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            placeholder={t.duelCode}
            autoComplete="off"
            maxLength={4}
            spellCheck={false}
            aria-label={t.duelCode}
          />
          <button type="submit" className="choice" disabled={joinCode.trim().length !== 4}>
            {t.duelJoin}
          </button>
        </form>
        {error ? <p className="account-error">{error}</p> : null}
      </section>
    </div>
  )
}

function MatchQueueButton({
  queue,
  lang,
  active,
  onPick,
}: {
  queue: MatchQueue
  lang: QuizSettings['lang']
  active: boolean
  onPick: () => void
}) {
  const note = matchQueueNote(queue, lang)
  return (
    <button
      type="button"
      className={`choice has-note has-mode-no is-wide ${active ? 'is-active' : ''}`}
      aria-pressed={active}
      onClick={onPick}
    >
      <CatalogNo n={modesCatalogNo(queue.modes)} />
      <FitText minPx={9}>{matchQueueTitle(queue, lang)}</FitText>
      {note ? (
        <FitText className="choice-note" wrap minPx={7}>
          {note}
        </FitText>
      ) : null}
    </button>
  )
}
