'use client'

import { useEffect, useState } from 'react'
import { LEVEL_COUNT, LEVEL_NUMBERS, isFinalLevel } from '../data/levels'
import { STRINGS, modeLabel } from '../i18n/strings'
import type { LevelClear } from '../lib/levelProgress'
import { findLevelClear, isLevelUnlocked } from '../lib/levelProgress'
import {
  NAME_MIN,
  fetchLeaderboard,
  loadPlayer,
  savePlayerName,
  submitCampaign,
  type LeaderboardEntry,
} from '../lib/leaderboard'
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
  const [playerName, setPlayerName] = useState('')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [boardReady, setBoardReady] = useState(true)

  useEffect(() => {
    setPlayerName(loadPlayer().name)
  }, [])

  function reloadBoard() {
    const player = loadPlayer()
    fetchLeaderboard(settings.mode, settings.levelHardcore, player.id)
      .then((result) => {
        setEntries(result.entries)
        setBoardReady(result.configured)
      })
      .catch(() => {
        setEntries([])
        setBoardReady(false)
      })
  }

  useEffect(() => {
    let cancelled = false
    const player = loadPlayer()
    fetchLeaderboard(settings.mode, settings.levelHardcore, player.id)
      .then((result) => {
        if (cancelled) return
        setEntries(result.entries)
        setBoardReady(result.configured)
      })
      .catch(() => {
        if (cancelled) return
        setEntries([])
        setBoardReady(false)
      })
    return () => {
      cancelled = true
    }
  }, [settings.mode, settings.levelHardcore])

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
        <label className="player-name">
          <span>{t.playerName}</span>
          <input
            type="text"
            maxLength={24}
            autoComplete="nickname"
            placeholder={t.playerNameHint}
            value={playerName}
            onChange={(event) => {
              const next = event.target.value
              setPlayerName(next)
              savePlayerName(next)
            }}
            onBlur={() => {
              const player = savePlayerName(playerName)
              if (player.name.length >= NAME_MIN) {
                void submitCampaign(levelClears, settings.mode).then(reloadBoard)
              }
            }}
          />
        </label>
        {playerName.trim().length > 0 && playerName.trim().length < NAME_MIN && (
          <p className="setting-hint">{t.playerNameShort}</p>
        )}

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

      <section className="card history-card">
        <h2>{t.leaderboard}</h2>
        {!boardReady ? (
          <p className="leaderboard-empty">{t.leaderboardOffline}</p>
        ) : entries.length === 0 ? (
          <p className="leaderboard-empty">{t.leaderboardEmpty}</p>
        ) : (
          <ol className="leaderboard-list">
            {entries.map((entry, index) => (
              <li key={`${entry.name}-${index}`} className={`leaderboard-row${entry.you ? ' is-you' : ''}`}>
                <span className="leaderboard-rank">{index + 1}</span>
                <span className="leaderboard-name">{entry.name}</span>
                <span className="leaderboard-score">
                  {t.leaderboardProgress(entry.levelsCleared, LEVEL_COUNT)} · {formatClock(entry.totalMs)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
