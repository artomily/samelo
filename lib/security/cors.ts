const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? 'https://samelo.app')
  .split(',')
  .map(o => o.trim())

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && ALLOWED_ORIGINS.some(allowed => {
    if (allowed === '*') return true
    return origin === allowed || origin.endsWith(`.${allowed.replace(/^https?:\/\//, '')}`)
  })

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin! : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-wallet-address, x-api-key',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

export function handleCorsPreFlight(origin: string | null): Response {
  return new Response(null, { status: 204, headers: getCorsHeaders(origin) })
}
