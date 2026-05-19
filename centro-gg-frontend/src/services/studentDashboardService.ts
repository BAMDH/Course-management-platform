import { supabase } from "@/services/supabase";

export type StudentDashboardData = {
  generalAverage: number;
  hoursCompleted: number;
  ongoingCourses: {
    id: string;
    title: string;
    module: string;
    progress: number;
    image: string;
  }[];
};

export async function getStudentDashboardData(email: string): Promise<StudentDashboardData> {
  // 1. Get the actual user ID by email since we might be mocking the session
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (profileError || !profileData) {
    console.error("Could not find profile for email:", email, profileError);
    // Return empty fallback
    return {
      generalAverage: 0,
      hoursCompleted: 0,
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
        level
      )
    `)
    .eq('student_id', studentId)
    .in('status', ['active', 'completed']);

  if (enrollmentsError) {
    console.error("Error fetching enrollments:", enrollmentsError);
    throw enrollmentsError;
  }

  // 3. Process data
  let totalHours = 0;
  const ongoingCourses = (enrollments || []).map((enrollment: any, index: number) => {
    const course = enrollment.courses;
    if (course.duration_hours) {
      totalHours += Number(course.duration_hours);
    }
    
    return {
      id: course.id,
      title: course.title,
      // We don't have modules mapped yet, fallback to level or a generic string
      module: course.level ? course.level.toUpperCase() : `MÓDULO ${index + 1}`,
      // Progress is not natively tracked yet, simulate a value for visual purposes
      progress: Math.floor(Math.random() * 40) + 10, // random between 10 and 50
      image: course.cover_image_path || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600',
    };
  });

  // Since we don't have assignment_grades yet to calculate an average, we fallback
  const generalAverage = enrollments && enrollments.length > 0 ? 85 : 0;

  return {
    generalAverage,
    hoursCompleted: totalHours,
    ongoingCourses,
  };
}
