'use client'
import { useState } from 'react'
import { useRedeemPoints } from '@/hooks/useRedeemPoints'
import { TxStatus } from './TxStatus'
import type { Hex } from 'viem'

const POINTS_PER_MELO = 1000n

export function RedeemWidget({ availablePoints }: { availablePoints: number }) {
  const [amount, setAmount] = useState('')
  const { redeem, hash, isPending, error } = useRedeemPoints()

  const pointsToRedeem = BigInt(Math.floor(Number(amount) || 0))
  const meloOut = pointsToRedeem / POINTS_PER_MELO
  const valid = pointsToRedeem >= POINTS_PER_MELO && pointsToRedeem <= BigInt(availablePoints)

  async function handleRedeem() {
    if (!valid) return
    await redeem(pointsToRedeem)
    setAmount('')
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Points to redeem"
          min={1000}
          max={availablePoints}
          className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c8f135]"
        />
        <button
          onClick={handleRedeem}
          disabled={!valid || isPending}
          className="px-4 py-2 text-sm font-medium bg-[#c8f135] text-black rounded disabled:opacity-40 hover:bg-[#d4f550] transition-colors"
        >
          {isPending ? 'Redeeming…' : 'Redeem'}
        </button>
      </div>
      {amount && (
        <p className="text-xs text-white/50">
          {meloOut.toString()} $MELO out ({Number(amount).toLocaleString()} pts)
        </p>
      )}
      {error && <p className="text-xs text-red-400">{(error as Error).message}</p>}
      <TxStatus hash={hash as Hex | undefined} />
    </div>
  )
}
