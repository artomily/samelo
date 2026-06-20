'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { REPORT_REASON_LABELS, REPORT_STATUS_COLORS } from '@/lib/types/moderation'
import type { Report, ReportStatus } from '@/lib/types/moderation'

export function ReportsQueue() {
  const { address } = useAccount()
  const [status, setStatus] = useState<string>('pending')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery<{ reports: Report[] }>({
    queryKey: ['admin-reports', status],
    queryFn: async () => {
      const res = await fetch(`/api/admin/reports?status=${status}`, {
        headers: { 'x-wallet-address': address ?? '' },
      })
      if (!res.ok) throw new Error('Failed to fetch reports')
      return res.json()
    },
    enabled: !!address,
    staleTime: 15_000,
  })

  const { mutate: review } = useMutation({
    mutationFn: async ({ reportId, newStatus }: { reportId: string; newStatus: ReportStatus }) => {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address ?? '',
        },
        body: JSON.stringify({ reportId, status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to review report')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-reports'] }),
  })

  const STATUS_TABS = ['pending', 'reviewed', 'actioned', 'dismissed']

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {STATUS_TABS.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              status === s ? 'bg-[#c8f135] text-black font-medium' : 'bg-white/10 text-white/60'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-xs text-white/30 text-center py-8">Loading…</div>
      ) : (data?.reports ?? []).length === 0 ? (
        <div className="text-xs text-white/30 text-center py-8">No {status} reports</div>
      ) : (
        <div className="space-y-2">
          {data?.reports.map(r => (
            <div key={r.id} className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white">{r.target_type}: {r.target_id.slice(0, 12)}…</span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-mono"
                  style={{ color: REPORT_STATUS_COLORS[r.status], backgroundColor: `${REPORT_STATUS_COLORS[r.status]}20` }}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-white/50">{REPORT_REASON_LABELS[r.reason]}</p>
              {r.description && <p className="text-xs text-white/30 mt-1">{r.description}</p>}
              {r.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => review({ reportId: r.id, newStatus: 'actioned' })} className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors">Action</button>
                  <button onClick={() => review({ reportId: r.id, newStatus: 'dismissed' })} className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded hover:bg-white/15 transition-colors">Dismiss</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
