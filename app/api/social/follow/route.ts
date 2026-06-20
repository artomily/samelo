import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { followWallet, unfollowWallet, isFollowing } from '@/lib/follows'
import { apiError, apiOk } from '@/lib/api-error'

export async function POST(request: NextRequest) {
  const { follower, target } = await request.json()
  if (!follower || !target) return apiError('VALIDATION', 'follower and target required', 400)

  const supabase = getServiceSupabase()
  try {
    await followWallet(supabase, follower, target)
    return apiOk({ following: true })
  } catch (e: any) {
    return apiError('ERROR', e.message, 400)
  }
}

export async function DELETE(request: NextRequest) {
  const { follower, target } = await request.json()
  if (!follower || !target) return apiError('VALIDATION', 'follower and target required', 400)

  const supabase = getServiceSupabase()
  await unfollowWallet(supabase, follower, target)
  return apiOk({ following: false })
}

export async function GET(request: NextRequest) {
  const follower = request.nextUrl.searchParams.get('follower')
  const target = request.nextUrl.searchParams.get('target')
  if (!follower || !target) return apiError('VALIDATION', 'follower and target required', 400)

  const supabase = getServiceSupabase()
  const following = await isFollowing(supabase, follower, target)
  return apiOk({ following })
}
