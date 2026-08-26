import { useEffect } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { formatXp } from '../lib/xp'
import { GeoIcon } from './GeoIcon'

interface RecordModalProps {
  lang: Lang
  previousName: string | null
  bonusXp: number
  onClose: () => void
}

export function RecordModal({ lang, previousName, bonusXp, onClose }: RecordModalProps) {
  const t = STRINGS[lang]

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
        className="passport-sheet record-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="record-mark" aria-hidden="true">
          <GeoIcon name="trophy" size={36} />
        </p>
        <h2 id="record-title" className="passport-title">
          {t.worldRecordBeat}
        </h2>
        <p className="record-bonus">{t.worldRecordBonus(formatXp(bonusXp, lang))}</p>
        {previousName ? <p className="setting-hint">{previousName}</p> : null}
        <button type="button" className="btn-primary" onClick={onClose}>
          {t.close}
        </button>
      </div>
    </div>
  )
}
