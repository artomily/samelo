import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UserProfileWithCounts } from '@/lib/types/user-follows'

export function useUserProfile(wallet: string | undefined) {
  return useQuery<{ profile: UserProfileWithCounts }>({
    queryKey: ['user-profile', wallet],
    queryFn: async () => {
      const res = await fetch(`/api/users/${wallet}`)
      if (!res.ok) throw new Error('Profile not found')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useIsFollowing(authWallet: string | undefined, targetWallet: string | undefined) {
  return useQuery<{ following: boolean }>({
    queryKey: ['is-following', authWallet, targetWallet],
    queryFn: async () => {
      const res = await fetch(`/api/users/${targetWallet}/follow`, {
        headers: { 'x-wallet-address': authWallet ?? '' },
      })
      if (!res.ok) return { following: false }
      return res.json()
    },
    enabled: !!authWallet && !!targetWallet,
    staleTime: 30_000,
  })
}

export function useFollowToggle(authWallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ targetWallet, action }: { targetWallet: string; action: 'follow' | 'unfollow' }) => {
      const res = await fetch(`/api/users/${targetWallet}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': authWallet ?? '' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error('Follow action failed')
      return res.json()
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['is-following', authWallet, vars.targetWallet] })
      qc.invalidateQueries({ queryKey: ['user-profile', vars.targetWallet] })
    },
  })
}
