import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const supabase = getServiceSupabase()
  const { data: campaign } = await supabase
    .from('ad_campaigns')
    .select('id, budget_cents, spent_cents, cpm_cents, advertisers!inner(wallet)')
    .eq('id', params.id)
    .eq('advertisers.wallet', wallet.toLowerCase())
    .single()

  if (!campaign) return apiError('NOT_FOUND', 'Campaign not found', 404)

  const { data: impressions, count } = await supabase
    .from('ad_impressions')
    .select('cost_cents, created_at', { count: 'exact' })
    .eq('campaign_id', params.id)

  const totalImpressions = count ?? 0
  const totalSpent = campaign.spent_cents
  const remaining = campaign.budget_cents - totalSpent
  const fillRate = campaign.budget_cents > 0 ? totalSpent / campaign.budget_cents : 0
  const avgCpm = totalImpressions > 0 ? (totalSpent / totalImpressions) * 1000 : 0

  return apiOk({
    totalImpressions,
    totalSpent,
    remainingBudget: remaining,
    fillRate: Math.min(1, fillRate),
    avgCpm,
  })
}
