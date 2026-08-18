import { STRINGS, type Lang } from '../i18n/strings'
import {
  averageTimeMs,
  countryName,
  formatClock,
  formatSeconds,
  isCorrect,
  slowestAnswer,
  type QuizDifficulty,
  type QuizMode,
  type RoundAnswer,
  type RoundEnd,
} from '../lib/quiz'
import { Flag } from './Flag'

interface ResultsScreenProps {
  lang: Lang
  mode: QuizMode
  difficulty: QuizDifficulty
  answers: RoundAnswer[]
  roundMs: number
  endedBy: RoundEnd
  isNewBest: boolean
  onAgain: () => void
}

export function ResultsScreen({
  lang,
  mode,
  difficulty,
  answers,
  roundMs,
  endedBy,
  isNewBest,
  onAgain,
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
        ? difficulty === 'hardcore'
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
      <section className={`card score-card ${success ? 'is-success' : 'is-fail'}`}>
        <p className="score-kicker">{t.results}</p>
        <p className="score-value">{t.score(correctCount, total)}</p>
        <p className="score-percent">{percent}%</p>
        <p className="score-time">{t.totalTime(formatClock(roundMs))}</p>
        {success && <p className="score-avg">{t.avgTime(avgSeconds)}</p>}
        {slowest && (
          <p className="score-slowest">
            {t.slowestCountry(countryName(slowest.question.country, lang), formatSeconds(slowest.timeMs, lang))}
          </p>
        )}
        <p className="score-headline">{headline}</p>
        <p className="saved-note">{isNewBest ? t.newBest : t.savedOnDevice}</p>
      </section>

      {mistakes.length === 0 ? (
        <p className="no-mistakes">{t.noMistakes}</p>
      ) : (
        <section className="card mistakes-card">
          <h2>{t.mistakes}</h2>
          <ul className="mistakes-list">
            {mistakes.map((answer) => {
              const correct = answer.question.country
              const chosen =
                answer.selectedIso === null
                  ? null
                  : answer.question.options.find((option) => option.iso === answer.selectedIso) ??
                    correct
              return (
                <li key={`${correct.iso}-${answer.selectedIso ?? 'timeout'}`} className="mistake-row">
                  {mode === 'flagToName' && (
                    <Flag iso={correct.iso} name={countryName(correct, lang)} size="thumb" />
                  )}
                  <div className="mistake-copy">
                    <p>
                      <span className="mistake-label">{t.yourAnswer}</span>
                      {chosen ? countryName(chosen, lang) : t.timedOut}
                    </p>
                    <p>
                      <span className="mistake-label">{t.correctAnswer}</span>
                      {countryName(correct, lang)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <button type="button" className="btn-primary" onClick={onAgain}>
        {t.playAgain}
      </button>
    </div>
  )
}
