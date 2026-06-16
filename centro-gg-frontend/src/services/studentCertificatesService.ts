import { supabase } from '@/services/supabase';

export interface CourseGrade {
  id: string; // course_id
  courseTitle: string;
  professor: string;
  grade: string | number;
  status: 'Aprobado' | 'En curso' | 'Próximo';
}

export interface StudentGradesData {
  overallGrade: number | null;
  attendancePercentage: number | null;
  attendedSessions: number;
  totalSessions: number;
  courses: CourseGrade[];
}

export async function getStudentGradesData(email: string): Promise<StudentGradesData> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (!profile) {
    return {
      overallGrade: null,
      attendancePercentage: null,
      attendedSessions: 0,
      totalSessions: 0,
      courses: []
    };
  }

  const studentId = profile.id;

  // 1. Fetch enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      course_id,
      status,
      courses (
        id,
        title,
        status,
        course_teachers (
          profiles (
            full_name
          )
        )
      )
    `)
    .eq('student_id', studentId);

  // 2. Fetch grades
  const { data: grades } = await supabase
    .from('assignment_grades')
    .select('course_id, score')
    .eq('student_id', studentId);

  // 3. Fetch attendance
  const { data: attendance } = await supabase
    .from('attendance')
    .select('session_id, status')
    .eq('student_id', studentId);

  // Calculate course grades and list
  const coursesList: CourseGrade[] = [];
  let totalGradeSum = 0;
  let gradedCoursesCount = 0;

  if (enrollments && enrollments.length > 0) {
    for (const enrollment of enrollments) {
      const course = enrollment.courses as any;
      if (!course) continue;

      const courseId = course.id;
      const courseTitle = course.title || 'Curso Sin Nombre';
      
      let professor = 'Sin profesor asignado';
      if (course.course_teachers && course.course_teachers.length > 0) {
        professor = course.course_teachers[0].profiles?.full_name || professor;
      }

      // Calculate grade for this course
      const courseGrades = grades ? grades.filter(g => g.course_id === courseId) : [];
      let grade: number | string = '-';
      
      if (courseGrades.length > 0) {
        const sum = courseGrades.reduce((acc, curr) => acc + Number(curr.score), 0);
        grade = Number((sum / courseGrades.length).toFixed(1));
        totalGradeSum += grade;
        gradedCoursesCount++;
      }

      // Determine status
      let status: 'Aprobado' | 'En curso' | 'Próximo' = 'En curso';
      if (enrollment.status === 'completed') status = 'Aprobado';
      else if (enrollment.status === 'active') status = 'En curso';
      else if (enrollment.status === 'pending') status = 'Próximo';

      coursesList.push({
        id: courseId,
        courseTitle,
        professor,
        grade,
        status
      });
    }
  }

  // Calculate Overall Grade
  const overallGrade = gradedCoursesCount > 0 ? Number((totalGradeSum / gradedCoursesCount).toFixed(1)) : null;

  // Calculate Attendance
  let attendancePercentage = null;
  let attendedSessions = 0;
  let totalSessions = 0;

  if (attendance && attendance.length > 0) {
    totalSessions = attendance.length;
    attendedSessions = attendance.filter(a => a.status === 'present').length;
    attendancePercentage = Math.round((attendedSessions / totalSessions) * 100);
  }

  return {
    overallGrade,
    attendancePercentage,
    attendedSessions,
    totalSessions,
    courses: coursesList
  };
}
