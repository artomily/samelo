import { createHmac, randomBytes, createHash } from 'crypto'

export const WEBHOOK_EVENTS = [
  'watch.complete',
  'quiz.complete',
  'swap.complete',
  'stake.created',
  'achievement.unlocked',
] as const

export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number]

export function generateWebhookSecret(): { secret: string; hash: string } {
  const secret = `whsec_${randomBytes(32).toString('hex')}`
  const hash = createHash('sha256').update(secret).digest('hex')
  return { secret, hash }
}

export function signWebhookPayload(secret: string, payload: string, timestamp: number): string {
  const data = `${timestamp}.${payload}`
  return createHmac('sha256', secret).update(data).digest('hex')
}

export function verifyWebhookSignature(
  secret: string,
  payload: string,
  timestamp: number,
  signature: string,
): boolean {
  const expected = signWebhookPayload(secret, payload, timestamp)
  if (expected.length !== signature.length) return false
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  // Constant-time comparison to prevent timing attacks
  return a.every((byte, i) => byte === b[i])
}

export async function deliverWebhook(
  url: string,
  event: WebhookEvent,
  payload: Record<string, unknown>,
  secret: string,
): Promise<{ success: boolean; statusCode: number | null }> {
  const body = JSON.stringify({ event, data: payload })
  const timestamp = Date.now()
  const signature = signWebhookPayload(secret, body, timestamp)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Samelo-Signature': signature,
        'X-Samelo-Timestamp': String(timestamp),
        'X-Samelo-Event': event,
      },
      body,
      signal: AbortSignal.timeout(10_000),
    })
    return { success: res.ok, statusCode: res.status }
  } catch {
    return { success: false, statusCode: null }
  }
}
