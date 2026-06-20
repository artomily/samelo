export interface ApiKey {
  id: string
  wallet: string
  name: string
  key_prefix: string
  last_used_at: string | null
  expires_at: string | null
  created_at: string
  revoked_at: string | null
}

export interface ApiKeyWithSecret extends ApiKey {
  plaintext: string
}

export const API_KEY_PREFIX = 'smlo_'
export const API_KEY_SCOPES = ['read', 'write', 'admin'] as const
export type ApiKeyScope = typeof API_KEY_SCOPES[number]

export function maskApiKey(key: string): string {
  if (key.length <= 12) return key.slice(0, 4) + '•'.repeat(key.length - 4)
  return key.slice(0, 9) + '•'.repeat(8) + key.slice(-4)
}

export function isExpired(key: ApiKey): boolean {
  if (!key.expires_at) return false
  return new Date(key.expires_at) < new Date()
}

export function isActive(key: ApiKey): boolean {
  return key.revoked_at === null && !isExpired(key)
}
