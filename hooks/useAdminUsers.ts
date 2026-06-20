import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { AdminUser } from '@/lib/types/admin'

async function fetchAdminUsers(wallet: string, search = '', offset = 0): Promise<{ users: AdminUser[] }> {
  const params = new URLSearchParams({ limit: '50', offset: String(offset) })
  if (search) params.set('search', search)
  const res = await fetch(`/api/admin/users?${params}`, {
    headers: { 'x-wallet-address': wallet },
  })
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export function useAdminUsers(search = '') {
  const { address } = useAccount()
  return useQuery({
    queryKey: ['admin-users', address, search],
    queryFn: () => fetchAdminUsers(address!, search),
    enabled: !!address,
    staleTime: 30_000,
  })
}

export function useAdjustPoints() {
  const { address } = useAccount()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ wallet, delta, reason }: { wallet: string; delta: number; reason: string }) =>
      fetch(`/api/admin/users/${wallet}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': address! },
        body: JSON.stringify({ delta, reason }),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })
}

export function useBanUser() {
  const { address } = useAccount()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ wallet, banned }: { wallet: string; banned: boolean }) =>
      fetch(`/api/admin/users/${wallet}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': address! },
        body: JSON.stringify({ banned }),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })
}
