'use client'

import { useAccount } from 'wagmi'
import { useUserAchievements } from '@/hooks/useAchievementsV2'
import { AchievementBadge } from './AchievementBadge'
import type { AchievementCategory } from '@/lib/types/achievement'
import { CATEGORY_LABELS } from '@/lib/types/achievement'
import { useState } from 'react'

const CATEGORIES: (AchievementCategory | 'all')[] = ['all', 'watch', 'quiz', 'social', 'stake', 'swap', 'general']

export function AchievementsGrid() {
  const { address } = useAccount()
  const { data, isLoading } = useUserAchievements(address)
  const [filter, setFilter] = useState<AchievementCategory | 'all'>('all')

  const filtered = (data?.achievements ?? []).filter((a) =>
    filter === 'all' ? true : a.definition?.category === filter
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-1 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={[
              'px-3 py-1 rounded-full text-xs transition-all',
              filter === cat ? 'text-[#030303]' : 'bg-white/10 text-white/60 hover:bg-white/20',
            ].join(' ')}
            style={filter === cat ? { background: '#c8f135' } : {}}
          >
            {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {!address && <p className="text-white/40 text-sm">Connect wallet to see your achievements.</p>}

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((a) => a.definition && (
            <AchievementBadge
              key={a.achievement_id}
              achievement={a as Parameters<typeof AchievementBadge>[0]['achievement']}
            />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="text-white/40 text-sm">No achievements in this category yet.</p>
      )}
    </div>
  )
}
