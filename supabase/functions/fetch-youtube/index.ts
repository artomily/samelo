import { createClient } from 'jsr:@supabase/supabase-js@2'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — fill these in before deploying
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_PLAYLIST_ID = 'YOUR_PLAYLIST_ID_HERE'
const DEFAULT_MAX_RESULTS = 50    // max videos per playlist fetch (1–50)

function calculateRewardPoints(durationSeconds: number): number {
  if (durationSeconds <= 30) return 5
  if (durationSeconds <= 120) return 10
  if (durationSeconds <= 300) return 25
  if (durationSeconds <= 600) return 50
  if (durationSeconds <= 1200) return 75
  if (durationSeconds <= 1800) return 100
  if (durationSeconds <= 3600) return 150
  return 200
}
// ─────────────────────────────────────────────────────────────────────────────

interface PlaylistItem {
  snippet: {
    title: string
    description: string
    thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } }
    channelTitle: string
    resourceId: { videoId: string }
    videoOwnerChannelTitle?: string
  }
}

interface VideoDetail {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } }
    channelTitle: string
  }
  contentDetails: { duration: string }
}

/** Parse ISO 8601 duration (PT#H#M#S) → total seconds */
function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return (parseInt(m[1] ?? '0') * 3600) +
         (parseInt(m[2] ?? '0') * 60) +
          parseInt(m[3] ?? '0')
}

Deno.serve(async (req) => {
  const apiKey = Deno.env.get('YOUTUBE_API_KEY')
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'YOUTUBE_API_KEY env var is not set' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Accept optional overrides via POST body
  let playlistId = DEFAULT_PLAYLIST_ID
  let maxResults = DEFAULT_MAX_RESULTS

  if (req.method === 'POST') {
    try {
      const body = await req.json()
      if (body.playlistId) playlistId = String(body.playlistId)
      if (body.maxResults) maxResults = Math.min(Number(body.maxResults), 50)
    } catch {
      // no body or invalid JSON — use defaults
    }
  }

  // ── Step 1: Fetch playlist items ────────────────────────────────────────────
  const playlistUrl =
    `${YOUTUBE_API_BASE}/playlistItems` +
    `?part=snippet&playlistId=${encodeURIComponent(playlistId)}` +
    `&maxResults=${maxResults}&key=${apiKey}`

  const playlistResp = await fetch(playlistUrl)
  if (!playlistResp.ok) {
    const detail = await playlistResp.text()
    return new Response(
      JSON.stringify({ error: 'YouTube playlistItems request failed', detail }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const playlistData = await playlistResp.json()
  const playlistItems: PlaylistItem[] = playlistData.items ?? []

  const videoIds = playlistItems
    .map((i) => i.snippet.resourceId.videoId)
    .filter(Boolean)
    .join(',')

  if (!videoIds) {
    return new Response(JSON.stringify({ upserted: 0, message: 'Playlist is empty' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── Step 2: Fetch full video details (title, thumbnail, duration) ───────────
  const detailsUrl =
    `${YOUTUBE_API_BASE}/videos` +
    `?part=snippet,contentDetails&id=${videoIds}&key=${apiKey}`

  const detailsResp = await fetch(detailsUrl)
  if (!detailsResp.ok) {
    const detail = await detailsResp.text()
    return new Response(
      JSON.stringify({ error: 'YouTube videos request failed', detail }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const detailsData = await detailsResp.json()
  const detailMap = new Map<string, VideoDetail>()
  for (const v of (detailsData.items ?? []) as VideoDetail[]) {
    detailMap.set(v.id, v)
  }

  // ── Step 3: Build upsert rows ───────────────────────────────────────────────
  const rows = videoIds.split(',').map((videoId) => {
    const detail = detailMap.get(videoId)
    const thumbnails = detail?.snippet.thumbnails ?? {}
    const thumbnail =
      thumbnails.high?.url ?? thumbnails.medium?.url ?? thumbnails.default?.url ?? null

    const durationSeconds = detail ? parseDuration(detail.contentDetails.duration) : 0

    return {
      id: videoId,
      title: detail?.snippet.title ?? '(unknown)',
      description: (detail?.snippet.description ?? '').slice(0, 500),
      thumbnail_url: thumbnail,
      channel_title: detail?.snippet.channelTitle ?? null,
      duration_seconds: durationSeconds,
      reward_cents: calculateRewardPoints(durationSeconds),
      playlist_id: playlistId,
      active: true,
      fetched_at: new Date().toISOString(),
    }
  })

  // ── Step 4: Upsert into videos table (service role bypasses RLS) ────────────
  const { error, count } = await supabase
    .from('videos')
    .upsert(rows, { onConflict: 'id', ignoreDuplicates: false })
    .select('id', { count: 'exact', head: true })

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return new Response(
    JSON.stringify({ upserted: count ?? rows.length, playlistId, videoCount: rows.length }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
