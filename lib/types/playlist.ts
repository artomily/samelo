export interface Playlist {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  isFeatured: boolean
  sortOrder: number
  videoCount: number
  createdAt: string
}

export interface PlaylistWithVideos extends Playlist {
  videos: Array<{
    id: string
    title: string
    youtubeId: string
    rewardCents: number
    thumbnailUrl: string | null
    position: number
  }>
}
