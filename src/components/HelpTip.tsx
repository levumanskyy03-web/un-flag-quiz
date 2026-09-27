'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function HelpTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const [box, setBox] = useState<{ top: number; left: number } | null>(null)
  const root = useRef<HTMLSpanElement>(null)
  const pop = useRef<HTMLSpanElement>(null)
  const mouse = useRef(false)
  const closeTimer = useRef<number | null>(null)
  const id = useId()

  function place() {
    const mark = root.current?.querySelector('button')
    if (!mark) return
    const rect = mark.getBoundingClientRect()
    const half = Math.min(144, window.innerWidth * 0.36)
    const left = Math.min(Math.max(rect.left + rect.width / 2, 12 + half), window.innerWidth - 12 - half)
    setBox({ top: rect.bottom + 6, left })
  }

  function cancelClose() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function scheduleClose() {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpen(false), 140)
  }

  useEffect(() => {
    if (!open) return
    place()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    function onPointer(event: PointerEvent) {
      const target = event.target as Node
      if (root.current?.contains(target) || pop.current?.contains(target)) return
      setOpen(false)
    }
    function onMove() {
      place()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [open])

  const body = text.trim()
  if (!body) return null

  return (
    <span
      className={`help-tip${open ? ' is-open' : ''}`}
      ref={root}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return
        mouse.current = true
        cancelClose()
        setOpen(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return
        mouse.current = false
        scheduleClose()
      }}
    >
      <button
        type="button"
        className="help-tip-mark"
        aria-label={body}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={(event) => {
          event.stopPropagation()
          if (mouse.current) return
          setOpen((value) => !value)
        }}
      >
        ?
      </button>
      {open && box
        ? createPortal(
            <span
              id={id}
              ref={pop}
              role="tooltip"
              className="help-tip-pop"
              style={{ top: box.top, left: box.left }}
              onPointerEnter={() => {
                mouse.current = true
                cancelClose()
              }}
              onPointerLeave={() => {
                mouse.current = false
                scheduleClose()
              }}
            >
              {body}
            </span>,
            document.body,
          )
        : null}
    </span>
  )
}

export function ChoiceWithHelp({ tip, children }: { tip?: string; children: ReactNode }) {
  return (
    <div className="choice-help">
      {children}
      {tip ? <HelpTip text={tip} /> : null}
    </div>
  )
}
