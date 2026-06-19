'use client'

import { useTreasuryMetrics } from '@/hooks/useTreasuryMetrics'
import { Skeleton } from '@/components/Skeleton'

export function BurnRateGauge() {
  const { data, isLoading } = useTreasuryMetrics()

  if (isLoading) return <Skeleton className="h-36 rounded-xl" />
  if (!data) return null

  const burnRate = data.totalPointsDistributed > 0
    ? (data.totalPointsBurned / data.totalPointsDistributed) * 100
    : 0

  // SVG arc gauge
  const radius = 60
  const circumference = Math.PI * radius // half circle
  const progress = circumference * (burnRate / 100)

  const rateLabel =
    burnRate >= 80 ? 'Excellent' :
    burnRate >= 50 ? 'Healthy' :
    burnRate >= 20 ? 'Growing' : 'Early'

  const rateColor =
    burnRate >= 80 ? '#c8f135' :
    burnRate >= 50 ? '#35d07f' :
    burnRate >= 20 ? '#fbcc5c' : '#9ca3af'

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4 flex flex-col items-center gap-2">
      <h3 className="text-sm font-semibold text-white self-start">Burn Rate</h3>
      <p className="text-[11px] text-white/40 self-start">Points redeemed / issued</p>

      {/* Arc gauge */}
      <svg width={160} height={90} viewBox="0 0 160 90">
        {/* Background arc */}
        <path
          d="M 10 80 A 70 70 0 0 1 150 80"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={12}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d="M 10 80 A 70 70 0 0 1 150 80"
          fill="none"
          stroke={rateColor}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${(burnRate / 100) * circumference} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 8px ${rateColor}88)` }}
        />
        {/* Center text */}
        <text x="80" y="72" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="monospace">
          {burnRate.toFixed(0)}%
        </text>
        <text x="80" y="86" textAnchor="middle" fill={rateColor} fontSize="9" fontWeight="bold" fontFamily="Orbitron, monospace">
          {rateLabel.toUpperCase()}
        </text>
      </svg>

      <div className="grid grid-cols-2 gap-2 w-full text-center">
        <div>
          <p className="font-mono text-sm font-bold text-white">{data.totalPointsBurned.toLocaleString()}</p>
          <p className="text-[9px] text-white/30 uppercase tracking-wide">Burned</p>
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-white">{data.totalPointsDistributed.toLocaleString()}</p>
          <p className="text-[9px] text-white/30 uppercase tracking-wide">Issued</p>
        </div>
      </div>
    </div>
  )
}
