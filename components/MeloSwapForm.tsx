'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useMeloBalance } from '@/hooks/useMeloBalance'
import { pointsToMelo, POINTS_PER_MELO } from '@/lib/melo-token'

interface Props {
  availablePoints: number
  onSwap?: (points: number) => Promise<void>
}

const MIN_SWAP_POINTS = 500

export function MeloSwapForm({ availablePoints, onSwap }: Props) {
  const { address } = useAccount()
  const { formatted: meloBalance } = useMeloBalance(address)
  const [points, setPoints] = useState(MIN_SWAP_POINTS)
  const [isSwapping, setIsSwapping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const meloOut = pointsToMelo(points)
  const canSwap = points >= MIN_SWAP_POINTS && points <= availablePoints

  async function handleSwap() {
    if (!canSwap || !onSwap) return
    setError(null)
    setIsSwapping(true)
    try {
      await onSwap(points)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Swap failed')
    } finally {
      setIsSwapping(false)
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm">Swap Points → $MELO</h3>
        <span className="text-xs text-white/40 font-mono">{meloBalance} held</span>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-white/50">Points to swap</label>
        <input
          type="number"
          min={MIN_SWAP_POINTS}
          max={availablePoints}
          step={POINTS_PER_MELO}
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f135]/50"
        />
        <div className="flex justify-between text-xs text-white/40">
          <span>Min: {MIN_SWAP_POINTS} pts</span>
          <span>Available: {availablePoints} pts</span>
        </div>
      </div>

      <div className="rounded-lg bg-[#c8f135]/5 border border-[#c8f135]/20 px-4 py-3 flex justify-between">
        <span className="text-xs text-white/50">You receive</span>
        <span className="text-sm font-mono font-bold text-[#c8f135]">{meloOut.toFixed(3)} $MELO</span>
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <button
        onClick={handleSwap}
        disabled={!canSwap || isSwapping}
        className="w-full rounded-lg bg-[#c8f135] text-black font-bold text-sm py-2.5 hover:bg-[#d4f855] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isSwapping ? 'Swapping…' : `Swap ${points} pts for ${meloOut.toFixed(3)} $MELO`}
      </button>
    </div>
  )
}
