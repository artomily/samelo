import { describe, it, expect } from 'vitest'
import { buildCsp, SECURITY_HEADERS } from '@/lib/security/csp'

describe('buildCsp', () => {
  it('includes nonce in script-src', () => {
    const csp = buildCsp('abc123')
    expect(csp).toContain("'nonce-abc123'")
  })

  it('includes self in default-src', () => {
    const csp = buildCsp('nonce')
    expect(csp).toContain("default-src 'self'")
  })

  it('denies object-src', () => {
    const csp = buildCsp('nonce')
    expect(csp).toContain("object-src 'none'")
  })

  it('denies frame-ancestors', () => {
    const csp = buildCsp('nonce')
    expect(csp).toContain("frame-ancestors 'none'")
  })

  it('allows youtube in frame-src', () => {
    const csp = buildCsp('nonce')
    expect(csp).toContain('https://www.youtube.com')
  })
})

describe('SECURITY_HEADERS', () => {
  it('sets X-Content-Type-Options to nosniff', () => {
    expect(SECURITY_HEADERS['X-Content-Type-Options']).toBe('nosniff')
  })

  it('sets X-Frame-Options to DENY', () => {
    expect(SECURITY_HEADERS['X-Frame-Options']).toBe('DENY')
  })

  it('sets HSTS with long max-age', () => {
    expect(SECURITY_HEADERS['Strict-Transport-Security']).toContain('max-age=31536000')
  })
})
