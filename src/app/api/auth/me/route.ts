import { accountFromRequest, authResponse } from '../../../../lib/authStore'

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
