import { useEffect, useState } from 'react'
import { type Region } from '../data/countries'
import { findCountry } from '../data/extras'
import { isFinalLevel } from '../data/levels'
import { difficultyLabel, drivingLabel, governmentLabel, REGIONS, STRINGS, modeLabel, regionLabel } from '../i18n/strings'
import {
  QUIZ_MODES,
  LEVEL_MODES,
  FOOTBALL_MODES,
  EASY_FOOTBALL_MIX_MODES,
  HARD_FOOTBALL_MIX_MODES,
  codePromptLabel,
  countryName,
  footballLearnCountries,
  footballLearnYears,
  footballTopicOf,
  getLearnPool,
  hasGeoFinale,
  isCodesMode,
  isFootballMode,
  isLeadersMode,
  isMathMode,
  isAstroMode,
  isThemeMode,
  themeById,
  themeWorldOf,
  MATH_MODES,
  ASTRO_MODES,
  THEME_MODES,
  isLeaderNumberPrompt,
  isLeaderPhotoMode,
  leaderKindOf,
  LEADERS_DIFFICULTIES,
  isFootballRosterMode,
  isManagerFootballMode,
  isNameToGov,
  isLanguageMode,
  isDrivingMode,
  isSilhouetteMode,
  isPlayerFactsToName,
  isPlayerFootballMode,
  isPlayerPhotoMode,
  isRankingMode,
  isRegionSelected,
  isWaterMapMode,
  isWaterMode,
  modesForFootballMix,
  sortCountriesByName,
  toggleRegion,
  waterName,
} from '../lib/quiz'
import { footballLevelYears } from '../data/footballLevels'
import { greatClub } from '../data/footballGreatClubs'
import { playerById } from '../data/footballPlayers'
import { PlayerCardModal } from './PlayerCardModal'
import { PlayerCatalogNo } from './PlayerCatalogNo'
import { playerClueSequence, playerFactLabel } from '../lib/playerFacts'
import { languageName, quizLanguageId } from '../data/languages'
import { govKindOf } from '../data/governments'
import { drivingSide } from '../data/driving'
import { watersFor } from '../data/water'
import { formatLeaderNumbers, formatTermNumber, leaderShowsNumber, personYearsLabel, splitLearnTerms, termById, yearsLabel } from '../data/leaders'
import { leaderBio, leaderFeat } from '../data/leaderBios'
import { getPassport } from '../data/passports'
import { formatRankingValue, rankingCount, rankingPlaceOf } from '../data/rankings'
import type { QuizSettings } from './HomeScreen'
import { ExtrasToggle } from './ExtrasToggle'
import { HubNav, WORLD_HUB_TABS, MATH_HUB_TABS, ASTRO_HUB_TABS, type HubTab } from './HubNav'
import { GeoModeGrids } from './GeoModeGrids'
import { Flag, TeamFlag } from './Flag'
import { QuizSilhouette } from './QuizSilhouette'
import { FootballLearnTable } from './FootballLearnTable'
import { FootballModeGrids, FootballSetup } from './FootballModeGrids'
import { ClubCardModal, GreatClubsAtlas } from './GreatClubsAtlas'
import { FitText } from './FitText'
import { ModeChoice } from './ModeChoice'
import { LeaderPortrait } from './LeaderPortrait'
import { LeaderBioModal } from './LeaderBioModal'
import { LeaderNoteMark } from './LeaderNoteMark'
import { LeadersLearnTable } from './LeadersLearnTable'
import { LeadersSetup } from './LeadersScreen'
import { MathLearnTable } from './MathLearnTable'
import { AstroLearnTable } from './AstroLearnTable'
import { ThemeLearnTable } from './ThemeLearnTable'
import { MathSetup } from './MathModeGrids'
import { AstroSetup } from './AstroModeGrids'
import { ThemeSetup } from './ThemeModeGrids'
import { PassportModal } from './PassportModal'
import { WorldsBack } from './WorldsBack'
import { EmpireLock } from './EmpireLock'
import { useEmpire } from '../lib/empireStore'
import { LEARN_FREE_ROWS, access } from '../lib/empire/gates'
import { worldOfMode } from '../lib/quiz'
import { prefetchWikiPortraits, type PortraitRequest } from '../lib/wikiThumb'
import { portraitFileForTerm } from '../data/leaderPortraitFiles'
import { erasForKind, leaderEraOf, type LeaderEraId } from '../data/leaderEras'

