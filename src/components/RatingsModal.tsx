'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { fetchAccount } from '../lib/account'
import { unlockedAchievementIds } from '../lib/achievements'
import type { RoundRecord } from '../lib/history'
import {
  RATING_PERIODS,
  fetchRating,
  loadPlayer,
  submitRatings,
  type LeaderboardEntry,
  type RatingBoard,
  type RatingPeriod,
  type RatingWorld,
} from '../lib/leaderboard'
import type { LevelClear } from '../lib/levelProgress'
import {
  campaignLevelCount,
  campaignMaxForWorld,
  campaignModesForWorld,
  type QuizMode,
} from '../lib/quiz'
import { formatXp } from '../lib/xp'
import { GeoIcon } from './GeoIcon'
import { PlayerProfileModal } from './PlayerProfileModal'

interface RatingsModalProps {
  lang: Lang
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  xp: number
  onClose: () => void
}

type Tab = 'xp' | 'levels'
type ModeFilter = 'all' | QuizMode

const SCOPES: RatingWorld[] = ['all', 'geo', 'football', 'codes', 'leaders']

export function RatingsModal({ lang, history, bests, levelClears, xp, onClose }: RatingsModalProps) {
  const t = STRINGS[lang]
  const titleId = useId()
  const [scope, setScope] = useState<RatingWorld>('all')
  const [tab, setTab] = useState<Tab>('xp')
  const [period, setPeriod] = useState<RatingPeriod>('all')
  const [mode, setMode] = useState<ModeFilter>('all')
  const [hardcore, setHardcore] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [posted, setPosted] = useState(false)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [boardReady, setBoardReady] = useState(true)
  const [profileId, setProfileId] = useState<string | null>(null)

  const topic = scope === 'all' ? null : scope
  const hasCampaign = topic === 'geo' || topic === 'football' || topic === 'leaders'
  const campaignModes = topic ? campaignModesForWorld(topic) : []
  const showLevels = tab === 'levels' && hasCampaign

  const board = useMemo<RatingBoard>(() => {
    if (tab !== 'levels' || !hasCampaign) {
      return { kind: 'xp', world: scope, period }
    }
    if (mode === 'all') return { kind: 'clears', hardcore, world: topic ?? 'geo' }
    return { kind: 'mode', mode, hardcore }
  }, [tab, hasCampaign, scope, period, hardcore, mode, topic])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (profileId) {
        setProfileId(null)
        return
      }
      onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose, profileId])

  useEffect(() => {
    let cancelled = false
    fetchAccount()
      .then(async (user) => {
        if (cancelled) return
        setSignedIn(Boolean(user))
        if (user) {
          await submitRatings(
            levelClears,
            xp,
            unlockedAchievementIds(history, bests, levelClears, user.createdAt),
          )
        }
        if (!cancelled) setPosted(true)
      })
      .catch(() => {
        if (!cancelled) setPosted(true)
      })
    return () => {
      cancelled = true
    }
  }, [levelClears, xp, history, bests])

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

  const total =
    showLevels && mode !== 'all'
      ? campaignLevelCount(mode)
      : topic
        ? campaignMaxForWorld(topic)
        : 0
  const hint = showLevels
    ? hardcore
      ? t.ratingsHardcoreHint
      : t.ratingsLevelsHint
    : period !== 'all'
      ? t.ratingsXpHintPeriod
      : scope === 'all'
        ? t.ratingsXpHintWorld
        : t.ratingsXpHintTopic

  function pickScope(next: RatingWorld) {
    setScope(next)
    setMode('all')
    if (next === 'all' || next === 'codes') setTab('xp')
  }

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

        <div className="choice-grid is-modes ratings-worlds">
          {SCOPES.map((item) => (
            <button
              key={item}
              type="button"
              className={`choice ratings-choice ${scope === item ? 'is-active' : ''}`}
              aria-pressed={scope === item}
              onClick={() => pickScope(item)}
            >
              <GeoIcon
                name={
                  item === 'all'
                    ? 'trophy'
                    : item === 'geo'
                      ? 'globe'
                      : item === 'football'
                        ? 'ball'
                        : item === 'codes'
                          ? 'hash'
                          : 'crown'
                }
              />
              {scopeLabel(item, lang)}
            </button>
          ))}
        </div>

        {hasCampaign ? (
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
        ) : null}

        {tab === 'xp' || !hasCampaign ? (
          <div className="choice-grid is-4">
            {RATING_PERIODS.map((item) => (
              <button
                key={item}
                type="button"
                className={`choice ratings-choice ${period === item ? 'is-active' : ''}`}
                aria-pressed={period === item}
                onClick={() => setPeriod(item)}
              >
                {periodLabel(item, lang)}
              </button>
            ))}
          </div>
        ) : (
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
              {campaignModes.map((item) => (
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
        )}

        <p className="setting-hint ratings-hint">{hint}</p>
        {!signedIn ? <p className="setting-hint">{t.accountNeeded}</p> : null}

        {!boardReady ? (
          <p className="leaderboard-empty">{t.leaderboardOffline}</p>
        ) : entries.length === 0 ? (
          <p className="leaderboard-empty">
            {tab === 'xp' && period !== 'all' ? t.ratingsPeriodEmpty : t.leaderboardEmpty}
          </p>
        ) : (
          <ol className="leaderboard-list">
            {entries.map((entry, index) => {
              const openProfile = entry.id
                ? () => setProfileId(entry.id ?? null)
                : undefined
              return (
                <li key={entry.id ?? `${entry.name}-${index}`}>
                  <button
                    type="button"
                    className={`leaderboard-row${entry.you ? ' is-you' : ''}`}
                    onClick={openProfile}
                    disabled={!openProfile}
                    aria-label={openProfile ? `${t.playerProfile}: ${entry.name}` : entry.name}
                  >
                    <span className="leaderboard-rank">{index + 1}</span>
                    <span className="leaderboard-name">{entry.name}</span>
                    <span className="leaderboard-score">
                      {showLevels
                        ? t.leaderboardProgress(entry.levelsCleared, total)
                        : scope === 'all' && period === 'all'
                          ? `${t.accountLevel(entry.level || 1)} · ${formatXp(entry.xp ?? 0, lang)}`
                          : formatXp(entry.xp ?? 0, lang)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        )}
      </div>
      {profileId ? (
        <PlayerProfileModal
          lang={lang}
          playerId={profileId}
          previewName={entries.find((entry) => entry.id === profileId)?.name}
          previewXp={entries.find((entry) => entry.id === profileId)?.xp}
          previewLevel={entries.find((entry) => entry.id === profileId)?.level}
          onClose={() => setProfileId(null)}
        />
      ) : null}
    </div>
  )
}

function scopeLabel(scope: RatingWorld, lang: Lang): string {
  const t = STRINGS[lang]
  if (scope === 'all') return t.ratingsWorld
  if (scope === 'geo') return t.geography
  if (scope === 'football') return t.football
  if (scope === 'codes') return t.codes
  return t.leaders
}

function periodLabel(period: RatingPeriod, lang: Lang): string {
  const t = STRINGS[lang]
  if (period === 'day') return t.ratingsPeriodDay
  if (period === 'week') return t.ratingsPeriodWeek
  if (period === 'month') return t.ratingsPeriodMonth
  return t.ratingsPeriodAll
}
