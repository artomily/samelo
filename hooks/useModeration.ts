import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ReportReasonV2 } from '@/lib/types/moderation-v2'

interface ReportInput {
  target_type: string
  target_id: string
  reason: ReportReasonV2
  details?: string
}

export function useSubmitReport(wallet: string | undefined) {
  return useMutation<void, Error, ReportInput>({
    mutationFn: async (body) => {
      const res = await fetch('/api/moderation/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Failed to submit report')
      }
    },
  })
}

interface ActionInput {
  report_id: string
  status: string
  action: string
  target_type: string
  target_id: string
  note?: string
}

export function useModerationAction(adminWallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<void, Error, ActionInput>({
    mutationFn: async (body) => {
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': adminWallet ?? '',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Action failed')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['moderation-reports'] }),
  })
}
