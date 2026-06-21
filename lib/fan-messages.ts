import { createClient } from '@supabase/supabase-js'
import type { FanMessage, MessageReply, MessageWithReplies } from './types/fan-messages'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getInbox(wallet: string, showArchived = false): Promise<FanMessage[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('fan_messages')
    .select('*')
    .eq('to_wallet', wallet)
    .order('created_at', { ascending: false })

  if (!showArchived) query = query.eq('is_archived', false)
  const { data } = await query
  return data ?? []
}

export async function getSentMessages(wallet: string): Promise<FanMessage[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('fan_messages')
    .select('*')
    .eq('from_wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getMessage(id: string): Promise<MessageWithReplies | null> {
  const supabase = getSupabase()
  const { data: message } = await supabase
    .from('fan_messages')
    .select('*')
    .eq('id', id)
    .single()

  if (!message) return null

  const { data: replies } = await supabase
    .from('message_replies')
    .select('*')
    .eq('message_id', id)
    .order('created_at')

  return { ...message, replies: replies ?? [] }
}

export async function sendMessage(
  fromWallet: string,
  toWallet: string,
  body: string,
  opts: { subject?: string; tipMelo?: number } = {}
): Promise<FanMessage> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('fan_messages')
    .insert({
      from_wallet: fromWallet,
      to_wallet: toWallet,
      body,
      subject: opts.subject ?? null,
      tip_melo: opts.tipMelo ?? 0,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function replyToMessage(messageId: string, fromWallet: string, body: string): Promise<MessageReply> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('message_replies')
    .insert({ message_id: messageId, from_wallet: fromWallet, body })
    .select()
    .single()
  if (error) throw new Error(error.message)

  await supabase.from('fan_messages').update({ is_read: true }).eq('id', messageId)
  return data
}

export async function markMessageRead(id: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('fan_messages').update({ is_read: true }).eq('id', id)
}

export async function archiveMessage(id: string, wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('fan_messages')
    .update({ is_archived: true })
    .eq('id', id)
    .eq('to_wallet', wallet)
}
