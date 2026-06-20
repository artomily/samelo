'use client'
import { useState } from 'react'
import { useReport } from '@/hooks/useReport'
import type { ReportTargetType, ReportReason } from '@/lib/types/moderation'
import { REPORT_REASON_LABELS } from '@/lib/types/moderation'

interface ReportButtonProps {
  targetType: ReportTargetType
  targetId: string
}

const REASONS = Object.keys(REPORT_REASON_LABELS) as ReportReason[]

export function ReportButton({ targetType, targetId }: ReportButtonProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason>('spam')
  const [description, setDescription] = useState('')
  const { mutate: submit, isPending, isSuccess, error } = useReport()

  if (isSuccess) {
    return <p className="text-xs text-[#c8f135]">Report submitted. Thank you.</p>
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-xs text-white/30 hover:text-red-400 transition-colors"
        >
          Report
        </button>
      ) : (
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-3 space-y-3 w-60">
          <div className="flex justify-between">
            <p className="text-xs font-semibold text-white">Report {targetType}</p>
            <button onClick={() => setOpen(false)} className="text-white/30 text-xs">✕</button>
          </div>

          <select
            value={reason}
            onChange={e => setReason(e.target.value as ReportReason)}
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
          >
            {REASONS.map(r => (
              <option key={r} value={r}>{REPORT_REASON_LABELS[r]}</option>
            ))}
          </select>

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Additional details (optional)"
            rows={2}
            maxLength={500}
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none resize-none"
          />

          {error && <p className="text-xs text-red-400">{(error as Error).message}</p>}

          <button
            onClick={() => submit({ targetType, targetId, reason, description: description || undefined })}
            disabled={isPending}
            className="w-full py-1.5 text-xs font-medium bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-40"
          >
            {isPending ? 'Submitting…' : 'Submit Report'}
          </button>
        </div>
      )}
    </div>
  )
}
