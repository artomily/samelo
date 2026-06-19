export type VideoDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type VideoCategory = 'general' | 'defi' | 'nft' | 'gaming' | 'dao' | 'layer2' | 'celo'

export interface Video {
  id: string
  title: string
  youtubeId: string
  rewardCents: number
  category: VideoCategory
  difficulty: VideoDifficulty
  isFeatured: boolean
  tags: string[]
  durationSeconds: number | null
  thumbnailUrl: string | null
  watchCount: number
  isActive: boolean
  createdAt: string
}

export interface VideoWithProgress extends Video {
  watchedAt: string | null
  earnedPoints: number | null
}

export const DIFFICULTY_LABELS: Record<VideoDifficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const DIFFICULTY_COLORS: Record<VideoDifficulty, string> = {
  beginner: '#35d07f',
  intermediate: '#fbcc5c',
  advanced: '#f97316',
}

export const VIDEO_CATEGORIES: VideoCategory[] = ['general', 'defi', 'nft', 'gaming', 'dao', 'layer2', 'celo']
