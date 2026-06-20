import { describe, it, expect } from 'vitest'
import {
  sanitizeText,
  stripHtml,
  isDangerousInput,
  validateWalletAddress,
  validateUuid,
  validateSlug,
  clampString,
} from '@/lib/security/sanitize'

describe('sanitizeText', () => {
  it('escapes < and >', () => {
    expect(sanitizeText('<script>')).toBe('&lt;script&gt;')
  })

  it('escapes double quotes', () => {
    expect(sanitizeText('"hello"')).toBe('&quot;hello&quot;')
  })

  it('escapes single quotes', () => {
    expect(sanitizeText("it's")).toBe("it&#x27;s")
  })

  it('leaves safe text unchanged except encoding', () => {
    expect(sanitizeText('hello world')).toBe('hello world')
  })
})

describe('stripHtml', () => {
  it('removes html tags', () => {
    expect(stripHtml('<b>bold</b>')).toBe('bold')
  })

  it('removes script tags', () => {
    expect(stripHtml('<script>alert(1)</script>')).toBe('alert(1)')
  })
})

describe('isDangerousInput', () => {
  it('detects script tag', () => {
    expect(isDangerousInput('<script>alert(1)</script>')).toBe(true)
  })

  it('detects javascript: protocol', () => {
    expect(isDangerousInput('javascript:alert(1)')).toBe(true)
  })

  it('returns false for safe input', () => {
    expect(isDangerousInput('hello world')).toBe(false)
  })
})

describe('validateWalletAddress', () => {
  it('accepts valid ethereum address', () => {
    expect(validateWalletAddress('0x742d35Cc6634C0532925a3b8D4C9b6c1d8e7f34c')).toBe(true)
  })

  it('rejects short address', () => {
    expect(validateWalletAddress('0x123')).toBe(false)
  })

  it('rejects address without 0x prefix', () => {
    expect(validateWalletAddress('742d35Cc6634C0532925a3b8D4C9b6c1d8e7f34c')).toBe(false)
  })
})

describe('validateUuid', () => {
  it('accepts valid v4 uuid', () => {
    expect(validateUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
  })

  it('rejects invalid uuid', () => {
    expect(validateUuid('not-a-uuid')).toBe(false)
  })
})

describe('validateSlug', () => {
  it('accepts valid slug', () => {
    expect(validateSlug('defi-basics-101')).toBe(true)
  })

  it('rejects uppercase', () => {
    expect(validateSlug('DeFi-Basics')).toBe(false)
  })

  it('rejects spaces', () => {
    expect(validateSlug('defi basics')).toBe(false)
  })
})

describe('clampString', () => {
  it('truncates long strings', () => {
    expect(clampString('hello world', 5)).toBe('hello')
  })

  it('trims whitespace', () => {
    expect(clampString('  hello  ', 20)).toBe('hello')
  })
})
