import { STRINGS, modesLabel, type Lang } from '../i18n/strings'
import { formatClock, worldOfMode } from '../lib/quiz'
import { playShareUrl } from '../lib/playHash'
import { quizWorldTitle } from '../lib/shareTheme'
import type { DuelView } from '../lib/duelTypes'
import { ResultsShareShot } from './ResultsShareShot'
import { WorldsBack } from './WorldsBack'

interface DuelResultsProps {
  lang: Lang
  room: DuelView
  roundMs: number
  earnedTokens?: number
  onRematch: () => void
  onMenu: () => void
  onWorlds: () => void
}

export function DuelResults({ lang, room, roundMs, earnedTokens = 0, onRematch, onMenu, onWorlds }: DuelResultsProps) {
  const t = STRINGS[lang]
  const mode = room.modes[0] ?? room.mode
  const theme = `${quizWorldTitle(worldOfMode(mode), lang)} · ${modesLabel(room.modes.length > 0 ? room.modes : [mode], lang)}`
  const shareUrl = playShareUrl(mode)
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
      <div className="results-body">
        <div className="results-main">
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
            {earnedTokens > 0 ? <p className="score-xp">{t.tokensGained(earnedTokens)}</p> : null}
          </section>
          <p className="setting-hint">{rematchHint}</p>
          <button type="button" className="btn-primary" onClick={onRematch} disabled={room.youRematch}>
            {t.duelRematch}
          </button>
          <button type="button" className="btn-ghost" onClick={onWorlds}>
            {t.worldsBack}
          </button>
        </div>
        <ResultsShareShot
          lang={lang}
          url={shareUrl}
          theme={theme}
          score={t.duelScore(room.youScore, room.opponentScore ?? 0, room.total)}
          headline={headline}
          time={t.totalTime(formatClock(roundMs))}
          success={success}
        />
      </div>
    </div>
  )
}
