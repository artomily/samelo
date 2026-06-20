'use client'

import { useAccount } from 'wagmi'
import { useVestingSchedules } from '@/hooks/useVesting'
import { VestingScheduleCard } from '@/components/vesting/VestingScheduleCard'

export default function VestingPage() {
  const { address } = useAccount()
  const { data, isLoading, refetch } = useVestingSchedules(address)

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1
        className="text-2xl font-bold tracking-wider uppercase"
        style={{ fontFamily: 'Orbitron, sans-serif', color: '#c8f135' }}
      >
        Vesting
      </h1>

      {!address && (
        <p className="text-white/50">Connect your wallet to view vesting schedules.</p>
      )}

      {address && isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {address && !isLoading && (!data?.schedules?.length) && (
        <p className="text-white/50">No vesting schedules found for this wallet.</p>
      )}

      {data?.schedules && data.schedules.length > 0 && (
        <div className="space-y-4">
          {data.schedules.map((s) => (
            <VestingScheduleCard
              key={s.id}
              schedule={s}
              wallet={address!}
              onClaimed={() => refetch()}
            />
          ))}
        </div>
      )}
    </main>
  )
}
