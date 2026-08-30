'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  formatSpokenPct,
  languageName,
  languagePath,
  nationalPreview,
  officialLanguageIds,
  spokenLanguages,
} from '../data/languages'
import { STRINGS, type Lang } from '../i18n/strings'
import { FitText } from './FitText'

interface PassportLanguagesProps {
  iso: string
  lang: Lang
}

export function PassportLanguages({ iso, lang }: PassportLanguagesProps) {
  const t = STRINGS[lang]
  const official = officialLanguageIds(iso)
  const spoken = spokenLanguages(iso)
  const national = new Set(official)
  const preview = nationalPreview(iso, lang)
  const [open, setOpen] = useState<'official' | 'spoken' | null>(null)
  const [canPortal, setCanPortal] = useState(false)

  useEffect(() => {
    setCanPortal(true)
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopImmediatePropagation()
      setOpen(null)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  const previewText =
    official.length === 0
      ? t.noNationalLanguage
      : preview.extra > 0
        ? `${preview.names.join(', ')} ${t.andOthers}`
        : preview.names.join(', ')

  return (
    <div className={`passport-langs${open ? ' is-open' : ''}`}>
      <dt>{t.nationalLanguage}</dt>
      <dd>
        <button
          type="button"
          className="passport-langs-main"
          aria-expanded={open === 'official'}
          onClick={() => setOpen((prev) => (prev === 'official' ? null : 'official'))}
        >
          <FitText minPx={8}>{previewText}</FitText>
        </button>
        <button
          type="button"
          className="passport-langs-star"
          aria-label={t.spokenLanguages}
          aria-expanded={open === 'spoken'}
          onClick={() => setOpen((prev) => (prev === 'spoken' ? null : 'spoken'))}
        >
          ★
        </button>
      </dd>
      {canPortal && open
        ? createPortal(
            <LangModal
              title={open === 'spoken' ? t.spokenLanguages : t.nationalLanguage}
              note={open === 'spoken' ? t.spokenRule : undefined}
              onClose={() => setOpen(null)}
              closeLabel={t.close}
            >
              {open === 'official' ? (
                official.length === 0 ? (
                  <p className="lang-modal-empty">{t.noNationalLanguage}</p>
                ) : (
                  <ul className="lang-card-list">
                    {official.map((id) => (
                      <li key={id}>
                        <a className="lang-card is-national" href={languagePath(id)}>
                          <span className="lang-card-name">{languageName(id, lang)}</span>
                          <span className="lang-card-mark">{t.nationalMark}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )
              ) : spoken.length === 0 ? (
                <p className="lang-modal-empty">{t.spokenRule}</p>
              ) : (
                <ul className="lang-card-list">
                  {spoken.map((item) => {
                    const isNational = national.has(item.id)
                    return (
                      <li key={item.id}>
                        <a
                          className={`lang-card${isNational ? ' is-national' : ''}`}
                          href={languagePath(item.id)}
                        >
                          <span className="lang-card-name">{languageName(item.id, lang)}</span>
                          <span className="lang-card-pct">{formatSpokenPct(item.pct, lang)}</span>
                          {isNational ? <span className="lang-card-mark">{t.nationalMark}</span> : null}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </LangModal>,
            document.body,
          )
        : null}
    </div>
  )
}

function LangModal({
  title,
  note,
  closeLabel,
  onClose,
  children,
}: {
  title: string
  note?: string
  closeLabel: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div className="passport-overlay ranking-about-overlay" onClick={onClose} role="presentation">
      <div
        className="passport-sheet ranking-about-sheet lang-modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="ranking-about-close" aria-label={closeLabel} onClick={onClose}>
          ×
        </button>
        <h2 id="lang-modal-title" className="passport-title">
          {title}
        </h2>
        {note ? <p className="lang-modal-note">{note}</p> : null}
        {children}
      </div>
    </div>
  )
}
