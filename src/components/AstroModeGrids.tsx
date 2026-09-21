import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { ModeChoice } from './ModeChoice'
import type { QuizSettings } from './HomeScreen'
import {
  ASTRO_TOPICS,
  astroModesOf,
  astroTopicOf,
  isAstroMode,
  type AstroTopic,
  type QuizMode,
} from '../lib/quiz'

interface AstroModeGridsProps {
  lang: Lang
  activeMode: QuizMode
  onPick: (mode: QuizMode) => void
  selectedModes?: readonly QuizMode[]
  mix?: boolean
  hideModes?: readonly QuizMode[]
}

export function isAstroCatalog(modes: readonly QuizMode[]): boolean {
  return modes.length > 0 && modes.every(isAstroMode)
}

function topicLabel(topic: AstroTopic, lang: Lang) {
  const t = STRINGS[lang]
  if (topic === 'planets') return t.astroFamilyPlanets
  if (topic === 'moons') return t.astroFamilyMoons
  if (topic === 'sky') return t.astroFamilySky
  return t.astroFamilyPeople
}

export function AstroSetup({
  settings,
  onChange,
  hideModes,
}: {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  hideModes?: readonly QuizMode[]
}) {
  const t = STRINGS[settings.lang]
  const hidden = new Set(hideModes ?? [])
  const topic = isAstroMode(settings.mode) ? astroTopicOf(settings.mode) : 'planets'

  function pickTopic(next: AstroTopic) {
    const modes = astroModesOf(next).filter((mode) => !hidden.has(mode))
    const mode = (modes as readonly string[]).includes(settings.mode) ? settings.mode : (modes[0] ?? 'planetToOrder')
    onChange({ ...settings, mix: null, mode })
  }

  return (
    <>
      <h2>{t.leaderTopic}</h2>
      <div className={`choice-grid ${ASTRO_TOPICS.filter((item) => astroModesOf(item).some((mode) => !hidden.has(mode))).length <= 2 ? 'is-modes' : 'is-4'}`}>
        {ASTRO_TOPICS.map((item) => {
          const modes = astroModesOf(item).filter((mode) => !hidden.has(mode))
          if (modes.length === 0) return null
          return (
            <ModeChoice
              key={item}
              label={topicLabel(item, settings.lang)}
              mode={modes[0]}
              active={!settings.mix && topic === item}
              onClick={() => pickTopic(item)}
            />
          )
        })}
      </div>
      <AstroModeGrids
        lang={settings.lang}
        activeMode={settings.mode}
        onPick={(mode) => onChange({ ...settings, mix: null, mode })}
        hideModes={hideModes}
      />
    </>
  )
}

export function AstroModeGrids({ lang, activeMode, onPick, selectedModes, mix, hideModes }: AstroModeGridsProps) {
  const hidden = new Set(hideModes ?? [])
  const selected = new Set(selectedModes ?? (mix ? [] : [activeMode]))

  return (
    <>
      {ASTRO_TOPICS.map((topic) => {
        const modes = astroModesOf(topic).filter((mode) => !hidden.has(mode))
        if (modes.length === 0) return null
        return (
          <div key={topic}>
            <h2>{topicLabel(topic, lang)}</h2>
            <div className="choice-grid is-modes">
              {modes.map((mode) => (
                <ModeChoice
                  key={mode}
                  label={modeLabel(mode, lang)}
                  mode={mode}
                  active={selected.has(mode)}
                  onClick={() => onPick(mode)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}
