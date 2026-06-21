import { createClient } from '@supabase/supabase-js'
import type { Bounty, BountySubmission, BountyCategory } from './types/bounty-board'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getOpenBounties(category?: BountyCategory): Promise<Bounty[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('bounties')
    .select('*')
    .eq('status', 'open')
    .order('reward_melo', { ascending: false })

  if (category) query = query.eq('category', category)
  const { data } = await query
  return data ?? []
}

export async function getBounty(id: string): Promise<Bounty | null> {
  const supabase = getSupabase()
  const { data } = await supabase.from('bounties').select('*').eq('id', id).single()
  return data ?? null
}

export async function createBounty(
  creatorWallet: string,
  title: string,
  description: string,
  rewardMelo: number,
  opts: { category?: BountyCategory; deadline?: string } = {}
): Promise<Bounty> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bounties')
    .insert({
      creator_wallet: creatorWallet,
      title,
      description,
      reward_melo: rewardMelo,
      category: opts.category ?? 'general',
      deadline: opts.deadline ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function submitBounty(
  bountyId: string,
  submitterWallet: string,
  description: string,
  submissionUrl?: string
): Promise<BountySubmission> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bounty_submissions')
    .upsert({
      bounty_id: bountyId,
      submitter_wallet: submitterWallet,
      description,
      submission_url: submissionUrl ?? null,
    }, { onConflict: 'bounty_id,submitter_wallet' })
    .select()
    .single()
  if (error) throw new Error(error.message)

  await supabase.rpc('increment_bounty_submissions', { bounty_id: bountyId })
  return data
}

export async function approveSubmission(
  submissionId: string,
  winnerWallet: string,
  bountyId: string
): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('bounty_submissions').update({ status: 'approved' }).eq('id', submissionId)
  await supabase
    .from('bounties')
    .update({ status: 'completed', winner_wallet: winnerWallet, updated_at: new Date().toISOString() })
    .eq('id', bountyId)
}

export async function getBountySubmissions(bountyId: string): Promise<BountySubmission[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('bounty_submissions')
    .select('*')
    .eq('bounty_id', bountyId)
    .order('submitted_at')
  return data ?? []
}
