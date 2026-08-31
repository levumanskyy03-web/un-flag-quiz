import { findCountry } from '../data/extras'
import { playerById, playerCountry } from '../data/footballPlayers'
import { STRINGS, footballQuestionPrompt, type Lang } from '../i18n/strings'
import {
  averageTimeMs,
  countryName,
  formatClock,
  formatSeconds,
  isCorrect,
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
  type QuizMode,
  type RoundAnswer,
  type RoundEnd,
} from '../lib/quiz'
import { formatXp, accountProgress } from '../lib/xp'
import { optionLabel } from '../lib/quizAnswers'
import { TeamFlag } from './Flag'
import { WorldsBack } from './WorldsBack'

interface ResultsScreenProps {
  lang: Lang
  mode: QuizMode
  hardcore: boolean
  answers: RoundAnswer[]
  roundMs: number
  endedBy: RoundEnd
  isNewBest: boolean
  earnedXp?: number
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
  hardcore,
  answers,
  roundMs,
  endedBy,
  isNewBest,
  earnedXp = 0,
  totalXp,
  saveNote = true,
  menuLabel,
  onAgain,
  onNextLevel,
  onMenu,
  onWorlds,
}: ResultsScreenProps) {
  const t = STRINGS[lang]
  const correctCount = answers.filter(isCorrect).length
  const total = answers.length
  const percent = total === 0 ? 0 : Math.round((correctCount / total) * 100)
  const mistakes = answers.filter((answer) => !isCorrect(answer))
  const success = endedBy === 'complete'
  const perfect = success && percent === 100
  const avgSeconds = formatSeconds(averageTimeMs(answers), lang)
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

  return (
    <div className={`screen results-screen ${success ? 'is-success' : 'is-fail'}`}>
      {onWorlds ? <WorldsBack lang={lang} onClick={onWorlds} /> : null}
      <section className={`card score-card ${success ? 'is-success' : 'is-fail'}`}>
        <p className="score-kicker">{t.results}</p>
        <p className="score-value">{t.score(correctCount, total)}</p>
        <p className="score-percent">{percent}%</p>
        <p className="score-time">{t.totalTime(formatClock(roundMs))}</p>
        {earnedXp > 0 ? (
          <p className="score-xp">
            {t.xpGained(formatXp(earnedXp, lang))}
            {totalXp !== undefined ? (
              <span>
                {' '}
                · {t.accountLevel(accountProgress(totalXp).level)} · {t.xpTotal(formatXp(totalXp, lang))}
              </span>
            ) : null}
          </p>
        ) : null}
        {success && <p className="score-avg">{t.avgTime(avgSeconds)}</p>}
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
        <button type="button" className="btn-secondary" onClick={onMenu}>
          {menuLabel ?? t.backToMenu}
        </button>
      </div>
    </div>
  )
}
