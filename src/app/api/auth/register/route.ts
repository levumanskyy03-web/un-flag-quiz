import { isAvatarId } from '../../../../data/avatars'
import {
  authResponse,
  parsePassword,
  publicAccountName,
  registerAccount,
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
  const ipAllowed = await consumeRateLimit(`register:ip:${clientIp(request)}`, 5, 60 * 60)
  if (!ipAllowed) {
    return authResponse({ error: 'limited' }, undefined, 429)
  }
  const parsed = publicAccountName(record.name)
  const password = parsePassword(record.password)
  if (!parsed.ok) {
    return authResponse({ error: parsed.error }, undefined, 400)
  }
  if (!password) {
    return authResponse({ error: 'invalid' }, undefined, 400)
  }
  const name = parsed.name
  const avatarId = isAvatarId(record.avatarId) ? record.avatarId : undefined
  try {
    const result = await registerAccount(name, password, avatarId)
    if (!result.ok) {
      const status = result.error === 'taken' ? 409 : 503
      return authResponse({ error: result.error }, undefined, status)
    }
    return authResponse({ user: result.user }, result.token)
  } catch {
    return authResponse({ error: 'offline' }, undefined, 503)
  }
}
