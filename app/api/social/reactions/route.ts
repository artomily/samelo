import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

const ALLOWED_EMOJIS = ['🔥', '👏', '💎', '🚀', '❤️']

export async function POST(request: NextRequest) {
  const { eventId, wallet, emoji } = await request.json()
  if (!eventId || !wallet) return apiError('VALIDATION', 'eventId and wallet required', 400)
  if (emoji && !ALLOWED_EMOJIS.includes(emoji)) return apiError('VALIDATION', 'invalid emoji', 400)

  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from('reactions')
    .upsert({ event_id: eventId, wallet, emoji: emoji ?? '🔥' })

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ reacted: true })
}

export async function DELETE(request: NextRequest) {
  const { eventId, wallet } = await request.json()
  if (!eventId || !wallet) return apiError('VALIDATION', 'eventId and wallet required', 400)

  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('event_id', eventId)
    .eq('wallet', wallet)

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ removed: true })
}
