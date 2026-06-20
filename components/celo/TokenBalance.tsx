'use client'
import { useCeloBalance, useCusdBalance } from '@/hooks/useCeloBalance'
import { formatTokenAmount } from '@/lib/celo/tokens'

interface TokenBalanceProps {
  token: 'CELO' | 'cUSD'
  className?: string
}

export function TokenBalance({ token, className = '' }: TokenBalanceProps) {
  const celo = useCeloBalance()
  const cusd = useCusdBalance()

  const { balance, isLoading } = token === 'CELO' ? celo : cusd

  if (isLoading) {
    return (
      <span className={`inline-block w-16 h-4 bg-white/10 rounded animate-pulse ${className}`} />
    )
  }

  return (
    <span className={`font-mono text-[#c8f135] ${className}`}>
      {formatTokenAmount(balance, 18, 4)} {token}
    </span>
  )
}

export function BalanceRow() {
  return (
    <div className="flex gap-4 text-sm">
      <div className="flex flex-col">
        <span className="text-white/40 text-xs">CELO</span>
        <TokenBalance token="CELO" />
      </div>
      <div className="flex flex-col">
        <span className="text-white/40 text-xs">cUSD</span>
        <TokenBalance token="cUSD" />
      </div>
    </div>
  )
}
