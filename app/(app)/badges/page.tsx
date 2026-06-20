'use client'

import { useAccount } from 'wagmi'
import { BadgeGrid } from '@/components/badges/BadgeGrid'

export default function BadgesPage() {
  const { address } = useAccount()

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          NFT Badges
        </h1>
        <p className="text-sm text-white/50 mt-1">Earn badges by completing milestones on Samelo.</p>
      </header>
      <BadgeGrid wallet={address} />
    </main>
  )
}
