import { describe, it, expect } from 'vitest'
import { parseSearchQuery, buildFtsQuery, highlightQuery } from '@/lib/types/search-v2'

describe('parseSearchQuery', () => {
  it('splits simple terms', () => {
    const { terms, tags } = parseSearchQuery('hello world')
    expect(terms).toEqual(['hello', 'world'])
    expect(tags).toEqual([])
  })

  it('extracts hashtags separately', () => {
    const { terms, tags } = parseSearchQuery('celo #defi #web3')
    expect(terms).toEqual(['celo'])
    expect(tags).toEqual(['defi', 'web3'])
  })

  it('handles empty string', () => {
    const { terms, tags } = parseSearchQuery('')
    expect(terms).toEqual([])
    expect(tags).toEqual([])
  })

  it('lowercases tags', () => {
    const { tags } = parseSearchQuery('#CRYPTO')
    expect(tags).toEqual(['crypto'])
  })

  it('ignores lone hash', () => {
    const { tags } = parseSearchQuery('# hello')
    expect(tags).toEqual([])
  })
})

describe('buildFtsQuery', () => {
  it('joins terms with :* and &', () => {
    expect(buildFtsQuery(['hello', 'world'])).toBe('hello:* & world:*')
  })

  it('handles single term', () => {
    expect(buildFtsQuery(['celo'])).toBe('celo:*')
  })
})

describe('highlightQuery', () => {
  it('wraps matched text in brackets', () => {
    expect(highlightQuery('hello world', 'world')).toBe('hello [world]')
  })

  it('is case insensitive', () => {
    expect(highlightQuery('Hello World', 'hello')).toBe('[Hello] World')
  })

  it('returns original text when query is empty', () => {
    expect(highlightQuery('no change', '')).toBe('no change')
  })
})
