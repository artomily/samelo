'use client'

import type { VideoCategory } from '@/lib/types/video'

interface CategoryPillProps {
  category: VideoCategory
  active?: boolean
  onClick?: () => void
}

const CATEGORY_EMOJI: Record<VideoCategory, string> = {
  general: '🌐',
  defi: '💰',
  nft: '🖼️',
  gaming: '🎮',
  dao: '🗳️',
  layer2: '⚡',
  celo: '🟡',
}

export function CategoryPill({ category, active, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? 'bg-[#c8f135] text-black'
          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span>{CATEGORY_EMOJI[category]}</span>
      <span className="capitalize">{category === 'layer2' ? 'Layer 2' : category}</span>
    </button>
  )
}
