import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { getFollowerCount, getFollowingCount, isFollowing } from '@/lib/follows'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('wallet')
  const viewer = request.nextUrl.searchParams.get('viewer')
  if (!wallet) return apiError('VALIDATION', 'wallet required', 400)

  const supabase = getServiceSupabase()
  const [followerCount, followingCount, following] = await Promise.all([
    getFollowerCount(supabase, wallet),
    getFollowingCount(supabase, wallet),
    viewer && viewer !== wallet ? isFollowing(supabase, viewer, wallet) : Promise.resolve(false),
  ])

  return apiOk({ followerCount, followingCount, isFollowing: following })
}
