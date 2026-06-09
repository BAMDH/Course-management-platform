import { useMemo, useState } from "react"
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Lock,
  Save,
  XCircle,
} from "lucide-react"
import clsx from "clsx"

type AttendanceStatus = "present" | "late" | "absent"

type Student = {
  id: string
  name: string
  code: string
  avatar: string
  contentUnlocked: boolean
  status: AttendanceStatus | null
}

const initialStudents: Student[] = [
  {
    id: "8842-A",
    name: "Arévalo, Francisco",
    code: "8842-A",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Francisco",
    contentUnlocked: true,
    status: "present",
  },
  {
    id: "9120-C",
    name: "Benítez, Lucía",
    code: "9120-C",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia",
    contentUnlocked: false,
    status: null,
  },
  {
    id: "7552-F",
    name: "Castillo, Roberto",
    code: "7552-F",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
    contentUnlocked: true,
    status: "late",
  },
]

export default function TeacherAttendance() {
  const [students, setStudents] = useState(initialStudents)

  const totals = useMemo(() => {
    return {
      present: students.filter((s) => s.status === "present").length,
      late: students.filter((s) => s.status === "late").length,
      absent: students.filter((s) => s.status === "absent").length,
      total: 28,
    }
  }, [students])

  const attendancePercent = Math.round(
    ((totals.present + totals.late) / totals.total) * 100
  )

  function updateStatus(studentId: string, status: AttendanceStatus) {
    setStudents((current) =>
      current.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    )
  }

  return (
    <main className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      <section className="mb-8 rounded-3xl border border-[#e9e8e7] bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px_280px]">
          <div>
            <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
              Registro de Asistencia
            </h1>
            <p className="mt-2 max-w-md text-base leading-6 text-[#5d5e60]">
              Gestiona la presencia de tus alumnos en tiempo real.
            </p>
          </div>

          <div className="space-y-4">
            <InfoBox label="Fecha" icon={<CalendarDays className="h-4 w-4" />}>
              Hoy, 24 Oct 2023
            </InfoBox>

            <InfoBox label="Horario" icon={<Clock className="h-4 w-4" />}>
              09:00 - 13:00
            </InfoBox>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase text-[#5d5e60]">
              Módulo & Sesión
            </p>
            <div className="w-fit rounded-xl border border-[#e4e2e1] bg-[#f5f3f2] px-5 py-4 font-bold text-[#1b1c1b]">
              Módulo 3: Masas
              <br />
              Hojaldradas
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 max-w-3xl rounded-3xl border border-[#e9e8e7] bg-white p-8 shadow-sm">
        <p className="mb-2 text-base text-[#5d5e60]">
          Estado General del Grupo
        </p>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
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

          <div className="flex gap-8 border-l border-[#e9e8e7] pl-8">
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
                {totals.absent || 2}
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

          <button className="text-sm font-bold text-[#5d5e60]">
            AŽ Apellido
          </button>
        </div>

        <div className="space-y-4">
          {students.map((student) => (
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
                      !student.status && "bg-[#e4e4e7]"
                    )}
                  >
                    {student.status === "present" && (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {student.status === "late" && <Clock className="h-3 w-3" />}
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
                      ID: {student.code}
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

              <div className="grid grid-cols-3 gap-3 lg:w-[440px]">
                <AttendanceButton
                  active={student.status === "present"}
                  variant="present"
                  onClick={() => updateStatus(student.id, "present")}
                >
                  Presente
                </AttendanceButton>

                <AttendanceButton
                  active={student.status === "late"}
                  variant="late"
                  onClick={() => updateStatus(student.id, "late")}
                >
                  Tardía
                </AttendanceButton>

                <AttendanceButton
                  active={student.status === "absent"}
                  variant="absent"
                  onClick={() => updateStatus(student.id, "absent")}
                >
                  Ausente
                </AttendanceButton>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-8 flex justify-end">
        <button className="flex items-center gap-3 rounded-2xl bg-[#dd2817] px-10 py-5 text-lg font-extrabold text-white shadow-lg shadow-red-500/25 hover:bg-[#b70700]">
          <Save className="h-6 w-6" />
          Finalizar Pase de Lista
        </button>
      </div>
    </main>
  )
}

function InfoBox({
  label,
  icon,
  children,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
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
  )
}

function AttendanceButton({
  active,
  variant,
  onClick,
  children,
}: {
  active: boolean
  variant: AttendanceStatus
  onClick: () => void
  children: React.ReactNode
}) {
  const activeClasses = {
    present: "bg-[#dd2817] text-white border-[#dd2817]",
    late: "bg-[#f59e0b] text-white border-[#f59e0b]",
    absent: "bg-[#1b1c1b] text-white border-[#1b1c1b]",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-xl border px-4 py-4 text-sm font-extrabold transition-colors",
        active
          ? activeClasses[variant]
          : "border-[#e4e2e1] bg-white text-[#5d5e60] hover:bg-[#f5f3f2]"
      )}
    >
      {children}
    </button>
  )
}