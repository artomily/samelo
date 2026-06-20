import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isValidAddress } from '@/lib/address'
import { lastNDays } from '@/lib/date-range'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')
  const days = Math.min(parseInt(searchParams.get('days') ?? '30'), 90)

  if (!wallet || !isValidAddress(wallet)) return apiError('MISSING_PARAMS', 'Valid wallet required', 400)

  const walletLower = wallet.toLowerCase()
  const supabase = getServiceSupabase()
  const since = new Date(Date.now() - days * 86_400_000).toISOString()

  const { data: watches, error } = await supabase
    .from('watches')
    .select('watched_at, reward_cents')
    .eq('wallet_address', walletLower)
    .gte('watched_at', since)
    .order('watched_at', { ascending: true })

  if (error) return apiError('DB_ERROR', error.message, 500)

  // Bucket by day
  const dates = lastNDays(days)
  const byDay = new Map<string, { watches: number; points: number }>()
  for (const d of dates) byDay.set(d, { watches: 0, points: 0 })

  for (const row of (watches ?? [])) {
    const day = row.watched_at.slice(0, 10)
    if (byDay.has(day)) {
      const entry = byDay.get(day)!
      entry.watches++
      entry.points += row.reward_cents ?? 0
    }
  }

  const timeline = dates.map(date => ({ date, ...byDay.get(date)! }))
  return apiOk({ timeline, days })
}
