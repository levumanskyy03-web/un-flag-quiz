import {
  authResponse,
  loginAccount,
  parseAccountName,
  parsePassword,
} from '../../../../lib/authStore'

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
  const name = parseAccountName(record.name)
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
