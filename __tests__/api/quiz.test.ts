import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/quiz/route'
import { POST } from '@/app/api/quiz/submit/route'
import * as supabaseModule from '@/lib/supabase'
import { createNextRequest } from '../helpers/request'
import { VALID_WALLET, VIDEO_ID, mockQuiz } from '../helpers/fixtures'

describe('GET /api/quiz', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns quiz questions for a valid videoId', async () => {
    const quizData = { ...mockQuiz }
    const maybeSingle = vi.fn().mockResolvedValue({ data: quizData, error: null })
    const eq = vi.fn().mockReturnValue({ maybeSingle })
    const select = vi.fn().mockReturnValue({ eq })
    const from = vi.fn().mockReturnValue({ select })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest(`/api/quiz?videoId=${VIDEO_ID}`)
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.videoId).toBe(VIDEO_ID)
    expect(json.questions).toBeDefined()
    expect(json.questions).toHaveLength(2)
    expect(json.questions[0]).toHaveProperty('q')
    expect(json.questions[0]).toHaveProperty('options')
    expect(json.questions[0]).not.toHaveProperty('correct')
  })

  it('returns 400 when videoId is missing', async () => {
    const req = createNextRequest('/api/quiz')
    const res = await GET(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('required')
  })

  it('returns 404 when quiz not found', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null })
    const eq = vi.fn().mockReturnValue({ maybeSingle })
    const select = vi.fn().mockReturnValue({ eq })
    const from = vi.fn().mockReturnValue({ select })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest(`/api/quiz?videoId=nonexistent`)
    const res = await GET(req)

    expect(res.status).toBe(404)
  })

  it('strips correct answers from quiz questions', async () => {
    const quizData = { ...mockQuiz }
    const maybeSingle = vi.fn().mockResolvedValue({ data: quizData, error: null })
    const eq = vi.fn().mockReturnValue({ maybeSingle })
    const select = vi.fn().mockReturnValue({ eq })
    const from = vi.fn().mockReturnValue({ select })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest(`/api/quiz?videoId=${VIDEO_ID}`)
    const res = await GET(req)
    const json = await res.json()

    for (const q of json.questions) {
      expect(q).not.toHaveProperty('correct')
    }
  })

  it('handles supabase error gracefully', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } })
    const eq = vi.fn().mockReturnValue({ maybeSingle })
    const select = vi.fn().mockReturnValue({ eq })
    const from = vi.fn().mockReturnValue({ select })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest(`/api/quiz?videoId=${VIDEO_ID}`)
    const res = await GET(req)

    expect(res.status).toBe(500)
  })

  it('parses string questions JSON', async () => {
    const quizData = {
      ...mockQuiz,
      questions: JSON.stringify(mockQuiz.questions),
    }
    const maybeSingle = vi.fn().mockResolvedValue({ data: quizData, error: null })
    const eq = vi.fn().mockReturnValue({ maybeSingle })
    const select = vi.fn().mockReturnValue({ eq })
    const from = vi.fn().mockReturnValue({ select })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest(`/api/quiz?videoId=${VIDEO_ID}`)
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.questions).toHaveLength(2)
  })
})

describe('POST /api/quiz/submit', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 for missing walletAddress', async () => {
    const req = createNextRequest('/api/quiz/submit', {
      method: 'POST',
      body: { videoId: VIDEO_ID, answers: [0, 2] },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid wallet address', async () => {
    const req = createNextRequest('/api/quiz/submit', {
      method: 'POST',
      body: { walletAddress: 'invalid', videoId: VIDEO_ID, answers: [0, 2] },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for missing answers array', async () => {
    const req = createNextRequest('/api/quiz/submit', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, videoId: VIDEO_ID },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 409 for duplicate quiz attempt', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: { id: 1 }, error: null })
    const eq = vi.fn().mockReturnValue({ maybeSingle })
    const select = vi.fn().mockReturnValue({ eq })
    const from = vi.fn().mockReturnValue({ select })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/quiz/submit', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, videoId: VIDEO_ID, answers: [0, 2] },
    })
    const res = await POST(req)

    expect(res.status).toBe(409)
    const json = await res.json()
    expect(json.error).toContain('already attempted')
  })

  it('returns 404 when quiz not found', async () => {
    let callCount = 0
    const from = vi.fn().mockImplementation(() => {
      callCount++
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: callCount === 1 ? null : null,
              error: null,
            }),
          }),
        }),
      }
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/quiz/submit', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, videoId: 'nonexistent', answers: [0, 2] },
    })
    const res = await POST(req)

    expect(res.status).toBe(404)
  })

  it('returns 403 when user has not watched the video', async () => {
    let callCount = 0
    const from = vi.fn().mockImplementation((table: string) => {
      callCount++
      if (table === 'video_quizzes') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { questions: mockQuiz.questions },
                error: null,
              }),
            }),
          }),
        }
      }
      if (table === 'user_quiz_attempts') {
        if (callCount === 2) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          }
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          }),
        }
      }
      if (table === 'watches') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          }),
        }
      }
      return {}
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/quiz/submit', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, videoId: VIDEO_ID, answers: [0, 2] },
    })
    const res = await POST(req)

    expect(res.status).toBe(403)
  })

  it('rejects non-array answers', async () => {
    const req = createNextRequest('/api/quiz/submit', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, videoId: VIDEO_ID, answers: 'not-an-array' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('rejects answers with non-number elements', async () => {
    const req = createNextRequest('/api/quiz/submit', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, videoId: VIDEO_ID, answers: [0, 'two'] },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })
})