export interface CreatorStatsSnapshot {
  id: string
  wallet: string
  date: string
  total_videos: number
  total_views: number
  total_watch_time_seconds: number
  total_points_distributed: number
  new_followers: number
  created_at: string
}

export interface CreatorDashboardStats {
  last30Days: CreatorStatsSnapshot[]
  totals: {
    views: number
    watchTimeSeconds: number
    pointsDistributed: number
    followerGrowth: number
  }
}

export function formatWatchTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function calcEngagementRate(views: number, watchTimeSeconds: number): number {
  if (!views) return 0
  const avgWatchSeconds = watchTimeSeconds / views
  return Math.min(100, Math.round((avgWatchSeconds / 120) * 100))
}
