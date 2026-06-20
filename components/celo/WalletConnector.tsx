'use client'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { shortenAddress } from '@/lib/celo/wallet'
import { NetworkBadge } from './NetworkBadge'

export function WalletConnector() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <NetworkBadge />
        <span className="text-sm font-mono text-white/80">{shortenAddress(address)}</span>
        <button
          onClick={() => disconnect()}
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {connectors.slice(0, 2).map(connector => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="px-3 py-1.5 text-sm font-medium bg-[#c8f135] text-black rounded hover:bg-[#d4f550] disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Connecting…' : `Connect ${connector.name}`}
        </button>
      ))}
    </div>
  )
}
