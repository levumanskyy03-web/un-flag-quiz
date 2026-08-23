import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { NAME_MAX, NAME_MIN, PASSWORD_MAX, PASSWORD_MIN, isPlayerId, sanitizeName } from './leaderboard'

export const SESSION_COOKIE = 'pq-session'

const REDIS_KEY = 'passport-country-accounts'
const SESSION_MS = 30 * 24 * 60 * 60 * 1000
const PBKDF2_ITERS = 100_000

export interface PublicAccount {
  id: string
  name: string
  avatarId?: string
}

interface AccountRecord extends PublicAccount {
  hash: string
  createdAt: number
}

interface SessionRecord {
  userId: string
  exp: number
}

interface AccountStore {
  users: Record<string, AccountRecord>
  sessions: Record<string, SessionRecord>
}

export function normalizeName(name: string) {
  return name.trim().toLocaleLowerCase()
}

export function parsePassword(value: unknown): string | null {
  if (typeof value !== 'string') return null
  if (value.length < PASSWORD_MIN || value.length > PASSWORD_MAX) return null
  return value
}

export function parseAccountName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const name = sanitizeName(value)
  if (name.length < NAME_MIN || name.length > NAME_MAX) return null
  return name
}

export async function registerAccount(
  name: string,
  password: string,
  avatarId?: string,
): Promise<{ ok: true; user: PublicAccount; token: string } | { ok: false; error: 'taken' | 'offline' }> {
  const store = await loadStore()
  if (store === null) return { ok: false, error: 'offline' }
  const key = normalizeName(name)
  if (store.users[key]) return { ok: false, error: 'taken' }
  const user: AccountRecord = {
    id: crypto.randomUUID(),
    name,
    avatarId,
    hash: await hashPassword(password),
    createdAt: Date.now(),
  }
  const token = createToken()
  store.users[key] = user
  store.sessions[token] = { userId: user.id, exp: Date.now() + SESSION_MS }
  await saveStore(pruneSessions(store))
  return { ok: true, user: toPublic(user), token }
}

export async function loginAccount(name: string, password: string): Promise<
  { ok: true; user: PublicAccount; token: string } | { ok: false; error: 'auth' | 'offline' }
> {
  const store = await loadStore()
  if (store === null) return { ok: false, error: 'offline' }
  const user = store.users[normalizeName(name)]
  if (!user || !(await verifyPassword(password, user.hash))) {
    return { ok: false, error: 'auth' }
  }
  const token = createToken()
  store.sessions[token] = { userId: user.id, exp: Date.now() + SESSION_MS }
  await saveStore(pruneSessions(store))
  return { ok: true, user: toPublic(user), token }
}

export async function updateAccount(
  token: string | undefined,
  patch: { name?: string; avatarId?: string },
): Promise<{ ok: true; user: PublicAccount } | { ok: false; error: 'auth' | 'taken' | 'offline' | 'invalid' }> {
  if (!token) return { ok: false, error: 'auth' }
  const store = await loadStore()
  if (store === null) return { ok: false, error: 'offline' }
  const session = store.sessions[token]
  if (!session || session.exp < Date.now() || !isPlayerId(session.userId)) return { ok: false, error: 'auth' }
  const entry = Object.entries(store.users).find(([, item]) => item.id === session.userId)
  if (!entry) return { ok: false, error: 'auth' }
  const [currentKey, user] = entry
  if (patch.avatarId) user.avatarId = patch.avatarId
  if (patch.name && patch.name !== user.name) {
    const nextKey = normalizeName(patch.name)
    if (nextKey !== currentKey && store.users[nextKey]) return { ok: false, error: 'taken' }
    user.name = patch.name
    if (nextKey !== currentKey) {
      delete store.users[currentKey]
      store.users[nextKey] = user
    }
  }
  await saveStore(store)
  return { ok: true, user: toPublic(user) }
}

export async function accountFromRequest(request: Request): Promise<PublicAccount | null> {
  const token = readCookie(request, SESSION_COOKIE)
  if (!token) return null
  return accountFromToken(token)
}

