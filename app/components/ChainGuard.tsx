'use client'

import { useAccount, useSwitchChain } from 'wagmi'
import { activeChain } from '@/lib/wagmi'
import { useEffect } from 'react'

/**
 * ChainGuard — forces wallet to Celo mainnet.
 * If wallet is on wrong chain, shows switch prompt.
 * Aggressively re-checks and auto-switches.
 */
export function ChainGuard({ children }: { children: React.ReactNode }) {
  const { chainId, isConnected } = useAccount()
  const { switchChain, isPending } = useSwitchChain()

  const wrongChain = isConnected && chainId !== activeChain.id

  // Auto-switch on mount if wrong chain
  useEffect(() => {
    if (!wrongChain) return
    switchChain({ chainId: activeChain.id })
  }, [wrongChain, switchChain])

  if (!wrongChain) return <>{children}</>

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
      <div className="rounded-2xl border border-[rgba(200,241,53,0.2)] bg-[#0d0d0d] p-6 max-w-sm"
        style={{ boxShadow: '0 0 28px rgba(200,241,53,0.06)' }}
      >
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
          Wrong Network
        </p>
        <p className="mt-2 text-sm text-muted">
          Samelo runs on <strong>Celo Mainnet</strong>. Your wallet is on a different network.
        </p>
        <button
          onClick={() => switchChain({ chainId: activeChain.id })}
          disabled={isPending}
          className="mt-4 w-full rounded-xl border border-[rgba(200,241,53,0.35)] bg-[rgba(200,241,53,0.10)] py-3 font-display text-[12px] font-bold uppercase tracking-wider text-accent transition-all hover:border-[rgba(200,241,53,0.6)] hover:bg-[rgba(200,241,53,0.18)] disabled:opacity-50"
          style={{ boxShadow: '0 0 16px rgba(200,241,53,0.12)' }}
        >
          {isPending ? 'Switching…' : 'Switch to Celo'}
        </button>
        <p className="mt-3 text-[10px] text-muted/50">
          If auto-switch fails, manually add Celo Mainnet (Chain ID 42220) in your wallet settings.
        </p>
      </div>
    </div>
  )
}
