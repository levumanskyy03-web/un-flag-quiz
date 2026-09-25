import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { modeCatalogNo } from '../lib/modeCatalog'
import { ModeChoice } from './ModeChoice'
import { FitGroup } from './FitText'
import type { QuizSettings } from './HomeScreen'
import {
  isThemeMode,
  themeModesOfTopic,
  themeTopicOf,
  themeTopicsOf,
  themeWorldOf,
  THEME_DEFAULT_MODE,
  type QuizMode,
  type ThemeTopic,
  type ThemeWorld,
} from '../lib/quiz'

interface ThemeModeGridsProps {
  world: ThemeWorld
  lang: Lang
  activeMode: QuizMode
  onPick: (mode: QuizMode) => void
  selectedModes?: readonly QuizMode[]
  mix?: boolean
  hideModes?: readonly QuizMode[]
}

export function isThemeCatalog(modes: readonly QuizMode[]): boolean {
  return modes.length > 0 && modes.every(isThemeMode)
}

export function themeCatalogWorld(modes: readonly QuizMode[]): ThemeWorld | null {
  if (!isThemeCatalog(modes) || !isThemeMode(modes[0])) return null
  return themeWorldOf(modes[0])
}

export function themeTopicLabel(topic: ThemeTopic, lang: Lang): string {
  const t = STRINGS[lang]
  if (topic === 'cell') return t.bioFamilyCell
  if (topic === 'body') return t.bioFamilyBody
  if (topic === 'life') return t.bioFamilyLife
  if (topic === 'hosts') return t.olyFamilyHosts
  if (topic === 'sports') return t.olyFamilySports
  if (topic === 'noc') return t.olyFamilyNoc
  if (topic === 'stars') return t.olyFamilyStars
  if (topic === 'code') return t.csFamilyCode
  if (topic === 'langs') return t.csFamilyLangs
  if (topic === 'structs') return t.csFamilyStructs
  if (topic === 'binary') return t.csFamilyBinary
  if (topic === 'hackers') return t.csFamilyPeople
  if (topic === 'dishes') return t.foodFamilyDishes
  if (topic === 'plates') return t.foodFamilyPlates
  return t.foodFamilyOrigin
}

export function ThemeSetup({
  world,
  settings,
  onChange,
  hideModes,
  onPickMode,
}: {
  world: ThemeWorld
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  hideModes?: readonly QuizMode[]
  onPickMode?: (mode: QuizMode) => void
}) {
  const t = STRINGS[settings.lang]
  const hidden = new Set(hideModes ?? [])
  const topics = themeTopicsOf(world)
  const topic = isThemeMode(settings.mode) ? themeTopicOf(settings.mode) : topics[0]

  function pickTopic(next: ThemeTopic) {
    const modes = themeModesOfTopic(next).filter((mode) => !hidden.has(mode))
    const mode = (modes as readonly string[]).includes(settings.mode) ? settings.mode : (modes[0] ?? THEME_DEFAULT_MODE[world])
    onChange({ ...settings, mix: null, mode })
  }

  return (
    <>
      <h2>{t.leaderTopic}</h2>
      <div className={`choice-grid ${topics.filter((item) => themeModesOfTopic(item).some((mode) => !hidden.has(mode))).length <= 2 ? 'is-modes' : 'is-4'}`}>
        {topics.map((item) => {
          const modes = themeModesOfTopic(item).filter((mode) => !hidden.has(mode))
          if (modes.length === 0) return null
          return (
          <ModeChoice
            key={item}
            label={themeTopicLabel(item, settings.lang)}
            no={modes[0] ? modeCatalogNo(modes[0]) : undefined}
            active={!settings.mix && topic === item}
            onClick={() => pickTopic(item)}
          />
          )
        })}
      </div>
      <ThemeModeGrids
        world={world}
        lang={settings.lang}
        activeMode={settings.mode}
        onPick={(mode) => {
          onChange({ ...settings, mix: null, mode })
          onPickMode?.(mode)
        }}
        hideModes={hideModes}
      />
    </>
  )
}

export function ThemeModeGrids({ world, lang, activeMode, onPick, selectedModes, mix, hideModes }: ThemeModeGridsProps) {
  const hidden = new Set(hideModes ?? [])
  const selected = new Set(selectedModes ?? (mix ? [] : [activeMode]))

  return (
    <>
      {themeTopicsOf(world).map((topic) => {
        const modes = themeModesOfTopic(topic).filter((mode) => !hidden.has(mode))
        if (modes.length === 0) return null
        return (
          <div key={topic}>
            <h2>{themeTopicLabel(topic, lang)}</h2>
            <div className="choice-grid is-modes">
              <FitGroup wrap minPx={8}>
                {modes.map((mode) => (
                <ModeChoice
                  key={mode}
                  label={modeLabel(mode, lang)}
                  mode={mode}
                  active={selected.has(mode)}
                  onClick={() => onPick(mode)}
                />
                ))}
              </FitGroup>
            </div>
          </div>
        )
      })}
    </>
  )
}
