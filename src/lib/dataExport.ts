import { unlockedAchievementIds } from './achievements'
import { loadBests, loadHistory } from './history'
import { loadLevelClears } from './levelProgress'
import { loadLifetime, countLifetimeSeed } from './lifetime'
import { loadMistakes, loadTrainerStats } from './mistakes'
import { loadProfile } from './profile'
import { loadStamps, loadWorldStampAlbums } from './stamps'
import { loadCompany } from './companyStore'
import { loadRealm } from './stateStore'
import { loadPlayer } from './leaderboard'
import { loadTokens } from './tokenStore'
import { loadEconomy } from './economyStore'
import type { Account } from './account'

export function buildPlayerExport(account: Account | null) {
  const history = loadHistory()
  const bests = loadBests()
  const levels = loadLevelClears()
  const lifetime = loadLifetime(countLifetimeSeed(history, levels))
  const profile = loadProfile()
  return {
    exportedAt: new Date().toISOString(),
    account: account
      ? {
          id: account.id,
          name: account.name,
          countryIso: account.countryIso ?? null,
          createdAt: account.createdAt ?? null,
        }
      : null,
    device: {
      playerId: loadPlayer().id,
      name: profile.name,
      avatarId: profile.avatarId,
      hasPhoto: Boolean(profile.photo),
    },
    lifetime,
    achievements: unlockedAchievementIds(history, bests, levels, account?.createdAt),
    stamps: loadStamps(),
    worldStamps: loadWorldStampAlbums(),
    mistakes: loadMistakes(),
    trainer: loadTrainerStats(),
    levels,
    history,
    bests,
    company: loadCompany(),
    state: loadRealm(),
    tokens: loadTokens(),
    economy: loadEconomy(),
  }
}

export function downloadPlayerExport(account: Account | null) {
  const payload = buildPlayerExport(account)
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const stamp = payload.exportedAt.slice(0, 10)
  const link = document.createElement('a')
  link.href = url
  link.download = `geoguiz-${stamp}.json`
  link.click()
  URL.revokeObjectURL(url)
}
