import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  UserX,
  AlertCircle,
} from "lucide-react";
import clsx from "clsx";

import { supabase } from "@/services/supabase";

type StudentProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  identification: string | null;
};

type Course = {
  id: string;
  title: string | null;
  level: string | null;
};

type Enrollment = {
  id: string;
  status: string | null;
  course: Course | null;
};

type Session = {
  id: string;
  title: string | null;
  starts_at: string;
};

type Attendance = {
  session_id: string;
  status: string | null;
  recorded_at: string | null;
};

function getAttendanceLabel(status: string | null) {
  if (status === "present") return "Presente";
  if (status === "absent") return "Ausente";
  if (status === "late") return "Tarde";
  if (status === "excused") return "Justificado";
  return "Sin registrar";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function TeacherStudentDetail() {
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const courseId = searchParams.get("courseId");

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudentDetail() {
      if (!studentId || !courseId) return;

      setIsLoading(true);

      try {
        const { data: studentData, error: studentError } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, identification")
          .eq("id", studentId)
          .maybeSingle();

        if (studentError) throw studentError;

        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from("enrollments")
          .select(`
            id,
            status,
            course:courses (
              id,
              title,
              level
            )
          `)
          .eq("student_id", studentId)
          .eq("course_id", courseId)
          .maybeSingle();

        if (enrollmentError) throw enrollmentError;

        const { data: sessionData, error: sessionError } = await supabase
          .from("course_sessions")
          .select("id, title, starts_at")
          .eq("course_id", courseId)
          .lte("starts_at", new Date().toISOString())
          .order("starts_at", { ascending: false });

        if (sessionError) throw sessionError;

        const sessionIds = (sessionData ?? []).map((session) => session.id);

        let attendanceData: Attendance[] = [];

        if (sessionIds.length > 0) {
          const { data, error } = await supabase
            .from("attendance")
            .select("session_id, status, recorded_at")
            .eq("student_id", studentId)
            .eq("course_id", courseId)
            .in("session_id", sessionIds);

          if (error) throw error;

          attendanceData = (data ?? []) as Attendance[];
        }

        setStudent(studentData as StudentProfile);
        setEnrollment(enrollmentData as unknown as Enrollment);
        setSessions((sessionData ?? []) as Session[]);
        setAttendance(attendanceData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadStudentDetail();
  }, [studentId, courseId]);

  const history = useMemo(() => {
    return sessions.map((session) => {
      const record = attendance.find((item) => item.session_id === session.id);

      return {
        session,
        status: record?.status ?? null,
        recordedAt: record?.recorded_at ?? null,
      };
    });
  }, [sessions, attendance]);

  const presentCount = history.filter((item) => item.status === "present").length;
  const lateCount = history.filter((item) => item.status === "late").length;
  const absentCount = history.filter((item) => item.status === "absent").length;
  const excusedCount = history.filter((item) => item.status === "excused").length;

  const attendedCount = presentCount + lateCount;

  const attendancePercentage =
    history.length > 0 ? Math.round((attendedCount / history.length) * 100) : 0;

  if (isLoading) {
    return (
      <main className="p-4 md:p-8 text-sm text-[#5d5e60]">
        Cargando historial del estudiante...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-4 md:space-y-8 p-4 md:p-8 font-['Inter',sans-serif]">
      <header>
        <button
          onClick={() => navigate("/teacher/students")}
          className="mb-4 flex items-center gap-2 text-sm font-bold text-[#5d5e60] hover:text-[#dd2817]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a estudiantes
        </button>

        <div className="rounded-3xl bg-red-50 p-4 md:p-8">
          <h1 className="font-['Manrope',sans-serif] text-4xl font-extrabold text-[#1b1c1b]">
            {student?.full_name ?? "Estudiante"}
          </h1>

          <p className="mt-2 text-sm font-semibold text-[#5d5e60]">
            {student?.email ?? "Sin correo"}
          </p>

          <p className="mt-4 text-base font-bold text-[#dd2817]">
            {enrollment?.course?.title ?? "Curso"} ·{" "}
            {enrollment?.course?.level ?? "Sin nivel"}
          </p>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-5">
        <StatCard title="Asistencia" value={`${attendancePercentage}%`} icon={CalendarDays} highlight />
        <StatCard title="Presentes" value={presentCount} icon={CheckCircle2} />
        <StatCard title="Tardías" value={lateCount} icon={Clock} />
        <StatCard title="Ausencias" value={absentCount} icon={UserX} danger />
        <StatCard title="Justificadas" value={excusedCount} icon={AlertCircle} />
      </section>

      <section className="rounded-3xl border border-[#e9e8e7] bg-white shadow-sm">
        <div className="border-b border-[#e9e8e7] p-4 md:p-8">
          <h2 className="font-['Manrope',sans-serif] text-2xl font-extrabold text-[#1b1c1b]">
            Historial de asistencia
          </h2>

          <p className="mt-1 text-sm text-[#5d5e60]">
            Registro de asistencia por sesión realizada.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base min-w-[800px]">
            <thead className="bg-[#f5f3f2]/70">
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-[#5d5e60]">
                <th className="px-4 md:px-8 py-4">Sesión</th>
                <th className="px-4 md:px-8 py-4">Fecha</th>
                <th className="px-4 md:px-8 py-4">Estado</th>
                <th className="px-4 md:px-8 py-4">Registrado</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 md:px-8 py-4 md:py-8 text-center text-sm text-[#5d5e60]">
                    Este curso todavía no tiene sesiones realizadas.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.session.id} className="border-t border-[#e9e8e7]">
                    <td className="px-4 md:px-8 py-5 font-bold text-[#1b1c1b]">
                      {item.session.title ?? "Sesión sin título"}
                    </td>

                    <td className="px-4 md:px-8 py-5 text-sm text-[#5d5e60]">
                      {formatDate(item.session.starts_at)}
                    </td>

                    <td className="px-4 md:px-8 py-5">
                      <span
                        className={clsx(
                          "rounded-full px-3 py-1 text-[10px] font-extrabold uppercase",
                          item.status === "present" &&
                            "bg-[#dcfce7] text-[#15803d]",
                          item.status === "late" &&
                            "bg-[#fef3c7] text-[#b45309]",
                          item.status === "absent" &&
                            "bg-[#fee2e2] text-[#b91c1c]",
                          item.status === "excused" &&
                            "bg-[#dbeafe] text-[#1d4ed8]",
                          !item.status && "bg-[#f5f3f2] text-[#858688]"
                        )}
                      >
                        {getAttendanceLabel(item.status)}
                      </span>
                    </td>

                    <td className="px-4 md:px-8 py-5 text-sm text-[#5d5e60]">
                      {item.recordedAt ? formatDate(item.recordedAt) : "Sin registro"}
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
  highlight = false,
  danger = false,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[#e9e8e7] bg-white p-5 shadow-sm">
      <div
        className={clsx(
          "mb-4 flex h-11 w-11 items-center justify-center rounded-xl",
          danger ? "bg-red-50 text-[#dc2626]" : "bg-red-50 text-[#dd2817]"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-xs font-bold uppercase text-[#5d5e60]">{title}</p>

      <p
        className={clsx(
          "mt-2 font-['Manrope',sans-serif] text-3xl font-extrabold",
          highlight ? "text-[#dd2817]" : danger ? "text-[#dc2626]" : "text-[#1b1c1b]"
        )}
      >
        {value}
      </p>
    </article>
  );
}
