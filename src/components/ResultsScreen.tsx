'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { findCountry } from '../data/extras'
import { playerById, playerCountry } from '../data/footballPlayers'
import { STRINGS, footballQuestionPrompt, type Lang } from '../i18n/strings'
import {
  averageTimeMs,
  countryName,
  formatClock,
  formatSeconds,
  isCorrect,
  longestStreak,
  worldOfMode,
  isFactMode,
  isFactsToName,
  isFootballTeamChoice,
  isFootballYearChoice,
  isLeadersMode,
  isMapMode,
  isPlayerFactsToName,
  isWaterMapMode,
  isWaterMode,
  slowestAnswer,
  waterName,
  type MixKind,
  type QuizMode,
  type QuizWorld,
  type RoundAnswer,
  type RoundEnd,
} from '../lib/quiz'
import { formatXp, accountProgress } from '../lib/xp'
import { playShareUrl } from '../lib/playHash'
import { shareThemeLabel } from '../lib/shareTheme'
import { optionLabel } from '../lib/quizAnswers'
import { TeamFlag } from './Flag'
import { EmpireRewardLine } from './EmpireRewardLine'
import type { EmpireRoundReward } from '../lib/empire/rules'
import { ResultsShareShot } from './ResultsShareShot'
import { ShareButton } from './ShareButton'
import { WorldsBack } from './WorldsBack'

function useCountUp(target: number) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target <= 0) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    if (reduce) {
      frame = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(frame)
    }
    const start = performance.now()
    const duration = 700
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return value
}

function worldTitle(world: QuizWorld, t: { geography: string; football: string; leaders: string; math: string; astronomy: string; biology: string; olympics: string; cs: string; food: string }) {
  if (world === 'geo') return t.geography
  if (world === 'football') return t.football
  if (world === 'leaders') return t.leaders
  if (world === 'math') return t.math
  if (world === 'astronomy') return t.astronomy
  if (world === 'biology') return t.biology
  if (world === 'olympics') return t.olympics
  if (world === 'cs') return t.cs
  return t.food
}

interface ResultsScreenProps {
  lang: Lang
  mode: QuizMode
  mix?: MixKind | null
  mixModes?: QuizMode[]
  hardcore: boolean
  answers: RoundAnswer[]
  roundMs: number
  endedBy: RoundEnd
  isNewBest: boolean
  earnedXp?: number
  empireReward?: EmpireRoundReward | null
  totalXp?: number
  saveNote?: boolean
  menuLabel?: string
  onAgain: () => void
  onNextLevel?: () => void
  onMenu: () => void
  onWorlds?: () => void
}

