'use client'

import { useState } from 'react'
import { useCreateComment } from '@/hooks/useComments'
import { MAX_COMMENT_LENGTH } from '@/lib/types/comment'

interface Props {
  videoId: string
  wallet: string
  parentId?: string
  placeholder?: string
  onSubmit?: () => void
}

export function CommentForm({ videoId, wallet, parentId, placeholder = 'Add a comment…', onSubmit }: Props) {
  const [body, setBody] = useState('')
  const { mutate, isPending } = useCreateComment(videoId, wallet)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    mutate({ body, parentId }, {
      onSuccess: () => {
        setBody('')
        onSubmit?.()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm resize-none outline-none focus:border-white/30"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/30">{body.length}/{MAX_COMMENT_LENGTH}</span>
        <button
          type="submit"
          disabled={isPending || !body.trim()}
          className="px-4 py-1.5 rounded text-xs font-medium transition-opacity disabled:opacity-40"
          style={{ background: '#c8f135', color: '#030303' }}
        >
          {isPending ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  )
}
