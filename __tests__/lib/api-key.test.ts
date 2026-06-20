import { describe, it, expect } from 'vitest'
import { generateApiKey, hashApiKey, validateScopes, hasScope } from '@/lib/api-key'

describe('api-key lib', () => {
  it('generateApiKey returns key starting with smlo_ prefix', () => {
    const { key } = generateApiKey()
    expect(key).toMatch(/^smlo_[0-9a-f]{64}$/)
  })

  it('generateApiKey prefix is first 12 chars of key', () => {
    const { key, prefix } = generateApiKey()
    expect(prefix).toBe(key.slice(0, 12))
  })

  it('hash is deterministic', () => {
    const key = 'smlo_test'
    expect(hashApiKey(key)).toBe(hashApiKey(key))
  })

  it('hash differs for different keys', () => {
    expect(hashApiKey('smlo_a')).not.toBe(hashApiKey('smlo_b'))
  })

  it('validateScopes filters invalid scopes', () => {
    const result = validateScopes(['read', 'write', 'invalid', 'hacker'])
    expect(result).toEqual(['read', 'write'])
  })

  it('hasScope: admin scope grants all access', () => {
    expect(hasScope(['admin'], 'read')).toBe(true)
    expect(hasScope(['admin'], 'write')).toBe(true)
  })

  it('hasScope: read scope does not grant write', () => {
    expect(hasScope(['read'], 'write')).toBe(false)
  })
})
