import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET() {
  const supabase = getServiceSupabase()

  const { data: videos } = await supabase
    .from('videos')
    .select('id, updated_at')
    .eq('is_active', true)
    .limit(1000)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://samelo.app'

  const staticPaths = ['', '/leaderboard', '/playlists', '/feed']
  const videoPaths = (videos ?? []).map(v => `/watch/${v.id}`)

  const urls = [...staticPaths, ...videoPaths].map(path => ({
    loc: `${baseUrl}${path}`,
    lastmod: new Date().toISOString(),
    changefreq: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? '1.0' : '0.7',
  }))

  return NextResponse.json({ urls, count: urls.length }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600' },
  })
}
