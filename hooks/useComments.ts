import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Comment } from '@/lib/types/comment'

interface CommentsResponse {
  comments: Comment[]
}

export function useComments(videoId: string, wallet?: string) {
  return useQuery<CommentsResponse>({
    queryKey: ['comments', videoId, wallet],
    queryFn: async () => {
      const res = await fetch(`/api/comments/${videoId}`, {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to load comments')
      return res.json()
    },
    staleTime: 30_000,
  })
}

export function useCreateComment(videoId: string, wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<Comment, Error, { body: string; parentId?: string }>({
    mutationFn: async ({ body, parentId }) => {
      const res = await fetch(`/api/comments/${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify({ body, parentId }),
      })
      if (!res.ok) throw new Error('Failed to post comment')
      return (await res.json()).comment
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', videoId] }),
  })
}

export function useLikeComment(videoId: string, wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<void, Error, { commentId: string; isLiked: boolean }>({
    mutationFn: async ({ commentId, isLiked }) => {
      const method = isLiked ? 'DELETE' : 'POST'
      await fetch(`/api/comments/like/${commentId}`, {
        method,
        headers: { 'x-wallet-address': wallet ?? '' },
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', videoId] }),
  })
}
