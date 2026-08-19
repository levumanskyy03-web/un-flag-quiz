import { LEVEL_NUMBERS } from '../data/levels'
import { STRINGS, modeLabel } from '../i18n/strings'
import type { LevelClear } from '../lib/levelProgress'
import { findLevelClear } from '../lib/levelProgress'
import { MAX_LIVES, formatClock, type QuizMode } from '../lib/quiz'
import type { QuizSettings } from './HomeScreen'
import { Lives } from './Lives'

interface LevelsScreenProps {
  settings: QuizSettings
  levelClears: LevelClear[]
  onChange: (settings: QuizSettings) => void
  onPlay: (level: number) => void
  onBack: () => void
}

export function LevelsScreen({ settings, levelClears, onChange, onPlay, onBack }: LevelsScreenProps) {
  const t = STRINGS[settings.lang]

  return (
    <div className="screen levels-screen">
      <header className="quiz-header">
        <button type="button" className="btn-ghost" onClick={onBack}>
          {t.back}
        </button>
        <h1 className="levels-title">{t.levels}</h1>
        <span className="levels-header-spacer" aria-hidden="true" />
      </header>

      <section className="card settings-card">
        <div className="choice-grid">
          {(['flagToName', 'nameToFlag'] as QuizMode[]).map((mode) => (
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
            return (
              <button
                key={level}
                type="button"
                className={`choice level-choice${cleared?.hardcore ? ' is-gold' : cleared ? ' is-cleared' : ''}`}
                onClick={() => onPlay(level)}
              >
                <span className="level-number">{level}</span>
                {cleared && (
                  <span className="level-meta">
                    {!cleared.hardcore && (
                      <Lives
                        filled={cleared.livesLeft}
                        total={MAX_LIVES}
                        gold={cleared.livesLeft === MAX_LIVES}
                        size="sm"
                      />
                    )}
                    {formatClock(cleared.roundMs)}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className={`choice ${settings.levelHardcore ? 'is-active' : ''}`}
          aria-pressed={settings.levelHardcore}
          onClick={() => onChange({ ...settings, path: 'levels', levelHardcore: !settings.levelHardcore })}
        >
          {t.hardcore}
        </button>
        {settings.levelHardcore && <p className="setting-hint">{t.hardcoreHint}</p>}
      </section>
    </div>
  )
}
