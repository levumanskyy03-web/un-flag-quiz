import { LEVEL_COUNT } from '../../../data/levels'
import { isPlayerId } from '../../../lib/leaderboard'
import { accountFromRequest } from '../../../lib/authStore'
import { publicEntries, readBoard, upsertBoardEntry } from '../../../lib/leaderboardStore'
import { isQuizMode, type QuizMode } from '../../../lib/quiz'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('mode')
  const hardcore = url.searchParams.get('hardcore') === '1'
  const meParam = url.searchParams.get('me') ?? undefined
  if (!isQuizMode(mode)) {
    return Response.json({ error: 'bad request' }, { status: 400 })
  }
  try {
    const session = await accountFromRequest(request).catch(() => null)
    const me = session?.id ?? meParam
    const board = await readBoard(mode, hardcore)
    return Response.json({
      configured: board.configured,
      entries: publicEntries(board.entries, me && isPlayerId(me) ? me : undefined),
    })
  } catch {
    return Response.json({ configured: false, entries: [] }, { status: 503 })
  }
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'bad request' }, { status: 400 })
  }
  const session = await accountFromRequest(request).catch(() => null)
  if (!session) {
    return Response.json({ error: 'auth' }, { status: 401 })
  }
  const parsed = parseEntry(body)
  if (parsed === null) {
    return Response.json({ error: 'bad request' }, { status: 400 })
  }
  try {
    const saved = await upsertBoardEntry(parsed.mode, parsed.hardcore, {
      id: session.id,
      name: session.name,
      levelsCleared: parsed.levelsCleared,
      totalMs: parsed.totalMs,
      at: Date.now(),
    })
    if (!saved.configured) {
      return Response.json({ configured: false }, { status: 503 })
    }
    return Response.json({ ok: true })
  } catch {
    return Response.json({ configured: false }, { status: 503 })
  }
}

function parseEntry(body: unknown): null | {
  mode: QuizMode
  hardcore: boolean
  levelsCleared: number
  totalMs: number
} {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  if (typeof record.mode !== 'string' || !isQuizMode(record.mode)) return null
  if (typeof record.hardcore !== 'boolean') return null
  if (typeof record.levelsCleared !== 'number' || !Number.isInteger(record.levelsCleared)) return null
  if (typeof record.totalMs !== 'number' || !Number.isFinite(record.totalMs)) return null
  const totalMs = Math.round(record.totalMs)
  if (record.levelsCleared < 1 || record.levelsCleared > LEVEL_COUNT) return null
  if (totalMs < 0 || totalMs > LEVEL_COUNT * 3_600_000) return null
  return {
    mode: record.mode,
    hardcore: record.hardcore,
    levelsCleared: record.levelsCleared,
    totalMs,
  }
}
