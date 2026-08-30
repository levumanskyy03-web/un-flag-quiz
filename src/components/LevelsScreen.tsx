'use client'

import { useEffect, useState } from 'react'
import { LEVEL_NUMBERS, isFinalLevel } from '../data/levels'
import { STRINGS, modeLabel } from '../i18n/strings'
import type { LevelClear } from '../lib/levelProgress'
import { findLevelClear, isLevelUnlocked } from '../lib/levelProgress'
import type { RoundRecord } from '../lib/history'
import { fetchLevelBests, type LevelBest } from '../lib/leaderboard'
import { MAX_LIVES, LEVEL_MODES, formatClock, hasGeoFinale, isLeadersMode, type QuizMode } from '../lib/quiz'
import type { QuizSettings } from './HomeScreen'
import { HubNav, type HubTab } from './HubNav'
import { LeadersSetup } from './LeadersScreen'
import { PlayerHud } from './PlayerHud'
import { Lives } from './Lives'
import { WorldsBack } from './WorldsBack'

interface LevelsScreenProps {
  settings: QuizSettings
  levelClears: LevelClear[]
  history: RoundRecord[]
  bests: RoundRecord[]
  xp?: number
  xpReady?: boolean
  modes?: readonly QuizMode[]
  levels?: readonly number[]
  tabs?: HubTab[]
  onChange: (settings: QuizSettings) => void
  onPlay: (level: number) => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
}

export function LevelsScreen({
  settings,
  levelClears,
  history,
  bests,
  xp = 0,
  xpReady = false,
  modes = LEVEL_MODES,
  levels = LEVEL_NUMBERS,
  tabs,
  onChange,
  onPlay,
  onHub,
  onWorlds,
}: LevelsScreenProps) {
  const t = STRINGS[settings.lang]
  const [worldBests, setWorldBests] = useState<Record<number, LevelBest>>({})
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    setPicked(null)
    let cancelled = false
    void fetchLevelBests(settings.mode, settings.levelHardcore).then((records) => {
      if (!cancelled) setWorldBests(records)
    })
    return () => {
      cancelled = true
    }
  }, [settings.mode, settings.levelHardcore])

  const pickedBest = picked !== null ? worldBests[picked] : undefined

  return (
    <div className="screen levels-screen">
      <WorldsBack lang={settings.lang} onClick={onWorlds} />
      <header className="quiz-header is-hub">
        <HubNav lang={settings.lang} active="levels" tabs={tabs} onSelect={onHub} />
      </header>

      <section className="card settings-card">
        <PlayerHud
          lang={settings.lang}
          history={history}
          bests={bests}
          levelClears={levelClears}
          xp={xp}
          xpReady={xpReady}
          onLangChange={(lang) => onChange({ ...settings, lang })}
        />

        {isLeadersMode(settings.mode) ? (
          <LeadersSetup
            settings={settings}
            onChange={(next) => onChange({ ...next, path: 'levels', mix: null })}
          />
        ) : (
          <div className="choice-grid is-modes">
            {modes.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`choice ${settings.mode === mode ? 'is-active' : ''}`}
                aria-pressed={settings.mode === mode}
                onClick={() => onChange({ ...settings, path: 'levels', mode })}
              >
                {modeLabel(mode, settings.lang)}
              </button>
            ))}
          </div>
        )}

        <div className="choice-grid is-levels">
          {levels.map((level) => {
            const cleared = findLevelClear(levelClears, level, settings.mode)
            const unlocked = isLevelUnlocked(levelClears, level, settings.mode)
            const canOpen = settings.levelLearn || unlocked
            const livesLimit = cleared ? cleared.livesLimit ?? (cleared.hardcore ? 1 : MAX_LIVES) : MAX_LIVES
            return (
              <button
                key={level}
                type="button"
                className={`choice level-choice${cleared?.hardcore ? ' is-gold' : cleared ? ' is-cleared' : ''}${
                  canOpen ? '' : ' is-locked'
                }${picked === level ? ' is-picked' : ''}`}
                onClick={() => {
                  if (picked === level && canOpen) {
                    onPlay(level)
                    return
                  }
                  setPicked(level)
                }}
              >
                <span className="level-number">{level}</span>
                {cleared ? (
                  <span className="level-meta">
                    {!cleared.hardcore && livesLimit <= MAX_LIVES && (
                      <Lives
                        filled={cleared.livesLeft}
                        total={livesLimit}
                        gold={cleared.livesLeft === livesLimit}
                        size="sm"
                      />
                    )}
                    {isFinalLevel(level) && livesLimit > MAX_LIVES ? `${cleared.livesLeft}/${livesLimit} · ` : ''}
                    {formatClock(cleared.roundMs)}
                  </span>
                ) : isFinalLevel(level) && hasGeoFinale(settings.mode) ? (
                  <span className="level-meta">193</span>
                ) : null}
              </button>
            )
          })}
        </div>

        <p className="levels-world-best" aria-live="polite">
          {pickedBest ? (
            <>
              <span className="levels-world-best-label">{t.worldRecord}</span>
              {t.worldRecordLine(pickedBest.name, formatClock(pickedBest.roundMs))}
            </>
          ) : null}
        </p>

        <div className="choice-grid">
          <button
            type="button"
            className={`choice ${settings.levelLearn ? 'is-active' : ''}`}
            aria-pressed={settings.levelLearn}
            onClick={() => onChange({ ...settings, path: 'levels', levelLearn: !settings.levelLearn })}
          >
            {t.learn}
          </button>
          <button
            type="button"
            className={`choice ${settings.levelHardcore ? 'is-active' : ''}`}
            aria-pressed={settings.levelHardcore}
            onClick={() => onChange({ ...settings, path: 'levels', levelHardcore: !settings.levelHardcore })}
          >
            {t.hardcore}
          </button>
        </div>
      </section>
    </div>
  )
}
