import { STRINGS, difficultyLabel, modesLabel, regionLabel, type Lang } from '../i18n/strings'
import type { DuelView } from '../lib/duelTypes'
import { WorldsBack } from './WorldsBack'

interface DuelLobbyProps {
  lang: Lang
  room: DuelView
  error?: string | null
  onCopy: () => void
  copied: boolean
  onLeave: () => void
  onWorlds: () => void
}

export function DuelLobby({ lang, room, error, onCopy, copied, onLeave, onWorlds }: DuelLobbyProps) {
  const t = STRINGS[lang]
  return (
    <div className="screen duel-lobby">
      <WorldsBack lang={lang} onClick={onLeave} label={t.back} />
      <header className="quiz-header">
        <button type="button" className="btn-ghost" onClick={onWorlds}>
          {t.worldsBack}
        </button>
        <h1 className="levels-title">{room.matchmaking ? t.multiplayer : t.duel}</h1>
        <span className="levels-header-spacer" aria-hidden="true" />
      </header>
      <section className="card score-card">
        <p className="score-kicker">{room.matchmaking ? t.multiplayerWaiting : t.duelWaiting}</p>
        {room.matchmaking ? null : <p className="duel-code">{room.code}</p>}
        <p className="learn-copy">
          {modesLabel(room.modes ?? [room.mode], lang)} · {regionLabel(room.region, lang)} · {difficultyLabel(room.difficulty, lang)} ·{' '}
          {room.roundSize}
        </p>
        {room.matchmaking ? null : (
          <button type="button" className="btn-secondary" onClick={onCopy}>
            {copied ? t.duelCopied : t.duelCopy}
          </button>
        )}
      </section>
      {error ? <p className="account-error">{error}</p> : null}
    </div>
  )
}
