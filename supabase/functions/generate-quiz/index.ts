import { createClient } from 'jsr:@supabase/supabase-js@2'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const GEMINI_MODEL = 'gemini-2.0-flash'

interface QuizQuestion {
  q: string
  options: string[]
  correct: number
}

// ──────────────────────────────────────────────────────────────
function buildPrompt(title: string, description: string): string {
  return `You are a quiz generator for educational video content.
Based on the following video title and description, generate:
1. A 2-3 sentence summary of what the video is about.
2. Exactly 3 multiple-choice questions about the video's likely content.

Video Title: "${title}"
Video Description: "${description || 'No description available.'}"

Return ONLY valid JSON in this exact format, no markdown, no extra text:
{
  "summary": "string",
  "questions": [
    {
      "q": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correct": 0
    }
  ]
}

Rules:
- Questions should be answerable from the video title/description alone.
- correct is the zero-based index of the right answer (0-3).
- options must be exactly 4 strings.
- Make the wrong options plausible but clearly wrong.`
}

// ──────────────────────────────────────────────────────────────
async function generateQuiz(
  title: string,
  description: string,
  apiKey: string,
): Promise<{ summary: string; questions: QuizQuestion[] }> {
  const res = await fetch(
    `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(title, description) }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    },
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  // Strip markdown fences if Gemini wraps the JSON
  const json = raw.replace(/```json\n?/g, '').replace(/```/g, '').trim()

  const parsed = JSON.parse(json) as { summary: string; questions: QuizQuestion[] }

  if (
    !parsed.summary ||
    !Array.isArray(parsed.questions) ||
    parsed.questions.length < 1
  ) {
    throw new Error(`Invalid Gemini response structure: ${json.slice(0, 200)}`)
  }

  return parsed
}

// ──────────────────────────────────────────────────────────────
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

    // ── GET video_id from request ────────────────────────────
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

    // ── Fetch video from DB ──────────────────────────────────
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

    // ── Generate quiz via Gemini ─────────────────────────────
    const { summary, questions } = await generateQuiz(
      video.title ?? '',
      video.description ?? '',
      geminiKey,
    )

    // ── Upsert into DB ───────────────────────────────────────
    const { error: upsertErr } = await supabase
      .from('video_quizzes')
      .upsert({
        video_id: videoId,
        summary,
        questions: JSON.stringify(questions),
        generated_at: new Date().toISOString(),
      }, { onConflict: 'video_id', ignoreDuplicates: false })

    if (upsertErr) {
      throw new Error(`DB upsert failed: ${upsertErr.message}`)
    }

    return new Response(
      JSON.stringify({ video_id: videoId, summary, questions }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('[generate-quiz]', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
})
