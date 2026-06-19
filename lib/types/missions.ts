export type MissionType = 'watch_count' | 'quiz_count' | 'referral_count' | 'points_threshold'

export interface Mission {
  id: string
  slug: string
  title: string
  description: string
  missionType: MissionType
  targetValue: number
  rewardPoints: number
  isActive: boolean
  sortOrder: number
}

export interface UserMission {
  id: string
  walletAddress: string
  missionId: string
  progress: number
  completedAt: string | null
  claimedAt: string | null
  mission: Mission
}

export interface MissionWithProgress extends Mission {
  progress: number
  completedAt: string | null
  claimedAt: string | null
  isCompleted: boolean
  isClaimed: boolean
  progressPercent: number
}
