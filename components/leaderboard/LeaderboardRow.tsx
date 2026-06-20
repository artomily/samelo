'use client'

import { getMedalEmoji } from '@/lib/types/leaderboard'
import type { LeaderboardEntry } from '@/lib/types/leaderboard'
import { shortenAddress } from '@/lib/celo/wallet'

interface Props {
  entry: LeaderboardEntry
  isMe?: boolean
}

export function LeaderboardRow({ entry, isMe }: Props) {
  const medal = getMedalEmoji(entry.rank)
  const isTop3 = entry.rank <= 3

  return (
    <div
      className={[
        'flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors',
        isMe
          ? 'border-[#c8f135]/40 bg-[#c8f135]/5'
          : 'border-white/10 bg-white/5 hover:bg-white/10',
      ].join(' ')}
    >
      <span
        className={['text-base w-8 text-center shrink-0', isTop3 ? 'text-xl' : 'text-white/40 text-sm'].join(' ')}
      >
        {medal}
      </span>
      <span className="flex-1 font-mono text-sm truncate" style={{ color: isMe ? '#c8f135' : undefined }}>
        {shortenAddress(entry.wallet)}
        {isMe && <span className="ml-2 text-xs text-white/40">(you)</span>}
      </span>
      <span className="text-sm font-semibold tabular-nums" style={{ color: '#c8f135' }}>
        {entry.points.toLocaleString()} pts
      </span>
    </div>
  )
}
