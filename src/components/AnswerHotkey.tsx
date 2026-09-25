'use client'

import { useEffect } from 'react'

export function AnswerKey({ n, label }: { n: number; label: string }) {
  if (n < 1 || n > 4) return null
  return (
    <span className="option-key" aria-label={label}>
      {n}
    </span>
  )
}

export function answerTone(index: number) {
  return `is-tone-${index % 4}`
}

export function answerMotion(reduce: boolean | null, wrong: boolean, correct: boolean) {
  if (reduce) return { x: 0, scale: 1 }
  if (wrong) return { x: [0, -16, 16, -12, 12, -6, 0], scale: 1 }
  if (correct) return { x: 0, scale: 1.05 }
  return { x: 0, scale: 1 }
}

export function useAnswerHotkeys(ids: string[], onSelect: (id: string) => void, enabled: boolean) {
  const signature = ids.slice(0, 4).join('\n')
  useEffect(() => {
    if (!enabled) return
    const keys = signature ? signature.split('\n') : []
    function onKey(event: KeyboardEvent) {
      const target = event.target
      if (target instanceof HTMLElement) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return
      }
      const digit = event.code.startsWith('Digit')
        ? Number(event.code.slice(5))
        : event.code.startsWith('Numpad')
          ? Number(event.code.slice(6))
          : NaN
      if (!Number.isInteger(digit) || digit < 1 || digit > 4) return
      const id = keys[digit - 1]
      if (!id) return
      event.preventDefault()
      onSelect(id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, onSelect, signature])
}
