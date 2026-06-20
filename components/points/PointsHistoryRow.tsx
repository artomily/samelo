'use client'

import { SOURCE_ICONS, SOURCE_LABELS, formatDelta } from '@/lib/types/points-history'
import type { PointsHistoryEntry } from '@/lib/types/points-history'

interface Props {
  entry: PointsHistoryEntry
}

export function PointsHistoryRow({ entry }: Props) {
  const icon = SOURCE_ICONS[entry.source]
  const label = SOURCE_LABELS[entry.source]
  const isPositive = entry.delta > 0

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/8">
      <span className="text-base flex-shrink-0 w-6 text-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{entry.description ?? label}</p>
        <p className="text-xs text-white/30">{new Date(entry.created_at).toLocaleDateString()}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold" style={{ color: isPositive ? '#c8f135' : '#f87171' }}>
          {formatDelta(entry.delta)}
        </p>
        <p className="text-xs text-white/30">{entry.balance_after.toLocaleString()} total</p>
      </div>
    </div>
  )
}
