import { randomBytes } from 'crypto'

export function generateNonce(): string {
  return randomBytes(16).toString('base64')
}

export function getNonceFromHeaders(headers: Headers): string | null {
  return headers.get('x-nonce')
}
