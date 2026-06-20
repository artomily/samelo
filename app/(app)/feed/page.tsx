'use client'

import { useAccount } from 'wagmi'
import { ActivityFeed } from '@/components/social/ActivityFeed'

export default function FeedPage() {
  const { address } = useAccount()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Activity Feed</h1>
        <p className="text-white/50 mt-1">See what the community is watching and earning</p>
      </div>
      <ActivityFeed wallet={address ?? null} />
    </div>
  )
}
