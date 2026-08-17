import { STRINGS, type Lang } from '../i18n/strings'
import { countryName, formatClock, isCorrect, type QuizMode, type RoundAnswer } from '../lib/quiz'
import { Flag } from './Flag'

interface ResultsScreenProps {
  lang: Lang
  mode: QuizMode
  answers: RoundAnswer[]
  roundMs: number
  onAgain: () => void
}

export function ResultsScreen({ lang, mode, answers, roundMs, onAgain }: ResultsScreenProps) {
  const t = STRINGS[lang]
  const correctCount = answers.filter(isCorrect).length
  const total = answers.length
  const percent = total === 0 ? 0 : Math.round((correctCount / total) * 100)
  const mistakes = answers.filter((answer) => !isCorrect(answer))
  const headline =
    percent === 100 ? t.perfect : percent >= 80 ? t.great : percent >= 50 ? t.good : t.keepGoing

  return (
    <div className="screen results-screen">
      <section className="card score-card">
        <p className="score-kicker">{t.results}</p>
        <p className="score-value">{t.score(correctCount, total)}</p>
        <p className="score-percent">{percent}%</p>
        <p className="score-time">{t.totalTime(formatClock(roundMs))}</p>
        <p className="score-headline">{headline}</p>
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
