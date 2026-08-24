import { NextRequest } from 'next/server'
import { SESSION_COOKIE, authResponse, nameAvailable, readCookie } from '../../../../lib/authStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name')
  if (!name) return authResponse({ error: 'invalid' }, undefined, 400)
  try {
    const result = await nameAvailable(name, readCookie(request, SESSION_COOKIE))
    if (!result.ok) {
      const status = result.error === 'offline' ? 503 : 400
      return authResponse({ error: result.error }, undefined, status)
    }
    return authResponse({ available: result.available })
  } catch {
    return authResponse({ error: 'offline' }, undefined, 503)
  }
}
