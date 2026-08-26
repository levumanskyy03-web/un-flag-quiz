import { STRINGS, difficultyLabel, localeTag, modeLabel, type Lang } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import {
  FOOTBALL_MODES,
  PLAY_DIFFICULTIES,
  ROUND_SIZES,
  fitRoundSize,
  footballHasDifficulty,
  footballPoolSize,
  formatClock,
} from '../lib/quiz'
import { AppChrome } from './AppChrome'
import type { QuizSettings } from './HomeScreen'

interface FootballScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  xp?: number
  xpReady?: boolean
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onWorlds: () => void
  onClearHistory: () => void
  onClearBests: () => void
}

export function FootballScreen({
  settings,
  history,
  bests,
  levelClears,
  xp = 0,
  xpReady = false,
  onChange,
  onStart,
  onWorlds,
  onClearHistory,
  onClearBests,
}: FootballScreenProps) {
  const t = STRINGS[settings.lang]
  const showDifficulty = footballHasDifficulty(settings.mode)
  const poolSize = footballPoolSize(settings.mode, settings.difficulty)
  const currentBest = findBest(bests, settings)

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    onChange({ ...next, roundSize: fitRoundSize(next.roundSize, footballPoolSize(next.mode, next.difficulty)) })
  }

  return (
    <div className="screen football-screen">
      <header className="home-header">
        <AppChrome
          settings={settings}
          history={history}
          bests={bests}
          levelClears={levelClears}
          xp={xp}
          xpReady={xpReady}
          onChange={onChange}
        />
        <button type="button" className="btn-ghost worlds-back" onClick={onWorlds}>
          {t.worldsBack}
        </button>
        <h1>{t.football}</h1>
      </header>

      <section className="card settings-card">
        <h2>{t.mode}</h2>
        <div className="choice-grid is-modes">
          {FOOTBALL_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`choice ${settings.mode === mode ? 'is-active' : ''}`}
              aria-pressed={settings.mode === mode}
              onClick={() =>
                update({
                  path: 'pool',
                  mix: null,
                  mode,
                  difficulty: footballHasDifficulty(mode)
                    ? PLAY_DIFFICULTIES.includes(settings.difficulty)
                      ? settings.difficulty
                      : 'easy'
                    : 'easy',
                })
              }
            >
              {modeLabel(mode, settings.lang)}
            </button>
          ))}
        </div>

        {showDifficulty ? (
          <>
            <h2>{t.difficulty}</h2>
            <div className="choice-grid is-3">
              {PLAY_DIFFICULTIES.map((difficulty) => (
                <button
                  key={difficulty}
                  type="button"
                  className={`choice ${settings.difficulty === difficulty ? 'is-active' : ''}`}
                  aria-pressed={settings.difficulty === difficulty}
                  onClick={() => update({ path: 'pool', difficulty, levelHardcore: difficulty === 'hardcore' })}
                >
                  {difficultyLabel(difficulty, settings.lang)}
                </button>
              ))}
            </div>
            {settings.difficulty === 'hardcore' ? <p className="setting-hint">{t.hardcoreHint}</p> : null}
          </>
        ) : null}

        <h2>{t.roundSize}</h2>
        <div className="choice-grid is-3">
          {ROUND_SIZES.map((roundSize) => (
            <button
              key={roundSize}
              type="button"
              className={`choice ${settings.roundSize === roundSize ? 'is-active' : ''}`}
              aria-pressed={settings.roundSize === roundSize}
              disabled={roundSize > poolSize}
              onClick={() => onChange({ ...settings, path: 'pool', roundSize })}
            >
              {roundSize}
            </button>
          ))}
        </div>
      </section>

      {currentBest ? (
        <p className="current-best">
          {t.bestOfSetup(t.score(currentBest.correct, currentBest.total), formatClock(currentBest.roundMs))}
        </p>
      ) : null}

      <button type="button" className="btn-primary" onClick={onStart}>
        {t.start}
      </button>

      {bests.length > 0 ? (
        <section className="card history-card">
          <div className="history-head">
            <h2>{t.bests}</h2>
            <button type="button" className="btn-ghost history-clear" onClick={onClearBests}>
              {t.clearBests}
            </button>
          </div>
          <ul className="history-list">
            {bests.map((record) => (
              <FootballRecordRow key={record.id} record={record} lang={settings.lang} score={t.score} />
            ))}
          </ul>
        </section>
      ) : null}

      {history.length > 0 ? (
        <section className="card history-card">
          <div className="history-head">
            <h2>{t.history}</h2>
            <button type="button" className="btn-ghost history-clear" onClick={onClearHistory}>
              {t.clearHistory}
            </button>
          </div>
          <ul className="history-list">
            {history.slice(0, HISTORY_LIMIT).map((record) => (
              <FootballRecordRow key={record.id} record={record} lang={settings.lang} score={t.score} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

function FootballRecordRow({
  record,
  lang,
  score,
}: {
  record: RoundRecord
  lang: Lang
  score: (correct: number, total: number) => string
}) {
  return (
    <li className="history-row">
      <div className="history-main">
        <p className="history-score">{score(record.correct, record.total)}</p>
        <p className="history-setup">
          {modeLabel(record.mode, lang)}
          {footballHasDifficulty(record.mode) ? ` · ${difficultyLabel(record.difficulty, lang)}` : ''} · {record.roundSize} ·{' '}
          {formatClock(record.roundMs)}
        </p>
      </div>
      <p className="history-when">{formatPlayedAt(record.at, lang)}</p>
    </li>
  )
}

function formatPlayedAt(at: number, lang: Lang): string {
  return new Date(at).toLocaleString(localeTag(lang), {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
