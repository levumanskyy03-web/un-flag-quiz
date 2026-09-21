import { STRINGS } from '../i18n/strings'
import { eraFitsMode } from '../lib/quiz'
import type { QuizSettings } from './HomeScreen'

export function geoOpts(settings: Pick<QuizSettings, 'includeExtras' | 'includeEraStates' | 'eraYear'>) {
  return {
    includeExtras: settings.includeExtras,
    includeEraStates: settings.includeEraStates,
    eraYear: settings.eraYear,
  }
}

export function ExtrasToggle({
  settings,
  onChange,
  onEraChange,
}: {
  settings: QuizSettings
  onChange: (includeExtras: boolean) => void
  onEraChange?: (includeEraStates: boolean) => void
}) {
  const t = STRINGS[settings.lang]
  const showEra = Boolean(onEraChange) && (settings.mix ? true : eraFitsMode(settings.mode))
  return (
    <>
      <div className="choice-wrap extras-toggle-row">
        <button
          type="button"
          className={`extras-toggle ${settings.includeExtras ? 'is-active' : ''}`}
          aria-pressed={settings.includeExtras}
          onClick={() => onChange(!settings.includeExtras)}
        >
          <span className="region-dot" aria-hidden />
          {t.includeExtras}
        </button>
      </div>
      <p className="setting-hint extras-hint">{t.includeExtrasHint}</p>
      {showEra ? (
        <>
          <div className="choice-wrap extras-toggle-row">
            <button
              type="button"
              className={`extras-toggle ${settings.includeEraStates ? 'is-active' : ''}`}
              aria-pressed={settings.includeEraStates}
              onClick={() => onEraChange?.(!settings.includeEraStates)}
            >
              <span className="region-dot" aria-hidden />
              {t.includeEraStates}
            </button>
          </div>
          <p className="setting-hint extras-hint">{t.includeEraStatesHint}</p>
        </>
      ) : null}
    </>
  )
}
