'use client'

import { formatTimestamp, isChapterComplete } from '@/lib/types/video-chapters'
import type { VideoChapterWithProgress } from '@/lib/types/video-chapters'

interface Props {
  chapters: VideoChapterWithProgress[]
  currentTime?: number
  onSeek?: (seconds: number) => void
}

export function ChapterList({ chapters, currentTime = 0, onSeek }: Props) {
  if (chapters.length === 0) return null

  return (
    <div className="space-y-1">
      {chapters.map((chapter) => {
        const isActive = currentTime >= chapter.start_time_seconds &&
          (chapter.end_time_seconds === null || currentTime < chapter.end_time_seconds)
        const complete = isChapterComplete(chapter.progress)
        const pct = chapter.progress?.watch_pct ?? 0

        return (
          <div
            key={chapter.id}
            onClick={() => onSeek?.(chapter.start_time_seconds)}
            className={`flex items-center gap-3 p-2.5 rounded cursor-pointer transition-colors ${
              isActive ? 'bg-[#1a1a0a] border border-[#c8f135]/30' : 'hover:bg-[#0d0d0d]'
            }`}
          >
            <span className="text-xs text-[#555] font-mono w-10 flex-shrink-0">
              {formatTimestamp(chapter.start_time_seconds)}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${isActive ? 'text-[#c8f135]' : 'text-[#ccc]'}`}>{chapter.title}</p>
              {pct > 0 && (
                <div className="h-0.5 bg-[#1a1a1a] rounded mt-1">
                  <div className="h-0.5 bg-[#c8f135] rounded" style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
            {complete && <span className="text-[#c8f135] text-xs flex-shrink-0">✓</span>}
            {chapter.points_reward > 0 && !complete && (
              <span className="text-xs text-[#555] flex-shrink-0">+{chapter.points_reward}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
