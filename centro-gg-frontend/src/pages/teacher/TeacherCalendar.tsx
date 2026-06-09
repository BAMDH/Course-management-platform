import type React from "react"
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  MapPin,
  Users,
  Utensils,
  XCircle,
} from "lucide-react"
import clsx from "clsx"


const days = [
  24, 25, 26, 27, 28, 29, 30,
  1, 2, 3, 4, 5, 6, 7,
  8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28,
  29, 30, 31,
]

const eventDays = {
  2: "registered",
  9: "selected",
  16: "class",
  23: "evaluation",
  30: "class",
} as const

export default function TeacherCalendar() {
  return (
    <main className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      <header className="mb-10">
        <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
          Calendario de Clases
        </h1>
        <p className="mt-2 text-base text-[#5d5e60]">
          Centro De Capacitación G&G - Octubre 2023
        </p>
      </header>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-2xl border border-[#e9e8e7] bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-['Manrope',sans-serif] text-2xl font-bold text-[#1b1c1b]">
              Octubre
            </h2>

            <div className="flex gap-4 text-[#5d5e60]">
              <ChevronLeft className="h-5 w-5 cursor-pointer" />
              <ChevronRight className="h-5 w-5 cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-6 text-center">
            {["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"].map((day) => (
              <div
                key={day}
                className="text-xs font-extrabold uppercase tracking-wider text-[#5d5e60]"
              >
                {day}
              </div>
            ))}

            {days.map((day, index) => {
              const type = eventDays[day as keyof typeof eventDays]
              const isPreviousMonth = index < 7

              return (
                <div key={`${day}-${index}`} className="flex justify-center">
                  <div
                    className={clsx(
                      "flex h-20 w-20 flex-col items-center justify-center rounded-xl border transition-colors",
                      isPreviousMonth && "border-transparent text-[#d4d4d8]",
                      !type && !isPreviousMonth && "border-transparent text-[#1b1c1b]",
                      type === "registered" && "bg-[#e9e8e7] border-transparent",
                      type === "selected" && "bg-[#dd2817] border-[#dd2817] text-white shadow-md",
                      type === "class" && "border-[#dd2817] text-[#dd2817]",
                      type === "evaluation" && "border-[#858688] bg-[#f5f3f2] text-[#1b1c1b]"
                    )}
                  >
                    <span className="text-base font-bold">{day}</span>

                    {type === "selected" && (
                      <Utensils className="mt-2 h-4 w-4" />
                    )}

                    {type === "class" && (
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#dd2817]" />
                    )}

                    {type === "registered" && (
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#5d5e60]" />
                    )}

                    {type === "evaluation" && (
                      <CalendarCheck className="mt-2 h-4 w-4 text-[#858688]" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#5d5e60]">
            <Legend color="bg-[#dd2817]" label="Próxima Clase" />
            <Legend color="bg-[#5d5e60]" label="Asistencia Registrada" />
            <Legend border label="Día de Evaluación" />
          </div>
        </div>

        <aside className="border-l border-[#e6bdb6] pl-8">
          <h2 className="font-['Manrope',sans-serif] text-2xl font-bold text-[#1b1c1b]">
            Detalle del Día
          </h2>
          <p className="mt-2 text-lg font-extrabold text-[#b70700]">
            Viernes, 6 de Octubre
          </p>

          <div className="mt-8 rounded-2xl border border-[#e6bdb6] bg-[#fbf9f8] p-6">
            <span className="rounded-md bg-[#b70700] px-3 py-1 text-xs font-extrabold uppercase text-white">
              Clase Programada
            </span>

            <h3 className="mt-5 font-['Manrope',sans-serif] text-xl font-extrabold text-[#1b1c1b]">
              Módulo 3: Masas Hojaldradas
            </h3>

            <p className="mt-2 flex items-center gap-2 text-sm text-[#5d5e60]">
              <Users className="h-4 w-4" />
              Grupo B (Avanzado)
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-[#1b1c1b]">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-[#dd2817]" />
                09:00 - 13:00
              </span>

              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#dd2817]" />
                Cocina 2
              </span>
            </div>
          </div>

          <h3 className="mt-8 text-sm font-extrabold uppercase tracking-wider text-[#5d5e60]">
            Próximos eventos críticos
          </h3>

          <div className="mt-5 space-y-4">
            <CriticalEvent
              icon={<ClipboardList className="h-5 w-5 text-[#0073d1]" />}
              title="Examen Teórico: Pastelería I"
              subtitle="Grupo A & C"
              badge="12 Octubre"
              badgeClass="bg-[#d4e3ff] text-[#0073d1]"
            />

            <CriticalEvent
              icon={<XCircle className="h-5 w-5 text-[#dd2817]" />}
              title="Cierre Inscripción Talleres"
              subtitle="Diplomado Internacional"
              badge="HOY - 23:59"
              badgeClass="bg-[#fef2f2] text-[#dd2817]"
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=700"
              alt="Chef evaluando"
              className="h-48 w-full object-cover"
            />

            <div className="-mt-16 relative bg-gradient-to-t from-black/90 to-transparent p-5 pt-16 text-white">
              <h4 className="font-bold">Guía de Evaluación: Módulo 3</h4>
              <p className="text-sm text-white/80">
                Documento de apoyo para profesores
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

function Legend({
  color,
  label,
  border = false,
}: {
  color?: string
  label: string
  border?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      {border ? (
        <span className="h-3 w-3 rounded-full border border-[#858688]" />
      ) : (
        <span className={clsx("h-3 w-3 rounded-full", color)} />
      )}
      <span>{label}</span>
    </div>
  )
}

function CriticalEvent({
  icon,
  title,
  subtitle,
  badge,
  badgeClass,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  badge: string
  badgeClass: string
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-[#e6bdb6] bg-white p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f3f2]">
        {icon}
      </div>

      <div>
        <h4 className="font-bold text-[#1b1c1b]">{title}</h4>
        <p className="text-sm text-[#5d5e60]">{subtitle}</p>
        <span className={`mt-2 inline-block rounded px-2 py-1 text-xs font-bold ${badgeClass}`}>
          {badge}
        </span>
      </div>
    </div>
  )
}