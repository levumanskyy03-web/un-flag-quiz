import { useState } from 'react'
import type { Region } from '../data/countries'
import { REGIONS, STRINGS, difficultyLabel, localeTag, mixLabel, modeLabel, regionLabel, type Lang } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import {
  QUIZ_MODES,
  PLAY_DIFFICULTIES,
  FACTS_DIFFICULTIES,
  ROUND_SIZES,
  fitRoundSize,
  formatClock,
  getPool,
  getRegionPool,
  isFactsToName,
  isFootballMode,
  isRegionSelected,
  toggleRegion,
  type LearnFrom,
  type MixKind,
  type PlayPath,
  type QuizDifficulty,
  type QuizMode,
  type RegionFilter,
  type RoundSize,
} from '../lib/quiz'
import type { FactsDuelConfig } from '../lib/factsRules'
import { AppChrome } from './AppChrome'
import { HubNav, type HubTab } from './HubNav'
import { DuelCreateModal } from './DuelCreateModal'

export interface QuizSettings {
  lang: Lang
  mode: QuizMode
  mix: MixKind | null
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
  levelClears: LevelClear[]
  xp?: number
  xpReady?: boolean
  duelError?: string | null
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onCreateDuel: (modes: QuizMode[], facts?: FactsDuelConfig) => void
  onJoinDuel: (code: string) => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onClearHistory: () => void
  onClearBests: () => void
}

export function HomeScreen({
  settings,
  history,
  bests,
  levelClears,
  xp = 0,
  xpReady = false,
  duelError,
  onChange,
  onStart,
  onCreateDuel,
  onJoinDuel,
  onHub,
  onWorlds,
  onClearHistory,
  onClearBests,
}: HomeScreenProps) {
  const t = STRINGS[settings.lang]
  const factsMode = !settings.mix && isFactsToName(settings.mode)
  const poolSize = settings.mix
    ? getRegionPool(settings.region).length
    : getPool(settings.region, settings.difficulty, settings.mode).length
  const regions: Array<Region | 'all'> = ['all', ...REGIONS]
  const difficulties = factsMode ? FACTS_DIFFICULTIES : PLAY_DIFFICULTIES
  const currentBest = findBest(bests, settings)
  const geoHistory = history.filter((item) => !isFootballMode(item.mode))
  const geoBests = bests.filter((item) => !isFootballMode(item.mode))
  const [joinCode, setJoinCode] = useState('')
  const [duelSetupOpen, setDuelSetupOpen] = useState(false)

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    const nextPool = next.mix
      ? getRegionPool(next.region).length
      : getPool(next.region, next.difficulty, next.mode).length
    onChange({ ...next, roundSize: fitRoundSize(next.roundSize, nextPool) })
  }

  return (
    <div className="screen home-screen">
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
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </header>

      <HubNav lang={settings.lang} active="free" onSelect={onHub} />

      <section className="card settings-card">
        <h2>{t.mode}</h2>
        <div className="choice-grid">
          <button
            type="button"
            className={`choice has-note is-wide ${settings.mix === 'easy' ? 'is-active' : ''}`}
            aria-pressed={settings.mix === 'easy'}
            onClick={() => update({ path: 'pool', mix: 'easy', mode: 'flagToName' })}
          >
            {t.easyMix}
            <span className="choice-note">{t.easyMixNote}</span>
          </button>
          <button
            type="button"
            className={`choice has-note is-wide ${settings.mix === 'hard' ? 'is-active' : ''}`}
            aria-pressed={settings.mix === 'hard'}
            onClick={() => update({ path: 'pool', mix: 'hard', mode: 'flagToName' })}
          >
            {t.hardMix}
            <span className="choice-note">{t.hardMixNote}</span>
          </button>
        </div>
        <div className="choice-grid is-modes">
          {QUIZ_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`choice ${!settings.mix && settings.mode === mode ? 'is-active' : ''}`}
              aria-pressed={!settings.mix && settings.mode === mode}
              onClick={() =>
                update({
                  path: 'pool',
                  mix: null,
                  mode,
                  difficulty: nextDifficultyForMode(mode, settings.difficulty),
                })
              }
            >
              {modeLabel(mode, settings.lang)}
            </button>
          ))}
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
        {settings.difficulty === 'hardcore' && !factsMode && <p className="setting-hint">{t.hardcoreHint}</p>}

        {!factsMode ? (
          <>
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
          </>
        ) : null}
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
          region={settings.region}
          onCancel={() => setDuelSetupOpen(false)}
          onConfirm={(modes, facts) => {
            setDuelSetupOpen(false)
            onCreateDuel(modes, facts)
          }}
        />
      ) : null}

      {geoBests.length > 0 && (
        <section className="card history-card">
          <div className="history-head">
            <h2>{t.bests}</h2>
            <button type="button" className="btn-ghost history-clear" onClick={onClearBests}>
              {t.clearBests}
            </button>
          </div>
          <ul className="history-list">
            {geoBests.map((record) => (
              <RecordRow key={record.id} record={record} lang={settings.lang} score={t.score} />
            ))}
          </ul>
        </section>
      )}

      {geoHistory.length > 0 && (
        <section className="card history-card">
          <div className="history-head">
            <h2>{t.history}</h2>
            <button type="button" className="btn-ghost history-clear" onClick={onClearHistory}>
              {t.clearHistory}
            </button>
          </div>
          <ul className="history-list">
            {geoHistory.slice(0, HISTORY_LIMIT).map((record) => (
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
          {record.mix ? mixLabel(record.mix, lang) : modeLabel(record.mode, lang)} · {regionLabel(record.region, lang)} ·{' '}
          {difficultyLabel(record.difficulty, lang)} · {record.roundSize} · {formatClock(record.roundMs)}
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

function nextDifficultyForMode(mode: QuizMode, difficulty: QuizDifficulty): QuizDifficulty {
  if (mode === 'factsToName') return difficulty === 'hardcore' ? 'hard' : difficulty
  return difficulty === 'medium' ? 'hard' : difficulty
}
