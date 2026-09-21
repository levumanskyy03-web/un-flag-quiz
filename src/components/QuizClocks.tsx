'use client'

import { useEffect, useRef, useState } from 'react'
import { formatClock } from '../lib/quiz'

interface QuizClocksProps {
  questionKey: string
  limitMs: number
  paused: boolean
  timedOut: boolean
  timedOutLabel: string
  totalTime: (clock: string) => string
  roundIndex: number
}

export function QuizClocks({
  questionKey,
  limitMs,
  paused,
  timedOut,
  timedOutLabel,
  totalTime,
  roundIndex,
}: QuizClocksProps) {
  const roundOrigin = useRef(Date.now())
  const [now, setNow] = useState(() => Date.now())
  const questionOrigin = useRef(Date.now())

  useEffect(() => {
    if (roundIndex === 0) roundOrigin.current = Date.now()
  }, [roundIndex, questionKey])

  useEffect(() => {
    questionOrigin.current = Date.now()
    setNow(Date.now())
  }, [questionKey])

  useEffect(() => {
    if (paused || timedOut) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [paused, timedOut, questionKey])

  const remainingMs = timedOut ? 0 : Math.max(0, limitMs - (now - questionOrigin.current))
  const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000))
  const urgent = timedOut || (!paused && remainingMs <= 3000)
  const roundMs = Math.max(0, now - roundOrigin.current)

  return (
    <>
      <div className="quiz-timers">
        <div className={`question-clock ${urgent ? 'is-urgent' : ''}`}>{timedOut ? timedOutLabel : secondsLeft}</div>
        <div className="round-clock">{totalTime(formatClock(roundMs))}</div>
      </div>
      <div className="progress-track timer-track" aria-hidden="true">
        <div
          key={questionKey}
          className={`progress-bar timer-bar ${urgent ? 'is-urgent' : ''} ${
            timedOut ? 'is-done' : paused ? 'is-paused' : 'is-live'
          }`}
          style={{ ['--quiz-limit' as string]: `${limitMs}ms` }}
        />
      </div>
    </>
  )
}
