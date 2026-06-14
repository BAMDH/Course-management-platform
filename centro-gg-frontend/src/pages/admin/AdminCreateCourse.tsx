import { useEffect, useState } from "react";

import AdminLayout from "@/layout/AdminLayout";

import Card from "@/components/admin/Cards/Card";

import PageHeader from "@/components/admin/Headers/PageHeader";

import Breadcrumbs from "@/components/admin/navigation/Breadcrumbs";

import Button from "@/components/admin/Button";

import FormInput from "@/components/admin/form/FormInput";

import FormTextarea from "@/components/admin/form/FormTextArea";

import LevelSelector from "@/components/admin/form/LevelSelector";

import NumberInput from "@/components/admin/form/NumberInput";

import TeacherSelect from "@/components/admin/form/TeacherSelect";

import { supabase } from "@/services/supabase";
import ImageLibraryModal from "@/components/admin/imageManager/ImageLibraryModal";
import { useNavigate } from "react-router-dom";
  
import {
  GraduationCap,
  MapPin,
  User,
} from "lucide-react";

type Teacher = {
  id: string;

  full_name: string;
};

const levels = [
  "Principiante",
  "Intermedio",
  "Avanzado",
];


const AdminCreateCourse = () => {
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [showImageLibrary, setShowImageLibrary] =
  useState(false);
  const [teachers, setTeachers] = useState<
    Teacher[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Intermedio",
    duration_hours: "",
    requirements: "",
    location: "",
    start_date: "",
    end_date: "",
    max_capacity: 7,
    status: "Pendiente",
    price: "",
    teacher_id: "",
    cover_image_path: "",
    });

  useEffect(() => {
    fetchTeachers();
  }, []);
  const navigate = useNavigate();
 const fetchTeachers = async () => {
  const { data: roles, error: rolesError } =
    await supabase
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

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", teacherIds).eq("status", "active");


  if (error) {
    console.error(error);
    return;
  }

  setTeachers(data || []);
};

 const handleCreateCourse = async () => {
  try {
    setLoading(true);

    const imageUrl = formData.cover_image_path
    ? supabase.storage
        .from("course-images")
        .getPublicUrl(formData.cover_image_path)
        .data.publicUrl
    : null;
    const slug = formData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    const { data: course, error } =
      await supabase
        .from("courses")
        .insert({
          title: formData.title,
          slug,
          description: formData.description,
          category: formData.category,
          level: formData.level,
          duration_hours: Number(formData.duration_hours),
          requirements: formData.requirements,
          location: formData.location,
          start_date: formData.start_date,
          end_date: formData.end_date,
          max_capacity: formData.max_capacity,
          status: formData.status,
          price: Number(formData.price),
          cover_image_path: imageUrl, 
        })
        .select()
        .single();

    if (error) {
      console.log("COURSE ERROR:", error);
      alert(error.message);
      return;
    }

    console.log("COURSE CREATED:", course);

    if (formData.teacher_id) {
      const { data: teacherData, error: teacherError } =
        await supabase
          .from("course_teachers")
          .insert({
            course_id: course.id,
            teacher_id: formData.teacher_id,
          })
          .select();

      console.log("COURSE_TEACHER:", teacherData);

      if (teacherError) {
        console.error(
          "COURSE_TEACHER_ERROR:",
          teacherError
        );
      }
}

    alert("Curso creado correctamente");
    navigate("/admin/courses");
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
  console.log("TEACHERS:", teachers);
  const isFormValid =
  formData.title.trim() !== "" &&
  formData.description.trim() !== "" &&
  formData.category.trim() !== "" &&
  formData.level.trim() !== "" &&
  formData.duration_hours.trim() !== "" &&
  formData.requirements.trim() !== "" &&
  formData.location.trim() !== "" &&
  formData.start_date.trim() !== "" &&
  formData.end_date.trim() !== "" &&
  formData.price.trim() !== "" &&
  formData.teacher_id.trim() !== "";
  return (
    <AdminLayout>
      <main className="bg-[#f6f6f6] min-h-screen p-6">
        {/* HEADER */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              {
                label: "Administración",
                href: "/admin",
              },

              {
                label:
                  "Gestión de Cursos",

                href: "/admin/courses",
              },

              {
                label: "Crear Curso",

                href:
                  "/admin/courses/create",
              },
            ]}
          />

          <PageHeader
            title="Crear Curso"
            description="Configure la información académica y parámetros del nuevo curso."
          />
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_0.75fr] gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            {/* GENERAL */}
            <Card className="p-7 border border-[#e9e4e4] rounded-[28px]">
              <h2 className="text-2xl font-bold mb-8 text-[#202020]">
                Información General
              </h2>

              <div className="space-y-6">
                {/* TITLE */}
                <FormInput
                  label="Nombre del Curso"
                  placeholder="Ej: Maestría en Repostería Francesa"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,

                      title:
                        e.target.value,
                    })
                  }
                />

                {/* DATES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="Fecha de Inicio"
                    type="date"
                    value={
                      formData.start_date
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,

                        start_date:
                          e.target.value,
                      })
                    }
                  />

                  <FormInput
                    label="Fecha de Fin"
                    type="date"
                    value={
                      formData.end_date
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,

                        end_date:
                          e.target.value,
                      })
                    }
                  />
                </div>

                {/* CATEGORY */}
                <FormInput
                  label="Categoría"
                  placeholder="Ej: Gastronomía"
                  value={
                    formData.category
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,

                      category:
                        e.target.value,
                    })
                  }
                />

                {/* DESCRIPTION */}
                <FormTextarea
                  label="Descripción"
                  placeholder="Describe el contenido del curso..."
                  value={
                    formData.description
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,

                      description:
                        e.target.value,
                    })
                  }
                />

                {/* REQUIREMENTS */}
                <FormTextarea
                  label="Requisitos Previos"
                  placeholder="Describe los conocimientos necesarios..."
                  value={
                    formData.requirements
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,

                      requirements:
                        e.target.value,
                    })
                  }
                />
              </div>
            </Card>

            {/* BOTTOM CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TEACHER */}
              <Card className="p-6 rounded-[28px] border border-[#e9e4e4]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <User
                      size={20}
                      className="text-red-600"
                    />
                  </div>

                  <h3 className="text-xl font-bold">
                    Profesor Asignado
                  </h3>
                </div>

                <TeacherSelect
                  teachers={teachers}
                  value={
                    formData.teacher_id
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,

                      teacher_id:
                        e.target.value,
                    })
                  }
                />
              </Card>

              {/* LOCATION */}
              <Card className="p-6 rounded-[28px] border border-[#e9e4e4]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <MapPin
                      size={20}
                      className="text-red-600"
                    />
                  </div>

                  <h3 className="text-xl font-bold">
                    Ubicación
                  </h3>
                </div>

                <FormInput
                  placeholder="Aula o Taller"
                  value={
                    formData.location
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,

                      location:
                        e.target.value,
                    })
                  }
                />
              </Card>
            </div>
          </div>

          {/* RIGHT */}
          <Card className="bg-[#e7e4e4] p-7 rounded-[28px] border-none h-fit">
            <h3 className="text-2xl font-bold mb-8">
              Parámetros
            </h3>

            <div className="space-y-7">
              {/* LEVEL */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap
                    size={18}
                    className="text-gray-500"
                  />

                  <p className="text-sm uppercase tracking-[3px] text-gray-500 font-bold">
                    Nivel
                  </p>
                </div>

                <LevelSelector
                  levels={levels}
                  selected={
                    formData.level
                  }
                  onSelect={(level) =>
                    setFormData({
                      ...formData,

                      level,
                    })
                  }
                />
              </div>

              {/* CAPACITY */}
              <NumberInput
                label="Cupos (Máx 7)"
                value={
                  formData.max_capacity
                }
                onChange={(value) =>
                  setFormData({
                    ...formData,

                    max_capacity:
                      value,
                  })
                }
              />

              {/* DURATION */}
              <FormInput
                label="Duración (Horas)"
                placeholder="Ej: 40"
                value={
                  formData.duration_hours
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,

                    duration_hours:
                      e.target.value,
                  })
                }
              />

              {/* PRICE */}
              <FormInput
                label="Precio"
                placeholder="0.00"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,

                    price:
                      e.target.value,
                  })
                }
              />
              <div>
                    <p className="text-sm uppercase tracking-[3px] text-gray-500 font-bold mb-4">
                      Imagen del Curso
                    </p>

                    {formData.cover_image_path ? (
                      <img
                        src={
                          supabase.storage
                            .from("course-images")
                            .getPublicUrl(
                              formData.cover_image_path
                            ).data.publicUrl
                        }
                        className="w-full h-48 rounded-2xl object-cover mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 rounded-2xl bg-gray-200 flex items-center justify-center mb-4">
                        Sin imagen seleccionada
                      </div>
                    )}

                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() =>
                        setShowImageLibrary(true)
                      }
                    >
                      Seleccionar Imagen
                    </Button>
                  </div>
              

              {/* BUTTON */}
              <Button
                size="lg"
                className="w-full mt-4"
                onClick={handleCreateCourse}
                disabled={loading || !isFormValid}
              >
                {loading
                  ? "Creando..."
                  : "Crear Curso"}
              </Button>
            </div>
          </Card>
        </div>
        
      </main>
      <ImageLibraryModal
      open={showImageLibrary}
      onClose={() => setShowImageLibrary(false)}
      onSelect={(path) =>
        setFormData({
          ...formData,
          cover_image_path: path,
        })
      }
    />
    </AdminLayout>
  );
};

export default AdminCreateCourse; 