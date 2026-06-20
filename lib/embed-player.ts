import { createClient } from '@supabase/supabase-js'
import type { EmbedConfig, EmbedTheme } from './types/embed-player'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createEmbedConfig(
  ownerWallet: string,
  videoId: string,
  name: string,
  opts: {
    theme?: EmbedTheme
    autoplay?: boolean
    showQuiz?: boolean
    showChapters?: boolean
    showPoints?: boolean
    allowFullscreen?: boolean
    embedDomains?: string[]
  } = {}
): Promise<EmbedConfig> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('embed_configs')
    .insert({
      owner_wallet: ownerWallet,
      video_id: videoId,
      name,
      theme: opts.theme ?? 'dark',
      autoplay: opts.autoplay ?? false,
      show_quiz: opts.showQuiz ?? true,
      show_chapters: opts.showChapters ?? true,
      show_points: opts.showPoints ?? true,
      allow_fullscreen: opts.allowFullscreen ?? true,
      embed_domains: opts.embedDomains ?? [],
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getEmbedConfig(configId: string): Promise<EmbedConfig | null> {
  const supabase = getSupabase()
  const { data } = await supabase.from('embed_configs').select('*').eq('id', configId).eq('is_active', true).single()
  return data ?? null
}

export async function getOwnerEmbedConfigs(wallet: string): Promise<EmbedConfig[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('embed_configs')
    .select('*')
    .eq('owner_wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function incrementEmbedView(configId: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.rpc('increment_embed_view', { config_id: configId })
}

export async function deactivateEmbedConfig(configId: string, wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('embed_configs').update({ is_active: false }).eq('id', configId).eq('owner_wallet', wallet)
}
