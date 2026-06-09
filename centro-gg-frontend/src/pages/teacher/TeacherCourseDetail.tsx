import type React from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ChevronRight,
  Search,
  Share2,
  Star,
  UserCheck,
} from "lucide-react"

const students = [
  {
    initials: "AM",
    name: "Ana Martínez",
    email: "ana.martinez@culinary.edu",
    attendance: 95,
    grade: 9.2,
    color: "bg-blue-100 text-blue-600",
  },
  {
    initials: "JR",
    name: "Julián Rojas",
    email: "j.rojas@culinary.edu",
    attendance: 78,
    grade: 7.5,
    color: "bg-orange-100 text-orange-600",
  },
  {
    initials: "CP",
    name: "Carla Paredes",
    email: "c.paredes@culinary.edu",
    attendance: 100,
    grade: 8.8,
    color: "bg-purple-100 text-purple-600",
  },
  {
    initials: "LM",
    name: "Luis Méndez",
    email: "l.mendez@culinary.edu",
    attendance: 60,
    grade: 6.4,
    color: "bg-red-100 text-red-600",
  },
]

export default function TeacherCourseDetail() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  return (
    <main className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      {/* Header */}

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
            Repostería Básica
          </h1>

          <p className="text-xl text-[#5d5e60] mt-2">
            Grupo Martes 9:00 AM - 12:00 pm • Ciclo 2024-B
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

      {/* Top Grid */}

      <section className="grid grid-cols-1 xl:grid-cols-[2fr_320px] gap-6 mb-8">
        {/* Progress */}

        <div className="rounded-3xl border border-[#e9e8e7] bg-white p-8">
          <h2 className="text-2xl font-bold font-['Manrope',sans-serif] mb-8">
            Resumen de progreso del grupo
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="GENERAL"
              value="65%"
              subtitle="+12%"
              highlight
            />

            <StatCard
              title="ASISTENCIA"
              value="92%"
              subtitle="Promedio grupal"
            />

            <StatCard
              title="ENTREGAS"
              value="14/20"
              subtitle="Recetas completadas"
            />

            <StatCard
              title="PROMEDIO"
              value="8.4"
              subtitle="Calificación técnica"
            />
          </div>
        </div>

        {/* Actions */}

        <div className="space-y-4">
          <ActionCard
            icon={<UserCheck className="w-6 h-6 text-[#dd2817]" />}
            title="Pasar Asistencia"
            subtitle="Sesión actual: Macarons"
            onClick={() => navigate(`/teacher/courses/${courseId}/attendance`)}
          />

          <ActionCard
            icon={<Star className="w-6 h-6 text-[#858688]" />}
            title="Calificar"
            subtitle="Evaluar sesión anterior"
            onClick={() => navigate(`/teacher/courses/${courseId}/grades`)}
          />
        </div>
      </section>

      {/* Bottom Grid */}

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_1.4fr] gap-6">
        {/* Timeline */}

        <div className="rounded-3xl border border-[#e9e8e7] bg-white p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-['Manrope',sans-serif]">
              Sesiones del curso
            </h2>

            <span className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-[#dd2817]">
              Semana 8 de 12
            </span>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-green-600 text-sm font-bold uppercase">
                COMPLETADA - 12 OCT
              </p>

              <h3 className="text-2xl font-bold text-[#1b1c1b]">
                Técnicas de Merengue Suizo
              </h3>

              <p className="text-[#5d5e60]">
                Asistencia: 100% • Recetas: 2
              </p>
            </div>

            <div>
              <p className="text-[#dd2817] text-sm font-bold uppercase">
                EN CURSO - HOY
              </p>

              <h3 className="text-2xl font-bold text-[#1b1c1b]">
                Macarons y Ganache
              </h3>

              <p className="text-[#5d5e60]">
                Laboratorio central • 08:00 AM
              </p>
            </div>

            <div>
              <p className="text-[#858688] text-sm font-bold uppercase">
                SIGUIENTE - 26 OCT
              </p>

              <h3 className="text-2xl font-bold text-[#858688]">
                Pastelería Francesa Clásica
              </h3>

              <p className="text-[#858688]">
                Pendiente de material
              </p>
            </div>
          </div>
        </div>

        {/* Students */}

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
              {students.map((student) => (
                <tr
                  key={student.email}
                  className="border-t border-[#e9e8e7]"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${student.color}`}
                      >
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
                    {student.attendance}%
                  </td>

                  <td className="px-8 py-5 font-bold">
                    {student.grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="w-full py-5 text-[#dd2817] font-bold">
            Ver todos los alumnos (22)
          </button>
        </div>
      </section>
    </main>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  highlight = false,
}: {
  title: string
  value: string
  subtitle: string
  highlight?: boolean
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

      <p className="text-sm text-[#5d5e60] mt-2">
        {subtitle}
      </p>
    </div>
  )
}

function ActionCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick?: () => void
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
  )
}