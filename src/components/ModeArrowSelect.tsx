'use client'

import { useEffect, useRef, useState } from 'react'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { rtlModeArrows } from '../i18n/lang'
import { pickLink, sideIds, sideText, linkForMode, type ModeLink } from '../lib/modePairs'
import { HardcoreToggle } from './DifficultyPicker'
import { EmpireLock } from './EmpireLock'
import { useEmpire } from '../lib/empireStore'
import { access, type GateFeature } from '../lib/empire/gates'
import type { QuizMode } from '../lib/quiz'

interface ModeArrowSelectProps {
  links: readonly ModeLink[]
  mode: QuizMode
  lang: Lang
  level: number
  hardcore: boolean
  startLabel: string
  startDisabled?: boolean
  caption?: string
  formatSide?: (side: 'left' | 'right', id: string) => string
  showHardcore?: boolean
  hardcoreGate?: GateFeature
  hardcoreTitle?: string
  onMode: (mode: QuizMode) => void
  onHardcore: (on: boolean) => void
  onStart: () => void
}

export function ModeArrowSelect({
  links,
  mode,
  lang,
  level,
  hardcore,
  startLabel,
  startDisabled,
  caption,
  formatSide,
  showHardcore = true,
  hardcoreGate = { kind: 'difficulty', difficulty: 'hardcore' },
  hardcoreTitle,
  onMode,
  onHardcore,
  onStart,
}: ModeArrowSelectProps) {
  const t = STRINGS[lang]
  const empire = useEmpire()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<'left' | 'right' | null>(null)
  const active = linkForMode(links, mode) ?? links[0]
  const hardcoreLocked = showHardcore && hardcore && access(empire, hardcoreGate) === 'locked'

  useEffect(() => {
    if (!open) return
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(null)
    }
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!active) return null

  function label(side: 'left' | 'right', id: string) {
    return formatSide?.(side, id) ?? sideText(links, side, id, lang)
  }

  function choose(side: 'left' | 'right', id: string) {
    onMode(pickLink(links, mode, side, id))
    setOpen(null)
  }

  return (
    <div className="mode-arrow-card" ref={rootRef}>
      <h2>{t.modeSelector}</h2>
      <p className="mode-arrow-meta">{t.modeSelectorMeta(level, caption ?? modeLabel(mode, lang))}</p>
      <div className={`mode-arrow${active.plain ? ' is-plain' : ''}`}>
        <SideMenu
          side="left"
          open={open === 'left'}
          current={active.left}
          ids={sideIds(links, 'left')}
          label={(id) => label('left', id)}
          onToggle={() => setOpen(open === 'left' ? null : 'left')}
          onPick={(id) => choose('left', id)}
        />
        {active.plain ? null : (
          <>
            <span className="mode-arrow-mark" aria-hidden>
              {rtlModeArrows('→', lang)}
            </span>
            <SideMenu
              side="right"
              open={open === 'right'}
              current={active.right}
              ids={sideIds(links, 'right')}
              label={(id) => label('right', id)}
              onToggle={() => setOpen(open === 'right' ? null : 'right')}
              onPick={(id) => choose('right', id)}
            />
          </>
        )}
      </div>
      {showHardcore ? (
        <div className="mode-arrow-hardcore">
          <HardcoreToggle lang={lang} on={hardcore} onChange={onHardcore} />
        </div>
      ) : null}
      {hardcoreLocked ? <EmpireLock lang={lang} feature={hardcoreGate} title={hardcoreTitle ?? t.gateDifficulty} /> : null}
      <button type="button" className="btn-primary mode-arrow-start" disabled={startDisabled} onClick={onStart}>
        {startLabel}
      </button>
    </div>
  )
}

function SideMenu({
  side,
  open,
  current,
  ids,
  label,
  onToggle,
  onPick,
}: {
  side: 'left' | 'right'
  open: boolean
  current: string
  ids: string[]
  label: (id: string) => string
  onToggle: () => void
  onPick: (id: string) => void
}) {
  return (
    <div className={`mode-arrow-side is-${side}`}>
      <button
        type="button"
        className={`mode-arrow-btn${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={onToggle}
      >
        <span>{label(current)}</span>
        <span className="mode-arrow-caret" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <ul className="mode-arrow-menu" role="listbox">
          {ids.map((id) => (
            <li key={id}>
              <button
                type="button"
                role="option"
                aria-selected={id === current}
                className={id === current ? 'is-active' : ''}
                onClick={() => onPick(id)}
              >
                {label(id)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
