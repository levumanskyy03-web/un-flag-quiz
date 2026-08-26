import { LEVEL_COUNT, isLevelNumber } from '../../../data/levels'
import { parseAchievementIds } from '../../../data/achievements'
import {
  RATING_LEVEL_MAX,
  RATING_LEVELS_MAX,
  RATING_XP_MAX,
  isPlayerId,
  parseRatingBoard,
  type RatingBoard,
} from '../../../lib/leaderboard'
import { accountFromRequest, publishPlayerStats } from '../../../lib/authStore'
import { publicEntries, readLevelBests, readRating, upsertLevelBest, upsertRatings } from '../../../lib/leaderboardStore'
import { isQuizMode, type QuizMode } from '../../../lib/quiz'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  if (url.searchParams.get('board') === 'levelBests') {
    const mode = url.searchParams.get('mode')
    const hardcore = url.searchParams.get('hardcore') === '1'
    const meParam = url.searchParams.get('me') ?? undefined
    if (!mode || !isQuizMode(mode)) {
      return Response.json({ error: 'bad request' }, { status: 400 })
    }
    try {
      const session = await accountFromRequest(request).catch(() => null)
      const me = session?.id ?? meParam
      const stored = await readLevelBests(mode, hardcore)
      const records: Record<
        number,
        { name: string; roundMs: number; livesLeft: number; you: boolean }
      > = {}
      for (const [level, entry] of Object.entries(stored.records)) {
        records[Number(level)] = {
          name: entry.name,
          roundMs: entry.totalMs,
          livesLeft: entry.livesLeft ?? 0,
          you: Boolean(me && isPlayerId(me) && entry.id === me),
        }
      }
      return Response.json({ configured: stored.configured, records })
    } catch {
      return Response.json({ configured: false, records: {} }, { status: 503 })
    }
  }
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
  const levelBest = parseLevelBest(body)
  if (levelBest) {
    try {
      const saved = await upsertLevelBest(levelBest.board, {
        id: session.id,
        name: session.name,
        at: Date.now(),
        levelsCleared: 0,
        totalMs: levelBest.roundMs,
        livesLeft: levelBest.livesLeft,
      })
      if (!saved.configured) {
        return Response.json({ configured: false }, { status: 503 })
      }
      return Response.json({
        ok: true,
        beat: saved.accepted && saved.previous !== null,
        previousName: saved.previous?.name ?? null,
      })
    } catch {
      return Response.json({ configured: false }, { status: 503 })
    }
  }
  const parsed = parseBody(body)
  const achievements = parseAchievementIds(
    body && typeof body === 'object' ? (body as { achievements?: unknown }).achievements : undefined,
  )
  if (parsed === null && achievements === undefined) {
    return Response.json({ error: 'bad request' }, { status: 400 })
  }
  try {
    if (parsed && parsed.length > 0) {
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
    }
    const xpItem = parsed?.find((item) => item.board.kind === 'xp')
    await publishPlayerStats(session.id, {
      xp: xpItem?.entry.xp,
      level: xpItem?.entry.level,
      achievementIds: achievements,
    })
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
    return items
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

function parseLevelBest(body: unknown): null | {
  board: Extract<RatingBoard, { kind: 'levelBest' }>
  roundMs: number
  livesLeft: number
} {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  if (record.board !== 'levelBest') return null
  if (typeof record.mode !== 'string' || !isQuizMode(record.mode)) return null
  if (typeof record.hardcore !== 'boolean') return null
  if (typeof record.level !== 'number' || !isLevelNumber(record.level)) return null
  if (typeof record.roundMs !== 'number' || !Number.isFinite(record.roundMs)) return null
  const roundMs = Math.round(record.roundMs)
  const livesLeft =
    typeof record.livesLeft === 'number' && Number.isFinite(record.livesLeft) ? Math.round(record.livesLeft) : 0
  if (roundMs < 1 || roundMs > 3_600_000) return null
  if (livesLeft < 0 || livesLeft > 200) return null
  return {
    board: { kind: 'levelBest', mode: record.mode, level: record.level, hardcore: record.hardcore },
    roundMs,
    livesLeft,
  }
}
