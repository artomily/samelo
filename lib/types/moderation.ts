export type ReportTargetType = 'video' | 'comment' | 'profile' | 'playlist'
export type ReportReason = 'spam' | 'inappropriate' | 'misinformation' | 'copyright' | 'other'
export type ReportStatus = 'pending' | 'reviewed' | 'actioned' | 'dismissed'

export interface Report {
  id: string
  reporter_wallet: string
  target_type: ReportTargetType
  target_id: string
  reason: ReportReason
  description: string | null
  status: ReportStatus
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

export interface BannedWallet {
  wallet: string
  reason: string
  banned_by: string
  banned_at: string
  expires_at: string | null
}

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: 'Spam',
  inappropriate: 'Inappropriate Content',
  misinformation: 'Misinformation',
  copyright: 'Copyright Violation',
  other: 'Other',
}

export const REPORT_STATUS_COLORS: Record<ReportStatus, string> = {
  pending: '#fbcc5c',
  reviewed: '#60a5fa',
  actioned: '#f87171',
  dismissed: '#6b7280',
}
