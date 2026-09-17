import { NextResponse, type NextRequest } from 'next/server'

const CANONICAL_HOST = 'www.geoguiz.online'

export function proxy(request: NextRequest) {
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
