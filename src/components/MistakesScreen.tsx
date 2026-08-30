import { findCountry } from '../data/extras'
import { termById, yearsLabel } from '../data/leaders'
import { footballTeamCountry } from '../data/worldCup'
import { STRINGS, modeLabel } from '../i18n/strings'
import { codePromptLabel, countryName, isCodesMode, isFootballMode, isLeadersMode, type QuizMode } from '../lib/quiz'
import { GeoModeGrids } from './GeoModeGrids'
import { geoMistakeCountries, type MistakeEntry } from '../lib/mistakes'
import type { QuizSettings } from './HomeScreen'
import { Flag, TeamFlag } from './Flag'
import { FitText } from './FitText'
import { LeaderPortrait } from './LeaderPortrait'
import { HubNav, type HubTab } from './HubNav'
import { LeadersSetup } from './LeadersScreen'
import { WorldsBack } from './WorldsBack'

interface MistakesScreenProps {
  settings: QuizSettings
  mistakes: MistakeEntry[]
  modes: readonly QuizMode[]
  tabs?: HubTab[]
  onChange: (settings: QuizSettings) => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onPractice: () => void
  onClear: () => void
}

export function MistakesScreen({
  settings,
  mistakes,
  modes,
  tabs,
  onChange,
  onHub,
  onWorlds,
  onPractice,
  onClear,
}: MistakesScreenProps) {
  const t = STRINGS[settings.lang]
  const football = isFootballMode(settings.mode)
  const codes = isCodesMode(settings.mode)
  const leaders = isLeadersMode(settings.mode)
  const byMode = football || codes || leaders
  const list = byMode ? mistakes.filter((item) => item.mode === settings.mode) : geoMistakeCountries(mistakes)
  const empty = list.length === 0
  const hubTabs = tabs ?? (football || leaders ? (['free', 'levels', 'learn', 'mistakes'] as HubTab[]) : undefined)

  return (
    <div className="screen mistakes-screen">
      <WorldsBack lang={settings.lang} onClick={onWorlds} />
      <header className="quiz-header is-hub">
        <HubNav lang={settings.lang} active="mistakes" tabs={hubTabs} onSelect={onHub} />
      </header>

      <p className="setting-hint">{t.mistakesHint}</p>

      {leaders ? (
        <LeadersSetup settings={settings} onChange={(next) => onChange({ ...next, path: 'mistakes', mix: null })} />
      ) : football || codes ? (
        <div className="choice-grid is-modes">
          {modes.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`choice ${settings.mode === mode ? 'is-active' : ''}`}
              aria-pressed={settings.mode === mode}
              onClick={() => onChange({ ...settings, mode, mix: null, path: 'mistakes' })}
            >
              {modeLabel(mode, settings.lang)}
            </button>
          ))}
        </div>
      ) : (
        <GeoModeGrids
          lang={settings.lang}
          activeMode={settings.mode}
          onPick={(mode) => onChange({ ...settings, mode, mix: null, path: 'mistakes' })}
        />
      )}

      {empty ? (
        <p className="setting-hint">{t.mistakesEmpty}</p>
      ) : (
        <>
          <p className="learn-copy">{t.countriesCount(list.length)}</p>
          <section className="learn-grid">
            {byMode
              ? (list as MistakeEntry[]).map((item) => {
                  const country = football ? footballTeamCountry(item.iso) : findCountry(item.iso)
                  const term = leaders ? termById(item.iso) : undefined
                  const name = term
                    ? settings.lang === 'ru'
                      ? term.ru
                      : term.en
                    : country
                      ? countryName(country, settings.lang)
                      : item.iso
                  const codeLabel = codes && country ? codePromptLabel(country, item.mode) : ''
                  return (
                    <div key={`${item.mode}:${item.iso}:${item.year ?? ''}`} className="learn-card">
                      {leaders && term ? (
                        <LeaderPortrait name={name} wiki={term.wiki} size="card" />
                      ) : football ? (
                        <TeamFlag iso={item.iso} name={name} size="card" />
                      ) : (
                        <Flag iso={item.iso} name={name} size="card" />
                      )}
                      <p className="learn-card-name">
                        <FitText>
                          {`${name}${
                            leaders && term
                              ? ` · ${yearsLabel(term.from, term.to, t.present)}`
                              : item.year
                                ? ` · ${item.year}`
                                : ''
                          }`}
                        </FitText>
                      </p>
                      {codeLabel ? <p className="learn-card-meta is-code">{codeLabel}</p> : null}
                    </div>
                  )
                })
              : (list as ReturnType<typeof geoMistakeCountries>).map((country) => {
                  const name = countryName(country, settings.lang)
                  return (
                    <div key={country.iso} className="learn-card">
                      <Flag iso={country.iso} name={name} size="card" />
                      <p className="learn-card-name">
                        <FitText>{name}</FitText>
                      </p>
                    </div>
                  )
                })}
          </section>
        </>
      )}

      <button type="button" className="btn-primary" disabled={empty} onClick={onPractice}>
        {t.checkYourself}
      </button>
      {!empty ? (
        <button type="button" className="btn-ghost" onClick={onClear}>
          {t.mistakesClear}
        </button>
      ) : null}
    </div>
  )
}
