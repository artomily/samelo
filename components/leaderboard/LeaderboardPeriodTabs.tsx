'use client'

import { PERIOD_LABELS } from '@/lib/types/leaderboard'
import type { LeaderboardPeriod } from '@/lib/types/leaderboard'

interface Props {
  active: LeaderboardPeriod
  onChange: (p: LeaderboardPeriod) => void
}

const PERIODS: LeaderboardPeriod[] = ['daily', 'weekly', 'alltime']

export function LeaderboardPeriodTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
      {PERIODS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={[
            'px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
            active === p
              ? 'text-[#030303]'
              : 'text-white/50 hover:text-white/80',
          ].join(' ')}
          style={active === p ? { background: '#c8f135' } : {}}
        >
          {PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  )
}
