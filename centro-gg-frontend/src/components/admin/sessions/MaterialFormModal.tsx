import {
  useEffect,
  useState,
} from "react";

import Button from "@/components/admin/Button";

import { supabase } from "@/services/supabase";

import MaterialLibraryModal from "./MaterialLibraryModal";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  courseId: string;
  sessionId: string;
};

export default function MaterialFormModal({
  open,
  onClose,
  onSaved,
  courseId,
  sessionId,
}: Props) {
  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    filePath,
    setFilePath,
  ] = useState("");

  const [
    libraryOpen,
    setLibraryOpen,
  ] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setFilePath("");
    }
  }, [open]);

  const saveMaterial =
    async () => {
      if (!title.trim()) {
        alert(
          "Ingrese un título"
        );

        return;
      }

      if (!filePath) {
        alert(
          "Seleccione un archivo"
        );

        return;
      }

      const { error } =
        await supabase
          .from("materials")
          .insert({
            course_id:
              courseId,

            session:
              sessionId,

            title,

            description,

            file_path:
              filePath,

            external_url:
              null,

            kind:
              "document",

            is_downloadable:
              true,

            is_extra_purchase:
              false,

            price: 0,
          });

      if (error) {
        console.error(error);

        return;
      }

      onSaved();

      onClose();
    };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

        <div className="bg-white rounded-3xl p-8 w-[700px]">

          <h2 className="text-2xl font-bold mb-6">
            Nuevo Material
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
              className="w-full border rounded-2xl p-4"
            />

            <textarea
              rows={4}
              placeholder="Descripción"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl p-4"
            />

            <div className="border rounded-2xl p-4">
              <p className="text-sm text-gray-500 mb-2">
                Archivo
              </p>

              <p className="font-medium">
                {filePath ||
                  "Ningún archivo seleccionado"}
              </p>

              <Button
                className="mt-3"
                variant="secondary"
                onClick={() =>
                  setLibraryOpen(
                    true
                  )
                }
              >
                Seleccionar Archivo
              </Button>
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
                saveMaterial
              }
            >
              Guardar
            </Button>

          </div>
        </div>
      </div>

      <MaterialLibraryModal
        open={libraryOpen}
        onClose={() =>
          setLibraryOpen(
            false
          )
        }
        onSelect={
          setFilePath
        }
      />
    </>
  );
}