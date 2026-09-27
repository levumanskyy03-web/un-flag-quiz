import { STRINGS } from '../i18n/strings'
import { HelpTip } from './HelpTip'
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
        <HelpTip text={t.includeExtrasHint} />
      </div>
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
            <HelpTip text={t.includeEraStatesHint} />
          </div>
        </>
      ) : null}
    </>
  )
}
