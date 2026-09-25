'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { WIKI_PORTRAIT_FILES } from '../data/leaderPortraitFiles'
import { commonsThumbCandidates, portraitFromFileHint, portraitThumbWidth } from '../lib/commonsFile'
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

function hintedFile(wiki: string, file?: string) {
  const extra = file?.trim()
  if (extra) return extra
  return WIKI_PORTRAIT_FILES[wiki.trim().replace(/_/g, ' ')]
}

function localPlate(file?: string): string | null {
  const name = file?.trim()
  return name?.startsWith('/') ? name : null
}

function platePortrait(src: string): WikiPortrait {
  return { url: src, credit: '', compactCredit: '', filePage: src, license: '' }
}

export function LeaderPortrait({ name, wiki, file, flagIso, size = 'card', compact = false }: LeaderPortraitProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const hint = hintedFile(wiki, file)
  const plate = localPlate(hint)
  const width = portraitThumbWidth(size)
  const fallbacks = useMemo(() => (plate || !hint ? [] : commonsThumbCandidates(hint, width)), [hint, width, plate])
  const [visible, setVisible] = useState(() => size === 'hero' || Boolean(plate) || Boolean(peekWikiPortrait(wiki, file ?? hint)))
  const [portrait, setPortrait] = useState<WikiPortrait | null>(
    () => (plate ? platePortrait(plate) : peekWikiPortrait(wiki, file ?? hint) ?? portraitFromFileHint(hint, width)),
  )
  const [failed, setFailed] = useState(false)
  const [fetchTry, setFetchTry] = useState(0)
  const [imgTry, setImgTry] = useState(0)

  useEffect(() => {
    if (plate) {
      setVisible(true)
      setFailed(false)
      setImgTry(0)
      setFetchTry(0)
      setPortrait(platePortrait(plate))
      return
    }
    const cached = peekWikiPortrait(wiki, file ?? hint)
    const next = cached ?? portraitFromFileHint(hint, width)
    setVisible(size === 'hero' || Boolean(cached))
    setFailed(false)
    setImgTry(0)
    setFetchTry(0)
    setPortrait(next)
  }, [wiki, file, hint, size, width, plate])

  useEffect(() => {
    if (visible) return
    const el = rootRef.current
    if (!el) return
    return watchNearViewport(el, () => setVisible(true))
  }, [visible, wiki, file])

  useEffect(() => {
    if (!visible || plate) return
    let live = true
    const cached = peekWikiPortrait(wiki, file ?? hint)
    if (cached) setPortrait(cached)
    if (!wiki || cached) {
      return () => {
        live = false
      }
    }
    void fetchWikiPortrait(wiki, file ?? hint).then((next) => {
      if (!live || !next) {
        if (!live) return
        if (!hint && !next && fetchTry < 2) {
          window.setTimeout(() => {
            if (live) setFetchTry((n) => n + 1)
          }, 800 * (fetchTry + 1))
        }
        return
      }
      setPortrait(next)
    })
    return () => {
      live = false
    }
  }, [wiki, file, hint, fetchTry, visible, plate])

  const credit = compact || size !== 'hero' ? portrait?.compactCredit : portrait?.credit
  const src = fallbacks[imgTry] ?? portrait?.url

  if (!visible || !src || failed) {
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
        key={`${src}:${imgTry}`}
        className={`leader-photo is-${size}`}
        src={src}
        alt=""
        decoding="async"
        loading={size === 'hero' ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        fetchPriority={size === 'hero' ? 'high' : 'low'}
        onError={() => {
          if (imgTry + 1 < fallbacks.length) {
            setImgTry((n) => n + 1)
          } else if (imgTry < fallbacks.length + 2 && portrait?.url && portrait.url !== src) {
            setImgTry(fallbacks.length)
          } else {
            setFailed(true)
          }
        }}
      />
      {credit ? (
        <figcaption className="leader-credit">
          <a href={portrait?.filePage} target="_blank" rel="noreferrer">
            {credit}
          </a>
        </figcaption>
      ) : null}
    </figure>
  )
}
