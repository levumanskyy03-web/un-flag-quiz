import { useEffect, useState } from 'react'
import { STRINGS, mixLabel, modeLabel } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import {
  fitRoundSize,
  formatClock,
  isMathMode,
  mathMixPoolSize,
  mathPoolSize,
} from '../lib/quiz'
import { GeoIcon } from './GeoIcon'
import { HubNav, MATH_HUB_TABS, type HubTab } from './HubNav'
import { ModeSetupModal, type SetupFamily } from './ModeSetupModal'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'
import { FitText } from './FitText'
import { setupDifficultyText } from './DifficultyPicker'
import { prefetchWikiPortraits } from '../lib/wikiThumb'
import { MATH_PEOPLE } from '../data/math'
import {
  MATH_PLAY_FAMILIES,
  difficultyForMode,
  mathFamilyLabel,
  mathFamilyOf,
  settingsForMathFamily,
} from '../lib/modeFamilies'

interface MathScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onClearHistory: () => void
}

export function defaultMathMode(mode: QuizSettings['mode']): QuizSettings['mode'] {
  return isMathMode(mode) ? mode : 'exprToValue'
}

export function MathScreen({
  settings,
  history,
  bests,
  onChange,
  onStart,
  onHub,
  onWorlds,
  onClearHistory,
}: MathScreenProps) {
  const t = STRINGS[settings.lang]
  const mix = settings.mix
  const mode = defaultMathMode(settings.mode)
  const poolSize = mix
    ? mathMixPoolSize(mix, settings.difficulty, settings.mixModes)
    : isMathMode(mode)
      ? mathPoolSize(mode, settings.difficulty)
      : 0
  const currentBest = findBest(bests, settings)
  const [setupFamily, setSetupFamily] = useState<SetupFamily | null>(null)
  const activeFamily = mathFamilyOf(mode, mix)

  useEffect(() => {
    prefetchWikiPortraits(
      MATH_PEOPLE.filter((person) => person.wikiFile)
        .map((person) => ({ title: person.wiki, file: person.wikiFile }))
        .slice(0, 24),
    )
  }, [])

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    const nextMode = defaultMathMode(next.mode)
    onChange({
      ...next,
      mode: nextMode,
      roundSize: fitRoundSize(
        next.roundSize,
        next.mix
          ? mathMixPoolSize(next.mix, next.difficulty, next.mixModes)
          : isMathMode(nextMode)
            ? mathPoolSize(nextMode, next.difficulty)
            : 0,
      ),
    })
  }

  function applyMathSettings(next: QuizSettings) {
    update({
      ...next,
      path: 'pool',
      difficulty: difficultyForMode(next.mode, next.difficulty),
      levelHardcore: next.levelHardcore || next.difficulty === 'hardcore',
    })
  }

  return (
    <div className="screen football-screen">
      <header className="home-header">
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1 className="football-title">
          <GeoIcon name="sigma" size={28} />
          {t.math}
        </h1>
        <p className="subtitle">{t.mathSubtitle}</p>
      </header>

      <HubNav lang={settings.lang} active="free" tabs={MATH_HUB_TABS} onSelect={onHub} />

      <section className="card settings-card">
        <h2>{t.mode}</h2>
        <div className="choice-grid is-modes">
          {MATH_PLAY_FAMILIES.map((id) => (
            <button
              key={id}
              type="button"
              className={`choice ${activeFamily === id ? 'is-active' : ''}`}
              aria-pressed={activeFamily === id}
              onClick={() => {
                applyMathSettings({ ...settings, ...settingsForMathFamily(settings, id) })
                setSetupFamily({ world: 'math', id })
              }}
            >
              <FitText minPx={9}>{mathFamilyLabel(id, settings.lang)}</FitText>
            </button>
          ))}
        </div>
        <div className="mode-aside">
          <h2>{t.familyMix}</h2>
          <button
            type="button"
            className={`choice has-note is-wide ${activeFamily === 'mix' ? 'is-active' : ''}`}
            aria-pressed={activeFamily === 'mix'}
            onClick={() => {
              applyMathSettings({ ...settings, ...settingsForMathFamily(settings, 'mix') })
              setSetupFamily({ world: 'math', id: 'mix' })
            }}
          >
            <FitText minPx={9}>{mix ? mixLabel(mix, settings.lang) : t.familyMix}</FitText>
            <FitText className="choice-note" wrap minPx={7}>
              {t.customMixNote}
            </FitText>
          </button>
        </div>
      </section>

      <p className="current-best home-setup-line">
        {mix ? mixLabel(mix, settings.lang) : modeLabel(mode, settings.lang)} ·{' '}
        {setupDifficultyText(settings.difficulty, settings.levelHardcore, settings.lang)} · {settings.roundSize}
      </p>

      {currentBest ? (
        <p className="current-best">
          {t.bestOfSetup(t.score(currentBest.correct, currentBest.total), formatClock(currentBest.roundMs))}
        </p>
      ) : null}

      <button type="button" className="btn-primary" disabled={poolSize === 0} onClick={onStart}>
        {t.start}
      </button>

      {setupFamily ? (
        <ModeSetupModal
          family={setupFamily}
          settings={{ ...settings, mode }}
          onChange={(next) => applyMathSettings(next)}
          onStart={() => {
            setSetupFamily(null)
            onStart()
          }}
          onClose={() => setSetupFamily(null)}
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
              <li key={record.id}>
                {modeLabel(record.mode, settings.lang)} · {t.score(record.correct, record.total)} · {formatClock(record.roundMs)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
