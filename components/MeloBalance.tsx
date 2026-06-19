'use client'

import { useAccount } from 'wagmi'
import { useMeloBalance } from '@/hooks/useMeloBalance'

interface Props {
  className?: string
}

export function MeloBalance({ className }: Props) {
  const { address } = useAccount()
  const { formatted, symbol, isLoading } = useMeloBalance(address)

  if (!address) return null

  return (
    <div className={className}>
      {isLoading ? (
        <span className="h-4 w-20 animate-pulse rounded bg-white/10 inline-block" />
      ) : (
        <span className="font-mono text-sm font-semibold text-[#c8f135]">
          {formatted} <span className="text-white/40 font-normal">{symbol}</span>
        </span>
      )}
    </div>
  )
}
