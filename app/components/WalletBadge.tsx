'use client'

import { useMiniPay } from '@/hooks/useMiniPay'
import { useCUSDBalance } from '@/hooks/useCUSDBalance'

export function WalletBadge() {
  const { address, isConnected } = useMiniPay()
  const { display: balance, isLoading } = useCUSDBalance(address)

  if (!isConnected || !address) return null

  const short = `${address.slice(0, 6)}…${address.slice(-4)}`

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
      <span className="font-mono text-xs text-muted">{short}</span>
      {/* <span className="font-semibold text-primary">
        {isLoading ? '…' : `$${balance}`}{' '}
        <span className="text-xs font-normal text-muted">MELOUSD</span>
      </span> */}
    </div>
  )
}
