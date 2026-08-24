'use client'

import { LEVEL_NUMBERS, isFinalLevel } from '../data/levels'
import { STRINGS, modeLabel } from '../i18n/strings'
import type { LevelClear } from '../lib/levelProgress'
import { findLevelClear, isLevelUnlocked } from '../lib/levelProgress'
import type { RoundRecord } from '../lib/history'
import { MAX_LIVES, LEVEL_MODES, formatClock } from '../lib/quiz'
import type { QuizSettings } from './HomeScreen'
import { HubNav, type HubTab } from './HubNav'
import { PlayerHud } from './PlayerHud'
import { Lives } from './Lives'

interface LevelsScreenProps {
  settings: QuizSettings
  levelClears: LevelClear[]
  history: RoundRecord[]
  bests: RoundRecord[]
  xp?: number
  xpReady?: boolean
  onChange: (settings: QuizSettings) => void
  onPlay: (level: number) => void
  onHub: (tab: HubTab) => void
}

export function LevelsScreen({ settings, levelClears, history, bests, xp = 0, xpReady = false, onChange, onPlay, onHub }: LevelsScreenProps) {
  const t = STRINGS[settings.lang]

  return (
    <div className="screen levels-screen">
      <header className="quiz-header is-hub">
        <HubNav lang={settings.lang} active="levels" onSelect={onHub} />
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

        <div className="choice-grid is-modes">
          {LEVEL_MODES.map((mode) => (
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

        <div className="choice-grid is-levels">
          {LEVEL_NUMBERS.map((level) => {
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
                }`}
                disabled={!canOpen}
                onClick={() => {
                  if (!canOpen) return
                  onPlay(level)
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
                ) : isFinalLevel(level) ? (
                  <span className="level-meta">193</span>
                ) : null}
              </button>
            )
          })}
        </div>

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
        {settings.levelLearn ? (
          <p className="setting-hint">{t.learnLevelHint}</p>
        ) : settings.levelHardcore ? (
          <p className="setting-hint">{t.hardcoreHint}</p>
        ) : null}
      </section>
    </div>
  )
}
