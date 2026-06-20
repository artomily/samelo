import { NextRequest, NextResponse } from 'next/server'
import { likePlaylist, unlikePlaylist, isPlaylistLiked } from '@/lib/playlists-v2'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  const liked = await isPlaylistLiked(wallet, params.id)
  return NextResponse.json({ liked })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  await likePlaylist(wallet, params.id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  await unlikePlaylist(wallet, params.id)
  return NextResponse.json({ ok: true })
}
