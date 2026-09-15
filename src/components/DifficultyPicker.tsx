'use client'

import { STRINGS, difficultyLabel, type Lang } from '../i18n/strings'
import { ChoiceLabel } from './FitText'
import type { QuizDifficulty } from '../lib/quiz'

export function setupDifficultyText(difficulty: QuizDifficulty, hardcore: boolean, lang: Lang): string {
  const pool = difficulty === 'hardcore' ? 'hard' : difficulty
  const label = difficultyLabel(pool, lang)
  return hardcore || difficulty === 'hardcore' ? `${label} · ${STRINGS[lang].hardcore}` : label
}

export function HardcoreToggle({
  lang,
  on,
  onChange,
}: {
  lang: Lang
  on: boolean
  onChange: (on: boolean) => void
}) {
  const t = STRINGS[lang]
  return (
    <button
      type="button"
      className={`hardcore-toggle${on ? ' is-active' : ''}`}
      aria-pressed={on}
      aria-label={t.hardcore}
      title={t.hardcoreHint}
      onClick={() => onChange(!on)}
    >
      <span className="hardcore-dot" aria-hidden />
      <span className="hardcore-toggle-label">{t.hardcore}</span>
    </button>
  )
}

export function DifficultyPicker({
  lang,
  difficulties,
  difficulty,
  hardcore,
  onChange,
}: {
  lang: Lang
  difficulties: readonly QuizDifficulty[]
  difficulty: QuizDifficulty
  hardcore: boolean
  onChange: (next: { difficulty: QuizDifficulty; hardcore: boolean }) => void
}) {
  const t = STRINGS[lang]
  const selected = difficulties.includes(difficulty) ? difficulty : difficulty === 'hardcore' ? 'hard' : (difficulties[0] ?? 'easy')
  const hardcoreOn = hardcore || difficulty === 'hardcore'
  const cols = difficulties.length <= 2 ? 'is-2' : difficulties.length === 3 ? 'is-3' : 'is-4'

  return (
    <>
      <h2>{t.difficulty}</h2>
      <div className="difficulty-row">
        <div className={`choice-grid ${cols} is-difficulty`}>
          {difficulties.map((item) => (
            <button
              key={item}
              type="button"
              className={`choice ${selected === item ? 'is-active' : ''}`}
              aria-pressed={selected === item}
              onClick={() => onChange({ difficulty: item, hardcore: hardcoreOn })}
            >
              <ChoiceLabel>{difficultyLabel(item, lang)}</ChoiceLabel>
            </button>
          ))}
        </div>
        <HardcoreToggle lang={lang} on={hardcoreOn} onChange={(on) => onChange({ difficulty: selected, hardcore: on })} />
      </div>
      {hardcoreOn ? <p className="setting-hint">{t.hardcoreHint}</p> : null}
    </>
  )
}
