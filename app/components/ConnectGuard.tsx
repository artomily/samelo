'use client'

import { useEffect } from 'react'
import { useMiniPay } from '@/hooks/useMiniPay'

/**
 * ConnectGuard - Wrapper component ensuring wallet connection
 * Handles MiniPay auto-connection without blocking the app in normal browsers
 */
export function ConnectGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, isMiniPay, isConnecting, connectMiniPay } = useMiniPay()

  // Auto-connect when running inside MiniPay
  useEffect(() => {
    if (isMiniPay && !isConnected && !isConnecting) {
      connectMiniPay()
    }
  }, [isMiniPay, isConnected, isConnecting, connectMiniPay])

  // Only block while MiniPay is actively connecting.
  if (isMiniPay && (isMiniPay === null || !isConnected)) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
