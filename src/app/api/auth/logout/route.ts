import { clearSessionResponse, dropSession, readCookie, SESSION_COOKIE } from '../../../../lib/authStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    await dropSession(readCookie(request, SESSION_COOKIE))
  } catch {
    return clearSessionResponse({ ok: true })
  }
  return clearSessionResponse({ ok: true })
}
