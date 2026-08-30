import type { WikiPortrait } from './wikiPortrait'

const cache = new Map<string, WikiPortrait | null>()
const inflight = new Map<string, Promise<WikiPortrait | null>>()

export type { WikiPortrait }

export async function fetchWikiPortrait(title: string): Promise<WikiPortrait | null> {
  const hit = cache.get(title)
  if (hit !== undefined) return hit
  const pending = inflight.get(title)
  if (pending) return pending

  const request = (async () => {
    try {
      const params = new URLSearchParams({ title })
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
      cache.set(title, portrait)
      return portrait
    } catch {
      cache.set(title, null)
      return null
    } finally {
      inflight.delete(title)
    }
  })()

  inflight.set(title, request)
  return request
}
