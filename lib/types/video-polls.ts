export interface VideoPoll {
  id: string
  video_id: string
  creator_wallet: string
  question: string
  is_multiple_choice: boolean
  ends_at: string | null
  is_active: boolean
  created_at: string
}

export interface PollOption {
  id: string
  poll_id: string
  option_text: string
  option_index: number
  vote_count: number
}

export interface PollVote {
  id: string
  poll_id: string
  option_id: string
  wallet: string
  voted_at: string
}

export interface PollWithOptions extends VideoPoll {
  options: PollOption[]
  total_votes: number
  wallet_vote: string[] | null
}

export function isOpen(poll: VideoPoll): boolean {
  if (!poll.is_active) return false
  if (!poll.ends_at) return true
  return new Date(poll.ends_at) > new Date()
}

export function optionPct(option: PollOption, totalVotes: number): number {
  if (totalVotes === 0) return 0
  return Math.round((option.vote_count / totalVotes) * 100)
}

export function topOption(options: PollOption[]): PollOption | null {
  if (options.length === 0) return null
  return options.reduce((a, b) => (a.vote_count >= b.vote_count ? a : b))
}
