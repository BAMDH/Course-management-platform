import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/providers/auth/useAuth";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Plus,
  Upload,
  Video,
  X,
} from "lucide-react";
import clsx from "clsx";

import { supabase } from "@/services/supabase";

type MaterialKind = "recipe" | "document" | "video" | "link" | "extra";

type CourseSession = {
  id: string;
  title: string | null;
  starts_at: string | null;
};

type Material = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  kind: MaterialKind;
  file_path: string | null;
  external_url: string | null;
  is_downloadable: boolean | null;
  is_extra_purchase: boolean | null;
  price: number | null;
  published_at: string | null;
  session: string | null;
  course_sessions?: CourseSession | null;
};

type Course = {
  id: string;
  title: string | null;
  level: string | null;
};

type MaterialForm = {
  title: string;
  description: string;
  kind: MaterialKind;
  external_url: string;
  is_downloadable: boolean;
  is_extra_purchase: boolean;
  price: string;
  session: string;
};

const emptyForm: MaterialForm = {
  title: "",
  description: "",
  kind: "document",
  external_url: "",
  is_downloadable: true,
  is_extra_purchase: false,
  price: "",
  session: "",
};

const filters: { label: string; value: "all" | MaterialKind }[] = [
  { label: "Todos", value: "all" },
  { label: "Recetas", value: "recipe" },
  { label: "Documentos", value: "document" },
  { label: "Videos", value: "video" },
  { label: "Links", value: "link" },
  { label: "Extras", value: "extra" },
];

function getMaterialIcon(kind: MaterialKind) {
  if (kind === "recipe") return <BookOpen className="h-6 w-6" />;
  if (kind === "video") return <Video className="h-6 w-6" />;
  if (kind === "link") return <LinkIcon className="h-6 w-6" />;

  return <FileText className="h-6 w-6" />;
}

function getMaterialLabel(kind: MaterialKind) {
  const labels: Record<MaterialKind, string> = {
    recipe: "Receta",
    document: "Documento",
    video: "Video",
    link: "Enlace",
    extra: "Material extra",
  };

  return labels[kind];
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
}

