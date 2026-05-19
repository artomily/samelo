import crypto from 'crypto'

const WATCH_TOKEN_TTL_SECONDS = 60 * 60 // 1 hour

function secret(): string {
  const s = process.env.WATCH_TOKEN_SECRET
  if (!s || s === 'changeme') {
    // Warn loudly in dev; block in prod
    if (process.env.NODE_ENV === 'production') {
      throw new Error('WATCH_TOKEN_SECRET env var is not set')
    }
    return 'dev-secret-NOT-FOR-PRODUCTION'
  }
  return s
}

/**
 * Generate a short-lived HMAC token that binds a videoId to a walletAddress.
 * The client includes this token when submitting a completed watch event.
 */
export function generateWatchToken(
  videoId: string,
  walletAddress: string,
): string {
  const expiry = Math.floor(Date.now() / 1000) + WATCH_TOKEN_TTL_SECONDS
  const payload = `${videoId}:${walletAddress.toLowerCase()}:${expiry}`
  const hmac = crypto
    .createHmac('sha256', secret())
    .update(payload)
    .digest('hex')
  return Buffer.from(JSON.stringify({ payload, hmac })).toString('base64url')
}

/**
 * Verify a watch token. Returns true only if the token is valid,
 * unexpired, and matches the expected videoId + walletAddress.
 */
export function verifyWatchToken(
  token: string,
  videoId: string,
  walletAddress: string,
): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const { payload, hmac } = JSON.parse(decoded) as {
      payload: string
      hmac: string
    }

    const expected = crypto
      .createHmac('sha256', secret())
      .update(payload)
      .digest('hex')

    // Constant-time comparison to prevent timing attacks
    if (
      hmac.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(expected, 'hex'))
    ) {
      return false
    }

    const [pVideoId, pWallet, pExpiry] = payload.split(':')
    if (pVideoId !== videoId) return false
    if (pWallet !== walletAddress.toLowerCase()) return false
    if (parseInt(pExpiry, 10) < Math.floor(Date.now() / 1000)) return false

    return true
  } catch {
    return false
  }
}
