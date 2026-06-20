import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useIsFollowing(
  myWallet: string | undefined,
  targetWallet: string | undefined
) {
  return useQuery<{ following: boolean }>({
    queryKey: ['follow-v2', myWallet, targetWallet],
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${targetWallet}/follow`, {
        headers: { 'x-wallet-address': myWallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to check follow state')
      return res.json()
    },
    enabled: !!myWallet && !!targetWallet && myWallet !== targetWallet,
    staleTime: 60_000,
  })
}

export function useFollowToggle(myWallet: string | undefined, targetWallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<unknown, Error, boolean>({
    mutationFn: async (isCurrentlyFollowing) => {
      const method = isCurrentlyFollowing ? 'DELETE' : 'POST'
      const res = await fetch(`/api/profiles/${targetWallet}/follow`, {
        method,
        headers: { 'x-wallet-address': myWallet ?? '' },
      })
      if (!res.ok) throw new Error('Follow action failed')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['follow-v2', myWallet, targetWallet] })
    },
  })
}
