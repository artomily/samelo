'use client'

import { RARITY_COLORS, RARITY_LABELS, isMinted } from '@/lib/types/nft-badge'
import type { NftBadgeDefinition, NftBadgeMint } from '@/lib/types/nft-badge'

interface Props {
  badge: NftBadgeDefinition
  mints: NftBadgeMint[]
}

export function BadgeCard({ badge, mints }: Props) {
  const earned = isMinted(badge, mints)
  const rarityColor = RARITY_COLORS[badge.rarity]

  return (
    <div className={[
      'rounded-xl border p-4 space-y-2 text-center transition-opacity',
      earned ? 'border-white/20 bg-white/5' : 'border-white/8 bg-white/3 opacity-50',
    ].join(' ')}>
      <div
        className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl border-2"
        style={{ borderColor: rarityColor }}
      >
        {earned ? '🏅' : '🔒'}
      </div>
      <p className="text-sm font-semibold">{badge.name}</p>
      <p className="text-xs text-white/40 leading-snug">{badge.description}</p>
      <span
        className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
        style={{ color: rarityColor, background: `${rarityColor}20` }}
      >
        {RARITY_LABELS[badge.rarity]}
      </span>
      {earned && (
        <p className="text-xs" style={{ color: '#c8f135' }}>Earned</p>
      )}
    </div>
  )
}
