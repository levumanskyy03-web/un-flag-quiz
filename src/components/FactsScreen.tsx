import { useEffect, useMemo, useRef, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import type { FactClue } from '../lib/countryFacts'
import { factLabel, searchCountries } from '../lib/factText'
import {
  FACTS_MAX,
  FACTS_WRONG_LIMIT,
  factsClueTimeMs,
} from '../lib/factsRules'
import { countryName, formatClock, type Question } from '../lib/quiz'
import { Lives } from './Lives'
import { WorldsBack } from './WorldsBack'

interface FactsScreenProps {
  lang: Lang
  question: Question
  index: number
  total: number
  roundMs: number
  practice?: boolean
  selectedIso?: string | null
  finished?: boolean
  duel?: {
    opponentName: string
    opponentReady: boolean
    youScore: number
    opponentScore: number
    remainingMs: number
    factIndex: number
    facts: FactClue[]
    maxFacts: number
    wrongs: number
    wrongLimit: number
    hardcore: boolean
    locked: boolean
  }
  onFinish: (iso: string | null, timeMs: number, factIndex: number) => void
  onGuess?: (iso: string) => void
  onAdvance?: () => void
  onCountryNext?: () => void
  onBack: () => void
  onWorlds?: () => void
}

export function FactsScreen({
  lang,
  question,
  index,
  total,
  roundMs,
  practice = false,
  selectedIso = null,
  finished = false,
  duel,
  onFinish,
  onGuess,
  onAdvance,
  onCountryNext,
  onBack,
  onWorlds,
}: FactsScreenProps) {
  const t = STRINGS[lang]
  const facts = duel?.facts ?? question.facts ?? []
  const maxFacts = duel?.maxFacts ?? Math.min(FACTS_MAX, Math.max(1, facts.length))
  const wrongLimit = duel?.wrongLimit ?? FACTS_WRONG_LIMIT
  const [factIndex, setFactIndex] = useState(0)
  const [remainingMs, setRemainingMs] = useState(() => factsClueTimeMs(null, 0))
  const [wrongs, setWrongs] = useState(0)
  const [query, setQuery] = useState('')
  const [flash, setFlash] = useState<string | null>(null)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [localDone, setLocalDone] = useState(false)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  const activeIndex = duel ? duel.factIndex : factIndex
  const limitMs = factsClueTimeMs(null, activeIndex)
  const activeRemaining = duel ? duel.remainingMs : remainingMs
  const activeWrongs = duel ? duel.wrongs : wrongs
  const locked = Boolean(duel?.locked || finished || localDone || selectedIso)
  const clue = facts[activeIndex] ?? facts[facts.length - 1]
  const secondsLeft = Math.ceil(activeRemaining / 1000)
  const urgent = !locked && activeRemaining <= 3000
  const timerWidth = `${Math.max(0, (activeRemaining / limitMs) * 100)}%`
  const suggestions = useMemo(() => searchCountries(query, lang), [query, lang])
  const factLivesTotal = Number.isFinite(wrongLimit) ? wrongLimit : 0
  const factLivesLeft = factLivesTotal > 0 ? Math.max(0, factLivesTotal - activeWrongs) : 0
  const canAdvance = activeIndex + 1 < maxFacts
  const showSkip = !locked && canAdvance && (duel ? Boolean(duel.hardcore && onAdvance) : true)
  const showCountryNext = Boolean(locked && onCountryNext)
  const showSuggestions = suggestions.length > 0 && !locked

  useEffect(() => {
    setFactIndex(0)
    setRemainingMs(factsClueTimeMs(null, 0))
    setWrongs(0)
    setQuery('')
    setFlash(null)
    setLocalDone(false)
    setStartedAt(Date.now())
  }, [question.country.iso])

  useEffect(() => {
    if (duel || practice || locked) return
    const started = Date.now()
    let cancelled = false
    setRemainingMs(limitMs)
    const id = window.setInterval(() => {
      if (cancelled) return
      const left = limitMs - (Date.now() - started)
      if (left > 0) {
        setRemainingMs(left)
        return
      }
      window.clearInterval(id)
      setRemainingMs(0)
      if (factIndex + 1 >= maxFacts) {
        setLocalDone(true)
        onFinishRef.current(null, Date.now() - startedAt, factIndex)
        return
      }
      setFactIndex((prev) => prev + 1)
    }, 50)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [duel, practice, locked, factIndex, limitMs, maxFacts, startedAt])

  function submitIso(iso: string) {
    if (locked) return
    setQuery('')
    if (iso === question.country.iso) {
      setLocalDone(true)
      if (duel) onGuess?.(iso)
      else onFinish(iso, Date.now() - startedAt, activeIndex)
      return
    }
    const nextWrongs = activeWrongs + 1
    setFlash(t.factWrong)
    window.setTimeout(() => setFlash(null), 900)
    if (duel) {
      onGuess?.(iso)
      return
    }
    setWrongs(nextWrongs)
    if (nextWrongs >= wrongLimit) {
      setLocalDone(true)
      onFinish(null, Date.now() - startedAt, activeIndex)
    }
  }

  return (
    <div className="screen quiz-screen facts-screen">
      {onWorlds ? <WorldsBack lang={lang} onClick={onWorlds} /> : null}
      <header className="quiz-header">
        <button type="button" className="btn-ghost" onClick={onBack}>
          {t.back}
        </button>
        <div className="progress-copy">{t.questionOf(index + 1, total)}</div>
        {duel ? (
          <div className="facts-header-end">
            {factLivesTotal > 0 ? (
              <Lives
                filled={factLivesLeft}
                total={factLivesTotal}
                size="sm"
                gold={factLivesTotal >= 3 && factLivesLeft === factLivesTotal}
                label={t.lives}
              />
            ) : null}
            <div className="duel-score" aria-label={t.duel}>
              {duel.youScore}:{duel.opponentScore}
            </div>
          </div>
        ) : practice || factLivesTotal === 0 ? (
          <span className="levels-header-spacer" aria-hidden="true" />
        ) : (
          <Lives
            filled={factLivesLeft}
            total={factLivesTotal}
            gold={factLivesTotal >= 3 && factLivesLeft === factLivesTotal}
            label={t.lives}
          />
        )}
      </header>

      {duel ? (
        <p className="duel-status">
          {t.duelVs(duel.opponentName)}
          {duel.opponentReady ? ` · ${t.duelOpponentDone}` : ` · ${t.duelWaitingOpponent}`}
        </p>
      ) : null}

      <p className="facts-meta">
        {t.factOf(Math.min(activeIndex + 1, maxFacts), maxFacts)}
        {` · ${formatClock(roundMs)}`}
      </p>

      <div className={`timer-track${urgent ? ' is-urgent' : ''}`} aria-hidden="true">
        <div className="timer-fill" style={{ width: timerWidth }} />
      </div>
      <p className={`timer-copy${urgent ? ' is-urgent' : ''}`}>{secondsLeft}</p>

      <section className="card facts-card">
        {clue ? (
          <>
            <p className="facts-uniqueness">{t.factUniqueness(clue.uniqueness)}</p>
            <p className="facts-text">{factLabel(clue, lang)}</p>
          </>
        ) : null}
        {flash ? <p className="facts-flash">{flash}</p> : null}
        {locked && selectedIso === question.country.iso ? (
          <p className="facts-ok">{t.factGuessedAt(activeIndex + 1)}</p>
        ) : null}
        {locked && selectedIso !== question.country.iso ? (
          <p className="facts-flash">{t.factFailed}</p>
        ) : null}
      </section>

      {activeIndex > 0 ? (
        <ol className="facts-prev">
          {facts.slice(0, activeIndex).map((item, i) => (
            <li key={item.id}>
              <span>{i + 1}.</span> {factLabel(item, lang)}
              <em>{t.factUniqueness(item.uniqueness)}</em>
            </li>
          ))}
        </ol>
      ) : null}

      {showSkip ? (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            if (duel) {
              onAdvance?.()
              return
            }
            if (factIndex + 1 >= maxFacts) {
              setLocalDone(true)
              onFinish(null, Date.now() - startedAt, factIndex)
              return
            }
            setFactIndex((prev) => prev + 1)
          }}
        >
          {t.factNext}
        </button>
      ) : null}

      {showCountryNext ? (
        <button type="button" className="btn-primary" onClick={onCountryNext}>
          {t.next}
        </button>
      ) : null}

      <form
        className="facts-search"
        onSubmit={(event) => {
          event.preventDefault()
          if (suggestions.length === 1) submitIso(suggestions[0].iso)
        }}
      >
        <label className="map-search">
          <span className="sr-only">{t.factGuess}</span>
          <input
            type="search"
            value={query}
            placeholder={t.factGuess}
            autoComplete="off"
            spellCheck={false}
            disabled={locked}
            onChange={(event) => setQuery(event.target.value)}
          />
          {showSuggestions ? (
            <ul className="map-search-list">
              {suggestions.map((country) => (
                <li key={country.iso}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => submitIso(country.iso)}
                  >
                    {countryName(country, lang)}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </label>
      </form>
    </div>
  )
}
