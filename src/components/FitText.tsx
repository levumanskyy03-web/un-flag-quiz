'use client'

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'

interface FitTextProps {
  children: string
  className?: string
  minPx?: number
  wrap?: boolean
}

type FitGroupApi = {
  wrap: boolean
  minPx: number
  register: (el: HTMLElement) => () => void
}

const FitGroupContext = createContext<FitGroupApi | null>(null)

function overflows(el: HTMLElement, wrap: boolean) {
  if (el.clientWidth < 8) return false
  if (wrap) {
    return el.scrollWidth > el.clientWidth + 0.5 || el.scrollHeight > el.clientHeight + 0.5
  }
  return el.scrollWidth > el.clientWidth + 0.5
}

function fitOne(el: HTMLElement, minPx: number, wrap: boolean) {
  el.style.fontSize = ''
  const max = parseFloat(getComputedStyle(el).fontSize)
  if (!Number.isFinite(max) || max <= minPx) {
    el.style.fontSize = `${minPx}px`
    return
  }
  if (el.clientWidth < 8) return
  if (!overflows(el, wrap)) return

  let lo = minPx
  let hi = max
  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) / 2
    el.style.fontSize = `${mid}px`
    if (overflows(el, wrap)) hi = mid
    else lo = mid
  }
  el.style.fontSize = `${lo}px`
  if (overflows(el, wrap)) el.style.fontSize = `${minPx}px`
}

export function FitGroup({
  children,
  minPx = 9,
  wrap = true,
}: {
  children: ReactNode
  minPx?: number
  wrap?: boolean
}) {
  const nodes = useRef(new Set<HTMLElement>())
  const wrapRef = useRef(wrap)
  const minRef = useRef(minPx)
  wrapRef.current = wrap
  minRef.current = minPx

  const register = useCallback((el: HTMLElement) => {
    nodes.current.add(el)
    return () => {
      nodes.current.delete(el)
    }
  }, [])

  useLayoutEffect(() => {
    const list = () => [...nodes.current]

    const fitAll = () => {
      const els = list()
      if (els.length === 0) return
      const wrapNow = wrapRef.current
      const min = minRef.current
      for (const el of els) el.style.fontSize = ''
      const max = Math.max(
        min,
        ...els.map((el) => parseFloat(getComputedStyle(el).fontSize)).filter((n) => Number.isFinite(n)),
      )
      const apply = (px: number) => {
        for (const el of els) el.style.fontSize = `${px}px`
      }
      const allFit = (px: number) => {
        apply(px)
        return els.every((el) => !overflows(el, wrapNow))
      }
      if (allFit(max)) {
        apply(max)
        return
      }
      let lo = min
      let hi = max
      for (let i = 0; i < 16; i++) {
        const mid = (lo + hi) / 2
        if (allFit(mid)) lo = mid
        else hi = mid
      }
      apply(allFit(lo) ? lo : min)
    }

    fitAll()
    const observer = new ResizeObserver(() => fitAll())
    for (const el of list()) observer.observe(el.parentElement ?? el)
    return () => observer.disconnect()
  }, [children, minPx, wrap])

  const api = useMemo(() => ({ wrap, minPx, register }), [wrap, minPx, register])

  return <FitGroupContext.Provider value={api}>{children}</FitGroupContext.Provider>
}

export function FitText({ children, className, minPx = 9, wrap = false }: FitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const group = useContext(FitGroupContext)
  const useWrap = group?.wrap ?? wrap
  const useMin = group?.minPx ?? minPx

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (group) return group.register(el)

    const fit = () => fitOne(el, useMin, useWrap)
    fit()
    const observer = new ResizeObserver(() => fit())
    observer.observe(el.parentElement ?? el)
    return () => observer.disconnect()
  }, [children, group, useMin, useWrap])

  const cls = ['fit-text', useWrap ? 'is-wrap' : null, className].filter(Boolean).join(' ')
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
