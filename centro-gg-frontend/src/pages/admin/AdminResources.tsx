import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import AdminLayout from "@/layout/AdminLayout";

import Breadcrumbs from "@/components/admin/navigation/Breadcrumbs";

import PageHeader from "@/components/admin/Headers/PageHeader";

import Card from "@/components/admin/Cards/Card";

import Button from "@/components/admin/Button";

import ImageLibraryModal from "@/components/admin/imageManager/ImageLibraryModal";

import SearchInput from "@/components/admin/ui/SearchInput";

import { supabase } from "@/services/supabase";

type Course = {
  id: string;

  title: string;

  max_capacity: number;

  cover_image_path: string | null;
};

type Teacher = {
  id: string;

  full_name: string;
};

type PendingStudent = {
  enrollmentId: string;

  status: string;

  student: {
    id: string;

    name: string;

    email: string;

    avatar: string;
  };
};

const AdminResources = () => {
  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [showImageLibrary, setShowImageLibrary] =
  useState(false);  
  const [course, setCourse] =
    useState<Course | null>(null);

  const [teacherId, setTeacherId] =
    useState("");

  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  const [students, setStudents] =
    useState<PendingStudent[]>([]);

  const [search, setSearch] =
    useState("");

  const [activeEnrollmentsCount, setActiveEnrollmentsCount] =
  useState(0);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  /*Actualiza la imagen, usa la url publica */
 const handleImageChange = async (
      imagePath: string
    ) => {
      if (!id) return;

      const imageUrl = supabase.storage
        .from("course-images")
        .getPublicUrl(imagePath)
        .data.publicUrl;

      const { error } = await supabase
        .from("courses")
        .update({
          cover_image_path: imageUrl,
        })
        .eq("id", id);

      if (error) {
        console.error(error);
        alert("Error al actualizar imagen");
        return;
      }

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              cover_image_path: imageUrl,
            }
          : null
      );

      setShowImageLibrary(false);

      alert("Imagen actualizada correctamente");
    };

  const fetchData = async () => {
    try {
      setLoading(true);

      // COURSE
      const {
        data: courseData,
        error: courseError,
      } = await supabase
        .from("courses")
        .select(`
          id,
          title,
          max_capacity,
          cover_image_path,

          course_teachers (
            teacher_id
          )
        `)
        .eq("id", id)
        .single();

      if (courseError) {
        console.error(courseError);

        return;
      }

      setCourse({
        id: courseData.id,

        title: courseData.title,

        max_capacity:
          courseData.max_capacity,

        cover_image_path:
          courseData.cover_image_path,
      });

      setTeacherId(
        courseData.course_teachers?.[0]
          ?.teacher_id || ""
      );

     
      // TEACHERS
      const {
        data: roles,
        error: rolesError,
      } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "teacher");

      if (rolesError) {
        console.error(rolesError);
        return;
      }

      const teacherIds = roles.map(
        (item) => item.user_id
      );

      if (!teacherIds.length) {
        setTeachers([]);
        return;
      }

      const {
        data: teachersData,
        error: teachersError,
      } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name
        `)
        .in("id", teacherIds)
        .eq("status", "active");

      if (teachersError) {
        console.error(teachersError);
        return;
      }

      setTeachers(teachersData || []);

        // ACTIVE ENROLLMENTS COUNT
const {
  data: activeEnrollments,
  error: activeEnrollmentsError,
} = await supabase
  .from("enrollments")
  .select(`
    id
  `)
  .eq("course_id", id)
  .eq("status", "active");

if (activeEnrollmentsError) {
  console.error(
    activeEnrollmentsError
  );

  return;
}

setActiveEnrollmentsCount(
  activeEnrollments?.length || 0
);
      // STUDENTS
      const { data, error } =
  await supabase
    .from("enrollments")
    .select(`
      id,
      status,
      student_id
    `)
    .eq("course_id", id)
    .eq("status", "waitlisted");

if (error) {
  console.error(error);

  return;
}

const studentIds =
  data.map(
    (item) => item.student_id
  );

const {
  data: profilesData,
  error: profilesError,
} = await supabase
  .from("profiles")
  .select(`
    id,
    full_name,
    email,
    avatar_url
  `)
  .in("id", studentIds);

if (profilesError) {
  console.error(profilesError);

  return;
}

const formattedStudents =
  data.map((item) => {
    const profile =
      profilesData.find(
        (profile) =>
          profile.id ===
          item.student_id
      );

    return {
      enrollmentId: item.id,

      status: item.status,

      student: {
        id: profile?.id || "",

        name:
          profile?.full_name ??
          "Sin nombre",

        email:
          profile?.email ??
          "Sin correo",

        avatar:
          profile?.avatar_url ??
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile?.full_name ??
              "Usuario"
          )}`,
      },
    };
  });

