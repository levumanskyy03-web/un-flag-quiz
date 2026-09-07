'use client'

import { useEffect, useState } from 'react'
import { fetchWikiPortrait, peekWikiPortrait, type WikiPortrait } from '../lib/wikiThumb'

interface LeaderPortraitProps {
  name: string
  wiki: string
  file?: string
  size?: 'hero' | 'card' | 'thumb'
  compact?: boolean
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0]).join('')
  return letters.toUpperCase() || '?'
}

export function LeaderPortrait({ name, wiki, file, size = 'card', compact = false }: LeaderPortraitProps) {
  const [portrait, setPortrait] = useState<WikiPortrait | null>(() => peekWikiPortrait(wiki, file) ?? null)
  const [failed, setFailed] = useState(false)
  const [fetchTry, setFetchTry] = useState(0)
  const [imgTry, setImgTry] = useState(0)

  useEffect(() => {
    let live = true
    const cached = peekWikiPortrait(wiki, file)
    setFailed(false)
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
  }, [wiki, file, fetchTry])

  useEffect(() => {
    setImgTry(0)
    setFetchTry(0)
  }, [wiki, file])

  if (!portrait || failed) {
    return (
      <span className={`leader-fallback is-${size}`} aria-hidden="true">
        {initials(name)}
      </span>
    )
  }

  const credit = compact ? portrait.compactCredit : portrait.credit

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
      <figcaption className="leader-credit">
        <a href={portrait.filePage} target="_blank" rel="noreferrer">
          {credit}
        </a>
      </figcaption>
    </figure>
  )
}
