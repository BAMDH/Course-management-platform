import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";

import { supabase } from "@/services/supabase";
import { useAuth } from "@/providers/auth/useAuth";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  identification: string | null;
  province: string | null;
  canton: string | null;
  district: string | null;
  exact_address: string | null;
  avatar_url: string | null;
};

export default function TeacherProfile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      setIsLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, email, full_name, phone, identification, province, canton, district, exact_address, avatar_url"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setErrorMessage("No se pudo cargar el perfil.");
      } else {
        setProfile(data);
        setFormData(data ?? {});
      }

      setIsLoading(false);
    }

    void loadProfile();
  }, [user?.id]);

  function handleChange(field: keyof Profile, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    if (!profile?.id) return;

    setIsSaving(true);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        identification: formData.identification,
        province: formData.province,
        canton: formData.canton,
        district: formData.district,
        exact_address: formData.exact_address,
        avatar_url: formData.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      setErrorMessage("No se pudo actualizar el perfil.");
      setIsSaving(false);
      return;
    }

    setProfile((current) =>
      current ? { ...current, ...formData } as Profile : current
    );
    setIsEditing(false);
    setIsSaving(false);
    setMessage("Perfil actualizado correctamente.");
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !profile?.id) return;

    setIsUploading(true);
    setErrorMessage("");

    const fileExtension = file.name.split(".").pop();
    const filePath = `${profile.id}/avatar.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      setErrorMessage(
        "No se pudo subir la imagen. Verificá que exista el bucket 'avatars'."
      );
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    setFormData((current) => ({
      ...current,
      avatar_url: data.publicUrl,
    }));

    setIsUploading(false);
  }

  const avatarUrl = formData.avatar_url || profile?.avatar_url;

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P";

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#dd2817]" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-4 md:space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#1b1c1b]">
            Mi Perfil
          </h1>
          <p className="mt-1 text-sm text-[#5d5e60]">
            Administre su información personal como profesor.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-xl bg-[#dd2817] px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            <Pencil className="h-4 w-4" />
            Editar perfil
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(profile ?? {});
              }}
              className="flex items-center gap-2 rounded-xl bg-[#f5f3f2] px-5 py-3 text-sm font-bold text-[#5d5e60]"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-[#dd2817] px-5 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <section className="grid gap-4 md:gap-8 lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-3xl border border-[#e9e8e7] bg-white shadow-sm">
          <div className="h-28 bg-red-50" />

          <div className="-mt-14 flex flex-col items-center px-6 pb-8">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#f5f3f2] text-2xl font-black text-[#dd2817] shadow-md">
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 rounded-full bg-[#dd2817] p-2 text-white shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <h2 className="mt-4 text-center text-xl font-extrabold text-[#1b1c1b]">
              {profile?.full_name || "Profesor"}
            </h2>

            <p className="mt-1 text-sm font-medium text-[#5d5e60]">
              Portal Profesor
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e9e8e7] bg-white p-4 md:p-8 shadow-sm">
          <h2 className="mb-6 font-['Manrope',sans-serif] text-xl font-extrabold text-[#1b1c1b]">
            Información personal
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              icon={User}
              label="Nombre completo"
              value={formData.full_name ?? ""}
              disabled={!isEditing}
              onChange={(value) => handleChange("full_name", value)}
            />

            <Field
              icon={Mail}
              label="Correo electrónico"
              value={profile?.email ?? ""}
              disabled
              onChange={() => {}}
            />

            <Field
              icon={Phone}
              label="Teléfono"
              value={formData.phone ?? ""}
              disabled={!isEditing}
              onChange={(value) => handleChange("phone", value)}
            />

            <Field
              icon={CreditCard}
              label="Identificación"
              value={formData.identification ?? ""}
              disabled={!isEditing}
              onChange={(value) => handleChange("identification", value)}
            />

            <Field
              icon={MapPin}
              label="Provincia"
              value={formData.province ?? ""}
              disabled={!isEditing}
              onChange={(value) => handleChange("province", value)}
            />

            <Field
              icon={MapPin}
              label="Cantón"
              value={formData.canton ?? ""}
              disabled={!isEditing}
              onChange={(value) => handleChange("canton", value)}
            />

            <Field
              icon={MapPin}
              label="Distrito"
              value={formData.district ?? ""}
              disabled={!isEditing}
              onChange={(value) => handleChange("district", value)}
            />

            <Field
              icon={MapPin}
              label="Dirección exacta"
              value={formData.exact_address ?? ""}
              disabled={!isEditing}
              onChange={(value) => handleChange("exact_address", value)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  disabled,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#5d5e60]">
        <Icon className="h-4 w-4 text-[#dd2817]" />
        {label}
      </span>

      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl bg-[#f5f3f2] px-4 py-3 text-sm font-semibold text-[#1b1c1b] outline-none disabled:text-[#5d5e60]"
      />
    </label>
  );
}
