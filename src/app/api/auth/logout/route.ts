import { clearSessionResponse, dropAllSessions, dropSession, readCookie, SESSION_COOKIE } from '../../../../lib/authStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const token = readCookie(request, SESSION_COOKIE)
  let everywhere = false
  try {
    const body: unknown = await request.json()
    everywhere = Boolean(body && typeof body === 'object' && (body as { all?: unknown }).all === true)
  } catch {
    everywhere = false
  }
  try {
    if (everywhere) await dropAllSessions(token)
    else await dropSession(token)
  } catch {
    /* cookie still cleared */
  }
  return clearSessionResponse({ ok: true })
}
