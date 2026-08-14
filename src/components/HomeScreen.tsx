import type { Difficulty } from '../data/countries'
import { REGIONS, STRINGS, difficultyLabel, modeLabel, regionLabel, type Lang } from '../i18n/strings'
import { getPool, type QuizMode, type RegionFilter } from '../lib/quiz'
import { LanguageToggle } from './LanguageToggle'

export interface QuizSettings {
  lang: Lang
  mode: QuizMode
  region: RegionFilter
  difficulty: Difficulty
}

interface HomeScreenProps {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  onStart: () => void
}

export function HomeScreen({ settings, onChange, onStart }: HomeScreenProps) {
  const t = STRINGS[settings.lang]
  const poolSize = getPool(settings.region, settings.difficulty).length
  const regions: RegionFilter[] = ['all', ...REGIONS]
  const modes: QuizMode[] = ['flagToName', 'nameToFlag']
  const difficulties: Difficulty[] = ['easy', 'hard']

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <LanguageToggle
          lang={settings.lang}
          onChange={(lang) => onChange({ ...settings, lang })}
        />
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </header>

      <section className="card settings-card">
        <h2>{t.mode}</h2>
        <div className="choice-grid">
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

        <h2>{t.region}</h2>
        <div className="choice-wrap">
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              className={`chip ${settings.region === region ? 'is-active' : ''}`}
              aria-pressed={settings.region === region}
              onClick={() => onChange({ ...settings, region })}
            >
              {regionLabel(region, settings.lang)}
            </button>
          ))}
        </div>

        <h2>{t.difficulty}</h2>
        <div className="choice-grid">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              className={`choice ${settings.difficulty === difficulty ? 'is-active' : ''}`}
              aria-pressed={settings.difficulty === difficulty}
              onClick={() => onChange({ ...settings, difficulty })}
            >
              {difficultyLabel(difficulty, settings.lang)}
            </button>
          ))}
        </div>
      </section>

      <p className="pool-meta">{t.poolCount(poolSize)}</p>

      <button type="button" className="btn-primary" disabled={poolSize === 0} onClick={onStart}>
        {t.start}
      </button>
    </div>
  )
}
