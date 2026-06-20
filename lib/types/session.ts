export interface WalletSession {
  id: string
  wallet: string
  session_token: string
  ip_address: string | null
  user_agent: string | null
  last_seen_at: string
  expires_at: string
  created_at: string
}

export const SESSION_TTL_HOURS = 24 * 7

export function isSessionExpired(session: WalletSession): boolean {
  return new Date(session.expires_at) < new Date()
}

export function sessionExpiresAt(): string {
  return new Date(Date.now() + SESSION_TTL_HOURS * 3600_000).toISOString()
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(32)
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(bytes)
  }
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}
