import { describe, it, expect } from 'vitest'
import { buildEmbedCode, isDomainAllowed, THEME_STYLES } from '@/lib/types/embed-player'
import type { EmbedConfig } from '@/lib/types/embed-player'

const makeConfig = (overrides: Partial<EmbedConfig> = {}): EmbedConfig => ({
  id: 'cfg1',
  owner_wallet: '0x1234567890123456789012345678901234567890',
  video_id: 'vid1',
  name: 'My Embed',
  theme: 'dark',
  autoplay: false,
  show_quiz: true,
  show_chapters: true,
  show_points: true,
  allow_fullscreen: true,
  embed_domains: [],
  view_count: 0,
  is_active: true,
  created_at: '2026-06-21T00:00:00Z',
  ...overrides,
})

describe('buildEmbedCode', () => {
  it('builds iframe with config id', () => {
    const code = buildEmbedCode('cfg1', 'https://samelo.xyz')
    expect(code).toContain('src="https://samelo.xyz/embed/cfg1"')
    expect(code).toContain('<iframe')
    expect(code).toContain('allowfullscreen')
  })
})

describe('isDomainAllowed', () => {
  it('allows all domains when embed_domains is empty', () => {
    expect(isDomainAllowed(makeConfig(), 'example.com')).toBe(true)
  })

  it('allows matching domain', () => {
    const config = makeConfig({ embed_domains: ['example.com'] })
    expect(isDomainAllowed(config, 'app.example.com')).toBe(true)
  })

  it('blocks non-matching domain', () => {
    const config = makeConfig({ embed_domains: ['example.com'] })
    expect(isDomainAllowed(config, 'other.xyz')).toBe(false)
  })
})

describe('THEME_STYLES', () => {
  it('dark theme uses void black background', () => {
    expect(THEME_STYLES.dark.bg).toBe('#030303')
  })

  it('all themes have accent color', () => {
    for (const theme of Object.keys(THEME_STYLES) as (keyof typeof THEME_STYLES)[]) {
      expect(THEME_STYLES[theme].accent).toBeTruthy()
    }
  })
})
