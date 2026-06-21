export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Course {
  id: string
  creator_wallet: string
  title: string
  description: string | null
  cover_url: string | null
  skill_level: SkillLevel
  price_melo: number
  is_published: boolean
  estimated_minutes: number | null
  lesson_count: number
  enrollee_count: number
  created_at: string
  updated_at: string
}

export interface CourseLesson {
  id: string
  course_id: string
  video_id: string
  lesson_number: number
  title: string
  duration_seconds: number | null
  is_preview: boolean
  created_at: string
}

export interface CourseEnrollment {
  id: string
  wallet: string
  course_id: string
  paid_melo: number
  completed: boolean
  completed_at: string | null
  enrolled_at: string
}

export interface CourseWithLessons extends Course {
  lessons: CourseLesson[]
  enrollment: CourseEnrollment | null
}

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const SKILL_LEVEL_COLORS: Record<SkillLevel, string> = {
  beginner: '#4ade80',
  intermediate: '#f1c135',
  advanced: '#c8f135',
}

export function isFree(course: Course): boolean {
  return course.price_melo === 0
}

export function formatDuration(minutes: number | null): string {
  if (!minutes) return 'TBD'
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
