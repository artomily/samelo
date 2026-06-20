import { NextResponse } from 'next/server'
import { getPublishedPlaylists } from '@/lib/playlists-v2'

export async function GET() {
  const playlists = await getPublishedPlaylists(10, true)
  return NextResponse.json({ playlists })
}
