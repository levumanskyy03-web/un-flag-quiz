import { isAllowedLeaderWiki, lookupWikiPortrait } from '../../../lib/wikiPortrait'

export const runtime = 'nodejs'
export const revalidate = 86400

const memory = new Map<string, { at: number; body: string }>()
const MEMORY_MS = 24 * 60 * 60 * 1000
const CACHE_VER = 2

export async function GET(request: Request) {
  const title = new URL(request.url).searchParams.get('title') ?? ''
  if (!isAllowedLeaderWiki(title)) {
    return Response.json({ portrait: null }, { status: 400 })
  }

  const key = `${CACHE_VER}:${title.trim().replace(/_/g, ' ')}`
  const cached = memory.get(key)
  if (cached && Date.now() - cached.at < MEMORY_MS) {
    return new Response(cached.body, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' },
    })
  }

  try {
    const portrait = await lookupWikiPortrait(title)
    const body = JSON.stringify({ portrait })
    memory.set(key, { at: Date.now(), body })
    return new Response(body, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' },
    })
  } catch {
    return Response.json({ portrait: null }, { status: 503 })
  }
}
