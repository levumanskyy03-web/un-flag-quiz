import { useEffect } from 'react'
import { formatLeaderNumbers, leaderShowsNumber, personYearsLabel, type LeaderTerm } from '../data/leaders'
import { leaderBio } from '../data/leaderBios'
import { STRINGS, type Lang } from '../i18n/strings'
import { LeaderPortrait } from './LeaderPortrait'

interface LeaderBioModalProps {
  term: LeaderTerm
  lang: Lang
  onClose: () => void
}

export function LeaderBioModal({ term, lang, onClose }: LeaderBioModalProps) {
  const t = STRINGS[lang]
  const name = lang === 'ru' ? term.ru : term.en
  const bio = leaderBio(term, lang)
  const numbers = formatLeaderNumbers(term)
  const years = personYearsLabel(term, t.present)

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
        className="passport-sheet leader-bio-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leader-bio-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn-ghost passport-close" onClick={onClose}>
          {t.close}
        </button>
        {leaderShowsNumber(term.kind) ? <p className="leader-num">{numbers}</p> : null}
        <LeaderPortrait name={name} wiki={term.wiki} size="hero" />
        <h2 id="leader-bio-title" className="passport-title">
          {name}
        </h2>
        <p className="learn-card-meta">{years}</p>
        {bio ? <p className="leader-bio-text">{bio}</p> : null}
      </div>
    </div>
  )
}
