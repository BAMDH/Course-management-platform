import { supabase } from "@/services/supabase";

export type StudentDashboardData = {
  avatarUrl: string | null;
  ongoingCourses: {
    id: string;
    title: string;
    module: string;
    progress: number;
    image: string;
  }[];
};

export async function getStudentDashboardData(email: string): Promise<StudentDashboardData> {
  // 1. Get the actual user ID and avatar by email since we might be mocking the session
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id, avatar_url')
    .eq('email', email)
    .single();

  if (profileError || !profileData) {
    console.error("Could not find profile for email:", email, profileError);
    // Return empty fallback
    return {
      avatarUrl: null,
      ongoingCourses: [],
    };
  }

  const studentId = profileData.id;

  // 2. Fetch enrollments with related courses
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select(`
      id,
      status,
      courses (
        id,
        title,
        duration_hours,
        cover_image_path,
        level,
        materials ( id, session )
      )
    `)
    .eq('student_id', studentId)
    .in('status', ['active', 'completed']);

  if (enrollmentsError) {
    console.error("Error fetching enrollments:", enrollmentsError);
    throw enrollmentsError;
  }

  // Fetch attendance to calculate real progress
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

  // 3. Process data
  const ongoingCourses = (enrollments || []).map((enrollment: any, index: number) => {
    const course = enrollment.courses;
    const materials = course.materials || [];
    
    let progress = 0;
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
      id: course.id,
      title: course.title,
      module: course.level ? course.level.toUpperCase() : `MÓDULO ${index + 1}`,
      progress,
      image: course.cover_image_path || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600',
    };
  });

  return {
    avatarUrl: profileData.avatar_url,
    ongoingCourses,
  };
}
