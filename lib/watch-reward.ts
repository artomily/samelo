import { POINTS_PER_SECOND, MAX_WATCH_SECONDS } from '@/lib/constants'

/** Calculate points earned for a given watch duration in seconds */
export function calcWatchReward(durationSeconds: number): number {
  const credited = Math.min(durationSeconds, MAX_WATCH_SECONDS)
  return Math.floor(credited * POINTS_PER_SECOND)
}

/** Check if a watch duration meets the minimum threshold to earn points (10s) */
export function isEligibleWatch(durationSeconds: number): boolean {
  return durationSeconds >= 10
}

/** Returns the progress ratio (0..1) toward the maximum creditable watch duration */
export function watchProgressRatio(durationSeconds: number): number {
  return Math.min(durationSeconds / MAX_WATCH_SECONDS, 1)
}
