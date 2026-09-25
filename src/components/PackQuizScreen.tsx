'use client'

import { useReducedMotion } from 'framer-motion'
import { motion } from 'framer-motion'
import { STRINGS, type Lang } from '../i18n/strings'
import { formatClock } from '../lib/quiz'
import { packFormatLabel } from './PackFixWizard'
import type { PackQuestion } from '../lib/quiz/pack'
import { StudioChromeNav } from './WorldsBack'
import { FitText } from './FitText'
import { AnswerKey, answerMotion, answerTone, useAnswerHotkeys } from './AnswerHotkey'

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
  streak?: number
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
  streak = 0,
  onSelect,
  onNext,
  onBack,
  onWorlds,
  onFix,
}: PackQuizScreenProps) {
  const t = STRINGS[lang]
  const answered = selectedId !== null || timedOut
  const clues = question.clues ?? []
  const reduceMotion = useReducedMotion()
  const optionIds = question.options.map((option) => option.id)
  useAnswerHotkeys(optionIds, onSelect, !answered)
  const press = !reduceMotion ? { y: 6, scale: 0.98 } : undefined

  return (
    <div className="screen quiz-screen pack-quiz-screen">
      <header className="quiz-header">
        <StudioChromeNav lang={lang} onBack={onBack} onWorlds={onWorlds} />
        <p className="score-kicker">{title}</p>
        <div className="quiz-progress-block">
          <div
            className="progress-track quiz-round-track"
            role="progressbar"
            aria-valuenow={index + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label={t.questionOf(index + 1, total)}
          >
            <div className="progress-bar" style={{ width: `${total === 0 ? 0 : ((index + 1) / total) * 100}%` }} />
          </div>
          {streak >= 2 ? <p className="quiz-streak">🔥 {t.roundStreak(streak)}</p> : null}
          {practice ? null : (
            <p className="progress-copy">{formatClock(remainingMs)} · {livesLeft}</p>
          )}
        </div>
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
      <motion.div
        key={`${index}-${question.answerId}`}
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
      <div className="choice-grid is-2">
        {question.options.map((option, optionIndex) => {
          const selected = selectedId === option.id
          const correct = option.id === question.answerId
          const cls = answered
            ? correct
              ? 'is-correct'
              : selected
                ? 'is-wrong'
                : ''
            : ''
          const hotkey = optionIndex < 4 ? optionIndex + 1 : 0
          return (
            <motion.button
              key={option.id}
              type="button"
              className={`choice ${answerTone(optionIndex)} ${cls}`}
              disabled={answered}
              onClick={() => onSelect(option.id)}
              animate={answerMotion(reduceMotion, answered && selected && !correct, answered && correct)}
              whileHover={!answered && !reduceMotion ? { scale: 1.03 } : undefined}
              whileTap={!answered ? press : undefined}
              transition={{ duration: 0.42 }}
            >
              {hotkey > 0 ? <AnswerKey n={hotkey} label={t.answerKey(hotkey)} /> : null}
              {option.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={`pack-opt-img${option.silhouette ? ' is-sil' : ''}`} src={option.image} alt="" />
              ) : null}
              <FitText minPx={11}>{option.label}</FitText>
              {answered && correct ? <span className="option-check" aria-hidden="true">✓</span> : null}
            </motion.button>
          )
        })}
      </div>
      </motion.div>
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
