import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { MissionWithProgress } from '@/lib/types/missions'

async function fetchMissions(walletAddress?: string): Promise<MissionWithProgress[]> {
  const params = walletAddress ? `?walletAddress=${walletAddress}` : ''
  const res = await fetch(`/api/missions/list${params}`)
  if (!res.ok) throw new Error('Failed to fetch missions')
  const json = await res.json()
  return json.missions
}

async function claimMission(walletAddress: string, missionId: string) {
  const res = await fetch('/api/missions/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, missionId }),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.error ?? 'Failed to claim mission')
  }
  return res.json()
}

export function useMissions(walletAddress: string | undefined) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['missions', walletAddress],
    queryFn: () => fetchMissions(walletAddress),
    staleTime: 30_000,
  })

  const claim = useMutation({
    mutationFn: (missionId: string) => claimMission(walletAddress!, missionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions', walletAddress] })
      queryClient.invalidateQueries({ queryKey: ['rewards-balance', walletAddress] })
    },
  })

  return { ...query, claim }
}
