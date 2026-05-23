export interface Video {
  id: string
  title: string
  sponsor: string
  thumbnailUrl: string
  videoUrl: string
  durationSeconds: number
  rewardPoints: number // reward in points (e.g. 5 = 5 points)
}

// NOTE: In production, videos are fetched from Supabase (/api/videos).
// These mocks are for local dev only. Replace IDs with real Celo ecosystem YouTube videos.
export const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'How Celo is banking the unbanked',
    sponsor: 'Celo Foundation',
    thumbnailUrl: 'https://placehold.co/640x360/111827/35D07F?text=Celo',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    durationSeconds: 30,
    rewardPoints: 5,
  },
  {
    id: 'v2',
    title: 'MiniPay: Your pocket bank',
    sponsor: 'Opera MiniPay',
    thumbnailUrl: 'https://placehold.co/640x360/111827/FBCC5C?text=MiniPay',
    videoUrl: 'https://www.youtube-nocookie.com/embed/jNQXAC9IVRw?rel=0&modestbranding=1',
    durationSeconds: 30,
    rewardPoints: 4,
  },
  {
    id: 'v3',
    title: 'Send money home — zero fees',
    sponsor: 'Kotani Pay',
    thumbnailUrl: 'https://placehold.co/640x360/111827/9CA3AF?text=Kotani',
    videoUrl: 'https://www.youtube-nocookie.com/embed/FzlFQjvLShE?rel=0&modestbranding=1',
    durationSeconds: 30,
    rewardPoints: 3,
  },
  {
    id: 'v4',
    title: 'DeFi for everyday people',
    sponsor: 'Ubeswap',
    thumbnailUrl: 'https://placehold.co/640x360/111827/35D07F?text=Ubeswap',
    videoUrl: 'https://www.youtube-nocookie.com/embed/kBm9XMstlkE?rel=0&modestbranding=1',
    durationSeconds: 30,
    rewardPoints: 5,
  },
  {
    id: 'v5',
    title: 'Earn while you learn — Samelo',
    sponsor: 'Samelo',
    thumbnailUrl: 'https://placehold.co/640x360/111827/FBCC5C?text=Samelo',
    videoUrl: 'https://www.youtube-nocookie.com/embed/H9RSAnf6OB0?rel=0&modestbranding=1',
    durationSeconds: 30,
    rewardPoints: 4,
  },
]
