'use client'
import { useCeloNetwork } from '@/hooks/useNetwork'

export function NetworkBadge() {
  const { isOnCelo, isMainnet, isTestnet, chainId, switchToMainnet } = useCeloNetwork()

  if (isMainnet) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-[#c8f135]/10 text-[#c8f135] border border-[#c8f135]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c8f135] animate-pulse" />
        Celo
      </span>
    )
  }

  if (isTestnet) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        Alfajores
      </span>
    )
  }

  return (
    <button
      onClick={switchToMainnet}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
      Wrong network
    </button>
  )
}
