'use client'

import { useEffect, useState } from 'react'
import { fetchWikiPortrait, type WikiPortrait } from '../lib/wikiThumb'

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
  const [portrait, setPortrait] = useState<WikiPortrait | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let live = true
    setPortrait(null)
    setFailed(false)
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
