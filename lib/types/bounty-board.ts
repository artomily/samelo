export type BountyStatus = 'open' | 'in_review' | 'completed' | 'cancelled'
export type BountyCategory = 'bug' | 'feature' | 'content' | 'translation' | 'design' | 'general'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface Bounty {
  id: string
  creator_wallet: string
  title: string
  description: string
  reward_melo: number
  category: BountyCategory
  status: BountyStatus
  deadline: string | null
  winner_wallet: string | null
  submission_count: number
  created_at: string
  updated_at: string
}

export interface BountySubmission {
  id: string
  bounty_id: string
  submitter_wallet: string
  submission_url: string | null
  description: string
  status: SubmissionStatus
  feedback: string | null
  submitted_at: string
}

export const CATEGORY_LABELS: Record<BountyCategory, string> = {
  bug: 'Bug Fix',
  feature: 'Feature',
  content: 'Content',
  translation: 'Translation',
  design: 'Design',
  general: 'General',
}

export const STATUS_LABELS: Record<BountyStatus, string> = {
  open: 'Open',
  in_review: 'In Review',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const STATUS_COLORS: Record<BountyStatus, string> = {
  open: '#c8f135',
  in_review: '#f1c135',
  completed: '#60a5fa',
  cancelled: '#f13535',
}

export function isAcceptingSubmissions(bounty: Bounty): boolean {
  return bounty.status === 'open'
}

export function isExpired(bounty: Bounty): boolean {
  if (!bounty.deadline) return false
  return new Date(bounty.deadline) < new Date()
}
