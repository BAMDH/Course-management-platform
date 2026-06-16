import { supabase } from "@/services/supabase";

export type EventType = 'past' | 'upcoming' | 'future' | 'evaluation';

export interface CalendarEvent {
  id: string;
  type: EventType;
  date: number; // Day of the month
  fullDateStr: string;
  title: string;
  description: string;
  tag: string;
  tagType: 'grey' | 'red';
  extraInfo?: string;
}

export async function getStudentCalendarEvents(email: string, year: number, month: number): Promise<CalendarEvent[]> {
  // 1. Get user profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (profileError || !profileData) {
    console.error("Profile not found:", profileError);
    return [];
  }

  const studentId = profileData.id;

  // 2. Fetch active enrollments
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', studentId)
    .eq('status', 'active');

  if (enrollmentsError || !enrollments || enrollments.length === 0) {
    return [];
  }

  const courseIds = enrollments.map(e => e.course_id);

  // Determine date bounds
  const startDate = new Date(year, month, 1).toISOString();
  const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  // 3. Fetch course_sessions within the month
  const { data: sessions, error: sessionsError } = await supabase
    .from('course_sessions')
    .select('id, course_id, title, description, starts_at')
    .in('course_id', courseIds)
    .gte('starts_at', startDate)
    .lte('starts_at', endDate)
    .order('starts_at', { ascending: true });

  if (sessionsError) {
    console.error("Error fetching sessions:", sessionsError);
  }

  // 4. Fetch assignments within the month
  const { data: assignments, error: assignmentsError } = await supabase
    .from('assignments')
    .select('id, course_id, title, description, due_at')
    .in('course_id', courseIds)
    .gte('due_at', startDate)
    .lte('due_at', endDate)
    .order('due_at', { ascending: true });

  if (assignmentsError) {
    console.error("Error fetching assignments:", assignmentsError);
  }

  // 5. Fetch attendance for the student
  const { data: attendance, error: attendanceError } = await supabase
    .from('attendance')
    .select('session_id, status')
    .eq('student_id', studentId);

  if (attendanceError) {
    console.error("Error fetching attendance:", attendanceError);
  }

  const attendanceMap = new Map();
  (attendance || []).forEach(record => {
    attendanceMap.set(record.session_id, record.status);
  });

  const now = new Date();
  const events: CalendarEvent[] = [];

  const formatter = new Intl.DateTimeFormat('es-CR', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Map Sessions
  if (sessions) {
    for (const session of sessions) {
      const sessionDate = new Date(session.starts_at);
      let type: EventType = 'future';
      let tag = '';
      let tagType: 'grey' | 'red' = 'grey';

      if (sessionDate < now) {
        type = 'past';
        const attStatus = attendanceMap.get(session.id);
        if (attStatus === 'present' || attStatus === 'late') {
          tag = 'Asistió';
          tagType = 'grey';
        } else if (attStatus === 'absent') {
          tag = 'Ausente';
          tagType = 'red';
        } else {
          tag = 'Sin Registro';
          tagType = 'grey';
        }
      } else if (
        sessionDate.getFullYear() === now.getFullYear() &&
        sessionDate.getMonth() === now.getMonth() &&
        sessionDate.getDate() === now.getDate()
      ) {
        // Class is today or very soon
        type = 'upcoming';
      }

      events.push({
        id: session.id,
        type,
        date: sessionDate.getDate(),
        fullDateStr: formatter.format(sessionDate).toUpperCase().replace(',', ''),
        title: session.title || 'Clase Regular',
        description: session.description || 'Sin descripción.',
        tag,
        tagType
      });
    }
  }

  // Map Assignments (Evaluations)
  if (assignments) {
    for (const assignment of assignments) {
      const dueDate = new Date(assignment.due_at);
      events.push({
        id: `eval-${assignment.id}`,
        type: 'evaluation',
        date: dueDate.getDate(),
        fullDateStr: formatter.format(dueDate).toUpperCase().replace(',', ''),
        title: assignment.title || 'Evaluación',
        description: assignment.description || 'Evaluación del curso.',
        tag: 'Evaluación',
        tagType: 'grey'
      });
    }
  }

  // Sort by date
  events.sort((a, b) => {
    const timeA = new Date(`${year}-${month + 1}-${a.date} ${a.fullDateStr.split(' ')[2]} ${a.fullDateStr.split(' ')[3]}`).getTime() || a.date;
    const timeB = new Date(`${year}-${month + 1}-${b.date} ${b.fullDateStr.split(' ')[2]} ${b.fullDateStr.split(' ')[3]}`).getTime() || b.date;
    return timeA - timeB; // Approximate sort, but date is more reliable
  });

  return events;
}

export interface RecommendedClass {
  id: string; // course_id
  title: string;
  sessionTitle?: string;
  startsAtStr?: string;
  imageUrl?: string;
}

export async function getRecommendedClass(email: string): Promise<RecommendedClass | null> {
  const { data: profileData } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (!profileData) return null;

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', profileData.id)
    .eq('status', 'active');

  const enrolledCourseIds = enrollments ? enrollments.map(e => e.course_id) : [];

  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from('courses')
    .select('id, title, cover_image_path, start_date')
    .eq('status', 'published')
    .gte('start_date', today)
    .order('start_date', { ascending: true });

  if (enrolledCourseIds.length > 0) {
    query = query.not('id', 'in', `(${enrolledCourseIds.join(',')})`);
  }

  const { data: courses } = await query.limit(1);
  const course = courses && courses.length > 0 ? courses[0] : null;

  if (!course) return null;

  let imageUrl = 'https://images.unsplash.com/photo-1556910103-1c02745a872e?auto=format&fit=crop&w=800&q=80';
  if (course.cover_image_path) {
    if (course.cover_image_path.startsWith('http')) {
      imageUrl = course.cover_image_path;
    } else {
      const { data } = supabase.storage.from('course_covers').getPublicUrl(course.cover_image_path);
      imageUrl = data.publicUrl;
    }
  }

  const { data: sessionData } = await supabase
    .from('course_sessions')
    .select('title, starts_at')
    .eq('course_id', course.id)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  let startsAtStr = '';
  let sessionTitle = '';
  
  if (sessionData) {
    const d = new Date(sessionData.starts_at);
    const formatter = new Intl.DateTimeFormat('es-CR', {
      weekday: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    startsAtStr = formatter.format(d).toUpperCase().replace(',', '');
    sessionTitle = sessionData.title;
  } else if (course.start_date) {
    const d = new Date(course.start_date);
    const formatter = new Intl.DateTimeFormat('es-CR', {
      weekday: 'short',
      day: 'numeric'
    });
    startsAtStr = `Inicia: ${formatter.format(d).toUpperCase()}`;
  }

  return {
    id: course.id,
    title: course.title,
    sessionTitle,
    startsAtStr,
    imageUrl
  };
}
