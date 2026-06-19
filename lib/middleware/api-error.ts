import { NextResponse } from 'next/server'

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
): NextResponse {
  return NextResponse.json(
    { error: message, code },
    { status },
  )
}

export const Errors = {
  invalidWallet: () => apiError('VALIDATION_ERROR', 'Invalid walletAddress', 400),
  notFound: (resource: string) => apiError('NOT_FOUND', `${resource} not found`, 404),
  rateLimited: () => apiError('RATE_LIMITED', 'Too many requests', 429),
  internal: (msg = 'Internal server error') => apiError('INTERNAL_ERROR', msg, 500),
  serviceUnavailable: (msg = 'Service unavailable') => apiError('SERVICE_UNAVAILABLE', msg, 503),
}
