import { describe, it, expect } from 'vitest'
import { generateWebhookSecret, signWebhookPayload, verifyWebhookSignature } from '@/lib/webhook'

describe('webhook lib', () => {
  it('generateWebhookSecret returns whsec_ prefixed secret', () => {
    const { secret } = generateWebhookSecret()
    expect(secret).toMatch(/^whsec_[0-9a-f]{64}$/)
  })

  it('signature verification succeeds for valid signature', () => {
    const secret = 'test-secret'
    const payload = '{"event":"watch.complete"}'
    const timestamp = 1000000
    const sig = signWebhookPayload(secret, payload, timestamp)
    expect(verifyWebhookSignature(secret, payload, timestamp, sig)).toBe(true)
  })

  it('signature verification fails for tampered payload', () => {
    const secret = 'test-secret'
    const payload = '{"event":"watch.complete"}'
    const timestamp = 1000000
    const sig = signWebhookPayload(secret, payload, timestamp)
    expect(verifyWebhookSignature(secret, '{"event":"admin.hack"}', timestamp, sig)).toBe(false)
  })

  it('signature verification fails for wrong secret', () => {
    const payload = '{"event":"watch.complete"}'
    const timestamp = 1000000
    const sig = signWebhookPayload('secret-a', payload, timestamp)
    expect(verifyWebhookSignature('secret-b', payload, timestamp, sig)).toBe(false)
  })
})