function formatSessionDate(value: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function TeacherMaterials() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedFilter, setSelectedFilter] =
    useState<"all" | MaterialKind>("all");
  const [selectedSessionFilter, setSelectedSessionFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<MaterialForm>(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;

    async function loadMaterials() {
      try {
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("id, title, level")
          .eq("id", courseId)
          .single();

        if (courseError) throw courseError;

        const { data: sessionsData, error: sessionsError } = await supabase
          .from("course_sessions")
          .select("id, title, starts_at")
          .eq("course_id", courseId)
          .order("starts_at", { ascending: true });

        if (sessionsError) throw sessionsError;

        const { data: materialsData, error: materialsError } = await supabase
          .from("materials")
          .select(`
            id,
            course_id,
            title,
            description,
            kind,
            file_path,
            external_url,
            is_downloadable,
            is_extra_purchase,
            price,
            published_at,
            session,
            course_sessions:session (
              id,
              title,
              starts_at
            )
          `)
          .eq("course_id", courseId)
          .order("published_at", { ascending: false });

        if (materialsError) throw materialsError;

        if (isMounted) {
          setCourse(courseData as Course);
          setSessions((sessionsData ?? []) as CourseSession[]);
          setMaterials((materialsData ?? []) as unknown as Material[]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadMaterials();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const filteredMaterials = materials.filter((material) => {
    const matchesKind =
      selectedFilter === "all" || material.kind === selectedFilter;

    const matchesSession =
      selectedSessionFilter === "all" ||
      (selectedSessionFilter === "general" && !material.session) ||
      material.session === selectedSessionFilter;

    return matchesKind && matchesSession;
  });

  function closeModal() {
    setIsModalOpen(false);
    setForm(emptyForm);
    setSelectedFile(null);
  }

  async function openMaterial(material: Material) {
    if (material.external_url) {
      window.open(material.external_url, "_blank");
      return;
    }

    if (!material.file_path) return;

    const { data, error } = await supabase.storage
      .from("course-materials")
      .createSignedUrl(material.file_path, 60 * 10);

    if (error) {
      console.error(error);
      alert("No se pudo abrir el archivo.");
      return;
    }

    window.open(data.signedUrl, "_blank");
  }

  async function handleCreateMaterial() {
    if (!courseId || !user?.id) return;

    if (!form.title.trim()) {
      alert("El título es obligatorio.");
      return;
    }

    if (!form.external_url.trim() && !selectedFile) {
      alert("Debe agregar un archivo o una URL externa.");
      return;
    }

    setSaving(true);

    try {
      let filePath: string | null = null;

      if (selectedFile) {
        const safeFileName = sanitizeFileName(selectedFile.name);
        filePath = `${courseId}/${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("course-materials")
          .upload(filePath, selectedFile, {
            upsert: false,
          });

        if (uploadError) throw uploadError;
      }

      const { data, error } = await supabase
        .from("materials")
        .insert({
          course_id: courseId,
          title: form.title.trim(),
          description: form.description.trim() || null,
          kind: form.kind,
          file_path: filePath,
          external_url: form.external_url.trim() || null,
          is_downloadable: form.is_downloadable,
          is_extra_purchase: form.is_extra_purchase,
          price: form.is_extra_purchase && form.price ? Number(form.price) : 0,
          published_at: new Date().toISOString(),
          created_by: user.id,
          session: form.session || null,
        })
        .select(`
          id,
          course_id,
          title,
          description,
          kind,
          file_path,
          external_url,
          is_downloadable,
          is_extra_purchase,
          price,
          published_at,
          session,
          course_sessions:session (
            id,
            title,
            starts_at
          )
        `)
        .single();

      if (error) throw error;

      setMaterials((currentMaterials) => [
        data as unknown as Material,
        ...currentMaterials,
      ]);

      closeModal();
    } catch (error) {
      console.error(error);
      alert("No se pudo crear el material.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl p-8 font-['Inter',sans-serif]">
      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button
            onClick={() => navigate(`/teacher/courses/${courseId}`)}
            className="mb-3 flex items-center gap-2 text-[#5d5e60] hover:text-[#1b1c1b]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al curso
          </button>

          <h1 className="font-['Manrope',sans-serif] text-4xl font-extrabold text-[#1b1c1b]">
            Materiales del Curso
          </h1>

          <p className="mt-2 text-base text-[#5d5e60]">
            {course?.title ?? "Curso"} {course?.level ? `• ${course.level}` : ""}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#dd2817] px-5 py-4 font-extrabold text-white hover:bg-[#b70700]"
        >
          <Plus className="h-5 w-5" />
          Agregar Material
        </button>
      </header>

      <section className="mb-5 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value)}
            className={clsx(
              "rounded-full px-5 py-2 text-sm font-bold transition-colors",
              selectedFilter === filter.value
                ? "bg-[#dd2817] text-white"
                : "bg-[#f5f3f2] text-[#5d5e60] hover:bg-[#e9e8e7]"
            )}
          >
            {filter.label}
          </button>
        ))}
      </section>

      <section className="mb-8 flex flex-wrap items-center gap-3 rounded-3xl border border-[#e9e8e7] bg-white p-4 shadow-sm">
        <span className="text-sm font-extrabold text-[#1b1c1b]">
          Filtrar por sesión:
        </span>

        <button
          type="button"
          onClick={() => setSelectedSessionFilter("all")}
          className={clsx(
            "rounded-full px-4 py-2 text-xs font-bold transition-colors",
            selectedSessionFilter === "all"
              ? "bg-[#dd2817] text-white"
              : "bg-[#f5f3f2] text-[#5d5e60] hover:bg-[#e9e8e7]"
          )}
        >
          Todas
        </button>

        <button
          type="button"
          onClick={() => setSelectedSessionFilter("general")}
          className={clsx(
            "rounded-full px-4 py-2 text-xs font-bold transition-colors",
            selectedSessionFilter === "general"
              ? "bg-[#dd2817] text-white"
              : "bg-[#f5f3f2] text-[#5d5e60] hover:bg-[#e9e8e7]"
          )}
        >
          Material general
        </button>

        {sessions.map((session) => (
          <button
            key={session.id}
            type="button"
            onClick={() => setSelectedSessionFilter(session.id)}
            className={clsx(
              "rounded-full px-4 py-2 text-xs font-bold transition-colors",
              selectedSessionFilter === session.id
                ? "bg-[#dd2817] text-white"
                : "bg-[#f5f3f2] text-[#5d5e60] hover:bg-[#e9e8e7]"
            )}
          >
            {session.title ?? "Sesión sin título"}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-[#e9e8e7] bg-white p-10 text-center text-[#5d5e60]">
            No hay materiales registrados para este filtro.
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <article
              key={material.id}
              className="flex flex-col justify-between rounded-3xl border border-[#e9e8e7] bg-white p-6 shadow-sm"
            >
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fef2f2] text-[#dd2817]">
                    {getMaterialIcon(material.kind)}
                  </div>

                  <span className="rounded-full bg-[#f5f3f2] px-3 py-1 text-xs font-extrabold uppercase text-[#5d5e60]">
                    {getMaterialLabel(material.kind)}
                  </span>
                </div>

                <h2 className="font-['Manrope',sans-serif] text-xl font-extrabold text-[#1b1c1b]">
                  {material.title}
                </h2>

                <p className="mt-2 min-h-12 text-sm leading-6 text-[#5d5e60]">
                  {material.description ?? "Sin descripción registrada."}
                </p>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-[#dd2817]">
                  <CalendarDays className="h-4 w-4" />
                  {material.course_sessions
                    ? `Sesión: ${material.course_sessions.title ?? "Sin título"} ${
                        material.course_sessions.starts_at
                          ? `• ${formatSessionDate(material.course_sessions.starts_at)}`
                          : ""
                      }`
                    : "Material general del curso"}
                </div>

                {material.file_path && (
                  <p className="mt-3 rounded-xl bg-[#f5f3f2] px-4 py-3 text-xs font-bold text-[#5d5e60]">
                    Archivo cargado en plataforma
                  </p>
                )}

                {material.is_extra_purchase && (
                  <p className="mt-4 rounded-xl bg-[#fff7ed] px-4 py-3 text-sm font-bold text-[#c2410c]">
                    Material extra{" "}
                    {material.price
                      ? `• ₡${Number(material.price).toLocaleString()}`
                      : ""}
                  </p>
                )}
              </div>

              <div className="mt-6">
                {material.file_path || material.external_url ? (
                  <button
                    type="button"
                    onClick={() => void openMaterial(material)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5f3f2] px-4 py-3 text-sm font-extrabold text-[#1b1c1b] hover:bg-[#e9e8e7]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver recurso
                  </button>
                ) : (
                  <button
                    disabled
                    className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#f5f3f2] px-4 py-3 text-sm font-extrabold text-[#858688]"
                  >
                    Recurso no disponible
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between gap-6">
              <div>
                <h2 className="font-['Manrope',sans-serif] text-2xl font-extrabold text-[#1b1c1b]">
                  Agregar Material
                </h2>

                <p className="text-sm text-[#5d5e60]">
                  Cargue documentos, videos, recetas o enlaces para el curso.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-full bg-[#f5f3f2] p-2 text-[#5d5e60] hover:bg-[#e9e8e7]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#1b1c1b]">
                  <CalendarDays className="h-4 w-4 text-[#dd2817]" />
                  Sesión asociada
                </label>

                <select
                  value={form.session}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      session: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#e4e2e1] px-4 py-3"
                >
                  <option value="">Material general del curso</option>

                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title ?? "Sesión sin título"}
                      {session.starts_at
                        ? ` • ${formatSessionDate(session.starts_at)}`
                        : ""}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-[#5d5e60]">
                  Seleccione una sesión para ligar este material a una clase
                  específica.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#1b1c1b]">
                  Título
                </label>

                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      title: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#e4e2e1] px-4 py-3"
                  placeholder="Ej. Guía de masas básicas"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#1b1c1b]">
                  Tipo de material
                </label>

                <select
                  value={form.kind}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      kind: event.target.value as MaterialKind,
                    }))
                  }
                  className="w-full rounded-xl border border-[#e4e2e1] px-4 py-3"
                >
                  <option value="document">Documento</option>
                  <option value="recipe">Receta</option>
                  <option value="video">Video</option>
                  <option value="link">Link</option>
                  <option value="extra">Extra</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#1b1c1b]">
                  Descripción
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      description: event.target.value,
                    }))
                  }
                  className="min-h-28 w-full rounded-xl border border-[#e4e2e1] px-4 py-3"
                  placeholder="Descripción breve del recurso..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#1b1c1b]">
                  Archivo
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#dd2817]/40 bg-[#fef2f2] px-5 py-8 text-center">
                  <Upload className="mb-3 h-8 w-8 text-[#dd2817]" />

                  <span className="font-bold text-[#1b1c1b]">
                    {selectedFile
                      ? selectedFile.name
                      : "Seleccionar documento o video"}
                  </span>

                  <span className="mt-1 text-sm text-[#5d5e60]">
                    PDF, Word, PowerPoint, imágenes o videos
                  </span>

                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.mp4,.mov,.webm"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setSelectedFile(file);
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#1b1c1b]">
                  URL externa
                </label>

                <input
                  value={form.external_url}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      external_url: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#e4e2e1] px-4 py-3"
                  placeholder="https://..."
                />
              </div>

              <label className="flex items-center gap-3 text-sm font-semibold text-[#5d5e60]">
                <input
                  type="checkbox"
                  checked={form.is_downloadable}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      is_downloadable: event.target.checked,
                    }))
                  }
                />
                Permitir descarga
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold text-[#5d5e60]">
                <input
                  type="checkbox"
                  checked={form.is_extra_purchase}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      is_extra_purchase: event.target.checked,
                    }))
                  }
                />
                Material extra con costo
              </label>

              {form.is_extra_purchase && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#1b1c1b]">
                    Precio
                  </label>

                  <input
                    type="number"
                    value={form.price}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        price: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#e4e2e1] px-4 py-3"
                    placeholder="Ej. 5000"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => void handleCreateMaterial()}
                disabled={saving}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#dd2817] px-5 py-4 font-extrabold text-white hover:bg-[#b70700] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar material"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}