import type { WikiPortrait } from './wikiPortrait'

export type { WikiPortrait }

const cache = new Map<string, WikiPortrait | null>()
const inflight = new Map<string, Promise<WikiPortrait | null>>()
const STORE_KEY = 'unfq-wiki-portraits-v2'
const STORE_MS = 14 * 24 * 60 * 60 * 1000
const PREFETCH_WORKERS = 4

function cacheKey(title: string) {
  return title.trim().replace(/_/g, ' ')
}

function readStore(): Record<string, { at: number; portrait: WikiPortrait | null }> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, { at: number; portrait: WikiPortrait | null }>) : {}
  } catch {
    return {}
  }
}

function writeStore(title: string, portrait: WikiPortrait | null) {
  if (typeof window === 'undefined') return
  try {
    const store = readStore()
    store[title] = { at: Date.now(), portrait }
    window.localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    /* quota / private mode */
  }
}

function fromStore(title: string): WikiPortrait | null | undefined {
  const entry = readStore()[title]
  if (!entry) return undefined
  if (Date.now() - entry.at > STORE_MS) return undefined
  return entry.portrait
}

function preloadImage(url: string) {
  if (typeof window === 'undefined') return
  const img = new Image()
  img.decoding = 'async'
  img.src = url
}

export function peekWikiPortrait(title: string): WikiPortrait | null | undefined {
  const key = cacheKey(title)
  if (!key) return undefined
  if (cache.has(key)) return cache.get(key)
  const stored = fromStore(key)
  if (stored !== undefined) {
    cache.set(key, stored)
    if (stored?.url) preloadImage(stored.url)
    return stored
  }
  return undefined
}

export async function fetchWikiPortrait(title: string): Promise<WikiPortrait | null> {
  const key = cacheKey(title)
  if (!key) return null
  const hit = cache.get(key)
  if (hit !== undefined) {
    if (hit?.url) preloadImage(hit.url)
    return hit
  }
  const stored = fromStore(key)
  if (stored !== undefined) {
    cache.set(key, stored)
    if (stored?.url) preloadImage(stored.url)
    return stored
  }
  const pending = inflight.get(key)
  if (pending) return pending

  const request = (async () => {
    try {
      const params = new URLSearchParams({ title: key })
      const response = await fetch(`/api/wiki-portrait?${params}`)
      if (!response.ok) return null
      const body: unknown = await response.json()
      const portrait =
        body &&
        typeof body === 'object' &&
        'portrait' in body &&
        body.portrait &&
        typeof body.portrait === 'object' &&
        'url' in body.portrait &&
        typeof body.portrait.url === 'string'
          ? (body.portrait as WikiPortrait)
          : null
      cache.set(key, portrait)
      writeStore(key, portrait)
      if (portrait?.url) preloadImage(portrait.url)
      return portrait
    } catch {
      cache.set(key, null)
      return null
    } finally {
      inflight.delete(key)
    }
  })()

  inflight.set(key, request)
  return request
}

export function prefetchWikiPortraits(titles: string[]) {
  const unique = [...new Set(titles.map(cacheKey).filter(Boolean))]
  if (unique.length === 0) return
  let next = 0
  const workers = Array.from({ length: Math.min(PREFETCH_WORKERS, unique.length) }, async () => {
    while (next < unique.length) {
      const title = unique[next++]
      if (!title) return
      await fetchWikiPortrait(title)
    }
  })
  void Promise.all(workers)
}
