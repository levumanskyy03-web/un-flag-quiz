import { useState } from 'react'
import { COUNTRIES, type Region } from '../data/countries'
import { isFinalLevel } from '../data/levels'
import { REGIONS, STRINGS, modeLabel, regionLabel } from '../i18n/strings'
import {
  QUIZ_MODES,
  LEVEL_MODES,
  FOOTBALL_MODES,
  CODES_MODES,
  countryName,
  getLearnPool,
  hasGeoFinale,
  isCodesMode,
  isFootballMode,
  isLeadersMode,
  isNameToLanguage,
  isRankingMode,
  isRegionSelected,
  isWaterMapMode,
  isWaterMode,
  sortCountriesByName,
  toggleRegion,
  waterName,
} from '../lib/quiz'
import { languageName, quizLanguageId } from '../data/languages'
import { watersFor } from '../data/water'
import { termById, yearsLabel } from '../data/leaders'
import { collectStamp } from '../lib/stamps'
import { getPassport } from '../data/passports'
import { rankingCount, rankingPlaceOf } from '../data/rankings'
import type { QuizSettings } from './HomeScreen'
import { HubNav, type HubTab } from './HubNav'
import { GeoModeGrids } from './GeoModeGrids'
import { Flag } from './Flag'
import { FitText } from './FitText'
import { LeaderPortrait } from './LeaderPortrait'
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
  const codes = isCodesMode(settings.mode)
  const leaders = isLeadersMode(settings.mode)
  const pool = getLearnPool(settings.learnFrom, settings.region, settings.level, settings.mode)
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
  const openCountry = COUNTRIES.find((country) => country.iso === openIso)
  const geoFinale = settings.learnFrom === 'level' && isFinalLevel(settings.level) && hasGeoFinale(settings.mode)
  const title = settings.learnFrom === 'level' ? (geoFinale ? t.finalLevel : t.levelLabel(settings.level)) : t.learn
  const subtitle =
    settings.learnFrom === 'level'
      ? geoFinale
        ? t.finalLevelHint
        : undefined
      : football
        ? undefined
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
        {subtitle ? `${subtitle} · ` : ''}
        {t.countriesCount(countries.length)}
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

      {leaders ? (
        <LeadersSetup settings={settings} onChange={onChange} />
      ) : football || codes || settings.learnFrom === 'level' ? (
        <div className="choice-grid is-modes">
          {modes.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`choice ${settings.mode === mode ? 'is-active' : ''}`}
              aria-pressed={settings.mode === mode}
              onClick={() => onChange({ ...settings, mode })}
            >
              {modeLabel(mode, settings.lang)}
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

      <section className="learn-grid">
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
            return (
              <div key={country.iso} className="learn-card">
                <LeaderPortrait name={name} wiki={term.wiki} size="card" />
                <p className="learn-card-name">
                  <FitText>{name}</FitText>
                </p>
                <p className="learn-card-meta">{yearsLabel(term.from, term.to, t.present)}</p>
              </div>
            )
          }
          return (
            <button
              key={waterId ? `${settings.mode}:${waterId}` : country.iso}
              type="button"
              className="learn-card is-passport"
              onClick={() => {
                collectStamp(country.iso)
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

      <button type="button" className="btn-primary" disabled={countries.length === 0} onClick={onPractice}>
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
    </div>
  )
}
