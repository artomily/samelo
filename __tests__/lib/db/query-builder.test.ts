import { describe, it, expect } from 'vitest'
import { buildSearchQuery, paginate } from '@/lib/db/query-builder'

describe('buildSearchQuery', () => {
  it('wraps term in percent wildcards', () => {
    expect(buildSearchQuery('name', 'celo')).toBe('%celo%')
  })

  it('escapes percent signs', () => {
    expect(buildSearchQuery('name', '100%')).toBe('%100\\%%')
  })

  it('escapes underscores', () => {
    expect(buildSearchQuery('name', 'foo_bar')).toBe('%foo\\_bar%')
  })
})

describe('paginate', () => {
  it('calculates offset for page 1', () => {
    expect(paginate(20, 1)).toEqual({ limit: 20, offset: 0 })
  })

  it('calculates offset for page 2', () => {
    expect(paginate(20, 2)).toEqual({ limit: 20, offset: 20 })
  })

  it('caps limit at 100', () => {
    expect(paginate(200, 1).limit).toBe(100)
  })

  it('enforces minimum page of 1', () => {
    expect(paginate(20, 0).offset).toBe(0)
  })
})
