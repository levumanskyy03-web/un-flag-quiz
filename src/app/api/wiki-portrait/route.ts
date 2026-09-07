import { isAllowedLeaderWiki, lookupWikiPortrait } from '../../../lib/wikiPortrait'

export const runtime = 'nodejs'
export const revalidate = 86400

const memory = new Map<string, { at: number; body: string }>()
const MEMORY_MS = 24 * 60 * 60 * 1000
const CACHE_VER = 13

export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') ?? ''
  const file = url.searchParams.get('file') ?? ''
  if (!isAllowedLeaderWiki(title)) {
    return Response.json({ portrait: null }, { status: 400 })
  }

  const key = `${CACHE_VER}:${title.trim().replace(/_/g, ' ')}:${file.trim().replace(/_/g, ' ')}`
  const cached = memory.get(key)
  const cacheHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
  }
  if (cached && Date.now() - cached.at < MEMORY_MS) {
    return new Response(cached.body, { headers: cacheHeaders })
  }

  try {
    const portrait = await lookupWikiPortrait(title, file || undefined)
    const body = JSON.stringify({ portrait })
    if (portrait) memory.set(key, { at: Date.now(), body })
    return new Response(body, {
      headers: {
        ...cacheHeaders,
        'Cache-Control': portrait
          ? cacheHeaders['Cache-Control']
          : 'no-store',
      },
    })
  } catch {
    return Response.json({ portrait: null }, { status: 503 })
  }
}
