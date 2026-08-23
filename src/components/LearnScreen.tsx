import { useState } from 'react'
import { COUNTRIES, type Region } from '../data/countries'
import { isFinalLevel } from '../data/levels'
import { REGIONS, STRINGS, modeLabel, regionLabel } from '../i18n/strings'
import {
  QUIZ_MODES,
  LEVEL_MODES,
  countryName,
  getLearnPool,
  isRegionSelected,
  sortCountriesByName,
  toggleRegion,
} from '../lib/quiz'
import type { QuizSettings } from './HomeScreen'
import { Flag } from './Flag'
import { LanguageToggle } from './LanguageToggle'
import { PassportModal } from './PassportModal'

interface LearnScreenProps {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  onBack: () => void
  onPractice: () => void
}

export function LearnScreen({ settings, onChange, onBack, onPractice }: LearnScreenProps) {
  const t = STRINGS[settings.lang]
  const pool = getLearnPool(settings.learnFrom, settings.region, settings.level, settings.mode)
  const countries =
    settings.learnFrom === 'level' ? pool : sortCountriesByName(pool, settings.lang)
  const modes = settings.learnFrom === 'level' ? LEVEL_MODES : QUIZ_MODES
  const regions: Array<Region | 'all'> = ['all', ...REGIONS]
  const [openIso, setOpenIso] = useState<string | null>(null)
  const openCountry = COUNTRIES.find((country) => country.iso === openIso)
  const title =
    settings.learnFrom === 'level'
      ? isFinalLevel(settings.level)
        ? t.finalLevel
        : t.levelLabel(settings.level)
      : t.learn
  const subtitle =
    settings.learnFrom === 'level'
      ? isFinalLevel(settings.level)
        ? t.finalLevelHint
        : undefined
      : regionLabel(settings.region, settings.lang)

  return (
    <div className="screen learn-screen">
      <header className="quiz-header">
        <button type="button" className="btn-ghost" onClick={onBack}>
          {t.back}
        </button>
        <h1 className="levels-title">{title}</h1>
        <LanguageToggle
          lang={settings.lang}
          onChange={(lang) => onChange({ ...settings, lang })}
        />
      </header>

      <p className="learn-copy">
        {subtitle ? `${subtitle} · ` : ''}
        {t.countriesCount(countries.length)}
      </p>

      {settings.learnFrom === 'region' && (
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

      <p className="learn-copy">{t.tapPassport}</p>

      <section className="learn-grid">
        {countries.map((country) => {
          const name = countryName(country, settings.lang)
          return (
            <button
              key={country.iso}
              type="button"
              className="learn-card is-passport"
              onClick={() => setOpenIso(country.iso)}
            >
              <Flag iso={country.iso} name={name} size="card" />
              <p className="learn-card-name">{name}</p>
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
