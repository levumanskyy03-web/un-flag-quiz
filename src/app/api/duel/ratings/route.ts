import { isPlayerId } from '../../../../lib/leaderboard'
import { isQuizWorld } from '../../../../lib/quiz'
import { readDuelRatings, type DuelRatingWorld } from '../../../../lib/duelRatingStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const world = parseWorld(url.searchParams.get('world'))
  const meParam = url.searchParams.get('me') ?? undefined
  const me = meParam && isPlayerId(meParam) ? meParam : undefined
  try {
    const stored = await readDuelRatings(world, me)
    return Response.json(stored)
  } catch {
    return Response.json({ configured: false, entries: [] }, { status: 503 })
  }
}

function parseWorld(value: string | null): DuelRatingWorld {
  if (value === 'all' || isQuizWorld(value)) return value
  return 'all'
}
