import { useEffect, useState } from 'react'
import { STRINGS, mixLabel, modeLabel } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import {
  THEME_ITEMS,
  defaultThemeMode,
  fitRoundSize,
  formatClock,
  isThemeMode,
  themeMixPoolSize,
  themePoolSize,
  themeTopicOf,
  themeTopicsOf,
  type ThemeWorld,
} from '../lib/quiz'
import { GeoIcon } from './GeoIcon'
import { HubNav, THEME_HUB_TABS, type HubTab } from './HubNav'
import { ModeSetupModal, type SetupFamily } from './ModeSetupModal'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'
import { FitText } from './FitText'
import { setupDifficultyText } from './DifficultyPicker'
import { prefetchWikiPortraits } from '../lib/wikiThumb'
import { difficultyForMode, settingsForThemeFamily, themeFamilyLabel } from '../lib/modeFamilies'

interface ThemeScreenProps {
  world: ThemeWorld
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onClearHistory: () => void
}

const WORLD_ICON = {
  biology: 'leaf',
  olympics: 'torch',
  cs: 'code',
  food: 'bowl',
} as const

export function ThemeScreen({
  world,
  settings,
  history,
  bests,
  onChange,
  onStart,
  onHub,
  onWorlds,
  onClearHistory,
}: ThemeScreenProps) {
  const t = STRINGS[settings.lang]
  const mix = settings.mix
  const mode = defaultThemeMode(world, settings.mode)
  const poolSize = mix
    ? themeMixPoolSize(world, mix, settings.difficulty, settings.mixModes)
    : isThemeMode(mode)
      ? themePoolSize(mode, settings.difficulty)
      : 0
  const currentBest = findBest(bests, settings)
  const [setupFamily, setSetupFamily] = useState<SetupFamily | null>(null)
  const families = themeTopicsOf(world)
  const activeFamily = mix ? 'mix' : isThemeMode(mode) ? themeTopicOf(mode) : families[0]

  useEffect(() => {
    prefetchWikiPortraits(
      THEME_ITEMS.filter((item) => item.wikiFile && item.mode === 'csPhotoToName')
        .map((item) => ({ title: item.wiki ?? '', file: item.wikiFile }))
        .slice(0, 24),
    )
  }, [])

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    const nextMode = defaultThemeMode(world, next.mode)
    onChange({
      ...next,
      mode: nextMode,
      roundSize: fitRoundSize(
        next.roundSize,
        next.mix
          ? themeMixPoolSize(world, next.mix, next.difficulty, next.mixModes)
          : isThemeMode(nextMode)
            ? themePoolSize(nextMode, next.difficulty)
            : 0,
      ),
    })
  }

  function applyThemeSettings(next: QuizSettings) {
    update({
      ...next,
      path: 'pool',
      difficulty: difficultyForMode(next.mode, next.difficulty),
      levelHardcore: next.levelHardcore || next.difficulty === 'hardcore',
    })
  }

  const title =
    world === 'biology' ? t.biology : world === 'olympics' ? t.olympics : world === 'cs' ? t.cs : t.food
  const subtitle =
    world === 'biology'
      ? t.bioSubtitle
      : world === 'olympics'
        ? t.olySubtitle
        : world === 'cs'
          ? t.csSubtitle
          : t.foodSubtitle

  return (
    <div className="screen football-screen">
      <header className="home-header">
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1 className="football-title">
          <GeoIcon name={WORLD_ICON[world]} size={28} />
          {title}
        </h1>
        <p className="subtitle">{subtitle}</p>
      </header>

      <HubNav lang={settings.lang} active="free" tabs={THEME_HUB_TABS} onSelect={onHub} />

      <section className="card settings-card">
        <h2>{t.mode}</h2>
        <div className="choice-grid is-modes">
          {families.map((id) => (
            <button
              key={id}
              type="button"
              className={`choice ${!mix && activeFamily === id ? 'is-active' : ''}`}
              aria-pressed={!mix && activeFamily === id}
              onClick={() => {
                applyThemeSettings({ ...settings, ...settingsForThemeFamily(world, settings, id) })
                setSetupFamily({ world, id })
              }}
            >
              <FitText minPx={9}>{themeFamilyLabel(world, id, settings.lang)}</FitText>
            </button>
          ))}
        </div>
        <div className="mode-aside">
          <h2>{t.familyMix}</h2>
          <button
            type="button"
            className={`choice has-note is-wide ${mix ? 'is-active' : ''}`}
            aria-pressed={Boolean(mix)}
            onClick={() => {
              applyThemeSettings({ ...settings, ...settingsForThemeFamily(world, settings, 'mix') })
              setSetupFamily({ world, id: 'mix' })
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
          onChange={(next) => applyThemeSettings(next)}
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
