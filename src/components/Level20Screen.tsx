'use client'

import { FINAL_LIVES, FINAL_LEVEL } from '../data/levels'
import { STRINGS } from '../i18n/strings'
import type { LevelClear } from '../lib/levelProgress'
import { findLevelClear } from '../lib/levelProgress'
import { MAX_LIVES, formatClock } from '../lib/quiz'
import type { QuizSettings } from './HomeScreen'
import { Lives } from './Lives'
import { WorldsBack } from './WorldsBack'

interface Level20ScreenProps {
  settings: QuizSettings
  levelClears: LevelClear[]
  onPlay: (lives: number) => void
  onBack: () => void
  onWorlds: () => void
}

export function Level20Screen({ settings, levelClears, onPlay, onBack, onWorlds }: Level20ScreenProps) {
  const t = STRINGS[settings.lang]

  return (
    <div className="screen levels-screen">
      <WorldsBack lang={settings.lang} onClick={onWorlds} />
      <header className="quiz-header">
        <button type="button" className="btn-ghost" onClick={onBack}>
          {t.back}
        </button>
        <h1 className="levels-title">{t.finalLevel}</h1>
        <span className="levels-header-spacer" aria-hidden="true" />
      </header>

      <p className="final-level-copy">{t.finalLevelHint}</p>

      <section className="card settings-card">
        <div className="final-lives-grid">
          {FINAL_LIVES.map((lives) => {
            const hardcore = lives === 1
            const cleared = findLevelClear(levelClears, FINAL_LEVEL, settings.mode, lives)
            return (
              <button
                key={lives}
                type="button"
                className={`choice level-choice final-lives-choice${
                  cleared?.hardcore ? ' is-gold' : cleared ? ' is-cleared' : ''
                }`}
                onClick={() => onPlay(lives)}
              >
                <span className="level-number">{hardcore ? t.hardcore : t.livesLeft(lives)}</span>
                {cleared && (
                  <span className="level-meta">
                    {!hardcore && lives <= MAX_LIVES && (
                      <Lives
                        filled={cleared.livesLeft}
                        total={lives}
                        gold={cleared.livesLeft === lives}
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
      </section>
    </div>
  )
}
