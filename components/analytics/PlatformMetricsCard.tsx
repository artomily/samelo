'use client'

import { usePlatformMetrics } from '@/hooks/usePlatformAnalytics'

interface Props {
  adminWallet: string
  days?: number
}

export function PlatformMetricsCard({ adminWallet, days = 30 }: Props) {
  const { data, isLoading } = usePlatformMetrics(adminWallet, days)
  const m = data?.metrics

  if (isLoading) return <p className="text-sm text-white/40">Loading metrics…</p>
  if (!m) return null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <MetricBox label="Page Views" value={m.totalPageViews.toLocaleString()} />
        <MetricBox label="Unique Wallets" value={m.uniqueWallets.toLocaleString()} />
      </div>

      <section>
        <h3 className="text-xs text-white/40 uppercase tracking-wider mb-2">Top Pages</h3>
        <ul className="space-y-1">
          {m.topPaths.slice(0, 5).map(({ path, count }) => (
            <li key={path} className="flex justify-between text-xs">
              <span className="text-white/60 truncate max-w-[200px]">{path}</span>
              <span className="text-white/40">{count}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xs text-white/40 uppercase tracking-wider mb-2">Top Features</h3>
        <ul className="space-y-1">
          {m.topFeatures.slice(0, 5).map(({ feature, count }) => (
            <li key={feature} className="flex justify-between text-xs">
              <span className="text-white/60">{feature}</span>
              <span className="text-white/40">{count}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
      <p className="text-2xl font-bold" style={{ color: '#c8f135' }}>{value}</p>
      <p className="text-xs text-white/40 mt-1">{label}</p>
    </div>
  )
}
