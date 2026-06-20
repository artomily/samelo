'use client'
import { useAdminMetrics } from '@/hooks/useAdminMetrics'
import { Skeleton } from '@/components/ui/Skeleton'

export function TopVideosTable() {
  const { data, isLoading } = useAdminMetrics()

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />

  const topVideos = data?.topVideos ?? []

  if (topVideos.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-white/30">No video plays recorded yet</div>
    )
  }

  const maxPlays = topVideos[0].plays

  return (
    <div className="space-y-2">
      {topVideos.map(({ videoId, plays }, i) => (
        <div key={videoId} className="flex items-center gap-3">
          <span className="text-xs text-white/20 w-4 text-right">{i + 1}</span>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/70 font-mono truncate max-w-[180px]">{videoId}</span>
              <span className="text-[#c8f135]">{plays.toLocaleString()}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c8f135]/60"
                style={{ width: `${Math.round((plays / maxPlays) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
