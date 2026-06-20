export type LeaderboardPeriod = 'daily' | 'weekly' | 'alltime'

export interface LeaderboardEntry {
  rank: number
  wallet: string
  points: number
  snapshot_date: string
}

export interface LeaderboardSnapshot {
  id: string
  wallet: string
  period: LeaderboardPeriod
  points: number
  rank: number
  snapshot_date: string
  created_at: string
}

export const PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
  daily: 'Today',
  weekly: 'This Week',
  alltime: 'All Time',
}

export function getMedalEmoji(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}
