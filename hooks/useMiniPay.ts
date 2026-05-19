'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export function useMiniPay() {
  const { address, isConnected, status } = useAccount()
  const { connect, isPending } = useConnect()
  const [isMiniPay, setIsMiniPay] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const eth = (window as unknown as { ethereum?: { isMiniPay?: boolean } })
      .ethereum
    setIsMiniPay(!!eth?.isMiniPay)
  }, [])

  function connectMiniPay() {
    connect({ connector: injected() })
  }

  return {
    address,
    isConnected,
    isConnecting: isPending || status === 'connecting',
    isMiniPay,
    connectMiniPay,
  }
}
