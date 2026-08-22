import { useState } from 'react'
import type { Region } from '../data/countries'
import { REGIONS, STRINGS, difficultyLabel, modeLabel, regionLabel, type Lang } from '../i18n/strings'
import { findBest, type RoundRecord } from '../lib/history'
import {
  QUIZ_MODES,
  PLAY_DIFFICULTIES,
  ROUND_SIZES,
  fitRoundSize,
  formatClock,
  getPool,
  hasLevels,
  isRegionSelected,
  toggleRegion,
  type LearnFrom,
  type PlayPath,
  type QuizDifficulty,
  type QuizMode,
  type RegionFilter,
  type RoundSize,
} from '../lib/quiz'
import { AccountButton } from './AccountButton'
import { DuelCreateModal } from './DuelCreateModal'
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
  duelError?: string | null
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onCreateDuel: (modes: QuizMode[]) => void
  onJoinDuel: (code: string) => void
  onOpenLevels: () => void
  onOpenLearn: () => void
  onOpenMap: () => void
  onClearHistory: () => void
  onClearBests: () => void
}

export function HomeScreen({
  settings,
  history,
  bests,
  duelError,
  onChange,
  onStart,
  onCreateDuel,
  onJoinDuel,
  onOpenLevels,
  onOpenLearn,
  onOpenMap,
  onClearHistory,
  onClearBests,
}: HomeScreenProps) {
  const t = STRINGS[settings.lang]
  const poolSize = getPool(settings.region, settings.difficulty, settings.mode).length
  const regions: Array<Region | 'all'> = ['all', ...REGIONS]
  const difficulties = PLAY_DIFFICULTIES
  const currentBest = findBest(bests, settings)
  const [joinCode, setJoinCode] = useState('')
  const [duelSetupOpen, setDuelSetupOpen] = useState(false)

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    const nextPool = getPool(next.region, next.difficulty, next.mode).length
    onChange({ ...next, roundSize: fitRoundSize(next.roundSize, nextPool) })
  }

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <div className="home-top">
          <AccountButton lang={settings.lang} />
          <LanguageToggle
            lang={settings.lang}
            onChange={(lang) => onChange({ ...settings, lang })}
          />
        </div>
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </header>

      <section className="card settings-card">
        <h2>{t.mode}</h2>
        <div className="choice-grid is-modes">
          {QUIZ_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`choice ${settings.mode === mode ? 'is-active' : ''}`}
              aria-pressed={settings.mode === mode}
              onClick={() => update({ path: 'pool', mode })}
            >
              {modeLabel(mode, settings.lang)}
            </button>
          ))}
        </div>
        <h2>{t.explore}</h2>
        <div className="choice-grid is-paths">
          {hasLevels(settings.mode) ? (
            <button type="button" className="choice" onClick={onOpenLevels}>
              {t.levels}
            </button>
          ) : null}
          <button type="button" className="choice" onClick={onOpenLearn}>
            {t.learn}
          </button>
          <button type="button" className="choice" onClick={onOpenMap}>
            {t.map}
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
              onClick={() => update({ path: 'pool', region: toggleRegion(settings.region, region) })}
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
              onClick={() =>
                update({
                  path: 'pool',
                  difficulty,
                  levelHardcore: difficulty === 'hardcore',
                })
              }
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

      <section className="card settings-card">
        <h2>{t.duel}</h2>
        <p className="setting-hint">{t.duelHint}</p>
        <button type="button" className="btn-secondary" disabled={poolSize === 0} onClick={() => setDuelSetupOpen(true)}>
          {t.duelCreate}
        </button>
        <form
          className="duel-join"
          onSubmit={(event) => {
            event.preventDefault()
            onJoinDuel(joinCode)
          }}
        >
          <input
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            placeholder={t.duelCode}
            autoComplete="off"
            maxLength={4}
            spellCheck={false}
            aria-label={t.duelCode}
          />
          <button type="submit" className="choice" disabled={joinCode.trim().length !== 4}>
            {t.duelJoin}
          </button>
        </form>
        {duelError ? <p className="account-error">{duelError}</p> : null}
      </section>

      {duelSetupOpen ? (
        <DuelCreateModal
          lang={settings.lang}
          initialMode={settings.mode}
          onCancel={() => setDuelSetupOpen(false)}
          onConfirm={(modes) => {
            setDuelSetupOpen(false)
            onCreateDuel(modes)
          }}
        />
      ) : null}

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
