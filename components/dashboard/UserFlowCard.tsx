'use client'

import { useAccount } from 'wagmi'
import { useUserFlow } from '@/hooks/useUserFlow'
import { Skeleton } from '@/components/Skeleton'
import Link from 'next/link'

export function UserFlowCard() {
  const { address } = useAccount()
  const { data, isLoading } = useUserFlow(address)

  if (!address) {
    return (
      <div className="rounded-xl border border-white/8 bg-white/3 p-5 text-center space-y-2">
        <p className="text-sm text-white/40">Connect wallet to see your personal flow</p>
        <Link
          href="/home"
          className="inline-block text-[11px] text-[#c8f135] hover:underline"
        >
          Connect in app →
        </Link>
      </div>
    )
  }

  if (isLoading) return <Skeleton className="h-48 rounded-xl" />
  if (!data) return null

  const steps = [
    { label: 'Watched', value: `${data.totalWatches} videos`, color: 'rgba(255,100,100,0.5)', layer: 'WEB2' },
    { label: 'Points Earned', value: `${data.totalPointsEarned.toLocaleString()} pts`, color: 'rgba(251,204,92,0.5)', layer: 'OFF-CHAIN' },
    { label: 'Points Burned', value: `${data.totalPointsBurned.toLocaleString()} pts`, color: 'rgba(53,208,127,0.5)', layer: 'REDEEMED' },
    { label: '$MELO Received', value: `${data.totalMeloReceived} $MELO`, color: 'rgba(200,241,53,0.8)', layer: 'ON-CHAIN' },
  ]

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Your Flow</h3>
        <p className="text-[10px] text-white/40 font-mono">{data.wallet.slice(0, 10)}…</p>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={step.layer} className="flex items-center gap-3">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: step.color, boxShadow: `0 0 6px ${step.color}` }}
            />
            <div className="flex-1 flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-wide">{step.layer}</span>
              <span className="text-xs font-mono font-bold text-white">{step.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 pt-3 flex justify-between">
        <div>
          <p className="text-[9px] text-white/30 uppercase tracking-wide">Conversion Rate</p>
          <p className="text-sm font-bold text-[#c8f135]">{data.conversionRate}%</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-white/30 uppercase tracking-wide">Current Points</p>
          <p className="text-sm font-bold text-white">{data.currentPoints.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
