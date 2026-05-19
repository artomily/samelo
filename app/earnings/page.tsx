import { ConnectGuard } from '@/app/components/ConnectGuard'
import { EarningsList } from '@/app/components/EarningsList'
import { RewardPoolBalance } from '@/app/components/RewardPoolBalance'

export default function EarningsPage() {
  return (
    <ConnectGuard>
      <div className="flex min-h-dvh flex-col bg-bg">
        <header className="sticky top-0 z-30 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm">
          <h1 className="text-base font-bold tracking-tight">Earnings</h1>
        </header>

        <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-5 pb-24">
          <RewardPoolBalance />
          <EarningsList />
        </div>
      </div>
    </ConnectGuard>
  )
}
