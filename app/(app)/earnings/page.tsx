import { EarningsList } from '@/app/components/EarningsList'
import { RewardPoolBalance } from '@/app/components/RewardPoolBalance'
import { EarningsHeader } from '@/app/components/EarningsHeader'

export default function EarningsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <EarningsHeader />

      <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-5 pb-24">
        <RewardPoolBalance />
        <EarningsList />
      </div>
    </div>
  )
}
