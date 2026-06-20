export type ReportReasonV2 = 'spam' | 'harassment' | 'hate_speech' | 'misinformation' | 'nsfw' | 'other'
export type ModerationActionType = 'warn' | 'hide' | 'ban' | 'restore'

export interface ModerationActionRecord {
  id: string
  admin_wallet: string
  target_type: string
  target_id: string
  action: ModerationActionType
  note: string | null
  report_id: string | null
  created_at: string
}

export const REASON_LABELS_V2: Record<ReportReasonV2, string> = {
  spam: 'Spam',
  harassment: 'Harassment',
  hate_speech: 'Hate Speech',
  misinformation: 'Misinformation',
  nsfw: 'NSFW Content',
  other: 'Other',
}

export const ACTION_LABELS: Record<ModerationActionType, string> = {
  warn: 'Warning Issued',
  hide: 'Content Hidden',
  ban: 'Wallet Banned',
  restore: 'Content Restored',
}

export function actionSeverity(action: ModerationActionType): 'low' | 'medium' | 'high' {
  if (action === 'warn') return 'low'
  if (action === 'hide' || action === 'restore') return 'medium'
  return 'high'
}
