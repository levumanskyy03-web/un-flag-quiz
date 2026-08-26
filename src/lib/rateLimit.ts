const hits = new Map<string, { count: number; resetAt: number }>()

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const ip = forwarded.split(',')[0]?.trim()
    if (ip) return ip.slice(0, 64)
  }
  const real = request.headers.get('x-real-ip')?.trim()
  if (real) return real.slice(0, 64)
  return 'unknown'
}

export async function consumeRateLimit(bucket: string, limit: number, windowSec: number): Promise<boolean> {
  const key = `passport-country-rl:${bucket}`
  const redis = redisConfig()
  if (redis) {
    try {
      const count = Number(await redisCommand(redis, ['INCR', key]))
      if (count === 1) await redisCommand(redis, ['EXPIRE', key, windowSec])
      return Number.isFinite(count) && count <= limit
    } catch {
      return true
    }
  }
  const now = Date.now()
  const current = hits.get(key)
  if (!current || current.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowSec * 1000 })
    return true
  }
  current.count += 1
  return current.count <= limit
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url, token }
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
  if (!response.ok) throw new Error('rate limit store unavailable')
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object') return null
  return (body as { result?: unknown }).result ?? null
}
