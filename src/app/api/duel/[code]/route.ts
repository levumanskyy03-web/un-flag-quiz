import {
  answerDuel,
  leaveDuel,
  normalizeCode,
  parsePlayerId,
  readDuel,
  rematchDuel,
  viewFor,
} from '../../../../lib/duelStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request, context: RouteContext<'/api/duel/[code]'>) {
  const { code: raw } = await context.params
  const code = normalizeCode(raw)
  const playerId = parsePlayerId(new URL(request.url).searchParams.get('playerId'))
  if (!code || !playerId) return Response.json({ error: 'invalid' }, { status: 400 })
  try {
    const room = await readDuel(code)
    if (!room) return Response.json({ error: 'missing' }, { status: 404 })
    const view = viewFor(room, playerId)
    if (!view) return Response.json({ error: 'forbidden' }, { status: 403 })
    return Response.json({ room: view })
  } catch {
    return Response.json({ error: 'offline' }, { status: 503 })
  }
}

export async function POST(request: Request, context: RouteContext<'/api/duel/[code]'>) {
  const { code: raw } = await context.params
  const code = normalizeCode(raw)
  if (!code) return Response.json({ error: 'invalid' }, { status: 400 })
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 })
  }
  if (!body || typeof body !== 'object') return Response.json({ error: 'invalid' }, { status: 400 })
  const record = body as Record<string, unknown>
  const playerId = parsePlayerId(record.playerId)
  if (!playerId) return Response.json({ error: 'invalid' }, { status: 400 })
  try {
    if (record.action === 'leave') {
      await leaveDuel(code, playerId)
      return Response.json({ ok: true })
    }
    if (record.action === 'rematch') {
      const room = await rematchDuel(code, playerId)
      if (!room) return Response.json({ error: 'missing' }, { status: 404 })
      const view = viewFor(room, playerId)
      if (!view) return Response.json({ error: 'forbidden' }, { status: 403 })
      return Response.json({ room: view })
    }
    const iso = record.iso === null || typeof record.iso === 'string' ? record.iso : undefined
    if (iso === undefined) return Response.json({ error: 'invalid' }, { status: 400 })
    const room = await answerDuel(code, playerId, iso)
    if (!room) return Response.json({ error: 'missing' }, { status: 404 })
    const view = viewFor(room, playerId)
    if (!view) return Response.json({ error: 'forbidden' }, { status: 403 })
    return Response.json({ room: view })
  } catch {
    return Response.json({ error: 'offline' }, { status: 503 })
  }
}
