'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useLeaderboard } from '@/hooks/useLeaderboardV2'
import { LeaderboardRow } from './LeaderboardRow'
import { LeaderboardPeriodTabs } from './LeaderboardPeriodTabs'
import { MyRankBanner } from './MyRankBanner'
import type { LeaderboardPeriod } from '@/lib/types/leaderboard'

export function LeaderboardList() {
  const { address } = useAccount()
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly')
  const { data, isLoading } = useLeaderboard(period)

  return (
    <div className="space-y-4">
      <LeaderboardPeriodTabs active={period} onChange={setPeriod} />

      {address && <MyRankBanner wallet={address} period={period} />}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && !data?.entries?.length && (
        <p className="text-white/40 text-sm text-center py-8">No data yet for this period.</p>
      )}

      {data?.entries && (
        <div className="space-y-2">
          {data.entries.map((entry) => (
            <LeaderboardRow
              key={entry.wallet}
              entry={entry}
              isMe={address?.toLowerCase() === entry.wallet.toLowerCase()}
            />
          ))}
        </div>
      )}
    </div>
  )
}
