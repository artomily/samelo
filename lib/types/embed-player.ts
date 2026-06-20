export type EmbedTheme = 'dark' | 'light' | 'brand'

export interface EmbedConfig {
  id: string
  owner_wallet: string
  video_id: string
  name: string
  theme: EmbedTheme
  autoplay: boolean
  show_quiz: boolean
  show_chapters: boolean
  show_points: boolean
  allow_fullscreen: boolean
  embed_domains: string[]
  view_count: number
  is_active: boolean
  created_at: string
}

export const THEME_STYLES: Record<EmbedTheme, { bg: string; text: string; accent: string }> = {
  dark: { bg: '#030303', text: '#ffffff', accent: '#c8f135' },
  light: { bg: '#f8f8f8', text: '#111111', accent: '#5a8a00' },
  brand: { bg: '#030303', text: '#c8f135', accent: '#c8f135' },
}

export function buildEmbedCode(configId: string, baseUrl: string): string {
  return `<iframe src="${baseUrl}/embed/${configId}" width="100%" height="480" frameborder="0" allowfullscreen></iframe>`
}

export function isDomainAllowed(config: EmbedConfig, domain: string): boolean {
  if (config.embed_domains.length === 0) return true
  return config.embed_domains.some((d) => domain.endsWith(d))
}
