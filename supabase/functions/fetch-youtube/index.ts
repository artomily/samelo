import { createClient } from 'jsr:@supabase/supabase-js@2'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

// Default reward per video in cents (= 0.01 CELO equivalent)
const DEFAULT_REWARD_CENTS = 1

interface YouTubeSearchItem {
  id: { videoId: string }
  snippet: {
    title: string
    description: string
    thumbnails: { high?: { url: string }; default?: { url: string } }
    channelTitle: string
  }
}

interface YouTubeVideoItem {
  id: string
  contentDetails: { duration: string }
  statistics: { viewCount?: string }
}

/** Parse ISO 8601 duration (PT#M#S) to total seconds */
function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return (parseInt(m[1] ?? '0') * 3600) +
    (parseInt(m[2] ?? '0') * 60) +
    parseInt(m[3] ?? '0')
}

Deno.serve(async (req) => {
  // Allow manual POST with optional body params, or cron with no body
  const apiKey = Deno.env.get('YOUTUBE_API_KEY')
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'YOUTUBE_API_KEY not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  let query = 'earn crypto watch videos 2025'
  let maxResults = 20

  if (req.method === 'POST') {
    try {
      const body = await req.json()
      if (body.query) query = body.query
      if (body.maxResults) maxResults = Math.min(Number(body.maxResults), 50)
    } catch {
      // ignore parse errors — use defaults
    }
  }

  // Step 1: Search for videos
  const searchUrl =
    `${YOUTUBE_API_BASE}/search?part=snippet&type=video&videoEmbeddable=true` +
    `&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${apiKey}`

  const searchResp = await fetch(searchUrl)
  if (!searchResp.ok) {
    const err = await searchResp.text()
    return new Response(JSON.stringify({ error: 'YouTube search failed', detail: err }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const searchData = await searchResp.json()
  const items: YouTubeSearchItem[] = searchData.items ?? []
  const videoIds = items.map((i) => i.id.videoId).join(',')

  if (!videoIds) {
    return new Response(JSON.stringify({ upserted: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Step 2: Get video details (duration + view count)
  const detailsUrl =
    `${YOUTUBE_API_BASE}/videos?part=contentDetails,statistics` +
    `&id=${videoIds}&key=${apiKey}`

  const detailsResp = await fetch(detailsUrl)
  const detailsData = await detailsResp.json()
  const detailMap = new Map<string, YouTubeVideoItem>()
  for (const v of (detailsData.items ?? []) as YouTubeVideoItem[]) {
    detailMap.set(v.id, v)
  }

  // Step 3: Build rows
  const rows = items.map((item) => {
    const detail = detailMap.get(item.id.videoId)
    const durationSec = detail
      ? parseDuration(detail.contentDetails.duration)
      : 0
    const viewCount = detail
      ? parseInt(detail.statistics.viewCount ?? '0', 10)
      : 0
    const thumbnail =
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.default?.url ??
      null

    return {
      youtube_id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description.slice(0, 500),
      thumbnail_url: thumbnail,
      duration_seconds: durationSec,
      channel_name: item.snippet.channelTitle,
      view_count: viewCount,
      reward_cents: DEFAULT_REWARD_CENTS,
      active: true,
    }
  })

  // Step 4: Upsert — conflict on youtube_id, preserve reward_cents if already set
  const { error, count } = await supabase
    .from('videos')
    .upsert(rows, {
      onConflict: 'youtube_id',
      ignoreDuplicates: false,
    })
    .select('id', { count: 'exact', head: true })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ upserted: count ?? rows.length }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
