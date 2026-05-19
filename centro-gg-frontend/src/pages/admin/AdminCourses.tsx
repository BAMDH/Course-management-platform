import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import AdminLayout from "@/layout/AdminLayout";

import Card from "@/components/admin/Cards/Card";

import Button from "@/components/admin/Button";

import CourseRow from "@/components/admin/tables/CourseRow";

import TableHeader from "@/components/admin/tables/TableHeader";

import SearchInput from "@/components/admin/ui/SearchInput";

import Breadcrumbs from "@/components/admin/navigation/Breadcrumbs";

import PageHeader from "@/components/admin/headers/PageHeader";

import { supabase } from "@/services/supabase";

type Course = {
  id: string;

  title: string;

  teacher: string;

  slots: string;

  start: string;

  price: string;

  image: string;

  level: string;

  status: string;
};

const ITEMS_PER_PAGE = 5;

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
  const { data, error } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      level,
      start_date,
      max_capacity,
      status,
      price,
      cover_image_path,
      created_at,

      course_teachers (
        teacher:profiles (
          full_name
        )
      ),

      enrollments (
        id,
        status
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);

    setLoading(false);

    return;
  }

  const formattedCourses = data.map(
    (course) => {
      const activeEnrollments =
        course.enrollments?.filter(
          (enrollment: any) =>
            enrollment.status ===
            "active"
        ) ?? [];

      return {
        id: course.id,

        title:
          course.title ?? "Sin título",

        teacher:
          course.course_teachers?.[0]
            ?.teacher?.full_name ??
          "Sin asignar",

        slots: `${
          activeEnrollments.length
        }/${course.max_capacity ?? 0}`,

        start: course.start_date
          ? new Date(
              course.start_date
            ).toLocaleDateString()
          : "Sin fecha",

        price: course.price
          ? `₡${Number(
              course.price
            ).toLocaleString()}`
          : "₡0",

        image:
          course.cover_image_path ??
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587",

        level:
          course.level ??
          "Sin nivel",

        status:
          course.status ??
          "Pendiente",
      };
    }
  );



    setCourses(formattedCourses);

    setLoading(false);
  };

  const filteredCourses =
    courses.filter((course) =>
      [
        course.title,
        course.teacher,
        course.level,
        course.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(
    filteredCourses.length /
      ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const endIndex =
    startIndex + ITEMS_PER_PAGE;

  const currentCourses =
    filteredCourses.slice(
      startIndex,
      endIndex
    );

  return (
    <AdminLayout>
      <main className="min-h-screen bg-[#f5f5f5] p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <Breadcrumbs
              items={[
                {
                  label: "Administración",
                  href: "/admin",
                },

                {
                  label:
                    "Gestión de Cursos",
                  href:
                    "/admin/courses",
                },
              ]}
            />

            <PageHeader
              title="Gestión Académica"
              description="Administre cursos, disponibilidad, instructores y programas especializados del Centro de Capacitación G&G."
            />
          </div>

          <Link to="/admin/courses/create">
            <Button size="lg">
              Crear Nuevo Curso
            </Button>
          </Link>
        </div>

        {/* Table */}
        <Card className="overflow-hidden mb-8">
          {/* Search */}
          <div className="p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between border-b border-gray-100">
            <SearchInput
              placeholder="Buscar cursos, profesores o categorías..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                setCurrentPage(1);
              }}
            />

           
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-100">
                  <TableHeader>
                    CURSO
                  </TableHeader>

                  <TableHeader>
                    INSTRUCTOR
                  </TableHeader>

                  <TableHeader>
                    CUPOS
                  </TableHeader>

                  <TableHeader>
                    INICIO
                  </TableHeader>

                  <TableHeader>
                    PRECIO
                  </TableHeader>

                  <TableHeader>
                    ESTADO
                  </TableHeader>

                  <TableHeader />
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  currentCourses.map(
                    (course) => (
                      <CourseRow
                        key={course.id}
                        course={course}
                      />
                    )
                  )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-5 text-sm text-gray-500">
            <p>
              Mostrando{" "}
              {filteredCourses.length === 0
                ? 0
                : startIndex + 1}
              {" - "}
              {Math.min(
                endIndex,
                filteredCourses.length
              )}
              {" de "}
              {filteredCourses.length}{" "}
              cursos
            </p>

            <div className="flex items-center gap-2">
              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`w-9 h-9 rounded-xl transition ${
                    currentPage === page
                      ? "bg-red-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#ebe8e8] p-8 relative overflow-hidden border-none">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Control Académico
              </h3>

              <p className="text-gray-600 leading-relaxed max-w-md">
                Mantenga actualizada la
                disponibilidad de cupos y
                el progreso de los
                programas especializados.
              </p>
            </div>

            <div className="absolute right-0 bottom-0 text-8xl opacity-10">
              📖
            </div>
          </Card>

          <Card className="bg-red-600 text-white p-8 relative overflow-hidden border-none">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Gestión de
                Instructores
              </h3>

              <p className="leading-relaxed max-w-md text-red-100">
                Asigne chefs
                profesionales y
                especialistas para elevar
                la calidad académica de
                cada curso.
              </p>
            </div>

            <div className="absolute right-0 bottom-0 text-8xl opacity-10">
              👨‍🍳
            </div>
          </Card>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminCourses;