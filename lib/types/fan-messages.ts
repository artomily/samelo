export interface FanMessage {
  id: string
  from_wallet: string
  to_wallet: string
  subject: string | null
  body: string
  is_read: boolean
  is_archived: boolean
  tip_melo: number
  created_at: string
}

export interface MessageReply {
  id: string
  message_id: string
  from_wallet: string
  body: string
  created_at: string
}

export interface MessageWithReplies extends FanMessage {
  replies: MessageReply[]
}

export function hasTip(message: FanMessage): boolean {
  return message.tip_melo > 0
}

export function displaySubject(message: FanMessage): string {
  return message.subject?.trim() || '(no subject)'
}

export function inboxLabel(message: FanMessage): string {
  const tip = hasTip(message) ? ` [+${message.tip_melo} MELO]` : ''
  return `${displaySubject(message)}${tip}`
}

export function unreadMessageCount(messages: FanMessage[]): number {
  return messages.filter((m) => !m.is_read && !m.is_archived).length
}
