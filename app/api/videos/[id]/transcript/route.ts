import { NextRequest, NextResponse } from 'next/server'
import { getTranscript, upsertTranscript, upsertSegments, getVideoTranscripts } from '@/lib/video-transcripts'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lang = req.nextUrl.searchParams.get('lang') ?? 'en'
  const all = req.nextUrl.searchParams.get('all') === '1'

  if (all) {
    const transcripts = await getVideoTranscripts(id)
    return NextResponse.json({ transcripts })
  }

  const transcript = await getTranscript(id, lang)
  if (!transcript) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ transcript })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { language = 'en', source = 'manual', status = 'ready', full_text, segments } = await req.json()

  const transcript = await upsertTranscript(id, language, { source, status, fullText: full_text })

  if (segments && Array.isArray(segments)) {
    await upsertSegments(transcript.id, segments)
  }

  return NextResponse.json({ transcript }, { status: 201 })
}
