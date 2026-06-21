import { NextRequest, NextResponse } from 'next/server'
import { getSeriesWithEpisodes, addEpisode, removeEpisode } from '@/lib/content-series'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const series = await getSeriesWithEpisodes(id)
  if (!series) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ series })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { action, video_id, episode_number, title_override } = await req.json()

  if (action === 'remove_episode') {
    if (!video_id) return NextResponse.json({ error: 'video_id required' }, { status: 400 })
    await removeEpisode(id, video_id)
    return NextResponse.json({ ok: true })
  }

  if (!video_id || !episode_number) {
    return NextResponse.json({ error: 'video_id and episode_number required' }, { status: 400 })
  }

  const episode = await addEpisode(id, video_id, episode_number, title_override)
  return NextResponse.json({ episode }, { status: 201 })
}
