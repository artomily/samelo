import { NextResponse } from 'next/server'
import { globalSearch } from '@/lib/search'
import { clampString } from '@/lib/security/sanitize'
import { MIN_QUERY_LENGTH } from '@/lib/types/search'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('q') ?? ''
  const q = clampString(raw.trim(), 100)

  if (q.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ error: `Query must be at least ${MIN_QUERY_LENGTH} characters` }, { status: 400 })
  }

  try {
    const { results, total } = await globalSearch(q)
    return NextResponse.json({ results, total, query: q })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
