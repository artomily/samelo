export type NotificationType =
  | 'reward_earned'
  | 'mission_complete'
  | 'mission_claimed'
  | 'referral_redeemed'
  | 'swap_complete'
  | 'achievement_unlocked'
  | 'streak_milestone'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  metadata?: Record<string, unknown>
}

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  reward_earned: '🪙',
  mission_complete: '✅',
  mission_claimed: '🎁',
  referral_redeemed: '🤝',
  swap_complete: '⚡',
  achievement_unlocked: '🏆',
  streak_milestone: '🔥',
}