interface LearnScreenProps {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  onBack: () => void
  onHub: (tab: HubTab) => void
  onPractice: (isos?: string[]) => void
  onWorlds: () => void
}

export function LearnScreen({ settings, onChange, onBack, onHub, onPractice, onWorlds }: LearnScreenProps) {
  const t = STRINGS[settings.lang]
  const football = isFootballMode(settings.mode)
  const mixModes = football && settings.mix ? modesForFootballMix(settings.mix, settings.mixModes) : null
  const leaders = isLeadersMode(settings.mode)
  const math = isMathMode(settings.mode)
  const astro = isAstroMode(settings.mode)
  const theme = isThemeMode(settings.mode)
  const themeWorld = isThemeMode(settings.mode) ? themeWorldOf(settings.mode) : 'biology'
  const pool = getLearnPool(
    settings.learnFrom,
    settings.region,
    settings.level,
    settings.mode,
    settings.includeExtras,
  )
  const modes = football
    ? FOOTBALL_MODES
    : math
      ? MATH_MODES
    : astro
      ? ASTRO_MODES
    : theme
      ? THEME_MODES
    : settings.learnFrom === 'level'
      ? LEVEL_MODES
      : QUIZ_MODES
  const regions: Array<Region | 'all'> = ['all', ...REGIONS]
  const [openIso, setOpenIso] = useState<string | null>(null)
  const [openTermId, setOpenTermId] = useState<string | null>(null)
  const [openPlayerId, setOpenPlayerId] = useState<string | null>(null)
  const [openClubId, setOpenClubId] = useState<string | null>(null)
  const [playerEra, setPlayerEra] = useState<'all' | 'active' | 'legend'>('all')
  const [leaderEra, setLeaderEra] = useState<'all' | LeaderEraId>('all')
  const [leaderTier, setLeaderTier] = useState<'all' | (typeof LEADERS_DIFFICULTIES)[number]>('all')
  const [hideAnswers, setHideAnswers] = useState(false)
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set())
  const leaderKind = leaders ? leaderKindOf(settings.mode) : null
  const rosterLearn = isFootballRosterMode(settings.mode) && !mixModes
  const empire = useEmpire()
  const learnWorld = worldOfMode(settings.mode)
  // Learn закрыт выше первых строк (docs/economy.md 4.8); уровни кампании (learnFrom === 'level') не режем.
  const learnLocked = settings.learnFrom !== 'level' && access(empire, { kind: 'learn', world: learnWorld }) === 'locked'
  const allCountries = (settings.learnFrom === 'level' || football || leaders || math || astro || theme
    ? pool
    : sortCountriesByName(pool, settings.lang)
  ).filter((country) => {
    if (rosterLearn && playerEra !== 'all') return playerById(country.iso)?.era === playerEra
    if (!leaders || settings.learnFrom === 'level') return true
    const term = termById(country.iso)
    if (!term) return false
    if (leaderEra !== 'all' && leaderEraOf(term) !== leaderEra) return false
    if (leaderTier !== 'all' && term.tier !== leaderTier) return false
    return true
  })
  const learnClamped = learnLocked && allCountries.length > LEARN_FREE_ROWS
  const countries = learnClamped ? allCountries.slice(0, LEARN_FREE_ROWS) : allCountries
  const rosterActive = rosterLearn
    ? pool.filter((country) => playerById(country.iso)?.era === 'active').length
    : 0
  const rosterLegends = rosterLearn
    ? pool.filter((country) => playerById(country.iso)?.era === 'legend').length
    : 0
  const openCountry = openIso ? findCountry(openIso) : undefined
  const openTerm = openTermId ? termById(openTermId) : undefined
  const openPlayer = openPlayerId ? playerById(openPlayerId) : undefined
  const openClub = openClubId ? greatClub(openClubId) : undefined
  const geoFinale = settings.learnFrom === 'level' && isFinalLevel(settings.level) && hasGeoFinale(settings.mode)
  const title = settings.learnFrom === 'level' ? (geoFinale ? t.finalLevel : t.levelLabel(settings.level)) : t.learn
  const subtitle =
    settings.learnFrom === 'level'
      ? geoFinale
        ? t.finalLevelHint
        : undefined
        : football
          ? t.footballLearnHint
          : leaders
            ? t.leadersSubtitle
            : math
              ? t.mathSubtitle
              : astro
                ? t.astroSubtitle
              : theme
                ? themeWorld === 'olympics'
                  ? t.olySubtitle
                  : themeWorld === 'cs'
                    ? t.csSubtitle
                    : themeWorld === 'food'
                      ? t.foodSubtitle
                      : t.bioSubtitle
            : regionLabel(settings.region, settings.lang)
  const hubTabs = math ? MATH_HUB_TABS : astro || theme ? ASTRO_HUB_TABS : football || leaders ? WORLD_HUB_TABS : undefined

  useEffect(() => {
    const pool = getLearnPool(
      settings.learnFrom,
      settings.region,
      settings.level,
      settings.mode,
      settings.includeExtras,
    )
    const titles: Array<string | PortraitRequest> = []
    if (isLeadersMode(settings.mode)) {
      for (const country of pool) {
        const term = termById(country.iso)
        if (term) titles.push({ title: term.wiki, file: portraitFileForTerm(term.id) })
      }
    }
    const mix = settings.mix && isFootballMode(settings.mode) ? modesForFootballMix(settings.mix, settings.mixModes) : null
    const playerPhoto =
      isPlayerPhotoMode(settings.mode) ||
      isPlayerFactsToName(settings.mode) ||
      Boolean(mix?.some((mode) => isPlayerPhotoMode(mode) || isPlayerFactsToName(mode)))
    if (playerPhoto) {
      for (const country of pool) {
        const player = playerById(country.iso)
        if (player?.wiki) titles.push({ title: player.wiki, file: player.wikiFile })
      }
    }
    if (isThemeMode(settings.mode)) {
      for (const country of pool) {
        const item = themeById(country.iso)
        if (item?.wiki) titles.push({ title: item.wiki, file: item.wikiFile })
      }
    }
    prefetchWikiPortraits(titles.slice(0, 24))
  }, [
    settings.mode,
    settings.mix,
    settings.mixModes,
    settings.learnFrom,
    settings.level,
    settings.region,
    settings.includeExtras,
  ])

  useEffect(() => {
    setLeaderEra('all')
    setLeaderTier('all')
    setRevealed(new Set())
  }, [settings.mode, settings.learnFrom, settings.level])

  return (
    <div className="screen learn-screen">
      {settings.learnFrom === 'level' ? (
        <WorldsBack lang={settings.lang} onClick={onBack} label={t.back} />
      ) : (
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
      )}
      <header className={`quiz-header${settings.learnFrom === 'level' ? '' : ' is-hub'}`}>
        {settings.learnFrom === 'level' ? (
          <button type="button" className="btn-ghost" onClick={onWorlds}>
            {t.worldsBack}
          </button>
        ) : (
          <HubNav lang={settings.lang} active="learn" tabs={hubTabs ? [...hubTabs] : undefined} onSelect={onHub} />
        )}
        {settings.learnFrom === 'level' ? <h1 className="levels-title">{title}</h1> : null}
      </header>

      <p className="learn-copy">
        {subtitle ? `${subtitle}` : ''}
        {mixModes
          ? ''
          : rosterLearn
            ? `${subtitle ? ' · ' : ''}${
                playerEra === 'all'
                  ? t.footballRosterSplit(rosterActive, rosterLegends)
                  : t.footballRosterCount(countries.length)
              }`
            : `${subtitle ? ' · ' : ''}${t.countriesCount(countries.length)}`}
      </p>

      {settings.learnFrom === 'region' && !football && !leaders && !math && !astro && (
        <div className="choice-wrap">
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              className={`chip ${isRegionSelected(settings.region, region) ? 'is-active' : ''}`}
              aria-pressed={isRegionSelected(settings.region, region)}
              onClick={() =>
                onChange({
                  ...settings,
                  region: toggleRegion(settings.region, region),
                })
              }
            >
              {regionLabel(region, settings.lang)}
            </button>
          ))}
        </div>
      )}

      {settings.learnFrom === 'region' && !football && !leaders && !math && !astro && !theme ? (
        <ExtrasToggle
          settings={settings}
          onChange={(includeExtras) => onChange({ ...settings, includeExtras })}
        />
      ) : null}

      {leaders ? (
        <>
          <LeadersSetup settings={settings} onChange={onChange} />
          {settings.learnFrom === 'region' && leaderKind ? (
            <div className="choice-wrap">
              <button
                type="button"
                className={`chip ${leaderEra === 'all' ? 'is-active' : ''}`}
                aria-pressed={leaderEra === 'all'}
                onClick={() => setLeaderEra('all')}
              >
                {t.playerLearnAll}
              </button>
              {erasForKind(leaderKind).map((era) => (
                <button
                  key={era}
                  type="button"
                  className={`chip ${leaderEra === era ? 'is-active' : ''}`}
                  aria-pressed={leaderEra === era}
                  onClick={() => setLeaderEra(era)}
                >
                  {t[eraKey(era)]}
                </button>
              ))}
            </div>
          ) : null}
          {settings.learnFrom === 'region' ? (
            <div className="choice-wrap">
              {LEADERS_DIFFICULTIES.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  className={`chip ${leaderTier === tier ? 'is-active' : ''}`}
                  aria-pressed={leaderTier === tier}
                  onClick={() => setLeaderTier((current) => (current === tier ? 'all' : tier))}
                >
                  {difficultyLabel(tier, settings.lang)}
                </button>
              ))}
            </div>
          ) : null}
          <div className="choice-wrap">
            <button
              type="button"
              className={`chip ${hideAnswers ? 'is-active' : ''}`}
              aria-pressed={hideAnswers}
              onClick={() => {
                setHideAnswers((on) => !on)
                setRevealed(new Set())
              }}
            >
              {t.leaderHideNames}
            </button>
          </div>
        </>
      ) : football ? (
        <>
          {settings.learnFrom === 'region' ? (
            <div className="choice-grid">
              <button
                type="button"
                className={`choice has-note is-wide ${settings.mix === 'easy' ? 'is-active' : ''}`}
                aria-pressed={settings.mix === 'easy'}
                onClick={() => onChange({ ...settings, mix: 'easy', mixModes: [...EASY_FOOTBALL_MIX_MODES], mode: 'wcWinners' })}
              >
                <FitText minPx={9}>{t.easyMix}</FitText>
                <FitText className="choice-note" wrap minPx={7}>
                  {t.footballEasyMixNote}
                </FitText>
              </button>
              <button
                type="button"
                className={`choice has-note is-wide ${settings.mix === 'hard' ? 'is-active' : ''}`}
                aria-pressed={settings.mix === 'hard'}
                onClick={() => onChange({ ...settings, mix: 'hard', mixModes: [...HARD_FOOTBALL_MIX_MODES], mode: 'wcWinners' })}
              >
                <FitText minPx={9}>{t.hardMix}</FitText>
                <FitText className="choice-note" wrap minPx={7}>
                  {t.footballHardMixNote}
                </FitText>
              </button>
              <button
                type="button"
                className={`choice has-note is-wide ${settings.mix === 'custom' ? 'is-active' : ''}`}
                aria-pressed={settings.mix === 'custom'}
                onClick={() =>
                  onChange({
                    ...settings,
                    mix: 'custom',
                    mixModes: settings.mixModes.length > 0 ? settings.mixModes : [...EASY_FOOTBALL_MIX_MODES],
                    mode: (settings.mixModes[0] ?? 'wcWinners') as typeof settings.mode,
                  })
                }
              >
                <FitText minPx={9}>{t.customMix}</FitText>
                <FitText className="choice-note" wrap minPx={7}>
                  {t.customMixNote}
                </FitText>
              </button>
            </div>
          ) : null}
          {mixModes ? (
            <FootballModeGrids
              lang={settings.lang}
              activeMode={settings.mode}
              mix
              selectedModes={mixModes}
              hideModes={settings.mix === 'custom' ? ['playerFactsToName'] : undefined}
              onPick={(mode) => {
                if (settings.mix === 'custom') {
                  const selected = settings.mixModes
                  const next = selected.includes(mode)
                    ? selected.filter((item) => item !== mode)
                    : [...selected, mode]
                  onChange({ ...settings, mix: 'custom', mixModes: next, mode: next[0] ?? mode })
                  return
                }
                onChange({ ...settings, mode, mix: null })
              }}
            />
          ) : (
            <FootballSetup settings={settings} onChange={(next) => onChange({ ...next, mix: null })} />
          )}
          {isPlayerFootballMode(settings.mode) && !mixModes ? (
            <p className="setting-hint">{t.playerClubNote}</p>
          ) : null}
          {football && !mixModes && footballTopicOf(settings.mode) === 'clubs' ? (
            <GreatClubsAtlas lang={settings.lang} />
          ) : null}
        </>
      ) : settings.learnFrom === 'level' ? (
        <div className="choice-grid is-modes">
          {modes.map((mode) => (
            <ModeChoice
              key={mode}
              label={modeLabel(mode, settings.lang)}
              mode={mode}
              active={settings.mode === mode}
              onClick={() => onChange({ ...settings, mode })}
            />
          ))}
        </div>
      ) : math ? (
        <MathSetup settings={settings} onChange={(next) => onChange({ ...next, mix: null })} />
      ) : astro ? (
        <AstroSetup settings={settings} onChange={(next) => onChange({ ...next, mix: null })} />
      ) : theme ? (
        <ThemeSetup world={themeWorld} settings={settings} onChange={(next) => onChange({ ...next, mix: null })} />
      ) : (
        <GeoModeGrids
          lang={settings.lang}
          activeMode={settings.mode}
          showRankings={false}
          onPick={(mode) => onChange({ ...settings, mode, mix: null })}
        />
      )}

      {rosterLearn ? (
        <div className="choice-wrap">
          {(
            [
              ['all', t.playerLearnAll],
              ['active', t.playerEraActive],
              ['legend', t.playerEraLegend],
            ] as const
          ).map(([era, label]) => (
            <button
              key={era}
              type="button"
              className={`chip ${playerEra === era ? 'is-active' : ''}`}
              aria-pressed={playerEra === era}
              onClick={() => setPlayerEra(era)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {football && mixModes ? (
        <div className="football-learn-mix">
          {mixModes.map((mode) => (
            <section key={mode} className="football-learn-mix-block">
              <h2>{modeLabel(mode, settings.lang)}</h2>
              {mode === 'wcTitleYears' || mode === 'euroTitleYears' ? (
                <div className="learn-grid">
                  {footballLearnCountries(mode).map((country) => {
                    const name = countryName(country, settings.lang)
                    const years = footballLearnYears(mode, country.iso)
                    return (
                      <div key={`${mode}:${country.iso}`} className="learn-card">
                        <TeamFlag iso={country.iso} name={name} size="card" />
                        <p className="learn-card-name">
                          <FitText>{name}</FitText>
                        </p>
                        {years.length > 0 ? <p className="learn-card-meta">{years.join(' · ')}</p> : null}
                      </div>
                    )
                  })}
                </div>
              ) : isPlayerFootballMode(mode) ? (
                <div className="learn-grid is-leaders">
                  {footballLearnCountries(mode).map((country) => (
                    <PlayerLearnCard
                      key={`${mode}:${country.iso}`}
                      iso={country.iso}
                      name={countryName(country, settings.lang)}
                      facts={isPlayerFactsToName(mode)}
                      lang={settings.lang}
                      onOpen={() => setOpenPlayerId(country.iso)}
                    />
                  ))}
                </div>
              ) : (
                <FootballLearnTable mode={mode} lang={settings.lang} />
              )}
            </section>
          ))}
        </div>
      ) : football && isFootballMode(settings.mode) && !isPlayerFootballMode(settings.mode) && !isManagerFootballMode(settings.mode) && settings.mode !== 'clubCrestToName' && settings.mode !== 'stadiumToClub' ? (
        <FootballLearnTable
          mode={settings.mode}
          lang={settings.lang}
          years={settings.learnFrom === 'level' ? footballLevelYears(settings.mode, settings.level) : undefined}
        />
      ) : math ? (
        <MathLearnTable isos={countries.map((country) => country.iso)} lang={settings.lang} hideAnswers={hideAnswers} />
      ) : astro ? (
        <AstroLearnTable isos={countries.map((country) => country.iso)} lang={settings.lang} hideAnswers={hideAnswers} />
      ) : theme ? (
        <ThemeLearnTable isos={countries.map((country) => country.iso)} lang={settings.lang} hideAnswers={hideAnswers} />
      ) : null}

      {learnClamped ? (
        <EmpireLock lang={settings.lang} feature={{ kind: 'learn', world: learnWorld }} title={t.gateLearn(LEARN_FREE_ROWS)} compact />
      ) : null}
      {mixModes ? null : leaders && !isLeaderPhotoMode(settings.mode) ? (
        <LeadersLearnTable
          countries={countries}
          lang={settings.lang}
          showNumber={isLeaderNumberPrompt(settings.mode)}
          hideNames={hideAnswers}
          revealed={revealed}
          onReveal={(id) => setRevealed((prev) => new Set(prev).add(id))}
          onOpen={setOpenTermId}
        />
      ) : mixModes ? null : (
      <section className={`learn-grid${leaders ? ' is-leaders' : ''}`}>
        {countries.map((country) => {
          const name = countryName(country, settings.lang)
          const waterId = isWaterMode(settings.mode) ? watersFor(country.iso, settings.mode)[0] : undefined
          const waterLabel = waterId ? waterName(waterId, settings.lang) : null
          const mapWater = isWaterMapMode(settings.mode)
          const rankingPlace =
            isRankingMode(settings.mode) ? rankingPlaceOf(settings.mode, country.iso) : null
          const rankingTotal = isRankingMode(settings.mode) ? rankingCount(settings.mode) : 0
          const rankingValue =
            isRankingMode(settings.mode) ? formatRankingValue(settings.mode, country.iso, settings.lang) : null
          const quizLang = isLanguageMode(settings.mode) ? quizLanguageId(country.iso) : null
          const govKind = isNameToGov(settings.mode) ? govKindOf(country.iso) : undefined
          const drive = isDrivingMode(settings.mode) ? drivingSide(country.iso) : null
          const term = leaders ? termById(country.iso) : undefined
          if (leaders && term) {
            const bio = leaderBio(term, settings.lang)
            const feat = leaderFeat(term, settings.lang)
            const perTerm = term.kind === 'us' && splitLearnTerms(term)
            const open = !hideAnswers || revealed.has(term.id)
            const hidePhotoExtras = hideAnswers && !open && isLeaderPhotoMode(settings.mode)
            return (
              <div key={country.iso} className={`learn-card is-leader${open ? '' : ' is-concealed'}`}>
                {leaderShowsNumber(term.kind) && !hidePhotoExtras ? (
                  <p className="leader-num">{perTerm ? formatTermNumber(term) : formatLeaderNumbers(term)}</p>
                ) : null}
                <button
                  type="button"
                  className="leader-card-open"
                  onClick={() => (open ? setOpenTermId(term.id) : setRevealed((prev) => new Set(prev).add(term.id)))}
                >
                  <LeaderPortrait name={name} wiki={term.wiki} file={portraitFileForTerm(term.id)} size="card" />
                  <p className="learn-card-name">
                    <FitText>{open ? name : t.leaderHiddenName}</FitText>
                  </p>
                </button>
                {hidePhotoExtras ? null : (
                  <p className="learn-card-meta">
                    {perTerm ? yearsLabel(term.from, term.to, t.present) : personYearsLabel(term, t.present)}
                  </p>
                )}
                {open ? <LeaderNoteMark term={term} lang={settings.lang} /> : null}
                {open && feat ? (
                  <p className="leader-feat">
                    <span className="leader-feat-label">{t.leaderFeat}</span>
                    {feat}
                  </p>
                ) : null}
                {open && bio ? <p className="learn-card-bio">{bio}</p> : null}
              </div>
            )
          }
          if (isPlayerFootballMode(settings.mode)) {
            return (
              <PlayerLearnCard
                key={country.iso}
                iso={country.iso}
                name={name}
                facts={isPlayerFactsToName(settings.mode)}
                lang={settings.lang}
                onOpen={() => setOpenPlayerId(country.iso)}
              />
            )
          }
          if (isFootballMode(settings.mode)) {
            const years = footballLearnYears(
              settings.mode,
              country.iso,
              settings.learnFrom === 'level' ? footballLevelYears(settings.mode, settings.level) : undefined,
            )
            return (
              <div key={country.iso} className="learn-card">
                <TeamFlag iso={country.iso} name={name} size="card" />
                <p className="learn-card-name">
                  <FitText>{name}</FitText>
                </p>
                {years.length > 0 ? <p className="learn-card-meta">{years.join(' · ')}</p> : null}
              </div>
            )
          }
          return (
            <button
              key={waterId ? `${settings.mode}:${waterId}` : country.iso}
              type="button"
              className="learn-card is-passport"
              onClick={() => {
                if (getPassport(country.iso)) setOpenIso(country.iso)
              }}
            >
              {isSilhouetteMode(settings.mode) ? (
                <QuizSilhouette iso={country.iso} size="thumb" />
              ) : (
                <Flag iso={country.iso} name={name} size="card" />
              )}
              <p className="learn-card-name">
                <FitText>{mapWater && waterLabel ? waterLabel : name}</FitText>
              </p>
              {mapWater ? (
                <p className="learn-card-meta">{name}</p>
              ) : waterLabel ? (
                <p className="learn-card-meta">{waterLabel}</p>
              ) : rankingPlace !== null ? (
                <p className="learn-card-meta">
                  {t.rankingPlace(rankingPlace, rankingTotal)}
                  {rankingValue ? ` · ${rankingValue}` : ''}
                </p>
              ) : isCodesMode(settings.mode) ? (
                <p className="learn-card-meta is-code">{codePromptLabel(country, settings.mode)}</p>
              ) : quizLang ? (
                <p className="learn-card-meta">{languageName(quizLang, settings.lang)}</p>
              ) : govKind ? (
                <p className="learn-card-meta">{governmentLabel(govKind, settings.lang)}</p>
              ) : drive ? (
                <p className="learn-card-meta">{drivingLabel(drive, settings.lang)}</p>
              ) : null}
            </button>
          )
        })}
      </section>
      )}

      <button
        type="button"
        className="btn-primary"
        disabled={countries.length === 0 && !mixModes}
        onClick={() => onPractice(leaders ? countries.map((country) => country.iso) : undefined)}
      >
        {t.checkYourself}
      </button>

      {openCountry && (
        <PassportModal
          key={openCountry.iso}
          country={openCountry}
          lang={settings.lang}
          onClose={() => setOpenIso(null)}
          onOpenCountry={setOpenIso}
        />
      )}
      {openTerm && (
        <LeaderBioModal
          key={openTerm.id}
          term={openTerm}
          lang={settings.lang}
          onClose={() => setOpenTermId(null)}
        />
      )}
      {openPlayer && (
        <PlayerCardModal
          key={openPlayer.id}
          player={openPlayer}
          lang={settings.lang}
          onClose={() => setOpenPlayerId(null)}
          onOpenClub={(clubId) => {
            setOpenPlayerId(null)
            setOpenClubId(clubId)
          }}
        />
      )}
      {openClub && (
        <ClubCardModal
          key={openClub.id}
          clubId={openClub.id}
          founded={openClub.founded}
          lang={settings.lang}
          onClose={() => setOpenClubId(null)}
          onOpenClub={setOpenClubId}
        />
      )}
    </div>
  )
}

function PlayerLearnCard({
  iso,
  name,
  facts,
  lang,
  onOpen,
}: {
  iso: string
  name: string
  facts: boolean
  lang: QuizSettings['lang']
  onOpen?: () => void
}) {
  const player = playerById(iso)
  const clues = facts && player ? playerClueSequence(player.id, 4) : []
  return (
    <button type="button" className="learn-card is-leader" onClick={onOpen}>
      {player ? (
        <span className="player-portrait-wrap">
          <PlayerCatalogNo id={player.id} onPhoto />
          <LeaderPortrait name={name} wiki={player.wiki} file={player.wikiFile} flagIso={player.nation} size="card" />
        </span>
      ) : null}
      <p className="learn-card-name">
        <FitText>{name}</FitText>
      </p>
      {clues.length > 0 ? (
        <p className="learn-card-bio">{clues.map((clue) => playerFactLabel(clue, lang)).join(' · ')}</p>
      ) : null}
    </button>
  )
}

function eraKey(era: LeaderEraId):
  | 'leaderEraUsEarly'
  | 'leaderEraUs1800s'
  | 'leaderEraUsModern'
  | 'leaderEraPopeEarly'
  | 'leaderEraPopeMedieval'
  | 'leaderEraPopeModern'
  | 'leaderEraRusKiev'
  | 'leaderEraRusMoscow'
  | 'leaderEraRusEmpire'
  | 'leaderEraRusSoviet'
  | 'leaderEraUkMedieval'
  | 'leaderEraUkTudor'
  | 'leaderEraUkModern' {
  if (era === 'usEarly') return 'leaderEraUsEarly'
  if (era === 'us1800s') return 'leaderEraUs1800s'
  if (era === 'usModern') return 'leaderEraUsModern'
  if (era === 'popeEarly') return 'leaderEraPopeEarly'
  if (era === 'popeMedieval') return 'leaderEraPopeMedieval'
  if (era === 'popeModern') return 'leaderEraPopeModern'
  if (era === 'rusKiev') return 'leaderEraRusKiev'
  if (era === 'rusMoscow') return 'leaderEraRusMoscow'
  if (era === 'rusEmpire') return 'leaderEraRusEmpire'
  if (era === 'rusSoviet') return 'leaderEraRusSoviet'
  if (era === 'ukMedieval') return 'leaderEraUkMedieval'
  if (era === 'ukTudor') return 'leaderEraUkTudor'
  return 'leaderEraUkModern'
}
