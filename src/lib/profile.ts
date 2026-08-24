import { DEFAULT_AVATAR, isAvatarId, type AvatarId } from '../data/avatars'
import { loadPlayer, savePlayer } from './leaderboard'

export const PROFILE_KEY = 'un-flag-quiz-profile'
const PHOTO_MAX = 400_000

export interface LocalProfile {
  name: string
  avatarId: AvatarId
  photo?: string
  nameChangedAt?: number
}

export function loadProfile(): LocalProfile {
  const player = typeof window === 'undefined' ? { name: '' } : loadPlayer()
  const fallback: LocalProfile = { name: player.name, avatarId: DEFAULT_AVATAR }
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return fallback
    const record = parsed as Record<string, unknown>
    const name = typeof record.name === 'string' ? record.name : fallback.name
    const avatarId = isAvatarId(record.avatarId) ? record.avatarId : DEFAULT_AVATAR
    return { name, avatarId, photo: parsePhoto(record.photo), nameChangedAt: parseStamp(record.nameChangedAt) }
  } catch {
    return fallback
  }
}

export function saveProfile(profile: LocalProfile): LocalProfile {
  const next: LocalProfile = {
    name: profile.name.trim(),
    avatarId: isAvatarId(profile.avatarId) ? profile.avatarId : DEFAULT_AVATAR,
    photo: parsePhoto(profile.photo),
    nameChangedAt: profile.nameChangedAt,
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
  const player = loadPlayer()
  savePlayer({ ...player, name: next.name })
  return next
}

function parseStamp(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function parsePhoto(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  if (!value.startsWith('data:image/')) return undefined
  if (value.length > PHOTO_MAX) return undefined
  return value
}
