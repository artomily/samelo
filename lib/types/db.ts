export interface DbVideo {
  id: string
  title: string
  thumbnail_url: string | null
  channel_title: string | null
  duration_seconds: number
  reward_cents: number
  active: boolean
  fetched_at: string
}

export interface DbProfile {
  wallet_address: string
  display_name: string | null
  referral_code: string | null
  referred_by: string | null
  total_points: number
  total_earned_cents: number
}

export interface DbWatch {
  id: number
  wallet_address: string
  video_id: string
  reward_cents: number
  points: number
  watched_at: string
  claimed: boolean
}

export interface DbReferral {
  id: number
  referrer_wallet: string
  referred_wallet: string
  code_used: string
  reward_points: number
  created_at: string
}

export interface DbQuizAttempt {
  id: number
  wallet_address: string
  video_id: string
  score: number
  points_earned: number
  answered_at: string
}
