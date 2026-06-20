import { describe, it, expect } from 'vitest'
import type { Playlist, PlaylistWithVideos } from '@/lib/types/playlist'

describe('Playlist types', () => {
  it('Playlist interface has required fields', () => {
    const p: Playlist = {
      id: 'uuid-1',
      slug: 'defi-basics',
      title: 'DeFi Basics',
      description: null,
      thumbnailUrl: null,
      isFeatured: false,
      sortOrder: 0,
      videoCount: 0,
      createdAt: new Date().toISOString(),
    }
    expect(p.slug).toBe('defi-basics')
  })

  it('PlaylistWithVideos extends Playlist with videos array', () => {
    const p: PlaylistWithVideos = {
      id: 'uuid-2',
      slug: 'celo-101',
      title: 'Celo 101',
      description: 'Learn Celo basics',
      thumbnailUrl: null,
      isFeatured: true,
      sortOrder: 1,
      videoCount: 2,
      createdAt: new Date().toISOString(),
      videos: [
        { id: 'v1', title: 'Intro to Celo', youtubeId: 'abc', rewardCents: 100, thumbnailUrl: null, position: 0 },
        { id: 'v2', title: 'Celo Wallets', youtubeId: 'def', rewardCents: 150, thumbnailUrl: null, position: 1 },
      ],
    }
    expect(p.videos).toHaveLength(2)
    expect(p.videos[0].position).toBe(0)
  })
})