export async function accountFromToken(token: string): Promise<PublicAccount | null> {
  const store = await loadStore()
  if (store === null) return null
  const session = store.sessions[token]
  if (!session || session.exp < Date.now() || !isPlayerId(session.userId)) return null
  const user = Object.values(store.users).find((item) => item.id === session.userId)
  if (!user) return null
  return toPublic(user)
}

export async function dropSession(token: string | undefined): Promise<void> {
  if (!token) return
  const store = await loadStore()
  if (store === null || !store.sessions[token]) return
  delete store.sessions[token]
  await saveStore(store)
}

export function authResponse(body: unknown, token?: string, status = 200) {
  const response = NextResponse.json(body, { status })
  if (token) {
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_MS / 1000,
    })
  }
  return response
}

export function clearSessionResponse(body: unknown) {
  const response = NextResponse.json(body)
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  })
  return response
}

export function readCookie(request: Request, name: string) {
  const header = request.headers.get('cookie') ?? ''
  for (const part of header.split(';')) {
    const trimmed = part.trim()
    const cut = trimmed.indexOf('=')
    if (cut <= 0) continue
    if (trimmed.slice(0, cut) !== name) continue
    return decodeURIComponent(trimmed.slice(cut + 1))
  }
  return undefined
}

function toPublic(user: AccountRecord): PublicAccount {
  return { id: user.id, name: user.name, avatarId: user.avatarId }
}

function createToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return Buffer.from(bytes).toString('base64url')
}

function pruneSessions(store: AccountStore): AccountStore {
  const now = Date.now()
  const sessions: Record<string, SessionRecord> = {}
  for (const [token, session] of Object.entries(store.sessions)) {
    if (session.exp > now) sessions[token] = session
  }
  return { ...store, sessions }
}

async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await pbkdf2(password, salt)
  return `pbkdf2:${PBKDF2_ITERS}:${Buffer.from(salt).toString('base64')}:${Buffer.from(hash).toString('base64')}`
}

async function verifyPassword(password: string, stored: string) {
  const [algo, iterRaw, saltB64, hashB64] = stored.split(':')
  const iterations = Number(iterRaw)
  if (algo !== 'pbkdf2' || !Number.isInteger(iterations) || !saltB64 || !hashB64) return false
  const salt = Buffer.from(saltB64, 'base64')
  const expected = Buffer.from(hashB64, 'base64')
  const actual = Buffer.from(await pbkdf2(password, salt, iterations))
  if (actual.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < actual.length; i += 1) diff |= actual[i] ^ expected[i]
  return diff === 0
}

async function pbkdf2(password: string, salt: Buffer | Uint8Array, iterations = PBKDF2_ITERS) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: Uint8Array.from(salt), iterations },
    key,
    256,
  )
  return new Uint8Array(bits)
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url, token }
}

async function loadStore(): Promise<AccountStore | null> {
  const redis = redisConfig()
  if (redis) {
    const result = await redisCommand(redis, ['GET', REDIS_KEY])
    if (typeof result !== 'string' || result.length === 0) return { users: {}, sessions: {} }
    return parseStore(result)
  }
  if (process.env.VERCEL === '1') return null
  try {
    return parseStore(await readFile(filePath(), 'utf8'))
  } catch {
    return { users: {}, sessions: {} }
  }
}

async function saveStore(store: AccountStore): Promise<void> {
  const redis = redisConfig()
  const payload = JSON.stringify(store)
  if (redis) {
    await redisCommand(redis, ['SET', REDIS_KEY, payload])
    return
  }
  const dest = filePath()
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, payload)
}

function parseStore(raw: string): AccountStore {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { users: {}, sessions: {} }
    const record = parsed as Record<string, unknown>
    return {
      users: isObject(record.users) ? (record.users as AccountStore['users']) : {},
      sessions: isObject(record.sessions) ? (record.sessions as AccountStore['sessions']) : {},
    }
  } catch {
    return { users: {}, sessions: {} }
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

async function redisCommand(redis: { url: string; token: string }, command: unknown[]) {
  const response = await fetch(redis.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redis.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('account store unavailable')
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object') return null
  return (body as { result?: unknown }).result ?? null
}

function filePath() {
  return path.join(process.cwd(), '.data', 'accounts.json')
}
