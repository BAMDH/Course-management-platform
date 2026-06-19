import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Lock,
  Save,
  XCircle,
} from "lucide-react";
import clsx from "clsx";

import { useAuth } from "@/providers/auth/useAuth";
import { supabase } from "@/services/supabase";

type AttendanceStatus = "present" | "late" | "absent" | "excused";

type TeacherCourse = {
  id: string;
  title: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  contentUnlocked: boolean;
  status: AttendanceStatus | null;
};

type StudentProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type EnrollmentRow = {
  id: string;
  student: StudentProfile | null;
};

type SessionRow = {
  id: string;
  title: string | null;
  starts_at: string;
  ends_at: string;
};

type AttendanceRow = {
  student_id: string;
  status: AttendanceStatus;
};

type CourseTeacherRow = {
  course: {
    id: string;
    title: string | null;
  } | null;
};

export default function TeacherAttendance() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseId ?? "");

  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ?? null;

  const isFutureSession = selectedSession
    ? new Date(selectedSession.starts_at) > new Date()
    : false;

  useEffect(() => {
    const teacherId = user?.id ?? "";

    if (teacherId.length === 0) return;

    let isMounted = true;

    async function loadTeacherCourses() {
      try {
        const { data, error } = await supabase
          .from("course_teachers")
          .select(`
            course:courses (
              id,
              title
            )
          `)
          .eq("teacher_id", teacherId);

        if (error) throw error;

        const rows = (data ?? []) as unknown as CourseTeacherRow[];

        const formattedCourses = rows
          .map((row) => row.course)
          .filter((course): course is NonNullable<CourseTeacherRow["course"]> =>
            Boolean(course)
          )
          .map((course) => ({
            id: course.id,
            title: course.title ?? "Curso sin título",
          }));

        if (isMounted) {
          setCourses(formattedCourses);

          if (!courseId && formattedCourses.length > 0) {
            setSelectedCourseId(formattedCourses[0].id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadTeacherCourses();

    return () => {
      isMounted = false;
    };
  }, [user?.id, courseId]);

  useEffect(() => {
    if (!selectedCourseId) return;

    let isMounted = true;

    async function loadAttendanceData() {
      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from("course_sessions")
          .select("id, title, starts_at, ends_at")
          .eq("course_id", selectedCourseId)
          .order("starts_at", { ascending: true });

        if (sessionError) throw sessionError;

        const sessionRows = (sessionData ?? []) as unknown as SessionRow[];

        const defaultSession =
          sessionRows.find(
            (session) => new Date(session.starts_at) <= new Date()
          ) ??
          sessionRows[0] ??
          null;

        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from("enrollments")
          .select(`
            id,
            student:profiles (
              id,
              full_name,
              email
            )
          `)
          .eq("course_id", selectedCourseId)
          .eq("status", "active");

        if (enrollmentError) throw enrollmentError;

        let attendanceRows: AttendanceRow[] = [];

        if (defaultSession) {
          const { data: attendanceData, error: attendanceError } =
            await supabase
              .from("attendance")
              .select("student_id, status")
              .eq("course_id", selectedCourseId)
              .eq("session_id", defaultSession.id);

          if (attendanceError) throw attendanceError;

          attendanceRows = (attendanceData ?? []) as unknown as AttendanceRow[];
        }

        const enrollmentRows =
          (enrollmentData ?? []) as unknown as EnrollmentRow[];

        const formattedStudents = enrollmentRows
          .filter((row) => row.student)
          .map((row) => {
            const student = row.student as StudentProfile;

            const savedAttendance = attendanceRows.find(
              (attendance) => attendance.student_id === student.id
            );

            return {
              id: student.id,
              name: student.full_name ?? "Sin nombre",
              email: student.email ?? "Sin correo",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`,
              contentUnlocked: true,
              status: savedAttendance?.status ?? null,
            };
          });

        if (isMounted) {
          setSessions(sessionRows);
          setSelectedSessionId(defaultSession?.id ?? "");
          setStudents(formattedStudents);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadAttendanceData();

    return () => {
      isMounted = false;
    };
  }, [selectedCourseId]);

  useEffect(() => {
    if (!selectedCourseId || !selectedSessionId) return;

    let isMounted = true;

    async function loadSelectedSessionAttendance() {
      try {
        const { data, error } = await supabase
          .from("attendance")
          .select("student_id, status")
          .eq("course_id", selectedCourseId)
          .eq("session_id", selectedSessionId);

        if (error) throw error;

        const attendanceRows = (data ?? []) as unknown as AttendanceRow[];

        if (isMounted) {
          setStudents((currentStudents) =>
            currentStudents.map((student) => {
              const savedAttendance = attendanceRows.find(
                (attendance) => attendance.student_id === student.id
              );

              return {
                ...student,
                status: savedAttendance?.status ?? null,
              };
            })
          );
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadSelectedSessionAttendance();

    return () => {
      isMounted = false;
    };
  }, [selectedCourseId, selectedSessionId]);

  const totals = useMemo(() => {
    return {
      present: students.filter((student) => student.status === "present").length,
      late: students.filter((student) => student.status === "late").length,
      absent: students.filter((student) => student.status === "absent").length,
      excused: students.filter((student) => student.status === "excused").length,
      total: students.length,
    };
  }, [students]);

  const attendancePercent =
    totals.total > 0
      ? Math.round(((totals.present + totals.late) / totals.total) * 100)
      : 0;

  function updateStatus(studentId: string, status: AttendanceStatus) {
    if (isFutureSession) return;

    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  }

  async function saveAttendance() {
    if (!selectedCourseId || !selectedSession || !user?.id) return;

    if (isFutureSession) {
      alert("No se puede pasar asistencia de una sesión futura.");
      return;
    }

    const records = students
      .filter((student) => student.status)
      .map((student) => ({
        session_id: selectedSession.id,
        course_id: selectedCourseId,
        student_id: student.id,
        status: student.status as AttendanceStatus,
        notes: null,
        recorded_by: user.id,
        recorded_at: new Date().toISOString(),
      }));

    if (records.length === 0) {
      alert("Debe marcar la asistencia de al menos un estudiante.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.from("attendance").upsert(records, {
        onConflict: "session_id,student_id",
      });

      if (error) throw error;

      alert("Asistencia guardada correctamente.");
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la asistencia.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      <section className="mb-8 rounded-3xl border border-[#e9e8e7] bg-white p-4 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-[1fr_280px_280px]">
          <div>
            <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
              Registro de Asistencia
            </h1>

            <p className="mt-2 max-w-md text-base leading-6 text-[#5d5e60]">
              Seleccione el curso, la sesión y registre la asistencia de sus
              alumnos.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase text-[#5d5e60]">
                Curso
              </p>

              <select
                value={selectedCourseId}
                onChange={(event) => {
                  setSelectedCourseId(event.target.value);
                  setSelectedSessionId("");
                  setStudents([]);
                  setSessions([]);
                }}
                className="w-full rounded-xl border border-[#e4e2e1] bg-[#f5f3f2] px-4 py-3 font-bold text-[#1b1c1b]"
              >
                {courses.length === 0 ? (
                  <option value="">Sin cursos asignados</option>
                ) : (
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <InfoBox label="Fecha" icon={<CalendarDays className="h-4 w-4" />}>
              {selectedSession
                ? new Date(selectedSession.starts_at).toLocaleDateString(
                    "es-CR"
                  )
                : "Sin sesión"}
            </InfoBox>

            <InfoBox label="Horario" icon={<Clock className="h-4 w-4" />}>
              {selectedSession
                ? `${new Date(selectedSession.starts_at).toLocaleTimeString(
                    "es-CR",
                    { hour: "2-digit", minute: "2-digit" }
                  )} - ${new Date(selectedSession.ends_at).toLocaleTimeString(
                    "es-CR",
                    { hour: "2-digit", minute: "2-digit" }
                  )}`
                : "Sin horario"}
            </InfoBox>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase text-[#5d5e60]">
              Módulo & Sesión
            </p>

            <select
              value={selectedSessionId}
              onChange={(event) => setSelectedSessionId(event.target.value)}
              className="w-full rounded-xl border border-[#e4e2e1] bg-[#f5f3f2] px-5 py-4 font-bold text-[#1b1c1b]"
            >
              {sessions.length === 0 ? (
                <option value="">Sin sesiones registradas</option>
              ) : (
                sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.title ?? "Sesión"} -{" "}
                    {new Date(session.starts_at).toLocaleDateString("es-CR")}
                  </option>
                ))
              )}
            </select>

            {isFutureSession && (
              <p className="mt-2 text-sm font-bold text-[#dd2817]">
                Esta sesión aún no se ha realizado. No se puede pasar
                asistencia.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mb-10 max-w-3xl rounded-3xl border border-[#e9e8e7] bg-white p-4 md:p-8 shadow-sm">
        <p className="mb-2 text-base text-[#5d5e60]">
          Estado General del Grupo
        </p>

        <div className="flex flex-col gap-4 md:gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-5 flex items-end gap-2">
              <span className="font-['Manrope',sans-serif] text-5xl font-extrabold text-[#1b1c1b]">
                {totals.present}
              </span>

              <span className="pb-1 text-2xl text-[#5d5e60]">
                / {totals.total} Presentes
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-2 w-52 overflow-hidden rounded-full bg-[#e9e8e7]">
                <div
                  className="h-full rounded-full bg-[#dd2817]"
                  style={{ width: `${attendancePercent}%` }}
                />
              </div>

              <span className="text-sm font-bold text-[#dd2817]">
                {attendancePercent}% Asistencia
              </span>
            </div>
          </div>

          <div className="flex gap-4 md:gap-8 border-l border-[#e9e8e7] pl-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase text-[#5d5e60]">
                Tardías
              </p>

              <p className="text-2xl font-extrabold text-[#f59e0b]">
                {totals.late}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm font-bold uppercase text-[#5d5e60]">
                Faltas
              </p>

              <p className="text-2xl font-extrabold text-[#dd2817]">
                {totals.absent}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-['Manrope',sans-serif] text-2xl font-extrabold text-[#1b1c1b]">
            Listado de Alumnos
          </h2>
        </div>

        <div className="space-y-4">
          {students.length === 0 ? (
            <p className="rounded-2xl border border-[#e9e8e7] bg-white p-5 text-sm text-[#5d5e60]">
              No hay alumnos activos matriculados en este curso.
            </p>
          ) : (
            students.map((student) => (
              <article
                key={student.id}
                className="flex flex-col gap-6 rounded-2xl border border-[#e9e8e7] bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-14 w-14 rounded-full border-2 border-[#e9e8e7] bg-[#f5f3f2]"
                    />

                    <span
                      className={clsx(
                        "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-white",
                        student.status === "present" && "bg-[#16a34a]",
                        student.status === "late" && "bg-[#f59e0b]",
                        student.status === "absent" && "bg-[#dd2817]",
                        student.status === "excused" && "bg-[#0073d1]",
                        !student.status && "bg-[#e4e4e7]"
                      )}
                    >
                      {student.status === "present" && (
                        <CheckCircle2 className="h-3 w-3" />
                      )}

                      {student.status === "late" && (
                        <Clock className="h-3 w-3" />
                      )}

                      {student.status === "absent" && (
                        <XCircle className="h-3 w-3" />
                      )}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-[#1b1c1b]">
                      {student.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-md bg-[#f5f3f2] px-3 py-1 text-xs font-medium text-[#5d5e60]">
                        {student.email}
                      </span>

                      <span
                        className={clsx(
                          "inline-flex items-center gap-1 rounded-md px-3 py-1 text-[10px] font-extrabold uppercase",
                          student.contentUnlocked
                            ? "bg-[#dcfce7] text-[#15803d]"
                            : "bg-[#e4e4e7] text-[#858688]"
                        )}
                      >
                        <Lock className="h-3 w-3" />
                        {student.contentUnlocked
                          ? "Contenido desbloqueado"
                          : "Contenido bloqueado"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 lg:w-[560px]">
                  <AttendanceButton
                    active={student.status === "present"}
                    variant="present"
                    disabled={isFutureSession}
                    onClick={() => updateStatus(student.id, "present")}
                  >
                    Presente
                  </AttendanceButton>

                  <AttendanceButton
                    active={student.status === "late"}
                    variant="late"
                    disabled={isFutureSession}
                    onClick={() => updateStatus(student.id, "late")}
                  >
                    Tardía
                  </AttendanceButton>

                  <AttendanceButton
                    active={student.status === "absent"}
                    variant="absent"
                    disabled={isFutureSession}
                    onClick={() => updateStatus(student.id, "absent")}
                  >
                    Ausente
                  </AttendanceButton>

                  <AttendanceButton
                    active={student.status === "excused"}
                    variant="excused"
                    disabled={isFutureSession}
                    onClick={() => updateStatus(student.id, "excused")}
                  >
                    Justificada
                  </AttendanceButton>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <div className="mt-8 flex justify-end">
        <button
          disabled={!selectedSession || saving || isFutureSession}
          onClick={saveAttendance}
          className="flex items-center gap-3 rounded-2xl bg-[#dd2817] px-10 py-5 text-lg font-extrabold text-white shadow-lg shadow-red-500/25 hover:bg-[#b70700] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-6 w-6" />
          {saving ? "Guardando..." : "Finalizar Pase de Lista"}
        </button>
      </div>
    </main>
  );
}

function InfoBox({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase text-[#5d5e60]">
        {label}
      </p>

      <div className="inline-flex items-center gap-2 rounded-lg border border-[#e4e2e1] bg-[#f5f3f2] px-4 py-3 font-medium text-[#1b1c1b]">
        {icon}
        {children}
      </div>
    </div>
  );
}

function AttendanceButton({
  active,
  variant,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  variant: AttendanceStatus;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const activeClasses: Record<AttendanceStatus, string> = {
    present: "bg-[#dd2817] text-white border-[#dd2817]",
    late: "bg-[#f59e0b] text-white border-[#f59e0b]",
    absent: "bg-[#1b1c1b] text-white border-[#1b1c1b]",
    excused: "bg-[#0073d1] text-white border-[#0073d1]",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "rounded-xl border px-4 py-4 text-sm font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        active
          ? activeClasses[variant]
          : "border-[#e4e2e1] bg-white text-[#5d5e60] hover:bg-[#f5f3f2]"
      )}
    >
      {children}
    </button>
  );
}
