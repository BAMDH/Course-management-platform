import { supabase } from "@/services/supabase";

export type StudentProfileData = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  cedula: string;
  level: string;
  avatar_url: string;
  provincia: string;
  canton: string;
  distrito: string;
  direccion_exacta: string;
  created_at: string;
  generalAverage: number;
  hoursCompleted: number;
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

export type ProfileUpdatePayload = Partial<Omit<StudentProfileData, 'id' | 'email' | 'created_at' | 'generalAverage' | 'hoursCompleted' | 'recentModules' | 'certifications' | 'ongoingCourse'>>;

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

  let totalHours = 0;
  let ongoingCourse = null;
  
  if (enrollments && enrollments.length > 0) {
    enrollments.forEach((enrollment: any) => {
      const courseArray = enrollment.courses;
      const course = Array.isArray(courseArray) ? courseArray[0] : courseArray;

      if (course && course.duration_hours) {
        totalHours += Number(course.duration_hours);
      }
      if (enrollment.status === 'active' && !ongoingCourse) {
        // Find the first active course
        ongoingCourse = {
          id: course.id,
          title: course.title,
          schedule: 'Jueves, 18:00 - 21:00' // Mock schedule since we don't have sessions mapped to enrollments easily yet
        };
      }
    });
  }

  // Fallbacks for data that doesn't exist yet natively
  const recentModules = [
    { id: '1', title: 'Masas Laminadas y Hojaldres', grade: 95 },
    { id: '2', title: 'Galletería Fina', grade: 98 },
  ];

  const certifications = [
    { id: '1', title: 'Fundamentos de Repostería Básica', date: 'Junio 2023' },
    { id: '2', title: 'Manipulación de Alimentos Acreditada', date: 'Enero 2023' },
  ];

  return {
    id: profileData.id,
    email: profileData.email,
    full_name: profileData.full_name || '',
    phone: profileData.phone || '',
    cedula: profileData.cedula || '',
    level: profileData.level || 'Estudiante Nivel Intermedio',
    avatar_url: profileData.avatar_url || '',
    provincia: profileData.provincia || '',
    canton: profileData.canton || '',
    distrito: profileData.distrito || '',
    direccion_exacta: profileData.direccion_exacta || '',
    created_at: profileData.created_at,
    generalAverage: 92, // Mock for visual representation as in Figma
    hoursCompleted: totalHours,
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
      provincia: updates.provincia,
      canton: updates.canton,
      distrito: updates.distrito,
      direccion_exacta: updates.direccion_exacta,
      avatar_url: updates.avatar_url,
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
