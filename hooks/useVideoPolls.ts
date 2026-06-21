import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PollWithOptions, VideoPoll } from '@/lib/types/video-polls'

export function useVideoPolls(videoId: string) {
  return useQuery({
    queryKey: ['video-polls', videoId],
    queryFn: async () => {
      const res = await fetch(`/api/videos/${videoId}/polls`)
      if (!res.ok) throw new Error('Failed to fetch polls')
      return res.json() as Promise<{ polls: VideoPoll[] }>
    },
    enabled: !!videoId,
  })
}

export function usePollDetail(pollId: string, wallet?: string) {
  return useQuery({
    queryKey: ['poll', pollId, wallet],
    queryFn: async () => {
      const res = await fetch(`/api/polls/${pollId}`, {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to fetch poll')
      return res.json() as Promise<{ poll: PollWithOptions }>
    },
    enabled: !!pollId,
  })
}

export function useCastVote(pollId: string, wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (optionId: string) => {
      const res = await fetch(`/api/polls/${pollId}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({ option_id: optionId }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Vote failed')
      }
      return res.json() as Promise<{ poll: PollWithOptions }>
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['poll', pollId] }),
  })
}
