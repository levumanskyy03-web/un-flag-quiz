import { createDuelRoom, parseCreateBody, viewFor } from '../../../../lib/duelStore'
import { requireGate } from '../../../../lib/empire/serverGate'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const gate = await requireGate(request, { kind: 'duelRoom' })
  if (gate) return gate
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 })
  }
  const parsed = parseCreateBody(body)
  if (!parsed) return Response.json({ error: 'invalid' }, { status: 400 })
  try {
    const result = await createDuelRoom(parsed)
    if (!result.ok) {
      return Response.json({ error: result.error }, { status: result.error === 'empty' ? 400 : 503 })
    }
    const view = viewFor(result.room, parsed.playerId)
    return Response.json({ room: view })
  } catch {
    return Response.json({ error: 'offline' }, { status: 503 })
  }
}
