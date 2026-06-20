export interface Comment {
  id: string
  wallet: string
  video_id: string
  parent_id: string | null
  body: string
  like_count: number
  is_deleted: boolean
  created_at: string
  updated_at: string
  replies?: Comment[]
  liked?: boolean
}

export const MAX_COMMENT_LENGTH = 500
export const MAX_REPLY_DEPTH = 1

export function sanitizeCommentBody(body: string): string {
  return body.trim().slice(0, MAX_COMMENT_LENGTH)
}

export function isReply(comment: Comment): boolean {
  return comment.parent_id !== null
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
