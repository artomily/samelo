import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET() {
  const start = Date.now()

  try {
    const supabase = getServiceSupabase()
    await supabase.from('profiles').select('wallet').limit(1)
    const dbLatencyMs = Date.now() - start

    return NextResponse.json({
      status: 'ok',
      version: process.env.npm_package_version ?? '0.0.0',
      dbLatencyMs,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ status: 'degraded', error: 'DB unreachable' }, { status: 503 })
  }
}
