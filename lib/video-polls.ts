import { createClient } from '@supabase/supabase-js'
import type { VideoPoll, PollOption, PollWithOptions } from './types/video-polls'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createPoll(
  videoId: string,
  creatorWallet: string,
  question: string,
  options: string[],
  opts: { isMultipleChoice?: boolean; endsAt?: string } = {}
): Promise<PollWithOptions> {
  const supabase = getSupabase()
  const { data: poll, error } = await supabase
    .from('video_polls')
    .insert({
      video_id: videoId,
      creator_wallet: creatorWallet,
      question,
      is_multiple_choice: opts.isMultipleChoice ?? false,
      ends_at: opts.endsAt ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)

  const optionRows = options.map((text, i) => ({
    poll_id: poll.id,
    option_text: text,
    option_index: i,
  }))

  const { data: pollOptions } = await supabase
    .from('poll_options')
    .insert(optionRows)
    .select()

  return { ...poll, options: pollOptions ?? [], total_votes: 0, wallet_vote: null }
}

export async function getPoll(pollId: string, wallet?: string): Promise<PollWithOptions | null> {
  const supabase = getSupabase()
  const { data: poll } = await supabase
    .from('video_polls')
    .select('*')
    .eq('id', pollId)
    .single()

  if (!poll) return null

  const { data: options } = await supabase
    .from('poll_options')
    .select('*')
    .eq('poll_id', pollId)
    .order('option_index')

  const totalVotes = (options ?? []).reduce((sum: number, o: PollOption) => sum + o.vote_count, 0)

  let walletVote: string[] | null = null
  if (wallet) {
    const { data: votes } = await supabase
      .from('poll_votes')
      .select('option_id')
      .eq('poll_id', pollId)
      .eq('wallet', wallet)
    walletVote = votes?.map((v) => v.option_id) ?? []
  }

  return { ...poll, options: options ?? [], total_votes: totalVotes, wallet_vote: walletVote }
}

export async function getVideoPolls(videoId: string): Promise<VideoPoll[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('video_polls')
    .select('*')
    .eq('video_id', videoId)
    .eq('is_active', true)
    .order('created_at')
  return data ?? []
}

export async function castVote(pollId: string, optionId: string, wallet: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('poll_votes')
    .insert({ poll_id: pollId, option_id: optionId, wallet })
  if (error) throw new Error(error.message)

  await supabase.rpc('increment_poll_vote', { opt_id: optionId })
}
