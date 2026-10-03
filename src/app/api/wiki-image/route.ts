import { WIKI_UA, isAllowedLeaderWiki, lookupWikiPortrait } from '../../../lib/wikiPortrait'

export const runtime = 'nodejs'

const MAX_BYTES = 4_000_000

export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') ?? ''
  const file = url.searchParams.get('file') ?? ''
  if (!isAllowedLeaderWiki(title)) return new Response(null, { status: 404 })

  try {
    const portrait = await lookupWikiPortrait(title, file || undefined)
    if (!portrait?.url) return new Response(null, { status: 404 })
    const image = await fetch(portrait.url, {
      headers: { 'User-Agent': WIKI_UA, Accept: 'image/*' },
      signal: AbortSignal.timeout(12_000),
    })
    if (!image.ok) return new Response(null, { status: 502 })
    const type = image.headers.get('content-type') ?? ''
    if (!type.startsWith('image/')) return new Response(null, { status: 404 })
    const bytes = await image.arrayBuffer()
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_BYTES) return new Response(null, { status: 404 })
    return new Response(bytes, {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
      },
    })
  } catch {
    return new Response(null, { status: 503 })
  }
}
