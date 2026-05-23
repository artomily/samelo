'use client'

import { useState, useCallback } from 'react'
import { EarningsList } from '@/app/components/EarningsList'
import { EarningsHeader } from '@/app/components/EarningsHeader'
import { EarnPointsButton } from '@/app/components/EarnPointsButton'

export default function EarningsPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const handleEarned = useCallback(() => setRefreshKey((k) => k + 1), [])

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <EarningsHeader />

      <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-5 pb-24">
        <EarnPointsButton onEarned={handleEarned} />
        <EarningsList key={refreshKey} />
      </div>
    </div>
  )
}
