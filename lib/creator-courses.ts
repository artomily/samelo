import { createClient } from '@supabase/supabase-js'
import type { Course, CourseLesson, CourseEnrollment, CourseWithLessons } from './types/creator-courses'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getPublishedCourses(limit = 20): Promise<Course[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('enrollee_count', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getCourseWithLessons(id: string, wallet?: string): Promise<CourseWithLessons | null> {
  const supabase = getSupabase()
  const { data: course } = await supabase.from('courses').select('*').eq('id', id).single()
  if (!course) return null

  const { data: lessons } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('course_id', id)
    .order('lesson_number')

  let enrollment: CourseEnrollment | null = null
  if (wallet) {
    const { data } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('wallet', wallet)
      .eq('course_id', id)
      .single()
    enrollment = data ?? null
  }

  return { ...course, lessons: lessons ?? [], enrollment }
}

export async function createCourse(
  creatorWallet: string,
  title: string,
  opts: { description?: string; skillLevel?: Course['skill_level']; priceMelo?: number; estimatedMinutes?: number } = {}
): Promise<Course> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('courses')
    .insert({
      creator_wallet: creatorWallet,
      title,
      description: opts.description ?? null,
      skill_level: opts.skillLevel ?? 'beginner',
      price_melo: opts.priceMelo ?? 0,
      estimated_minutes: opts.estimatedMinutes ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function enrollInCourse(wallet: string, courseId: string, paidMelo: number): Promise<CourseEnrollment> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('course_enrollments')
    .insert({ wallet, course_id: courseId, paid_melo: paidMelo })
    .select()
    .single()
  if (error) throw new Error(error.message)

  await supabase
    .from('courses')
    .update({ enrollee_count: supabase.rpc('increment_enrollee_count', { course_id: courseId }) })

  return data
}

export async function addCourseLesson(
  courseId: string,
  videoId: string,
  lessonNumber: number,
  title: string,
  opts: { durationSeconds?: number; isPreview?: boolean } = {}
): Promise<CourseLesson> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('course_lessons')
    .insert({
      course_id: courseId,
      video_id: videoId,
      lesson_number: lessonNumber,
      title,
      duration_seconds: opts.durationSeconds ?? null,
      is_preview: opts.isPreview ?? false,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)

  await supabase
    .from('courses')
    .update({ lesson_count: lessonNumber, updated_at: new Date().toISOString() })
    .eq('id', courseId)

  return data
}

export async function getWalletEnrollments(wallet: string): Promise<CourseEnrollment[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('wallet', wallet)
    .order('enrolled_at', { ascending: false })
  return data ?? []
}
