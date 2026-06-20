import { describe, it, expect } from 'vitest'
import { validatePlaylistTags, MAX_PLAYLIST_TITLE_LENGTH, MAX_PLAYLIST_DESCRIPTION_LENGTH } from '../../lib/types/playlist-v2'

describe('validatePlaylistTags', () => {
  it('lowercases all tags', () => {
    expect(validatePlaylistTags(['CRYPTO', 'DeFi'])).toEqual(['crypto', 'defi'])
  })

  it('removes special characters', () => {
    expect(validatePlaylistTags(['hello world!', 'foo-bar'])).toEqual(['hello-world', 'foo-bar'])
  })

  it('filters tags shorter than 2 chars', () => {
    expect(validatePlaylistTags(['a', 'ok', 'good'])).toEqual(['ok', 'good'])
  })

  it('filters tags longer than 30 chars', () => {
    const longTag = 'a'.repeat(31)
    expect(validatePlaylistTags([longTag])).toEqual([])
  })

  it('limits to 10 tags', () => {
    const tags = Array.from({ length: 15 }, (_, i) => `tag${i}`)
    expect(validatePlaylistTags(tags)).toHaveLength(10)
  })

  it('deduplication not required — just sanitizes', () => {
    const result = validatePlaylistTags(['crypto', 'blockchain'])
    expect(result).toContain('crypto')
    expect(result).toContain('blockchain')
  })
})

describe('playlist constants', () => {
  it('title max is 100', () => {
    expect(MAX_PLAYLIST_TITLE_LENGTH).toBe(100)
  })

  it('description max is 500', () => {
    expect(MAX_PLAYLIST_DESCRIPTION_LENGTH).toBe(500)
  })
})
