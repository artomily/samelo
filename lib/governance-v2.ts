import { createClient } from '@supabase/supabase-js'
import type { Proposal } from './types/governance'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getActiveProposals(): Promise<Proposal[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('status', 'active')
    .gt('ends_at', new Date().toISOString())
    .order('ends_at', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAllProposals(): Promise<Proposal[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function castVote(
  proposalId: string,
  wallet: string,
  vote: boolean,
  weight = 1
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('proposal_votes').upsert({
    proposal_id: proposalId,
    wallet,
    vote,
    weight,
  })
  if (error) {
    if (error.code === '23505') throw new Error('Already voted')
    throw new Error(error.message)
  }

  const col = vote ? 'votes_for' : 'votes_against'
  await supabase.rpc('increment_proposal_votes', { p_id: proposalId, p_col: col, p_weight: weight })
}

export async function getWalletVote(proposalId: string, wallet: string): Promise<boolean | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('proposal_votes')
    .select('vote')
    .eq('proposal_id', proposalId)
    .eq('wallet', wallet)
    .single()
  return data?.vote ?? null
}

export async function createProposal(
  title: string,
  description: string,
  proposerWallet: string,
  endsAt: string,
  quorumRequired = 100
): Promise<Proposal> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('proposals')
    .insert({ title, description, proposer_wallet: proposerWallet, ends_at: endsAt, quorum_required: quorumRequired })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}
