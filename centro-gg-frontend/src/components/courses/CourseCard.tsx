import { Link } from "react-router-dom"
import { Clock3, ArrowRight } from "lucide-react"

import type { LandingCourse } from "@/services/courseService"

interface Props {
  course: LandingCourse
}

export function CourseCard({ course }: Props) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <img
        src={
          course.cover_image_path ||
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
        }
        alt={course.title}
        className="h-64 w-full object-cover"
      />

      <div className="flex flex-col gap-4 p-6">
        <div>
          <span className="rounded-full bg-red-700 px-3 py-1 text-xs font-bold uppercase text-white">
            {course.level || "Curso"}
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-zinc-900">
            {course.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
            {course.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Clock3 size={16} />
            <span>
              {course.duration_hours || 0} horas
            </span>
          </div>

          <div className="flex items-center gap-2 font-bold text-red-700 transition-all hover:gap-3">
            Ver más
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  )
}