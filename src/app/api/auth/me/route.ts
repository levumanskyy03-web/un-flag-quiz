import { isAvatarId } from '../../../../data/avatars'
import {
  SESSION_COOKIE,
  accountFromRequest,
  authResponse,
  parseAccountName,
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
  let name: string | undefined
  if (record.name !== undefined) {
    const parsed = parseAccountName(record.name)
    if (!parsed) return authResponse({ error: 'invalid' }, undefined, 400)
    name = parsed
  }
  let avatarId: string | undefined
  if (record.avatarId !== undefined) {
    if (!isAvatarId(record.avatarId)) return authResponse({ error: 'invalid' }, undefined, 400)
    avatarId = record.avatarId
  }
  try {
    const result = await updateAccount(readCookie(request, SESSION_COOKIE), {
      name,
      avatarId,
    })
    if (!result.ok) {
      const status = result.error === 'taken' ? 409 : result.error === 'auth' ? 401 : result.error === 'offline' ? 503 : 400
      return authResponse({ error: result.error }, undefined, status)
    }
    return authResponse({ user: result.user })
  } catch {
    return authResponse({ error: 'offline' }, undefined, 503)
  }
}

