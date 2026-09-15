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
  type LearnFrom,
  type MixKind,
  type PlayPath,
  type QuizDifficulty,
  type QuizMode,
  type RegionFilter,
  type RoundSize,
} from '../lib/quiz'
import type { FactsDuelConfig } from '../lib/factsRules'
import { HubNav, type HubTab } from './HubNav'
import { DuelCreateModal } from './DuelCreateModal'
import { ModeSetupModal, type SetupFamily } from './ModeSetupModal'
import { WorldsBack } from './WorldsBack'
import { FitText } from './FitText'
import { setupDifficultyText } from './DifficultyPicker'
import {
  GEO_PLAY_FAMILIES,
  geoFamilyLabel,
  geoFamilyOf,
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
}

interface HomeScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  duelError?: string | null
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onCreateDuel: (modes: QuizMode[], facts?: FactsDuelConfig) => void
  onMatchDuel: (modes: QuizMode[], facts?: FactsDuelConfig) => void
  onJoinDuel: (code: string) => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onClearHistory: () => void
}

export function HomeScreen({
  settings,
  history,
  bests,
  duelError,
  onChange,
  onStart,
  onCreateDuel,
  onMatchDuel,
  onJoinDuel,
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
        ? getRegionPool(settings.region, settings.includeExtras).length
        : getPool(settings.region, settings.difficulty, settings.mode, settings.includeExtras).length
  const currentBest = findBest(bests, settings)
  const geoHistory = history.filter((item) => !isFootballMode(item.mode) && !isLeadersMode(item.mode))
  const [joinCode, setJoinCode] = useState('')
  const [duelSetup, setDuelSetup] = useState<'create' | 'match' | null>(null)
  const [setupFamily, setSetupFamily] = useState<SetupFamily | null>(null)
  const activeFamily = geoFamilyOf(settings.mode, settings.mix)

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    const nextPool =
      next.mix === 'custom' && next.mixModes.length === 0
        ? 0
        : next.mix
          ? getRegionPool(next.region, next.includeExtras).length
          : getPool(next.region, next.difficulty, next.mode, next.includeExtras).length
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
          {GEO_PLAY_FAMILIES.map((id) => (
            <button
              key={id}
              type="button"
              className={`choice ${activeFamily === id ? 'is-active' : ''}`}
              aria-pressed={activeFamily === id}
              onClick={() => {
                update(settingsForGeoFamily(settings, id))
                setSetupFamily({ world: 'geo', id })
              }}
            >
              <FitText minPx={9}>{geoFamilyLabel(id, settings.lang)}</FitText>
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
              update(settingsForGeoFamily(settings, 'mix'))
              setSetupFamily({ world: 'geo', id: 'mix' })
            }}
          >
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

      <section className="card settings-card">
        <h2>{t.multiplayer}</h2>
        <button type="button" className="btn-primary" disabled={poolSize === 0} onClick={() => setDuelSetup('match')}>
          {t.multiplayerPlay}
        </button>
      </section>

      <section className="card settings-card">
        <h2>{t.duel}</h2>
        <p className="setting-hint">{t.duelHint}</p>
        <button type="button" className="btn-secondary" disabled={poolSize === 0} onClick={() => setDuelSetup('create')}>
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

      {duelSetup ? (
        <DuelCreateModal
          lang={settings.lang}
          initialMode={settings.mode}
          region={settings.region}
          intent={duelSetup}
          onCancel={() => setDuelSetup(null)}
          onConfirm={(modes, facts) => {
            const kind = duelSetup
            setDuelSetup(null)
            if (kind === 'match') onMatchDuel(modes, facts)
            else onCreateDuel(modes, facts)
          }}
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

export function ExtrasToggle({
  settings,
  onChange,
}: {
  settings: QuizSettings
  onChange: (includeExtras: boolean) => void
}) {
  const t = STRINGS[settings.lang]
  return (
    <>
      <div className="choice-wrap extras-toggle-row">
        <button
          type="button"
          className={`extras-toggle ${settings.includeExtras ? 'is-active' : ''}`}
          aria-pressed={settings.includeExtras}
          onClick={() => onChange(!settings.includeExtras)}
        >
          <span className="region-dot" aria-hidden />
          {t.includeExtras}
        </button>
      </div>
      <p className="setting-hint extras-hint">{t.includeExtrasHint}</p>
    </>
  )
}
