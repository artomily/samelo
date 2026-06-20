export interface PlaylistV2 {
  id: string
  creator_wallet: string
  title: string
  description: string | null
  cover_url: string | null
  tags: string[]
  published: boolean
  featured: boolean
  view_count: number
  video_count?: number
  liked?: boolean
  created_at: string
}

export interface PlaylistLike {
  wallet: string
  playlist_id: string
  created_at: string
}

export function validatePlaylistTags(tags: string[]): string[] {
  return tags
    .map((t) => t.toLowerCase().trim().replace(/[^a-z0-9-]/g, ''))
    .filter((t) => t.length >= 2 && t.length <= 30)
    .slice(0, 10)
}

export const MAX_PLAYLIST_TITLE_LENGTH = 100
export const MAX_PLAYLIST_DESCRIPTION_LENGTH = 500
