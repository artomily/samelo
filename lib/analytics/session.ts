const SESSION_KEY = 'samelo_session_id'

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sessionId = sessionStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = generateSessionId()
    sessionStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

function generateSessionId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SESSION_KEY)
}
