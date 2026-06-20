import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { AdminVideo } from '@/lib/types/admin'

async function fetchAdminVideos(wallet: string): Promise<{ videos: AdminVideo[] }> {
  const res = await fetch('/api/admin/videos', {
    headers: { 'x-wallet-address': wallet },
  })
  if (!res.ok) throw new Error('Failed to fetch videos')
  return res.json()
}

export function useAdminVideos() {
  const { address } = useAccount()
  return useQuery({
    queryKey: ['admin-videos', address],
    queryFn: () => fetchAdminVideos(address!),
    enabled: !!address,
    staleTime: 60_000,
  })
}

export function useCreateVideo() {
  const { address } = useAccount()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { title: string; youtubeId: string; rewardCents: number }) =>
      fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': address! },
        body: JSON.stringify(payload),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-videos'] }),
  })
}

export function useToggleVideo() {
  const { address } = useAccount()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      fetch(`/api/admin/videos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': address! },
        body: JSON.stringify({ isActive }),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-videos'] }),
  })
}
