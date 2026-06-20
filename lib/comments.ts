import { createClient } from '@supabase/supabase-js'
import type { Comment } from './types/comment'
import { sanitizeCommentBody } from './types/comment'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getComments(videoId: string, walletForLikes?: string): Promise<Comment[]> {
  const supabase = getSupabase()

  const { data: topLevel, error } = await supabase
    .from('comments')
    .select('*')
    .eq('video_id', videoId)
    .is('parent_id', null)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  const comments = topLevel ?? []

  if (!comments.length) return []

  const commentIds = comments.map((c) => c.id)
  const { data: replies } = await supabase
    .from('comments')
    .select('*')
    .in('parent_id', commentIds)
    .eq('is_deleted', false)
    .order('created_at')

  let likedSet = new Set<string>()
  if (walletForLikes) {
    const { data: likes } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('wallet', walletForLikes.toLowerCase())
      .in('comment_id', [...commentIds, ...(replies ?? []).map((r) => r.id)])
    likedSet = new Set((likes ?? []).map((l) => l.comment_id))
  }

  const replyMap: Record<string, Comment[]> = {}
  for (const reply of replies ?? []) {
    if (!replyMap[reply.parent_id]) replyMap[reply.parent_id] = []
    replyMap[reply.parent_id]!.push({ ...reply, liked: likedSet.has(reply.id) })
  }

  return comments.map((c) => ({
    ...c,
    liked: likedSet.has(c.id),
    replies: replyMap[c.id] ?? [],
  }))
}

export async function createComment(
  wallet: string,
  videoId: string,
  body: string,
  parentId?: string
): Promise<Comment> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('comments')
    .insert({
      wallet: wallet.toLowerCase(),
      video_id: videoId,
      body: sanitizeCommentBody(body),
      parent_id: parentId ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteComment(commentId: string, wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('comments')
    .update({ is_deleted: true, body: '[deleted]' })
    .eq('id', commentId)
    .eq('wallet', wallet.toLowerCase())
}

export async function likeComment(wallet: string, commentId: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('comment_likes').upsert({
    wallet: wallet.toLowerCase(),
    comment_id: commentId,
  })
  await supabase.rpc('increment', { table: 'comments', column: 'like_count', id: commentId })
}

export async function unlikeComment(wallet: string, commentId: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('comment_likes')
    .delete()
    .eq('wallet', wallet.toLowerCase())
    .eq('comment_id', commentId)
}
