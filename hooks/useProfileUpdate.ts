import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

interface ProfileUpdatePayload {
  displayName?: string
  bio?: string
  twitterHandle?: string
  avatarUrl?: string
}

async function updateProfile(walletAddress: string, payload: ProfileUpdatePayload) {
  const res = await fetch('/api/profile/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, ...payload }),
  })
  if (!res.ok) throw new Error('Failed to update profile')
  return res.json()
}

export function useProfileUpdate() {
  const { address } = useAccount()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => updateProfile(address!, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', address] }),
  })
}
