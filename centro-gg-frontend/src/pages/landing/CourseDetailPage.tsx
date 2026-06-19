import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  Clock,
  Award,
  MessageCircle,
  CalendarDays,
  ArrowLeft,
  MapPin,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  getPublishedCourseById,
  getCourseSessions,
} from "@/services/courseService"
import { getStudentEnrolledCourseIds } from "@/services/studentEnrollmentService"
import { useAuth } from "@/providers/auth/useAuth"

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"

function formatDate(date?: string | null) {
  if (!date) return "Próximamente"

  return new Date(date).toLocaleDateString("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatPrice(price?: number | null) {
  if (!price) return "Consultar"

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(price)
}

export default function CourseDetailPage() {
  const { courseId } = useParams()

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["published-course", courseId],
    queryFn: () => getPublishedCourseById(courseId!),
    enabled: Boolean(courseId),
  })

  const { data: sessions = [] } = useQuery({
    queryKey: ["course-sessions", courseId],
    queryFn: () => getCourseSessions(courseId!),
    enabled: Boolean(courseId),
  })

  const { user, role } = useAuth()
  const isStudent = user && role === "student"

  const { data: studentCoursesData } = useQuery({
    queryKey: ['student-courses', user?.email],
    queryFn: () => getStudentEnrolledCourseIds(user?.email || ""),
    enabled: Boolean(user?.email && user?.user_metadata?.role === 'student')
  });

  const enrolledCourseIds = studentCoursesData?.enrolledIds || [];
  const pendingCourseIds = studentCoursesData?.pendingIds || [];

  const isEnrolled = isStudent && enrolledCourseIds.includes(courseId!)
  const isPending = isStudent && pendingCourseIds.includes(courseId!)

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-zinc-600">Cargando curso...</p>
      </main>
    )
  }

  if (isError || !course) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900">
          Curso no encontrado
        </h1>

        <p className="mb-6 text-zinc-600">
          Este curso no existe, no está publicado o ya inició.
        </p>

        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link to="/courses">Volver al catálogo</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <Link
          to="/courses"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </Link>

        <div
          className="relative min-h-[400px] md:min-h-[520px] overflow-hidden rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage: `url(${course.cover_image_path || DEFAULT_IMAGE})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 flex min-h-[400px] md:min-h-[520px] max-w-3xl flex-col justify-end p-6 md:p-10 text-white">
            <span className="mb-4 w-fit rounded-sm bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-widest">
              {course.level || "Curso"}
            </span>

            <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-white">
              {course.title}
            </h1>

            <p className="mb-6 text-lg text-white/90">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-5 text-sm">
              <span className="flex items-center gap-2">
                <Award size={18} />
                {course.category || "Curso disponible"}
              </span>

              <span className="flex items-center gap-2">
                <Clock size={18} />
                {course.duration_hours || 0} horas
              </span>

              <span className="flex items-center gap-2">
                <MapPin size={18} />
                {course.location || "Centro de Capacitación G&G"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-12 md:px-6 md:pb-20 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-4 text-3xl font-bold text-neutral-900">
            Sobre el curso
          </h2>

          <p className="mb-10 max-w-4xl leading-7 text-neutral-600">
            {course.description}
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl bg-neutral-100 p-6">
              <p className="mb-2 text-sm font-bold text-red-600">Nivel</p>
              <p className="text-lg font-bold text-neutral-900">
                {course.level || "No definido"}
              </p>
            </div>

            <div className="rounded-xl bg-neutral-100 p-6">
              <p className="mb-2 text-sm font-bold text-red-600">Duración</p>
              <p className="text-lg font-bold text-neutral-900">
                {course.duration_hours || 0} horas
              </p>
            </div>

            <div className="rounded-xl bg-neutral-100 p-6">
              <p className="mb-2 text-sm font-bold text-red-600">
                Modalidad / Lugar
              </p>
              <p className="text-lg font-bold text-neutral-900">
                {course.location || "Centro G&G"}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">
              Plan de estudios
            </h2>

            {sessions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {sessions.map((session, index) => (
                  <div
                    key={session.id}
                    className={`rounded-xl p-6 ${
                      index === sessions.length - 1
                        ? "bg-red-600 text-white"
                        : "bg-neutral-100 text-neutral-900"
                    }`}
                  >
                    <p
                      className={`mb-3 text-xs font-bold ${
                        index === sessions.length - 1
                          ? "text-white"
                          : "text-red-600"
                      }`}
                    >
                      Sesión {session.session_order ?? index + 1}
                    </p>

                    <h3 className="mb-3 text-lg font-bold">
                      {session.title}
                    </h3>

                    {session.description && (
                      <p
                        className={`text-sm leading-6 ${
                          index === sessions.length - 1
                            ? "text-white/90"
                            : "text-neutral-600"
                        }`}
                      >
                        {session.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-neutral-100 p-6 text-neutral-600">
                Este curso aún no tiene sesiones registradas.
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-xl font-bold text-neutral-900">
            Detalles del curso
          </h3>

          <div className="space-y-4">
            <div className="rounded-lg border border-red-600 bg-red-50 p-4">
              <p className="text-xs text-neutral-500">Fecha de inicio</p>
              <p className="font-bold text-neutral-900">
                {formatDate(course.start_date)}
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">Categoría</p>
              <p className="font-bold text-neutral-900">
                {course.category || "No definida"}
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">Ubicación</p>
              <p className="font-bold text-neutral-900">
                {course.location || "Centro de Capacitación G&G"}
              </p>
            </div>
          </div>

          <div className="my-6 h-px bg-red-100" />

          <p className="text-sm text-neutral-500">Inversión total</p>

          <p className="mb-5 text-3xl font-extrabold text-neutral-900">
            {formatPrice(course.price)}
          </p>

          {isEnrolled ? (
            <div className="w-full rounded-xl bg-green-50 px-4 py-6 text-center border border-green-200 shadow-sm">
              <p className="text-green-800 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 size={20} />
                Ya estás inscrito en este curso
              </p>
              <Button
                asChild
                className="mt-4 w-full bg-green-600 font-bold hover:bg-green-700 text-white"
              >
                <Link to={`/student/courses/${courseId}/classroom`}>
                  Ir al aula virtual
                </Link>
              </Button>
            </div>
          ) : isPending ? (
            <div className="w-full rounded-xl bg-orange-50 px-4 py-6 text-center border border-orange-200 shadow-sm">
              <p className="text-orange-800 font-bold flex items-center justify-center gap-2">
                ⏳ Matrícula en verificación
              </p>
              <Button
                disabled
                className="mt-4 w-full bg-neutral-200 font-bold text-neutral-500 cursor-not-allowed"
              >
                Verificando comprobante
              </Button>
            </div>
          ) : (
            <Button
              asChild
              className="w-full bg-red-600 py-6 text-base font-bold hover:bg-red-700"
            >
              {isStudent ? (
                <Link to={`/student/courses/${courseId}/enroll`}>
                  <CalendarDays className="mr-2" size={18} />
                  Matricularme Ahora
                </Link>
              ) : (
                <Link to="/login">
                  <CalendarDays className="mr-2" size={18} />
                  Inicia sesión para matricularte
                </Link>
              )}
            </Button>
          )}

          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Consultas por WhatsApp 24/7
          </p>
        </aside>
      </section>

      <a
        href="https://wa.me/50685093777"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-105"
      >
        <MessageCircle size={28} />
      </a>
    </main>
  )
}