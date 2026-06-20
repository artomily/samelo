'use client'

import { subscriptionPrice, yearlyDiscount } from '@/lib/types/subscription'
import type { SubscriptionTier, SubscriptionPeriod } from '@/lib/types/subscription'

interface Props {
  tier: SubscriptionTier
  period: SubscriptionPeriod
  isActive?: boolean
  onSelect?: () => void
}

export function TierCard({ tier, period, isActive, onSelect }: Props) {
  const price = subscriptionPrice(tier, period)
  const discount = period === 'yearly' ? yearlyDiscount(tier) : 0
  const isElite = tier.name === 'elite'

  return (
    <div
      className={`relative bg-[#0d0d0d] border rounded-xl p-5 space-y-4 cursor-pointer transition-all ${
        isElite ? 'border-[#c8f135]' : isActive ? 'border-[#333]' : 'border-[#1a1a1a] hover:border-[#333]'
      }`}
      onClick={onSelect}
    >
      {isElite && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#030303] bg-[#c8f135] px-2 py-0.5 rounded uppercase">
          Most Popular
        </span>
      )}
      <div>
        <h3 className="font-bold text-white font-[Orbitron] text-lg">{tier.display_name}</h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-[#c8f135]">{price}</span>
          <span className="text-xs text-[#555]">MELO/{period === 'yearly' ? 'yr' : 'mo'}</span>
          {discount > 0 && (
            <span className="text-xs text-green-400 ml-2">Save {discount}%</span>
          )}
        </div>
      </div>
      {tier.bonus_points_pct > 0 && (
        <p className="text-xs text-[#c8f135]">+{tier.bonus_points_pct}% bonus points</p>
      )}
      <ul className="space-y-1">
        {tier.features.map((f: string, i: number) => (
          <li key={i} className="text-xs text-[#888] flex items-center gap-2">
            <span className="text-[#c8f135]">✓</span> {f}
          </li>
        ))}
      </ul>
      {isActive && (
        <span className="block text-center text-xs font-bold text-[#c8f135] border border-[#c8f135] rounded py-1">
          Current Plan
        </span>
      )}
    </div>
  )
}
