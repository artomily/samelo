'use client'

import { useState } from 'react'
import { useFlowTimeline } from '@/hooks/useFlowTimeline'
import { Skeleton } from '@/components/Skeleton'

type Period = 7 | 14 | 30

const PERIODS: { label: string; value: Period }[] = [
  { label: '7D', value: 7 },
  { label: '14D', value: 14 },
  { label: '30D', value: 30 },
]

function Bar({
  value,
  max,
  color,
  label,
}: {
  value: number
  max: number
  color: string
  label: string
}) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex flex-col items-center gap-1" title={label}>
      <div className="w-full flex-1 flex items-end" style={{ minHeight: 60 }}>
        <div
          className="w-full rounded-t-sm transition-all duration-500"
          style={{ height: `${pct}%`, background: color, minHeight: pct > 0 ? 2 : 0 }}
        />
      </div>
    </div>
  )
}

export function FlowChart() {
  const [period, setPeriod] = useState<Period>(7)
  const { data, isLoading } = useFlowTimeline(period)

  const timeline = data?.timeline ?? []
  const maxWatches = Math.max(...timeline.map((d) => d.watches), 1)
  const maxPoints = Math.max(...timeline.map((d) => d.pointsIssued), 1)
  const maxMelo = Math.max(...timeline.map((d) => parseFloat(d.meloMinted)), 1)

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Flow Timeline</h3>
          <p className="text-[11px] text-white/40">Watch events vs $MELO minted per day</p>
        </div>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-lg px-3 py-1 text-[11px] font-bold transition-colors ${
                period === p.value
                  ? 'bg-[#c8f135] text-black'
                  : 'bg-white/5 text-white/40 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-32 rounded-lg" />
      ) : timeline.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-white/30 text-sm">
          No data yet
        </div>
      ) : (
        <div className="space-y-3">
          {/* Chart */}
          <div className="flex gap-1 items-end" style={{ height: 80 }}>
            {timeline.map((day) => (
              <div key={day.date} className="flex-1 flex gap-0.5 items-end h-full">
                <Bar
                  value={day.watches}
                  max={maxWatches}
                  color="rgba(200,241,53,0.6)"
                  label={`${day.date}: ${day.watches} watches`}
                />
                <Bar
                  value={parseFloat(day.meloMinted)}
                  max={maxMelo}
                  color="rgba(53,208,127,0.6)"
                  label={`${day.date}: ${day.meloMinted} MELO`}
                />
              </div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="flex gap-1">
            {timeline.map((day) => (
              <div key={day.date} className="flex-1 text-center">
                <span className="text-[9px] text-white/20">
                  {new Date(day.date).getDate()}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[rgba(200,241,53,0.6)]" />
              <span className="text-[10px] text-white/40">Watches</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[rgba(53,208,127,0.6)]" />
              <span className="text-[10px] text-white/40">$MELO minted</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
