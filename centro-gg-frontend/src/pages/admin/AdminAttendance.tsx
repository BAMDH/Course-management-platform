import {
  useEffect,
  useState,
} from "react";

import {
  ClipboardList,
  Users,
  CalendarDays,
} from "lucide-react";

import { Link } from "react-router-dom";


import Breadcrumbs from "@/components/admin/navigation/Breadcrumbs";

import PageHeader from "@/components/admin/Headers/PageHeader";

import Card from "@/components/admin/Cards/Card";

import { supabase } from "@/services/supabase";

type CourseCard = {
  id: string;

  title: string;

  cover_image_path: string | null;

  studentsCount: number;

  sessionsCount: number;

  attendancePercentage: number;
};

const AdminAttendance =
  () => {
    const [
      courses,
      setCourses,
    ] = useState<
      CourseCard[]
    >([]);

    const [loading, setLoading] =
      useState(true);

    useEffect(() => {
      fetchData();
    }, []);

    const fetchData =
      async () => {
        try {
          setLoading(true);

          const {
            data: coursesData,
            error,
          } = await supabase
            .from("courses")
            .select(`
              id,
              title,
              cover_image_path
            `)
            .neq(
            "status",
            "Pendiente"
          );

          if (error)
            throw error;

          const result =
            await Promise.all(
              (
                coursesData ||
                []
              ).map(
                async (
                  course
                ) => {
                  const {
                    count:
                      studentsCount,
                  } =
                    await supabase
                      .from(
                        "enrollments"
                      )
                      .select(
                        "*",
                        {
                          count:
                            "exact",

                          head: true,
                        }
                      )
                      .eq(
                        "course_id",
                        course.id
                      )
                      .eq(
                        "status",
                        "active"
                      );

                  const {
                    count:
                      sessionsCount,
                  } =
                    await supabase
                      .from(
                        "course_sessions"
                      )
                      .select(
                        "*",
                        {
                          count:
                            "exact",

                          head: true,
                        }
                      )
                      .eq(
                        "course_id",
                        course.id
                      );

                  const {
                    data:
                      attendanceRows,
                  } =
                    await supabase
                      .from(
                        "attendance"
                      )
                      .select(
                        "status"
                      )
                      .eq(
                        "course_id",
                        course.id
                      );

                 const valid =
                  (
                    attendanceRows ||
                    []
                  ).filter(
                    (
                      row
                    ) =>
                      [
                        "present",
                        "late",
                        "excused",
                      ].includes(
                        row.status
                      )
                  ).length;

                const total =
                  (studentsCount || 0) *
                  (sessionsCount || 0);

                const percentage =
                  total === 0
                    ? 0
                    : Math.round(
                        (
                          valid /
                          total
                        ) *
                          100
                      );

                  return {
                    id: course.id,

                    title:
                      course.title,

                    cover_image_path:
                      course.cover_image_path,

                    studentsCount:
                      studentsCount ||
                      0,

                    sessionsCount:
                      sessionsCount ||
                      0,

                    attendancePercentage:
                      percentage,
                  };
                }
              )
            );

          setCourses(result);

        } catch (
          error
        ) {
          console.error(
            error
          );
        } finally {
          setLoading(false);
        }
      };

    const getBarColor =
      (
        percentage: number
      ) => {
        if (
          percentage >= 80
        )
          return "bg-green-500";

        if (
          percentage >= 60
        )
          return "bg-yellow-500";

        return "bg-red-500";
      };

    return (
      <>
        <main className="p-8">

          <div className="mb-10">
            <Breadcrumbs
              items={[
                {
                  label:
                    "Administración",

                  href:
                    "/admin",
                },

                {
                  label:
                    "Informe de Asistencias",

                  href:
                    "/admin/attendance",
                },
              ]}
            />

            <PageHeader
              title="Informe de Asistencias"
              description="Visualice el desempeño de asistencia por curso."
            />
          </div>

          {loading ? (
            <div>
              Cargando...
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {courses.map(
                (
                  course
                ) => (
                  <Card
                    key={
                      course.id
                    }
                    className="overflow-hidden"
                  >
                    <img
                      src={
                        course.cover_image_path ||
                        "https://images.unsplash.com/photo-1556911220-bff31c812dba"
                      }
                      className="w-full h-52 object-cover"
                    />

                    <div className="p-6">

                      <h2 className="text-2xl font-bold mb-6">
                        {
                          course.title
                        }
                      </h2>

                      <div className="flex items-center justify-between mb-4">

                        <span className="text-gray-500">
                          Asistencia
                        </span>

                        <span className="font-bold text-xl">
                          {
                            course.attendancePercentage
                          }
                          %
                        </span>
                      </div>

                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-6">

                        <div
                          className={`h-full ${getBarColor(
                            course.attendancePercentage
                          )}`}
                          style={{
                            width: `${course.attendancePercentage}%`,
                          }}
                        />
                      </div>

                      <div className="space-y-3 mb-8">

                        <div className="flex items-center gap-3">
                          <Users
                            size={
                              18
                            }
                          />

                          <span>
                            {
                              course.studentsCount
                            }{" "}
                            estudiantes
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <CalendarDays
                            size={
                              18
                            }
                          />

                          <span>
                            {
                              course.sessionsCount
                            }{" "}
                            sesiones
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/admin/attendance/details/${course.id}`}
                      >
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl py-3 font-semibold flex items-center justify-center gap-2">

                          <ClipboardList
                            size={
                              18
                            }
                          />

                          Ver Detalles
                        </button>
                      </Link>
                    </div>
                  </Card>
                )
              )}
            </div>
          )}
        </main>
      </>
    );
  };

export default AdminAttendance;
