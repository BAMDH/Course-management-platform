import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  HelpCircle,
  LifeBuoy,
  Mail,
  User,
} from "lucide-react";

export default function HelpPage() {
  const helpItems = [
    {
      title: "Mis cursos",
      description:
        "Consulte los cursos asignados, sesiones, estudiantes y materiales disponibles.",
      icon: BookOpen,
    },
    {
      title: "Asistencia",
      description:
        "Registre la asistencia de los estudiantes según las sesiones programadas.",
      icon: ClipboardList,
    },
    {
      title: "Calendario",
      description:
        "Revise las próximas clases y actividades académicas programadas.",
      icon: CalendarDays,
    },
    {
      title: "Perfil",
      description:
        "Actualice su información personal y fotografía de perfil.",
      icon: User,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-8">
      <section className="rounded-3xl bg-red-50 p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dd2817] text-white">
            <HelpCircle className="h-7 w-7" />
          </div>

          <div>
            <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
              Centro de ayuda
            </h1>

            <p className="mt-1 text-sm text-[#5d5e60]">
              Encuentre orientación rápida sobre las funciones principales del
              portal.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {helpItems.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-[#e9e8e7] bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#dd2817]">
              <item.icon className="h-6 w-6" />
            </div>

            <h2 className="font-['Manrope',sans-serif] text-lg font-extrabold text-[#1b1c1b]">
              {item.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#5d5e60]">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-[#e9e8e7] bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f3f2] text-[#dd2817]">
            <LifeBuoy className="h-6 w-6" />
          </div>

          <div>
            <h2 className="font-['Manrope',sans-serif] text-xl font-extrabold text-[#1b1c1b]">
              ¿Necesitás soporte?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#5d5e60]">
              Si tenés problemas para ingresar, registrar asistencia, consultar
              cursos o actualizar tu información, contactá al administrador del
              sistema.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#dd2817]">
              <Mail className="h-4 w-4" />
              centrodecapacitaciongyg@gmail.com
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}