'use client'

import { useLayoutEffect, useRef } from 'react'

interface FitTextProps {
  children: string
  className?: string
  minPx?: number
  wrap?: boolean
}

export function FitText({ children, className, minPx = 9, wrap = false }: FitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const box = el.parentElement ?? el

    const overflows = () => {
      if (el.clientWidth < 8) return false
      if (wrap) {
        return el.scrollWidth > el.clientWidth + 0.5 || el.scrollHeight > el.clientHeight + 0.5
      }
      return el.scrollWidth > el.clientWidth + 0.5
    }

    const fit = () => {
      el.style.fontSize = ''
      const max = parseFloat(getComputedStyle(el).fontSize)
      if (!Number.isFinite(max) || max <= minPx) {
        el.style.fontSize = `${minPx}px`
        return
      }
      if (el.clientWidth < 8) return
      if (!overflows()) return

      let lo = minPx
      let hi = max
      for (let i = 0; i < 16; i++) {
        const mid = (lo + hi) / 2
        el.style.fontSize = `${mid}px`
        if (overflows()) hi = mid
        else lo = mid
      }
      el.style.fontSize = `${lo}px`
      if (overflows()) el.style.fontSize = `${minPx}px`
    }

    fit()
    const observer = new ResizeObserver(() => fit())
    observer.observe(box)
    return () => observer.disconnect()
  }, [children, minPx, wrap])

  const cls = ['fit-text', wrap ? 'is-wrap' : null, className].filter(Boolean).join(' ')
  return (
    <span ref={ref} className={cls}>
      {children}
    </span>
  )
}

export function ChoiceLabel({ children }: { children: string }) {
  return (
    <FitText wrap minPx={8}>
      {children}
    </FitText>
  )
}
