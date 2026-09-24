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
  onWorlds: () => void
  onMatch: (modes: QuizMode[]) => void
}

export function MultiplayerScreen({ settings, onWorlds, onMatch }: MultiplayerScreenProps) {
  const t = STRINGS[settings.lang]
  const queues = matchQueues()
  const [selected, setSelected] = useState<QuizMode[]>(() => initialMatchModes())

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
        <button type="button" className="btn-primary" onClick={() => onMatch(selected)}>
          {t.multiplayerPlay}
        </button>
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
