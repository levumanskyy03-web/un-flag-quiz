import { NAME_MAX, type Player, savePlayer } from './leaderboard'

export interface Account {
  id: string
  name: string
}

export type AuthError = 'invalid' | 'taken' | 'auth' | 'offline' | 'mismatch'

export async function fetchAccount(): Promise<Account | null> {
  try {
    const response = await fetch('/api/auth/me')
    if (!response.ok) return null
    const body: unknown = await response.json()
    const user = parseAccount(body)
    if (user) rememberAccount(user)
    return user
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

export async function logoutAccount(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch {
    /* still drop the local session copy */
  }
  savePlayer({ id: crypto.randomUUID(), name: '' })
}

function rememberAccount(user: Account) {
  savePlayer({ id: user.id, name: user.name.slice(0, NAME_MAX) } satisfies Player)
}

async function sendAuth(url: string, name: string, password: string) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
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
  return { id: record.id, name: record.name }
}

function parseError(body: unknown, status: number): AuthError {
  if (body && typeof body === 'object' && typeof (body as { error?: unknown }).error === 'string') {
    const error = (body as { error: string }).error
    if (error === 'taken' || error === 'auth' || error === 'offline' || error === 'invalid') {
      return error
    }
  }
  if (status === 409) return 'taken'
  if (status === 401) return 'auth'
  if (status === 503) return 'offline'
  return 'invalid'
}
