export type NotificationTypeV2 =
  | 'points_earned'
  | 'achievement_unlocked'
  | 'level_up'
  | 'referral_joined'
  | 'checkin_streak'
  | 'staking_reward'
  | 'swap_complete'
  | 'comment_reply'
  | 'follow'

export interface NotificationV2 {
  id: string
  wallet: string
  type: NotificationTypeV2
  title: string
  body: string
  action_url: string | null
  read_at: string | null
  created_at: string
}

export const NOTIFICATION_ICONS_V2: Record<NotificationTypeV2, string> = {
  points_earned: '⚡',
  achievement_unlocked: '🏆',
  level_up: '🚀',
  referral_joined: '👥',
  checkin_streak: '🔥',
  staking_reward: '💎',
  swap_complete: '↔️',
  comment_reply: '💬',
  follow: '👤',
}

export function isUnread(n: NotificationV2): boolean {
  return n.read_at === null
}

export function groupByDate(notifications: NotificationV2[]): Map<string, NotificationV2[]> {
  const map = new Map<string, NotificationV2[]>()
  for (const n of notifications) {
    const date = new Date(n.created_at).toLocaleDateString()
    const group = map.get(date) ?? []
    group.push(n)
    map.set(date, group)
  }
  return map
}
