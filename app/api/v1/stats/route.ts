import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET() {
  const supabase = getServiceSupabase()

  const [users, videos, watches, swaps] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('videos').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('watch_history').select('*', { count: 'exact', head: true }),
    supabase.from('swaps').select('*', { count: 'exact', head: true }),
  ])

  return NextResponse.json({
    totalUsers: users.count ?? 0,
    totalVideos: videos.count ?? 0,
    totalWatches: watches.count ?? 0,
    totalSwaps: swaps.count ?? 0,
    generatedAt: new Date().toISOString(),
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
  })
}
