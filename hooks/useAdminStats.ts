import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { AdminStats } from '@/lib/types/admin'

async function fetchAdminStats(wallet: string): Promise<AdminStats> {
  const res = await fetch('/api/admin/stats', {
    headers: { 'x-wallet-address': wallet },
  })
  if (!res.ok) throw new Error('Unauthorized or failed to fetch admin stats')
  return res.json()
}

export function useAdminStats() {
  const { address } = useAccount()
  return useQuery({
    queryKey: ['admin-stats', address],
    queryFn: () => fetchAdminStats(address!),
    enabled: !!address,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}
