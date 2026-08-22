import { useEffect, useState } from 'react'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import {
  EASY_MIX_MODES,
  HARD_MIX_MODES,
  QUIZ_MODES,
  orderedModes,
  sameModes,
  type QuizMode,
} from '../lib/quiz'

interface DuelCreateModalProps {
  lang: Lang
  initialMode: QuizMode
  onCancel: () => void
  onConfirm: (modes: QuizMode[]) => void
}

export function DuelCreateModal({ lang, initialMode, onCancel, onConfirm }: DuelCreateModalProps) {
  const t = STRINGS[lang]
  const [selected, setSelected] = useState<QuizMode[]>(() => orderedModes([initialMode]))

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onCancel])

  const modes = orderedModes(selected)
  const easyMix = sameModes(modes, EASY_MIX_MODES)
  const hardMix = sameModes(modes, HARD_MIX_MODES)

  function toggleMode(mode: QuizMode) {
    setSelected((prev) => {
      if (prev.includes(mode)) {
        if (prev.length === 1) return prev
        return prev.filter((item) => item !== mode)
      }
      return [...prev, mode]
    })
  }

  return (
    <div className="passport-overlay" onClick={onCancel} role="presentation">
      <div
        className="passport-sheet duel-setup-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="duel-setup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn-ghost passport-close" onClick={onCancel}>
          {t.close}
        </button>
        <h2 id="duel-setup-title" className="passport-title">
          {t.duelPickModes}
        </h2>
        <p className="duel-setup-hint">{t.duelPickModesHint}</p>
        <div className="choice-grid">
          <button
            type="button"
            className={`choice has-note is-wide ${easyMix ? 'is-active' : ''}`}
            aria-pressed={easyMix}
            onClick={() => setSelected([...EASY_MIX_MODES])}
          >
            {t.easyMix}
            <span className="choice-note">{t.easyMixNote}</span>
          </button>
          <button
            type="button"
            className={`choice has-note is-wide ${hardMix ? 'is-active' : ''}`}
            aria-pressed={hardMix}
            onClick={() => setSelected([...HARD_MIX_MODES])}
          >
            {t.hardMix}
            <span className="choice-note">{t.hardMixNote}</span>
          </button>
        </div>
        <div className="choice-grid is-modes">
          {QUIZ_MODES.map((mode) => {
            const active = selected.includes(mode)
            return (
              <button
                key={mode}
                type="button"
                className={`choice ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                onClick={() => toggleMode(mode)}
              >
                {modeLabel(mode, lang)}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          className="btn-primary"
          disabled={modes.length === 0}
          onClick={() => onConfirm(modes)}
        >
          {t.duelCreate}
        </button>
      </div>
    </div>
  )
}
