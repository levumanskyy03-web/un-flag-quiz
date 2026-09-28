import { useEffect, useState } from 'react'
import { HelpTip } from './HelpTip'
import { STRINGS, localeTag, mixLabel, modeLabel, type Lang } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import {
  fitRoundSize,
  footballMixPoolSize,
  footballPoolSize,
  formatClock,
  isPlayerFactsToName,
  isPlayerPhotoMode,
  modesForFootballMix,
} from '../lib/quiz'
import { GeoIcon } from './GeoIcon'
import { HubNav, WORLD_HUB_TABS, type HubTab } from './HubNav'
import { ModeArrowSelect } from './ModeArrowSelect'
import { ModeSetupModal, type SetupFamily } from './ModeSetupModal'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'
import { worldCatalogNo } from '../lib/modeCatalog'
import { FitText } from './FitText'
import { CatalogNo } from './ModeChoice'
import { setupDifficultyText } from './DifficultyPicker'
import { footballPlayerPool } from '../data/footballPlayers'
import { prefetchWikiPortraits } from '../lib/wikiThumb'
import {
  difficultyForMode,
  footballFamilyLabel,
  footballFamilyOf,
  settingsForFootballFamily,
  type FootballFamilyId,
} from '../lib/modeFamilies'
import { footballModeLinks } from '../lib/modePairs'

interface FootballScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onClearHistory: () => void
}

export function FootballScreen({
  settings,
  history,
  bests,
  onChange,
  onStart,
  onHub,
  onWorlds,
  onClearHistory,
}: FootballScreenProps) {
  const t = STRINGS[settings.lang]
  const mix = settings.mix
  const photoMode = !mix && isPlayerPhotoMode(settings.mode)
  const poolSize = mix
    ? footballMixPoolSize(mix, settings.difficulty, settings.mixModes)
    : footballPoolSize(settings.mode, settings.difficulty)
  const currentBest = findBest(bests, settings)
  const [setupFamily, setSetupFamily] = useState<SetupFamily | null>(null)
  const activeFamily = footballFamilyOf(settings.mode, settings.mix)

  useEffect(() => {
    const photo =
      photoMode ||
      (mix ? modesForFootballMix(mix, settings.mixModes).some((mode) => isPlayerPhotoMode(mode) || isPlayerFactsToName(mode)) : false)
    if (!photo) return
    prefetchWikiPortraits(
      footballPlayerPool(settings.difficulty)
        .map((player) => ({ title: player.wiki, file: player.wikiFile }))
        .slice(0, 24),
    )
  }, [mix, photoMode, settings.difficulty, settings.mixModes])

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    onChange({
      ...next,
      roundSize: fitRoundSize(
        next.roundSize,
        next.mix
          ? footballMixPoolSize(next.mix, next.difficulty, next.mixModes)
          : footballPoolSize(next.mode, next.difficulty),
      ),
    })
  }

  function applyFootballSettings(next: QuizSettings) {
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
          <GeoIcon name="ball" size={34} />
          {t.football}
        </h1>
      </header>

      <HubNav lang={settings.lang} active="free" tabs={WORLD_HUB_TABS} onSelect={onHub} />

      <section className="card settings-card">
        <ModeArrowSelect
          links={footballModeLinks()}
          mode={settings.mode}
          lang={settings.lang}
          level={settings.level}
          hardcore={settings.levelHardcore || settings.difficulty === 'hardcore'}
          startLabel={t.start}
          startDisabled={poolSize === 0}
          caption={mix ? mixLabel(mix, settings.lang) : undefined}
          familyLabel={(id) => footballFamilyLabel(id as FootballFamilyId, settings.lang)}
          onMode={(mode) =>
            applyFootballSettings({
              ...settings,
              path: 'pool',
              mix: null,
              mode,
              difficulty: difficultyForMode(mode, settings.difficulty),
            })
          }
          onHardcore={(on) => applyFootballSettings({ ...settings, levelHardcore: on })}
          onStart={onStart}
        />
        <div className="mode-aside">
          <h2>
            {t.familyMix}
            <HelpTip text={t.customMixNote} />
          </h2>
          <button
            type="button"
            className={`choice has-mode-no is-wide ${activeFamily === 'mix' ? 'is-active' : ''}`}
            aria-pressed={activeFamily === 'mix'}
            onClick={() => {
              applyFootballSettings({ ...settings, ...settingsForFootballFamily(settings, 'mix') })
              setSetupFamily({ world: 'football', id: 'mix' })
            }}
          >
            <CatalogNo n={worldCatalogNo('football')} />
            <FitText minPx={9}>{mix ? mixLabel(mix, settings.lang) : t.familyMix}</FitText>
          </button>
        </div>
      </section>

      <button
        type="button"
        className="current-best home-setup-line"
        onClick={() =>
          setSetupFamily({ world: 'football', id: footballFamilyOf(settings.mode, settings.mix) ?? 'players' })
        }
      >
        {mix ? mixLabel(mix, settings.lang) : modeLabel(settings.mode, settings.lang)} ·{' '}
        {setupDifficultyText(settings.difficulty, settings.levelHardcore, settings.lang)}
        {isPlayerFactsToName(settings.mode) && !mix ? '' : ` · ${settings.roundSize}`}
      </button>

      {currentBest ? (
        <p className="current-best">
          {t.bestOfSetup(t.score(currentBest.correct, currentBest.total), formatClock(currentBest.roundMs))}
        </p>
      ) : null}

      {setupFamily ? (
        <ModeSetupModal
          family={setupFamily}
          settings={settings}
          onChange={(next) => applyFootballSettings(next)}
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
          {` · ${setupDifficultyText(record.difficulty, Boolean(record.hardcore), lang)}`} · {record.roundSize} ·{' '}
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
