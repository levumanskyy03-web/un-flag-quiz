'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { WIKI_PORTRAIT_FILES } from '../data/leaderPortraitFiles'
import { commonsThumbCandidates, portraitThumbWidth } from '../lib/commonsFile'
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
  if (!name) return null
  if (name.startsWith('/') || name.startsWith('http://') || name.startsWith('https://')) return name
  return null
}

function platePortrait(src: string): WikiPortrait {
  return { url: src, credit: '', compactCredit: '', filePage: src, license: '' }
}

function isDishFile(file?: string): boolean {
  const name = file?.trim() ?? ''
  return name.startsWith('/food/') || name.startsWith('http://') || name.startsWith('https://')
}

function portraitProxy(wiki: string, file?: string): string {
  const title = wiki.trim().replace(/_/g, ' ')
  if (!title) return ''
  const params = new URLSearchParams({ title })
  const hinted = file?.trim()
  if (hinted && !hinted.startsWith('/')) params.set('file', hinted)
  return `/api/wiki-image?${params}`
}

export function LeaderPortrait({ name, wiki, file, flagIso, size = 'card', compact = false }: LeaderPortraitProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const hint = hintedFile(wiki, file)
  const plate = localPlate(hint)
  const dish = isDishFile(file) || isDishFile(hint)
  const width = portraitThumbWidth(size)
  const fallbacks = useMemo(() => {
    if (plate) return []
    const direct = hint ? commonsThumbCandidates(hint, width)[0] : ''
    const proxy = portraitProxy(wiki, hint)
    return [direct, proxy].filter(Boolean)
  }, [hint, width, plate, wiki])
  const [visible, setVisible] = useState(() => size === 'hero' || Boolean(plate) || peekWikiPortrait(wiki, file ?? hint) !== undefined)
  const [portrait, setPortrait] = useState<WikiPortrait | null>(
    () => (plate ? platePortrait(plate) : peekWikiPortrait(wiki, file ?? hint) ?? null),
  )
  const [failed, setFailed] = useState(() => !plate && peekWikiPortrait(wiki, file ?? hint) === null)
  const [fetchTry, setFetchTry] = useState(0)
  const [imgTry, setImgTry] = useState(0)
  const srcRef = useRef('')

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
    setVisible(size === 'hero' || cached !== undefined)
    setFailed(cached === null)
    setImgTry(0)
    setFetchTry(0)
    setPortrait(cached ?? null)
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
    if (cached) {
      setPortrait(cached)
      setFailed(false)
    }
    if (cached === null) {
      setFailed(true)
      return () => {
        live = false
      }
    }
    if (!wiki || cached) {
      return () => {
        live = false
      }
    }
    void fetchWikiPortrait(wiki, file ?? hint).then((next) => {
      if (!live) return
      if (next) {
        setPortrait(next)
        setFailed(false)
        setImgTry(0)
        return
      }
      if (peekWikiPortrait(wiki, file ?? hint) === null) {
        setFailed(true)
        return
      }
      if (fetchTry < 2) {
        window.setTimeout(() => {
          if (live) setFetchTry((n) => n + 1)
        }, 800 * (fetchTry + 1))
      }
    })
    return () => {
      live = false
    }
  }, [wiki, file, hint, fetchTry, visible, plate, fallbacks])

  const credit = compact || size !== 'hero' ? portrait?.compactCredit : portrait?.credit
  const chain = plate ? [plate] : [portrait?.url ?? '', ...fallbacks].filter((url, index, all) => url && all.indexOf(url) === index)
  const src = failed ? '' : (chain[imgTry] ?? '')
  srcRef.current = src

  if (!visible || !src || failed) {
    return (
      <span ref={rootRef} className={`leader-fallback is-${size}${dish ? ' is-dish' : ''}${flagIso ? ' has-flag' : ''}`} aria-hidden="true">
        {flagIso ? <img className="leader-fallback-flag" src={flagUrl(flagIso)} alt="" /> : null}
        <span className="leader-fallback-initials">{initials(name)}</span>
      </span>
    )
  }

  return (
    <figure className={`leader-portrait is-${size}${dish ? ' is-dish' : ''}`}>
      <img
        key={`${src}:${imgTry}`}
        className={`leader-photo is-${size}${dish ? ' is-dish' : ''}`}
        src={src}
        alt=""
        decoding="async"
        loading={size === 'hero' ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        fetchPriority={size === 'hero' ? 'high' : 'low'}
        onError={(event) => {
          if (event.currentTarget.getAttribute('src') !== srcRef.current) return
          if (imgTry + 1 < fallbacks.length) setImgTry((n) => n + 1)
          else setFailed(true)
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
