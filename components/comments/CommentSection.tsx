'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useComments } from '@/hooks/useComments'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'

interface Props {
  videoId: string
}

export function CommentSection({ videoId }: Props) {
  const { address } = useAccount()
  const { data, isLoading } = useComments(videoId, address)
  const [replyTo, setReplyTo] = useState<string | null>(null)

  const comments = data?.comments ?? []

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h3>

      {address && (
        <CommentForm videoId={videoId} wallet={address} />
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            <CommentItem
              comment={comment}
              videoId={videoId}
              wallet={address}
              onReply={(id) => setReplyTo(replyTo === id ? null : id)}
            />

            {comment.replies?.map((reply) => (
              <div key={reply.id} className="ml-6 pl-3 border-l border-white/10">
                <CommentItem comment={reply} videoId={videoId} wallet={address} />
              </div>
            ))}

            {replyTo === comment.id && address && (
              <div className="ml-6">
                <CommentForm
                  videoId={videoId}
                  wallet={address}
                  parentId={comment.id}
                  placeholder="Reply…"
                  onSubmit={() => setReplyTo(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
