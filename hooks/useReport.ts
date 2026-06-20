'use client'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { ReportTargetType, ReportReason } from '@/lib/types/moderation'

interface ReportPayload {
  targetType: ReportTargetType
  targetId: string
  reason: ReportReason
  description?: string
}

export function useReport() {
  const { address } = useAccount()

  return useMutation({
    mutationFn: async (payload: ReportPayload) => {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address ?? '',
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }
      return res.json()
    },
  })
}
