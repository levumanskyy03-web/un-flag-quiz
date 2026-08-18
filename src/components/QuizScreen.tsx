import { STRINGS, type Lang } from '../i18n/strings'
import { MAX_LIVES, QUESTION_TIME_MS, countryName, formatClock, type Question, type QuizMode } from '../lib/quiz'
import { Flag } from './Flag'

interface QuizScreenProps {
  lang: Lang
  mode: QuizMode
  question: Question
  index: number
  total: number
  selectedIso: string | null
  timedOut: boolean
  remainingMs: number
  roundMs: number
  livesLeft: number
  onSelect: (iso: string) => void
  onBack: () => void
}

export function QuizScreen({
  lang,
  mode,
  question,
  index,
  total,
  selectedIso,
  timedOut,
  remainingMs,
  roundMs,
  livesLeft,
  onSelect,
  onBack,
}: QuizScreenProps) {
  const t = STRINGS[lang]
  const answered = selectedIso !== null || timedOut
  const correctName = countryName(question.country, lang)
  const secondsLeft = Math.ceil(remainingMs / 1000)
  const urgent = !answered && remainingMs <= 3000
  const timerWidth = `${Math.max(0, (remainingMs / QUESTION_TIME_MS) * 100)}%`

  return (
    <div className="screen quiz-screen">
      <header className="quiz-header">
        <button type="button" className="btn-ghost" onClick={onBack}>
          {t.back}
        </button>
        <div className="progress-copy">{t.questionOf(index + 1, total)}</div>
        <div className="lives" aria-label={t.lives}>
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <span
              key={i}
              className={`life ${i < livesLeft ? 'is-on' : 'is-off'}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </header>

      <div className="quiz-timers">
        <div className={`question-clock ${urgent || timedOut ? 'is-urgent' : ''}`}>
          {timedOut ? t.timedOut : secondsLeft}
        </div>
        <div className="round-clock">{t.totalTime(formatClock(roundMs))}</div>
      </div>

      <div className="progress-track timer-track" aria-hidden="true">
        <div
          className={`progress-bar timer-bar ${urgent ? 'is-urgent' : ''}`}
          style={{ width: timerWidth }}
        />
      </div>

      <section className="card question-card">
        {mode === 'flagToName' ? (
          <Flag iso={question.country.iso} name={correctName} size="hero" />
        ) : (
          <h2 className="prompt-name">{correctName}</h2>
        )}
      </section>

      <div className={`options ${mode === 'nameToFlag' ? 'options-flags' : 'options-names'}`}>
        {question.options.map((option) => {
          const name = countryName(option, lang)
          const isCorrectOption = option.iso === question.country.iso
          const isSelected = option.iso === selectedIso
          const stateClass = answered
            ? isCorrectOption
              ? 'is-correct'
              : isSelected
                ? 'is-wrong'
                : 'is-muted'
            : ''

          return (
            <button
              key={option.iso}
              type="button"
              className={`option ${stateClass}`}
              disabled={answered}
              onClick={() => onSelect(option.iso)}
            >
              {mode === 'nameToFlag' ? (
                <>
                  <Flag iso={option.iso} name={name} size="option" />
                  {answered && <span className="option-caption">{name}</span>}
                </>
              ) : (
                name
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
