'use client'

import { useEffect, useRef, useState } from 'react'
import { flagUrl } from '../lib/quiz'
import { fetchWikiPortrait, peekWikiPortrait, type WikiPortrait } from '../lib/wikiThumb'

interface LeaderPortraitProps {
  name: string
  wiki: string
  file?: string
  flagIso?: string
  size?: 'hero' | 'card' | 'thumb'
  compact?: boolean
}

const pending = new Map<Element, () => void>()
let scrollBound = false
let raf = 0
let poll = 0

function flushNearViewport() {
  raf = 0
  const margin = 280
  const vh = typeof window === 'undefined' ? 0 : window.innerHeight
  for (const [el, show] of [...pending]) {
    const rect = el.getBoundingClientRect()
    if (rect.bottom < -margin || rect.top > vh + margin) continue
    pending.delete(el)
    show()
  }
  if (pending.size === 0) unbindScroll()
}

function onScroll() {
  if (raf) return
  raf = window.requestAnimationFrame(flushNearViewport)
}

function bindScroll() {
  if (scrollBound || typeof window === 'undefined') return
  scrollBound = true
  window.addEventListener('scroll', onScroll, true)
  document.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onScroll)
  poll = window.setInterval(flushNearViewport, 400)
}

function unbindScroll() {
  if (!scrollBound || pending.size > 0) return
  scrollBound = false
  window.removeEventListener('scroll', onScroll, true)
  document.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onScroll)
  window.clearInterval(poll)
  poll = 0
}

function watchNearViewport(el: Element, onShow: () => void): () => void {
  pending.set(el, onShow)
  bindScroll()
  flushNearViewport()
  return () => {
    pending.delete(el)
    unbindScroll()
  }
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0]).join('')
  return letters.toUpperCase() || '?'
}

export function LeaderPortrait({ name, wiki, file, flagIso, size = 'card', compact = false }: LeaderPortraitProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(() => size === 'hero' || Boolean(peekWikiPortrait(wiki, file)))
  const [portrait, setPortrait] = useState<WikiPortrait | null>(() => peekWikiPortrait(wiki, file) ?? null)
  const [failed, setFailed] = useState(false)
  const [fetchTry, setFetchTry] = useState(0)
  const [imgTry, setImgTry] = useState(0)

  useEffect(() => {
    const cached = peekWikiPortrait(wiki, file)
    setVisible(size === 'hero' || Boolean(cached))
    setFailed(false)
    setImgTry(0)
    setFetchTry(0)
    setPortrait(cached ?? null)
  }, [wiki, file, size])

  useEffect(() => {
    if (visible) return
    const el = rootRef.current
    if (!el) return
    return watchNearViewport(el, () => setVisible(true))
  }, [visible, wiki, file])

  useEffect(() => {
    if (!visible) return
    let live = true
    const cached = peekWikiPortrait(wiki, file)
    if (cached) setPortrait(cached)
    else setPortrait(null)
    if (!wiki || cached) {
      return () => {
        live = false
      }
    }
    void fetchWikiPortrait(wiki, file).then((next) => {
      if (!live) return
      setPortrait(next)
      if (!next && fetchTry < 5) {
        window.setTimeout(() => {
          if (live) setFetchTry((n) => n + 1)
        }, 700 * (fetchTry + 1))
      }
    })
    return () => {
      live = false
    }
  }, [wiki, file, fetchTry, visible])

  const credit = compact || size !== 'hero' ? portrait?.compactCredit : portrait?.credit

  if (!portrait || failed) {
    return (
      <span ref={rootRef} className={`leader-fallback is-${size}${flagIso ? ' has-flag' : ''}`} aria-hidden="true">
        {flagIso ? <img className="leader-fallback-flag" src={flagUrl(flagIso)} alt="" /> : null}
        <span className="leader-fallback-initials">{initials(name)}</span>
      </span>
    )
  }

  return (
    <figure className={`leader-portrait is-${size}`}>
      <img
        key={`${portrait.url}:${imgTry}`}
        className={`leader-photo is-${size}`}
        src={portrait.url}
        alt=""
        decoding="async"
        loading={size === 'hero' ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        fetchPriority={size === 'hero' ? 'high' : 'low'}
        onError={() => {
          if (imgTry < 4) {
            window.setTimeout(() => setImgTry((n) => n + 1), 500 * (imgTry + 1))
          } else {
            setFailed(true)
          }
        }}
      />
      {credit ? (
        <figcaption className="leader-credit">
          <a href={portrait.filePage} target="_blank" rel="noreferrer">
            {credit}
          </a>
        </figcaption>
      ) : null}
    </figure>
  )
}
