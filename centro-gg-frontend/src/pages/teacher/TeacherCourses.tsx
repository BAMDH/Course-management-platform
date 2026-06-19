import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, FolderOpen, User, Users } from "lucide-react";
import clsx from "clsx";

import { useAuth } from "@/providers/auth/useAuth";
import { supabase } from "@/services/supabase";
import { getTeacherDashboardData } from "@/services/teacherDashboardService";
import type { TeacherDashboardData } from "@/services/teacherDashboardService";

type CourseProgress = {
  totalSessions: number;
  completedSessions: number;
  progress: number;
};

export default function TeacherCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] =
    useState<TeacherDashboardData | null>(null);

  const [courseProgressById, setCourseProgressById] = useState<
    Record<string, CourseProgress>
  >({});

  useEffect(() => {
    const teacherId = user?.id ?? "";

    if (teacherId.length === 0) return;

    let isMounted = true;

    async function loadCourses() {
      try {
        const data = await getTeacherDashboardData(teacherId);

        if (isMounted) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadCourses();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    async function loadCourseProgress() {
      const courses = dashboardData?.courses ?? [];

      if (courses.length === 0) return;

      const courseIds = courses.map((course) => course.id);

      const { data, error } = await supabase
        .from("course_sessions")
        .select("id, course_id, starts_at")
        .in("course_id", courseIds);

      if (error) {
        console.error(error);
        return;
      }

      const now = new Date();

      const progressMap: Record<string, CourseProgress> = {};

      courseIds.forEach((courseId) => {
        const sessions = data?.filter((session) => session.course_id === courseId) ?? [];

        const totalSessions = sessions.length;

        const completedSessions = sessions.filter(
          (session) => new Date(session.starts_at) <= now
        ).length;

        const progress =
          totalSessions === 0
            ? 0
            : Math.round((completedSessions / totalSessions) * 100);

        progressMap[courseId] = {
          totalSessions,
          completedSessions,
          progress,
        };
      });

      setCourseProgressById(progressMap);
    }

    void loadCourseProgress();
  }, [dashboardData?.courses]);

  const courses = dashboardData?.courses ?? [];

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8 font-['Inter',sans-serif]">
      <header className="mb-10">
        <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
          Mis Cursos Asignados
        </h1>

        <p className="mt-2 text-base text-[#5d5e60]">
          Gestiona tus clases de gastronomía y el progreso de tus alumnos.
        </p>
      </header>

      <section className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {courses.length === 0 ? (
          <p className="text-sm text-[#5d5e60]">No tiene cursos asignados.</p>
        ) : (
          courses.map((course) => {
            const courseProgress = courseProgressById[course.id];

            const progressNumber = courseProgress?.progress ?? 0;

            const completedSessions = courseProgress?.completedSessions ?? 0;
            const totalSessions = courseProgress?.totalSessions ?? 0;

            const disabled = totalSessions === 0 || progressNumber === 0;

            return (
              <article
                key={course.id}
                onClick={() => navigate(`/teacher/courses/${course.id}`)}
                className="cursor-pointer overflow-hidden rounded-3xl border border-[#e9e8e7] bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  <div className="absolute bottom-5 left-6">
                    <span
                      className={clsx(
                        "rounded px-3 py-1 text-xs font-extrabold uppercase tracking-wide",
                        disabled
                          ? "bg-white/80 text-[#5d5e60]"
                          : "bg-[#b70700] text-white"
                      )}
                    >
                      {disabled ? "PRÓXIMAMENTE" : "EN CURSO"}
                    </span>

                    <h2 className="mt-3 font-['Manrope',sans-serif] text-2xl font-extrabold text-white">
                      {course.title}
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-7 grid grid-cols-2 gap-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f3f2]">
                        <Users className="h-5 w-5 text-[#dd2817]" />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase text-[#5d5e60]">
                          Nivel
                        </p>

                        <p className="text-sm font-extrabold text-[#1b1c1b]">
                          {course.level}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f3f2]">
                        <User className="h-5 w-5 text-[#dd2817]" />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase text-[#5d5e60]">
                          Alumnos
                        </p>

                        <p className="text-sm font-extrabold text-[#1b1c1b]">
                          {course.students.replace(" activos", "")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#5d5e60]">
                        Completado
                      </span>

                      <span
                        className={clsx(
                          "text-sm font-extrabold",
                          disabled ? "text-[#5d5e60]" : "text-[#b70700]"
                        )}
                      >
                        {progressNumber}%
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#e9e8e7]">
                      <div
                        className={clsx(
                          "h-full rounded-full",
                          disabled ? "bg-[#e4e4e7]" : "bg-[#b70700]"
                        )}
                        style={{ width: `${progressNumber}%` }}
                      />
                    </div>

                    <p className="mt-2 text-xs font-semibold text-[#5d5e60]">
                      {completedSessions} de {totalSessions} sesiones realizadas
                    </p>
                  </div>

                  <button
                    disabled={disabled}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/teacher/courses/${course.id}/materials`);
                    }}
                    className={clsx(
                      "mb-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-colors",
                      disabled
                        ? "cursor-not-allowed bg-[#f5f3f2] text-[#858688]"
                        : "bg-[#f5f3f2] text-[#1b1c1b] hover:bg-[#e9e8e7]"
                    )}
                  >
                    <FolderOpen className="h-5 w-5" />
                    Ver Materiales
                  </button>

                  <button
                    disabled={disabled}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/teacher/courses/${course.id}/attendance`);
                    }}
                    className={clsx(
                      "mb-3 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-extrabold transition-colors",
                      disabled
                        ? "cursor-not-allowed border-[#e9e8e7] text-[#dd2817]/40"
                        : "border-[#e9e8e7] text-[#b70700] hover:bg-[#fef2f2]"
                    )}
                  >
                    <ClipboardList className="h-4 w-4" />
                    Pasar Lista
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
