import { createClient } from '@supabase/supabase-js'
import type { Proposal, Vote, VoteChoice } from './types/governance'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getProposals(status?: string): Promise<Proposal[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getProposal(id: string): Promise<Proposal | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createProposal(
  proposerWallet: string,
  title: string,
  description: string,
  endsAt: Date,
  minMeloToVote = 100
): Promise<Proposal> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('proposals')
    .insert({
      title,
      description,
      proposer_wallet: proposerWallet,
      ends_at: endsAt.toISOString(),
      min_melo_to_vote: minMeloToVote,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function castVote(
  proposalId: string,
  voterWallet: string,
  choice: VoteChoice,
  meloWeight = 1
): Promise<void> {
  const supabase = getSupabase()

  const { data: proposal } = await supabase
    .from('proposals')
    .select('status, ends_at')
    .eq('id', proposalId)
    .single()

  if (!proposal || proposal.status !== 'active') throw new Error('Proposal is not active')
  if (new Date(proposal.ends_at) < new Date()) throw new Error('Voting period has ended')

  const { error: voteError } = await supabase
    .from('votes')
    .upsert({ proposal_id: proposalId, voter_wallet: voterWallet, vote: choice, melo_weight: meloWeight })

  if (voteError) throw voteError

  const column = choice === 'for' ? 'votes_for' : 'votes_against'
  await supabase.rpc('increment_proposal_vote', { proposal_id: proposalId, column_name: column })
}

export async function getUserVote(proposalId: string, wallet: string): Promise<Vote | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('votes')
    .select('*')
    .eq('proposal_id', proposalId)
    .eq('voter_wallet', wallet)
    .maybeSingle()
  return data
}
