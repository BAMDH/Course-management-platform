import { useQuery } from "@tanstack/react-query"
import { getPublishedCourses } from "@/services/courseService"
import { CourseCard } from "../../components/courses/CourseCard"
import { useState } from "react"

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState("Todos")
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getPublishedCourses,
  })

    const levels = [
    "Todos",
    "Principiante",
    "Intermedio",
    "Especialización",
  ]

  const filteredCourses =
    selectedLevel === "Todos"
      ? courses
      : courses?.filter(
          (course) => course.level === selectedLevel
        )

  return (
    <>

      <main className="min-h-screen bg-[#FBF9F8] px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <h1 className="mb-4 text-5xl font-extrabold text-zinc-900">
              Catálogo de Cursos
            </h1>

            <p className="max-w-2xl text-lg text-zinc-600">
              Formate en repostería y panadería profesional en el Centro de
              Capacitación G&G para llevar tu talento al siguiente nivel.
            </p>
            
            <div className="mb-10 mt-10 flex flex-wrap items-center gap-3 border-b border-neutral-200 pb-8">

              <span className="text-sm font-bold uppercase tracking-wider text-zinc-600">
                Filtrar por:
              </span>

              {levels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedLevel(level)}
                  className={
                    selectedLevel === level
                      ? "rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white"
                      : "rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold text-zinc-600 hover:bg-gray-300"
                  }
                >
                  {level}
                </button>
              ))}

            </div>

          </div>

          {isLoading && <p>Cargando cursos...</p>}

          {error && (
            <p className="text-red-600">
              Error cargando cursos
            </p>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}