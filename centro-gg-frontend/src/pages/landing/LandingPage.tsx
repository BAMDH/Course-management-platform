import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getFeaturedPublishedCourses } from "@/services/courseService"
import { getStudentEnrolledCourseIds } from "@/services/studentEnrollmentService"
import { useAuth } from "@/providers/auth/useAuth"

const DEFAULT_COURSE_IMAGE =
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=1200&auto=format&fit=crop"

const LandingPage = () => {
  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["landing-courses"],
    queryFn: getFeaturedPublishedCourses,
  })

  const { user, role } = useAuth()
  const isStudent = user && role === "student"

  const { data: enrolledCourseIds = [] } = useQuery({
    queryKey: ["enrolled-courses", user?.email],
    queryFn: () => getStudentEnrolledCourseIds(user?.email || ""),
    enabled: Boolean(isStudent),
  })

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-32">
        <div>
          <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-800">
            Tradición e innovación
          </span>

          <h1 className="mt-6 max-w-2xl text-5xl font-extrabold leading-tight md:text-7xl">
            Formá tu talento en alta{" "}
            <span className="text-red-700">pastelería profesional</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-600">
            Aprendé junto a expertos y convertí tu pasión en una carrera con
            futuro.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {isStudent ? (
              <Button
                asChild
                size="lg"
                className="bg-red-600 px-8 font-bold shadow-lg shadow-red-600/20 hover:bg-red-700"
              >
                <Link to="/student">Ir a Mi Panel</Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="bg-red-600 px-8 font-bold shadow-lg shadow-red-600/20 hover:bg-red-700"
              >
                <Link to="/register">Inscribirse Ahora</Link>
              </Button>
            )}

            <Button asChild size="lg" variant="secondary" className="px-8">
              <a href="#cursos">Ver Cursos</a>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 bottom-8 h-52 w-52 rounded-full bg-red-600/10 blur-3xl" />

          <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={HERO_IMAGE}
              alt="Alta pastelería profesional"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="cursos" className="bg-stone-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-extrabold">Cursos Disponibles</h2>

              <p className="mt-4 text-lg text-zinc-600">
                Programas diseñados para llevar tu nivel profesional al
                siguiente estándar.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 font-bold text-red-700"
            >
              Ver todos los cursos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {isLoading && (
              <div className="rounded-3xl bg-white p-8 text-zinc-600 md:col-span-3">
                Cargando cursos...
              </div>
            )}

            {isError && (
              <div className="rounded-3xl bg-white p-8 text-red-700 md:col-span-3">
                No se pudieron cargar los cursos.
              </div>
            )}

            {!isLoading &&
              !isError &&
              courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="block overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-72 overflow-hidden">
                    <img
                      src={course.cover_image_path || DEFAULT_COURSE_IMAGE}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    {course.level && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase text-red-800">
                        Nivel: {course.level}
                      </span>
                    )}

                    <h3 className="mt-4 text-xl font-bold">{course.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {course.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
                      {course.duration_hours && (
                        <span>{course.duration_hours} horas</span>
                      )}
                      {course.location && <span>• {course.location}</span>}
                    </div>

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-700">
                      Más información <ArrowRight className="h-4 w-4" />
                    </span>
                    {isStudent && enrolledCourseIds.includes(course.id) && (
                      <div className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-center text-xs font-bold text-green-700 border border-green-200">
                        ✓ Ya estás inscrito en este curso
                      </div>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section id="testimonios" className="bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold">
              Voces de Nuestra Academia
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-red-700" />
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <Testimonial
              text="La formación técnica en G&G no tiene comparación. Pasé de ser una entusiasta en casa a liderar mi propia pastelería en solo un año."
              name="Sofía Méndez"
              role="Egresada, Fundadora de L’Art Sucré"
            />

            <Testimonial
              text="Como chef, valoro la precisión y el rigor. Este centro ofrece las herramientas reales que exige el mercado internacional hoy en día."
              name="Chef Ricardo Araya"
              role="Consultor Gastronómico"
            />
          </div>
        </div>
      </section>

      <section className="bg-zinc-900 px-8 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold leading-tight text-white font-['Manrope',sans-serif] mb-6 md:text-5xl">
            ¿Listo para descubrir tus habilidades?
          </h2>
          <p className="text-lg text-white/80 mb-10">
            Únete a nuestra comunidad de estudiantes y comienza tu camino hacia la excelencia personal y profesional.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isStudent ? (
              <Button
                asChild
                className="bg-red-600 px-8 py-6 text-lg hover:bg-red-700 rounded-xl font-bold"
              >
                <Link to="/student">Ir a mi Panel Académico</Link>
              </Button>
            ) : (
              <Button
                asChild
                className="bg-red-600 px-8 py-6 text-lg hover:bg-red-700 rounded-xl font-bold"
              >
                <Link to="/courses">Conoce nuestras capacitaciones</Link>
              </Button>
            )}
            
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-white/10 px-8 py-6 text-lg text-white hover:bg-white/20 hover:text-white rounded-xl font-bold"
            >
              <a href="https://www.instagram.com/centrodecapacitaciongyg/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-white/10 px-8 py-6 text-lg text-white hover:bg-white/20 hover:text-white rounded-xl font-bold"
            >
              <a href="https://www.facebook.com/centrodecapacitaciongyg" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

function Testimonial({
  text,
  name,
  role,
}: {
  text: string
  name: string
  role: string
}) {
  return (
    <article className="rounded-3xl bg-stone-100 p-8">
      <p className="text-lg italic leading-8 text-stone-700">“{text}”</p>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-300 font-bold text-zinc-700">
          {name.charAt(0)}
        </div>

        <div>
          <h3 className="font-bold">{name}</h3>
          <p className="text-sm text-zinc-600">{role}</p>
        </div>
      </div>
    </article>
  )
}

export default LandingPage