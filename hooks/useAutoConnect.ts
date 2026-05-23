'use client'

import { useEffect, useRef } from 'react'
import { useAccount, useConnect, useSwitchChain } from 'wagmi'
import { activeChain } from '@/lib/wagmi'

/**
 * Auto-connects to the injected wallet provider (MiniPay / MetaMask / Rabby).
 * Switches wallet to Celo Sepolia first, then connects.
 */
export function useAutoConnect() {
  const { isConnected, isConnecting, isReconnecting } = useAccount()
  const { connectors, connect } = useConnect()
  const { switchChain } = useSwitchChain()
  const attemptedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isConnected || isConnecting || isReconnecting) {
      attemptedRef.current = true
      return
    }
    if (attemptedRef.current) return

    const provider = (window as unknown as { ethereum?: unknown }).ethereum
    if (!provider) return

    const hasRequest = typeof (provider as { request?: unknown }).request === 'function'
    if (!hasRequest) return

    const injectedConnector = connectors.find(
      (c) => c.type === 'injected' || c.id === 'injected',
    )
    if (!injectedConnector) return

    attemptedRef.current = true

    // Switch to Celo Sepolia — connect after
    switchChain({ chainId: activeChain.id }, {
      onSuccess: () => {
        connect({ connector: injectedConnector })
      },
      onError: () => {
        // Chain may not be in wallet yet — connect anyway
        // (wagmi will trigger wallet_addEthereumChain when needed)
        connect({ connector: injectedConnector })
      },
    })
  }, [isConnected, isConnecting, isReconnecting, connectors, connect, switchChain])
}
