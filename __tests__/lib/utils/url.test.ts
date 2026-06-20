import { describe, it, expect } from 'vitest'
import { buildUrl, parseQueryParams, isExternalUrl, joinPath } from '@/lib/utils/url'

describe('buildUrl', () => {
  it('builds relative URL with params', () => {
    expect(buildUrl('/api/videos', { category: 'defi', limit: 10 })).toBe('/api/videos?category=defi&limit=10')
  })

  it('omits null/undefined params', () => {
    expect(buildUrl('/api/videos', { category: null, limit: undefined })).toBe('/api/videos')
  })
})

describe('parseQueryParams', () => {
  it('parses query string', () => {
    expect(parseQueryParams('?page=2&limit=20')).toEqual({ page: '2', limit: '20' })
  })

  it('handles empty string', () => {
    expect(parseQueryParams('')).toEqual({})
  })
})

describe('isExternalUrl', () => {
  it('returns true for http URL', () => {
    expect(isExternalUrl('https://example.com')).toBe(true)
  })

  it('returns false for relative path', () => {
    expect(isExternalUrl('/api/videos')).toBe(false)
  })
})

describe('joinPath', () => {
  it('joins path segments', () => {
    expect(joinPath('api', 'videos', '123')).toBe('/api/videos/123')
  })

  it('removes leading/trailing slashes', () => {
    expect(joinPath('/api/', '/videos/')).toBe('/api/videos')
  })
})
