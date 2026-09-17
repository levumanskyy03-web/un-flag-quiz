import {
  authResponse,
  clearSessionResponse,
  deleteAccount,
  parsePassword,
  readCookie,
  SESSION_COOKIE,
} from '../../../../lib/authStore'
import { clientIp, consumeRateLimit } from '../../../../lib/rateLimit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return authResponse({ error: 'invalid' }, undefined, 400)
  }
  if (!body || typeof body !== 'object') {
    return authResponse({ error: 'invalid' }, undefined, 400)
  }
  const ipAllowed = await consumeRateLimit(`delete:ip:${clientIp(request)}`, 8, 15 * 60)
  if (!ipAllowed) {
    return authResponse({ error: 'limited' }, undefined, 429)
  }
  const password = parsePassword((body as Record<string, unknown>).password)
  if (!password) {
    return authResponse({ error: 'invalid' }, undefined, 400)
  }
  try {
    const result = await deleteAccount(readCookie(request, SESSION_COOKIE), password)
    if (!result.ok) {
      const status = result.error === 'auth' ? 401 : result.error === 'offline' ? 503 : 400
      return authResponse({ error: result.error }, undefined, status)
    }
    return clearSessionResponse({ ok: true })
  } catch {
    return authResponse({ error: 'offline' }, undefined, 503)
  }
}
