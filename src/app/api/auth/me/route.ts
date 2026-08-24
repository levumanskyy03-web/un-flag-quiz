import { isAvatarId } from '../../../../data/avatars'
import {
  SESSION_COOKIE,
  accountFromRequest,
  authResponse,
  changePassword,
  parsePassword,
  publicAccountName,
  readCookie,
  updateAccount,
} from '../../../../lib/authStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const user = await accountFromRequest(request)
    return authResponse({ user })
  } catch {
    return authResponse({ user: null })
  }
}

export async function PATCH(request: Request) {
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
  const token = readCookie(request, SESSION_COOKIE)

  if (record.currentPassword !== undefined || record.newPassword !== undefined) {
    const current = parsePassword(record.currentPassword)
    const next = parsePassword(record.newPassword)
    if (!current || !next) return authResponse({ error: 'invalid' }, undefined, 400)
    try {
      const result = await changePassword(token, current, next)
      if (!result.ok) {
        const status = result.error === 'auth' ? 401 : result.error === 'offline' ? 503 : 400
        return authResponse({ error: result.error }, undefined, status)
      }
      return authResponse({ user: result.user })
    } catch {
      return authResponse({ error: 'offline' }, undefined, 503)
    }
  }

  let name: string | undefined
  if (record.name !== undefined) {
    const parsed = publicAccountName(record.name)
    if (!parsed.ok) return authResponse({ error: parsed.error }, undefined, 400)
    name = parsed.name
  }
  let avatarId: string | undefined
  if (record.avatarId !== undefined) {
    if (!isAvatarId(record.avatarId)) return authResponse({ error: 'invalid' }, undefined, 400)
    avatarId = record.avatarId
  }
  try {
    const result = await updateAccount(token, {
      name,
      avatarId,
    })
    if (!result.ok) {
      const status =
        result.error === 'taken'
          ? 409
          : result.error === 'cooldown'
            ? 429
            : result.error === 'auth'
              ? 401
              : result.error === 'offline'
                ? 503
                : 400
      return authResponse({ error: result.error }, undefined, status)
    }
    return authResponse({ user: result.user })
  } catch {
    return authResponse({ error: 'offline' }, undefined, 503)
  }
}
