'use client'

import { useAccount } from 'wagmi'
import { CreatorStatsSummary } from '@/components/creator/CreatorStatsSummary'

export default function CreatorDashboardPage() {
  const { address } = useAccount()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <header>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Creator Dashboard
        </h1>
        <p className="text-sm text-white/50 mt-1">Your content performance over the last 30 days.</p>
      </header>

      {!address ? (
        <p className="text-sm text-white/40">Connect your wallet to view your creator stats.</p>
      ) : (
        <CreatorStatsSummary wallet={address} />
      )}
    </main>
  )
}
