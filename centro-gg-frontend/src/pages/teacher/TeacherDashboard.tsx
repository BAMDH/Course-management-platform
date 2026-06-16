import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Download,
  Filter,
  Search,
  Star,
  Users,
  Utensils,
} from "lucide-react";

import { useAuth } from "@/providers/auth/useAuth";
import {
  getTeacherDashboardData,
  type TeacherDashboardData,
} from "@/services/teacherDashboardService";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState<TeacherDashboardData | null>(null);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("all");

  useEffect(() => {
    const teacherId = user?.id ?? "";

    if (teacherId.length === 0) return;

    let isMounted = true;

    async function loadDashboard() {
      try {
        const data = await getTeacherDashboardData(teacherId);

        if (isMounted) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const stats = [
    {
      label: "Estudiantes\nTotales",
      value: String(dashboardData?.stats.totalStudents ?? 0),
      icon: Users,
      valueClass: "text-[#1b1c1b]",
      iconBg: "bg-[#fef2f2]",
      iconColor: "text-[#dd2817]",
    },
    {
      label: "Cursos Activos",
      value: String(dashboardData?.stats.activeCourses ?? 0),
      icon: Utensils,
      valueClass: "text-[#1b1c1b]",
      iconBg: "bg-[#fef2f2]",
      iconColor: "text-[#dd2817]",
    },
  ];

  const courses = dashboardData?.courses ?? [];
  const events = dashboardData?.events ?? [];
  const students = dashboardData?.students ?? [];
  const [searchTerm, setSearchTerm] = useState("");

  const courseFilterOptions = Array.from(
    new Set(students.map((student) => student.course))
  );

  const searchResults =
    searchTerm.trim().length === 0
      ? []
      : [
          ...courses
            .filter((course) =>
              course.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((course) => ({
              id: course.id,
              title: course.title,
              subtitle: "Curso",
              type: "course" as const,
            })),
          ...students
            .filter(
              (student) =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.course.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((student) => ({
              id: student.id,
              title: student.name,
              subtitle: student.course,
              type: "student" as const,
            })),
        ];

  const filteredStudents =
    selectedCourseFilter === "all"
      ? students
      : students.filter((student) => student.course === selectedCourseFilter);

  function getAttendancePercentage(student: (typeof students)[number]) {
    return Number(student.progress ?? 0);
  }

  function handleExportExcel() {
    const rows = filteredStudents.map((student) => ({
      Estudiante: student.name,
      Curso: student.course,
      Estado: student.status,
      Asistencia: `${getAttendancePercentage(student)}%`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 28 },
      { wch: 28 },
      { wch: 16 },
      { wch: 14 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencia");

    XLSX.writeFile(workbook, "asistencia-estudiantes.xlsx");
  }

  if (!user) {
    return <main className="p-8">Debe iniciar sesión para ver el dashboard.</main>;
  }

  return (
    <main className="mx-auto max-w-7xl space-y-10 bg-white p-8 font-['Inter',sans-serif]">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
            Gestión Académica
          </h1>

          <p className="mt-1 text-base leading-6 text-[#5d5e60]">
            Bienvenido de nuevo. Aquí está el resumen de sus cursos.
          </p>
        </div>

        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#858688]" />

          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar alumno o curso..."
            className="w-full rounded-xl border border-[#e9e8e7] py-2 pl-10 pr-4 outline-none focus:border-[#dd2817]"
          />

          {searchResults.length > 0 && (
            <div className="absolute top-12 z-50 w-full overflow-hidden rounded-2xl border border-[#e9e8e7] bg-white shadow-xl">
              {searchResults.slice(0, 8).map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  type="button"
                  onClick={() => {
                    setSearchTerm("");

                    if (result.type === "course") {
                      navigate(`/teacher/courses/${result.id}`);
                    } else {
                      navigate("/teacher/students");
                    }
                  }}
                  className="block w-full border-b border-[#f5f3f2] px-4 py-3 text-left hover:bg-[#f5f3f2]"
                >
                  <p className="text-sm font-bold text-[#1b1c1b]">
                    {result.title}
                  </p>

                  <p className="text-xs text-[#5d5e60]">
                    {result.subtitle}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="flex min-h-32 items-center justify-between rounded-xl border border-[#e4e2e1] bg-white p-6 shadow-sm"
          >
            <div>
              <p className="whitespace-pre-line text-sm font-medium leading-5 text-[#5d5e60]">
                {stat.label}
              </p>

              <p
                className={`mt-2 font-['Manrope',sans-serif] text-3xl font-bold ${stat.valueClass}`}
              >
                {stat.value}
              </p>
            </div>

            <div className={`rounded-lg p-3 ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl bg-[#f5f3f2] p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-['Manrope',sans-serif] text-xl font-extrabold text-[#1b1c1b]">
              Cursos Asignados
            </h2>

            <button
              onClick={() => navigate("/teacher/courses")}
              className="text-sm font-bold text-[#b70700]"
            >
              Ver todos
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {courses.length === 0 ? (
              <p className="text-sm text-[#5d5e60]">
                No tiene cursos asignados.
              </p>
            ) : (
              courses.map((course) => (
                <article
                  key={course.id}
                  onClick={() => navigate(`/teacher/courses/${course.id}`)}
                  className="flex cursor-pointer items-center gap-4 rounded-xl bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <span className="rounded-full bg-[#e4e4e7] px-2 py-0.5 text-[10px] font-bold uppercase text-[#5d5e60]">
                      {course.level}
                    </span>

                    <h3 className="mt-2 font-['Manrope',sans-serif] text-base font-bold leading-6 text-[#1b1c1b]">
                      {course.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#5d5e60]">
                      {course.students}
                    </p>

                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#e4e2e1]">
                      <div
                        className="h-full rounded-full bg-[#b70700]"
                        style={{ width: course.progress }}
                      />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#dd2817]" />

            <h2 className="font-['Manrope',sans-serif] text-xl font-bold text-[#1b1c1b]">
              Calendario Próximo
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#e4e2e1] bg-white shadow-sm">
            {events.length === 0 ? (
              <p className="p-4 text-sm text-[#5d5e60]">
                No hay próximas clases registradas.
              </p>
            ) : (
              events.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-4 p-4 ${
                    index !== 0 ? "border-t border-[#e4e2e1]" : ""
                  }`}
                >
                  <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg border border-[#e4e2e1] bg-[#f5f3f2]">
                    <span className="text-xs font-bold text-[#dd2817]">
                      {event.dayLabel}
                    </span>

                    <span className="text-2xl font-extrabold text-[#1b1c1b]">
                      {event.day}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold leading-6 text-[#1b1c1b]">
                      {event.title}
                    </h3>

                    <p className="text-sm leading-5 text-[#5d5e60]">
                      {event.detail}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e9e8e7] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#e9e8e7] p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-['Manrope',sans-serif] text-xl font-extrabold text-[#1b1c1b]">
              Estudiantes matriculados en sus cursos
            </h2>

            <p className="mt-1 text-sm text-[#5d5e60]">
              Revise sus alumnos y su porcentaje de asistencia.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#f5f3f2] px-4 py-2 text-sm font-semibold text-[#5d5e60]">
              <Filter className="h-4 w-4" />

              <select
                value={selectedCourseFilter}
                onChange={(event) => setSelectedCourseFilter(event.target.value)}
                className="bg-transparent outline-none"
              >
                <option value="all">Todos los cursos</option>

                {courseFilterOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 rounded-lg bg-[#f5f3f2] px-4 py-2 text-sm font-semibold text-[#5d5e60]"
            >
              <Download className="h-4 w-4" />
              Exportar Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead className="bg-[#f5f3f2]/70">
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-[#5d5e60]">
                <th className="px-8 py-4">Estudiante</th>
                <th className="px-8 py-4">Curso</th>
                <th className="px-8 py-4">Estado</th>
                <th className="px-8 py-4">Asistencia</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-8 text-center text-sm text-[#5d5e60]"
                  >
                    No hay estudiantes matriculados en este filtro.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t border-[#e9e8e7]">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e4e4e7]">
                          <Star className="h-4 w-4 text-[#858688]" />
                        </div>

                        <span className="text-sm font-semibold text-[#1b1c1b]">
                          {student.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-sm text-[#5d5e60]">
                      {student.course}
                    </td>

                    <td className="px-8 py-5">
                      <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-[10px] font-bold uppercase text-[#15803d]">
                        {student.status}
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-[#e4e2e1]">
                          <div
                            className="h-full rounded-full bg-[#b70700]"
                            style={{
                              width: `${getAttendancePercentage(student)}%`,
                            }}
                          />
                        </div>

                        <span className="text-xs font-bold text-[#1b1c1b]">
                          {getAttendancePercentage(student)}%
                        </span>
                      </div>
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
};

export default TeacherDashboard;