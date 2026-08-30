import { STRINGS, difficultyLabel, localeTag, modeLabel, type Lang } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import {
  LEADERS_ASKS,
  LEADERS_DIFFICULTIES,
  LEADERS_MODES,
  LEADERS_TOPICS,
  ROUND_SIZES,
  fitRoundSize,
  formatClock,
  leaderKindOf,
  leaderPoolSize,
  leadersAskOf,
  leadersModeOf,
  type LeaderAsk,
  type LeadersMode,
} from '../lib/quiz'
import type { LeaderKind } from '../data/leaders'
import { AppChrome } from './AppChrome'
import { GeoIcon } from './GeoIcon'
import { HubNav, type HubTab } from './HubNav'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'

interface LeadersScreenProps {
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

export function LeadersScreen({
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
}: LeadersScreenProps) {
  const t = STRINGS[settings.lang]
  const currentBest = findBest(bests, settings)
  const mode = defaultLeadersMode(settings.mode)
  const poolSize = leaderPoolSize(mode, settings.difficulty)

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    const nextMode = defaultLeadersMode(next.mode)
    onChange({ ...next, mode: nextMode, roundSize: fitRoundSize(next.roundSize, leaderPoolSize(nextMode, next.difficulty)) })
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
          onClearBests={onClearBests}
        />
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1 className="football-title">
          <GeoIcon name="crown" size={28} />
          {t.leaders}
        </h1>
        <p className="subtitle">{t.leadersSubtitle}</p>
      </header>

      <HubNav lang={settings.lang} active="free" tabs={['free', 'levels', 'learn', 'mistakes']} onSelect={onHub} />

      <section className="card settings-card">
        <LeadersSetup settings={settings} onChange={update} showDifficulty />

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
        {settings.difficulty === 'hardcore' ? <p className="setting-hint">{t.hardcoreHint}</p> : null}
      </section>

      {currentBest ? (
        <p className="current-best">
          {t.bestOfSetup(t.score(currentBest.correct, currentBest.total), formatClock(currentBest.roundMs))}
        </p>
      ) : null}

      <button type="button" className="btn-primary" disabled={poolSize === 0} onClick={onStart}>
        {t.start}
      </button>

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
              <LeadersRecordRow key={record.id} record={record} lang={settings.lang} score={t.score} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export function LeadersSetup({
  settings,
  onChange,
  showDifficulty = false,
}: {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  showDifficulty?: boolean
}) {
  const t = STRINGS[settings.lang]
  const mode = defaultLeadersMode(settings.mode)
  const topic = leaderKindOf(mode) ?? 'us'
  const ask = leadersAskOf(mode)

  function setTopic(kind: LeaderKind) {
    onChange({ ...settings, mix: null, mode: leadersModeOf(kind, ask) })
  }

  function setAsk(next: LeaderAsk) {
    onChange({ ...settings, mix: null, mode: leadersModeOf(topic, next) })
  }

  return (
    <>
      <h2>{t.leaderTopic}</h2>
      <div className="choice-grid is-3">
        {LEADERS_TOPICS.map((kind) => (
          <button
            key={kind}
            type="button"
            className={`choice ${topic === kind ? 'is-active' : ''}`}
            aria-pressed={topic === kind}
            onClick={() => setTopic(kind)}
          >
            {kind === 'pope' ? t.popesLeaders : kind === 'rus' ? t.askoldToUnion : t.usPresidents}
          </button>
        ))}
      </div>

      <h2>{t.leaderAsk}</h2>
      <div className="choice-grid is-3">
        {LEADERS_ASKS.map((item) => (
          <button
            key={item}
            type="button"
            className={`choice ${ask === item ? 'is-active' : ''}`}
            aria-pressed={ask === item}
            onClick={() => setAsk(item)}
          >
            {item === 'photo' ? t.leaderAskPhoto : item === 'number' ? t.leaderAskNumber : t.leaderAskYears}
          </button>
        ))}
      </div>

      {showDifficulty ? (
        <>
          <h2>{t.difficulty}</h2>
          <div className="choice-grid is-4">
            {LEADERS_DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                className={`choice ${settings.difficulty === difficulty ? 'is-active' : ''}`}
                aria-pressed={settings.difficulty === difficulty}
                onClick={() => onChange({ ...settings, path: 'pool', difficulty, levelHardcore: difficulty === 'hardcore' })}
              >
                {difficultyLabel(difficulty, settings.lang)}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </>
  )
}

function LeadersRecordRow({
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
          {modeLabel(record.mode, lang)} · {difficultyLabel(record.difficulty, lang)} · {record.roundSize} ·{' '}
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

export function defaultLeadersMode(mode: string): LeadersMode {
  if (mode === 'askoldToUnion') return 'rusYearsToName'
  if (mode === 'usNameToYears') return 'usYearsToName'
  if (mode === 'popeNameToYears') return 'popeYearsToName'
  return LEADERS_MODES.includes(mode as LeadersMode) ? (mode as LeadersMode) : 'usYearsToName'
}
