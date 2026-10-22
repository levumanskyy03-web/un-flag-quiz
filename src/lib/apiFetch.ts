import { isNativeApp } from './nativeFeel'

const TOKEN_KEY = 'pq-native-session'
const TOKEN_MAX = 200

function apiOrigin(): string {
  return (process.env.NEXT_PUBLIC_API_ORIGIN ?? '').replace(/\/$/, '')
}

export function apiUrl(path: string): string {
  if (!path.startsWith('/')) return path
  return `${apiOrigin()}${path}`
}

export function rememberNativeToken(body: unknown) {
  if (typeof window === 'undefined' || !isNativeApp()) return
  if (!body || typeof body !== 'object') return
  const token = (body as { token?: unknown }).token
  if (typeof token !== 'string' || token.length === 0 || token.length > TOKEN_MAX) return
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* private mode */
  }
}

export function clearNativeToken() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* private mode */
  }
}

function readNativeToken(): string | null {
  if (typeof window === 'undefined' || !isNativeApp()) return null
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token || token.length > TOKEN_MAX) return null
    return token
  } catch {
    return null
  }
}

function isCrossOrigin(url: string): boolean {
  if (typeof window === 'undefined' || !/^https?:\/\//.test(url)) return false
  try {
    return new URL(url).origin !== window.location.origin
  } catch {
    return false
  }
}

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)
  const token = readNativeToken()
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)
  const url = apiUrl(path)
  const cross = isCrossOrigin(url)
  return fetch(url, {
    ...init,
    headers,
    credentials: cross ? 'omit' : (init?.credentials ?? 'include'),
    cache: init?.cache ?? 'no-store',
  })
}
