import { useEffect, useState } from 'react'
import { HelpTip } from './HelpTip'
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
  type ThemeWorld,
} from '../lib/quiz'
import { GeoIcon } from './GeoIcon'
import { HubNav, THEME_HUB_TABS, type HubTab } from './HubNav'
import { ModeArrowSelect } from './ModeArrowSelect'
import { ModeSetupModal, type SetupFamily } from './ModeSetupModal'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'
import { FitText } from './FitText'
import { CatalogNo } from './ModeChoice'
import { setupDifficultyText } from './DifficultyPicker'
import { prefetchWikiPortraits } from '../lib/wikiThumb'
import { difficultyForMode, settingsForThemeFamily, themeFamilyOf } from '../lib/modeFamilies'
import { themeModeLinks } from '../lib/modePairs'
import { worldCatalogNo } from '../lib/modeCatalog'

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

  useEffect(() => {
    prefetchWikiPortraits(
      THEME_ITEMS.filter((item) => item.wiki)
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
    world === 'biology'
      ? t.biology
      : world === 'olympics'
        ? t.olympics
        : world === 'cs'
          ? t.cs
          : t.food
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
          <HelpTip text={subtitle} />
        </h1>
      </header>

      <HubNav lang={settings.lang} active="free" tabs={THEME_HUB_TABS} onSelect={onHub} />

      <section className="card settings-card">
        <ModeArrowSelect
          links={themeModeLinks(world)}
          mode={mode}
          lang={settings.lang}
          level={settings.level}
          hardcore={settings.levelHardcore || settings.difficulty === 'hardcore'}
          startLabel={t.start}
          startDisabled={poolSize === 0}
          caption={mix ? mixLabel(mix, settings.lang) : undefined}
          onMode={(next) =>
            applyThemeSettings({
              ...settings,
              path: 'pool',
              mix: null,
              mode: next,
              difficulty: difficultyForMode(next, settings.difficulty),
            })
          }
          onHardcore={(on) => applyThemeSettings({ ...settings, levelHardcore: on })}
          onStart={onStart}
        />
        <div className="mode-aside">
          <h2>
            {t.familyMix}
            <HelpTip text={t.customMixNote} />
          </h2>
          <button
            type="button"
            className={`choice has-mode-no is-wide ${mix ? 'is-active' : ''}`}
            aria-pressed={Boolean(mix)}
            onClick={() => {
              applyThemeSettings({ ...settings, ...settingsForThemeFamily(world, settings, 'mix') })
              setSetupFamily({ world, id: 'mix' })
            }}
          >
            <CatalogNo n={worldCatalogNo(world)} />
            <FitText minPx={9}>{mix ? mixLabel(mix, settings.lang) : t.familyMix}</FitText>
          </button>
        </div>
      </section>

      <button
        type="button"
        className="current-best home-setup-line"
        onClick={() => setSetupFamily({ world, id: themeFamilyOf(world, mode, mix) ?? 'mix' })}
      >
        {mix ? mixLabel(mix, settings.lang) : modeLabel(mode, settings.lang)} ·{' '}
        {setupDifficultyText(settings.difficulty, settings.levelHardcore, settings.lang)} · {settings.roundSize}
      </button>

      {currentBest ? (
        <p className="current-best">
          {t.bestOfSetup(t.score(currentBest.correct, currentBest.total), formatClock(currentBest.roundMs))}
        </p>
      ) : null}

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
