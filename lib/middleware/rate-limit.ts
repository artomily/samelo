import { NextRequest, NextResponse } from 'next/server'

const store = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitOptions {
  windowMs: number
  max: number
  keyFn?: (req: NextRequest) => string
}

export function rateLimit(options: RateLimitOptions) {
  return function check(req: NextRequest): NextResponse | null {
    const key = options.keyFn
      ? options.keyFn(req)
      : req.headers.get('x-forwarded-for') ?? 'unknown'

    const now = Date.now()
    const entry = store.get(key)

    if (!entry || entry.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + options.windowMs })
      return null
    }

    if (entry.count >= options.max) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
          },
        },
      )
    }

    entry.count++
    return null
  }
}
