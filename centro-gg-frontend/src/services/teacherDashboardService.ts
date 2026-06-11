import { supabase } from "@/services/supabase";

type EnrollmentStatus =
  | "active"
  | "completed"
  | "cancelled"
  | string;

type CourseStatus =
  | "published"
  | "open"
  | "in_progress"
  | "Activo"
  | string;

type StudentProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type Enrollment = {
  id: string;
  status: EnrollmentStatus | null;
  student: StudentProfile | null;
};

type CourseFromSupabase = {
  id: string;
  title: string | null;
  level: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  max_capacity: number | null;
  status: CourseStatus | null;
  cover_image_path: string | null;
  enrollments: Enrollment[] | null;
};

type CourseTeacherRow = {
  course: CourseFromSupabase | null;
};

export type TeacherDashboardData = {
  stats: {
    totalStudents: number;
    activeCourses: number;
    pendingEvaluations: number;
    averageAttendance: number;
  };

  courses: {
    id: string;
    title: string;
    students: string;
    level: string;
    image: string;
    progress: string;
  }[];

  events: {
    id: string;
    title: string;
    dayLabel: string;
    day: string;
    detail: string;
  }[];

  students: {
    id: string;
    name: string;
    course: string;
    status: string;
    progress: number;
    grade: string;
  }[];
};

function getDayLabel(date: string | null) {
  if (!date) return "FECHA";

  const courseDate = new Date(`${date}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const diffTime =
    courseDate.getTime() - today.getTime();

  const diffDays = Math.round(
    diffTime / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "HOY";
  if (diffDays === 1) return "MAÑANA";

  return courseDate
    .toLocaleDateString("es-CR", {
      weekday: "long",
    })
    .toUpperCase();
}

export async function getTeacherDashboardData(
  teacherId: string
): Promise<TeacherDashboardData> {
  const { data, error } = await supabase
    .from("course_teachers")
    .select(`
      course:courses (
        id,
        title,
        level,
        location,
        start_date,
        end_date,
        max_capacity,
        status,
        cover_image_path,
        enrollments (
          id,
          status,
          student:profiles (
            id,
            full_name,
            email
          )
        )
      )
    `)
    .eq("teacher_id", teacherId);

  if (error) {
    throw error;
  }

  const courseTeacherRows =
    (data ?? []) as unknown as CourseTeacherRow[];

    const courses = courseTeacherRows
    .map((item) => item.course)
    .filter(
        (course): course is CourseFromSupabase =>
        Boolean(course)
    );

  const activeEnrollments = courses.flatMap(
    (course) =>
      (course.enrollments ?? []).filter(
        (enrollment) =>
          enrollment.status === "active"
      )
  );

  const uniqueStudentIds = new Set(
    activeEnrollments
      .map(
        (enrollment) =>
          enrollment.student?.id
      )
      .filter(
        (
          studentId
        ): studentId is string =>
          Boolean(studentId)
      )
  );

  return {
    stats: {
      totalStudents: uniqueStudentIds.size,

      activeCourses: courses.filter(
        (course) =>
          [
            "published",
            "open",
            "in_progress",
            "Activo",
          ].includes(course.status ?? "")
      ).length,

      pendingEvaluations: 0,

      averageAttendance: 0,
    },

    courses: courses.map((course) => {
      const enrollments =
        course.enrollments?.filter(
          (enrollment) =>
            enrollment.status === "active"
        ) ?? [];

      return {
        id: course.id,

        title:
          course.title ?? "Sin título",

        students: `${enrollments.length} Estudiantes activos`,

        level:
          course.level ?? "Sin nivel",

        image:
          course.cover_image_path ??
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587",

        progress:
          course.max_capacity &&
          course.max_capacity > 0
            ? `${Math.min(
                (enrollments.length /
                  course.max_capacity) *
                  100,
                100
              )}%`
            : "0%",
      };
    }),

    events: courses
      .filter(
        (course) => course.start_date
      )
      .map((course) => ({
        id: course.id,

        title:
          course.title ?? "Sin título",

        dayLabel: getDayLabel(
          course.start_date
        ),

        day: course.start_date
          ? new Date(
              `${course.start_date}T00:00:00`
            )
              .getDate()
              .toString()
          : "--",

        detail:
          course.location ??
          "Sin ubicación",
      })),

    students: courses.flatMap(
      (course) =>
        (course.enrollments ?? []).map(
          (enrollment) => ({
            id:
              enrollment.student?.id ??
              enrollment.id,

            name:
              enrollment.student
                ?.full_name ??
              "Sin nombre",

            course:
              course.title ??
              "Sin curso",

            status:
              enrollment.status ??
              "Sin estado",

            progress: 0,

            grade: "N/A",
          })
        )
    ),
  };
}