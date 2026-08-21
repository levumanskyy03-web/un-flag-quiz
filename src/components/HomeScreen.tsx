import type { Region } from '../data/countries'
import { REGIONS, STRINGS, difficultyLabel, modeLabel, regionLabel, type Lang } from '../i18n/strings'
import { findBest, type RoundRecord } from '../lib/history'
import {
  PLAY_DIFFICULTIES,
  ROUND_SIZES,
  fitRoundSize,
  formatClock,
  getPool,
  isRegionSelected,
  toggleRegion,
  type LearnFrom,
  type PlayPath,
  type QuizDifficulty,
  type QuizMode,
  type RegionFilter,
  type RoundSize,
} from '../lib/quiz'
import { LanguageToggle } from './LanguageToggle'

export interface QuizSettings {
  lang: Lang
  mode: QuizMode
  region: RegionFilter
  difficulty: QuizDifficulty
  roundSize: RoundSize
  path: PlayPath
  level: number
  levelHardcore: boolean
  levelLives: number
  levelLearn: boolean
  learnFrom: LearnFrom
}

interface HomeScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onOpenLevels: () => void
  onOpenLearn: () => void
  onClearHistory: () => void
  onClearBests: () => void
}

export function HomeScreen({
  settings,
  history,
  bests,
  onChange,
  onStart,
  onOpenLevels,
  onOpenLearn,
  onClearHistory,
  onClearBests,
}: HomeScreenProps) {
  const t = STRINGS[settings.lang]
  const poolSize = getPool(settings.region, settings.difficulty).length
  const regions: Array<Region | 'all'> = ['all', ...REGIONS]
  const modes: QuizMode[] = ['flagToName', 'nameToFlag']
  const difficulties = PLAY_DIFFICULTIES
  const currentBest = findBest(bests, settings)

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <LanguageToggle
          lang={settings.lang}
          onChange={(lang) => onChange({ ...settings, lang })}
        />
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </header>

      <section className="card settings-card">
        <h2>{t.mode}</h2>
        <div className="choice-grid">
          {modes.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`choice ${settings.mode === mode ? 'is-active' : ''}`}
              aria-pressed={settings.mode === mode}
              onClick={() => onChange({ ...settings, path: 'pool', mode })}
            >
              {modeLabel(mode, settings.lang)}
            </button>
          ))}
          <button type="button" className="choice" onClick={onOpenLevels}>
            {t.levels}
          </button>
          <button type="button" className="choice" onClick={onOpenLearn}>
            {t.learn}
          </button>
        </div>

        <h2>{t.region}</h2>
        <div className="choice-wrap">
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              className={`chip ${isRegionSelected(settings.region, region) ? 'is-active' : ''}`}
              aria-pressed={isRegionSelected(settings.region, region)}
              onClick={() => {
                const nextRegion = toggleRegion(settings.region, region)
                const nextPool = getPool(nextRegion, settings.difficulty).length
                onChange({
                  ...settings,
                  path: 'pool',
                  region: nextRegion,
                  roundSize: fitRoundSize(settings.roundSize, nextPool),
                })
              }}
            >
              {regionLabel(region, settings.lang)}
            </button>
          ))}
        </div>

        <h2>{t.difficulty}</h2>
        <div className="choice-grid is-3">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              className={`choice ${settings.difficulty === difficulty ? 'is-active' : ''}`}
              aria-pressed={settings.difficulty === difficulty}
              onClick={() => {
                const nextPool = getPool(settings.region, difficulty).length
                onChange({
                  ...settings,
                  path: 'pool',
                  difficulty,
                  levelHardcore: difficulty === 'hardcore',
                  roundSize: fitRoundSize(settings.roundSize, nextPool),
                })
              }}
            >
              {difficultyLabel(difficulty, settings.lang)}
            </button>
          ))}
        </div>
        {settings.difficulty === 'hardcore' && <p className="setting-hint">{t.hardcoreHint}</p>}

        <h2>{t.roundSize}</h2>
        <div className="choice-grid is-3">
          {ROUND_SIZES.map((roundSize) => (
            <button
              key={roundSize}
              type="button"
              className={`choice ${settings.roundSize === roundSize ? 'is-active' : ''}`}
              aria-pressed={settings.roundSize === roundSize}
              disabled={poolSize > 0 && roundSize > poolSize}
              onClick={() => onChange({ ...settings, path: 'pool', roundSize })}
            >
              {roundSize}
            </button>
          ))}
        </div>
      </section>

      {currentBest && (
        <p className="current-best">
          {t.bestOfSetup(t.score(currentBest.correct, currentBest.total), formatClock(currentBest.roundMs))}
        </p>
      )}

      <button type="button" className="btn-primary" disabled={poolSize === 0} onClick={onStart}>
        {t.start}
      </button>

      {bests.length > 0 && (
        <section className="card history-card">
          <div className="history-head">
            <h2>{t.bests}</h2>
            <button type="button" className="btn-ghost history-clear" onClick={onClearBests}>
              {t.clearBests}
            </button>
          </div>
          <ul className="history-list">
            {bests.map((record) => (
              <RecordRow key={record.id} record={record} lang={settings.lang} score={t.score} />
            ))}
          </ul>
        </section>
      )}

      {history.length > 0 && (
        <section className="card history-card">
          <div className="history-head">
            <h2>{t.history}</h2>
            <button type="button" className="btn-ghost history-clear" onClick={onClearHistory}>
              {t.clearHistory}
            </button>
          </div>
          <ul className="history-list">
            {history.slice(0, 8).map((record) => (
              <RecordRow key={record.id} record={record} lang={settings.lang} score={t.score} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function RecordRow({
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
          {modeLabel(record.mode, lang)} · {regionLabel(record.region, lang)} ·{' '}
          {difficultyLabel(record.difficulty, lang)} · {record.roundSize} · {formatClock(record.roundMs)}
        </p>
      </div>
      <p className="history-when">{formatPlayedAt(record.at, lang)}</p>
    </li>
  )
}

function formatPlayedAt(at: number, lang: Lang): string {
  return new Date(at).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
