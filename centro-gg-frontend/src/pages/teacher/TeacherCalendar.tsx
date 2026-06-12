import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  MapPin,
  Users,
  Utensils,
  XCircle,
} from "lucide-react";
import clsx from "clsx";

import { useAuth } from "@/providers/auth/useAuth";
import { supabase } from "@/services/supabase";

type CourseSession = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  course: {
    id: string;
    title: string;
    level: string | null;
    location: string | null;
  } | null;
};

type CourseSessionRow = {
  id: string;
  title: string | null;
  description: string | null;
  starts_at: string;
  ends_at: string;
  course: {
    id: string;
    title: string | null;
    level: string | null;
    location: string | null;
  } | null;
};

const weekDays = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

function formatMonthTitle(date: Date) {
  return date.toLocaleDateString("es-CR", {
    month: "long",
    year: "numeric",
  });
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("es-CR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTimeRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt).toLocaleTimeString("es-CR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const end = new Date(endsAt).toLocaleTimeString("es-CR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${start} - ${end}`;
}

function isSameDate(first: Date, second: Date) {
  return first.toDateString() === second.toDateString();
}

function getCalendarDays(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const calendarDays: Date[] = [];

  const startDay = firstDay.getDay();

  for (let index = startDay; index > 0; index -= 1) {
    calendarDays.push(new Date(year, month, 1 - index));
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    calendarDays.push(new Date(year, month, day));
  }

  while (calendarDays.length % 7 !== 0) {
    const nextDay = calendarDays.length - startDay - lastDay.getDate() + 1;
    calendarDays.push(new Date(year, month + 1, nextDay));
  }

  return calendarDays;
}

export default function TeacherCalendar() {
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState<CourseSession[]>([]);

  useEffect(() => {
    const teacherId = user?.id ?? "";

    if (teacherId.length === 0) return;

    let isMounted = true;

    async function loadSessions() {
      try {
        const { data, error } = await supabase
          .from("course_sessions")
          .select(`
            id,
            title,
            description,
            starts_at,
            ends_at,
            course:courses (
              id,
              title,
              level,
              location,
              course_teachers!inner (
                teacher_id
              )
            )
          `)
          .eq("course.course_teachers.teacher_id", teacherId)
          .order("starts_at", { ascending: true });

        if (error) throw error;

        const rows = (data ?? []) as unknown as CourseSessionRow[];

        const formattedSessions: CourseSession[] = rows.map((session) => ({
          id: session.id,
          title: session.title ?? "Clase programada",
          description: session.description,
          starts_at: session.starts_at,
          ends_at: session.ends_at,
          course: session.course
            ? {
                id: session.course.id,
                title: session.course.title ?? "Curso sin título",
                level: session.course.level,
                location: session.course.location,
              }
            : null,
        }));

        if (isMounted) {
          setSessions(formattedSessions);

          if (formattedSessions.length > 0) {
            const firstSessionDate = new Date(formattedSessions[0].starts_at);
            setCurrentDate(firstSessionDate);
            setSelectedDate(firstSessionDate);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadSessions();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const calendarDays = useMemo(
    () => getCalendarDays(currentDate),
    [currentDate]
  );

  const selectedDateSessions = sessions.filter((session) =>
    isSameDate(new Date(session.starts_at), selectedDate)
  );

  const nextSessions = sessions
    .filter((session) => new Date(session.starts_at) >= new Date())
    .slice(0, 3);

  function goToPreviousMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  }

  function goToNextMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  }

  return (
    <main className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      <header className="mb-10">
        <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
          Calendario de Clases
        </h1>

        <p className="mt-2 text-base text-[#5d5e60]">
          Centro De Capacitación G&G - {formatMonthTitle(currentDate)}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-2xl border border-[#e9e8e7] bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-['Manrope',sans-serif] text-2xl font-bold capitalize text-[#1b1c1b]">
              {formatMonthTitle(currentDate)}
            </h2>

            <div className="flex gap-4 text-[#5d5e60]">
              <button onClick={goToPreviousMonth}>
                <ChevronLeft className="h-5 w-5 cursor-pointer" />
              </button>

              <button onClick={goToNextMonth}>
                <ChevronRight className="h-5 w-5 cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-6 text-center">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-xs font-extrabold uppercase tracking-wider text-[#5d5e60]"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();

              const hasSession = sessions.some((session) =>
                isSameDate(new Date(session.starts_at), day)
              );

              const isSelected = isSameDate(day, selectedDate);

              return (
                <div
                  key={day.toISOString()}
                  className="flex justify-center"
                >
                  <button
                    onClick={() => setSelectedDate(day)}
                    className={clsx(
                      "flex h-20 w-20 flex-col items-center justify-center rounded-xl border transition-colors",
                      !isCurrentMonth && "border-transparent text-[#d4d4d8]",
                      isCurrentMonth &&
                        !hasSession &&
                        !isSelected &&
                        "border-transparent text-[#1b1c1b]",
                      hasSession &&
                        !isSelected &&
                        "border-[#dd2817] text-[#dd2817]",
                      isSelected &&
                        "bg-[#dd2817] border-[#dd2817] text-white shadow-md"
                    )}
                  >
                    <span className="text-base font-bold">
                      {day.getDate()}
                    </span>

                    {isSelected && <Utensils className="mt-2 h-4 w-4" />}

                    {hasSession && !isSelected && (
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#dd2817]" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#5d5e60]">
            <Legend color="bg-[#dd2817]" label="Clase Programada" />
            <Legend border label="Día Seleccionado" />
          </div>
        </div>

        <aside className="border-l border-[#e6bdb6] pl-8">
          <h2 className="font-['Manrope',sans-serif] text-2xl font-bold text-[#1b1c1b]">
            Detalle del Día
          </h2>

          <p className="mt-2 text-lg font-extrabold capitalize text-[#b70700]">
            {formatDateLabel(selectedDate)}
          </p>

          <div className="mt-8 space-y-4">
            {selectedDateSessions.length === 0 ? (
              <div className="rounded-2xl border border-[#e6bdb6] bg-[#fbf9f8] p-6">
                <span className="rounded-md bg-[#f5f3f2] px-3 py-1 text-xs font-extrabold uppercase text-[#5d5e60]">
                  Sin clases
                </span>

                <h3 className="mt-5 font-['Manrope',sans-serif] text-xl font-extrabold text-[#1b1c1b]">
                  No hay clases programadas
                </h3>

                <p className="mt-2 text-sm text-[#5d5e60]">
                  Selecciona otro día del calendario.
                </p>
              </div>
            ) : (
              selectedDateSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-[#e6bdb6] bg-[#fbf9f8] p-6"
                >
                  <span className="rounded-md bg-[#b70700] px-3 py-1 text-xs font-extrabold uppercase text-white">
                    Clase Programada
                  </span>

                  <h3 className="mt-5 font-['Manrope',sans-serif] text-xl font-extrabold text-[#1b1c1b]">
                    {session.title}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-[#5d5e60]">
                    <Users className="h-4 w-4" />
                    {session.course?.title ?? "Curso sin título"}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-[#1b1c1b]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-[#dd2817]" />
                      {formatTimeRange(session.starts_at, session.ends_at)}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-[#dd2817]" />
                      {session.course?.location ?? "Sin ubicación"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <h3 className="mt-8 text-sm font-extrabold uppercase tracking-wider text-[#5d5e60]">
            Próximos eventos críticos
          </h3>

          <div className="mt-5 space-y-4">
            {nextSessions.length === 0 ? (
              <CriticalEvent
                icon={<XCircle className="h-5 w-5 text-[#dd2817]" />}
                title="Sin eventos próximos"
                subtitle="No hay clases futuras registradas"
                badge="N/A"
                badgeClass="bg-[#fef2f2] text-[#dd2817]"
              />
            ) : (
              nextSessions.map((session) => (
                <CriticalEvent
                  key={session.id}
                  icon={<ClipboardList className="h-5 w-5 text-[#0073d1]" />}
                  title={session.title}
                  subtitle={session.course?.title ?? "Curso sin título"}
                  badge={new Date(session.starts_at).toLocaleDateString(
                    "es-CR",
                    {
                      day: "numeric",
                      month: "long",
                    }
                  )}
                  badgeClass="bg-[#d4e3ff] text-[#0073d1]"
                />
              ))
            )}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=700"
              alt="Chef evaluando"
              className="h-48 w-full object-cover"
            />

            <div className="-mt-16 relative bg-gradient-to-t from-black/90 to-transparent p-5 pt-16 text-white">
              <h4 className="font-bold">Guía de Evaluación</h4>
              <p className="text-sm text-white/80">
                Documento de apoyo para profesores
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Legend({
  color,
  label,
  border = false,
}: {
  color?: string;
  label: string;
  border?: boolean;
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
  );
}

function CriticalEvent({
  icon,
  title,
  subtitle,
  badge,
  badgeClass,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge: string;
  badgeClass: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-[#e6bdb6] bg-white p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f3f2]">
        {icon}
      </div>

      <div>
        <h4 className="font-bold text-[#1b1c1b]">{title}</h4>

        <p className="text-sm text-[#5d5e60]">{subtitle}</p>

        <span
          className={`mt-2 inline-block rounded px-2 py-1 text-xs font-bold ${badgeClass}`}
        >
          {badge}
        </span>
      </div>
    </div>
  );
}