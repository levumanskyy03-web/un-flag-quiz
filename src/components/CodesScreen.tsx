import { STRINGS, localeTag, modeLabel, type Lang } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import { CODES_MODES, ROUND_SIZES, fitRoundSize, formatClock, type CodesMode } from '../lib/quiz'
import { AppChrome } from './AppChrome'
import { GeoIcon } from './GeoIcon'
import { HubNav, type HubTab } from './HubNav'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'

interface CodesScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  xp?: number
  xpReady?: boolean
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onClearHistory: () => void
  onClearBests: () => void
}

export function CodesScreen({
  settings,
  history,
  bests,
  levelClears,
  xp = 0,
  xpReady = false,
  onChange,
  onStart,
  onHub,
  onWorlds,
  onClearHistory,
  onClearBests,
}: CodesScreenProps) {
  const t = STRINGS[settings.lang]
  const currentBest = findBest(bests, settings)

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    onChange({ ...next, roundSize: fitRoundSize(next.roundSize, 193) })
  }

  return (
    <div className="screen codes-screen">
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
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1 className="football-title">
          <GeoIcon name="hash" size={28} />
          {t.codes}
        </h1>
        <p className="subtitle">{t.codesSubtitle}</p>
      </header>

      <HubNav lang={settings.lang} active="free" tabs={['free', 'learn', 'mistakes']} onSelect={onHub} />

      <section className="card settings-card">
        <h2>{t.mode}</h2>
        <div className="choice-grid is-modes">
          {CODES_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`choice ${settings.mode === mode ? 'is-active' : ''}`}
              aria-pressed={settings.mode === mode}
              onClick={() => update({ path: 'pool', mix: null, mode })}
            >
              {modeLabel(mode, settings.lang)}
            </button>
          ))}
        </div>

        <h2>{t.roundSize}</h2>
        <div className="choice-grid is-3">
          {ROUND_SIZES.map((roundSize) => (
            <button
              key={roundSize}
              type="button"
              className={`choice ${settings.roundSize === roundSize ? 'is-active' : ''}`}
              aria-pressed={settings.roundSize === roundSize}
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
              <CodesRecordRow key={record.id} record={record} lang={settings.lang} score={t.score} />
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
              <CodesRecordRow key={record.id} record={record} lang={settings.lang} score={t.score} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

function CodesRecordRow({
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
          {modeLabel(record.mode, lang)} · {record.roundSize} · {formatClock(record.roundMs)}
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

export function defaultCodesMode(mode: QuizSettings['mode']): CodesMode {
  return CODES_MODES.includes(mode as CodesMode) ? (mode as CodesMode) : 'tldToName'
}
