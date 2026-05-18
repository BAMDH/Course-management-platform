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

export async function getPublishedCourses(): Promise<LandingCourse[]> {
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, slug, description, category, level, duration_hours, price, cover_image_path, start_date, location"
    )
    .eq("status", "published")
    .order("start_date", { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function getFeaturedPublishedCourses(): Promise<LandingCourse[]> {
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, slug, description, category, level, duration_hours, price, cover_image_path, start_date, location"
    )
    .eq("status", "published")
    .order("start_date", { ascending: true })
    .limit(4)

  if (error) {
    throw error
  }

  return data ?? []
}