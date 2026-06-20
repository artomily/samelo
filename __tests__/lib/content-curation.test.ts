import { describe, it, expect } from 'vitest'
import { isOwner, sortByPosition } from '@/lib/types/content-curation'
import type { VideoCollection, VideoCollectionItem } from '@/lib/types/content-curation'

const baseCollection: VideoCollection = {
  id: 'c1',
  title: 'My List',
  description: null,
  cover_url: null,
  curator_wallet: '0xABCDEF1234567890ABCDef1234567890ABCDEF12',
  is_featured: false,
  is_public: true,
  created_at: '2026-06-21T00:00:00Z',
}

const makeItem = (position: number): VideoCollectionItem => ({
  id: `item-${position}`,
  collection_id: 'c1',
  video_id: `vid-${position}`,
  position,
  added_by: '0x1234567890123456789012345678901234567890',
  note: null,
  created_at: '2026-06-21T00:00:00Z',
})

describe('isOwner', () => {
  it('returns true for matching wallet (case-insensitive)', () => {
    expect(isOwner(baseCollection, '0xabcdef1234567890abcdef1234567890abcdef12')).toBe(true)
  })

  it('returns false for different wallet', () => {
    expect(isOwner(baseCollection, '0x0000000000000000000000000000000000000001')).toBe(false)
  })
})

describe('sortByPosition', () => {
  it('sorts items by position ascending', () => {
    const items = [makeItem(2), makeItem(0), makeItem(1)]
    const sorted = sortByPosition(items)
    expect(sorted.map((i) => i.position)).toEqual([0, 1, 2])
  })

  it('does not mutate original array', () => {
    const items = [makeItem(1), makeItem(0)]
    sortByPosition(items)
    expect(items[0].position).toBe(1)
  })

  it('handles empty array', () => {
    expect(sortByPosition([])).toEqual([])
  })
})
