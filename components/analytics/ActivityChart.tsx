'use client'

import { useState } from 'react'
import { useAnalyticsHistory } from '@/hooks/useAnalyticsHistory'
import { shortDateLabel } from '@/lib/date-range'

export function ActivityChart() {
  const [period, setPeriod] = useState<7 | 14 | 30>(30)
  const { data, isLoading } = useAnalyticsHistory(period)

  const timeline = data?.timeline ?? []
  const maxWatches = Math.max(...timeline.map(d => d.watches), 1)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/70">Watch Activity</h3>
        <div className="flex gap-1">
          {([7, 14, 30] as const).map(d => (
            <button
              key={d}
              onClick={() => setPeriod(d)}
              className={`text-xs px-2 py-1 rounded transition-all ${period === d ? 'bg-[#c8f135] text-black font-semibold' : 'text-white/40 hover:text-white'}`}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-24 bg-white/5 rounded-lg animate-pulse" />
      ) : (
        <div className="flex items-end gap-0.5 h-24">
          {timeline.map((day, i) => {
            const height = maxWatches > 0 ? (day.watches / maxWatches) * 100 : 0
            const isToday = i === timeline.length - 1
            return (
              <div
                key={day.date}
                className="flex-1 group relative"
                title={`${shortDateLabel(day.date)}: ${day.watches} watches, ${day.points} pts`}
              >
                <div
                  className={`w-full rounded-t transition-all ${isToday ? 'bg-[#c8f135]' : 'bg-[#c8f135]/40 group-hover:bg-[#c8f135]/70'}`}
                  style={{ height: `${Math.max(height, day.watches > 0 ? 4 : 0)}%` }}
                />
              </div>
            )
          })}
        </div>
      )}
      <div className="flex justify-between text-[10px] text-white/30">
        <span>{timeline[0] ? shortDateLabel(timeline[0].date) : ''}</span>
        <span>Today</span>
      </div>
    </div>
  )
}
