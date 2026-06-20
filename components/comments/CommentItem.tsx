'use client'

import { useState } from 'react'
import { shortenAddress } from '@/lib/celo/wallet'
import { timeAgo } from '@/lib/types/comment'
import type { Comment } from '@/lib/types/comment'
import { useLikeComment } from '@/hooks/useComments'

interface Props {
  comment: Comment
  videoId: string
  wallet?: string
  onReply?: (commentId: string) => void
}

export function CommentItem({ comment, videoId, wallet, onReply }: Props) {
  const { mutate: likeToggle } = useLikeComment(videoId, wallet)
  const [liked, setLiked] = useState(comment.liked ?? false)

  function handleLike() {
    likeToggle({ commentId: comment.id, isLiked: liked })
    setLiked((prev) => !prev)
  }

  if (comment.is_deleted) {
    return <p className="text-xs text-white/30 italic">[deleted]</p>
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span className="font-mono">{shortenAddress(comment.wallet)}</span>
        <span>·</span>
        <span>{timeAgo(comment.created_at)}</span>
      </div>
      <p className="text-sm">{comment.body}</p>
      <div className="flex gap-3 text-xs text-white/40">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-white transition-colors"
          style={liked ? { color: '#c8f135' } : {}}
        >
          ♥ {comment.like_count + (liked && !comment.liked ? 1 : 0)}
        </button>
        {wallet && !comment.parent_id && onReply && (
          <button onClick={() => onReply(comment.id)} className="hover:text-white transition-colors">
            Reply
          </button>
        )}
      </div>
    </div>
  )
}
