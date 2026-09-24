'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { getCookieConsent, subscribeCookieConsent } from '../lib/cookieConsent'
import { markSiteTourSeen } from '../lib/siteTour'

export const SITE_TOUR_STEPS = ['worlds', 'geo', 'empire', 'dock'] as const
export type SiteTourStep = (typeof SITE_TOUR_STEPS)[number]

type Hole = { top: number; left: number; width: number; height: number }

function cookiesReady() {
  return getCookieConsent() != null
}

function readHole(step: SiteTourStep): Hole | null {
  const el = document.querySelector<HTMLElement>(`[data-tour="${step}"]`)
  if (!el) return null
  const rect = el.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null
  const pad = 8
  return {
    top: Math.max(6, rect.top - pad),
    left: Math.max(6, rect.left - pad),
    width: Math.min(window.innerWidth - 12, rect.width + pad * 2),
    height: Math.min(window.innerHeight - 12, rect.height + pad * 2),
  }
}

export function SiteTour({ lang }: { lang: Lang }) {
  const t = STRINGS[lang]
  const titleId = useId()
  const cardRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(cookiesReady)
  const [index, setIndex] = useState(0)
  const [hole, setHole] = useState<Hole | null>(null)
  const [cardBox, setCardBox] = useState({ top: 24, left: 16 })
  const step = SITE_TOUR_STEPS[index] ?? 'worlds'
  const last = index >= SITE_TOUR_STEPS.length - 1

  const titles: Record<SiteTourStep, string> = {
    worlds: t.tourStepWorldsTitle,
    geo: t.tourStepGeoTitle,
    empire: t.tourStepEmpireTitle,
    dock: t.tourStepDockTitle,
  }
  const bodies: Record<SiteTourStep, string> = {
    worlds: t.tourStepWorldsBody,
    geo: t.tourStepGeoBody,
    empire: t.tourStepEmpireBody,
    dock: t.tourStepDockBody,
  }

  const close = useCallback(() => {
    markSiteTourSeen()
  }, [])

  const measure = useCallback(() => {
    setHole(readHole(SITE_TOUR_STEPS[index] ?? 'worlds'))
  }, [index])

  useEffect(() => {
    const sync = () => setReady(cookiesReady())
    sync()
    return subscribeCookieConsent(sync)
  }, [])

  useEffect(() => {
    if (!ready) return
    const id = window.requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.cancelAnimationFrame(id)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [ready, measure])

  useEffect(() => {
    if (!ready) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.dataset.tour = 'on'
    return () => {
      document.body.style.overflow = prev
      delete document.documentElement.dataset.tour
    }
  }, [ready])

  useEffect(() => {
    if (!ready) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault()
        if (last) close()
        else setIndex((n) => n + 1)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setIndex((n) => Math.max(0, n - 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready, last, close])

  useLayoutEffect(() => {
    if (!ready) return
    const card = cardRef.current
    const app = document.querySelector('.app')
    const bounds = app?.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const margin = 12
    const minLeft = (bounds?.left ?? 0) + margin
    const maxRight = (bounds?.right ?? vw) - margin
    const minTop = (bounds?.top ?? 0) + margin
    const maxBottom = (bounds?.bottom ?? vh) - margin
    const cardW = Math.min(card?.offsetWidth ?? 320, Math.max(180, maxRight - minLeft))
    const cardH = card?.offsetHeight ?? 180
    const placeLeft = (raw: number) => Math.max(minLeft, Math.min(raw, maxRight - cardW))
    if (!hole) {
      setCardBox({ top: Math.max(minTop, maxBottom - cardH), left: placeLeft((vw - cardW) / 2) })
      return
    }
    const pinBottom = hole.height > (maxBottom - minTop) * 0.42
    const below = hole.top + hole.height + 12
    const above = hole.top - cardH - 12
    let top = pinBottom ? maxBottom - cardH : below
    if (top + cardH > maxBottom) top = above
    if (top < minTop) top = Math.max(minTop, maxBottom - cardH)
    setCardBox({ top, left: placeLeft(hole.left + hole.width / 2 - cardW / 2) })
  }, [ready, hole, index, lang])

  if (!ready) return null

  return (
    <div className="site-tour" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="site-tour-dim" />
      {hole ? (
        <div
          className="site-tour-spot"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
          }}
        />
      ) : null}
      <div ref={cardRef} className="site-tour-card" style={{ top: cardBox.top, left: cardBox.left }}>
        <p className="site-tour-count">
          {index + 1} / {SITE_TOUR_STEPS.length}
        </p>
        <h2 id={titleId}>{titles[step]}</h2>
        <p>{bodies[step]}</p>
        <div className="site-tour-actions">
          <button type="button" className="site-tour-skip" onClick={close}>
            {t.tourSkip}
          </button>
          <span className="site-tour-nav">
            {index > 0 ? (
              <button type="button" className="site-tour-back" onClick={() => setIndex((n) => n - 1)}>
                {t.tourBack}
              </button>
            ) : null}
            <button
              type="button"
              className="btn-primary site-tour-next"
              onClick={() => {
                if (last) close()
                else setIndex((n) => n + 1)
              }}
            >
              {last ? t.tourDone : t.tourNext}
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}
