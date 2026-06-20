import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isValidAddress } from '@/lib/address'
import { apiError, apiOk } from '@/lib/api-error'

const BIO_MAX = 160
const DISPLAY_NAME_MAX = 32

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { walletAddress, displayName, bio, twitterHandle, avatarUrl } = body as Record<string, unknown>

  if (typeof walletAddress !== 'string' || !isValidAddress(walletAddress)) {
    return apiError('MISSING_PARAMS', 'Valid walletAddress required', 400)
  }

  const updates: Record<string, unknown> = {}

  if (displayName !== undefined) {
    if (typeof displayName !== 'string' || displayName.length > DISPLAY_NAME_MAX) {
      return apiError('MISSING_PARAMS', `displayName max ${DISPLAY_NAME_MAX} chars`, 400)
    }
    updates.display_name = displayName.trim() || null
  }

  if (bio !== undefined) {
    if (typeof bio !== 'string' || bio.length > BIO_MAX) {
      return apiError('MISSING_PARAMS', `bio max ${BIO_MAX} chars`, 400)
    }
    updates.bio = bio.trim() || null
  }

  if (twitterHandle !== undefined) {
    updates.twitter_handle = typeof twitterHandle === 'string' ? twitterHandle.replace('@', '').trim() || null : null
  }

  if (avatarUrl !== undefined) {
    updates.avatar_url = typeof avatarUrl === 'string' ? avatarUrl : null
  }

  if (Object.keys(updates).length === 0) {
    return apiError('MISSING_PARAMS', 'No fields to update', 400)
  }

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('wallet_address', walletAddress.toLowerCase())
    .select()
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ profile: data })
}
