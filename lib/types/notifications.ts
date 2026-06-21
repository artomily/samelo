export type NotificationType =
  | 'reward_earned'
  | 'badge_awarded'
  | 'follow'
  | 'tip_received'
  | 'governance_vote'
  | 'event_starting'
  | 'achievement_unlocked'
  | 'system'

export interface NotificationCenterItem {
  id: string
  wallet: string
  type: NotificationType
  title: string
  body: string
  action_url: string | null
  image_url: string | null
  is_read: boolean
  created_at: string
}

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  reward_earned: '🪙',
  badge_awarded: '🏅',
  follow: '👤',
  tip_received: '💸',
  governance_vote: '🗳️',
  event_starting: '📺',
  achievement_unlocked: '🏆',
  system: '🔔',
}

export const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  reward_earned: '#c8f135',
  badge_awarded: '#c8f135',
  follow: '#60a5fa',
  tip_received: '#4ade80',
  governance_vote: '#f1c135',
  event_starting: '#f1c135',
  achievement_unlocked: '#c8f135',
  system: '#aaa',
}

export function unreadCount(notifications: NotificationCenterItem[]): number {
  return notifications.filter((n) => !n.is_read).length
}

export function groupByDate(notifications: NotificationCenterItem[]): Record<string, NotificationCenterItem[]> {
  const groups: Record<string, NotificationCenterItem[]> = {}
  for (const n of notifications) {
    const day = n.created_at.slice(0, 10)
    if (!groups[day]) groups[day] = []
    groups[day].push(n)
  }
  return groups
}
