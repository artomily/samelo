export type ChallengeType = 'daily' | 'weekly' | 'seasonal' | 'special'

export interface Challenge {
  id: string
  slug: string
  title: string
  description: string
  challenge_type: ChallengeType
  reward_melo: number
  target_count: number
  start_date: string
  end_date: string | null
  is_active: boolean
  created_at: string
}

export interface ChallengeProgress {
  id: string
  wallet: string
  challenge_id: string
  current_count: number
  completed: boolean
  completed_at: string | null
  reward_claimed: boolean
  updated_at: string
}

export interface ChallengeWithProgress extends Challenge {
  progress: ChallengeProgress | null
}

export const CHALLENGE_TYPE_LABELS: Record<ChallengeType, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  seasonal: 'Seasonal',
  special: 'Special',
}

export const CHALLENGE_TYPE_COLORS: Record<ChallengeType, string> = {
  daily: '#60a5fa',
  weekly: '#c8f135',
  seasonal: '#f1c135',
  special: '#c084fc',
}

export function progressPct(progress: ChallengeProgress, challenge: Challenge): number {
  if (progress.completed) return 100
  return Math.min(100, Math.round((progress.current_count / challenge.target_count) * 100))
}

export function isExpired(challenge: Challenge): boolean {
  if (!challenge.end_date) return false
  return new Date(challenge.end_date) < new Date()
}

export function isClaimable(progress: ChallengeProgress): boolean {
  return progress.completed && !progress.reward_claimed
}
