import { createClient } from '@supabase/supabase-js'
import type { AffiliateLink, AffiliateCampaign } from './types/affiliate'
import { generateSlug } from './types/affiliate'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getActiveCampaigns(): Promise<AffiliateCampaign[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('affiliate_campaigns')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function createCampaign(
  ownerWallet: string,
  name: string,
  commissionPct: number,
  description?: string
): Promise<AffiliateCampaign> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('affiliate_campaigns')
    .insert({ owner_wallet: ownerWallet, name, commission_pct: commissionPct, description: description ?? null })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function createAffiliateLink(
  campaignId: string,
  affiliateWallet: string,
  targetUrl: string,
  campaignName: string
): Promise<AffiliateLink> {
  const supabase = getSupabase()
  const slug = generateSlug(affiliateWallet, campaignName)
  const { data, error } = await supabase
    .from('affiliate_links')
    .insert({ campaign_id: campaignId, affiliate_wallet: affiliateWallet, slug, target_url: targetUrl })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getLinkBySlug(slug: string): Promise<AffiliateLink | null> {
  const supabase = getSupabase()
  const { data } = await supabase.from('affiliate_links').select('*').eq('slug', slug).eq('is_active', true).single()
  return data ?? null
}

export async function recordClick(linkId: string, visitorWallet?: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('affiliate_clicks').insert({ link_id: linkId, visitor_wallet: visitorWallet ?? null })
  await supabase.from('affiliate_links').update({ click_count: supabase.rpc('increment_click', { link_id: linkId }) }).eq('id', linkId)
}

export async function getWalletLinks(wallet: string): Promise<AffiliateLink[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('affiliate_links')
    .select('*')
    .eq('affiliate_wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}
