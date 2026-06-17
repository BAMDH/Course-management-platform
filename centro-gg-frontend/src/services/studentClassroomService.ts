import { supabase } from "@/services/supabase";

export type CourseInfo = {
  id: string;
  title: string;
  description: string;
  level: string;
  cover_image_path: string | null;
  teacherName: string;
  nextClassDate: string | null;
};

export type CourseSession = {
  id: string;
  title: string | null;
  starts_at: string | null;
  ends_at: string | null;
  session_order: number | null;
};

export type CourseMaterial = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  kind: string;
  file_path: string | null;
  external_url: string | null;
  is_downloadable: boolean;
  is_extra_purchase: boolean;
  price: number | null;
  session: string | null;
  course_sessions: { title: string | null; starts_at: string | null } | null;
  isUnlocked: boolean;
};

export type CourseAnnouncement = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  priority: string;
};

export type ClassroomData = {
  course: CourseInfo | null;
  sessions: CourseSession[];
  materials: CourseMaterial[];
  announcements: CourseAnnouncement[];
};

export async function getStudentClassroomData(courseId: string, email: string): Promise<ClassroomData> {
  // 1. Get student profile id
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  const studentId = profile?.id;

  // 2. Get Course Info & Teacher
  const { data: courseData, error: courseError } = await supabase
    .from("courses")
    .select(`
      id, title, description, level, cover_image_path,
      course_teachers (
        profiles ( full_name )
      )
    `)
    .eq("id", courseId)
    .single();

  if (courseError) throw courseError;

  let teacherName = 'Sin profesor asignado';
  if (courseData.course_teachers && courseData.course_teachers.length > 0) {
    teacherName = (courseData.course_teachers[0] as any).profiles?.full_name || teacherName;
  }

  // 3. Get Course Sessions
  const { data: sessionsData, error: sessionsError } = await supabase
    .from("course_sessions")
    .select("id, title, starts_at, ends_at, session_order")
    .eq("course_id", courseId)
    .order("starts_at", { ascending: true });

  if (sessionsError) throw sessionsError;
  const sessions = (sessionsData || []) as CourseSession[];

  // Determine Next Class
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let nextClassDate: string | null = null;
  for (const session of sessions) {
    if (session.starts_at) {
      const sessionDate = new Date(session.starts_at);
      if (sessionDate >= today) {
        nextClassDate = session.starts_at;
        break;
      }
    }
  }

  // 4. Get Materials
  const { data: materialsData, error: materialsError } = await supabase
    .from("materials")
    .select(`
      id, course_id, title, description, kind, file_path, external_url,
      is_downloadable, is_extra_purchase, price, session,
      course_sessions:session ( title, starts_at )
    `)
    .eq("course_id", courseId)
    .order("published_at", { ascending: false });

  if (materialsError) throw materialsError;

  // 5. Get Attendance for the student
  let attendanceMap: Record<string, boolean> = {}; // session_id -> true if present
  if (studentId) {
    const { data: attendanceData } = await supabase
      .from("attendance")
      .select("session_id, status")
      .eq("student_id", studentId);
    
    if (attendanceData) {
      attendanceData.forEach(att => {
        if (att.status === 'present' || att.status === 'late') {
          attendanceMap[att.session_id] = true;
        }
      });
    }
  }

  // Map materials and determine unlock state
  const materials = (materialsData || []).map((mat: any): CourseMaterial => {
    let isUnlocked = true;
    if (mat.session) {
      // If it belongs to a session, check attendance
      isUnlocked = !!attendanceMap[mat.session];
    }
    return {
      ...mat,
      isUnlocked
    };
  });

  // 6. Get Announcements
  const { data: announcementsData } = await supabase
    .from("announcements")
    .select("id, title, content, created_at, priority")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  return {
    course: {
      id: courseData.id,
      title: courseData.title,
      description: courseData.description || '',
      level: courseData.level || '',
      cover_image_path: courseData.cover_image_path,
      teacherName,
      nextClassDate,
    },
    sessions,
    materials,
    announcements: announcementsData || []
  };
}
