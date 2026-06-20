export type PointsSource =
  | 'watch' | 'quiz' | 'checkin' | 'referral' | 'stake'
  | 'swap' | 'achievement' | 'badge' | 'bonus' | 'admin'

export interface PointsHistoryEntry {
  id: string
  wallet: string
  delta: number
  source: PointsSource
  description: string | null
  reference_id: string | null
  balance_after: number
  created_at: string
}

export const SOURCE_LABELS: Record<PointsSource, string> = {
  watch: 'Watch',
  quiz: 'Quiz',
  checkin: 'Check-in',
  referral: 'Referral',
  stake: 'Staking',
  swap: 'Swap',
  achievement: 'Achievement',
  badge: 'Badge',
  bonus: 'Bonus',
  admin: 'Admin',
}

export const SOURCE_ICONS: Record<PointsSource, string> = {
  watch: '▶',
  quiz: '❓',
  checkin: '🔥',
  referral: '👥',
  stake: '💎',
  swap: '↔',
  achievement: '🏆',
  badge: '🏅',
  bonus: '⚡',
  admin: '⚙',
}

export function formatDelta(delta: number): string {
  return delta >= 0 ? `+${delta}` : `${delta}`
}
