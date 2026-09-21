import { useEffect, useState } from 'react'
import { STRINGS, localeTag, modeLabel, type Lang } from '../i18n/strings'
import { HISTORY_LIMIT, findBest, type RoundRecord } from '../lib/history'
import {
  LEADERS_DIFFICULTIES,
  LEADERS_MODES,
  LEADERS_TOPICS,
  ROUND_SIZES,
  fitRoundSize,
  formatClock,
  isLeaderPhotoMode,
  leaderKindOf,
  leaderPoolSize,
  leaderPoolTerms,
  leadersAskOf,
  leadersAsksOf,
  leadersModeOf,
  type LeaderAsk,
  type LeadersMode,
  type QuizMode,
} from '../lib/quiz'
import { modeCatalogNo } from '../lib/modeCatalog'
import type { LeaderKind } from '../data/leaders'
import { GeoIcon } from './GeoIcon'
import { HubNav, WORLD_HUB_TABS, type HubTab } from './HubNav'
import { ModeChoice } from './ModeChoice'
import { DifficultyPicker, setupDifficultyText } from './DifficultyPicker'
import { ModeSetupModal, type SetupFamily } from './ModeSetupModal'
import { WorldsBack } from './WorldsBack'
import type { QuizSettings } from './HomeScreen'
import { prefetchWikiPortraits } from '../lib/wikiThumb'

interface LeadersScreenProps {
  settings: QuizSettings
  history: RoundRecord[]
  bests: RoundRecord[]
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onClearHistory: () => void
}

export function LeadersScreen({
  settings,
  history,
  bests,
  onChange,
  onStart,
  onHub,
  onWorlds,
  onClearHistory,
}: LeadersScreenProps) {
  const t = STRINGS[settings.lang]
  const currentBest = findBest(bests, settings)
  const mode = defaultLeadersMode(settings.mode)
  const poolSize = leaderPoolSize(mode, settings.difficulty)

  const [setupFamily, setSetupFamily] = useState<SetupFamily | null>(null)

  useEffect(() => {
    if (!isLeaderPhotoMode(mode)) return
    prefetchWikiPortraits(leaderPoolTerms(mode, settings.difficulty).map((term) => term.wiki).slice(0, 24))
  }, [mode, settings.difficulty])

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    const nextMode = defaultLeadersMode(next.mode)
    onChange({ ...next, mode: nextMode, roundSize: fitRoundSize(next.roundSize, leaderPoolSize(nextMode, next.difficulty)) })
  }

  return (
    <div className="screen leaders-screen">
      <header className="home-header">
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1 className="football-title">
          <GeoIcon name="laurel" size={28} />
          {t.leaders}
        </h1>
        <p className="subtitle">{t.leadersSubtitle}</p>
      </header>

      <HubNav lang={settings.lang} active="free" tabs={WORLD_HUB_TABS} onSelect={onHub} />

      <section className="card settings-card">
        <h2>{t.leaderTopic}</h2>
        <div className="choice-grid is-4">
          {LEADERS_TOPICS.map((kind) => {
            const label =
              kind === 'pope'
                ? t.popesLeaders
                : kind === 'rus'
                  ? t.askoldToUnion
                  : kind === 'uk'
                    ? t.ukMonarchs
                    : t.usPresidents
            return (
              <ModeChoice
                key={kind}
                label={label}
                no={modeCatalogNo(leadersModeOf(kind, leadersAskOf(mode)))}
                active={leaderKindOf(mode) === kind}
                onClick={() => {
                  const ask = leadersAskOf(mode)
                  const nextMode = leadersModeOf(kind, ask)
                  update({ path: 'pool', mix: null, mode: nextMode })
                  setSetupFamily({ world: 'leaders', id: kind })
                }}
              />
            )
          })}
        </div>
      </section>

      <p className="current-best home-setup-line">
        {modeLabel(mode, settings.lang)} · {setupDifficultyText(settings.difficulty, settings.levelHardcore, settings.lang)} · {settings.roundSize}
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
          onChange={(next) => update(next)}
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
              <LeadersRecordRow key={record.id} record={record} lang={settings.lang} score={t.score} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export function LeadersSetup({
  settings,
  onChange,
  showDifficulty = false,
  campaignPercent,
}: {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  showDifficulty?: boolean
  campaignPercent?: (mode: QuizMode) => number | null
}) {
  const t = STRINGS[settings.lang]
  const mode = defaultLeadersMode(settings.mode)
  const topic = leaderKindOf(mode) ?? 'us'
  const ask = leadersAskOf(mode)

  function setTopic(kind: LeaderKind) {
    onChange({ ...settings, mix: null, mode: leadersModeOf(kind, ask) })
  }

  function setAsk(next: LeaderAsk) {
    onChange({ ...settings, mix: null, mode: leadersModeOf(topic, next) })
  }

  return (
    <>
      <h2>{t.leaderTopic}</h2>
      <div className="choice-grid is-4">
        {LEADERS_TOPICS.map((kind) => {
          const topicMode = leadersModeOf(kind, ask)
          const label =
            kind === 'pope'
              ? t.popesLeaders
              : kind === 'rus'
                ? t.askoldToUnion
                : kind === 'uk'
                  ? t.ukMonarchs
                  : t.usPresidents
          return (
            <ModeChoice
              key={kind}
              label={label}
              no={modeCatalogNo(topicMode)}
              active={topic === kind}
              onClick={() => setTopic(kind)}
              percent={campaignPercent?.(topicMode)}
            />
          )
        })}
      </div>

      <h2>{t.leaderAsk}</h2>
      <div className={`choice-grid${leadersAsksOf(topic).length === 3 ? ' is-3' : ''}`}>
        {leadersAsksOf(topic).map((item) => {
          const askMode = leadersModeOf(topic, item)
          const label = item === 'photo' ? t.leaderAskPhoto : item === 'number' ? t.leaderAskNumber : t.leaderAskYears
          return (
            <ModeChoice
              key={item}
              label={label}
              mode={askMode}
              active={ask === item}
              onClick={() => setAsk(item)}
              percent={campaignPercent?.(askMode)}
            />
          )
        })}
      </div>

      {showDifficulty ? (
        <DifficultyPicker
          lang={settings.lang}
          difficulties={LEADERS_DIFFICULTIES}
          difficulty={settings.difficulty}
          hardcore={settings.levelHardcore}
          onChange={({ difficulty, hardcore }) => onChange({ ...settings, path: 'pool', difficulty, levelHardcore: hardcore })}
        />
      ) : null}
    </>
  )
}

function LeadersRecordRow({
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
          {modeLabel(record.mode, lang)} · {setupDifficultyText(record.difficulty, Boolean(record.hardcore), lang)} · {record.roundSize} ·{' '}
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

export function defaultLeadersMode(mode: string): LeadersMode {
  if (mode === 'askoldToUnion' || mode === 'rusNumberToName') return 'rusYearsToName'
  if (mode === 'usNameToYears') return 'usYearsToName'
  if (mode === 'popeNameToYears') return 'popeYearsToName'
  return LEADERS_MODES.includes(mode as LeadersMode) ? (mode as LeadersMode) : 'usYearsToName'
}
