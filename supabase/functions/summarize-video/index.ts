import { createClient } from 'jsr:@supabase/supabase-js@2'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const GEMINI_MODEL = 'gemini-2.0-flash'

function buildSummaryPrompt(title: string, description: string): string {
  return `You are an AI assistant that creates clear, concise summaries of educational video content.

Based on the following video title and description, generate:
1. A comprehensive 4-6 sentence summary of what the video likely covers.
2. 4-6 key bullet points of the most important takeaways (as an array of strings).

Video Title: "${title}"
Video Description: "${description || 'No description available.'}"

Return ONLY valid JSON in this exact format, no markdown, no extra text:
{
  "summary": "string (4-6 sentences)",
  "key_points": ["key point 1", "key point 2", "key point 3", "key point 4"]
}

Rules:
- Make the summary informative and educational.
- Key points should be concise (1 sentence each).
- Base your content on what the video title and description suggest.`
}

async function generateSummary(
  title: string,
  description: string,
  apiKey: string,
): Promise<{ summary: string; key_points: string[] }> {
  const res = await fetch(
    `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildSummaryPrompt(title, description) }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 1024 },
      }),
    },
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  const json = raw.replace(/```json\n?/g, '').replace(/```/g, '').trim()

  const parsed = JSON.parse(json) as { summary: string; key_points: string[] }

  if (
    !parsed.summary ||
    !Array.isArray(parsed.key_points) ||
    parsed.key_points.length < 1
  ) {
    throw new Error(`Invalid Gemini response structure: ${json.slice(0, 200)}`)
  }

  return parsed
}

Deno.serve(async (req: Request) => {
  try {
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not set' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    let videoId: string | undefined

    if (req.method === 'POST') {
      const body = await req.json() as { video_id?: string }
      videoId = body.video_id
    } else {
      const url = new URL(req.url)
      videoId = url.searchParams.get('video_id') ?? undefined
    }

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'video_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Check if summary already exists
    const { data: existing } = await supabase
      .from('video_summaries')
      .select('summary, key_points, generated_at')
      .eq('video_id', videoId)
      .maybeSingle()

    if (existing) {
      const keyPoints = typeof existing.key_points === 'string'
        ? JSON.parse(existing.key_points)
        : existing.key_points

      return new Response(
        JSON.stringify({
          video_id: videoId,
          summary: existing.summary,
          key_points: keyPoints,
          cached: true,
        }),
        { headers: { 'Content-Type': 'application/json' } },
      )
    }

    const { data: video, error: videoErr } = await supabase
      .from('videos')
      .select('id, title, description')
      .eq('id', videoId)
      .single()

    if (videoErr || !video) {
      return new Response(
        JSON.stringify({ error: 'Video not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const { summary, key_points } = await generateSummary(
      video.title ?? '',
      video.description ?? '',
      geminiKey,
    )

    const { error: upsertErr } = await supabase
      .from('video_summaries')
      .upsert({
        video_id: videoId,
        summary,
        key_points: JSON.stringify(key_points),
        generated_at: new Date().toISOString(),
      }, { onConflict: 'video_id', ignoreDuplicates: false })

    if (upsertErr) {
      throw new Error(`DB upsert failed: ${upsertErr.message}`)
    }

    return new Response(
      JSON.stringify({ video_id: videoId, summary, key_points }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('[summarize-video]', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
})
