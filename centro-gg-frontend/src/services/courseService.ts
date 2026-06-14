import { supabase } from "@/services/supabase"

export type LandingCourse = {
  id: string
  title: string
  slug: string
  description: string
  category: string | null
  level: string | null
  duration_hours: number | null
  price: number
  cover_image_path: string | null
  start_date: string | null
  location: string | null
}

export type CourseSession = {
  id: string
  course_id: string
  title: string
  description: string | null
  starts_at: string
  ends_at: string
  session_order: number | null
}

export async function getCourseSessions(courseId: string): Promise<CourseSession[]> {
  const { data, error } = await supabase
    .from("course_sessions")
    .select("id, course_id, title, description, starts_at, ends_at, session_order")
    .eq("course_id", courseId)
    .order("session_order", { ascending: true })

  if (error) throw error

  return data ?? []
}

export async function getPublishedCourseById(
  id: string
): Promise<LandingCourse | null> {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, slug, description, category, level, duration_hours, price, cover_image_path, start_date, location"
    )
    .eq("id", id)
    .eq("status", "published")
    .gte("start_date", today)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function getPublishedCourses(): Promise<LandingCourse[]> {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, slug, description, category, level, duration_hours, price, cover_image_path, start_date, location"
    )
    .eq("status", "published")
    .gte("start_date", today)
    .order("start_date", { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function getFeaturedPublishedCourses(): Promise<LandingCourse[]> {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, slug, description, category, level, duration_hours, price, cover_image_path, start_date, location"
    )
    .eq("status", "published")
    .gte("start_date", today)
    .order("start_date", { ascending: true })
    .limit(4)

  if (error) {
    throw error
  }

  return data ?? []
}