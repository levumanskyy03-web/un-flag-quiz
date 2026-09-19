import { STRINGS, type Lang } from '../i18n/strings'
import { formatClock } from '../lib/quiz'
import { packFormatLabel } from './PackFixWizard'
import type { PackQuestion } from '../lib/quiz/pack'
import { StudioChromeNav } from './WorldsBack'
import { FitText } from './FitText'

interface PackQuizScreenProps {
  lang: Lang
  title: string
  question: PackQuestion
  index: number
  total: number
  selectedId: string | null
  timedOut: boolean
  remainingMs: number
  livesLeft: number
  practice?: boolean
  onSelect: (id: string) => void
  onNext: () => void
  onBack: () => void
  onWorlds: () => void
  onFix: () => void
}

export function PackQuizScreen({
  lang,
  title,
  question,
  index,
  total,
  selectedId,
  timedOut,
  remainingMs,
  livesLeft,
  practice,
  onSelect,
  onNext,
  onBack,
  onWorlds,
  onFix,
}: PackQuizScreenProps) {
  const t = STRINGS[lang]
  const answered = selectedId !== null || timedOut
  const clues = question.clues ?? []

  return (
    <div className="screen quiz-screen pack-quiz-screen">
      <header className="quiz-header">
        <StudioChromeNav lang={lang} onBack={onBack} onWorlds={onWorlds} />
        <p className="score-kicker">{title}</p>
        <p className="quiz-progress">
          {index + 1}/{total}
          {practice ? null : ` · ${formatClock(remainingMs)}`}
          {practice ? null : ` · ${livesLeft}`}
        </p>
      </header>
      <p className="subtitle">{packFormatLabel(question.format, t)}</p>
      {clues.length > 0 ? (
        <ol className="pack-clues">
          {clues.map((clue) => (
            <li key={clue}>{clue}</li>
          ))}
        </ol>
      ) : null}
      {question.promptImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={`pack-prompt-img${question.silhouette ? ' is-sil' : ''}`}
          src={question.promptImage}
          alt=""
        />
      ) : null}
      {question.prompt ? <h1 className="quiz-prompt">{question.prompt}</h1> : null}
      <div className="choice-grid is-2">
        {question.options.map((option) => {
          const selected = selectedId === option.id
          const correct = option.id === question.answerId
          const cls = answered
            ? correct
              ? 'is-correct'
              : selected
                ? 'is-wrong'
                : ''
            : ''
          return (
            <button
              key={option.id}
              type="button"
              className={`choice ${cls}`}
              disabled={answered}
              onClick={() => onSelect(option.id)}
            >
              {option.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={`pack-opt-img${option.silhouette ? ' is-sil' : ''}`} src={option.image} alt="" />
              ) : null}
              <FitText minPx={11}>{option.label}</FitText>
            </button>
          )
        })}
      </div>
      {answered ? (
        <div className="quiz-next-row">
          <button type="button" className="btn-ghost" onClick={onFix}>
            {t.studioFix}
          </button>
          <button type="button" className="btn-primary" onClick={onNext}>
            {t.next}
          </button>
        </div>
      ) : null}
    </div>
  )
}
