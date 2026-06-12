import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FolderOpen } from "lucide-react"
import {
  ArrowLeft,
  ChevronRight,
  Search,
  Share2,
  UserCheck,
} from "lucide-react";

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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);

  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;

    async function loadCourseDetail() {
      try {
        const { data, error } = await supabase
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

        if (error) throw error;

        if (isMounted) {
          setCourse(data as unknown as CourseDetail);
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

  const activeEnrollments =
    course?.enrollments?.filter(
      (enrollment) => enrollment.status === "active"
    ) ?? [];

  const students = activeEnrollments.map((enrollment) => {
    const name = enrollment.student?.full_name ?? "Sin nombre";

    return {
      id: enrollment.student?.id ?? enrollment.id,
      initials: getInitials(name),
      name,
      email: enrollment.student?.email ?? "Sin correo",
      attendance: "N/A",
      grade: "N/A",
    };
  });

  const capacity = course?.max_capacity ?? 0;

  const progress =
    capacity > 0
      ? Math.min((activeEnrollments.length / capacity) * 100, 100)
      : 0;

  return (
    <main className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/teacher/courses")}
            className="flex items-center gap-2 text-[#5d5e60] hover:text-[#1b1c1b] mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Cursos
          </button>

          <h1 className="text-5xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b]">
            {course?.title ?? "Curso"}
          </h1>

          <p className="text-xl text-[#5d5e60] mt-2">
            {course?.level ?? "Sin nivel"} • {course?.location ?? "Sin ubicación"}
          </p>

          <p className="text-xs text-[#858688] mt-2">
            Curso ID: {courseId}
          </p>
        </div>

        <button className="flex items-center gap-3 rounded-xl bg-[#f5f3f2] px-6 py-4 font-bold text-[#1b1c1b]">
          <Share2 className="w-5 h-5" />
          Export Report
        </button>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-[2fr_320px] gap-6 mb-8">
        <div className="rounded-3xl border border-[#e9e8e7] bg-white p-8">
          <h2 className="text-2xl font-bold font-['Manrope',sans-serif] mb-8">
            Resumen de progreso del grupo
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="GENERAL"
              value={`${Math.round(progress)}%`}
              subtitle="Cupos ocupados"
              highlight
            />

            <StatCard
              title="ASISTENCIA"
              value="N/A"
              subtitle="No disponible"
            />

            <StatCard
              title="ALUMNOS"
              value={`${activeEnrollments.length}/${capacity}`}
              subtitle="Matriculados activos"
            />

            <StatCard
              title="PROMEDIO"
              value="N/A"
              subtitle="Sin calificaciones"
            />
          </div>
        </div>

        <div className="space-y-4">
          <ActionCard
            icon={<UserCheck className="w-6 h-6 text-[#dd2817]" />}
            title="Pasar Asistencia"
            subtitle="Registrar asistencia del curso"
            onClick={() => navigate(`/teacher/courses/${courseId}/attendance`)}
          />

          <ActionCard
            icon={<FolderOpen className="w-6 h-6 text-[#dd2817]" />}
            title="Materiales"
            subtitle="Documentos, videos y recetas"
            onClick={() => navigate(`/teacher/courses/${courseId}/materials`)}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_1.4fr] gap-6">
        <div className="rounded-3xl border border-[#e9e8e7] bg-white p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-['Manrope',sans-serif]">
              Sesiones del curso
            </h2>

            <span className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-[#dd2817]">
              Información general
            </span>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-[#dd2817] text-sm font-bold uppercase">
                INICIO
              </p>

              <h3 className="text-2xl font-bold text-[#1b1c1b]">
                {course?.start_date ?? "Sin fecha de inicio"}
              </h3>

              <p className="text-[#5d5e60]">
                {course?.location ?? "Sin ubicación"}
              </p>
            </div>

            <div>
              <p className="text-[#858688] text-sm font-bold uppercase">
                FINALIZACIÓN
              </p>

              <h3 className="text-2xl font-bold text-[#858688]">
                {course?.end_date ?? "Sin fecha final"}
              </h3>

              <p className="text-[#858688]">
                Estado: {course?.status ?? "Sin estado"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e9e8e7] bg-white overflow-hidden">
          <div className="p-8 border-b border-[#e9e8e7] flex justify-between items-center">
            <h2 className="text-2xl font-bold font-['Manrope',sans-serif]">
              Lista de Alumnos
            </h2>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#858688]" />

              <input
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 rounded-xl border border-[#e9e8e7]"
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-[#f5f3f2]">
              <tr>
                <th className="text-left px-8 py-4 text-xs">ALUMNO</th>
                <th className="text-left px-8 py-4 text-xs">ASISTENCIA</th>
                <th className="text-left px-8 py-4 text-xs">NOTA AVG</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-8 py-8 text-center text-sm text-[#858688]"
                  >
                    No hay alumnos matriculados en este curso.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t border-[#e9e8e7]"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-red-100 text-red-600">
                          {student.initials}
                        </div>

                        <div>
                          <div className="font-semibold">
                            {student.name}
                          </div>

                          <div className="text-sm text-[#858688]">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5 font-bold">
                      {student.attendance}
                    </td>

                    <td className="px-8 py-5 font-bold">
                      {student.grade}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <button className="w-full py-5 text-[#dd2817] font-bold">
            Ver todos los alumnos ({students.length})
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
        className={`text-4xl font-extrabold font-['Manrope',sans-serif] mt-2 ${
          highlight ? "text-[#dd2817]" : "text-[#1b1c1b]"
        }`}
      >
        {value}
      </h3>

      <p className="text-sm text-[#5d5e60] mt-2">{subtitle}</p>
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
      className="w-full rounded-3xl border border-[#e9e8e7] bg-white p-6 flex items-center justify-between hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-xl bg-[#f5f3f2] flex items-center justify-center">
          {icon}
        </div>

        <div className="text-left">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-[#5d5e60]">{subtitle}</p>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-[#858688]" />
    </button>
  );
}