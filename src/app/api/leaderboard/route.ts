import { LEVEL_COUNT } from '../../../data/levels'
import {
  RATING_LEVEL_MAX,
  RATING_LEVELS_MAX,
  RATING_XP_MAX,
  isPlayerId,
  parseRatingBoard,
  type RatingBoard,
} from '../../../lib/leaderboard'
import { accountFromRequest } from '../../../lib/authStore'
import { publicEntries, readRating, upsertRatings } from '../../../lib/leaderboardStore'
import { isQuizMode, type QuizMode } from '../../../lib/quiz'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const board = parseRatingBoard(url.searchParams)
  const meParam = url.searchParams.get('me') ?? undefined
  if (!board) {
    return Response.json({ error: 'bad request' }, { status: 400 })
  }
  try {
    const session = await accountFromRequest(request).catch(() => null)
    const me = session?.id ?? meParam
    const stored = await readRating(board)
    return Response.json({
      configured: stored.configured,
      entries: publicEntries(stored.entries, me && isPlayerId(me) ? me : undefined),
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
  const parsed = parseBody(body)
  if (parsed === null) {
    return Response.json({ error: 'bad request' }, { status: 400 })
  }
  try {
    const saved = await upsertRatings(
      parsed.map((item) => ({
        board: item.board,
        incoming: {
          id: session.id,
          name: session.name,
          at: Date.now(),
          ...item.entry,
        },
      })),
    )
    if (!saved.configured) {
      return Response.json({ configured: false }, { status: 503 })
    }
    return Response.json({ ok: true })
  } catch {
    return Response.json({ configured: false }, { status: 503 })
  }
}

function parseBody(body: unknown): null | Array<{
  board: RatingBoard
  entry: { levelsCleared: number; totalMs: number; xp?: number; level?: number }
}> {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  if (Array.isArray(record.items)) {
    const items: Array<{
      board: RatingBoard
      entry: { levelsCleared: number; totalMs: number; xp?: number; level?: number }
    }> = []
    for (const item of record.items) {
      const parsed = parseEntry(item)
      if (parsed === null) return null
      items.push(parsed)
    }
    return items.length > 0 ? items : null
  }
  const single = parseEntry(body)
  return single ? [single] : null
}

function parseEntry(body: unknown): null | {
  board: RatingBoard
  entry: { levelsCleared: number; totalMs: number; xp?: number; level?: number }
} {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  const boardName = typeof record.board === 'string' ? record.board : 'mode'
  if (boardName === 'xp') {
    if (typeof record.xp !== 'number' || !Number.isInteger(record.xp)) return null
    if (typeof record.level !== 'number' || !Number.isInteger(record.level)) return null
    if (record.xp < 1 || record.xp > RATING_XP_MAX) return null
    if (record.level < 1 || record.level > RATING_LEVEL_MAX) return null
    return {
      board: { kind: 'xp' },
      entry: { levelsCleared: 0, totalMs: 0, xp: record.xp, level: record.level },
    }
  }
  if (typeof record.hardcore !== 'boolean') return null
  if (typeof record.levelsCleared !== 'number' || !Number.isInteger(record.levelsCleared)) return null
  if (boardName === 'clears') {
    if (record.levelsCleared < 1 || record.levelsCleared > RATING_LEVELS_MAX) return null
    return {
      board: { kind: 'clears', hardcore: record.hardcore },
      entry: { levelsCleared: record.levelsCleared, totalMs: 0 },
    }
  }
  if (typeof record.mode !== 'string' || !isQuizMode(record.mode)) return null
  const mode: QuizMode = record.mode
  const totalMs =
    typeof record.totalMs === 'number' && Number.isFinite(record.totalMs) ? Math.round(record.totalMs) : 0
  if (record.levelsCleared < 1 || record.levelsCleared > LEVEL_COUNT) return null
  if (totalMs < 0 || totalMs > LEVEL_COUNT * 3_600_000) return null
  return {
    board: { kind: 'mode', mode, hardcore: record.hardcore },
    entry: { levelsCleared: record.levelsCleared, totalMs },
  }
}
