import { STRINGS, footballQuestionPrompt, localeTag, mixAskHint, modeLabel, type Lang } from '../i18n/strings'
import { type Country } from '../data/countries'
import { findCountry } from '../data/extras'
import { landNeighbors } from '../data/neighbors'
import {
  codePromptLabel,
  countryName,
  formatClock,
  isCodeOptionMode,
  isCodePromptMode,
  isFootballTeamChoice,
  isFootballYearChoice,
  isFactMode,
  isLeaderNumberPrompt,
  isLeaderPhotoMode,
  isLeaderYearsPrompt,
  isPlayerPhotoMode,
  isRankingMode,
  isWaterMapMode,
  isWaterMode,
  questionLimitMs,
  quizMapRegion,
  waterName,
  type PlayPath,
  type Question,
  type QuizMode,
  type RegionFilter,
} from '../lib/quiz'
import { rankingPlaceOf } from '../data/rankings'
import { optionLabel } from '../lib/quizAnswers'
import { termById, yearsLabel } from '../data/leaders'
import { playerById } from '../data/footballPlayers'
import { Flag, TeamFlag } from './Flag'
import { LeaderPortrait } from './LeaderPortrait'
import { Lives } from './Lives'
import { QuizMap } from './QuizMap'
import { RankingFootnote } from './GeoModeGrids'
import { WorldsBack } from './WorldsBack'
import { ChoiceLabel, FitText } from './FitText'

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
  mix?: boolean
  includeExtras?: boolean
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
  onWorlds?: () => void
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
  mix = false,
  includeExtras = false,
  duel,
  onSelect,
  onNext,
  onBack,
  onWorlds,
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
  const mixHint = mix ? mixAskHint(activeMode, lang) : null
  const leaderTerm = termById(question.country.iso)
  const player = playerById(question.country.iso)
  const leaderRange = leaderTerm ? yearsLabel(leaderTerm.from, leaderTerm.to, t.present) : ''
  const promptNeighbors =
    activeMode === 'neighborsToName'
      ? landNeighbors(question.country.iso)
          .map((iso) => findCountry(iso))
          .filter((country): country is Country => country !== undefined)
          .sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), localeTag(lang)))
      : []

  return (
    <div className={`screen quiz-screen${activeMode === 'nameToMap' ? ' is-map-find' : ''}`}>
      {onWorlds ? <WorldsBack lang={lang} onClick={onWorlds} /> : null}
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

      {activeMode === 'mapToName' || isWaterMapMode(activeMode) ? (
        <section className="card question-card is-map">
          <p className={mixHint ? 'mix-ask-hint' : 'quiz-map-ask'}>
            {mixHint ??
              (isWaterMapMode(activeMode)
                ? activeMode === 'mapToSea'
                  ? t.seaMapPrompt
                  : t.riverMapPrompt
                : t.whichCountry)}
          </p>
          <QuizMap
            key={`${question.country.iso}-${question.waterId ?? 'id'}`}
            lang={lang}
            variant={isWaterMapMode(activeMode) ? 'water' : 'identify'}
            region={isWaterMapMode(activeMode) ? 'all' : mapRegion}
            focusIso={question.country.iso}
            waterId={question.waterId}
            selectedIso={selectedIso}
            revealed={answered}
            includeExtras={includeExtras}
          />
        </section>
      ) : (
        <section className={`card question-card${mixHint ? ' has-mix-ask' : ''}`}>
          {mixHint ? <p className="mix-ask-hint">{mixHint}</p> : null}
          {activeMode === 'flagToName' ? (
            <Flag iso={question.country.iso} name={correctName} size="hero" />
          ) : isFootballYearChoice(activeMode) ? (
            <div className="title-year-prompt">
              <TeamFlag iso={question.country.iso} name={correctName} size="hero" />
              <h2 className="prompt-name">{footballQuestionPrompt(activeMode, question.year ?? 0, correctName, lang)}</h2>
            </div>
          ) : footballQuestionPrompt(activeMode, question.year ?? 0, correctName, lang) ? (
            <h2 className="prompt-name">{footballQuestionPrompt(activeMode, question.year ?? 0, correctName, lang)}</h2>
          ) : isCodePromptMode(activeMode) ? (
            <div className="code-prompt-block">
              <p className="neighbors-prompt-label">
                {activeMode === 'tldToName' ? t.tldPrompt : activeMode === 'callingToName' ? t.callingPrompt : t.carPrompt}
              </p>
              <h2 className={`prompt-name code-prompt${activeMode === 'carToName' ? ' is-car' : ''}`}>
                {codePromptLabel(question.country, activeMode)}
              </h2>
            </div>
          ) : isCodeOptionMode(activeMode) ? (
            <h2 className="prompt-name">
              {activeMode === 'nameToTld'
                ? t.nameToTldAsk(correctName)
                : activeMode === 'nameToCalling'
                  ? t.nameToCallingAsk(correctName)
                  : t.nameToCarAsk(correctName)}
            </h2>
          ) : isLeaderPhotoMode(activeMode) || isPlayerPhotoMode(activeMode) ? (
            <div className="leader-prompt">
              <p className="neighbors-prompt-label">{t.leaderPhotoPrompt}</p>
              <LeaderPortrait
                name={correctName}
                wiki={leaderTerm?.wiki ?? player?.wiki ?? ''}
                size="hero"
                compact={!answered}
              />
            </div>
          ) : isLeaderNumberPrompt(activeMode) ? (
            <div className="code-prompt-block">
              <p className="neighbors-prompt-label">
                {activeMode === 'popeNumberToName'
                  ? t.popeNumberPrompt(leaderTerm?.n ?? 0)
                  : t.usNumberPrompt(leaderTerm?.n ?? 0)}
              </p>
              <h2 className="prompt-name code-prompt">{leaderTerm?.n ?? ''}</h2>
            </div>
          ) : isLeaderYearsPrompt(activeMode) ? (
            <div className="code-prompt-block">
              <p className="neighbors-prompt-label">
                {activeMode === 'popeYearsToName'
                  ? t.popeYearsPrompt(leaderRange)
                  : activeMode === 'rusYearsToName'
                    ? t.askoldPrompt(leaderRange)
                    : activeMode === 'ukYearsToName'
                      ? t.ukYearsPrompt(leaderRange)
                      : t.usYearsPrompt(leaderRange)}
              </p>
              <h2 className="prompt-name">{leaderRange}</h2>
            </div>
          ) : isRankingMode(activeMode) ? (
            <div className="code-prompt-block">
              {mixHint ? null : (
                <p className="neighbors-prompt-label">
                  {t.rankingAsk(modeLabel(activeMode, lang), rankingPlaceOf(activeMode, question.country.iso) ?? 0)}
                </p>
              )}
              <h2 className="prompt-name code-prompt">
                {rankingPlaceOf(activeMode, question.country.iso) ?? ''}
              </h2>
            </div>
          ) : isWaterMode(activeMode) && question.waterId ? (
            <div className="code-prompt-block">
              {mixHint ? null : (
                <p className="neighbors-prompt-label">
                  {activeMode === 'seaToName' ? t.seaPrompt : t.riverPrompt}
                </p>
              )}
              <h2 className="prompt-name">{waterName(question.waterId, lang)}</h2>
            </div>
          ) : activeMode === 'neighborsToName' ? (
            <div className="neighbors-prompt">
              {mixHint ? null : <p className="neighbors-prompt-label">{t.whoseNeighbors}</p>}
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
          ) : activeMode === 'nameToLanguage' ? (
            <div className="code-prompt-block">
              {mixHint ? null : <p className="neighbors-prompt-label">{t.nameToLanguagePrompt}</p>}
              <Flag iso={question.country.iso} name={correctName} size="hero" />
              <h2 className="prompt-name">{correctName}</h2>
            </div>
          ) : (
            <h2 className="prompt-name">{correctName}</h2>
          )}
        </section>
      )}

      {isRankingMode(activeMode) ? <RankingFootnote mode={activeMode} lang={lang} /> : null}

      {activeMode === 'nameToMap' ? (
        <QuizMap
          key={`${question.country.iso}-find`}
          lang={lang}
          variant="find"
          region={mapRegion}
          focusIso={question.country.iso}
          selectedIso={selectedIso}
          revealed={answered}
          includeExtras={includeExtras}
          onPick={onSelect}
        />
      ) : (
        <div className={`options ${activeMode === 'nameToFlag' ? 'options-flags' : 'options-names'}`}>
          {isWaterMapMode(activeMode)
            ? (question.waterOptions ?? []).map((id) => {
                const isCorrectOption = id === question.waterId
                const isSelected = id === selectedIso
                const isOpponent = Boolean(duel?.reveal && duel.opponentAnswer === id)
                const stateClass = answered
                  ? isCorrectOption
                    ? 'is-correct'
                    : isSelected
                      ? 'is-wrong'
                      : 'is-muted'
                  : ''
                return (
                  <button
                    key={id}
                    type="button"
                    className={`option ${stateClass}${isOpponent ? ' is-duel-opponent' : ''}`}
                    disabled={answered}
                    onClick={() => onSelect(id)}
                  >
                    {waterName(id, lang)}
                  </button>
                )
              })
            : isFootballYearChoice(activeMode)
            ? (question.yearOptions ?? []).map((year) => {
                const key = String(year)
                const isCorrectOption = year === question.year
                const isSelected = key === selectedIso
                const isOpponent = Boolean(duel?.reveal && duel.opponentAnswer === key)
                const stateClass = answered
                  ? isCorrectOption
                    ? 'is-correct'
                    : isSelected
                      ? 'is-wrong'
                      : 'is-muted'
                  : ''
                return (
                  <button
                    key={key}
                    type="button"
                    className={`option option-year ${stateClass}${isOpponent ? ' is-duel-opponent' : ''}`}
                    disabled={answered}
                    onClick={() => onSelect(key)}
                  >
                    {year}
                  </button>
                )
              })
            : question.options.map((option) => {
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
                className={`option ${stateClass}${isFactMode(activeMode) ? ' option-fact' : ''}${isCodeOptionMode(activeMode) ? ' option-code' : ''}${isOpponent ? ' is-duel-opponent' : ''}`}
                disabled={answered}
                onClick={() => onSelect(option.iso)}
              >
                {activeMode === 'nameToFlag' ? (
                  <>
                    <Flag iso={option.iso} name={name} size="option" />
                    {answered && <span className="option-caption">{name}</span>}
                  </>
                ) : isFootballTeamChoice(activeMode) ? (
                  <span className="option-team">
                    <TeamFlag iso={option.iso} name={name} size="thumb" />
                    <FitText minPx={8}>{optionLabel(option, activeMode, lang, question)}</FitText>
                  </span>
                ) : (
                  <ChoiceLabel>{optionLabel(option, activeMode, lang, question)}</ChoiceLabel>
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
