import { parseAchievementIds } from '../../../data/achievements'
import { isPlayerId, parseRatingBoard } from '../../../lib/leaderboard'
import {
  accountFromRequest,
  applyRatedRound,
  publishPlayerStats,
} from '../../../lib/authStore'
import {
  publicEntries,
  readLevelBests,
  readRating,
  upsertLevelBest,
  upsertRatings,
} from '../../../lib/leaderboardStore'
import { isQuizMode } from '../../../lib/quiz'
import { clientIp, consumeRateLimit } from '../../../lib/rateLimit'
import {
  RATING_ROUND_LIMIT,
  RATING_ROUND_WINDOW_SEC,
  boardsFromServerRating,
  parseRatedRound,
  scoreRatedRound,
} from '../../../lib/ratingRound'
import { WORLD_RECORD_XP } from '../../../lib/xp'

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
  const round = parseRatedRound(body)
  if (round) {
    const allowed = await consumeRateLimit(
      `rating:${session.id}:${clientIp(request)}`,
      RATING_ROUND_LIMIT,
      RATING_ROUND_WINDOW_SEC,
    )
    if (!allowed) return Response.json({ error: 'rate' }, { status: 429 })
    const scored = scoreRatedRound(round)
    if (!scored) return Response.json({ error: 'bad request' }, { status: 400 })
    try {
      const applied = await applyRatedRound(session.id, scored, 0)
      if (!applied) return Response.json({ configured: false }, { status: 503 })
      let rating = applied
      let beat = false
      let previousName: string | null = null
      if (scored.path === 'levels' && scored.level !== undefined) {
        const saved = await upsertLevelBest(
          {
            kind: 'levelBest',
            mode: scored.mode,
            level: scored.level,
            hardcore: scored.hardcore,
          },
          {
            id: session.id,
            name: session.name,
            at: Date.now(),
            levelsCleared: 0,
            totalMs: scored.roundMs,
            livesLeft: scored.livesLeft,
          },
        )
        if (!saved.configured) {
          return Response.json({ configured: false }, { status: 503 })
        }
        beat = saved.accepted && saved.previous !== null
        previousName = saved.previous?.name ?? null
        if (beat) {
          const extra = await applyRatedRound(session.id, scored, WORLD_RECORD_XP)
          if (extra) rating = extra
        }
      }
      const items = boardsFromServerRating(rating)
      if (items.length > 0) {
        const saved = await upsertRatings(
          items.map((item) => ({
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
      return Response.json({
        ok: true,
        beat,
        previousName,
        xpGain: applied.xpGain + (rating === applied ? 0 : rating.xpGain),
      })
    } catch {
      return Response.json({ configured: false }, { status: 503 })
    }
  }
  const achievements = parseAchievementIds(
    body && typeof body === 'object' ? (body as { achievements?: unknown }).achievements : undefined,
  )
  if (achievements === undefined) {
    return Response.json({ error: 'bad request' }, { status: 400 })
  }
  try {
    await publishPlayerStats(session.id, { achievementIds: achievements })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ configured: false }, { status: 503 })
  }
}
