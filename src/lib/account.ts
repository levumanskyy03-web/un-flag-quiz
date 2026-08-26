import { isAchievementId, type AchievementId } from '../data/achievements'
import { isAvatarId, type AvatarId } from '../data/avatars'
import { localeTag, type Lang } from '../i18n/lang'
import { NAME_MAX, isPlayerId, type Player, savePlayer } from './leaderboard'
import { loadProfile, saveProfile } from './profile'

export interface Account {
  id: string
  name: string
  avatarId?: AvatarId
  nameChangedAt?: number
  createdAt?: number
}

export type AuthError = 'invalid' | 'taken' | 'auth' | 'offline' | 'mismatch' | 'cooldown' | 'blocked'

export interface PublicPlayerProfile {
  id: string
  name: string
  avatarId?: AvatarId
  createdAt: number
  xp: number
  level: number
  achievementIds: AchievementId[]
}

export function formatRegisteredAt(at: number, lang: Lang): string {
  return new Date(at).toLocaleDateString(localeTag(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function authFetch(url: string, init?: RequestInit) {
  return fetch(url, { credentials: 'include', cache: 'no-store', ...init })
}

export async function fetchAccount(): Promise<Account | null> {
  try {
    const response = await authFetch('/api/auth/me')
    if (!response.ok) return null
    const body: unknown = await response.json()
    const user = parseAccount(body)
    if (user) rememberAccount(user)
    return user
  } catch {
    return null
  }
}

export async function fetchPlayerProfile(id: string): Promise<PublicPlayerProfile | null> {
  if (!isPlayerId(id)) return null
  try {
    const response = await authFetch(`/api/players/${encodeURIComponent(id)}`)
    if (!response.ok) return null
    const body: unknown = await response.json()
    return parsePublicProfile(body)
  } catch {
    return null
  }
}

export async function registerAccount(name: string, password: string): Promise<
  { ok: true; user: Account } | { ok: false; error: AuthError }
> {
  return sendAuth('/api/auth/register', name, password)
}

export async function loginAccount(name: string, password: string): Promise<
  { ok: true; user: Account } | { ok: false; error: AuthError }
> {
  return sendAuth('/api/auth/login', name, password)
}

export async function updateAccountProfile(patch: {
  name?: string
  avatarId?: AvatarId
  currentPassword?: string
  newPassword?: string
}): Promise<{ ok: true; user: Account } | { ok: false; error: AuthError }> {
  try {
    const response = await authFetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const body: unknown = await response.json().catch(() => null)
    if (!response.ok) return { ok: false, error: parseError(body, response.status) }
    const user = parseAccount(body)
    if (!user) return { ok: false, error: 'offline' }
    rememberAccount(user)
    return { ok: true, user }
  } catch {
    return { ok: false, error: 'offline' }
  }
}

export async function checkNameAvailable(name: string): Promise<
  { ok: true; available: boolean } | { ok: false; error: AuthError }
> {
  try {
    const response = await authFetch(`/api/auth/name?name=${encodeURIComponent(name)}`)
    const body: unknown = await response.json().catch(() => null)
    if (!response.ok) return { ok: false, error: parseError(body, response.status) }
    if (!body || typeof body !== 'object' || typeof (body as { available?: unknown }).available !== 'boolean') {
      return { ok: false, error: 'offline' }
    }
    return { ok: true, available: (body as { available: boolean }).available }
  } catch {
    return { ok: false, error: 'offline' }
  }
}

export async function logoutAccount(): Promise<void> {
  try {
    await authFetch('/api/auth/logout', { method: 'POST' })
  } catch {
    /* still drop the local session copy */
  }
  forgetLocalSession()
}

function forgetLocalSession() {
  savePlayer({ id: crypto.randomUUID(), name: loadProfile().name })
}

function rememberAccount(user: Account) {
  savePlayer({ id: user.id, name: user.name.slice(0, NAME_MAX) } satisfies Player)
  const profile = loadProfile()
  saveProfile({
    name: user.name,
    avatarId: user.avatarId ?? profile.avatarId,
    photo: profile.photo,
    nameChangedAt: user.nameChangedAt ?? profile.nameChangedAt,
  })
}

async function sendAuth(url: string, name: string, password: string) {
  try {
    const profile = loadProfile()
    const response = await authFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password, avatarId: profile.avatarId }),
    })
    const body: unknown = await response.json().catch(() => null)
    if (!response.ok) {
      return { ok: false as const, error: parseError(body, response.status) }
    }
    const user = parseAccount(body)
    if (!user) return { ok: false as const, error: 'offline' as const }
    rememberAccount(user)
    return { ok: true as const, user }
  } catch {
    return { ok: false as const, error: 'offline' as const }
  }
}

function parseAccount(body: unknown): Account | null {
  if (!body || typeof body !== 'object') return null
  const user = (body as { user?: unknown }).user
  if (!user || typeof user !== 'object') return null
  const record = user as Record<string, unknown>
  if (typeof record.id !== 'string' || typeof record.name !== 'string') return null
  return {
    id: record.id,
    name: record.name,
    avatarId: isAvatarId(record.avatarId) ? record.avatarId : undefined,
    nameChangedAt: typeof record.nameChangedAt === 'number' ? record.nameChangedAt : undefined,
    createdAt: typeof record.createdAt === 'number' ? record.createdAt : undefined,
  }
}

function parsePublicProfile(body: unknown): PublicPlayerProfile | null {
  if (!body || typeof body !== 'object') return null
  const player = (body as { player?: unknown }).player
  if (!player || typeof player !== 'object') return null
  const record = player as Record<string, unknown>
  if (typeof record.id !== 'string' || !isPlayerId(record.id) || typeof record.name !== 'string') return null
  if (typeof record.createdAt !== 'number' || !Number.isFinite(record.createdAt)) return null
  const xp = typeof record.xp === 'number' && Number.isFinite(record.xp) ? Math.max(0, record.xp) : 0
  const level = typeof record.level === 'number' && Number.isFinite(record.level) ? Math.max(1, record.level) : 1
  const achievementIds = Array.isArray(record.achievementIds)
    ? record.achievementIds.filter(isAchievementId)
    : []
  return {
    id: record.id,
    name: record.name,
    avatarId: isAvatarId(record.avatarId) ? record.avatarId : undefined,
    createdAt: record.createdAt,
    xp,
    level,
    achievementIds,
  }
}

function parseError(body: unknown, status: number): AuthError {
  if (body && typeof body === 'object' && typeof (body as { error?: unknown }).error === 'string') {
    const error = (body as { error: string }).error
    if (
      error === 'taken' ||
      error === 'auth' ||
      error === 'offline' ||
      error === 'invalid' ||
      error === 'cooldown' ||
      error === 'blocked'
    ) {
      return error
    }
  }
  if (status === 409) return 'taken'
  if (status === 429) return 'cooldown'
  if (status === 401) return 'auth'
  if (status === 503) return 'offline'
  return 'invalid'
}
