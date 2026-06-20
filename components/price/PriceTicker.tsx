'use client'

import { usePrices } from '@/hooks/usePriceFeed'
import { formatPrice, formatChange, isPositiveChange, TRACKED_SYMBOLS } from '@/lib/types/price-feed'

export function PriceTicker() {
  const { data, isLoading } = usePrices()

  if (isLoading || !data) {
    return (
      <div className="flex gap-4">
        {TRACKED_SYMBOLS.map((s) => (
          <div key={s} className="text-xs text-white/30 animate-pulse">{s} —</div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {TRACKED_SYMBOLS.map((symbol) => {
        const snap = data.prices[symbol]
        if (!snap) return null
        const positive = isPositiveChange(snap.change_24h_pct)
        return (
          <div key={symbol} className="flex items-center gap-1.5">
            <span className="text-xs text-white/50">{symbol}</span>
            <span className="text-xs font-mono font-medium">{formatPrice(snap.price_usd)}</span>
            <span className="text-xs" style={{ color: positive ? '#c8f135' : '#f87171' }}>
              {formatChange(snap.change_24h_pct)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
