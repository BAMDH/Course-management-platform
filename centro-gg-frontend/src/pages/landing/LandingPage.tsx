import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getFeaturedPublishedCourses } from "@/services/courseService"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"



const LandingPage = () => {
  const {
  data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["landing-courses"],
    queryFn: getFeaturedPublishedCourses,
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
            Aprendé junto a expertos y convertí tu pasión en una carrera con futuro.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-red-600 px-8 font-bold shadow-lg shadow-red-600/20 hover:bg-red-700">
              <Link to="/register">Inscribirse Ahora</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="px-8">
              <a href="#cursos">Ver Cursos</a>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 bottom-8 h-52 w-52 rounded-full bg-red-600/10 blur-3xl" />
          <div className="relative flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br from-stone-50 to-stone-200 shadow-2xl">
            <div className="text-center">
              <div className="text-8xl">🍰</div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                Imagen temporal
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cursos" className="bg-stone-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-extrabold">Cursos Disponibles</h2>
              <p className="mt-4 text-lg text-zinc-600">
                Programas diseñados para llevar tu nivel profesional al siguiente estándar.
              </p>
            </div>

            <Link to="/courses" className="inline-flex items-center gap-2 font-bold text-red-700">
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
      <article
        key={course.id}
        className="overflow-hidden rounded-3xl bg-white shadow-sm"
      >
        <div className="flex h-72 items-center justify-center bg-gradient-to-br from-stone-200 to-stone-50">
          <span className="text-7xl">🍰</span>
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
            {course.duration_hours && <span>{course.duration_hours} horas</span>}
            {course.location && <span>• {course.location}</span>}
          </div>

          <Link
            to={`/courses/${course.slug}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-700"
          >
            Más información <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    ))}
</div>
          
        </div>
      </section>

      <section id="testimonios" className="bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold">Voces de Nuestra Academia</h2>
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

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-zinc-900 px-8 py-16 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-extrabold md:text-5xl">
            ¿Quieres elevar tu pasión al siguiente nivel?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-neutral-200">
            Inscripciones abiertas para el ciclo 2025. Cupos limitados para garantizar una enseñanza personalizada.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-red-600 px-10 font-bold hover:bg-red-700">
              <Link to="/register">Inscribirse Ahora</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 px-10 text-white hover:bg-white/20">
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer id="contacto" className="bg-stone-100 px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 text-sm text-zinc-600 md:grid-cols-3">
          <div>
            <h3 className="font-bold">Contacto:</h3>
            <p className="mt-3">Correo: centrodecapacitaciongyg@gmail.com</p>
            <p className="mt-2">Teléfono: 2278 - 4657 / 8509-3777</p>
          </div>

          <div>
            <h3 className="font-bold">Nuestra ubicación:</h3>
            <p className="mt-3">Estamos ubicados en Tres Ríos, Cartago, Costa Rica.</p>
          </div>

          <div>
            <h3 className="font-bold">¡Síguenos en nuestras redes!</h3>
            <div className="mt-4 flex gap-5">
              <span>Instagram</span>
              <span>Facebook</span>
              <span>YouTube</span>
            </div>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/50685093777"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl"
      >
        WA
      </a>
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