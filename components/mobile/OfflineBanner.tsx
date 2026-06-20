'use client'

import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus()
  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-red-500/90 backdrop-blur-sm text-white text-xs text-center py-2 font-medium">
      You're offline — some features may be unavailable
    </div>
  )
}
