import { LEVEL_COUNT } from '../../../data/levels'
import {
  NAME_MIN,
  isPlayerId,
  sanitizeName,
} from '../../../lib/leaderboard'
import { publicEntries, readBoard, upsertBoardEntry } from '../../../lib/leaderboardStore'
import type { QuizMode } from '../../../lib/quiz'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isQuizMode(value: string | null): value is QuizMode {
  return value === 'flagToName' || value === 'nameToFlag'
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('mode')
  const hardcore = url.searchParams.get('hardcore') === '1'
  const me = url.searchParams.get('me') ?? undefined
  if (!isQuizMode(mode)) {
    return Response.json({ error: 'bad request' }, { status: 400 })
  }
  try {
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
  const parsed = parseEntry(body)
  if (parsed === null) {
    return Response.json({ error: 'bad request' }, { status: 400 })
  }
  try {
    const saved = await upsertBoardEntry(parsed.mode, parsed.hardcore, {
      id: parsed.id,
      name: parsed.name,
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
  id: string
  name: string
  mode: QuizMode
  hardcore: boolean
  levelsCleared: number
  totalMs: number
} {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  if (typeof record.id !== 'string' || !isPlayerId(record.id)) return null
  if (typeof record.mode !== 'string' || !isQuizMode(record.mode)) return null
  if (typeof record.hardcore !== 'boolean') return null
  if (typeof record.name !== 'string') return null
  const name = sanitizeName(record.name)
  if (name.length < NAME_MIN) return null
  if (typeof record.levelsCleared !== 'number' || !Number.isInteger(record.levelsCleared)) return null
  if (typeof record.totalMs !== 'number' || !Number.isFinite(record.totalMs)) return null
  const totalMs = Math.round(record.totalMs)
  if (record.levelsCleared < 1 || record.levelsCleared > LEVEL_COUNT) return null
  if (totalMs < 0 || totalMs > LEVEL_COUNT * 3_600_000) return null
  return {
    id: record.id,
    name,
    mode: record.mode,
    hardcore: record.hardcore,
    levelsCleared: record.levelsCleared,
    totalMs,
  }
}
