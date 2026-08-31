import { useState } from 'react'
import { STRINGS, difficultyLabel, localeTag, mixLabel, modeLabel, type Lang } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import {
  FACTS_DIFFICULTIES,
  FOOTBALL_MODES,
  LEADERS_DIFFICULTIES,
  PLAY_DIFFICULTIES,
  ROUND_SIZES,
  fitRoundSize,
  footballMixPoolSize,
  footballPoolSize,
  formatClock,
  isPlayerFactsToName,
  isPlayerPhotoMode,
  modesForFootballMix,
} from '../lib/quiz'
import type { FactsDuelConfig } from '../lib/factsRules'
import { AppChrome } from './AppChrome'
import { DuelCreateModal } from './DuelCreateModal'
import { FootballModeGrids } from './FootballModeGrids'
import { GeoIcon } from './GeoIcon'
import { HubNav, type HubTab } from './HubNav'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'
import { FitText, ChoiceLabel } from './FitText'

interface FootballScreenProps {
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
  onCreateDuel: (modes: QuizSettings['mode'][], facts?: FactsDuelConfig) => void
  onJoinDuel: (code: string) => void
  duelError?: string | null
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
  onHub,
  onWorlds,
  onCreateDuel,
  onJoinDuel,
  duelError,
  onClearHistory,
  onClearBests,
}: FootballScreenProps) {
  const t = STRINGS[settings.lang]
  const mix = settings.mix
  const factsMode = !mix && isPlayerFactsToName(settings.mode)
  const photoMode = !mix && isPlayerPhotoMode(settings.mode)
  const difficulties = factsMode ? FACTS_DIFFICULTIES : photoMode ? LEADERS_DIFFICULTIES : PLAY_DIFFICULTIES
  const poolSize = mix
    ? footballMixPoolSize(mix, settings.difficulty)
    : footballPoolSize(settings.mode, settings.difficulty)
  const currentBest = findBest(bests, settings)
  const [joinCode, setJoinCode] = useState('')
  const [duelSetupOpen, setDuelSetupOpen] = useState(false)

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    onChange({
      ...next,
      roundSize: fitRoundSize(
        next.roundSize,
        next.mix
          ? footballMixPoolSize(next.mix, next.difficulty)
          : footballPoolSize(next.mode, next.difficulty),
      ),
    })
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
          onClearBests={onClearBests}
        />
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1 className="football-title">
          <GeoIcon name="ball" size={34} />
          {t.football}
        </h1>
      </header>

      <HubNav lang={settings.lang} active="free" tabs={['free', 'levels', 'learn', 'mistakes']} onSelect={onHub} />

      <section className="card settings-card">
        <h2>{t.mode}</h2>
        <div className="choice-grid">
          <button
            type="button"
            className={`choice has-note is-wide ${mix === 'easy' ? 'is-active' : ''}`}
            aria-pressed={mix === 'easy'}
            onClick={() => update({ path: 'pool', mix: 'easy', mode: 'wcWinners' })}
          >
            <FitText minPx={9}>{t.easyMix}</FitText>
            <FitText className="choice-note" wrap minPx={7}>
              {t.footballEasyMixNote}
            </FitText>
          </button>
          <button
            type="button"
            className={`choice has-note is-wide ${mix === 'hard' ? 'is-active' : ''}`}
            aria-pressed={mix === 'hard'}
            onClick={() => update({ path: 'pool', mix: 'hard', mode: 'wcWinners' })}
          >
            <FitText minPx={9}>{t.hardMix}</FitText>
            <FitText className="choice-note" wrap minPx={7}>
              {t.footballHardMixNote}
            </FitText>
          </button>
        </div>
        <FootballModeGrids
          lang={settings.lang}
          activeMode={settings.mode}
          mix={Boolean(mix)}
          selectedModes={mix ? modesForFootballMix(mix) : undefined}
          onPick={(mode) =>
            update({
              path: 'pool',
              mix: null,
              mode,
              difficulty: isPlayerFactsToName(mode)
                ? settings.difficulty === 'hardcore'
                  ? 'hard'
                  : settings.difficulty
                : isPlayerPhotoMode(mode)
                  ? settings.difficulty
                  : PLAY_DIFFICULTIES.includes(settings.difficulty)
                    ? settings.difficulty
                    : 'easy',
            })
          }
        />

        <h2>{t.difficulty}</h2>
        <div className={`choice-grid ${difficulties.length === 4 ? 'is-4' : 'is-3'}`}>
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              className={`choice ${settings.difficulty === difficulty ? 'is-active' : ''}`}
              aria-pressed={settings.difficulty === difficulty}
              onClick={() => update({ path: 'pool', difficulty, levelHardcore: difficulty === 'hardcore' })}
            >
              <ChoiceLabel>{difficultyLabel(difficulty, settings.lang)}</ChoiceLabel>
            </button>
          ))}
        </div>

        {factsMode ? <p className="setting-hint">{t.playerFactsHint}</p> : null}

        {factsMode ? null : (
        <>
        <h2>{t.footballRoundSize}</h2>
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
        </>
        )}
      </section>

      {currentBest ? (
        <p className="current-best">
          {t.bestOfSetup(t.score(currentBest.correct, currentBest.total), formatClock(currentBest.roundMs))}
        </p>
      ) : null}

      <button type="button" className="btn-primary" onClick={onStart}>
        {t.start}
      </button>

      <section className="card settings-card">
        <h2>{t.duel}</h2>
        <button type="button" className="btn-secondary" onClick={() => setDuelSetupOpen(true)}>
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
          region="all"
          modeCatalog={FOOTBALL_MODES}
          showMix={false}
          onCancel={() => setDuelSetupOpen(false)}
          onConfirm={(modes, facts) => {
            setDuelSetupOpen(false)
            onCreateDuel(modes, facts)
          }}
        />
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
          {record.mix ? mixLabel(record.mix, lang) : modeLabel(record.mode, lang)}
          {` · ${difficultyLabel(record.difficulty, lang)}`} · {record.roundSize} ·{' '}
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
