import { useNavigate } from "react-router-dom"
import {
  BarChart2,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FolderOpen,
  Star,
  User,
  Users,
} from "lucide-react"
import clsx from "clsx"

interface Course {
  id: string
  title: string
  status: "EN CURSO" | "PRÓXIMAMENTE"
  groupDay: string
  groupHour: string
  students: number
  progress: number
  progressLabel: string
  imageUrl: string
}

const MOCK_COURSES: Course[] = [
  {
    id: "reposteria-basica",
    title: "Repostería Básica",
    status: "EN CURSO",
    groupDay: "Martes",
    groupHour: "9am-12pm",
    students: 18,
    progress: 75,
    progressLabel: "Completado",
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "chocolateria-n1",
    title: "Taller de Chocolatería N1",
    status: "EN CURSO",
    groupDay: "Jueves",
    groupHour: "2pm-5pm",
    students: 12,
    progress: 40,
    progressLabel: "Completado",
    imageUrl:
      "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "chocolateria-fina",
    title: "Chocolatería Fina",
    status: "PRÓXIMAMENTE",
    groupDay: "Sábado",
    groupHour: "10am-1pm",
    students: 25,
    progress: 0,
    progressLabel: "Inicia en 4 días",
    imageUrl:
      "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800",
  },
]

export default function TeacherCourses() {
  const navigate = useNavigate()

  return (
    <main className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      <header className="mb-10">
        <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
          Mis Cursos Asignados
        </h1>
        <p className="mt-2 text-base text-[#5d5e60]">
          Gestiona tus clases de gastronomía y el progreso de tus alumnos.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-14">
        {MOCK_COURSES.map((course) => {
          const disabled = course.status === "PRÓXIMAMENTE"

          return (
            <article
              key={course.id}
              onClick={() => navigate(`/teacher/courses/${course.id}`)}
              className="overflow-hidden rounded-3xl border border-[#e9e8e7] bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={course.imageUrl}
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
                    {course.status}
                  </span>

                  <h2 className="mt-3 font-['Manrope',sans-serif] text-2xl font-extrabold text-white">
                    {course.title}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-5 mb-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f3f2]">
                      <Users className="h-5 w-5 text-[#dd2817]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-[#5d5e60]">
                        Grupo
                      </p>
                      <p className="text-sm font-extrabold text-[#1b1c1b]">
                        {course.groupDay}
                        <br />
                        {course.groupHour}
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
                        {course.students}
                        <br />
                        Estudiantes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#5d5e60]">
                      {course.progressLabel}
                    </span>
                    <span
                      className={clsx(
                        "text-sm font-extrabold",
                        disabled ? "text-[#5d5e60]" : "text-[#b70700]"
                      )}
                    >
                      {course.progress}%
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#e9e8e7]">
                    <div
                      className={clsx(
                        "h-full rounded-full",
                        disabled ? "bg-[#e4e4e7]" : "bg-[#b70700]"
                      )}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <button
                  disabled={disabled}
                  onClick={(event) => {
                    event.stopPropagation()
                    navigate(`/teacher/courses/${course.id}/materials`)
                  }}
                  className={clsx(
                    "mb-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-colors",
                    disabled
                      ? "bg-[#f5f3f2] text-[#858688] cursor-not-allowed"
                      : "bg-[#f5f3f2] text-[#1b1c1b] hover:bg-[#e9e8e7]"
                  )}
                >
                  <FolderOpen className="h-5 w-5" />
                  Ver Materiales
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={disabled}
                    onClick={(event) => {
                      event.stopPropagation()
                      navigate(`/teacher/courses/${course.id}/attendance`)
                    }}
                    className={clsx(
                      "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-extrabold",
                      disabled
                        ? "border-[#e9e8e7] text-[#dd2817]/40 cursor-not-allowed"
                        : "border-[#e9e8e7] text-[#b70700] hover:bg-[#fef2f2]"
                    )}
                  >
                    <ClipboardList className="h-4 w-4" />
                    Pasar Lista
                  </button>

                  <button
                    disabled={disabled}
                    onClick={(event) => {
                      event.stopPropagation()
                      navigate(`/teacher/courses/${course.id}/grades`)
                    }}
                    className={clsx(
                      "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-extrabold",
                      disabled
                        ? "border-[#e9e8e7] text-[#dd2817]/40 cursor-not-allowed"
                        : "border-[#e9e8e7] text-[#b70700] hover:bg-[#fef2f2]"
                    )}
                  >
                    <CalendarCheck className="h-4 w-4" />
                    Calificaciones
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard
          icon={<Star className="h-6 w-6 fill-[#dd2817] text-[#dd2817]" />}
          bg="bg-[#fef2f2]"
          value="4.9"
          label="Promedio Calificación"
        />

        <MetricCard
          icon={<BarChart2 className="h-6 w-6 text-[#0073d1]" />}
          bg="bg-[#d4e3ff]"
          value="92%"
          label="Tasa de Asistencia"
        />

        <MetricCard
          icon={<CheckCircle2 className="h-6 w-6 text-[#16a34a]" />}
          bg="bg-[#dcfce7]"
          value="55"
          label="Tareas Revisadas hoy"
        />
      </section>
    </main>
  )
}

function MetricCard({
  icon,
  bg,
  value,
  label,
}: {
  icon: React.ReactNode
  bg: string
  value: string
  label: string
}) {
  return (
    <article className="flex items-center gap-5 rounded-3xl border border-[#e9e8e7] bg-white p-6 shadow-sm">
      <div className={`flex h-14 w-14 items-center justify-center rounded-full ${bg}`}>
        {icon}
      </div>

      <div>
        <p className="font-['Manrope',sans-serif] text-3xl font-extrabold leading-tight text-[#1b1c1b]">
          {value}
        </p>
        <p className="text-sm font-medium text-[#5d5e60]">{label}</p>
      </div>
    </article>
  )
}