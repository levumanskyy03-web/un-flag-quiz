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
      <WorldsBack lang={lang} onClick={onWorlds} />
      <header className="quiz-header">
        <button type="button" className="btn-ghost" onClick={onLeave}>
          {t.back}
        </button>
        <h1 className="levels-title">{t.duel}</h1>
        <span className="levels-header-spacer" aria-hidden="true" />
      </header>
      <section className="card score-card">
        <p className="score-kicker">{t.duelWaiting}</p>
        <p className="duel-code">{room.code}</p>
        <p className="learn-copy">
          {modesLabel(room.modes ?? [room.mode], lang)} · {regionLabel(room.region, lang)} · {difficultyLabel(room.difficulty, lang)} ·{' '}
          {room.roundSize}
        </p>
        <button type="button" className="btn-secondary" onClick={onCopy}>
          {copied ? t.duelCopied : t.duelCopy}
        </button>
      </section>
      {error ? <p className="account-error">{error}</p> : null}
    </div>
  )
}
