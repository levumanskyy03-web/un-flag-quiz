import { useState } from 'react'
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

interface MultiplayerScreenProps {
  settings: QuizSettings
  error?: string | null
  onWorlds: () => void
  onMatch: (modes: QuizMode[]) => void
  onCreate: (modes: QuizMode[]) => void
  onJoin: (code: string) => void
}

export function MultiplayerScreen({
  settings,
  error,
  onWorlds,
  onMatch,
  onCreate,
  onJoin,
}: MultiplayerScreenProps) {
  const t = STRINGS[settings.lang]
  const queues = matchQueues()
  const [selected, setSelected] = useState<QuizMode[]>(() => initialMatchModes())
  const [joinCode, setJoinCode] = useState('')

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1>{t.multiplayer}</h1>
        <p className="subtitle">{t.multiplayerHint}</p>
      </header>

      <section className="card settings-card">
        <h2>{t.familyMix}</h2>
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
        <h2>{t.mode}</h2>
        <div className="choice-grid is-modes">
          {queues.singles.map((queue) => (
            <button
              key={queue.id}
              type="button"
              className={`choice has-mode-no ${sameModes(selected, queue.modes) ? 'is-active' : ''}`}
              aria-pressed={sameModes(selected, queue.modes)}
              onClick={() => setSelected([...queue.modes])}
            >
              <CatalogNo n={modesCatalogNo(queue.modes)} />
              <FitText minPx={9}>{matchQueueTitle(queue, settings.lang)}</FitText>
            </button>
          ))}
        </div>
        <button type="button" className="btn-primary" onClick={() => onMatch(selected)}>
          {t.multiplayerPlay}
        </button>
      </section>

      <section className="card settings-card">
        <h2>{t.duel}</h2>
        <p className="setting-hint">{t.duelHint}</p>
        <button type="button" className="btn-secondary" onClick={() => onCreate(selected)}>
          {t.duelCreate}
        </button>
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
