import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const RATE_LIMIT = 5
const RATE_WINDOW = '1 m' as const
const RATE_WINDOW_MS = 60_000

export const TOO_MANY_REQUESTS = 'Too many requests, try again in a minute'

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

const upstashLimiters = new Map<string, Ratelimit | null>()

function getUpstashLimiter(prefix: string): Ratelimit | null {
  if (upstashLimiters.has(prefix)) return upstashLimiters.get(prefix) ?? null
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    upstashLimiters.set(prefix, null)
    return null
  }
  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(RATE_LIMIT, RATE_WINDOW),
    prefix,
  })
  upstashLimiters.set(prefix, limiter)
  return limiter
}

const memoryHits = new Map<string, number[]>()

function allowInMemory(bucket: string): boolean {
  const now = Date.now()
  const times = (memoryHits.get(bucket) ?? []).filter((stamp) => now - stamp < RATE_WINDOW_MS)
  if (times.length >= RATE_LIMIT) {
    memoryHits.set(bucket, times)
    return false
  }
  times.push(now)
  memoryHits.set(bucket, times)
  return true
}

export function tooManyResponse(): Response {
  return Response.json({ error: TOO_MANY_REQUESTS }, { status: 429 })
}

export async function enforceRateLimit(
  request: Request,
  options: { prefix: string; skipIfNoUpstash?: boolean },
): Promise<Response | null> {
  const limiter = getUpstashLimiter(options.prefix)
  if (limiter) {
    const { success } = await limiter.limit(clientIp(request))
    return success ? null : tooManyResponse()
  }

  if (options.skipIfNoUpstash) return null

  const bucket = `${options.prefix}:${clientIp(request)}`
  return allowInMemory(bucket) ? null : tooManyResponse()
}
