import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import clsx from "clsx";

import { supabase } from "@/services/supabase";
import { useAuth } from "@/providers/auth/useAuth";

type TeacherCourse = {
  course_id: string;
};

type EnrollmentRow = {
  id: string;
  course_id: string;
  status: string | null;
  student: {
    id: string;
    full_name: string | null;
    email: string | null;
  } | null;
  course: {
    id: string;
    title: string | null;
  } | null;
};

type SessionRow = {
  id: string;
  course_id: string;
  starts_at: string;
};

type AttendanceRow = {
  student_id: string;
  course_id: string;
  session_id: string;
  status: string | null;
};

function getStatusLabel(status: string | null) {
  if (status === "active") return "Activo";
  if (status === "pending_payment") return "Pendiente pago";
  if (status === "completed") return "Completado";
  if (status === "cancelled") return "Cancelado";
  return "Inactivo";
}

export default function TeacherStudents() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [onlyLowAttendance, setOnlyLowAttendance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      if (!user?.id) return;

      setIsLoading(true);

      try {
        const { data: teacherCoursesData, error: teacherCoursesError } =
          await supabase
            .from("course_teachers")
            .select("course_id")
            .eq("teacher_id", user.id);

        if (teacherCoursesError) throw teacherCoursesError;

        const teacherCourses =
          (teacherCoursesData ?? []) as unknown as TeacherCourse[];

        const courseIds = teacherCourses.map((item) => item.course_id);

        if (courseIds.length === 0) {
          setEnrollments([]);
          setSessions([]);
          setAttendance([]);
          setIsLoading(false);
          return;
        }

        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from("enrollments")
          .select(`
            id,
            course_id,
            status,
            student:profiles (
              id,
              full_name,
              email
            ),
            course:courses (
              id,
              title
            )
          `)
          .in("course_id", courseIds);

        if (enrollmentError) throw enrollmentError;

        const { data: sessionData, error: sessionError } = await supabase
          .from("course_sessions")
          .select("id, course_id, starts_at")
          .in("course_id", courseIds)
          .order("starts_at", { ascending: true });

        if (sessionError) throw sessionError;

        const completedSessions =
          (sessionData ?? []).filter(
            (session) => new Date(session.starts_at) <= new Date()
          ) ?? [];

        const completedSessionIds = completedSessions.map(
          (session) => session.id
        );

        let attendanceData: AttendanceRow[] = [];

        if (completedSessionIds.length > 0) {
          const { data, error } = await supabase
            .from("attendance")
            .select("student_id, course_id, session_id, status")
            .in("course_id", courseIds)
            .in("session_id", completedSessionIds);

          if (error) throw error;

          attendanceData = (data ?? []) as unknown as AttendanceRow[];
        }

        setEnrollments((enrollmentData ?? []) as unknown as EnrollmentRow[]);
        setSessions((sessionData ?? []) as unknown as SessionRow[]);
        setAttendance(attendanceData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadStudents();
  }, [user?.id]);

  const studentRows = useMemo(() => {
    return enrollments.map((enrollment) => {
      const courseSessions = sessions.filter(
        (session) =>
          session.course_id === enrollment.course_id &&
          new Date(session.starts_at) <= new Date()
      );

      const studentAttendance = attendance.filter(
        (item) =>
          item.student_id === enrollment.student?.id &&
          item.course_id === enrollment.course_id
      );

      const attendedSessions = studentAttendance.filter(
        (item) => item.status === "present" || item.status === "late"
      ).length;

      const attendancePercentage =
        courseSessions.length > 0
          ? Math.round((attendedSessions / courseSessions.length) * 100)
          : 0;

      return {
        enrollmentId: enrollment.id,
        studentId: enrollment.student?.id ?? "",
        studentName: enrollment.student?.full_name ?? "Sin nombre",
        email: enrollment.student?.email ?? "Sin correo",
        courseId: enrollment.course_id,
        courseTitle: enrollment.course?.title ?? "Curso sin nombre",
        status: enrollment.status,
        attendancePercentage,
        completedSessions: courseSessions.length,
      };
    });
  }, [enrollments, sessions, attendance]);

  const courseOptions = Array.from(
    new Map(
      studentRows.map((row) => [
        row.courseId,
        {
          id: row.courseId,
          title: row.courseTitle,
        },
      ])
    ).values()
  );

  const filteredStudents = studentRows.filter((student) => {
    const query = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !query ||
      student.studentName.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query);

    const matchesCourse =
      courseFilter === "all" || student.courseId === courseFilter;

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    const matchesLowAttendance =
      !onlyLowAttendance || student.attendancePercentage < 70;

    return (
      matchesSearch &&
      matchesCourse &&
      matchesStatus &&
      matchesLowAttendance
    );
  });

  const totalStudents = studentRows.length;
  const activeStudents = studentRows.filter(
    (student) => student.status === "active"
  ).length;

  const averageAttendance =
    studentRows.length > 0
      ? Math.round(
          studentRows.reduce(
            (total, student) => total + student.attendancePercentage,
            0
          ) / studentRows.length
        )
      : 0;

  const lowAttendanceStudents = studentRows.filter(
    (student) => student.attendancePercentage < 70
  ).length;

  return (
    <main className="mx-auto max-w-7xl space-y-4 md:space-y-8 p-4 md:p-8 font-['Inter',sans-serif]">
      <header>
        <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
          Estudiantes
        </h1>

        <p className="mt-2 text-base text-[#5d5e60]">
          Consulte la asistencia histórica de los estudiantes según sus cursos.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total estudiantes" value={totalStudents} icon={Users} />
        <StatCard title="Activos" value={activeStudents} icon={UserCheck} />
        <StatCard title="Asistencia promedio" value={`${averageAttendance}%`} icon={UserCheck} />
        <StatCard title="Bajo seguimiento" value={lowAttendanceStudents} icon={AlertTriangle} danger />
      </section>

      <section className="rounded-3xl border border-[#e9e8e7] bg-white shadow-sm">
        <div className="grid gap-4 border-b border-[#e9e8e7] p-6 lg:grid-cols-[1fr_220px_200px_180px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858688]" />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar estudiante..."
              className="w-full rounded-2xl bg-[#f5f3f2] py-3 pl-11 pr-4 text-sm outline-none"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
            className="rounded-2xl bg-[#f5f3f2] px-4 py-3 text-sm font-semibold text-[#5d5e60] outline-none"
          >
            <option value="all">Todos los cursos</option>

            {courseOptions.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl bg-[#f5f3f2] px-4 py-3 text-sm font-semibold text-[#5d5e60] outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="pending_payment">Pendiente pago</option>
            <option value="completed">Completados</option>
            <option value="cancelled">Cancelados</option>
          </select>

          <button
            type="button"
            onClick={() => setOnlyLowAttendance((current) => !current)}
            className={clsx(
              "rounded-2xl px-4 py-3 text-sm font-bold transition",
              onlyLowAttendance
                ? "bg-[#dd2817] text-white"
                : "bg-[#f5f3f2] text-[#5d5e60]"
            )}
          >
            Menor a 70%
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base min-w-[900px]">
            <thead className="bg-[#f5f3f2]/70">
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-[#5d5e60]">
                <th className="px-4 md:px-8 py-4">Estudiante</th>
                <th className="px-4 md:px-8 py-4">Curso</th>
                <th className="px-4 md:px-8 py-4">Estado</th>
                <th className="px-4 md:px-8 py-4">Asistencia</th>
                <th className="px-4 md:px-8 py-4">Sesiones</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 md:px-8 py-4 md:py-8 text-center text-sm text-[#5d5e60]">
                    Cargando estudiantes...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 md:px-8 py-4 md:py-8 text-center text-sm text-[#5d5e60]">
                    No hay estudiantes para mostrar.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={`${student.studentId}-${student.courseId}`}
                    onClick={() =>
                      navigate(
                        `/teacher/students/${student.studentId}?courseId=${student.courseId}`
                      )
                    }
                    className="cursor-pointer border-t border-[#e9e8e7] transition hover:bg-[#f5f3f2]/60"
                  >
                    <td className="px-4 md:px-8 py-5">
                      <div>
                        <p className="font-bold text-[#1b1c1b]">
                          {student.studentName}
                        </p>

                        <p className="text-sm text-[#858688]">
                          {student.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 md:px-8 py-5 text-sm font-semibold text-[#5d5e60]">
                      {student.courseTitle}
                    </td>

                    <td className="px-4 md:px-8 py-5">
                      <span
                        className={clsx(
                          "rounded-full px-3 py-1 text-[10px] font-extrabold uppercase",
                          student.status === "active"
                            ? "bg-[#dcfce7] text-[#15803d]"
                            : "bg-[#fee2e2] text-[#b91c1c]"
                        )}
                      >
                        {getStatusLabel(student.status)}
                      </span>
                    </td>

                    <td className="px-4 md:px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-[#e9e8e7]">
                          <div
                            className={clsx(
                              "h-full rounded-full",
                              student.attendancePercentage < 70
                                ? "bg-[#dc2626]"
                                : "bg-[#b70700]"
                            )}
                            style={{
                              width: `${student.attendancePercentage}%`,
                            }}
                          />
                        </div>

                        <span className="text-sm font-bold text-[#1b1c1b]">
                          {student.attendancePercentage}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 md:px-8 py-5 text-sm font-semibold text-[#5d5e60]">
                      {student.completedSessions} realizadas
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  danger = false,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  danger?: boolean;
}) {
  return (
    <article className="flex items-center justify-between rounded-2xl border border-[#e9e8e7] bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-[#5d5e60]">{title}</p>
        <p
          className={clsx(
            "mt-2 font-['Manrope',sans-serif] text-3xl font-extrabold",
            danger ? "text-[#dc2626]" : "text-[#1b1c1b]"
          )}
        >
          {value}
        </p>
      </div>

      <div
        className={clsx(
          "rounded-xl p-3",
          danger ? "bg-red-50 text-[#dc2626]" : "bg-red-50 text-[#dd2817]"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
    </article>
  );
}
