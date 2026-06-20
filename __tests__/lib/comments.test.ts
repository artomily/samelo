import { describe, it, expect } from 'vitest'
import { sanitizeCommentBody, isReply, timeAgo, MAX_COMMENT_LENGTH } from '../../lib/types/comment'
import type { Comment } from '../../lib/types/comment'

function makeComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: 'test',
    wallet: '0xabc',
    video_id: 'vid-1',
    parent_id: null,
    body: 'Hello!',
    like_count: 0,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('sanitizeCommentBody', () => {
  it('trims whitespace', () => {
    expect(sanitizeCommentBody('  hello  ')).toBe('hello')
  })

  it('truncates to max length', () => {
    const long = 'a'.repeat(1000)
    expect(sanitizeCommentBody(long)).toHaveLength(MAX_COMMENT_LENGTH)
  })

  it('preserves normal text', () => {
    expect(sanitizeCommentBody('Nice video!')).toBe('Nice video!')
  })
})

describe('isReply', () => {
  it('returns false for top-level comment', () => {
    expect(isReply(makeComment())).toBe(false)
  })

  it('returns true when parent_id is set', () => {
    expect(isReply(makeComment({ parent_id: 'parent-id' }))).toBe(true)
  })
})

describe('timeAgo', () => {
  it('returns "just now" for very recent', () => {
    expect(timeAgo(new Date().toISOString())).toBe('just now')
  })

  it('returns minutes for < 1 hour', () => {
    const past = new Date(Date.now() - 5 * 60_000).toISOString()
    expect(timeAgo(past)).toBe('5m ago')
  })

  it('returns days for old dates', () => {
    const past = new Date(Date.now() - 2 * 86_400_000).toISOString()
    expect(timeAgo(past)).toBe('2d ago')
  })
})
