'use client'

import { useNftBadges } from '@/hooks/useNftBadges'
import { BadgeCard } from './BadgeCard'

interface Props {
  wallet?: string
}

export function BadgeGrid({ wallet }: Props) {
  const { data, isLoading } = useNftBadges(wallet)

  if (isLoading) return <p className="text-sm text-white/40">Loading badges…</p>
  if (!data?.definitions.length) return <p className="text-sm text-white/40">No badges available.</p>

  const earned = data.mints.length
  const total = data.definitions.length

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50">{earned} / {total} earned</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {data.definitions.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} mints={data.mints} />
        ))}
      </div>
    </div>
  )
}
