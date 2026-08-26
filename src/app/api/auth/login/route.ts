import {
  authResponse,
  loginAccount,
  parseAccountName,
  parsePassword,
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
  const record = body as Record<string, unknown>
  const ip = clientIp(request)
  const ipAllowed = await consumeRateLimit(`login:ip:${ip}`, 10, 15 * 60)
  const name = parseAccountName(record.name)
  const nameAllowed = name
    ? await consumeRateLimit(`login:name:${name.toLocaleLowerCase()}`, 8, 15 * 60)
    : true
  if (!ipAllowed || !nameAllowed) {
    return authResponse({ error: 'limited' }, undefined, 429)
  }
  const password = parsePassword(record.password)
  if (!name || !password) {
    return authResponse({ error: 'invalid' }, undefined, 400)
  }
  try {
    const result = await loginAccount(name, password)
    if (!result.ok) {
      const status = result.error === 'auth' ? 401 : 503
      return authResponse({ error: result.error }, undefined, status)
    }
    return authResponse({ user: result.user }, result.token)
  } catch {
    return authResponse({ error: 'offline' }, undefined, 503)
  }
}
