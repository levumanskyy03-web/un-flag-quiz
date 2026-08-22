import { STRINGS, type Lang } from '../i18n/strings'
import type { DuelView } from '../lib/duelTypes'

interface DuelResultsProps {
  lang: Lang
  room: DuelView
  onMenu: () => void
}

export function DuelResults({ lang, room, onMenu }: DuelResultsProps) {
  const t = STRINGS[lang]
  const opponent = room.opponentName ?? t.duelOpponent
  const headline = room.youWon === true ? t.duelWin : room.youWon === false ? t.duelLose : t.duelDraw
  const success = room.youWon !== false
  return (
    <div className={`screen results-screen ${success ? 'is-success' : 'is-fail'}`}>
      <section className={`card score-card ${success ? 'is-success' : 'is-fail'}`}>
        <p className="score-kicker">{t.duel}</p>
        <p className="score-value">{t.duelScore(room.youScore, room.opponentScore ?? 0, room.total)}</p>
        <p className="score-headline">{headline}</p>
        <p className="learn-copy">
          {room.youName} · {room.youScore}
          {' — '}
          {opponent} · {room.opponentScore ?? 0}
        </p>
      </section>
      <button type="button" className="btn-primary" onClick={onMenu}>
        {t.backToMenu}
      </button>
    </div>
  )
}
