'use client'

import { useLayoutEffect, useRef } from 'react'

interface FitTextProps {
  children: string
  className?: string
  minPx?: number
}

export function FitText({ children, className, minPx = 9 }: FitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const box = el.parentElement ?? el
    let lastWidth = -1

    const fit = () => {
      const width = el.clientWidth
      if (width < 8) return
      if (Math.abs(width - lastWidth) < 0.5) return
      lastWidth = width

      el.style.fontSize = ''
      const max = parseFloat(getComputedStyle(el).fontSize)
      if (!Number.isFinite(max) || max <= minPx) {
        el.style.fontSize = `${minPx}px`
        return
      }
      if (el.scrollWidth <= el.clientWidth + 0.5) return

      let lo = minPx
      let hi = max
      for (let i = 0; i < 16; i++) {
        const mid = (lo + hi) / 2
        el.style.fontSize = `${mid}px`
        if (el.scrollWidth <= el.clientWidth + 0.5) lo = mid
        else hi = mid
      }
      el.style.fontSize = `${lo}px`
    }

    fit()
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width
      if (next !== undefined && Math.abs(next - lastWidth) < 0.5) return
      lastWidth = -1
      fit()
    })
    observer.observe(box)
    return () => observer.disconnect()
  }, [children, minPx])

  return (
    <span ref={ref} className={className ? `fit-text ${className}` : 'fit-text'}>
      {children}
    </span>
  )
}
