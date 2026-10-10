'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LANGS, LANG_NATIVE, type Lang } from '../i18n/lang'
import { STRINGS } from '../i18n/strings'
import { GeoIcon } from './GeoIcon'

interface LanguageToggleProps {
  lang: Lang
  onChange: (lang: Lang) => void
}

export function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  const t = STRINGS[lang]
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const listId = useId()

  const menu = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    function onPointer(event: PointerEvent) {
      const target = event.target as Node
      if (root.current?.contains(target) || menu.current?.contains(target)) return
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const list = menu.current
    const anchor = root.current
    if (!list || !anchor) return

    function place() {
      if (!list || !anchor) return
      const rect = anchor.getBoundingClientRect()
      const margin = 8
      const gap = 6
      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight
      const width = Math.min(220, vw - margin * 2)
      let left = rect.left
      if (left + width > vw - margin) left = vw - margin - width
      if (left < margin) left = margin

      const spaceBelow = vh - rect.bottom - gap - margin
      const spaceAbove = rect.top - gap - margin
      const openUp = spaceBelow < 220 && spaceAbove > spaceBelow
      const maxHeight = Math.max(96, Math.min(420, openUp ? spaceAbove : spaceBelow))

      list.style.width = `${width}px`
      list.style.maxHeight = `${maxHeight}px`
      list.style.left = `${left}px`
      const height = list.offsetHeight
      const top = openUp ? rect.top - gap - height : rect.bottom + gap
      list.style.top = `${Math.max(margin, Math.min(top, vh - margin - height))}px`
    }

    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open])

  const label = `${t.profileLanguage}: ${LANG_NATIVE[lang]}`

  return (
    <div className="lang-toggle lang-select-wrap" ref={root}>
      <button
        type="button"
        className="lang-select"
        aria-label={label}
        title={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <GeoIcon name="globe" size={18} />
      </button>
      {open
        ? createPortal(
            <ul
              id={listId}
              ref={menu}
              className="lang-menu"
              role="listbox"
              aria-label={t.profileLanguage}
            >
              {LANGS.map((code) => (
                <li key={code} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={code === lang}
                    className={code === lang ? 'is-active' : undefined}
                    lang={code}
                    onClick={() => {
                      onChange(code)
                      setOpen(false)
                    }}
                  >
                    {LANG_NATIVE[code]}
                  </button>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </div>
  )
}
