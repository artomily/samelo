import { createClient } from '@supabase/supabase-js'
import type { PlatformMetrics } from './types/platform-analytics'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function trackPageView(
  path: string,
  wallet?: string,
  referrer?: string,
  sessionId?: string
): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('page_views').insert({
    path,
    wallet: wallet ?? null,
    referrer: referrer ?? null,
    session_id: sessionId ?? null,
  })
}

export async function trackFeatureUsage(
  wallet: string,
  feature: string,
  action: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('feature_usage').insert({ wallet, feature, action, metadata })
}

export async function getPlatformMetrics(sinceDays = 30): Promise<PlatformMetrics> {
  const supabase = getSupabase()
  const since = new Date(Date.now() - sinceDays * 86400_000).toISOString()

  const [pvResult, fuResult] = await Promise.all([
    supabase.from('page_views').select('path, wallet').gte('created_at', since),
    supabase.from('feature_usage').select('feature').gte('created_at', since),
  ])

  const pvRows = pvResult.data ?? []
  const fuRows = fuResult.data ?? []

  const pathCounts = new Map<string, number>()
  const walletSet = new Set<string>()
  for (const row of pvRows) {
    pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1)
    if (row.wallet) walletSet.add(row.wallet)
  }

  const featureCounts = new Map<string, number>()
  for (const row of fuRows) {
    featureCounts.set(row.feature, (featureCounts.get(row.feature) ?? 0) + 1)
  }

  return {
    totalPageViews: pvRows.length,
    uniqueWallets: walletSet.size,
    topPaths: [...pathCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count })),
    topFeatures: [...featureCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([feature, count]) => ({ feature, count })),
  }
}
