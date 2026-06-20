import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiKey, ApiKeyWithSecret } from '@/lib/types/api-key'

export function useApiKeys(wallet: string | undefined) {
  return useQuery<{ keys: ApiKey[] }>({
    queryKey: ['api-keys', wallet],
    queryFn: async () => {
      const res = await fetch('/api/v1/api-keys', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load API keys')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useCreateApiKey(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<ApiKeyWithSecret, Error, { name: string; expiresAt?: string }>({
    mutationFn: async (body) => {
      const res = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Failed to create API key')
      }
      return (await res.json()).key
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys', wallet] }),
  })
}

export function useRevokeApiKey(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (keyId) => {
      const res = await fetch(`/api/v1/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to revoke API key')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys', wallet] }),
  })
}
