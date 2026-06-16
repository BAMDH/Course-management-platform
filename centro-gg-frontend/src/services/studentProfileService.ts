import { supabase } from "@/services/supabase";

export type StudentProfileData = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  cedula: string;
  date_of_birth: string;
  level: string;
  avatar_url: string;
  provincia: string;
  canton: string;
  distrito: string;
  direccion_exacta: string;
  created_at: string;
  generalAverage: number;
  generalAttendance: number;
  attendanceStatus: string;
  email_notifications: boolean;
  recentModules: {
    id: string;
    title: string;
    grade: number;
  }[];
  certifications: {
    id: string;
    title: string;
    date: string;
  }[];
  ongoingCourse: {
    id: string;
    title: string;
    schedule: string;
  } | null;
};

export type ProfileUpdatePayload = Partial<Omit<StudentProfileData, 'id' | 'email' | 'created_at' | 'generalAverage' | 'generalAttendance' | 'attendanceStatus' | 'recentModules' | 'certifications' | 'ongoingCourse'>>;

export async function getStudentProfileData(email: string): Promise<StudentProfileData> {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (profileError || !profileData) {
    throw profileError || new Error("Profile not found");
  }

  // Fetch enrollments to calculate hours and get current course
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select(`
      id,
      status,
      courses (
        id,
        title,
        duration_hours
      )
    `)
    .eq('student_id', profileData.id)
    .in('status', ['active', 'completed']);

  if (enrollmentsError) {
    throw enrollmentsError;
  }

  let ongoingCourse: { id: string; title: string; schedule: string } | null = null;
  
  if (enrollments && enrollments.length > 0) {
    enrollments.forEach((enrollment: any) => {
      const courseArray = enrollment.courses;
      const course = Array.isArray(courseArray) ? courseArray[0] : courseArray;

      if (enrollment.status === 'active' && !ongoingCourse) {
        // Find the first active course
        ongoingCourse = {
          id: course.id,
          title: course.title,
          schedule: 'Horario por definir' // Requires session integration
        };
      }
    });
  }

  // Fetch Attendance
  const { data: attendanceData } = await supabase
    .from('attendance')
    .select('status')
    .eq('student_id', profileData.id);

  let generalAttendance = 0;
  let attendanceStatus = 'Sin datos';
  if (attendanceData && attendanceData.length > 0) {
    const present = attendanceData.filter((a: any) => a.status === 'present' || a.status === 'late').length;
    generalAttendance = Math.round((present / attendanceData.length) * 100);
    if (generalAttendance >= 90) attendanceStatus = 'Excelente';
    else if (generalAttendance >= 80) attendanceStatus = 'Bueno';
    else if (generalAttendance >= 70) attendanceStatus = 'Regular';
    else attendanceStatus = 'En Riesgo';
  }

  // Fetch Certificates
  const { data: certsData } = await supabase
    .from('certificates')
    .select('id, course_id, issued_at, courses(title)')
    .eq('student_id', profileData.id);

  const certifications = (certsData || []).map((c: any) => ({
    id: c.id,
    title: c.courses?.title || 'Certificado',
    date: new Date(c.issued_at).toLocaleDateString('es-CR', { year: 'numeric', month: 'long' })
  }));

  // Fetch Grades (Recent Modules)
  const { data: gradesData } = await supabase
    .from('assignment_grades')
    .select('id, score, assignments(title), graded_at')
    .eq('student_id', profileData.id)
    .order('graded_at', { ascending: false })
    .limit(3);

  const recentModules = (gradesData || []).map((g: any) => ({
    id: g.id,
    title: g.assignments?.title || 'Asignación',
    grade: Number(g.score)
  }));

  return {
    id: profileData.id,
    email: profileData.email,
    full_name: profileData.full_name || '',
    phone: profileData.phone || '',
    cedula: profileData.cedula || '',
    date_of_birth: profileData.date_of_birth || '',
    level: profileData.level || '',
    avatar_url: profileData.avatar_url || '',
    provincia: profileData.provincia || '',
    canton: profileData.canton || '',
    distrito: profileData.distrito || '',
    direccion_exacta: profileData.direccion_exacta || '',
    created_at: profileData.created_at,
    email_notifications: profileData.email_notifications ?? true,
    generalAverage: 0, // Placeholder as calculating accurate average depends on multiple weights
    generalAttendance,
    attendanceStatus,
    recentModules,
    certifications,
    ongoingCourse
  };
}

export async function updateStudentProfile(userId: string, updates: ProfileUpdatePayload): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.full_name,
      phone: updates.phone,
      cedula: updates.cedula,
      date_of_birth: updates.date_of_birth,
      provincia: updates.provincia,
      canton: updates.canton,
      distrito: updates.distrito,
      direccion_exacta: updates.direccion_exacta,
      avatar_url: updates.avatar_url,
      email_notifications: updates.email_notifications,
    })
    .eq('id', userId);

  if (error) {
    throw error;
  }
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}-${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function updateStudentPassword(password: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

export async function resetStudentPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}
