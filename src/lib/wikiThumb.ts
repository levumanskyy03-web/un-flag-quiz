import type { WikiPortrait } from './wikiPortrait'

export type { WikiPortrait }

export interface PortraitRequest {
  title: string
  file?: string
}

const cache = new Map<string, WikiPortrait | null>()
const inflight = new Map<string, Promise<WikiPortrait | null>>()
const STORE_KEY = 'unfq-wiki-portraits-v13'
const PORTRAIT_API_VER = '13'
const STORE_MS = 14 * 24 * 60 * 60 * 1000
const NULL_STORE_MS = 6 * 60 * 60 * 1000
const PREFETCH_WORKERS = 4
const STORE_MAX = 120
let activeFetches = 0
const fetchWaiters: Array<() => void> = []

function cacheKey(title: string, file?: string) {
  const wiki = title.trim().replace(/_/g, ' ')
  const extra = file?.trim().replace(/_/g, ' ')
  if (!wiki) return ''
  return extra ? `${wiki}::${extra}` : wiki
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
  const store = readStore()
  store[title] = { at: Date.now(), portrait }
  let entries = Object.entries(store).sort((a, b) => b[1].at - a[1].at).slice(0, STORE_MAX)
  for (;;) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(Object.fromEntries(entries)))
      return
    } catch {
      if (entries.length <= 1) return
      entries = entries.slice(0, Math.max(1, entries.length - 16))
    }
  }
}

function fromStore(title: string): WikiPortrait | null | undefined {
  const entry = readStore()[title]
  if (!entry) return undefined
  const ttl = entry.portrait ? STORE_MS : NULL_STORE_MS
  if (Date.now() - entry.at > ttl) return undefined
  return entry.portrait
}

async function acquireFetchSlot() {
  if (activeFetches >= PREFETCH_WORKERS) {
    await new Promise<void>((resolve) => {
      fetchWaiters.push(resolve)
    })
  }
  activeFetches += 1
}

function releaseFetchSlot() {
  activeFetches = Math.max(0, activeFetches - 1)
  fetchWaiters.shift()?.()
}

function preloadImage(url: string) {
  if (typeof window === 'undefined') return
  const img = new Image()
  img.decoding = 'async'
  img.src = url
}

export function peekWikiPortrait(title: string, file?: string): WikiPortrait | null | undefined {
  const key = cacheKey(title, file)
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

export async function fetchWikiPortrait(title: string, file?: string): Promise<WikiPortrait | null> {
  const key = cacheKey(title, file)
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
    await acquireFetchSlot()
    try {
      const params = new URLSearchParams({ title: title.trim().replace(/_/g, ' '), v: PORTRAIT_API_VER })
      if (file?.trim()) params.set('file', file.trim().replace(/_/g, ' '))
      let response: Response | null = null
      for (let attempt = 0; attempt < 4; attempt += 1) {
        response = await fetch(`/api/wiki-portrait?${params}`)
        if (response.ok || (response.status !== 503 && response.status !== 429 && response.status !== 502)) break
        await new Promise((resolve) => {
          setTimeout(resolve, 700 * (attempt + 1))
        })
      }
      if (!response?.ok) return null
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
      if (portrait) {
        cache.set(key, portrait)
        writeStore(key, portrait)
        preloadImage(portrait.url)
      }
      return portrait
    } catch {
      return null
    } finally {
      releaseFetchSlot()
      inflight.delete(key)
    }
  })()

  inflight.set(key, request)
  return request
}

function asRequest(item: string | PortraitRequest): PortraitRequest {
  return typeof item === 'string' ? { title: item } : item
}

export function prefetchWikiPortraits(titles: Array<string | PortraitRequest>) {
  const unique: PortraitRequest[] = []
  const seen = new Set<string>()
  for (const item of titles) {
    const req = asRequest(item)
    const key = cacheKey(req.title, req.file)
    if (!key || seen.has(key)) continue
    seen.add(key)
    unique.push(req)
  }
  if (unique.length === 0) return
  let next = 0
  const workers = Array.from({ length: Math.min(PREFETCH_WORKERS, unique.length) }, async () => {
    while (next < unique.length) {
      const req = unique[next++]
      if (!req) return
      await fetchWikiPortrait(req.title, req.file)
    }
  })
  void Promise.all(workers)
}
