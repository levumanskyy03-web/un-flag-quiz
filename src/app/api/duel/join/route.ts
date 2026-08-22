import { joinDuelRoom, normalizeCode, parseDuelName, parsePlayerId, viewFor } from '../../../../lib/duelStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 })
  }
  if (!body || typeof body !== 'object') return Response.json({ error: 'invalid' }, { status: 400 })
  const record = body as Record<string, unknown>
  const code = normalizeCode(record.code)
  const playerId = parsePlayerId(record.playerId)
  if (!code || !playerId) return Response.json({ error: 'invalid' }, { status: 400 })
  try {
    const result = await joinDuelRoom(code, playerId, parseDuelName(record.name))
    if (!result.ok) {
      const status = result.error === 'missing' ? 404 : result.error === 'full' ? 409 : 503
      return Response.json({ error: result.error }, { status })
    }
    return Response.json({ room: viewFor(result.room, playerId) })
  } catch {
    return Response.json({ error: 'offline' }, { status: 503 })
  }
}
