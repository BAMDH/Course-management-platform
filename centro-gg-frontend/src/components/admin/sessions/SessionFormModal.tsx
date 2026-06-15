import { useEffect, useState } from "react";

import Button from "@/components/admin/Button";

import { supabase } from "@/services/supabase";

type CourseSession = {
  id: string;
  course_id: string;

  title: string;

  description: string | null;

  starts_at: string | null;

  ends_at: string | null;

  session_order: number | null;
};
type Props = {
  open: boolean;

  onClose: () => void;

  onSaved: () => void;

  courseId: string;

  session: CourseSession | null;
};

const SessionFormModal = ({
  open,
  onClose,
  onSaved,
  courseId,
  session,
}: Props) => {
  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    startsAt,
    setStartsAt,
  ] = useState("");

  const [endsAt, setEndsAt] =
    useState("");

  useEffect(() => {
    if (!session) {
      setTitle("");

      setDescription("");

      setStartsAt("");

      setEndsAt("");

      return;
    }

    setTitle(session.title);

    setDescription(
      session.description || ""
    );

    setStartsAt(
      session.starts_at
        ? session.starts_at.slice(
            0,
            16
          )
        : ""
    );

    setEndsAt(
      session.ends_at
        ? session.ends_at.slice(
            0,
            16
          )
        : ""
    );
  }, [session]);

  const handleSave =
    async () => {
      if (!title.trim()) {
        alert(
          "Ingrese un título"
        );

        return;
      }

      try {
        if (session) {
          const { error } =
            await supabase
              .from(
                "course_sessions"
              )
              .update({
                title,

                description,

                starts_at:
                  startsAt ||
                  null,

                ends_at:
                  endsAt || null,
              })
              .eq(
                "id",
                session.id
              );

          if (error)
            throw error;
        } else {
          const { error } =
            await supabase
              .from(
                "course_sessions"
              )
              .insert({
                course_id:
                  courseId,

                title,

                description,

                starts_at:
                  startsAt ||
                  null,

                ends_at:
                  endsAt ||
                  null,
              });

          if (error)
            throw error;
        }

        onSaved();

        onClose();
      } catch (error) {
        console.error(error);

        alert(
          "Error guardando sesión"
        );
      }
    };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">
          {session
            ? "Editar Sesión"
            : "Nueva Sesión"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="w-full p-4 rounded-2xl border"
          />

          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows={4}
            className="w-full p-4 rounded-2xl border"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-sm text-gray-500">
                Inicio
              </p>

              <input
                type="datetime-local"
                value={
                  startsAt
                }
                onChange={(
                  e
                ) =>
                  setStartsAt(
                    e.target.value
                  )
                }
                className="w-full p-4 rounded-2xl border"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">
                Fin
              </p>

              <input
                type="datetime-local"
                value={endsAt}
                onChange={(
                  e
                ) =>
                  setEndsAt(
                    e.target.value
                  )
                }
                className="w-full p-4 rounded-2xl border"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            onClick={
              handleSave
            }
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionFormModal;