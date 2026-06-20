export type ActivityEventType =
  | 'watch_complete'
  | 'quiz_pass'
  | 'badge_earned'
  | 'level_up'
  | 'checkin'
  | 'stake'
  | 'swap'
  | 'follow'
  | 'collection_create'
  | 'governance_vote'
  | 'achievement_unlock'
  | 'referral_join'

export interface ActivityEvent {
  id: string
  wallet: string
  event_type: ActivityEventType
  payload: Record<string, unknown>
  points_delta: number
  is_public: boolean
  created_at: string
}

export const ACTIVITY_ICONS: Record<ActivityEventType, string> = {
  watch_complete: '▶',
  quiz_pass: '✓',
  badge_earned: '🏅',
  level_up: '⬆',
  checkin: '📍',
  stake: '⚡',
  swap: '⇄',
  follow: '➕',
  collection_create: '📂',
  governance_vote: '🗳',
  achievement_unlock: '🏆',
  referral_join: '👥',
}

export const ACTIVITY_LABELS: Record<ActivityEventType, string> = {
  watch_complete: 'Completed a watch',
  quiz_pass: 'Passed a quiz',
  badge_earned: 'Earned a badge',
  level_up: 'Levelled up',
  checkin: 'Checked in',
  stake: 'Staked MELO',
  swap: 'Swapped tokens',
  follow: 'Followed a user',
  collection_create: 'Created a collection',
  governance_vote: 'Cast a governance vote',
  achievement_unlock: 'Unlocked an achievement',
  referral_join: 'Joined via referral',
}

export function activityLabel(event: ActivityEvent): string {
  return ACTIVITY_LABELS[event.event_type]
}
