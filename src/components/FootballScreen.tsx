import { useEffect, useState } from 'react'
import { STRINGS, localeTag, mixLabel, modeLabel, type Lang } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import {
  FOOTBALL_MODES,
  fitRoundSize,
  footballMixPoolSize,
  footballPoolSize,
  formatClock,
  isPlayerFactsToName,
  isPlayerPhotoMode,
  modesForFootballMix,
} from '../lib/quiz'
import type { FactsDuelConfig } from '../lib/factsRules'
import { DuelCreateModal } from './DuelCreateModal'
import { GeoIcon } from './GeoIcon'
import { HubNav, WORLD_HUB_TABS, type HubTab } from './HubNav'
import { ModeSetupModal, type SetupFamily } from './ModeSetupModal'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'
import { FitText } from './FitText'
import { setupDifficultyText } from './DifficultyPicker'
import { footballPlayerPool } from '../data/footballPlayers'
import { prefetchWikiPortraits } from '../lib/wikiThumb'
import {
  FOOTBALL_PLAY_FAMILIES,
  difficultyForMode,
  footballFamilyLabel,
  footballFamilyOf,
  settingsForFootballFamily,
} from '../lib/modeFamilies'

interface FootballScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onCreateDuel: (modes: QuizSettings['mode'][], facts?: FactsDuelConfig) => void
  onMatchDuel: (modes: QuizSettings['mode'][], facts?: FactsDuelConfig) => void
  onJoinDuel: (code: string) => void
  duelError?: string | null
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
  onCreateDuel,
  onMatchDuel,
  onJoinDuel,
  duelError,
  onClearHistory,
}: FootballScreenProps) {
  const t = STRINGS[settings.lang]
  const mix = settings.mix
  const photoMode = !mix && isPlayerPhotoMode(settings.mode)
  const poolSize = mix
    ? footballMixPoolSize(mix, settings.difficulty, settings.mixModes)
    : footballPoolSize(settings.mode, settings.difficulty)
  const currentBest = findBest(bests, settings)
  const [joinCode, setJoinCode] = useState('')
  const [duelSetup, setDuelSetup] = useState<'create' | 'match' | null>(null)
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
        <h2>{t.mode}</h2>
        <div className="choice-grid is-modes">
          {FOOTBALL_PLAY_FAMILIES.map((id) => (
            <button
              key={id}
              type="button"
              className={`choice ${activeFamily === id ? 'is-active' : ''}`}
              aria-pressed={activeFamily === id}
              onClick={() => {
                applyFootballSettings({ ...settings, ...settingsForFootballFamily(settings, id) })
                setSetupFamily({ world: 'football', id })
              }}
            >
              <FitText minPx={9}>{footballFamilyLabel(id, settings.lang)}</FitText>
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
              applyFootballSettings({ ...settings, ...settingsForFootballFamily(settings, 'mix') })
              setSetupFamily({ world: 'football', id: 'mix' })
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
        {mix ? mixLabel(mix, settings.lang) : modeLabel(settings.mode, settings.lang)} ·{' '}
        {setupDifficultyText(settings.difficulty, settings.levelHardcore, settings.lang)}
        {isPlayerFactsToName(settings.mode) && !mix ? '' : ` · ${settings.roundSize}`}
      </p>

      {currentBest ? (
        <p className="current-best">
          {t.bestOfSetup(t.score(currentBest.correct, currentBest.total), formatClock(currentBest.roundMs))}
        </p>
      ) : null}

      <button type="button" className="btn-primary" disabled={poolSize === 0} onClick={onStart}>
        {t.start}
      </button>

      <section className="card settings-card">
        <h2>{t.multiplayer}</h2>
        <button type="button" className="btn-primary" onClick={() => setDuelSetup('match')}>
          {t.multiplayerPlay}
        </button>
      </section>

      <section className="card settings-card">
        <h2>{t.duel}</h2>
        <p className="setting-hint">{t.duelHint}</p>
        <button type="button" className="btn-secondary" onClick={() => setDuelSetup('create')}>
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
          onChange={(next) => applyFootballSettings(next)}
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
          region="all"
          modeCatalog={FOOTBALL_MODES}
          showMix={false}
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
