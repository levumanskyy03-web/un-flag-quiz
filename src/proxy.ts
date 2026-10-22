import { NextResponse, type NextRequest } from 'next/server'
import { isNativeAppOrigin, nativeCorsHeaders } from './lib/nativeOrigin'

const CANONICAL_HOST = 'www.geoguiz.online'

function nativeCors(request: NextRequest): NextResponse | null {
  if (!request.nextUrl.pathname.startsWith('/api/')) return null
  const origin = request.headers.get('origin')
  if (!origin || !isNativeAppOrigin(request)) return null
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: nativeCorsHeaders(origin) })
  }
  const response = NextResponse.next()
  for (const [key, value] of Object.entries(nativeCorsHeaders(origin))) {
    response.headers.set(key, value)
  }
  return response
}

export function proxy(request: NextRequest) {
  const cors = nativeCors(request)
  if (cors) return cors
  const host = request.headers.get('host')?.split(':')[0] ?? ''
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) {
    return NextResponse.next()
  }
  if (host === CANONICAL_HOST) return NextResponse.next()
  if (host.endsWith('.vercel.app') && host !== 'un-flag-quiz.vercel.app') {
    return NextResponse.next()
  }
  if (host === 'geoguiz.online' || host === 'un-flag-quiz.vercel.app') {
    const url = request.nextUrl.clone()
    url.host = CANONICAL_HOST
    return NextResponse.redirect(url, 308)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.svg).*)'],
}
