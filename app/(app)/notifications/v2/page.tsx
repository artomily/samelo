'use client'

import { useAccount } from 'wagmi'
import { NotificationFeedV2 } from '@/components/notifications/NotificationFeedV2'

export default function NotificationsV2Page() {
  const { address } = useAccount()

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        Notifications
      </h1>
      {!address ? (
        <p className="text-sm text-white/40">Connect your wallet to see notifications.</p>
      ) : (
        <NotificationFeedV2 wallet={address} />
      )}
    </main>
  )
}
