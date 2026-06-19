import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('joins truthy strings with a space', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters out falsy values', () => {
    expect(cn('foo', undefined, null, false, 'baz')).toBe('foo baz')
  })

  it('returns empty string when all values are falsy', () => {
    expect(cn(undefined, null, false)).toBe('')
  })

  it('handles single class', () => {
    expect(cn('only')).toBe('only')
  })

  it('handles conditional class pattern', () => {
    const isActive = true
    expect(cn('base', isActive && 'active')).toBe('base active')
  })
})
