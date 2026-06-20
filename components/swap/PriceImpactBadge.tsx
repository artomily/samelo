'use client'

import { formatPriceImpact, isHighPriceImpact } from '@/lib/types/swap'

interface Props {
  impact: number
}

export function PriceImpactBadge({ impact }: Props) {
  const high = isHighPriceImpact(impact)
  return (
    <span
      className={['text-xs px-2 py-0.5 rounded font-medium', high ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60'].join(' ')}
    >
      {high && '⚠ '}{formatPriceImpact(impact)} impact
    </span>
  )
}
