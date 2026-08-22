import { useEffect } from 'react'
import { holdoutClaim, holdoutName, holdoutNote, type MapHoldout } from '../data/territories'
import { STRINGS, type Lang } from '../i18n/strings'

interface HoldoutModalProps {
  holdout: MapHoldout
  lang: Lang
  onClose: () => void
}

export function HoldoutModal({ holdout, lang, onClose }: HoldoutModalProps) {
  const t = STRINGS[lang]
  const claim = holdoutClaim(holdout, lang)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div className="passport-overlay" onClick={onClose} role="presentation">
      <div
        className="passport-sheet holdout-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="holdout-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn-ghost passport-close" onClick={onClose}>
          {t.close}
        </button>
        <h2 id="holdout-title" className="passport-title">
          {holdoutName(holdout, lang)}
        </h2>
        <p className="passport-territory">
          <span className="passport-fact-label">{t.notInQuiz}</span>
          {holdoutNote(holdout, lang)}
        </p>
        {claim ? (
          <p className="passport-dispute">
            <span className="passport-fact-label">{t.dispute}</span>
            {claim}
          </p>
        ) : null}
      </div>
    </div>
  )
}
