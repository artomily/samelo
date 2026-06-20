import { NextRequest, NextResponse } from 'next/server'
import { createEmbedConfig, getOwnerEmbedConfigs } from '@/lib/embed-player'
import type { EmbedTheme } from '@/lib/types/embed-player'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  const configs = await getOwnerEmbedConfigs(wallet)
  return NextResponse.json({ configs })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { video_id, name, theme, autoplay, show_quiz, show_chapters, show_points, allow_fullscreen, embed_domains } = await req.json()
  if (!video_id || !name) {
    return NextResponse.json({ error: 'video_id and name required' }, { status: 400 })
  }

  const validThemes: EmbedTheme[] = ['dark', 'light', 'brand']
  const config = await createEmbedConfig(wallet, video_id, name, {
    theme: validThemes.includes(theme) ? theme : 'dark',
    autoplay: !!autoplay,
    showQuiz: show_quiz !== false,
    showChapters: show_chapters !== false,
    showPoints: show_points !== false,
    allowFullscreen: allow_fullscreen !== false,
    embedDomains: Array.isArray(embed_domains) ? embed_domains : [],
  })
  return NextResponse.json({ config }, { status: 201 })
}
