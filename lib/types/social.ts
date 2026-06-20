export type ActivityEventType = 'watch' | 'quiz' | 'swap' | 'stake' | 'achievement' | 'follow'

export interface ActivityEvent {
  id: string
  wallet: string
  eventType: ActivityEventType
  metadata: Record<string, unknown>
  createdAt: string
  reactionCount?: number
  userReaction?: string | null
}

export interface Follow {
  followerWallet: string
  followingWallet: string
  createdAt: string
}

export interface SocialStats {
  followerCount: number
  followingCount: number
  isFollowing: boolean
}

export const ACTIVITY_ICONS: Record<ActivityEventType, string> = {
  watch: '▶',
  quiz: '🧠',
  swap: '⇄',
  stake: '🔒',
  achievement: '🏆',
  follow: '👤',
}

export const ACTIVITY_LABELS: Record<ActivityEventType, string> = {
  watch: 'watched a video',
  quiz: 'completed a quiz',
  swap: 'swapped tokens',
  stake: 'staked $MELO',
  achievement: 'earned an achievement',
  follow: 'started following',
}
