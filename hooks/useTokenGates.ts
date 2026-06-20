import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TokenGate } from '@/lib/types/token-gate'

export function useTokenGates() {
  return useQuery<{ gates: TokenGate[] }>({
    queryKey: ['token-gates'],
    queryFn: async () => {
      const res = await fetch('/api/token-gates')
      if (!res.ok) throw new Error('Failed to load token gates')
      return res.json()
    },
    staleTime: 60_000,
  })
}

interface CheckResult {
  gate_id: string
  passed: boolean
  balance: string
}

interface CheckResponse {
  results: CheckResult[]
  allPassed: boolean
}

export function useGateCheck(wallet: string | undefined) {
  return useMutation<CheckResponse, Error, { resource_type: string; resource_id: string; balances: Record<string, string> }>({
    mutationFn: async (body) => {
      const res = await fetch('/api/token-gates/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Gate check failed')
      return res.json()
    },
  })
}

export function useCreateGate(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<TokenGate, Error, Omit<TokenGate, 'id' | 'created_at'>>({
    mutationFn: async (body) => {
      const res = await fetch('/api/token-gates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Failed to create gate')
      }
      return (await res.json()).gate
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['token-gates'] }),
  })
}
