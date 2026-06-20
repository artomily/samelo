export type NotificationType = 'achievement' | 'reward' | 'social' | 'system' | 'swap' | 'stake'

export interface Notification {
  id: string
  wallet: string
  type: NotificationType
  title: string
  body: string
  metadata: Record<string, unknown>
  read_at: string | null
  created_at: string
}

export interface NotificationPreferences {
  wallet: string
  achievement: boolean
  reward: boolean
  social: boolean
  system: boolean
  swap: boolean
  stake: boolean
  updated_at: string
}

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  achievement: '🏆',
  reward: '💰',
  social: '👤',
  system: '📢',
  swap: '⇄',
  stake: '🔒',
}

export const DEFAULT_PREFERENCES: Omit<NotificationPreferences, 'wallet' | 'updated_at'> = {
  achievement: true,
  reward: true,
  social: true,
  system: true,
  swap: true,
  stake: true,
}
