import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { FanMessage, MessageWithReplies } from '@/lib/types/fan-messages'

export function useInbox(wallet?: string, archived = false) {
  return useQuery({
    queryKey: ['messages', 'inbox', wallet, archived],
    queryFn: async () => {
      const url = `/api/messages?mode=inbox${archived ? '&archived=1' : ''}`
      const res = await fetch(url, { headers: { 'x-wallet-address': wallet! } })
      if (!res.ok) throw new Error('Failed to fetch inbox')
      return res.json() as Promise<{ messages: FanMessage[] }>
    },
    enabled: !!wallet,
    refetchInterval: 30_000,
  })
}

export function useMessageDetail(id: string, wallet?: string) {
  return useQuery({
    queryKey: ['message', id],
    queryFn: async () => {
      const res = await fetch(`/api/messages/${id}`, {
        headers: { 'x-wallet-address': wallet! },
      })
      if (!res.ok) throw new Error('Failed to fetch message')
      return res.json() as Promise<{ message: MessageWithReplies }>
    },
    enabled: !!id && !!wallet,
  })
}

export function useSendMessage(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: { to_wallet: string; body: string; subject?: string; tip_melo?: number }) => {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to send message')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages', 'inbox'] }),
  })
}

export function useReplyToMessage(messageId: string, wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (replyBody: string) => {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({ body: replyBody }),
      })
      if (!res.ok) throw new Error('Failed to reply')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['message', messageId] }),
  })
}
