import { accountFromRequest, publicProfileById } from '../../../../lib/authStore'
import { BOARD_FREE_TOP, access } from '../../../../lib/empire/gates'
import { readBoard, readEmpire, readRank } from '../../../../lib/empireServerStore'

export const runtime = 'nodejs'

const BOARD_LIMIT = 50

export async function GET(request: Request) {
  const url = new URL(request.url)
  const wanted = Math.min(BOARD_LIMIT, Math.max(1, Number(url.searchParams.get('limit')) || 20))
  try {
    const account = await accountFromRequest(request).catch(() => null)
    const state = account ? await readEmpire(account.id).catch(() => null) : null
    // Полный топ и профили — по подписке или с эпохи 3; остальным топ-10 без профилей.
    const full = state ? access(state, { kind: 'board' }) === 'open' : false
    const limit = full ? wanted : Math.min(wanted, BOARD_FREE_TOP)
    const rows = await readBoard(limit)
    const entries = await Promise.all(
      rows.map(async (row) => {
        const [profile, empire] = await Promise.all([
          publicProfileById(row.id).catch(() => null),
          readEmpire(row.id).catch(() => null),
        ])
        return {
          id: full ? row.id : null,
          score: row.score,
          name: profile?.name ?? null,
          avatarId: full ? (profile?.avatarId ?? null) : null,
          countryIso: profile?.countryIso ?? null,
          title: empire?.title ?? null,
          goldFlag: empire?.unlocks.includes('legacy:goldFlag') ?? false,
        }
      }),
    )
    const rank = account ? await readRank(account.id).catch(() => null) : null
    return Response.json({ entries, rank, full }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ entries: [], rank: null, full: false }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
