export interface AdminStats {
  totalUsers: number
  totalWatches: number
  totalPointsIssued: number
  totalPointsBurned: number
  totalMeloMinted: number
  totalSwaps: number
  totalReferrals: number
  totalMissionsCompleted: number
  activeUsersLast7Days: number
  newUsersLast7Days: number
  watchesLast7Days: number
}

export interface AdminUser {
  walletAddress: string
  displayName: string | null
  referralCode: string
  totalPoints: number
  watchCount: number
  quizCount: number
  referralCount: number
  createdAt: string
  isBanned: boolean
}

export interface AdminVideo {
  id: string
  title: string
  youtubeId: string
  rewardCents: number
  watchCount: number
  isActive: boolean
  createdAt: string
}

export interface AdminSwap {
  id: string
  walletAddress: string
  pointsBurned: number
  meloReceived: string
  txHash: string | null
  createdAt: string
}
