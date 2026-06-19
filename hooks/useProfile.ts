import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Profile {
  wallet_address: string
  display_name: string | null
  referral_code: string | null
  referred_by: string | null
  total_points: number
  total_earned_cents: number
}

async function fetchProfile(walletAddress: string): Promise<Profile> {
  const res = await fetch(`/api/profile?walletAddress=${walletAddress}`)
  if (!res.ok) throw new Error('Failed to fetch profile')
  const json = await res.json()
  return json.profile
}

async function updateDisplayName(walletAddress: string, displayName: string): Promise<Profile> {
  const res = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, displayName }),
  })
  if (!res.ok) throw new Error('Failed to update profile')
  const json = await res.json()
  return json.profile
}

export function useProfile(walletAddress: string | undefined) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['profile', walletAddress],
    queryFn: () => fetchProfile(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 60_000,
  })

  const updateName = useMutation({
    mutationFn: (displayName: string) => updateDisplayName(walletAddress!, displayName),
    onSuccess: (profile) => {
      queryClient.setQueryData(['profile', walletAddress], profile)
    },
  })

  return { ...query, updateName }
}
