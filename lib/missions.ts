import type { MissionType } from '@/lib/types/missions'

/**
 * Compute current progress value for a mission type based on user stats.
 * Used by background jobs and API routes to sync user_missions.progress.
 */
export function getMissionProgress(
  type: MissionType,
  stats: {
    watchCount: number
    quizCount: number
    referralCount: number
    totalPoints: number
  },
): number {
  switch (type) {
    case 'watch_count':
      return stats.watchCount
    case 'quiz_count':
      return stats.quizCount
    case 'referral_count':
      return stats.referralCount
    case 'points_threshold':
      return stats.totalPoints
  }
}

/** Returns true if the progress meets or exceeds the target. */
export function isMissionComplete(progress: number, targetValue: number): boolean {
  return progress >= targetValue
}

/** Clamp progress display to [0, target] for UI use. */
export function clampProgress(progress: number, targetValue: number): number {
  return Math.max(0, Math.min(progress, targetValue))
}
