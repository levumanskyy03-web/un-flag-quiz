'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { LEVEL_COUNT } from '../data/levels'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { fetchAccount } from '../lib/account'
import {
  RATING_LEVELS_MAX,
  fetchRating,
  loadPlayer,
  submitRatings,
  type LeaderboardEntry,
  type RatingBoard,
} from '../lib/leaderboard'
import type { LevelClear } from '../lib/levelProgress'
import { LEVEL_MODES, type QuizMode } from '../lib/quiz'
import { formatXp } from '../lib/xp'
import { GeoIcon } from './GeoIcon'

interface RatingsModalProps {
  lang: Lang
  levelClears: LevelClear[]
  xp: number
  onClose: () => void
}

type Tab = 'xp' | 'levels'
type ModeFilter = 'all' | QuizMode

export function RatingsModal({ lang, levelClears, xp, onClose }: RatingsModalProps) {
  const t = STRINGS[lang]
  const titleId = useId()
  const [tab, setTab] = useState<Tab>('xp')
  const [mode, setMode] = useState<ModeFilter>('all')
  const [hardcore, setHardcore] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [posted, setPosted] = useState(false)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [boardReady, setBoardReady] = useState(true)

  const board = useMemo<RatingBoard>(() => {
    if (tab === 'xp') return { kind: 'xp' }
    if (mode === 'all') return { kind: 'clears', hardcore }
    return { kind: 'mode', mode, hardcore }
  }, [tab, mode, hardcore])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  useEffect(() => {
    let cancelled = false
    fetchAccount()
      .then(async (user) => {
        if (cancelled) return
        setSignedIn(Boolean(user))
        if (user) await submitRatings(levelClears, xp)
        if (!cancelled) setPosted(true)
      })
      .catch(() => {
        if (!cancelled) setPosted(true)
      })
    return () => {
      cancelled = true
    }
  }, [levelClears, xp])

  useEffect(() => {
    if (!posted) return
    let cancelled = false
    const player = loadPlayer()
    fetchRating(board, player.id)
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
  }, [board, posted])

  const total = mode === 'all' ? RATING_LEVELS_MAX : LEVEL_COUNT
  const hint =
    tab === 'xp' ? t.ratingsXpHint : hardcore ? t.ratingsHardcoreHint : t.ratingsLevelsHint

  return (
    <div className="passport-overlay" onClick={onClose}>
      <div
        className="passport-sheet account-sheet settings-sheet ratings-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="account-sheet-head">
          <h2 id={titleId}>
            <GeoIcon name="trophy" size={18} />
            {t.ratings}
          </h2>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t.close}
          </button>
        </header>

        <div className="choice-grid">
          <button
            type="button"
            className={`choice ratings-choice ${tab === 'xp' ? 'is-active' : ''}`}
            aria-pressed={tab === 'xp'}
            onClick={() => setTab('xp')}
          >
            <GeoIcon name="meridians" />
            {t.ratingsXp}
          </button>
          <button
            type="button"
            className={`choice ratings-choice ${tab === 'levels' ? 'is-active' : ''}`}
            aria-pressed={tab === 'levels'}
            onClick={() => setTab('levels')}
          >
            <GeoIcon name="map" />
            {t.ratingsLevels}
          </button>
        </div>

        {tab === 'levels' ? (
          <>
            <div className="choice-grid is-modes">
              <button
                type="button"
                className={`choice ratings-choice ${mode === 'all' ? 'is-active' : ''}`}
                aria-pressed={mode === 'all'}
                onClick={() => setMode('all')}
              >
                <GeoIcon name="globe" />
                {t.ratingsAll}
              </button>
              {LEVEL_MODES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`choice ${mode === item ? 'is-active' : ''}`}
                  aria-pressed={mode === item}
                  onClick={() => setMode(item)}
                >
                  {modeLabel(item, lang)}
                </button>
              ))}
            </div>
            <div className="choice-grid">
              <button
                type="button"
                className={`choice ratings-choice ${hardcore ? 'is-active' : ''}`}
                aria-pressed={hardcore}
                onClick={() => setHardcore((value) => !value)}
              >
                <GeoIcon name="pin" />
                {t.hardcore}
              </button>
            </div>
          </>
        ) : null}

        <p className="setting-hint ratings-hint">{hint}</p>
        {!signedIn ? <p className="setting-hint">{t.accountNeeded}</p> : null}

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
                  {tab === 'xp'
                    ? `${t.accountLevel(entry.level || 1)} · ${formatXp(entry.xp ?? 0, lang)}`
                    : t.leaderboardProgress(entry.levelsCleared, total)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
