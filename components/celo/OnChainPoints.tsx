'use client'
import { useOnChainPoints } from '@/hooks/useContractRead'
import { formatUnits } from 'viem'

export function OnChainPoints() {
  const { points, isLoading } = useOnChainPoints()

  if (isLoading) {
    return <span className="inline-block w-20 h-5 bg-white/10 rounded animate-pulse" />
  }

  const formatted = Number(formatUnits(points, 0)).toLocaleString()

  return (
    <div className="flex flex-col">
      <span className="text-xs text-white/40 uppercase tracking-wide">On-Chain Points</span>
      <span className="font-mono text-lg text-[#c8f135]">{formatted}</span>
    </div>
  )
}
