import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export function withRequestId(response: NextResponse): NextResponse {
  response.headers.set('x-request-id', randomBytes(8).toString('hex'))
  return response
}
