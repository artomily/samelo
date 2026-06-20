import { DailyRewardCard } from '@/components/rewards/DailyRewardCard'
import { WeeklyStats } from '@/components/rewards/WeeklyStats'
import { RewardTierList } from '@/components/rewards/RewardTierList'

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white px-4 py-8 max-w-lg mx-auto">
      <h1 className="font-display text-2xl text-[#c8f135] mb-6">Rewards</h1>

      <div className="space-y-4 mb-8">
        <DailyRewardCard />
        <WeeklyStats />
      </div>

      <RewardTierList />
    </main>
  )
}
