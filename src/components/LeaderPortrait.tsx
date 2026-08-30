'use client'

import { useEffect, useState } from 'react'
import { fetchWikiPortrait, peekWikiPortrait, type WikiPortrait } from '../lib/wikiThumb'

interface LeaderPortraitProps {
  name: string
  wiki: string
  size?: 'hero' | 'card' | 'thumb'
  compact?: boolean
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0]).join('')
  return letters.toUpperCase() || '?'
}

export function LeaderPortrait({ name, wiki, size = 'card', compact = false }: LeaderPortraitProps) {
  const [portrait, setPortrait] = useState<WikiPortrait | null>(() => peekWikiPortrait(wiki) ?? null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let live = true
    const cached = peekWikiPortrait(wiki)
    setFailed(false)
    if (cached !== undefined) {
      setPortrait(cached)
      if (cached) return () => {
        live = false
      }
    } else {
      setPortrait(null)
    }
    if (!wiki) return
    void fetchWikiPortrait(wiki).then((next) => {
      if (live) setPortrait(next)
    })
    return () => {
      live = false
    }
  }, [wiki])

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
        className={`leader-photo is-${size}`}
        src={portrait.url}
        alt=""
        decoding="async"
        fetchPriority={size === 'hero' ? 'high' : 'low'}
        onError={() => setFailed(true)}
      />
      <figcaption className="leader-credit">
        <a href={portrait.filePage} target="_blank" rel="noreferrer">
          {credit}
        </a>
      </figcaption>
    </figure>
  )
}
