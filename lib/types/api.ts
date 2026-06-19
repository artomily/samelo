export interface Video {
  id: string
  title: string
  sponsor: string
  thumbnailUrl: string
  videoUrl: string
  durationSeconds: number
  rewardPoints: number
}

export interface WatchHistoryItem {
  id: number
  video_id: string
  points: number
  watched_at: string
  claimed: boolean
}

export interface LeaderboardEntry {
  wallet: string
  points: number
  rank: number
  displayName: string | null
}

export interface EarningsHistory {
  items: WatchHistoryItem[]
  nextCursor: string | null
  totalEarned: number
  totalClaimed: number
}

export interface RewardsBalance {
  totalPoints: number
  totalEarnedCents: number
  unclaimedPoints: number
}

export interface WatchStats {
  totalWatches: number
  totalPoints: number
  claimedPoints: number
  unclaimedPoints: number
  quizAttempts: number
  lastWatchedAt: string | null
}
