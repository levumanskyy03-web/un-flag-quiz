import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { ModeChoice } from './ModeChoice'
import type { QuizSettings } from './HomeScreen'
import {
  MATH_TOPICS,
  isMathMode,
  mathModesOf,
  mathTopicOf,
  type MathTopic,
  type QuizMode,
} from '../lib/quiz'

interface MathModeGridsProps {
  lang: Lang
  activeMode: QuizMode
  onPick: (mode: QuizMode) => void
  selectedModes?: readonly QuizMode[]
  mix?: boolean
  hideModes?: readonly QuizMode[]
}

export function isMathCatalog(modes: readonly QuizMode[]): boolean {
  return modes.length > 0 && modes.every(isMathMode)
}

function topicLabel(topic: MathTopic, lang: Lang) {
  const t = STRINGS[lang]
  if (topic === 'arithmetic') return t.mathFamilyArithmetic
  if (topic === 'geometry') return t.mathFamilyGeometry
  if (topic === 'symbols') return t.mathFamilySymbols
  return t.mathFamilyPeople
}

export function MathSetup({
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
  const topic = isMathMode(settings.mode) ? mathTopicOf(settings.mode) : 'arithmetic'

  function pickTopic(next: MathTopic) {
    const modes = mathModesOf(next).filter((mode) => !hidden.has(mode))
    const mode = (modes as readonly string[]).includes(settings.mode) ? settings.mode : (modes[0] ?? 'exprToValue')
    onChange({ ...settings, mix: null, mode })
  }

  return (
    <>
      <h2>{t.leaderTopic}</h2>
      <div className={`choice-grid ${MATH_TOPICS.filter((item) => mathModesOf(item).some((mode) => !hidden.has(mode))).length <= 2 ? 'is-modes' : 'is-4'}`}>
        {MATH_TOPICS.map((item) => {
          const modes = mathModesOf(item).filter((mode) => !hidden.has(mode))
          if (modes.length === 0) return null
          return (
          <ModeChoice
            key={item}
            label={topicLabel(item, settings.lang)}
            active={!settings.mix && topic === item}
            onClick={() => pickTopic(item)}
          />
          )
        })}
      </div>
      <MathModeGrids
        lang={settings.lang}
        activeMode={settings.mode}
        onPick={(mode) => onChange({ ...settings, mix: null, mode })}
        hideModes={hideModes}
      />
    </>
  )
}

export function MathModeGrids({ lang, activeMode, onPick, selectedModes, mix, hideModes }: MathModeGridsProps) {
  const hidden = new Set(hideModes ?? [])
  const selected = new Set(selectedModes ?? (mix ? [] : [activeMode]))

  return (
    <>
      {MATH_TOPICS.map((topic) => {
        const modes = mathModesOf(topic).filter((mode) => !hidden.has(mode))
        if (modes.length === 0) return null
        return (
          <div key={topic}>
            <h2>{topicLabel(topic, lang)}</h2>
            <div className="choice-grid is-modes">
              {modes.map((mode) => (
                <ModeChoice
                  key={mode}
                  label={modeLabel(mode, lang)}
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
