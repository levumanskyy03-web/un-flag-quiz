import { useReducedMotion } from 'framer-motion'
import { motion } from 'framer-motion'
import { STRINGS, astroQuestionPrompt, themeQuestionPrompt, drivingLabel, footballQuestionPrompt, mathQuestionPrompt, localeTag, mixAskHint, modeLabel, type Lang } from '../i18n/strings'
import { QuizClocks } from './QuizClocks'
import { type Country } from '../data/countries'
import { findCountry } from '../data/extras'
import { landNeighbors } from '../data/neighbors'
import {
  codePromptLabel,
  countryName,
  isClubCrestMode,
  isCodeOptionMode,
  isCodePromptMode,
  isFootballTeamChoice,
  isFootballYearChoice,
  isFactMode,
  isLeaderNumberPrompt,
  isLeaderPhotoMode,
  isLeaderYearsPrompt,
  isPlayerPhotoMode,
  isStadiumMode,
  isMathMode,
  isAstroMode,
  isThemeMode,
  isThemePhotoMode,
  isRankingMode,
  isWaterMapMode,
  isWaterMode,
  mathItemFromCountry,
  mathPromptText,
  astroItemFromCountry,
  astroPromptText,
  themeItemFromCountry,
  themePromptText,
  questionLimitMs,
  quizMapRegion,
  waterName,
  currentStreak,
  type PlayPath,
  type Question,
  type QuizMode,
  type RegionFilter,
  type RoundAnswer,
} from '../lib/quiz'
import { drivingSide } from '../data/driving'
import { rankingPlaceOf } from '../data/rankings'
import { optionLabel } from '../lib/quizAnswers'
import { termById, yearsLabel } from '../data/leaders'
import { portraitFileForTerm } from '../data/leaderPortraitFiles'
import { playerById } from '../data/footballPlayers'
import { FOOTBALL_MANAGERS } from '../data/footballManagers'
import { clubWiki } from '../data/footballClubs'
import { Flag, TeamFlag } from './Flag'
import { LeaderPortrait } from './LeaderPortrait'
import { MathShape } from './MathShape'
import { Lives } from './Lives'
import { QuizMap } from './QuizMap'
import { QuizSilhouette } from './QuizSilhouette'
import { RankingFootnote } from './GeoModeGrids'
import { useEmpire } from '../lib/empireStore'
import { powerPrice } from '../lib/empire/rules'
import { ChoiceLabel, FitText } from './FitText'
import { WorldsBack } from './WorldsBack'
import { AnswerKey, answerMotion, answerTone, useAnswerHotkeys } from './AnswerHotkey'

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
  includeEraStates?: boolean
  eraYear?: number
  answers?: RoundAnswer[]
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
  power?: {
    enabled: boolean
    hiddenKeys: string[]
    extraLifeUsed: boolean
    hintReady: boolean
    onHint: () => void
    onSkip: () => void
    onLife: () => void
  }
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
  remainingMs: _remainingMs,
  roundMs: _roundMs,
  livesLeft,
  maxLives,
  practice = false,
  mix = false,
  includeExtras = false,
  includeEraStates = false,
  eraYear,
  answers = [],
  duel,
  onSelect,
  onNext,
  onBack,
  onWorlds,
  power,
}: QuizScreenProps) {
  const t = STRINGS[lang]
  const empire = useEmpire()
  const price = (kind: 'hint' | 'skip' | 'life') => powerPrice(empire, kind)
  const priceLabel = (kind: 'hint' | 'skip' | 'life') => (price(kind) === 0 ? t.quizPowerFree : t.quizPowerCoins(price(kind)))
  const hidden = new Set(power?.hiddenKeys ?? [])
  const activeMode = question.mode ?? mode
  const answered = selectedIso !== null || timedOut
  const correctName = countryName(question.country, lang)
  const limitMs = questionLimitMs(activeMode, { region, path })
  const mapRegion = quizMapRegion(path, region)
  const mixHint = mix ? mixAskHint(activeMode, lang) : null
  const leaderTerm = termById(question.country.iso)
  const promptPlayer = playerById(question.promptEntity?.iso ?? question.country.iso)
  const player = promptPlayer ?? playerById(question.country.iso)
  const manager = FOOTBALL_MANAGERS.find((item) => item.id === question.country.iso)
  const footballAsk = footballQuestionPrompt(activeMode, question.year ?? 0, String(question.shirtNumber ?? correctName), lang, {
    league: question.league,
    stadiumName: question.stadiumName,
    goldenEvent: question.goldenEvent,
  })
  const mathItem = isMathMode(activeMode) ? mathItemFromCountry(question.country, activeMode) : undefined
  const mathAsk = mathQuestionPrompt(activeMode, lang)
  const mathPrompt = mathItem ? mathPromptText(mathItem, lang) : ''
  const astroItem = isAstroMode(activeMode) ? astroItemFromCountry(question.country, activeMode) : undefined
  const astroAsk = astroQuestionPrompt(activeMode, lang)
  const astroPrompt = astroItem ? astroPromptText(astroItem, lang) : ''
  const themeItem = isThemeMode(activeMode) ? themeItemFromCountry(question.country, activeMode) : undefined
  const themeAsk = themeQuestionPrompt(activeMode, lang)
  const themePrompt = themeItem ? themePromptText(themeItem, lang) : ''
  const leaderRange = leaderTerm ? yearsLabel(leaderTerm.from, leaderTerm.to, t.present) : ''
  const promptNeighbors =
    activeMode === 'neighborsToName'
      ? landNeighbors(question.country.iso)
          .map((iso) => findCountry(iso))
          .filter((country): country is Country => country !== undefined)
          .sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), localeTag(lang)))
      : []
  const streak = currentStreak(answers)
  const reduceMotion = useReducedMotion()
  const hotkeyIds =
    activeMode === 'nameToMap'
      ? []
      : isWaterMapMode(activeMode)
        ? (question.waterOptions ?? []).filter((id) => !hidden.has(id))
        : isFootballYearChoice(activeMode)
          ? (question.yearOptions ?? []).filter((year) => !hidden.has(String(year))).map(String)
          : question.options.filter((option) => !hidden.has(option.iso)).map((option) => option.iso)
  useAnswerHotkeys(hotkeyIds, onSelect, !answered && hotkeyIds.length > 0)
  const hotkeyN = (id: string) => {
    const n = hotkeyIds.indexOf(id)
    return n >= 0 && n < 4 ? n + 1 : 0
  }
  const press = !reduceMotion ? { y: 6, scale: 0.98 } : undefined

  return (
    <div className={`screen quiz-screen${activeMode === 'nameToMap' ? ' is-map-find' : ''}`}>
      <WorldsBack lang={lang} onClick={onBack} label={t.back} />
      <header className="quiz-header">
        <div className="quiz-header-row">
        {onWorlds ? (
          <button type="button" className="btn-ghost" onClick={onWorlds}>
            {t.worldsBack}
          </button>
        ) : (
          <span className="levels-header-spacer" aria-hidden="true" />
        )}
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
        </div>
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
        </div>
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
        <QuizClocks
          questionKey={`${index}-${question.country.iso}-${question.waterId ?? ''}`}
          limitMs={limitMs}
          paused={answered}
          timedOut={timedOut}
          timedOutLabel={t.timedOut}
          totalTime={t.totalTime}
          roundIndex={index}
        />
      )}

      <motion.div
        key={`${index}-${question.country.iso}-${question.waterId ?? ''}-${question.year ?? ''}`}
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
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
            includeEraStates={includeEraStates}
            eraYear={eraYear}
          />
        </section>
      ) : (
        <section className={`card question-card${mixHint ? ' has-mix-ask' : ''}`}>
          {mixHint ? <p className="mix-ask-hint">{mixHint}</p> : null}
          {activeMode === 'playerToClub' || activeMode === 'playerClubToName' ? (
            <p className="mix-ask-hint">{t.playerClubNote}</p>
          ) : null}
          {mathItem ? (
            <div className="code-prompt-block">
              {mathAsk ? <p className="neighbors-prompt-label">{mathAsk}</p> : null}
              {activeMode === 'shapeToName' && mathItem.shape ? (
                <MathShape id={mathItem.shape} size={120} />
              ) : activeMode === 'mathPhotoToName' ? (
                <div className="leader-prompt">
                  <LeaderPortrait
                    name={correctName}
                    wiki={mathItem.wiki ?? ''}
                    file={mathItem.wikiFile}
                    size="hero"
                    compact={!answered}
                  />
                </div>
              ) : activeMode === 'mathFactsToName' ? (
                <ul className="neighbors-prompt-list">
                  {mathPrompt.split('\n').map((line) => (
                    <li key={line} className="neighbors-prompt-item">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <h2 className={`prompt-name${activeMode === 'symbolToMeaning' || activeMode === 'siPrefixToFactor' ? ' code-prompt' : ''}`}>
                  {mathPrompt}
                </h2>
              )}
            </div>
          ) : astroItem ? (
            <div className="code-prompt-block">
              {astroAsk ? <p className="neighbors-prompt-label">{astroAsk}</p> : null}
              {activeMode === 'astroPhotoToName' ? (
                <div className="leader-prompt">
                  <LeaderPortrait
                    name={correctName}
                    wiki={astroItem.wiki ?? ''}
                    file={astroItem.wikiFile}
                    size="hero"
                    compact={!answered}
                  />
                </div>
              ) : astroItem.facts?.length ? (
                <ul className="neighbors-prompt-list">
                  {astroPrompt.split('\n').map((line) => (
                    <li key={line} className="neighbors-prompt-item">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <h2 className="prompt-name">{astroPrompt}</h2>
              )}
            </div>
          ) : themeItem ? (
            <div className="code-prompt-block">
              {themeAsk ? <p className="neighbors-prompt-label">{themeAsk}</p> : null}
              {isThemePhotoMode(activeMode) ? (
                <div className="leader-prompt">
                  <LeaderPortrait
                    name={correctName}
                    wiki={themeItem.wiki ?? ''}
                    file={themeItem.wikiFile}
                    size="hero"
                    compact={!answered}
                  />
                </div>
              ) : (
                <h2 className={`prompt-name${activeMode === 'codeToLang' || activeMode === 'decToBinary' || activeMode === 'binaryToDec' ? ' code-prompt' : ''}`}>{themePrompt}</h2>
              )}
            </div>
          ) : activeMode === 'flagToName' ? (
            <Flag iso={question.country.iso} name={correctName} size="hero" />
          ) : isFootballYearChoice(activeMode) ? (
            <div className="title-year-prompt">
              <TeamFlag iso={question.country.iso} name={correctName} size="hero" />
              <h2 className="prompt-name">{footballAsk}</h2>
            </div>
          ) : isClubCrestMode(activeMode) ? (
            <div className="leader-prompt">
              <p className="neighbors-prompt-label">{footballAsk}</p>
              <LeaderPortrait
                name={countryName(question.promptEntity ?? question.country, lang)}
                wiki={clubWiki((question.promptEntity ?? question.country).iso)}
                size="hero"
                compact={!answered}
              />
            </div>
          ) : isStadiumMode(activeMode) ? (
            <h2 className="prompt-name">{footballAsk}</h2>
          ) : activeMode === 'playerShirtToName' ? (
            <div className="code-prompt-block">
              <p className="neighbors-prompt-label">{footballAsk}</p>
              {question.promptEntity ? (
                <TeamFlag iso={question.promptEntity.iso} name={countryName(question.promptEntity, lang)} size="hero" />
              ) : null}
              <h2 className="prompt-name code-prompt">{question.shirtNumber ?? ''}</h2>
            </div>
          ) : footballAsk && !isPlayerPhotoMode(activeMode) ? (
            <h2 className="prompt-name">{footballAsk}</h2>
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
              <p className="neighbors-prompt-label">{footballAsk ?? t.leaderPhotoPrompt}</p>
              <LeaderPortrait
                name={question.promptEntity ? countryName(question.promptEntity, lang) : countryName(question.country, lang)}
                wiki={player?.wiki ?? manager?.wiki ?? ''}
                file={player?.wikiFile ?? (leaderTerm ? portraitFileForTerm(leaderTerm.id) : undefined)}
                flagIso={player?.nation}
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
          ) : activeMode === 'silhouetteToName' ? (
            <div className="code-prompt-block">
              {mixHint ? null : <p className="neighbors-prompt-label">{t.silhouettePrompt}</p>}
              <QuizSilhouette iso={question.country.iso} size="hero" eraYear={eraYear} />
            </div>
          ) : activeMode === 'languageToName' ? (
            <div className="code-prompt-block">
              {mixHint ? null : <p className="neighbors-prompt-label">{t.languageToNamePrompt}</p>}
              <h2 className="prompt-name">{optionLabel(question.country, 'nameToLanguage', lang, question)}</h2>
            </div>
          ) : activeMode === 'drivingToName' ? (
            <div className="code-prompt-block">
              {mixHint ? null : <p className="neighbors-prompt-label">{t.drivingToNamePrompt}</p>}
              <h2 className="prompt-name">{drivingLabel(drivingSide(question.country.iso), lang)}</h2>
            </div>
          ) : activeMode === 'nameToLanguage' || activeMode === 'nameToGov' || activeMode === 'nameToDriving' ? (
            <div className="code-prompt-block">
              {mixHint ? null : (
                <p className="neighbors-prompt-label">
                  {activeMode === 'nameToGov'
                    ? t.nameToGovPrompt
                    : activeMode === 'nameToDriving'
                      ? t.nameToDrivingPrompt
                      : t.nameToLanguagePrompt}
                </p>
              )}
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
          includeEraStates={includeEraStates}
          eraYear={eraYear}
          onPick={onSelect}
        />
      ) : (
        <div className={`options ${activeMode === 'nameToFlag' || activeMode === 'nameToSilhouette' ? 'options-flags' : 'options-names'}`}>
          {isWaterMapMode(activeMode)
            ? (question.waterOptions ?? []).filter((id) => !hidden.has(id)).map((id, tone) => {
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
                  <motion.button
                    key={id}
                    type="button"
                    className={`option ${answerTone(tone)} ${stateClass}${isOpponent ? ' is-duel-opponent' : ''}`}
                    disabled={answered}
                    onClick={() => onSelect(id)}
                    animate={answerMotion(reduceMotion, answered && isSelected && !isCorrectOption, answered && isCorrectOption)}
                    whileHover={!answered && !reduceMotion ? { scale: 1.03 } : undefined}
                    whileTap={!answered ? press : undefined}
                    transition={{ duration: 0.42 }}
                  >
                    {hotkeyN(id) > 0 ? <AnswerKey n={hotkeyN(id)} label={t.answerKey(hotkeyN(id))} /> : null}
                    {waterName(id, lang)}
                    {answered && isCorrectOption ? <span className="option-check" aria-hidden="true">✓</span> : null}
                  </motion.button>
                )
              })
            : isFootballYearChoice(activeMode)
            ? (question.yearOptions ?? []).filter((year) => !hidden.has(String(year))).map((year, tone) => {
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
                  <motion.button
                    key={key}
                    type="button"
                    className={`option option-year ${answerTone(tone)} ${stateClass}${isOpponent ? ' is-duel-opponent' : ''}`}
                    disabled={answered}
                    onClick={() => onSelect(key)}
                    animate={answerMotion(reduceMotion, answered && isSelected && !isCorrectOption, answered && isCorrectOption)}
                    whileHover={!answered && !reduceMotion ? { scale: 1.03 } : undefined}
                    whileTap={!answered ? press : undefined}
                    transition={{ duration: 0.42 }}
                  >
                    {hotkeyN(key) > 0 ? <AnswerKey n={hotkeyN(key)} label={t.answerKey(hotkeyN(key))} /> : null}
                    {year}
                    {answered && isCorrectOption ? <span className="option-check" aria-hidden="true">✓</span> : null}
                  </motion.button>
                )
              })
            : question.options.filter((option) => !hidden.has(option.iso)).map((option, tone) => {
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
              <motion.button
                key={option.iso}
                type="button"
                className={`option ${answerTone(tone)} ${stateClass}${isFactMode(activeMode) ? ' option-fact' : ''}${isCodeOptionMode(activeMode) ? ' option-code' : ''}${isOpponent ? ' is-duel-opponent' : ''}`}
                disabled={answered}
                onClick={() => onSelect(option.iso)}
                animate={answerMotion(reduceMotion, answered && isSelected && !isCorrectOption, answered && isCorrectOption)}
                whileHover={!answered && !reduceMotion ? { scale: 1.03 } : undefined}
                whileTap={!answered ? press : undefined}
                transition={{ duration: 0.42 }}
              >
                {hotkeyN(option.iso) > 0 ? <AnswerKey n={hotkeyN(option.iso)} label={t.answerKey(hotkeyN(option.iso))} /> : null}
                {activeMode === 'nameToFlag' ? (
                  <>
                    <Flag iso={option.iso} name={name} size="option" />
                    {answered && <span className="option-caption">{name}</span>}
                  </>
                ) : activeMode === 'nameToSilhouette' ? (
                  <>
                    <QuizSilhouette iso={option.iso} size="option" eraYear={eraYear} />
                    {answered && <span className="option-caption">{name}</span>}
                  </>
                ) : activeMode === 'nameToShape' ? (
                  <>
                    {isMathMode(activeMode) && mathItemFromCountry(option, activeMode).shape ? (
                      <MathShape id={mathItemFromCountry(option, activeMode).shape!} size={52} />
                    ) : null}
                    {answered && <span className="option-caption">{optionLabel(option, activeMode, lang, question)}</span>}
                  </>
                ) : isFootballTeamChoice(activeMode) || activeMode === 'playerToNation' || activeMode === 'playerToClub' ? (
                  <span className="option-team">
                    <TeamFlag iso={option.iso} name={name} size="thumb" />
                    <FitText minPx={8}>{optionLabel(option, activeMode, lang, question)}</FitText>
                  </span>
                ) : (
                  <ChoiceLabel>{optionLabel(option, activeMode, lang, question)}</ChoiceLabel>
                )}
                {answered && isCorrectOption ? <span className="option-check" aria-hidden="true">✓</span> : null}
              </motion.button>
            )
          })}
        </div>
      )}
      </motion.div>

      {power?.enabled && !duel ? (
        <div className="quiz-power">
          <button
            type="button"
            className="btn-ghost"
            disabled={answered || !power.hintReady || empire.coins < price('hint')}
            onClick={power.onHint}
          >
            {t.quizHint} · {priceLabel('hint')}
          </button>
          <button
            type="button"
            className="btn-ghost"
            disabled={answered || empire.coins < price('skip')}
            onClick={power.onSkip}
          >
            {t.quizSkip} · {priceLabel('skip')}
          </button>
          <button
            type="button"
            className="btn-ghost"
            disabled={answered || power.extraLifeUsed || empire.coins < price('life')}
            onClick={power.onLife}
          >
            {t.quizExtraLife} · {priceLabel('life')}
          </button>
        </div>
      ) : null}

      {practice && answered && onNext && (
        <button type="button" className="btn-primary" onClick={onNext}>
          {index >= total - 1 ? t.seeResults : t.next}
        </button>
      )}
    </div>
  )
}
