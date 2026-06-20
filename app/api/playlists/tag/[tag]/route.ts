import { NextRequest, NextResponse } from 'next/server'
import { getPlaylistsByTag } from '@/lib/playlists-v2'

export async function GET(
  req: NextRequest,
  { params }: { params: { tag: string } }
) {
  const tag = params.tag.toLowerCase().trim()
  if (!tag || tag.length < 2 || tag.length > 30) {
    return NextResponse.json({ error: 'Invalid tag' }, { status: 400 })
  }

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '20'), 50)
  const playlists = await getPlaylistsByTag(tag, limit)
  return NextResponse.json({ playlists, tag })
}