export function ResultsScreen({
  lang,
  mode,
  mix = null,
  mixModes = [],
  hardcore,
  answers,
  roundMs,
  endedBy,
  isNewBest,
  earnedXp = 0,
  empireReward = null,
  totalXp,
  saveNote = true,
  menuLabel,
  onAgain,
  onNextLevel,
  onMenu,
  onWorlds,
}: ResultsScreenProps) {
  const t = STRINGS[lang]
  const theme = shareThemeLabel(lang, mode, mix, mixModes)
  const shareUrl = playShareUrl(mode, mix, mixModes)
  const correctCount = answers.filter(isCorrect).length
  const total = answers.length
  const percent = total === 0 ? 0 : Math.round((correctCount / total) * 100)
  const mistakes = answers.filter((answer) => !isCorrect(answer))
  const success = endedBy === 'complete'
  const perfect = success && percent === 100
  const avgSeconds = formatSeconds(averageTimeMs(answers), lang)
  const bestStreak = longestStreak(answers)
  const shownCorrect = useCountUp(correctCount)
  const slowest = perfect ? slowestAnswer(answers) : null
  const headline =
    endedBy === 'timeout'
      ? t.roundEndedTime
      : endedBy === 'lives'
        ? hardcore
          ? t.roundEndedHardcore
          : t.roundEndedLives
        : perfect
          ? t.perfect
          : percent >= 80
            ? t.great
            : percent >= 50
              ? t.good
              : t.keepGoing
  const rank =
    success && percent === 100 ? t.rankMaster : percent >= 80 ? t.rankExplorer : percent >= 50 ? t.rankLearner : t.rankRookie

  useEffect(() => {
    if (endedBy !== 'complete' || percent < 80) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    void confetti({
      particleCount: 110,
      spread: 72,
      origin: { y: 0.62 },
      colors: ['#34d399', '#818cf8', '#f5c542', '#fb7185'],
    })
    return () => {
      confetti.reset()
    }
  }, [endedBy, percent])

  return (
    <div className={`screen results-screen ${success ? 'is-success' : 'is-fail'}`}>
      <WorldsBack lang={lang} onClick={onMenu} label={t.back} />
      <div className="results-body">
        <ResultsShareShot
          lang={lang}
          url={shareUrl}
          theme={theme}
          score={t.score(correctCount, total)}
          percent={`${percent}%`}
          time={t.totalTime(formatClock(roundMs))}
          headline={headline}
          success={success}
        />
        <div className="results-main">
      <section className={`card score-card ${success ? 'is-success' : 'is-fail'}`}>
        <p className="score-kicker">{theme}</p>
        <p className="rank-badge">{worldTitle(worldOfMode(mode), t)} · {rank}</p>
        <p className="score-value">{t.score(shownCorrect, total)}</p>
        <p className="score-percent">{percent}%</p>
        <p className="score-time">{t.totalTime(formatClock(roundMs))}</p>
        {earnedXp > 0 ? (
          <p className="score-xp">
            {t.xpGained(formatXp(earnedXp, lang))}
            {totalXp !== undefined ? (
              <span>
                {' '}
                · {t.accountLevel(accountProgress(totalXp).level)} · {t.intellectRank(accountProgress(totalXp).level)} · {t.xpTotal(formatXp(totalXp, lang))}
              </span>
            ) : null}
          </p>
        ) : null}
        {empireReward ? <EmpireRewardLine lang={lang} reward={empireReward} world={worldOfMode(mode)} /> : null}
        <p className="score-avg">{t.avgTime(avgSeconds)}</p>
        <p className="score-streak">{t.longestStreak(bestStreak)}</p>
        {slowest && (
          <p className="score-slowest">
            {t.slowestCountry(countryName(slowest.question.country, lang), formatSeconds(slowest.timeMs, lang))}
          </p>
        )}
        <p className="score-headline">{headline}</p>
        {saveNote && <p className="saved-note">{isNewBest ? t.newBest : t.savedOnDevice}</p>}
      </section>

      {mistakes.length === 0 ? (
        <p className="no-mistakes">{t.noMistakes}</p>
      ) : (
        <section className="card mistakes-card">
          <h2>{t.mistakes}</h2>
          <ul className="mistakes-list">
            {mistakes.map((answer) => {
              const itemMode = answer.question.mode ?? mode
              const correct = answer.question.country
              const yearChoice = isFootballYearChoice(itemMode)
              const chosen =
                answer.selectedIso === null
                  ? null
                  : yearChoice || isWaterMapMode(itemMode)
                    ? isWaterMapMode(itemMode)
                      ? waterName(answer.selectedIso, lang)
                      : answer.selectedIso
                    : answer.question.options.find((option) => option.iso === answer.selectedIso) ??
                      findCountry(answer.selectedIso) ??
                      (playerById(answer.selectedIso) ? playerCountry(playerById(answer.selectedIso)!) : null) ??
                      null
              const prompt =
                isFootballYearChoice(itemMode)
                  ? footballQuestionPrompt(itemMode, answer.question.year ?? 0, countryName(correct, lang), lang)
                  : isFootballTeamChoice(itemMode) && answer.question.year
                    ? footballQuestionPrompt(itemMode, answer.question.year, countryName(correct, lang), lang)
                    : isLeadersMode(itemMode)
                            ? countryName(correct, lang)
                          : isFactMode(itemMode) || isFactsToName(itemMode)
                            ? countryName(correct, lang)
                            : isWaterMode(itemMode) && answer.question.waterId
                              ? waterName(answer.question.waterId, lang)
                              : null
              return (
                <li key={`${correct.iso}-${answer.question.year ?? ''}-${answer.selectedIso ?? 'timeout'}`} className="mistake-row">
                  {(itemMode === 'flagToName' ||
                    itemMode === 'neighborsToName' ||
                    isFootballTeamChoice(itemMode) ||
                    yearChoice ||
                    isMapMode(itemMode) ||
                    isFactMode(itemMode) ||
                    (isFactsToName(itemMode) && !isPlayerFactsToName(itemMode)) ||
                    (isWaterMode(itemMode) && !isWaterMapMode(itemMode))) && (
                    <TeamFlag iso={correct.iso} name={countryName(correct, lang)} size="thumb" />
                  )}
                  <div className="mistake-copy">
                    {prompt ? <p className="mistake-country">{prompt}</p> : null}
                    <p>
                      <span className="mistake-label">{t.yourAnswer}</span>
                      {typeof chosen === 'string'
                        ? chosen
                        : chosen
                          ? optionLabel(chosen, itemMode, lang, answer.question)
                          : t.timedOut}
                    </p>
                    <p>
                      <span className="mistake-label">{t.correctAnswer}</span>
                      {yearChoice
                        ? String(answer.question.year)
                          : isWaterMapMode(itemMode) && answer.question.waterId
                          ? waterName(answer.question.waterId, lang)
                          : optionLabel(correct, itemMode, lang, answer.question)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <div className="results-actions">
        {success && onNextLevel && (
          <button type="button" className="btn-primary" onClick={onNextLevel}>
            {t.nextLevel}
          </button>
        )}
        <button type="button" className={success && onNextLevel ? 'btn-secondary' : 'btn-primary'} onClick={onAgain}>
          {t.playAgain}
        </button>
        <ShareButton
          lang={lang}
          className="btn-secondary"
          url={shareUrl}
          text={t.shareResult(t.score(correctCount, total), theme, shareUrl)}
        />
        <button type="button" className="btn-secondary" onClick={onWorlds ?? onMenu}>
          {onWorlds ? t.worldsBack : (menuLabel ?? t.backToMenu)}
        </button>
      </div>
        </div>
      </div>
    </div>
  )
}
