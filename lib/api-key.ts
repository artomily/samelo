import { createHash, randomBytes } from 'crypto'

export const API_KEY_PREFIX = 'smlo_'
export const VALID_SCOPES = ['read', 'write', 'admin'] as const
export type ApiScope = (typeof VALID_SCOPES)[number]

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const raw = randomBytes(32).toString('hex')
  const key = `${API_KEY_PREFIX}${raw}`
  const prefix = key.slice(0, 12)
  const hash = hashApiKey(key)
  return { key, prefix, hash }
}

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

export function validateScopes(scopes: string[]): ApiScope[] {
  return scopes.filter((s): s is ApiScope => VALID_SCOPES.includes(s as ApiScope))
}

export function hasScope(keyScopes: string[], required: ApiScope): boolean {
  if (keyScopes.includes('admin')) return true
  return keyScopes.includes(required)
}
