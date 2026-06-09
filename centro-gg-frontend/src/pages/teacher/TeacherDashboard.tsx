import {
  CalendarDays,
  ClipboardCheck,
  Download,
  Filter,
  Search,
  Star,
  Users,
  Utensils,
} from "lucide-react"

const stats = [
  {
    label: "Estudiantes\nTotales",
    value: "86",
    icon: Users,
    valueClass: "text-[#1b1c1b]",
    iconBg: "bg-[#fef2f2]",
    iconColor: "text-[#dd2817]",
  },
  {
    label: "Cursos Activos",
    value: "4",
    icon: Utensils,
    valueClass: "text-[#1b1c1b]",
    iconBg: "bg-[#fef2f2]",
    iconColor: "text-[#dd2817]",
  },
  {
    label: "Evaluaciones\nPendientes",
    value: "12",
    icon: ClipboardCheck,
    valueClass: "text-[#dd2817]",
    iconBg: "bg-[#fef2f2]",
    iconColor: "text-[#dd2817]",
  },
  {
    label: "Asistencia\nPromedio",
    value: "94%",
    icon: CalendarDays,
    valueClass: "text-[#1b1c1b]",
    iconBg: "bg-[#f0fdf4]",
    iconColor: "text-[#16a34a]",
  },
]

const courses = [
  {
    title: "Taller de Chocolatería N1",
    students: "48 Estudiantes activos",
    level: "ESPECIALIZADO",
    badgeClass: "bg-[#d4e3ff] text-[#001c3a]",
    image:
      "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=200",
    progress: "75%",
  },
  {
    title: "Repostería Francesa: Petit Fours",
    students: "33 Estudiantes activos",
    level: "INTERMEDIO",
    badgeClass: "bg-[#e4e4e7] text-[#5d5e60]",
    image:
      "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=200",
    progress: "50%",
  },
  {
    title: "Repostería Básica",
    students: "32 Estudiantes activos",
    level: "PRINCIPIANTE",
    badgeClass: "bg-[#dd2817] text-white",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200",
    progress: "50%",
  },
  {
    title: "Chocolatería Fina",
    students: "25 Estudiantes activos",
    level: "INTERMEDIO",
    badgeClass: "bg-[#e4e4e7] text-[#5d5e60]",
    image:
      "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=200",
    progress: "50%",
  },
]

const events = [
  {
    dayLabel: "MAÑANA",
    day: "24",
    title: "Repostería Francesa: Petit Fours",
    detail: "09:00 - 13:00 • Taller de Cocina 2",
    highlight: true,
  },
  {
    dayLabel: "JUEVES",
    day: "26",
    title: "Taller de Chocolatería Nivel 1",
    detail: "15:00 - 18:00 • Taller de Cocina 4",
  },
  {
    dayLabel: "VIERNES",
    day: "27",
    title: "Reunión de Directivos G&G",
    detail: "10:00 - 11:30 • Sala de Conferencias",
  },
]

const students = [
  {
    name: "Ana García",
    course: "Taller de Chocolatería N1",
    status: "ACTIVO",
    statusClass: "bg-[#dcfce7] text-[#15803d]",
    progress: 85,
    grade: "67%",
  },
  {
    name: "Carlos Ruiz",
    course: "Repostería Francesa: Petit Fours",
    status: "PENDIENTE PAGO",
    statusClass: "bg-[#ffedd5] text-[#c2410c]",
    progress: 12,
    grade: "35%",
  },
  {
    name: "Elena Beltrán",
    course: "Taller de Chocolatería N1",
    status: "ACTIVO",
    statusClass: "bg-[#dcfce7] text-[#15803d]",
    progress: 100,
    grade: "95%",
  },
]

const TeacherDashboard = () => {
  return (
    <main className="p-8 max-w-7xl mx-auto space-y-10 font-['Inter',sans-serif] bg-white">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
            Gestión Académica
          </h1>
          <p className="mt-1 text-base leading-6 text-[#5d5e60]">
            Bienvenido de nuevo, Chef Martínez. Aquí está el resumen de sus
            cursos.
          </p>
        </div>

        <div className="flex w-full items-center gap-2 rounded-full bg-[#f5f3f2] px-5 py-3 text-[#5d5e60] lg:w-[320px]">
          <Search className="h-5 w-5" />
          <span className="text-sm text-[#5d5e60]/50">
            Buscar alumnos o cursos...
          </span>
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
            <button className="text-sm font-bold text-[#b70700]">
              Ver todos
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <article
                key={course.title}
                className="flex items-center gap-4 rounded-xl bg-white p-4"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-20 w-20 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${course.badgeClass}`}
                  >
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
            ))}
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
            {events.map((event, index) => (
              <div
                key={event.title}
                className={`flex items-center gap-4 p-4 ${
                  index !== 0 ? "border-t border-[#e4e2e1]" : ""
                }`}
              >
                <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg border border-[#e4e2e1] bg-[#f5f3f2]">
                  <span
                    className={`text-xs font-bold ${
                      event.highlight ? "text-[#dd2817]" : "text-[#858688]"
                    }`}
                  >
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
            ))}
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
              Revise sus alumnos y su progreso académico.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#f5f3f2] px-4 py-2 text-sm font-semibold text-[#5d5e60]">
              <Filter className="h-4 w-4" />
              Filtrar
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#f5f3f2] px-4 py-2 text-sm font-semibold text-[#5d5e60]">
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-[#f5f3f2]/70">
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-[#5d5e60]">
                <th className="px-8 py-4">Estudiante</th>
                <th className="px-8 py-4">Curso</th>
                <th className="px-8 py-4">Estado</th>
                <th className="px-8 py-4">Progreso</th>
                <th className="px-8 py-4 text-right">Calificación</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.name} className="border-t border-[#e9e8e7]">
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
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${student.statusClass}`}
                    >
                      {student.status}
                    </span>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-24 rounded-full bg-[#e4e2e1]">
                        <div
                          className="h-full rounded-full bg-[#b70700]"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#1b1c1b]">
                        {student.progress}%
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right text-sm text-[#5d5e60]">
                    {student.grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default TeacherDashboard