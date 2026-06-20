'use client'

import { useAccount } from 'wagmi'
import { StakeForm } from '@/components/staking/StakeForm'
import { StakePositionList } from '@/components/staking/StakePositionList'
import { MultiplierBadge } from '@/components/staking/MultiplierBadge'

export default function StakePage() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/40">Connect wallet to stake $MELO.</p>
      </div>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Orbitron']">Stake $MELO</h1>
        <p className="text-white/40 text-sm mt-1">Lock $MELO to earn bonus watch points</p>
        <div className="mt-3">
          <MultiplierBadge />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-sm font-semibold text-white/70 mb-4">New Stake</h2>
        <StakeForm />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white/70 mb-3">Your Positions</h2>
        <StakePositionList />
      </div>
    </main>
  )
}
