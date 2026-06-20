import { NextResponse } from 'next/server'

export function cachedApiResponse<T>(
  data: T,
  maxAgeSeconds: number,
  staleWhileRevalidateSeconds = 0,
): NextResponse {
  const cacheControl = staleWhileRevalidateSeconds > 0
    ? `public, s-maxage=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`
    : `public, s-maxage=${maxAgeSeconds}`

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': cacheControl,
    },
  })
}

export function noCacheResponse<T>(data: T): NextResponse {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export function privateResponse<T>(data: T, maxAgeSeconds = 60): NextResponse {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `private, max-age=${maxAgeSeconds}`,
    },
  })
}
