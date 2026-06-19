export const VALID_WALLET = '0x1234567890123456789012345678901234567890'
export const VALID_WALLET_2 = '0xABCDEF1234567890123456789012345678901ABC'
export const INVALID_WALLET = '0xinvalid'
export const EMPTY_WALLET = ''
export const VIDEO_ID = 'dQw4w9WgXcQ'
export const VIDEO_ID_2 = 'anotherVideoId123'
export const REFERRAL_CODE = 'MELOABC12'
export const REFERRAL_CODE_INVALID = 'INVALID1'
export const TX_HASH = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
export const NONCE = '0x0000000000000000000000000000000000000000000000000000000000000001'
export const ORACLE_SIGNATURE = '0x' + 'ab'.repeat(65)

export const mockVideo = {
  id: VIDEO_ID,
  title: 'Test Video',
  description: 'A test video',
  thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg',
  channel_title: 'Test Channel',
  duration_seconds: 180,
  reward_cents: 5,
  active: true,
  fetched_at: '2026-01-01T00:00:00Z',
}

export const mockWatch = {
  id: 1,
  wallet_address: VALID_WALLET.toLowerCase(),
  video_id: VIDEO_ID,
  reward_cents: 5,
  points: 5,
  watched_at: '2026-01-15T12:00:00Z',
  claimed: false,
}

export const mockProfile = {
  wallet_address: VALID_WALLET.toLowerCase(),
  referral_code: REFERRAL_CODE,
  referred_by: null,
  total_points: 100,
  total_earned_cents: 50,
  display_name: 'TestUser',
}

export const mockReferral = {
  id: 1,
  referrer_wallet: VALID_WALLET.toLowerCase(),
  referred_wallet: VALID_WALLET_2.toLowerCase(),
  code_used: REFERRAL_CODE,
  reward_points: 50,
  created_at: '2026-01-15T12:00:00Z',
}

export const mockQuiz = {
  video_id: VIDEO_ID,
  summary: 'A summary of the video',
  questions: [
    { q: 'What is the main topic?', options: ['A', 'B', 'C', 'D'], correct: 0 },
    { q: 'What was explained?', options: ['X', 'Y', 'Z', 'W'], correct: 2 },
  ],
  generated_at: '2026-01-01T00:00:00Z',
}

export const mockLeaderboardEntry = {
  wallet: VALID_WALLET.toLowerCase(),
  points: 100,
  rank: 1,
  displayName: 'TestUser',
}