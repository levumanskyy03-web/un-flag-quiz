import { useState } from 'react'
import { type Region } from '../data/countries'
import { findCountry } from '../data/extras'
import { isFinalLevel } from '../data/levels'
import { REGIONS, STRINGS, modeLabel, regionLabel } from '../i18n/strings'
import {
  QUIZ_MODES,
  LEVEL_MODES,
  FOOTBALL_MODES,
  CODES_MODES,
  codePromptLabel,
  countryName,
  footballLearnCountries,
  footballLearnYears,
  getLearnPool,
  hasGeoFinale,
  isCodesMode,
  isFootballMode,
  isLeadersMode,
  isNameToLanguage,
  isPlayerFactsToName,
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
import { playerById } from '../data/footballPlayers'
import { playerClueSequence, playerFactLabel } from '../lib/playerFacts'
import { languageName, quizLanguageId } from '../data/languages'
import { watersFor } from '../data/water'
import { formatLeaderNumbers, leaderShowsNumber, personYearsLabel, termById } from '../data/leaders'
import { leaderBio } from '../data/leaderBios'
import { getPassport } from '../data/passports'
import { rankingCount, rankingPlaceOf } from '../data/rankings'
import type { QuizSettings } from './HomeScreen'
import { ExtrasToggle } from './HomeScreen'
import { HubNav, type HubTab } from './HubNav'
import { GeoModeGrids } from './GeoModeGrids'
import { Flag, TeamFlag } from './Flag'
import { FootballLearnTable } from './FootballLearnTable'
import { FootballModeGrids } from './FootballModeGrids'
import { FitText, ChoiceLabel } from './FitText'
import { LeaderPortrait } from './LeaderPortrait'
import { LeaderBioModal } from './LeaderBioModal'
import { LanguageToggle } from './LanguageToggle'
import { LeadersSetup } from './LeadersScreen'
import { PassportModal } from './PassportModal'
import { WorldsBack } from './WorldsBack'

interface LearnScreenProps {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  onBack: () => void
  onHub: (tab: HubTab) => void
  onPractice: () => void
  onWorlds: () => void
}

export function LearnScreen({ settings, onChange, onBack, onHub, onPractice, onWorlds }: LearnScreenProps) {
  const t = STRINGS[settings.lang]
  const football = isFootballMode(settings.mode)
  const mixModes = football && settings.mix ? modesForFootballMix(settings.mix) : null
  const codes = isCodesMode(settings.mode)
  const leaders = isLeadersMode(settings.mode)
  const pool = getLearnPool(
    settings.learnFrom,
    settings.region,
    settings.level,
    settings.mode,
    settings.includeExtras,
  )
  const countries =
    settings.learnFrom === 'level' || football || leaders ? pool : sortCountriesByName(pool, settings.lang)
  const modes = football
    ? FOOTBALL_MODES
    : codes
      ? CODES_MODES
      : settings.learnFrom === 'level'
        ? LEVEL_MODES
        : QUIZ_MODES
  const regions: Array<Region | 'all'> = ['all', ...REGIONS]
  const [openIso, setOpenIso] = useState<string | null>(null)
  const [openTermId, setOpenTermId] = useState<string | null>(null)
  const openCountry = openIso ? findCountry(openIso) : undefined
  const openTerm = openTermId ? termById(openTermId) : undefined
  const geoFinale = settings.learnFrom === 'level' && isFinalLevel(settings.level) && hasGeoFinale(settings.mode)
  const title = settings.learnFrom === 'level' ? (geoFinale ? t.finalLevel : t.levelLabel(settings.level)) : t.learn
  const subtitle =
    settings.learnFrom === 'level'
      ? geoFinale
        ? t.finalLevelHint
        : undefined
      : football
        ? t.footballLearnHint
        : codes
          ? t.codesSubtitle
          : leaders
            ? t.leadersSubtitle
            : regionLabel(settings.region, settings.lang)
  const hubTabs = football || leaders
    ? (['free', 'levels', 'learn', 'mistakes'] as const)
    : codes
      ? (['free', 'learn', 'mistakes'] as const)
      : undefined

  return (
    <div className="screen learn-screen">
      <WorldsBack lang={settings.lang} onClick={onWorlds} />
      <header className={`quiz-header${settings.learnFrom === 'level' ? '' : ' is-hub'}`}>
        {settings.learnFrom === 'level' ? (
          <button type="button" className="btn-ghost" onClick={onBack}>
            {t.back}
          </button>
        ) : (
          <HubNav lang={settings.lang} active="learn" tabs={hubTabs ? [...hubTabs] : undefined} onSelect={onHub} />
        )}
        {settings.learnFrom === 'level' ? <h1 className="levels-title">{title}</h1> : null}
        <LanguageToggle
          lang={settings.lang}
          onChange={(lang) => onChange({ ...settings, lang })}
        />
      </header>

      <p className="learn-copy">
        {subtitle ? `${subtitle}` : ''}
        {mixModes ? '' : `${subtitle ? ' · ' : ''}${t.countriesCount(countries.length)}`}
      </p>

      {settings.learnFrom === 'region' && !football && !codes && !leaders && (
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

      {settings.learnFrom === 'region' && !football && !leaders ? (
        <ExtrasToggle
          settings={settings}
          onChange={(includeExtras) => onChange({ ...settings, includeExtras })}
        />
      ) : null}

      {leaders ? (
        <LeadersSetup settings={settings} onChange={onChange} />
      ) : football ? (
        <>
          {settings.learnFrom === 'region' ? (
            <div className="choice-grid">
              <button
                type="button"
                className={`choice has-note is-wide ${settings.mix === 'easy' ? 'is-active' : ''}`}
                aria-pressed={settings.mix === 'easy'}
                onClick={() => onChange({ ...settings, mix: 'easy', mode: 'wcWinners' })}
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
                onClick={() => onChange({ ...settings, mix: 'hard', mode: 'wcWinners' })}
              >
                <FitText minPx={9}>{t.hardMix}</FitText>
                <FitText className="choice-note" wrap minPx={7}>
                  {t.footballHardMixNote}
                </FitText>
              </button>
            </div>
          ) : null}
          <FootballModeGrids
            lang={settings.lang}
            activeMode={settings.mode}
            mix={Boolean(mixModes)}
            selectedModes={mixModes ?? undefined}
            onPick={(mode) => onChange({ ...settings, mode, mix: null })}
          />
        </>
      ) : codes || settings.learnFrom === 'level' ? (
        <div className="choice-grid is-modes">
          {modes.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`choice ${settings.mode === mode ? 'is-active' : ''}`}
              aria-pressed={settings.mode === mode}
              onClick={() => onChange({ ...settings, mode })}
            >
              <ChoiceLabel>{modeLabel(mode, settings.lang)}</ChoiceLabel>
            </button>
          ))}
        </div>
      ) : (
        <GeoModeGrids
          lang={settings.lang}
          activeMode={settings.mode}
          onPick={(mode) => onChange({ ...settings, mode, mix: null })}
        />
      )}

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
              ) : isPlayerPhotoMode(mode) || isPlayerFactsToName(mode) ? (
                <div className="learn-grid is-leaders">
                  {footballLearnCountries(mode).map((country) => (
                    <PlayerLearnCard
                      key={`${mode}:${country.iso}`}
                      iso={country.iso}
                      name={countryName(country, settings.lang)}
                      facts={isPlayerFactsToName(mode)}
                      lang={settings.lang}
                    />
                  ))}
                </div>
              ) : (
                <FootballLearnTable mode={mode} lang={settings.lang} />
              )}
            </section>
          ))}
        </div>
      ) : football && isFootballMode(settings.mode) && !isPlayerPhotoMode(settings.mode) && !isPlayerFactsToName(settings.mode) ? (
        <FootballLearnTable
          mode={settings.mode}
          lang={settings.lang}
          years={settings.learnFrom === 'level' ? footballLevelYears(settings.mode, settings.level) : undefined}
        />
      ) : null}

      {mixModes ? null : (
      <section className={`learn-grid${leaders ? ' is-leaders' : ''}`}>
        {countries.map((country) => {
          const name = countryName(country, settings.lang)
          const waterId = isWaterMode(settings.mode) ? watersFor(country.iso, settings.mode)[0] : undefined
          const waterLabel = waterId ? waterName(waterId, settings.lang) : null
          const mapWater = isWaterMapMode(settings.mode)
          const rankingPlace =
            isRankingMode(settings.mode) ? rankingPlaceOf(settings.mode, country.iso) : null
          const rankingTotal = isRankingMode(settings.mode) ? rankingCount(settings.mode) : 0
          const quizLang = isNameToLanguage(settings.mode) ? quizLanguageId(country.iso) : null
          const term = leaders ? termById(country.iso) : undefined
          if (leaders && term) {
            const bio = leaderBio(term, settings.lang)
            return (
              <button
                key={country.iso}
                type="button"
                className="learn-card is-leader"
                onClick={() => setOpenTermId(term.id)}
              >
                {leaderShowsNumber(term.kind) ? <p className="leader-num">{formatLeaderNumbers(term)}</p> : null}
                <LeaderPortrait name={name} wiki={term.wiki} size="card" />
                <p className="learn-card-name">
                  <FitText>{name}</FitText>
                </p>
                <p className="learn-card-meta">{personYearsLabel(term, t.present)}</p>
                {bio ? <p className="learn-card-bio">{bio}</p> : null}
              </button>
            )
          }
          if (isPlayerPhotoMode(settings.mode) || isPlayerFactsToName(settings.mode)) {
            return (
              <PlayerLearnCard
                key={country.iso}
                iso={country.iso}
                name={name}
                facts={isPlayerFactsToName(settings.mode)}
                lang={settings.lang}
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
          if (codes) {
            return (
              <div key={country.iso} className="learn-card">
                <Flag iso={country.iso} name={name} size="card" />
                <p className="learn-card-name">
                  <FitText>{name}</FitText>
                </p>
                <p className="learn-card-meta is-code">{codePromptLabel(country, settings.mode)}</p>
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
              <Flag iso={country.iso} name={name} size="card" />
              <p className="learn-card-name">
                <FitText>{mapWater && waterLabel ? waterLabel : name}</FitText>
              </p>
              {mapWater ? (
                <p className="learn-card-meta">{name}</p>
              ) : waterLabel ? (
                <p className="learn-card-meta">{waterLabel}</p>
              ) : rankingPlace !== null ? (
                <p className="learn-card-meta">{t.rankingPlace(rankingPlace, rankingTotal)}</p>
              ) : quizLang ? (
                <p className="learn-card-meta">{languageName(quizLang, settings.lang)}</p>
              ) : null}
            </button>
          )
        })}
      </section>
      )}

      <button type="button" className="btn-primary" disabled={countries.length === 0 && !mixModes} onClick={onPractice}>
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
    </div>
  )
}

function PlayerLearnCard({
  iso,
  name,
  facts,
  lang,
}: {
  iso: string
  name: string
  facts: boolean
  lang: QuizSettings['lang']
}) {
  const player = playerById(iso)
  const clues = facts && player ? playerClueSequence(player.id, 4) : []
  return (
    <div className="learn-card is-leader">
      {player ? <LeaderPortrait name={name} wiki={player.wiki} size="card" /> : null}
      <p className="learn-card-name">
        <FitText>{name}</FitText>
      </p>
      {clues.length > 0 ? (
        <p className="learn-card-bio">{clues.map((clue) => playerFactLabel(clue, lang)).join(' · ')}</p>
      ) : null}
    </div>
  )
}
