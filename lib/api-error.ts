/** Standard error codes returned by all Samelo API routes */
export const API_ERROR = {
  MISSING_PARAMS: 'MISSING_PARAMS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_CLAIMED: 'ALREADY_CLAIMED',
  INSUFFICIENT_POINTS: 'INSUFFICIENT_POINTS',
  DB_ERROR: 'DB_ERROR',
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  RATE_LIMITED: 'RATE_LIMITED',
} as const

export type ApiErrorCode = typeof API_ERROR[keyof typeof API_ERROR]

export function apiError(code: ApiErrorCode, message: string, status: number) {
  return Response.json({ error: code, message }, { status })
}

export function apiOk<T>(data: T, status = 200) {
  return Response.json(data, { status })
}
