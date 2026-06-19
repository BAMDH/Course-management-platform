import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  FolderOpen,
  Search,
  Share2,
  UserCheck,
} from "lucide-react";
import clsx from "clsx";
import * as XLSX from "xlsx";

import { supabase } from "@/services/supabase";

type StudentProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type Enrollment = {
  id: string;
  status: string | null;
  student: StudentProfile | null;
};

type CourseDetail = {
  id: string;
  title: string | null;
  level: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  max_capacity: number | null;
  status: string | null;
  enrollments: Enrollment[] | null;
};

type CourseSession = {
  id: string;
  title: string | null;
  starts_at: string;
  ends_at: string;
  session_order: number | null;
};

type AttendanceRow = {
  student_id: string;
  session_id: string;
  status: string | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string | null) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;

    async function loadCourseDetail() {
      try {
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select(`
            id,
            title,
            level,
            location,
            start_date,
            end_date,
            max_capacity,
            status,
            enrollments (
              id,
              status,
              student:profiles (
                id,
                full_name,
                email
              )
            )
          `)
          .eq("id", courseId)
          .single();

        if (courseError) throw courseError;

        const { data: sessionData, error: sessionError } = await supabase
          .from("course_sessions")
          .select("id, title, starts_at, ends_at, session_order")
          .eq("course_id", courseId)
          .order("starts_at", { ascending: true });

        if (sessionError) throw sessionError;

        const completedSessionIds =
          sessionData
            ?.filter((session) => new Date(session.starts_at) <= new Date())
            .map((session) => session.id) ?? [];

        let attendanceData: AttendanceRow[] = [];

        if (completedSessionIds.length > 0) {
          const { data, error } = await supabase
            .from("attendance")
            .select("student_id, session_id, status")
            .eq("course_id", courseId)
            .in("session_id", completedSessionIds);

          if (error) throw error;

          attendanceData = (data ?? []) as AttendanceRow[];
        }

        if (isMounted) {
          setCourse(courseData as unknown as CourseDetail);
          setSessions((sessionData ?? []) as CourseSession[]);
          setAttendanceRows(attendanceData);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadCourseDetail();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const completedSessions = useMemo(
    () =>
      sessions.filter((session) => new Date(session.starts_at) <= new Date()),
    [sessions]
  );

  const enrollments = course?.enrollments ?? [];

  const activeEnrollments = enrollments.filter(
    (enrollment) => enrollment.status === "active"
  );

  const students = enrollments.map((enrollment) => {
    const name = enrollment.student?.full_name ?? "Sin nombre";
    const studentId = enrollment.student?.id ?? enrollment.id;

    const studentAttendanceRows = attendanceRows.filter(
      (attendance) => attendance.student_id === studentId
    );

    const attendedSessions = studentAttendanceRows.filter(
      (attendance) =>
        attendance.status === "present" || attendance.status === "late"
    ).length;

    const attendancePercentage =
      completedSessions.length > 0
        ? Math.round((attendedSessions / completedSessions.length) * 100)
        : 0;

    return {
      id: studentId,
      initials: getInitials(name),
      name,
      email: enrollment.student?.email ?? "Sin correo",
      status: enrollment.status,
      attendancePercentage,
    };
  });

  const filteredStudents = students.filter((student) => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return true;

    return (
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
  });

  const capacity = course?.max_capacity ?? 0;

  const occupiedCapacity =
    capacity > 0
      ? Math.min((activeEnrollments.length / capacity) * 100, 100)
      : 0;

  const generalAttendance =
    students.length > 0
      ? Math.round(
          students.reduce(
            (total, student) => total + student.attendancePercentage,
            0
          ) / students.length
        )
      : 0;

  function handleExportReport() {
    const rows = filteredStudents.map((student) => ({
      Alumno: student.name,
      Correo: student.email,
      Estado: student.status === "active" ? "Activo" : "Inactivo",
      Asistencia: `${student.attendancePercentage}%`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 35 },
      { wch: 18 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    XLSX.writeFile(
      workbook,
      `reporte-${course?.title ?? "curso"}.xlsx`
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8 font-['Inter',sans-serif]">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate("/teacher/courses")}
            className="mb-3 flex items-center gap-2 text-[#5d5e60] hover:text-[#1b1c1b]"
          >
            <ArrowLeft className="h-4 w-4" />
            Cursos
          </button>

          <h1 className="font-['Manrope',sans-serif] text-5xl font-extrabold text-[#1b1c1b]">
            {course?.title ?? "Curso"}
          </h1>

          <p className="mt-2 text-xl text-[#5d5e60]">
            {course?.level ?? "Sin nivel"} •{" "}
            {course?.location ?? "Sin ubicación"}
          </p>

          <p className="mt-2 text-xs text-[#858688]">Curso ID: {courseId}</p>
        </div>

        <button
          type="button"
          onClick={handleExportReport}
          className="flex items-center gap-3 rounded-xl bg-[#f5f3f2] px-6 py-4 font-bold text-[#1b1c1b] hover:bg-[#e9e8e7]"
        >
          <Share2 className="h-5 w-5" />
          Exportar reporte
        </button>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_320px]">
        <div className="rounded-3xl border border-[#e9e8e7] bg-white p-4 md:p-8">
          <h2 className="mb-8 font-['Manrope',sans-serif] text-2xl font-bold">
            Resumen de progreso del grupo
          </h2>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              title="GENERAL"
              value={`${Math.round(occupiedCapacity)}%`}
              subtitle="Cupos ocupados"
              highlight
            />

            <StatCard
              title="ASISTENCIA"
              value={`${generalAttendance}%`}
              subtitle="Promedio del grupo"
            />

            <StatCard
              title="ALUMNOS"
              value={`${activeEnrollments.length}/${capacity}`}
              subtitle="Matriculados activos"
            />

            <StatCard
              title="SESIONES"
              value={`${completedSessions.length}/${sessions.length}`}
              subtitle="Sesiones realizadas"
            />
          </div>
        </div>

        <div className="space-y-4">
          <ActionCard
            icon={<UserCheck className="h-6 w-6 text-[#dd2817]" />}
            title="Pasar Asistencia"
            subtitle="Registrar asistencia del curso"
            onClick={() => navigate(`/teacher/courses/${courseId}/attendance`)}
          />

          <ActionCard
            icon={<FolderOpen className="h-6 w-6 text-[#dd2817]" />}
            title="Materiales"
            subtitle="Documentos, videos y recetas"
            onClick={() => navigate(`/teacher/courses/${courseId}/materials`)}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-[#e9e8e7] bg-white p-4 md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-['Manrope',sans-serif] text-2xl font-bold">
              Sesiones del curso
            </h2>

            <span className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-[#dd2817]">
              Información general
            </span>
          </div>

          <div className="space-y-4 md:space-y-8">
            <div>
              <p className="text-sm font-bold uppercase text-[#dd2817]">
                INICIO
              </p>

              <h3 className="text-2xl font-bold text-[#1b1c1b]">
                {formatDate(course?.start_date ?? null)}
              </h3>

              <p className="text-[#5d5e60]">
                {course?.location ?? "Sin ubicación"}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold uppercase text-[#858688]">
                FINALIZACIÓN
              </p>

              <h3 className="text-2xl font-bold text-[#858688]">
                {formatDate(course?.end_date ?? null)}
              </h3>

              <p className="text-[#858688]">
                Estado: {course?.status ?? "Sin estado"}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-[#e9e8e7] pt-8 space-y-4">
            <h3 className="font-['Manrope',sans-serif] text-lg font-bold text-[#1b1c1b] mb-4">
              Cronograma de Clases
            </h3>
            {sessions.length === 0 ? (
              <p className="text-sm text-[#858688]">No hay sesiones registradas.</p>
            ) : (
              sessions.map((session, i) => (
                <div key={session.id} className="flex flex-col gap-1 border-b border-[#f5f3f2] pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1b1c1b]">
                      {session.title || `Sesión ${session.session_order ?? i + 1}`}
                    </span>
                    <span className="text-xs font-semibold text-[#858688]">
                      {formatDate(session.starts_at)}
                    </span>
                  </div>
                  <div className="text-xs text-[#5d5e60]">
                    {new Date(session.starts_at).toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", hour12: true })} - {new Date(session.ends_at).toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", hour12: true })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#e9e8e7] bg-white">
          <div className="flex items-center justify-between border-b border-[#e9e8e7] p-4 md:p-8">
            <h2 className="font-['Manrope',sans-serif] text-2xl font-bold">
              Lista de Alumnos
            </h2>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#858688]" />

              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar alumno o correo..."
                className="rounded-xl border border-[#e9e8e7] py-2 pl-10 pr-4 outline-none focus:border-[#dd2817]"
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-[#f5f3f2]">
              <tr>
                <th className="px-4 md:px-8 py-4 text-left text-xs">ALUMNO</th>
                <th className="px-4 md:px-8 py-4 text-left text-xs">ESTADO</th>
                <th className="px-4 md:px-8 py-4 text-left text-xs">ASISTENCIA</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 md:px-8 py-4 md:py-8 text-center text-sm text-[#858688]"
                  >
                    No hay alumnos matriculados en este curso.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t border-[#e9e8e7]">
                    <td className="px-4 md:px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                          {student.initials}
                        </div>

                        <div>
                          <div className="font-semibold">{student.name}</div>

                          <div className="text-sm text-[#858688]">
                            {student.email}
                          </div>
                        </div>
                      </div>
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
                        {student.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-4 md:px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-[#e9e8e7]">
                          <div
                            className="h-full rounded-full bg-[#b70700]"
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
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <button
            type="button"
            onClick={() => navigate("/teacher/students")}
            className="w-full py-5 font-bold text-[#dd2817]"
          >
            Ver todos los alumnos ({filteredStudents.length})
          </button>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  highlight = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[#f5f3f2] p-5">
      <p className="text-xs font-bold tracking-wider text-[#5d5e60]">
        {title}
      </p>

      <h3
        className={`mt-2 font-['Manrope',sans-serif] text-4xl font-extrabold ${
          highlight ? "text-[#dd2817]" : "text-[#1b1c1b]"
        }`}
      >
        {value}
      </h3>

      <p className="mt-2 text-sm text-[#5d5e60]">{subtitle}</p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-3xl border border-[#e9e8e7] bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5f3f2]">
          {icon}
        </div>

        <div className="text-left">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-[#5d5e60]">{subtitle}</p>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-[#858688]" />
    </button>
  );
}
