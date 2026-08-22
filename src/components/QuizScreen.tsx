import { STRINGS, type Lang } from '../i18n/strings'
import { COUNTRIES, type Country } from '../data/countries'
import { landNeighbors } from '../data/neighbors'
import {
  countryName,
  formatClock,
  isFactMode,
  questionLimitMs,
  quizMapRegion,
  type PlayPath,
  type Question,
  type QuizMode,
  type RegionFilter,
} from '../lib/quiz'
import { optionLabel } from '../lib/quizAnswers'
import { Flag } from './Flag'
import { Lives } from './Lives'
import { QuizMap } from './QuizMap'

interface QuizScreenProps {
  lang: Lang
  mode: QuizMode
  region: RegionFilter
  path?: PlayPath
  question: Question
  index: number
  total: number
  selectedIso: string | null
  timedOut: boolean
  remainingMs: number
  roundMs: number
  livesLeft: number
  maxLives: number
  practice?: boolean
  duel?: {
    opponentName: string
    opponentReady: boolean
    opponentAnswer?: string | null
    reveal: boolean
    youScore: number
    opponentScore: number
  }
  onSelect: (iso: string) => void
  onNext?: () => void
  onBack: () => void
}

export function QuizScreen({
  lang,
  mode,
  region,
  path = 'pool',
  question,
  index,
  total,
  selectedIso,
  timedOut,
  remainingMs,
  roundMs,
  livesLeft,
  maxLives,
  practice = false,
  duel,
  onSelect,
  onNext,
  onBack,
}: QuizScreenProps) {
  const t = STRINGS[lang]
  const activeMode = question.mode ?? mode
  const answered = selectedIso !== null || timedOut
  const correctName = countryName(question.country, lang)
  const secondsLeft = Math.ceil(remainingMs / 1000)
  const urgent = !answered && remainingMs <= 3000
  const limitMs = questionLimitMs(activeMode, { region, path })
  const timerWidth = `${Math.max(0, (remainingMs / limitMs) * 100)}%`
  const mapRegion = quizMapRegion(path, region)
  const promptNeighbors =
    activeMode === 'neighborsToName'
      ? landNeighbors(question.country.iso)
          .map((iso) => COUNTRIES.find((country) => country.iso === iso))
          .filter((country): country is Country => country !== undefined)
          .sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), lang === 'ru' ? 'ru' : 'en'))
      : []

  return (
    <div className={`screen quiz-screen${activeMode === 'nameToMap' ? ' is-map-find' : ''}`}>
      <header className="quiz-header">
        <button type="button" className="btn-ghost" onClick={onBack}>
          {t.back}
        </button>
        <div className="progress-copy">{t.questionOf(index + 1, total)}</div>
        {duel ? (
          <div className="duel-score" aria-label={t.duel}>
            {duel.youScore}:{duel.opponentScore}
          </div>
        ) : practice ? (
          <span className="levels-header-spacer" aria-hidden="true" />
        ) : maxLives <= 3 ? (
          <Lives
            filled={livesLeft}
            total={maxLives}
            gold={maxLives >= 3 && livesLeft === maxLives}
            label={t.lives}
          />
        ) : (
          <span
            className={`lives-compact${livesLeft === maxLives ? ' is-gold' : ''}`}
            aria-label={t.lives}
          >
            <span className="life is-on" aria-hidden="true">
              ♥
            </span>
            {livesLeft}
          </span>
        )}
      </header>

      {duel ? (
        <p className="duel-status">
          {t.duelVs(duel.opponentName)}
          {answered && !duel.reveal
            ? ` · ${duel.opponentReady ? t.duelOpponentDone : t.duelWaitingOpponent}`
            : ''}
        </p>
      ) : null}

      {!practice && (
        <>
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
        </>
      )}

      {activeMode === 'mapToName' ? (
        <section className="card question-card is-map">
          <p className="quiz-map-ask">{t.whichCountry}</p>
          <QuizMap
            key={`${question.country.iso}-id`}
            lang={lang}
            variant="identify"
            region={mapRegion}
            focusIso={question.country.iso}
            selectedIso={selectedIso}
            revealed={answered}
          />
        </section>
      ) : (
        <section className="card question-card">
          {activeMode === 'flagToName' ? (
            <Flag iso={question.country.iso} name={correctName} size="hero" />
          ) : activeMode === 'neighborsToName' ? (
            <div className="neighbors-prompt">
              <p className="neighbors-prompt-label">{t.whoseNeighbors}</p>
              <ul className="neighbors-prompt-list">
                {promptNeighbors.map((neighbor) => {
                  const name = countryName(neighbor, lang)
                  return (
                    <li key={neighbor.iso} className="neighbors-prompt-item">
                      <Flag iso={neighbor.iso} name={name} size="thumb" />
                      <span>{name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <h2 className="prompt-name">{correctName}</h2>
          )}
        </section>
      )}

      {activeMode === 'nameToMap' ? (
        <QuizMap
          key={`${question.country.iso}-find`}
          lang={lang}
          variant="find"
          region={mapRegion}
          focusIso={question.country.iso}
          selectedIso={selectedIso}
          revealed={answered}
          onPick={onSelect}
        />
      ) : (
        <div className={`options ${activeMode === 'nameToFlag' ? 'options-flags' : 'options-names'}`}>
          {question.options.map((option) => {
            const name = countryName(option, lang)
            const isCorrectOption = option.iso === question.country.iso
            const isSelected = option.iso === selectedIso
            const isOpponent = Boolean(duel?.reveal && duel.opponentAnswer === option.iso)
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
                className={`option ${stateClass}${isFactMode(activeMode) ? ' option-fact' : ''}${isOpponent ? ' is-duel-opponent' : ''}`}
                disabled={answered}
                onClick={() => onSelect(option.iso)}
              >
                {activeMode === 'nameToFlag' ? (
                  <>
                    <Flag iso={option.iso} name={name} size="option" />
                    {answered && <span className="option-caption">{name}</span>}
                  </>
                ) : (
                  optionLabel(option, activeMode, lang, question)
                )}
              </button>
            )
          })}
        </div>
      )}

      {practice && answered && onNext && (
        <button type="button" className="btn-primary" onClick={onNext}>
          {index >= total - 1 ? t.seeResults : t.next}
        </button>
      )}
    </div>
  )
}
