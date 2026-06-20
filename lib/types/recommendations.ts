export type SignalType = 'watch' | 'complete' | 'like' | 'share' | 'quiz_pass' | 'replay'

export interface RecommendationSignal {
  id: string
  wallet: string
  video_id: string
  signal_type: SignalType
  signal_weight: number
  created_at: string
}

export interface VideoTag {
  id: string
  video_id: string
  tag: string
  created_at: string
}

export interface RecommendationCache {
  wallet: string
  video_ids: string[]
  reason: string | null
  computed_at: string
}

export const SIGNAL_WEIGHTS: Record<SignalType, number> = {
  watch: 1.0,
  complete: 2.0,
  like: 1.5,
  share: 2.5,
  quiz_pass: 2.0,
  replay: 3.0,
}

export function isCacheStale(cache: RecommendationCache, maxAgeMs = 3_600_000): boolean {
  return Date.now() - new Date(cache.computed_at).getTime() > maxAgeMs
}
