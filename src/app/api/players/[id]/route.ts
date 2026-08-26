import { isAchievementId } from '../../../../data/achievements'
import { isPlayerId } from '../../../../lib/leaderboard'
import { publicProfileById, type PublicPlayerProfile } from '../../../../lib/authStore'
import { readRating } from '../../../../lib/leaderboardStore'
import { accountLevel } from '../../../../lib/xp'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(_request: Request, context: RouteContext<'/api/players/[id]'>) {
  const { id } = await context.params
  if (!isPlayerId(id)) {
    return Response.json({ error: 'invalid' }, { status: 400 })
  }
  try {
    const profile = await publicProfileById(id)
    if (!profile) {
      return Response.json({ error: 'missing' }, { status: 404 })
    }
    const player = await withBoardStats(profile)
    return Response.json({ player })
  } catch {
    return Response.json({ error: 'offline' }, { status: 503 })
  }
}

async function withBoardStats(profile: PublicPlayerProfile): Promise<PublicPlayerProfile> {
  if (profile.xp > 0) return profile
  try {
    const stored = await readRating({ kind: 'xp' })
    const entry = stored.entries.find((item) => item.id === profile.id)
    if (!entry) return profile
    const xp = entry.xp ?? 0
    const level = entry.level && entry.level >= 1 ? entry.level : accountLevel(xp)
    return {
      ...profile,
      xp,
      level,
      achievementIds: profile.achievementIds.filter(isAchievementId),
    }
  } catch {
    return profile
  }
}
