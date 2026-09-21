import { useState } from 'react'
import { STRINGS, localeTag, mixLabel, modeLabel, regionLabel, type Lang } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import {
  fitRoundSize,
  formatClock,
  getPool,
  getRegionPool,
  isFactsToName,
  isFootballMode,
  isLeadersMode,
  isMathMode,
  isAstroMode,
  isThemeMode,
  type LearnFrom,
  type MixKind,
  type PlayPath,
  type QuizDifficulty,
  type QuizMode,
  type RegionFilter,
  type RoundSize,
} from '../lib/quiz'
import { modesCatalogNo, worldCatalogNo } from '../lib/modeCatalog'
import { HubNav, type HubTab } from './HubNav'
import { CatalogNo } from './ModeChoice'
import { ModeSetupModal, type SetupFamily } from './ModeSetupModal'
import { geoOpts } from './ExtrasToggle'
import { WorldsBack } from './WorldsBack'
import { FitGroup, FitText } from './FitText'
import { setupDifficultyText } from './DifficultyPicker'
import {
  GEO_PLAY_FAMILIES,
  geoFamilyLabel,
  geoFamilyOf,
  modesOfGeoFamily,
  settingsForGeoFamily,
} from '../lib/modeFamilies'

export interface QuizSettings {
  lang: Lang
  mode: QuizMode
  mix: MixKind | null
  mixModes: QuizMode[]
  region: RegionFilter
  difficulty: QuizDifficulty
  roundSize: RoundSize
  path: PlayPath
  level: number
  levelHardcore: boolean
  levelLives: number
  levelLearn: boolean
  learnFrom: LearnFrom
  includeExtras: boolean
  includeEraStates: boolean
  eraYear: number
}

interface HomeScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onClearHistory: () => void
}

export function HomeScreen({
  settings,
  history,
  bests,
  onChange,
  onStart,
  onHub,
  onWorlds,
  onClearHistory,
}: HomeScreenProps) {
  const t = STRINGS[settings.lang]
  const factsMode = !settings.mix && isFactsToName(settings.mode)
  const poolSize =
    settings.mix === 'custom' && settings.mixModes.length === 0
      ? 0
      : settings.mix
        ? getRegionPool(settings.region, geoOpts(settings)).length
        : getPool(settings.region, settings.difficulty, settings.mode, geoOpts(settings)).length
  const currentBest = findBest(bests, settings)
  const geoHistory = history.filter((item) => !isFootballMode(item.mode) && !isLeadersMode(item.mode) && !isMathMode(item.mode) && !isAstroMode(item.mode) && !isThemeMode(item.mode))
  const [setupFamily, setSetupFamily] = useState<SetupFamily | null>(null)
  const activeFamily = geoFamilyOf(settings.mode, settings.mix)

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    const nextPool =
      next.mix === 'custom' && next.mixModes.length === 0
        ? 0
        : next.mix
          ? getRegionPool(next.region, geoOpts(next)).length
          : getPool(next.region, next.difficulty, next.mode, geoOpts(next)).length
    onChange({ ...next, roundSize: fitRoundSize(next.roundSize, nextPool) })
  }

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </header>

      <HubNav lang={settings.lang} active="free" onSelect={onHub} />

      <section className="card settings-card">
        <h2>{t.mode}</h2>
        <div className="choice-grid is-modes">
          <FitGroup wrap minPx={8}>
            {GEO_PLAY_FAMILIES.map((id) => (
              <button
                key={id}
                type="button"
                className={`choice has-mode-no ${activeFamily === id ? 'is-active' : ''}`}
                aria-pressed={activeFamily === id}
                onClick={() => {
                  update(settingsForGeoFamily(settings, id))
                  setSetupFamily({ world: 'geo', id })
                }}
              >
                <CatalogNo n={modesCatalogNo(modesOfGeoFamily(id))} />
                <FitText>{geoFamilyLabel(id, settings.lang)}</FitText>
              </button>
            ))}
          </FitGroup>
        </div>
        <div className="mode-aside">
          <h2>{t.familyMix}</h2>
          <button
            type="button"
            className={`choice has-note has-mode-no is-wide ${activeFamily === 'mix' ? 'is-active' : ''}`}
            aria-pressed={activeFamily === 'mix'}
            onClick={() => {
              update(settingsForGeoFamily(settings, 'mix'))
              setSetupFamily({ world: 'geo', id: 'mix' })
            }}
          >
            <CatalogNo n={worldCatalogNo('geo')} />
            <FitText minPx={9}>{settings.mix ? mixLabel(settings.mix, settings.lang) : t.familyMix}</FitText>
            <FitText className="choice-note" wrap minPx={7}>
              {t.customMixNote}
            </FitText>
          </button>
        </div>
      </section>

      <p className="current-best home-setup-line">
        {settings.mix ? mixLabel(settings.mix, settings.lang) : modeLabel(settings.mode, settings.lang)} ·{' '}
        {regionLabel(settings.region, settings.lang)} · {setupDifficultyText(settings.difficulty, settings.levelHardcore, settings.lang)}
        {factsMode ? '' : ` · ${settings.roundSize}`}
      </p>

      {currentBest && (
        <p className="current-best">
          {t.bestOfSetup(t.score(currentBest.correct, currentBest.total), formatClock(currentBest.roundMs))}
        </p>
      )}

      <div className="home-launch">
        <button type="button" className="btn-primary" disabled={poolSize === 0} onClick={onStart}>
          {t.start}
        </button>
        <button
          type="button"
          className={`choice home-launch-rankings ${setupFamily?.id === 'rankings' ? 'is-active' : ''}`}
          aria-pressed={setupFamily?.id === 'rankings'}
          onClick={() => setSetupFamily({ world: 'geo', id: 'rankings' })}
        >
          <FitText minPx={9}>{t.rankings}</FitText>
        </button>
      </div>

      {setupFamily ? (
        <ModeSetupModal
          family={setupFamily}
          settings={settings}
          onChange={(next) => update(next)}
          onStart={() => {
            setSetupFamily(null)
            onStart()
          }}
          onClose={() => setSetupFamily(null)}
        />
      ) : null}

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
          {setupDifficultyText(record.difficulty, Boolean(record.hardcore), lang)} · {record.roundSize} · {formatClock(record.roundMs)}
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