setStudents(formattedStudents);

      if (error) {
        console.error(error);

        return;
      }

    } finally {
      setLoading(false);
    }
  };

  const updateTeacher =
    async () => {
      if (!id) return;

      // DELETE OLD
      await supabase
        .from("course_teachers")
        .delete()
        .eq("course_id", id);

      // INSERT NEW
      if (teacherId) {
        const { error } =
          await supabase
            .from("course_teachers")
            .insert({
              course_id: id,

              teacher_id: teacherId,
            });

        if (error) {
          console.error(error);

          return;
        }
      }

      alert(
        "Profesor actualizado correctamente"
      );
    };

  const approveStudent =
    async (
      enrollmentId: string
    ) => {
      const confirmAction =
        window.confirm(
          "¿Desea aprobar este estudiante?"
        );

      if (!confirmAction) return;

      const { error } =
        await supabase
          .from("enrollments")
          .update({
            status: "active",
          })
          .eq("id", enrollmentId);

      if (error) {
        console.error(error);

        return;
      }

      fetchData();
    };

  const rejectStudent =
    async (
      enrollmentId: string
    ) => {
      const confirmAction =
        window.confirm(
          "¿Desea rechazar este estudiante?"
        );

      if (!confirmAction) return;

      const { error } =
        await supabase
          .from("enrollments")
          .update({
            status: "cancelled",

            cancelled_at:
              new Date().toISOString(),
          })
          .eq("id", enrollmentId);

      if (error) {
        console.error(error);

        return;
      }

      fetchData();
    };

  const filteredStudents =
    students.filter((item) =>
      [
        item.student.name,
        item.student.email,
      ]
        .join(" ")
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

const handleTeacherChange = async (
  value: string
) => {
  setTeacherId(value);

  if (!id) return;

  try {
  
    const { error: deleteError } =
      await supabase
        .from("course_teachers")
        .delete()
        .eq("course_id", id);

    if (deleteError) {
      console.error(deleteError);

      return;
    }

  
    if (!value) {
      return;
    }


    const { error: insertError } =
      await supabase
        .from("course_teachers")
        .insert({
          course_id: id,

          teacher_id: value,
        });

    if (insertError) {
      console.error(insertError);

      return;
    }

  } catch (error) {
    console.error(error);
  }
};

const availableSlots =
  (course?.max_capacity || 0) -
  activeEnrollmentsCount;

  if (loading || !course) {
    return (
      <AdminLayout>
        <main className="p-8">
          Cargando...
        </main>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="bg-[#f6f6f6] min-h-screen p-8">
        {/* HEADER */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              {
                label:
                  "Administración",
                href: "/admin",
              },

              {
                label:
                  "Gestión de Cursos",
                href:
                  "/admin/courses",
              },

              {
                label:
                  "Asignación Recursos",
                href: `/admin/resources/${course.id}`,
              },
            ]}
          />

          <PageHeader
            title="Asignación de Recursos"
            description="Administre instructores y solicitudes de estudiantes."
          />
        </div>

        <div className="grid xl:grid-cols-[2fr,1fr] gap-8">
          
          
          {/* RIGHT */}
          <Card className="p-6 h-fit">
            <h2 className="text-3xl font-bold mb-6">
              Resumen del Estado
            </h2>

            <img
              src={
                course.cover_image_path ||
                "https://images.unsplash.com/photo-1556911220-bff31c812dba"
              }
              className="rounded-3xl h-52 w-full object-cover"
            />

            <div className="mt-8 space-y-6">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Curso Actual
                </span>

                <span className="font-bold text-right">
                  {course.title}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Disponibilidad
                </span>

                <span className="text-green-600 font-bold">
                  {
                    availableSlots
                  }{" "}
                  Cupos
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Pendientes
                </span>

                <span className="font-bold">
                  {
                    students.length
                  }
                </span>
              </div>
            </div>
          <Button
                className="w-full mt-4"
                onClick={() =>
                  setShowImageLibrary(true)
                }
              >
                Cambiar Imagen
              </Button>
           
          </Card>
          {/* LEFT */}
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-8">
              Configuración
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">
                  Curso
                </p>

                <div className="bg-gray-100 rounded-2xl p-4 font-semibold">
                  {course.title}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">
                  Profesor
                </p>

                <select
                  value={teacherId}
                  onChange={(e) =>
                  handleTeacherChange(
                    e.target.value
                  )
                }
                  className="w-full bg-gray-100 rounded-2xl p-4 border border-gray-200"
                >
                  <option value="">
                    Sin asignar
                  </option>

                  {teachers.map(
                    (teacher) => (
                      <option
                        key={teacher.id}
                        value={
                          teacher.id
                        }
                      >
                        {
                          teacher.full_name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="mt-10">
              <SearchInput
                placeholder="Buscar estudiante..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="mt-8 space-y-4">
              {filteredStudents
                .length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500">
                  No hay estudiantes pendientes
                </div>
              ) : (
                filteredStudents.map(
                  (item) => (
                    <div
                      key={
                        item.enrollmentId
                      }
                      className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.student
                              .avatar
                          }
                          className="w-14 h-14 rounded-full object-cover"
                        />

                        <div>
                          <h3 className="font-bold">
                            {
                              item.student
                                .name
                            }
                          </h3>

                          <p className="text-sm text-gray-400">
                            {
                              item.student
                                .email
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            rejectStudent(
                              item.enrollmentId
                            )
                          }
                          className="border border-gray-200 px-5 py-3 rounded-2xl font-semibold"
                        >
                          Rechazar
                        </button>

                        <button
                          onClick={() =>
                            approveStudent(
                              item.enrollmentId
                            )
                          }
                          className="bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold"
                        >
                          Aprobar
                        </button>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </Card>

        </div>
      </main>
      <ImageLibraryModal
        open={showImageLibrary}
        onClose={() =>
          setShowImageLibrary(false)
        }
        onSelect={handleImageChange}
      />
    </AdminLayout>
  );
};

export default AdminResources;