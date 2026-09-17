import { STRINGS, type Lang } from '../i18n/strings'
import { formatClock } from '../lib/quiz'
import { SITE_ORIGIN } from '../lib/site'
import type { DuelView } from '../lib/duelTypes'
import { ShareButton } from './ShareButton'
import { WorldsBack } from './WorldsBack'

interface DuelResultsProps {
  lang: Lang
  room: DuelView
  roundMs: number
  onRematch: () => void
  onMenu: () => void
  onWorlds: () => void
}

export function DuelResults({ lang, room, roundMs, onRematch, onMenu, onWorlds }: DuelResultsProps) {
  const t = STRINGS[lang]
  const opponent = room.opponentName ?? t.duelOpponent
  const headline = room.youWon === true ? t.duelWin : room.youWon === false ? t.duelLose : t.duelDraw
  const success = room.youWon !== false
  const rematchHint = room.youRematch
    ? t.duelRematchWaiting
    : room.opponentRematch
      ? t.duelRematchOffered
      : t.duelRematchHint
  return (
    <div className={`screen results-screen ${success ? 'is-success' : 'is-fail'}`}>
      <WorldsBack lang={lang} onClick={onMenu} label={t.back} />
      <section className={`card score-card ${success ? 'is-success' : 'is-fail'}`}>
        <p className="score-kicker">{room.matchmaking ? t.multiplayer : t.duel}</p>
        <p className="score-value">{t.duelScore(room.youScore, room.opponentScore ?? 0, room.total)}</p>
        <p className="score-headline">{headline}</p>
        <p className="score-time">{t.totalTime(formatClock(roundMs))}</p>
        <p className="learn-copy">
          {room.youName} · {room.youScore}
          {' — '}
          {opponent} · {room.opponentScore ?? 0}
        </p>
        {room.youRating != null ? (
          <p className="score-time">
            {t.duelRating(room.youRating, room.youRatingDelta ?? 0)}
            {room.opponentRating != null ? ` · ${room.opponentRating}` : ''}
          </p>
        ) : null}
      </section>
      <p className="setting-hint">{rematchHint}</p>
      <button type="button" className="btn-primary" onClick={onRematch} disabled={room.youRematch}>
        {t.duelRematch}
      </button>
      <ShareButton
        lang={lang}
        className="btn-secondary"
        url={SITE_ORIGIN}
        text={t.shareResult(t.duelScore(room.youScore, room.opponentScore ?? 0, room.total), SITE_ORIGIN)}
      />
      <button type="button" className="btn-ghost" onClick={onWorlds}>
        {t.worldsBack}
      </button>
    </div>
  )
}
