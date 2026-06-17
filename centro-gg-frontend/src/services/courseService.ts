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
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, slug, description, category, level, duration_hours, price, cover_image_path, start_date, location"
    )
    .eq("id", id)
    .in("status", ["published", "Pendiente"])
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function getPublishedCourses(): Promise<LandingCourse[]> {
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, slug, description, category, level, duration_hours, price, cover_image_path, start_date, location"
    )
    .in("status", ["published", "Pendiente"])
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
    .in("status", ["published", "Pendiente"])
    .order("start_date", { ascending: true })
    .limit(4)

  if (error) {
    throw error
  }

  return data ?? []
}

export type StudentEnrolledCourse = {
  id: string;
  course_id: string;
  status: string;
  enrolled_at: string;
  course: {
    id: string;
    title: string;
    description: string | null;
    cover_image_path: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    status: string;
    course_sessions: { id: string; starts_at: string | null }[];
    materials?: { id: string; session: string | null }[];
  };
  progress?: number;
};

export async function getStudentCourses(studentId: string): Promise<StudentEnrolledCourse[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      id,
      course_id,
      status,
      enrolled_at,
      course:courses (
        id,
        title,
        description,
        cover_image_path,
        start_date,
        end_date,
        location,
        status,
        course_sessions ( id, starts_at ),
        materials ( id, session )
      )
    `)
    .eq("student_id", studentId);

  if (error) {
    throw error;
  }

  // Fetch attendance to calculate unlocked materials
  const { data: attendanceData } = await supabase
    .from("attendance")
    .select("session_id, status")
    .eq("student_id", studentId);

  let attendanceMap: Record<string, boolean> = {};
  if (attendanceData) {
    attendanceData.forEach(att => {
      if (att.status === 'present' || att.status === 'late') {
        attendanceMap[att.session_id] = true;
      }
    });
  }

  const enrollments = (data as any) ?? [];

  return enrollments.map((enrollment: any) => {
    let progress = 0;
    const materials = enrollment.course?.materials || [];
    
    if (materials.length > 0) {
      let unlockedCount = 0;
      materials.forEach((mat: any) => {
        if (!mat.session || attendanceMap[mat.session]) {
          unlockedCount++;
        }
      });
      progress = Math.round((unlockedCount / materials.length) * 100);
    }

    return {
      ...enrollment,
      progress
    };
  });
}