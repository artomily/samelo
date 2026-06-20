import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useReaction(wallet: string | null) {
  const qc = useQueryClient()

  const react = useMutation({
    mutationFn: async ({ eventId, emoji }: { eventId: string; emoji?: string }) => {
      const res = await fetch('/api/social/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, wallet, emoji }),
      })
      if (!res.ok) throw new Error('Reaction failed')
    },
    onSuccess: (_, { eventId }) => {
      qc.invalidateQueries({ queryKey: ['feed'] })
    },
  })

  const unreact = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch('/api/social/reactions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, wallet }),
      })
      if (!res.ok) throw new Error('Remove reaction failed')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] })
    },
  })

  return { react, unreact }
}
