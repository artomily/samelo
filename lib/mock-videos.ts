export interface Video {
  id: string
  title: string
  sponsor: string
  thumbnailUrl: string
  videoUrl: string
  durationSeconds: number
  rewardPoints: number // reward in points (e.g. 5 = 5 points)
}

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'How Celo is banking the unbanked',
    sponsor: 'Celo Foundation',
    thumbnailUrl: 'https://placehold.co/640x360/111827/35D07F?text=Celo',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    durationSeconds: 60,
    rewardPoints: 5,
  },
  {
    id: 'v2',
    title: 'MiniPay: Your pocket bank',
    sponsor: 'Opera MiniPay',
    thumbnailUrl: 'https://placehold.co/640x360/111827/FBCC5C?text=MiniPay',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    durationSeconds: 45,
    rewardPoints: 4,
  },
  {
    id: 'v3',
    title: 'Send money home — zero fees',
    sponsor: 'Kotani Pay',
    thumbnailUrl: 'https://placehold.co/640x360/111827/9CA3AF?text=Kotani',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 30,
    rewardPoints: 3,
  },
  {
    id: 'v4',
    title: 'DeFi for everyday people',
    sponsor: 'Ubeswap',
    thumbnailUrl: 'https://placehold.co/640x360/111827/35D07F?text=Ubeswap',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    durationSeconds: 50,
    rewardPoints: 5,
  },
  {
    id: 'v5',
    title: 'Earn while you learn — Samelo',
    sponsor: 'Samelo',
    thumbnailUrl: 'https://placehold.co/640x360/111827/FBCC5C?text=Samelo',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    durationSeconds: 40,
    rewardPoints: 4,
  },
]
