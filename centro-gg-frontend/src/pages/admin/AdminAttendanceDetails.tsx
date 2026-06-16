import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import AdminLayout from "@/layout/AdminLayout";

import Breadcrumbs from "@/components/admin/navigation/Breadcrumbs";

import PageHeader from "@/components/admin/Headers/PageHeader";

import Card from "@/components/admin/Cards/Card";

import { supabase } from "@/services/supabase";

type StudentAttendance = {
  id: string;

  name: string;

  attended: number;

  total: number;

  percentage: number;
};

const AdminAttendanceDetails =
  () => {
    const { id: courseId } =useParams();

    const [students,setStudents,] = useState<StudentAttendance[]
    >([]);

    const [
      courseTitle,
      setCourseTitle,
    ] = useState("");

    const [loading, setLoading] =
      useState(true);

    useEffect(() => {
      if (courseId) {
        fetchData();
      }
    }, [courseId]);

    const fetchData =
      async () => {
        try {
          setLoading(true);

          const {
            data: course,
          } = await supabase
            .from("courses")
            .select("title")
            .eq(
              "id",
              courseId
            )
            .single();

          setCourseTitle(
            course?.title || ""
          );

          const {
            count:
              sessionsCount,
          } =
            await supabase
              .from(
                "course_sessions"
              )
              .select("*", {
                count:
                  "exact",

                head: true,
              })
              .eq(
                "course_id",
                courseId
              );

            const { data: enrollments, error } =
            await supabase
              .from("enrollments")
              .select(`
                student_id,
                profiles (
                  id,
                  full_name
                )
              `)
              .eq("course_id", courseId)
              .eq("status", "active");

console.log(enrollments);
console.log(error);

          const {
            data:
              attendanceRows,
          } =
            await supabase
              .from(
                "attendance"
              )
              .select(`
                student_id,
                status
              `)
              .eq(
                "course_id",
                courseId
              );

          const rows =
            (
              enrollments ||
              []
            ).map(
              (
                enrollment: any
              ) => {
                const attended =
                  (
                    attendanceRows ||
                    []
                  ).filter(
                    (
                      attendance
                    ) =>
                      attendance.student_id ===
                        enrollment.student_id &&
                      [
                        "present",
                        "late",
                        "excused",
                      ].includes(
                        attendance.status
                      )
                  ).length;

                const percentage =
                  !sessionsCount
                    ? 0
                    : Math.round(
                        (
                          attended /
                          sessionsCount
                        ) *
                          100
                      );

                return {
                  id: enrollment.student_id,

                  name:
                    enrollment
                      .profiles
                      ?.full_name ||
                    "Sin nombre",

                  attended,

                  total:
                    sessionsCount ||
                    0,

                  percentage,
                };
              }
            );
console.log("courseId", courseId);

console.log("sessionsCount", sessionsCount);

console.log("enrollments", enrollments);

console.log("attendanceRows", attendanceRows);

console.log("rows", rows);

setStudents(rows);
          setStudents(rows);

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

    const getColor =
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
      <AdminLayout>
        <main className="bg-[#f5f5f5] min-h-screen p-8">

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
                  "Asistencias",
                href:
                  "/admin/attendance",
              },
            ]}
          />

          <PageHeader
            title={
              courseTitle
            }
            description="Detalle de asistencia por estudiante"
          />

          {loading ? (
            <p>
              Cargando...
            </p>
          ) : (
            <div className="space-y-6">

              {students.map(
                (
                  student
                ) => (
                  <Card
                    key={
                      student.id
                    }
                    className="p-6"
                  >
                    <div className="flex justify-between items-center mb-4">

                      <div>
                        <h3 className="font-bold text-xl">
                          {
                            student.name
                          }
                        </h3>

                        <p className="text-gray-500">
                          {
                            student.attended
                          }{" "}
                          de{" "}
                          {
                            student.total
                          }{" "}
                          sesiones
                        </p>
                      </div>

                      <div className="text-3xl font-bold">
                        {
                          student.percentage
                        }
                        %
                      </div>
                    </div>

                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

                      <div
                        className={`h-full ${getColor(
                          student.percentage
                        )}`}
                        style={{
                          width: `${student.percentage}%`,
                        }}
                      />
                    </div>
                  </Card>
                )
              )}

            </div>
          )}
        </main>
      </AdminLayout>
    );
  };

export default AdminAttendanceDetails;