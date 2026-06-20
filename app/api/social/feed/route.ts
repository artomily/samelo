import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { getFeedForWallet } from '@/lib/activity'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('wallet')
  if (!wallet) return apiError('VALIDATION', 'wallet required', 400)

  const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') ?? '20'), 50)
  const supabase = getServiceSupabase()
  const events = await getFeedForWallet(supabase, wallet, limit)
  return apiOk({ events })
}
