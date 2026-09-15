import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { leaderNoteOf, type LeaderNoteId } from '../data/leaderNotes'
import { leaderNoteWhy } from '../data/leaderNoteWhy'
import type { LeaderTerm } from '../data/leaders'
import { STRINGS, type Lang } from '../i18n/strings'

function noteLabel(id: LeaderNoteId, lang: Lang): string {
  const t = STRINGS[lang]
  if (id === 'deJure') return t.leaderNoteDeJure
  if (id === 'parallel') return t.leaderNoteParallel
  if (id === 'disputed') return t.leaderNoteDisputed
  if (id === 'abdicated') return t.leaderNoteAbdicated
  if (id === 'vpDeath') return t.leaderNoteVpDeath
  return t.leaderNoteVpResign
}

export function LeaderNoteMark({ term, lang }: { term: LeaderTerm; lang: Lang }) {
  const id = leaderNoteOf(term)
  const why = leaderNoteWhy(term, lang)
  const [open, setOpen] = useState(false)
  const t = STRINGS[lang]
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  if (!id) return null
  const label = noteLabel(id, lang)
  return (
    <>
      <button
        type="button"
        className="leader-note"
        onClick={(event) => {
          event.stopPropagation()
          setOpen(true)
        }}
      >
        {label}
      </button>
      {open && why
        ? createPortal(
            <div
              className="passport-overlay leader-note-overlay"
              onClick={() => setOpen(false)}
              role="presentation"
            >
              <div
                className="passport-sheet leader-note-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="leader-note-title"
                onClick={(event) => event.stopPropagation()}
              >
                <button type="button" className="btn-ghost passport-close" onClick={() => setOpen(false)}>
                  {t.close}
                </button>
                <h2 id="leader-note-title" className="passport-title">
                  {label}
                </h2>
                <p className="leader-note-why">{why}</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
