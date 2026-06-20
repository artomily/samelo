'use client'

import { useState } from 'react'
import { useSubmitReport } from '@/hooks/useModeration'
import { REASON_LABELS_V2 } from '@/lib/types/moderation-v2'
import type { ReportReasonV2 } from '@/lib/types/moderation-v2'

interface Props {
  wallet: string
  targetType: string
  targetId: string
  onClose: () => void
}

const REASONS = Object.entries(REASON_LABELS_V2) as [ReportReasonV2, string][]

export function ReportFormV2({ wallet, targetType, targetId, onClose }: Props) {
  const [reason, setReason] = useState<ReportReasonV2>('spam')
  const [details, setDetails] = useState('')
  const { mutate, isPending, isSuccess } = useSubmitReport(wallet)

  if (isSuccess) {
    return (
      <div className="p-4 text-center space-y-2">
        <p className="text-sm font-medium" style={{ color: '#c8f135' }}>Report submitted</p>
        <p className="text-xs text-white/40">Our moderation team will review it shortly.</p>
        <button onClick={onClose} className="text-xs text-white/50 hover:text-white/80">Close</button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        mutate({ target_type: targetType, target_id: targetId, reason, details: details || undefined })
      }}
      className="space-y-3 p-4"
    >
      <h3 className="text-sm font-semibold">Report content</h3>
      <div className="space-y-1.5">
        {REASONS.map(([value, label]) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="reason"
              value={value}
              checked={reason === value}
              onChange={() => setReason(value)}
              className="accent-[#c8f135]"
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Additional details (optional)"
        maxLength={300}
        rows={2}
        className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-sm resize-none outline-none focus:border-white/30"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 text-sm py-2 rounded font-medium disabled:opacity-40"
          style={{ background: '#c8f135', color: '#030303' }}
        >
          {isPending ? 'Submitting…' : 'Submit report'}
        </button>
        <button type="button" onClick={onClose} className="text-sm px-4 py-2 rounded border border-white/10">
          Cancel
        </button>
      </div>
    </form>
  )
}
