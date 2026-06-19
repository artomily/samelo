import { describe, it, expect } from 'vitest'
import { API_ERROR, apiError, apiOk } from '@/lib/api-error'

describe('API_ERROR constants', () => {
  it('has expected error code keys', () => {
    expect(API_ERROR.MISSING_PARAMS).toBe('MISSING_PARAMS')
    expect(API_ERROR.UNAUTHORIZED).toBe('UNAUTHORIZED')
    expect(API_ERROR.NOT_FOUND).toBe('NOT_FOUND')
    expect(API_ERROR.ALREADY_CLAIMED).toBe('ALREADY_CLAIMED')
    expect(API_ERROR.INSUFFICIENT_POINTS).toBe('INSUFFICIENT_POINTS')
    expect(API_ERROR.INVALID_SIGNATURE).toBe('INVALID_SIGNATURE')
    expect(API_ERROR.RATE_LIMITED).toBe('RATE_LIMITED')
  })
})

describe('apiError', () => {
  it('returns Response with correct status', async () => {
    const res = apiError('NOT_FOUND', 'wallet not found', 404)
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBe('NOT_FOUND')
    expect(body.message).toBe('wallet not found')
  })
})

describe('apiOk', () => {
  it('returns 200 by default', async () => {
    const res = apiOk({ success: true })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  it('accepts custom status code', async () => {
    const res = apiOk({ created: true }, 201)
    expect(res.status).toBe(201)
  })
})
