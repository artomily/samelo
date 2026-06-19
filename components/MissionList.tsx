'use client'

import { useMissions } from '@/hooks/useMissions'
import { MissionCard } from './MissionCard'
import { Skeleton } from './Skeleton'
import { useAccount } from 'wagmi'
import { useState } from 'react'

export function MissionList() {
  const { address } = useAccount()
  const { data: missions, isLoading, error, claim } = useMissions(address)
  const [claimingId, setClaimingId] = useState<string | null>(null)

  async function handleClaim(missionId: string) {
    if (!address) return
    setClaimingId(missionId)
    try {
      await claim.mutateAsync(missionId)
    } finally {
      setClaimingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-white/40 text-sm text-center py-8">Failed to load missions</p>
  }

  if (!missions?.length) {
    return <p className="text-white/40 text-sm text-center py-8">No missions available</p>
  }

  const available = missions.filter((m) => !m.isClaimed)
  const completed = missions.filter((m) => m.isClaimed)

  return (
    <div className="space-y-6">
      {available.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Active Missions</h2>
          {available.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onClaim={address ? handleClaim : undefined}
              claiming={claimingId === mission.id}
            />
          ))}
        </section>
      )}

      {completed.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Completed</h2>
          {completed.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </section>
      )}
    </div>
  )
}
